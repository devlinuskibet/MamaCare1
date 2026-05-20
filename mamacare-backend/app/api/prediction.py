from fastapi import APIRouter, HTTPException, Depends
from app.schemas.prediction_schema import PredictionInput, PredictionOutput
from app.services.ml_service import ml_service
from app.api.auth import get_current_user # To ensure only logged-in users can predict
from datetime import datetime

router = APIRouter()

# Dependency mock (Since we haven't fully linked auth to this yet, we'll keep it simple)
# In production, you would add: user = Depends(get_current_user)

@router.post("/predict", response_model=PredictionOutput)
def predict_risk(data: PredictionInput):
    """
    Accepts health metrics and returns maternal risk classification.
    """
    try:
        # 1. Run Inference by passing the 6 individual arguments
        # This matches our new MLService.predict(age, sbp, dbp, bs, temp, hr) signature
        risk, confidence = ml_service.predict(
            data.Age,
            data.SystolicBP,
            data.DiastolicBP,
            data.BS,
            data.BodyTemp,
            data.HeartRate
            
        )

        # 2. Return JSON response
        return {
            "risk_level": risk,
            "confidence_score": round(confidence, 2),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        # If the model or scaler fails, we catch it here
        print(f"[API ERROR] Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Internal ML Service Error")