@echo off
echo ==========================================
echo  MamaCare Backend Setup (Python 3.11 Fix)
echo ==========================================

set PYTHON_PATH="C:\Users\linzs\AppData\Local\Programs\Python\Python311\python.exe"
set VENV_NAME=venv_fix

echo [1/4] Checking for Python 3.11...
if not exist %PYTHON_PATH% (
    echo ERROR: Python 3.11 not found at %PYTHON_PATH%
    echo Please ensure Python 3.11 is installed.
    pause
    exit /b 1
)
echo Found Python 3.11!

echo [2/4] Creating new virtual environment (%VENV_NAME%)...
%PYTHON_PATH% -m venv %VENV_NAME%

echo [3/4] Installing dependencies...
.\%VENV_NAME%\Scripts\python.exe -m pip install --upgrade pip

echo Installing CPU-only Torch FIRST to avoid large download...
.\%VENV_NAME%\Scripts\python.exe -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

echo Installing remaining requirements...
.\%VENV_NAME%\Scripts\python.exe -m pip install -r requirements.txt

echo [4/4] Setup Complete!
echo ==========================================
echo To start the server, run:
echo start_server.bat
echo ==========================================
pause
