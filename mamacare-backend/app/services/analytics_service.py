import numpy as np
from sklearn.linear_model import LinearRegression
from sqlalchemy.orm import Session
from app.models.health_record import HealthRecord
from app.schemas.analysis_schema import TrendResult, AnalysisResponse

class AnalyticsService:
    def __init__(self):
        self.model = LinearRegression()

    def calculate_trend(self, db: Session, user_email: str) -> AnalysisResponse:
        """
        Fetches user history and calculates regression slopes for key vitals.
        """
        # 1. Fetch all records for the user, sorted by time
        records = db.query(HealthRecord).filter(
            HealthRecord.user_email == user_email
        ).order_by(HealthRecord.timestamp).all()

        if len(records) < 3:
            return AnalysisResponse(
                trends=[], 
                overall_status="Insufficient data (Need at least 3 records)"
            )

        # 2. Extract Data for Analysis
        # We convert timestamps to "Day numbers" (0, 1, 5, etc.) for regression
        start_time = records[0].timestamp
        days = [(r.timestamp - start_time).days for r in records]
        
        # Reshape X for Scikit-Learn: [[0], [2], [5]...]
        X = np.array(days).reshape(-1, 1)

        trends = []
        
        # 3. Analyze Specific Metrics
        # We track Systolic BP (Risk factor) and Blood Sugar
        metrics_to_analyze = {
            "systolic_bp": [r.systolic_bp for r in records],
            "blood_sugar": [r.blood_sugar for r in records]
        }

        for name, values in metrics_to_analyze.items():
            y = np.array(values)
            
            # Fit Linear Regression
            self.model.fit(X, y)
            slope = self.model.coef_[0]
            
            # Interpret the Slope
            trends.append(self._interpret_slope(name, slope, len(records)))

        return AnalysisResponse(trends=trends, overall_status="Analysis Complete")

    def _interpret_slope(self, metric: str, slope: float, count: int) -> TrendResult:
        """
        Translates a mathematical number into Clinical English.
        """
        status = "Stable"
        
        # Logic: Thresholds for "Significant Change"
        # Example: If BP rises more than 0.5 points per day, it's concerning.
        threshold = 0.5 

        if slope > threshold:
            status = "Increasing (Risk)" if metric == "systolic_bp" else "Rising"
        elif slope < -threshold:
            status = "Decreasing"
        
        return TrendResult(
            metric=metric,
            slope=round(slope, 4),
            interpretation=status,
            data_points=count
        )

# Singleton Instance
analytics_service = AnalyticsService()