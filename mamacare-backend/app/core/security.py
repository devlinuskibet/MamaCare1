from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# 1. Password Hashing Configuration
# Using pbkdf2_sha256 to avoid Windows binary dependency issues with bcrypt/argon2
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Checks if the typed password matches the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Converts a plain password into a secure hash."""
    return pwd_context.hash(password)

# 2. JWT Token Creation
def create_access_token(subject: Union[str, Any], role: str) -> str:
    """
    Generates a JWT token containing the User ID and their Role.
    Expires after the time defined in settings.
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # The "payload" is the data inside the token
    to_encode = {
        "exp": expire, 
        "sub": str(subject), # Subject (usually User ID or Email)
        "role": role         # The User's Role (mother/provider)
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt