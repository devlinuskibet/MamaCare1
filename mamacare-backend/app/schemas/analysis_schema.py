from pydantic import BaseModel
from typing import List, Optional

class TrendResult(BaseModel):
    metric: str           # e.g., "SystolicBP"
    slope: float          # The calculated slope
    interpretation: str   # "Improving", "Deteriorating", "Stable"
    data_points: int      # How many records were used

class AnalysisResponse(BaseModel):
    trends: List[TrendResult]
    overall_status: str   # Summary of her health