@echo off
title HIMASIF AI Assistant - Development Server
color 0A

echo.
echo  ██╗  ██╗██╗███╗   ███╗ █████╗ ███████╗██╗███████╗
echo  ██║  ██║██║████╗ ████║██╔══██╗██╔════╝██║██╔════╝
echo  ███████║██║██╔████╔██║███████║███████╗██║█████╗
echo  ██╔══██║██║██║╚██╔╝██║██╔══██║╚════██║██║██╔══╝
echo  ██║  ██║██║██║ ╚═╝ ██║██║  ██║███████║██║██║
echo  ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝
echo.
echo ========================================
echo   HIMASIF AI Assistant - Development
echo   "We Make IT Happen"
echo ========================================
echo.

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
) else (
    echo ✅ Python is installed
)

echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo [3/4] Checking environment variables...
if not exist .env (
    echo ⚠️  WARNING: .env file not found
    echo Please run setup.bat first or create .env file manually
    echo.
) else (
    echo ✅ Environment file found
)

echo [4/4] Starting development servers...
echo.

echo 🚀 Starting Backend (Flask)...
start "HIMASIF Backend - Flask Server" cmd /k "cd backend && echo Starting Flask server... && python app.py"

timeout /t 3 /nobreak >nul

echo 🚀 Starting Frontend (React + Vite)...
start "HIMASIF Frontend - Vite Dev Server" cmd /k "cd frontend && echo Starting Vite dev server... && npm run dev"

echo.
echo ========================================
echo   🎉 Development servers are starting...
echo ========================================
echo.
echo 🔗 Backend API:  http://localhost:5000
echo 🔗 Frontend:     http://localhost:5173
echo.
echo 📝 Tips:
echo   - Backend logs will appear in the Flask window
echo   - Frontend logs will appear in the Vite window
echo   - Close both windows to stop the servers
echo   - Edit .env file to configure API keys
echo.
echo Press any key to close this launcher...
pause >nul
