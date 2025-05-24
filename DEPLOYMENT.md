# 🚀 Deployment Guide - 360 AI HIMASIF Assistant

Panduan untuk deploy 360 AI HIMASIF Assistant ke berbagai platform production.

## 🌐 Platform Deployment Options

### **1. Heroku (Recommended for Beginners)**

#### Prerequisites:
- Heroku account
- Heroku CLI installed

#### Steps:
```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create your-app-name

# 3. Set environment variables
heroku config:set OPENROUTER_API_KEY=your-api-key

# 4. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# 5. Open app
heroku open
```

#### Files needed:
- `Procfile` ✅ (already included)
- `runtime.txt` ✅ (already included)
- `requirements.txt` ✅ (already included)

### **2. Vercel (Frontend) + Railway (Backend)**

#### Frontend to Vercel:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod
```

#### Backend to Railway:
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### **3. DigitalOcean Droplet**

#### Setup Ubuntu Server:
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Python and Node.js
sudo apt install python3.11 python3-pip nodejs npm -y

# 3. Install PM2 for process management
sudo npm install -g pm2

# 4. Clone repository
git clone your-repo-url
cd HimasifProject

# 5. Setup backend
cd backend
pip3 install -r requirements.txt

# 6. Setup frontend
cd ../frontend
npm install
npm run build

# 7. Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### **4. Docker Deployment**

#### Create Dockerfile for Backend:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
COPY static/ ./static/

EXPOSE 5000
CMD ["gunicorn", "-c", "gunicorn_config.py", "app:app"]
```

#### Create Dockerfile for Frontend:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔧 Environment Variables

### **Required Variables:**
```bash
OPENROUTER_API_KEY=sk-or-v1-your-api-key
PORT=5000
HOST=0.0.0.0
FLASK_ENV=production
```

### **Optional Variables:**
```bash
FLASK_DEBUG=False
CORS_ORIGINS=https://your-frontend-domain.com
LOG_LEVEL=INFO
```

## 📊 Performance Optimization

### **Backend Optimizations:**
```python
# In gunicorn_config.py
workers = 4
worker_class = "gevent"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
```

### **Frontend Optimizations:**
```javascript
// In vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

## 🔒 Security Considerations

### **Backend Security:**
- Use HTTPS in production
- Set secure CORS origins
- Implement rate limiting
- Use environment variables for secrets
- Regular security updates

### **Frontend Security:**
- Enable CSP headers
- Use HTTPS
- Implement proper error handling
- Sanitize user inputs

## 📈 Monitoring & Logging

### **Health Checks:**
```bash
# Backend health check
curl https://your-api-domain.com/health

# Expected response:
{"status": "healthy", "timestamp": "..."}
```

### **Logging Setup:**
```python
# Add to app.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

## 🔄 CI/CD Pipeline

### **GitHub Actions Example:**
```yaml
name: Deploy 360 AI
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && pip install -r requirements.txt
          
      - name: Build frontend
        run: cd frontend && npm run build
        
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

## 🧪 Production Testing

### **Load Testing:**
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test backend
ab -n 1000 -c 10 https://your-api-domain.com/health

# Test chat endpoint
ab -n 100 -c 5 -p test_data.json -T application/json https://your-api-domain.com/chat
```

### **Monitoring Tools:**
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Logs**: LogRocket, Sentry
- **Analytics**: Google Analytics, Mixpanel

## 📞 Production Support

### **Backup Strategy:**
- Regular database backups (if applicable)
- Code repository backups
- Environment configuration backups
- SSL certificate backups

### **Disaster Recovery:**
- Document rollback procedures
- Maintain staging environment
- Test recovery procedures regularly
- Monitor system health continuously

---

**Ready for production! 🚀**
