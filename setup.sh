#!/bin/bash

echo "========================================"
echo "  HIMASIF AI Assistant - Setup"
echo "========================================"
echo

echo "[1/4] Installing Backend Dependencies..."
cd backend
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi
cd ..

echo "[2/4] Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node.js dependencies"
    exit 1
fi
cd ..

echo "[3/4] Setting up Environment Variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example"
    echo "Please edit .env file and add your OpenRouter API key"
else
    echo ".env file already exists"
fi

echo "[4/4] Setup Complete!"
echo
echo "========================================"
echo "  Next Steps:"
echo "========================================"
echo "1. Edit .env file and add your OpenRouter API key"
echo "2. Run ./start-dev.sh to start development servers"
echo
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo

# Make scripts executable
chmod +x start-dev.sh
chmod +x setup.sh

echo "Scripts made executable"
