from pydantic import BaseModel, Field

class PredictionInput(BaseModel):
    # Field(...) adds metadata for documentation
    Age: int = Field(..., example=25, description="Age in years")
    SystolicBP: int = Field(..., example=120, description="Upper blood pressure")
    DiastolicBP: int = Field(..., example=80, description="Lower blood pressure")
    BS: float = Field(..., example=7.5, description="Blood glucose levels")
    BodyTemp: float = Field(..., example=98.0, description="Body temperature in F")
    HeartRate: int = Field(..., example=70, description="Resting heart rate")

class PredictionOutput(BaseModel):
    risk_level: str
    confidence_score: float
    timestamp: str  
    