@echo off
echo ========================================
echo   HIMASIF AI Assistant - Setup
echo ========================================
echo.

echo [1/5] Checking Python version...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

echo [2/5] Installing Backend Dependencies...
cd backend
echo Installing Python packages...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    echo Try: pip install --upgrade pip
    pause
    exit /b 1
)
cd ..

echo [3/5] Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 16+ from nodejs.org
    pause
    exit /b 1
)

echo [4/5] Installing Frontend Dependencies...
cd frontend
echo Installing Node.js packages...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    echo Try: npm cache clean --force
    pause
    exit /b 1
)
cd ..

echo [5/5] Setting up Environment Variables...
if not exist .env (
    copy .env.example .env
    echo Created .env file from .env.example
    echo Please edit .env file and add your OpenRouter API key
) else (
    echo .env file already exists
)

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo ✅ Python dependencies installed
echo ✅ Node.js dependencies installed
echo ✅ Environment file created
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo 1. Edit .env file and add your OpenRouter API key:
echo    OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
echo.
echo 2. Get API key from: https://openrouter.ai/keys
echo.
echo 3. Run start-dev.bat to start development servers
echo.
echo 4. Access your application:
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:5173
echo.
echo 📖 For detailed instructions, see:
echo    - INSTALLATION.md
echo    - API_SETUP_GUIDE.md
echo    - README.md
echo.
pause
