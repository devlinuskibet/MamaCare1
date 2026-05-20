import joblib
import sys

try:
    scaler = joblib.load('ml_models/scaler_v2.joblib')
    print(f"Scaler expects exactly {scaler.n_features_in_} features.")
    
    if hasattr(scaler, 'feature_names_in_'):
        features = list(scaler.feature_names_in_)
        print("SCALER_FEATURES:", features)
    else:
        print("SCALER_FEATURES: Not Available (Fitted without names)")
        
    model = joblib.load('ml_models/mama_model_v2.joblib')
    if hasattr(model, 'feature_names_in_'):
        print("MODEL_FEATURES:", list(model.feature_names_in_))
        
except Exception as e:
    print(f"Error loading artifacts: {e}")
    sys.exit(1)
