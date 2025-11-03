@echo off
REM HR Insights Python ML Setup Script for Windows

echo ========================================
echo HR Insights - Python ML Setup
echo ========================================
echo.

REM Check Python installation
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed!
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
)

python --version
echo.

REM Check pip
echo Checking pip installation...
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: pip is not installed!
    pause
    exit /b 1
)

python -m pip --version
echo.

REM Install dependencies
echo Installing Python dependencies...
python -m pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Convert data
echo Converting employee data to CSV...
python convert_data.py

if %errorlevel% neq 0 (
    echo Error: Failed to convert data
    pause
    exit /b 1
)

echo.
echo ✅ Data converted successfully!
echo.

REM Train model
echo Training ML model...
echo This may take a few minutes...
python train_model.py

if %errorlevel% neq 0 (
    echo Error: Failed to train model
    pause
    exit /b 1
)

echo.
echo ✅ Model trained successfully!
echo.

REM Test model
echo Testing model...
python test_model.py

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now start the API server:
echo   python api_server.py
echo.
echo API will be available at:
echo   http://localhost:5000
echo.
echo ========================================
echo.
pause
