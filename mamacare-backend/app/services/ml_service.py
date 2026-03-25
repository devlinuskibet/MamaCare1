import os
import pandas as pd
import joblib
import numpy as np

# Fix for Windows ML DLL errors
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

class MLService:
    def __init__(self):
        # Update paths to match your new V2 files
        self.model_path = "ml_models/mama_model_v2.joblib"
        self.scaler_path = "ml_models/scaler_v2.joblib"
        self.model = None
        self.scaler = None
        self.load_artifacts()

    def load_artifacts(self):
        """Loads both the model and the scaler from disk."""
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            print("[INFO] V2 Model and Scaler loaded successfully.")
        else:
            print(f"[WARN] ML Artifacts missing. Check {self.model_path} and {self.scaler_path}")

    def predict(self, age, sbp, dbp, bs, temp, hr):
        """
        Runs inference on maternal vitals.
        Order must match Kaggle training: Age, SBP, DBP, BS, Temp, HR
        """
        if not self.model or not self.scaler:
            return "Error: Model/Scaler not loaded", 0.0

        # 1. Create DataFrame with EXACT names used in Kaggle training
        # This prevents the 'feature names' warning and ensures accuracy
        feature_names = ["Age", "Systolic BP", "Diastolic", "BS", "Body Temp", "Heart Rate"]
        input_df = pd.DataFrame([[age, sbp, dbp, bs, temp, hr]], columns=feature_names)
        
        # 2. Scale the input using the saved scaler
        try:
            scaled_features = self.scaler.transform(input_df)
            
            # 3. Get prediction and confidence
            prediction_idx = self.model.predict(scaled_features)[0]
            probabilities = self.model.predict_proba(scaled_features)[0]
            confidence = np.max(probabilities)

            # 4. Map numeric output to clinical labels
            risk_map = {0.0: "Low Risk", 1.0: "Mid Risk", 2.0: "High Risk"}
            risk_label = risk_map.get(float(prediction_idx), "Unknown")

            return risk_label, float(confidence)
            
        except Exception as e:
            print(f"[ERROR] Inference failed: {e}")
            return "Inference Error", 0.0

# Create a single instance to be imported elsewhere
ml_service = MLService()