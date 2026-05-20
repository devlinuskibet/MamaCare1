import os
# Fix for Windows PyTorch "WinError 1114" and OpenMP conflicts
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# CRITICAL: Force load Torch BEFORE any other scientific library (numpy, pandas, sklearn)
# This prevents DLL initialization errors on Windows (WinError 1114)
import torch
print(f"Global Init: Torch {torch.__version__} loaded successfully.")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.models import health_record 
from app.api import auth, prediction, health, analysis, admin, reports, user, wellness

# 1. Create Database Tables
Base.metadata.create_all(bind=engine)

# 2. Initialize the App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 3. Configure CORS
# 3. Configure CORS (Updated to allow Vite/React on any port)
app.add_middleware(
    CORSMiddleware,
    # 3b. EXPLICIT ORIGINS (Required for allow_credentials=True)
    allow_origins=[
        "http://localhost:5173",    # Vite Localhost
        "http://127.0.0.1:5173",    # Vite IP
        "http://localhost:3000",    # React fallback
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["ML Inference"])
app.include_router(health.router, prefix="/api/health", tags=["Health Tracking"])
# ADD THIS LINE
app.include_router(analysis.router, prefix="/api/analysis", tags=["Trend Analysis"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin Portal"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(user.router, prefix="/api/user", tags=["User Profile"])
# ADD THIS LINE
from app.api import chatbot
app.include_router(chatbot.router, prefix="/api/chat", tags=["AI Chatbot"])
app.include_router(wellness.router, prefix="/api/wellness", tags=["Wellness Tracking"])

@app.get("/")
def root():
    return {"system": "MamaCare Backend", "status": "active", "version": "1.0.0"}