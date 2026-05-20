from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class WellnessProgress(Base):
    __tablename__ = "wellness_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("users.email"), index=True)
    active_minutes = Column(Float, default=0.0)
    zen_sessions = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
