from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.wellness import WellnessProgress
from pydantic import BaseModel

router = APIRouter()

class WellnessSyncRequest(BaseModel):
    minutes_added: float = 0.0
    zen_session_added: bool = False

@router.get("/progress")
def get_progress(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    progress = db.query(WellnessProgress).filter(WellnessProgress.user_email == email).first()
    if not progress:
        progress = WellnessProgress(user_email=email, active_minutes=0.0, zen_sessions=0)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return {
        "active_minutes": progress.active_minutes,
        "zen_sessions": progress.zen_sessions
    }

@router.post("/sync")
def sync_progress(data: WellnessSyncRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    email = current_user["email"]
    progress = db.query(WellnessProgress).filter(WellnessProgress.user_email == email).first()
    if not progress:
        progress = WellnessProgress(user_email=email, active_minutes=0.0, zen_sessions=0)
        db.add(progress)
    
    progress.active_minutes += data.minutes_added
    if data.zen_session_added:
        progress.zen_sessions += 1
        
    db.commit()
    db.refresh(progress)
    return {
        "active_minutes": progress.active_minutes,
        "zen_sessions": progress.zen_sessions
    }
