from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.services.analytics_service import analytics_service
from app.schemas.analysis_schema import AnalysisResponse

router = APIRouter()

@router.get("/trends", response_model=AnalysisResponse)
def get_health_trends(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Performs Linear Regression on the user's history 
    to determine if health is improving or deteriorating.
    """
    return analytics_service.calculate_trend(db, current_user["email"])