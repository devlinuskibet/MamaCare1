from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import datetime

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    location: Optional[str] = None
    emergency_contact: Optional[str] = None
    hospital_name: Optional[str] = None
    specialization: Optional[str] = None
    gestation_weeks: Optional[int] = None
    full_name: Optional[str] = None
    lmp: Optional[datetime.date] = None

    # Required Clinical Baselines
    age: Optional[int] = None
    gravida: Optional[int] = None
    parity: Optional[int] = None
    living_children: Optional[int] = None
    blood_group: Optional[str] = None
    height_cm: Optional[float] = None
    pre_pregnancy_weight_kg: Optional[float] = None
    
    # Medical History Flags
    has_diabetes: Optional[bool] = None
    has_hypertension: Optional[bool] = None
    has_asthma: Optional[bool] = None
    has_epilepsy: Optional[bool] = None
    prev_csection: Optional[bool] = None
    
    # Gatekeeper Flag
    is_profile_complete: Optional[bool] = None
    has_consented: Optional[bool] = None

@router.get("/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns the fully hydrated User profile extending DB columns.
    """
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    days_pregnant = None
    current_week = None
    trimester = None
    
    if user.lmp:
        days_pregnant = (datetime.date.today() - user.lmp).days
        current_week = days_pregnant // 7
        if current_week <= 12:
            trimester = 1
        elif current_week <= 26:
            trimester = 2
        else:
            trimester = 3

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "emergency_contact": user.emergency_contact,
        "hospital_name": user.hospital_name,
        "specialization": user.specialization,
        "gestation_weeks": user.gestation_weeks,
        "lmp": user.lmp,
        "days_pregnant": days_pregnant,
        "current_week": current_week,
        "trimester": trimester,
        "age": user.age,
        "gravida": user.gravida,
        "parity": user.parity,
        "living_children": user.living_children,
        "blood_group": user.blood_group,
        "height_cm": user.height_cm,
        "pre_pregnancy_weight_kg": user.pre_pregnancy_weight_kg,
        "has_diabetes": user.has_diabetes,
        "has_hypertension": user.has_hypertension,
        "has_asthma": user.has_asthma,
        "has_epilepsy": user.has_epilepsy,
        "prev_csection": user.prev_csection,
        "is_profile_complete": user.is_profile_complete,
        "has_consented": user.has_consented
    }

@router.put("/update")
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Updates optional profile fields dynamically based on the provided JSON payload.
    """
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile updated successfully"}
