from sqlalchemy import Column, Integer, String, Boolean, Date
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String) # "mother" or "provider"
    
    # Profile Extensions
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    hospital_name = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    gestation_weeks = Column(Integer, nullable=True)
    lmp = Column(Date, nullable=True)
