#!/bin/bash

echo "========================================"
echo "  HIMASIF AI Assistant - Development"
echo "========================================"
echo

echo "[1/3] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

echo "[2/3] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "[3/3] Starting development servers..."
echo

# Function to cleanup background processes
cleanup() {
    echo "Stopping development servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "Starting Backend (Flask)..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting Frontend (React + Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "========================================"
echo "  Development servers are running..."
echo "========================================"
echo
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
