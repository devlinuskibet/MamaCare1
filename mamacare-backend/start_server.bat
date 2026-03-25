@echo off
echo Starting MamaCare Backend (Stable)...
.\venv_fix\Scripts\python.exe -m uvicorn app.main:app
pause
