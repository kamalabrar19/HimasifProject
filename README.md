# 360 AI - HIMASIF Assistant

Modern minimalist AI chatbot untuk HIMASIF (Himpunan Mahasiswa Sistem Informasi) Universitas Pembangunan Jaya yang dibangun dengan React dan Flask.

## ✨ Features

- **🔐 Login dengan Google** : Menggunakan Firebase Authentication
- **🤖 AI-Powered Responses**: Menggunakan OpenRouter API dengan model DeepSeek
- **📚 HIMASIF Knowledge Base**: Informasi lengkap tentang struktur organisasi, kegiatan, dan FAQ
- **🎨 Modern Minimalist Design**: UI yang modern dan professional =
- **📱 Mobile Responsive**: Optimized untuk semua ukuran layar
- **⚡ Real-time Chat**: Chat yang smooth dengan typing indicators
- **🔄 Fallback AI**: Tetap bisa menjawab pertanyaan HIMASIF tanpa API key
- **🌗 Toggle dark mode / light mode** : Dapa menyesuaikan mood pengguna

## 🛠️ Tech Stack

| Layer    | Teknologi                           |
| -------- | ----------------------------------- |
| Frontend | React + Vite, Context API, Tailwind |
| Backend  | Flask, Flask-CORS                   |
| Auth     | Firebase Authentication             |
| AI       | OpenRouter API                      |
| Data     | JSON statis (himasif_data.json)     |

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.8+ (Recommended: 3.11.7)
- **Node.js**: 16+ (Recommended: 18.19.0)
- **npm**: 8+ (comes with Node.js)
- **Git**: Latest version
- **OpenRouter API Key**: For AI functionality

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
# Windows
./start-dev.bat
# Mac/Linux
chmod +x start-dev.sh && ./start-dev.sh

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

1. **Edit file `.env`** (file .env di folder backend):
   ```
   OPENROUTER_API_KEY=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
   ```
2. **Restart backend server**

**Catatan**: Chatbot tetap berfungsi tanpa API key untuk pertanyaan HIMASIF!

## 📁 Project Structure

```
360AI-HIMASIF/
├── backend/
│   ├── app.py
│   ├── static/data/himasif_data.json
│   └── requirements.txt
├── frontend/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images.jsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ChatPage.css
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── LoginButton.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ThemeToggle.css
│   │   │   ├── Toast.jsx
│   │   │   └── Toast.css
│   │   ├── context/ThemeContext.jsx
│   │   ├── lib/firebase.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/vite.svg
│   └── vite.config.js
├── setup.sh / setup.bat
├── start-dev.sh / start-dev.bat
└── README.md
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
