# MamaCare Backend

This is the backend for the MamaCare application, built with FastAPI.

## Structure

- `app`: Main application code.
- `ml_models`: Machine learning models.
- `requirements.txt`: Python dependencies.

## Setup & Run

1. **Activate Environment** (if not already active):
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

2. **Run Server**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

3. **Access API**:
   - Docs: `http://localhost:8000/docs`
   - Root: `http://localhost:8000/`




**Alternative if that doesnt work,try**
MamaCare Backend

MamaCare Backend is a FastAPI-based maternal health system that provides:

User authentication with JWT

Maternal risk prediction using machine learning

Health record tracking

Trend analysis

AI-powered chatbot with RAG support

SQLite database integration

Tech Stack

Python 3.11

FastAPI

Uvicorn

PyTorch

Scikit-learn

SQLite

OpenAI API

Pinecone

Sentence Transformers

Project Structure
mamacare-backend/
│
├── app/                  # Main FastAPI application
├── ml_models/            # Trained ML models
├── knowledge_base/       # RAG knowledge data
├── scripts/              # Utility scripts
├── venv_fix/             # Virtual environment
├── .env                  # Environment configuration
├── requirements.txt
├── setup_fix.bat
├── start_server.bat
└── README.md
First Time Setup

Only required once per machine.

1. Navigate to backend folder
cd C:\Users\linzs\OneDrive\Desktop\MamaCare\mamacare-backend
2. Allow script execution for this session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
3. Run setup
.\setup_fix.bat

This will:

Create venv_fix

Install all dependencies

Install CPU-only PyTorch

Prepare the environment

Normal Restart Procedure

If you stopped the backend and want to start it again later, follow these steps.

1. Open PowerShell
2. Navigate to backend folder
cd C:\Users\linzs\OneDrive\Desktop\MamaCare\mamacare-backend
3. Allow script execution
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
4. Activate virtual environment
.\venv_fix\Scripts\Activate.ps1

You should see:

(venv_fix) PS C:\...\mamacare-backend>
5. Start the server
python -m uvicorn app.main:app --reload
Access the API

Once running, open:

API Docs
http://localhost:8000/docs

Root Endpoint
http://localhost:8000/

Available Features
Authentication

POST /api/auth/signup

POST /api/auth/login

ML Risk Prediction

POST /api/prediction/predict

Health Tracking

POST /api/health/add

GET /api/health/history

Trend Analysis

GET /api/analysis/trends

AI Chatbot

POST /api/chat/chat

How to Stop the Server

Press:

CTRL + C

Then close the terminal.

When to Run setup_fix.bat Again

Run setup again only if:

venv_fix folder was deleted

Dependencies are missing

You moved the project to a new computer

Python was reinstalled

Environment Configuration

The .env file includes:

Database configuration

JWT secret keys

OpenAI API key

Pinecone configuration

Ensure valid API keys are present before using chatbot features.

Database

SQLite database file: mamacare.db

Auto-creates tables on first run

Notes

Python 3.11 is required

CPU-only PyTorch is installed to reduce setup size

Server runs on port 8000 by default