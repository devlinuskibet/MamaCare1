from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminPatientCreate(BaseModel):
    # Required Basics
    full_name: str
    email: EmailStr
    age: int
    blood_group: str
    
    # Obstetric Baselines
    gravida: int
    parity: int
    living_children: int
    
    # Vitals / Physical
    height_cm: Optional[float] = None
    pre_pregnancy_weight_kg: Optional[float] = None
    
    # Optional Initial Vitals (Trigger ML)
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    blood_sugar: Optional[float] = None
    body_temp: Optional[float] = None
    heart_rate: Optional[float] = None

class AdminPatientResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    message: str
    bmi: Optional[float]
    obstetric_shorthand: str
    risk_prediction: Optional[str]
