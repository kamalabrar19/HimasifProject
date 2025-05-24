# 📦 Installation Guide - 360 AI HIMASIF Assistant

Panduan lengkap untuk menginstall dan menjalankan 360 AI HIMASIF Assistant di komputer Anda.

## 🔧 Prerequisites

### **System Requirements:**
- **Operating System**: Windows 10+, macOS 10.15+, atau Linux Ubuntu 18.04+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 2GB free space
- **Internet**: Stable connection untuk API calls

### **Software Requirements:**
- **Python**: 3.8+ (Recommended: 3.11.7)
- **Node.js**: 16+ (Recommended: 18.19.0)
- **npm**: 8+ (comes with Node.js)
- **Git**: Latest version

## 🚀 Quick Installation

### **Option 1: Automated Setup (Recommended)**

#### Windows:
```bash
# 1. Clone repository
git clone <repository-url>
cd HimasifProject

# 2. Run automated setup
setup.bat

# 3. Configure API key
# Edit .env file and add your OpenRouter API key

# 4. Start development servers
start-dev.bat
```

#### Linux/Mac:
```bash
# 1. Clone repository
git clone <repository-url>
cd HimasifProject

# 2. Make scripts executable and run setup
chmod +x setup.sh start-dev.sh
./setup.sh

# 3. Configure API key
# Edit .env file and add your OpenRouter API key

# 4. Start development servers
./start-dev.sh
```

### **Option 2: Manual Installation**

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd HimasifProject
```

#### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Go back to root directory
cd ..
```

#### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Go back to root directory
cd ..
```

#### Step 4: Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your OpenRouter API key
# OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

#### Step 5: Start Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 🔑 API Key Setup

### **Get OpenRouter API Key:**
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)

### **Configure API Key:**
1. Open `.env` file in root directory
2. Add your API key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```
3. Save the file
4. Restart backend server

## 🌐 Access Application

After successful installation:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🧪 Testing Installation

### **Test Backend:**
```bash
python test_backend.py
```

### **Test Frontend:**
1. Open http://localhost:5173
2. Try asking: "Apa itu HIMASIF?"
3. Should receive a response from 360 AI

## 🔧 Troubleshooting

### **Common Issues:**

#### Python not found:
```bash
# Install Python from python.org
# Or use package manager:
# Windows: winget install Python.Python.3.11
# Mac: brew install python@3.11
# Ubuntu: sudo apt install python3.11
```

#### Node.js not found:
```bash
# Install Node.js from nodejs.org
# Or use package manager:
# Windows: winget install OpenJS.NodeJS
# Mac: brew install node
# Ubuntu: sudo apt install nodejs npm
```

#### Port already in use:
```bash
# Kill processes using ports 5000 or 5173
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -ti:5000 | xargs kill -9
```

#### API Key not working:
1. Check API key format (should start with `sk-or-v1-`)
2. Verify no extra spaces in .env file
3. Restart backend server after adding key
4. Check OpenRouter account has credits

#### Dependencies installation failed:
```bash
# Update pip and npm
pip install --upgrade pip
npm install -g npm@latest

# Clear cache and retry
pip cache purge
npm cache clean --force
```

## 📱 Production Deployment

### **Build for Production:**
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

### **Deploy Backend:**
```bash
# Use gunicorn for production
cd backend
gunicorn -c gunicorn_config.py app:app
```

## 🆘 Getting Help

If you encounter issues:

1. **Check logs** in terminal for error messages
2. **Verify prerequisites** are installed correctly
3. **Test API key** at OpenRouter.ai
4. **Check firewall** settings for ports 5000 and 5173
5. **Review documentation** in README.md and API_SETUP_GUIDE.md

## 📞 Support

For additional support:
- **GitHub Issues**: Create an issue in the repository
- **HIMASIF Contact**: [@himasif360upj](https://www.instagram.com/himasif360upj/)

---

**Happy coding with 360 AI! 🚀**
