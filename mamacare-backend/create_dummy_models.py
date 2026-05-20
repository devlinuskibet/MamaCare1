import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import numpy as np
import os

os.makedirs("ml_models", exist_ok=True)

# Create dummy model
model = LogisticRegression()
# Fit on tiny dummy dataset so it's formally "fitted"
X = np.array([[1, 2, 3, 4, 5, 6, 7], [7, 6, 5, 4, 3, 2, 1]])
y = np.array([0, 1])
model.fit(X, y)

# Create dummy scaler
scaler = StandardScaler()
scaler.fit(X)

joblib.dump(model, "ml_models/mama_model_v2.joblib")
joblib.dump(scaler, "ml_models/scaler_v2.joblib")

print("Created dummy ML artifacts in ml_models/")
