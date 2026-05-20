from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

# 1. Schema for Registering (Input)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str  # "mother" or "provider"
    lmp: Optional[date] = None

# 2. Schema for Logging In (Input)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 3. Schema for the Token Response (Output)
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_name: str
    is_profile_complete: Optional[bool] = False
    has_consented: Optional[bool] = False

# 4. Schema for displaying User Info (Output - No password included!)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str