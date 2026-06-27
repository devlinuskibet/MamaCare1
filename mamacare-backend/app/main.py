import os

# Fix for Windows PyTorch / OpenMP conflicts
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# -----------------------------
# Safe Torch initialization
# -----------------------------
torch = None

try:
    import torch
    print(f"Torch loaded: {torch.__version__}")
except Exception as e:
    print(f"Torch not loaded at startup: {e}")

# -----------------------------
# FastAPI imports
# -----------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base

from app.models import health_record

from app.api import (
    auth,
    prediction,
    health,
    analysis,
    admin,
    reports,
    user,
    wellness,
)

from app.api import chatbot

# -----------------------------
# FastAPI app initialization
# -----------------------------
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# -----------------------------
# Database initialization
# -----------------------------
@app.on_event("startup")
def startup():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"DB init failed: {e}")

# -----------------------------
# CORS configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://mother-gules.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# API Routes
# -----------------------------
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["ML Inference"])
app.include_router(health.router, prefix="/api/health", tags=["Health Tracking"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Trend Analysis"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin Portal"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(user.router, prefix="/api/user", tags=["User Profile"])
app.include_router(chatbot.router, prefix="/api/chat", tags=["AI Chatbot"])
app.include_router(wellness.router, prefix="/api/wellness", tags=["Wellness Tracking"])

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
def root():
    return {
        "system": "MamaCare Backend",
        "status": "active",
        "version": "1.0.0"
    }