from sqlalchemy import Column, Integer, String, Boolean, Date, Float
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, index=True)
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

    # Required Clinical Baselines
    age = Column(Integer, nullable=True)
    gravida = Column(Integer, nullable=True)
    parity = Column(Integer, nullable=True)
    living_children = Column(Integer, nullable=True)
    blood_group = Column(String, nullable=True)
    height_cm = Column(Float, nullable=True)
    pre_pregnancy_weight_kg = Column(Float, nullable=True)
    
    # Medical History Flags
    has_diabetes = Column(Boolean, default=False)
    has_hypertension = Column(Boolean, default=False)
    has_asthma = Column(Boolean, default=False)
    has_epilepsy = Column(Boolean, default=False)
    prev_csection = Column(Boolean, default=False)
    
    # Gatekeeper Flag
    is_profile_complete = Column(Boolean, default=False)
    has_consented = Column(Boolean, default=False)
