from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    # Link to the user (Mother) who owns this record
    # In a full implementation, this would link to a User table
    user_email = Column(String, index=True) 
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Vital Signs
    systolic_bp = Column(Integer)
    diastolic_bp = Column(Integer)
    blood_sugar = Column(Float)
    body_temp = Column(Float)
    heart_rate = Column(Integer)
    
    # Calculated Risk (We store the result of the ML model here)
    risk_prediction = Column(String) 
    confidence_score = Column(Float)
    
    # Triage Lifecycle
    is_resolved = Column(Boolean, default=False)