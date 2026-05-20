from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from pydantic import BaseModel
from app.schemas.user_schema import UserCreate, UserLogin, Token, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.services import otp_service

router = APIRouter()

# This tells FastAPI that the token comes from the "/api/auth/login" endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    The Gatekeeper Function:
    1. Takes the token from the request header.
    2. Decodes it using the SECRET_KEY.
    3. If valid, returns the user info.
    4. If invalid, throws a 401 Unauthorized error.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Verify user still exists in DB
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
        
    return {"email": user.email, "role": user.role, "id": user.id}


@router.post("/signup", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        role=user_in.role,
        lmp=user_in.lmp
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    Step 1 of 2FA: Verify credentials, send OTP. Returns requires_otp: true.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Send OTP instead of JWT
    try:
        otp_service.generate_and_send(user.email)
    except Exception as e:
        print(f"[OTP Send Error] {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Check SMTP credentials.")

    return {"requires_otp": True, "email": user.email}


# --- Google OAuth ---
class GoogleTokenRequest(BaseModel):
    id_token: str

@router.post("/google")
def google_login(payload: GoogleTokenRequest, db: Session = Depends(get_db)):
    """
    Verify Google id_token, auto-provision user, then trigger OTP.
    """
    try:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests
        idinfo = google_id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {e}")

    email = idinfo.get("email")
    name = idinfo.get("name", email)
    if not email:
        raise HTTPException(status_code=400, detail="Could not extract email from Google token")

    # Auto-provision if user doesn't exist
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            hashed_password="google_oauth_no_password",
            full_name=name,
            role="mother",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Trigger OTP
    try:
        otp_service.generate_and_send(email)
    except Exception as e:
        print(f"[OTP Send Error] {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email.")

    return {"requires_otp": True, "email": email}


# --- Resend OTP ---
class ResendOTPRequest(BaseModel):
    email: str

@router.post("/resend-otp")
def resend_otp(payload: ResendOTPRequest, db: Session = Depends(get_db)):
    """Regenerate and resend OTP for an existing user."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    try:
        otp_service.generate_and_send(payload.email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resend OTP: {e}")
    return {"message": "OTP resent successfully."}
class OTPVerifyRequest(BaseModel):
    email: str
    otp_code: str

@router.post("/verify-otp")
def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    """
    Step 2 of 2FA: Verify OTP and issue the final JWT.
    """
    if not otp_service.verify(payload.email, payload.otp_code):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code.")

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    access_token = create_access_token(subject=user.email, role=user.role)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_name": user.full_name,
        "is_profile_complete": user.is_profile_complete,
        "has_consented": user.has_consented
    }