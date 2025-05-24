@echo off
title HIMASIF AI Assistant - Backend Restart
color 0A

echo.
echo ========================================
echo   HIMASIF AI Assistant - Backend Restart
echo ========================================
echo.

echo [1/3] Installing missing dependencies...
cd backend
pip install python-dotenv==1.0.0
if %errorlevel% neq 0 (
    echo ❌ Failed to install python-dotenv
    pause
    exit /b 1
) else (
    echo ✅ python-dotenv installed successfully
)

echo.
echo [2/3] Checking .env file...
cd ..
if exist .env (
    echo ✅ .env file found
    echo 📝 API Key configured in .env
) else (
    echo ❌ .env file not found!
    echo Please create .env file with your OpenRouter API key
    pause
    exit /b 1
)

echo.
echo [3/3] Starting backend server...
echo 🚀 Starting Flask server with API key support...
echo.
echo ========================================
echo   Backend Server Starting...
echo ========================================
echo.
echo 💡 Look for these messages in the log:
echo    ✅ OpenRouter API Key configured: Yes
echo    🤖 AI Model: deepseek/deepseek-r1-distill-llama-70b:free
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd backend
python app.py

pause
