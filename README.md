# 360 AI - HIMASIF Assistant

Modern minimalist AI chatbot untuk HIMASIF (Himpunan Mahasiswa Sistem Informasi) Universitas Pembangunan Jaya yang dibangun dengan React dan Flask.

## ✨ Features

- **🤖 AI-Powered Responses**: Menggunakan OpenRouter API dengan model DeepSeek
- **📚 HIMASIF Knowledge Base**: Informasi lengkap tentang struktur organisasi, kegiatan, dan FAQ
- **🎨 Modern Minimalist Design**: UI yang clean dan professional seperti ChatGPT
- **📱 Mobile Responsive**: Optimized untuk semua ukuran layar
- **⚡ Real-time Chat**: Chat yang smooth dengan typing indicators
- **🔄 Fallback AI**: Tetap bisa menjawab pertanyaan HIMASIF tanpa API key

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI Framework
- **Vite 6.3.5** - Build tool dan dev server
- **Modern CSS** - Minimalist design dengan CSS variables
- **System Fonts** - Clean typography

### Backend
- **Flask 2.3.3** - Python web framework
- **OpenRouter API** - AI model integration (opsional)
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - Production WSGI server

## 🚀 Quick Start

### Prerequisites
- **Python**: 3.8+ (Recommended: 3.11.7)
- **Node.js**: 16+ (Recommended: 18.19.0)
- **npm**: 8+ (comes with Node.js)
- **Git**: Latest version
- **OpenRouter API Key**: For AI functionality (optional for HIMASIF-only features)

### 1. Clone Repository
```bash
git clone <repository-url>
cd HimasifProject
```

### 2. Check Requirements (Optional)
```bash
python check-requirements.py
```

### 3. Automated Setup (Recommended)
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh && ./setup.sh
```

### 4. Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### Frontend Setup
```bash
cd frontend
npm install
cd ..
```

#### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenRouter API key (optional)
# OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### 5. Start Development Servers
```bash
# Automated (Recommended)
# Windows: start-dev.bat
# Linux/Mac: ./start-dev.sh

# Manual
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔑 API Key Setup (Optional)

Untuk pengalaman AI yang lebih pintar seperti ChatGPT:

1. **Daftar di OpenRouter**: [openrouter.ai](https://openrouter.ai)
2. **Dapatkan API key**: [openrouter.ai/keys](https://openrouter.ai/keys)
3. **Edit file `.env`**:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   ```
4. **Restart backend server**

**Catatan**: Chatbot tetap berfungsi tanpa API key untuk pertanyaan HIMASIF!

## 📁 Project Structure

```
HimasifProject/
├── 📁 backend/                 # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── gunicorn_config.py     # Production configuration
│   └── Procfile              # Deployment configuration
├── 📁 frontend/               # React frontend
│   ├── 📁 src/
│   │   ├── App.jsx           # Main chat component
│   │   ├── App.css           # Modern minimalist styling
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite configuration
├── 📁 static/
│   └── 📁 data/
│       └── himasif_data.json # HIMASIF knowledge base
├── 📄 requirements.txt        # Root Python dependencies
├── 📄 .env.example           # Environment template
├── 📄 setup.bat/.sh          # Setup scripts
├── 📄 start-dev.bat/.sh      # Development scripts
├── 📄 check-requirements.py  # Requirements checker
├── 📄 INSTALLATION.md        # Detailed installation guide
├── 📄 API_SETUP_GUIDE.md     # API setup guide
├── 📄 DEPLOYMENT.md          # Deployment guide
└── 📄 README.md              # This file
```

## 🎯 Usage Examples

### Without API Key (HIMASIF Features)
- "Apa itu HIMASIF?"
- "Siapa ketua umum HIMASIF?"
- "Kegiatan apa saja di HIMASIF?"
- "Bagaimana cara bergabung dengan HIMASIF?"

### With API Key (Full AI Features)
- "Jelaskan tentang Python programming"
- "Bagaimana cara membuat website?"
- "Apa itu machine learning?"
- "Buatkan kode HTML sederhana"
- "Jelaskan perbedaan React dan Vue"

## 🧪 Testing

### Test Backend
```bash
python test_backend.py
```

### Test Requirements
```bash
python check-requirements.py
```

## 🚀 Deployment

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# Deploy backend with Gunicorn
cd backend
gunicorn -c gunicorn_config.py app:app
```

### Deployment Platforms
- **Heroku**: Ready with Procfile and runtime.txt
- **Vercel**: Frontend deployment ready
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment
- **Docker**: Containerized deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📊 HIMASIF Data

Knowledge base mencakup:
- **Organisasi**: Visi, misi, struktur lengkap
- **Pengurus**: BPH, Departemen PSDM & Relasi, 7 divisi
- **Anggota**: 15+ data pengurus dengan jabatan
- **Kegiatan**: Seminar, Workshop, Kunjungan Industri
- **FAQ**: 15+ pertanyaan umum dengan jawaban
- **Kontak**: Social media dan informasi kontak

## 🎨 Design System

### Color Palette (Modern Minimalist)
- **Primary**: `#1a365d` (Dark blue)
- **Accent**: `#3182ce` (Blue)
- **Background**: `#f7fafc` (Light gray)
- **Text**: `#2d3748` (Dark gray)

### Typography
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Weights**: 400, 500, 600

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License.

## 👥 Team

**HIMASIF UPJ** - Himpunan Mahasiswa Sistem Informasi
- Instagram: [@himasif360upj](https://www.instagram.com/himasif360upj/)
- YouTube: [Sistem Informasi UPJ](https://www.youtube.com/@sisteminformasiupj8380)

## 📞 Support

- **Documentation**: INSTALLATION.md, API_SETUP_GUIDE.md, DEPLOYMENT.md
- **Issues**: Create an issue in this repository
- **Contact**: [@himasif360upj](https://www.instagram.com/himasif360upj/)

---

**"We Make IT Happen"** - HIMASIF UPJ

Made with ❤️ by HIMASIF UPJ