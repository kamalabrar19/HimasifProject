# 🔑 Panduan Setup API Key OpenRouter

Untuk membuat AI chatbot Anda bisa menjawab pertanyaan apapun seperti ChatGPT, Anda perlu mengkonfigurasi API key dari OpenRouter.

## 🚀 Langkah-langkah Setup

### 1. Daftar di OpenRouter
1. Buka [OpenRouter.ai](https://openrouter.ai)
2. Klik **"Sign Up"** atau **"Get Started"**
3. Daftar menggunakan email atau akun Google/GitHub
4. Verifikasi email jika diperlukan

### 2. Dapatkan API Key
1. Setelah login, pergi ke [API Keys](https://openrouter.ai/keys)
2. Klik **"Create Key"** atau **"New API Key"**
3. Berikan nama untuk key Anda (contoh: "HIMASIF Chatbot")
4. Copy API key yang dihasilkan (dimulai dengan `sk-or-v1-...`)

### 3. Konfigurasi di Project
1. Buka file `.env` di root folder project
2. Jika belum ada, copy dari `.env.example`:
   ```bash
   copy .env.example .env
   ```
3. Edit file `.env` dan tambahkan API key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```

### 4. Restart Server
1. Stop server backend (Ctrl+C di terminal Flask)
2. Jalankan ulang:
   ```bash
   cd backend
   python app.py
   ```

## 💰 Pricing OpenRouter

OpenRouter menggunakan sistem pay-per-use yang sangat terjangkau:

- **Model DeepSeek R1 (yang digunakan)**: ~$0.14 per 1M tokens
- **Credit gratis**: $1 untuk new users
- **Minimum top-up**: $5

**Estimasi penggunaan:**
- 1 percakapan normal ≈ 100-500 tokens
- $1 credit ≈ 2000-7000 percakapan
- Sangat hemat untuk testing dan development!

## 🔧 Troubleshooting

### API Key Tidak Bekerja
- Pastikan API key dimulai dengan `sk-or-v1-`
- Periksa tidak ada spasi di awal/akhir
- Pastikan account OpenRouter sudah terverifikasi

### Error 401 (Unauthorized)
- API key salah atau expired
- Regenerate API key baru di OpenRouter

### Error 429 (Rate Limit)
- Terlalu banyak request dalam waktu singkat
- Tunggu beberapa detik dan coba lagi

### Error 402 (Payment Required)
- Credit habis, perlu top-up di OpenRouter
- Minimum top-up $5

## 🎯 Setelah Setup Berhasil

Setelah API key dikonfigurasi dengan benar, AI chatbot Anda akan bisa:

✅ **Menjawab pertanyaan umum** (seperti ChatGPT)
✅ **Membantu coding dan programming**
✅ **Diskusi tentang teknologi**
✅ **Tugas akademik**
✅ **Pertanyaan tentang HIMASIF** (dengan data lengkap)
✅ **Dan masih banyak lagi!**

## 📞 Bantuan

Jika masih ada masalah:
1. Cek log di terminal backend untuk error details
2. Pastikan koneksi internet stabil
3. Coba restart server setelah konfigurasi

**Selamat! AI chatbot HIMASIF Anda siap digunakan! 🎉**
