from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import requests
import os
import json
import logging
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Konfigurasi logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

# Mengambil API Key dari variabel lingkungan
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "deepseek/deepseek-r1-distill-llama-70b:free"
SITE_URL = "http://localhost:5000"
SITE_NAME = "HIMASIF AI Assistant"
TIMEOUT = 30

# Log API key status (without exposing the actual key)
if OPENROUTER_API_KEY:
    logger.info(f"✅ OpenRouter API Key configured: Yes (length: {len(OPENROUTER_API_KEY)} chars)")
    logger.info(f"🤖 AI Model: {MODEL_NAME}")
else:
    logger.warning("⚠️  OpenRouter API Key not configured - using fallback responses")

# Load HIMASIF data from JSON file
def load_himasif_data():
    # Cari di folder saat ini dan subfolder
    current_dir = os.path.dirname(os.path.abspath(__file__))
    possible_locations = [
        os.path.join(current_dir, 'static', 'data', 'himasif_data.json'),
        os.path.join(current_dir, 'static', 'himasif_data.json'),
        os.path.join(current_dir, 'data', 'himasif_data.json'),
        os.path.join(current_dir, 'himasif_data.json'),
        # Jalur absolut untuk debugging
        'D:\\my-chatbot-project\\static\\data\\himasif_data.json'
    ]

    # Log semua lokasi yang dicoba
    logger.info(f"Mencoba mencari himasif_data.json di lokasi berikut: {possible_locations}")

    for location in possible_locations:
        try:
            logger.info(f"Mencoba membuka file dari: {location}")
            if os.path.exists(location):
                logger.info(f"File ditemukan di: {location}")
                with open(location, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    logger.info(f"✅ Successfully loaded HIMASIF data from {location}")
                    return data
            else:
                logger.info(f"File tidak ditemukan di: {location}")
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error at {location}: {str(e)}")
        except Exception as e:
            logger.error(f"Error loading file at {location}: {str(e)}")

    # Sebagai fallback, coba buat data kosong yang dapat digunakan
    logger.warning(f"⚠️ Failed to find HIMASIF data in any location. Creating default data.")

    # Data minimal sebagai fallback
    default_data = {
        "organization": {
            "name": "HIMASIF (Himpunan Mahasiswa Sistem Informasi)",
            "university": "Universitas Pembangunan Jaya",
            "vision": "Menjadi himpunan yang unggul dalam pengembangan teknologi informasi.",
            "mission": ["Mengembangkan minat dan bakat mahasiswa Sistem Informasi"],
            "social_media": {
                "instagram": "https://www.instagram.com/himasif360upj/",
                "youtube": "https://www.youtube.com/@sisteminformasiupj8380"
            }
        },
        "defaultResponse": "Maaf, saya masih dalam tahap pengembangan dan belum memiliki data lengkap."
    }

    # Coba simpan data default ke file untuk penggunaan berikutnya
    try:
        os.makedirs(os.path.join(current_dir, 'static', 'data'), exist_ok=True)
        default_file_path = os.path.join(current_dir, 'static', 'data', 'himasif_data.json')
        with open(default_file_path, 'w', encoding='utf-8') as f:
            json.dump(default_data, f, ensure_ascii=False, indent=2)
        logger.info(f"Default data saved to {default_file_path}")
    except Exception as e:
        logger.error(f"Couldn't save default data: {str(e)}")

    return default_data

# TAMBAHKAN BARIS INI: Load data saat aplikasi dimulai
himasif_data = load_himasif_data()

# Function to format response text with Markdown to HTML conversion
def format_response(text):
    if not text:
        return text

    # Clean up broken HTML fragments like " target="_blank">" or similar
    text = re.sub(r'"\s*target="_blank"[>\s]*', '', text)

    # Convert Markdown headings (### and ####) to HTML <h3> and <h4>
    text = re.sub(r'###\s*(.+)', r'<h3>\1</h3>', text)
    text = re.sub(r'####\s*(.+)', r'<h4>\1</h4>', text)

    # Convert Markdown links [text](URL) to HTML <a> tags
    link_pattern = r'\[(.*?)\]\((https?://[^\s]+)\)'
    text = re.sub(link_pattern, r'<a href="\2" target="_blank">\1</a>', text)

    # Convert markdown bold (**text**) to HTML <strong>
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)

    # Convert markdown italic (*text*) to HTML <em>
    text = re.sub(r'(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)', r'<em>\1</em>', text)

    # Fallback: Handle standalone URLs and map them to readable text
    url_mappings = {
        'https://www.instagram.com/himasif360upj/': 'Instagram',
        'https://www.youtube.com/@sisteminformasiupj8380': 'YouTube'
    }
    for url, label in url_mappings.items():
        standalone_url_pattern = rf'(?<!\])\b{re.escape(url)}\b(?![\)])'
        text = re.sub(standalone_url_pattern, f'<a href="{url}" target="_blank">{label}</a>', text)

    # Fallback: Handle standalone platform names (Instagram, YouTube) without URLs
    social_media = himasif_data.get('organization', {}).get('social_media', {})
    if 'instagram' in social_media:
        text = re.sub(r'\bInstagram\b(?!\s*\[)', f'<a href="{social_media["instagram"]}" target="_blank">Instagram</a>', text)
    if 'youtube' in social_media:
        text = re.sub(r'\bYouTube\b(?!\s*\[)(?!"\s*target="_blank">)', f'<a href="{social_media["youtube"]}" target="_blank">YouTube</a>', text)

    return text

# Simple fallback AI for HIMASIF questions when API is not available
def simple_himasif_response(question):
    question_lower = question.lower()

    # Basic keyword matching for HIMASIF questions
    if any(keyword in question_lower for keyword in ['himasif', 'himpunan', 'sistem informasi']):
        if any(keyword in question_lower for keyword in ['apa itu', 'tentang', 'pengertian']):
            return f"""
**HIMASIF (Himpunan Mahasiswa Sistem Informasi)**

HIMASIF adalah Himpunan Mahasiswa Sistem Informasi di Universitas Pembangunan Jaya yang bertujuan untuk mengembangkan potensi mahasiswa di bidang teknologi informasi.

**Visi:** {himasif_data['organization']['vision']}

**Misi:**
{chr(10).join([f"• {misi}" for misi in himasif_data['organization']['mission']])}

**Tagline:** "{himasif_data['organization']['tagline']}"

**Social Media:**
• Instagram: {himasif_data['organization']['social_media']['instagram']}
• YouTube: {himasif_data['organization']['social_media']['youtube']}

*Untuk pengalaman AI yang lebih pintar, silakan konfigurasi OpenRouter API key.*
"""

        elif any(keyword in question_lower for keyword in ['pengurus', 'struktur', 'organisasi']):
            return """
**Struktur Organisasi HIMASIF**


*Untuk informasi lengkap tentang divisi dan anggota, silakan konfigurasi API key.*
"""

        elif any(keyword in question_lower for keyword in ['kegiatan', 'acara', 'event']):
            return """
**Kegiatan HIMASIF**

**1. Seminar Teknologi**
Kegiatan seminar dengan mengundang praktisi industri teknologi informasi untuk berbagi pengalaman dan insight terbaru.

**2. Workshop Pemrograman**
Pelatihan keterampilan pemrograman untuk mahasiswa Sistem Informasi dengan hands-on practice.

**3. Kunjungan Industri**
Kunjungan ke perusahaan teknologi untuk mengenal dunia kerja dan networking dengan profesional.

*Untuk informasi kegiatan terbaru, follow Instagram @himasif360upj*
"""

    # If no specific HIMASIF keywords found, return general message
    return """
**Halo! Saya adalah 360 AI, asisten cerdas HIMASIF.**

**Yang bisa saya bantu saat ini:**
• Informasi lengkap tentang HIMASIF - struktur, pengurus, kegiatan
• Organisasi dan divisi - BPH, departemen, dan anggota
• Kegiatan dan event - seminar, workshop, kunjungan industri
• Kontak dan social media - Instagram, YouTube

**Contoh pertanyaan:**
• "Apa itu HIMASIF?"
• "Siapa ketua umum HIMASIF?"
• "Kegiatan apa saja di HIMASIF?"
• "Bagaimana cara bergabung dengan HIMASIF?"


Silakan tanyakan apapun tentang HIMASIF!
"""

# System prompt for the language model
def get_system_prompt():
    himasif_data_str = json.dumps(himasif_data, ensure_ascii=False, indent=2)

    system_prompt = f"""
Anda adalah 360 AI, asisten AI yang cerdas dan membantu dari HIMASIF.

IDENTITAS ANDA:
- Nama: 360 AI (360 Artificial Intelligence)
- Afiliasi: Himpunan Mahasiswa Sistem Informasi (HIMASIF) Universitas Pembangunan Jaya
- Tagline: "We Make IT Happen"

KEMAMPUAN ANDA:
1. Menjawab pertanyaan umum tentang berbagai topik (teknologi, sains, pendidikan, dll)
2. Expert dalam programming, coding, dan teknologi
3. Membantu tugas akademik, penelitian, dan belajar
4. Memberikan informasi lengkap tentang HIMASIF dan UPJ
5. Memberikan solusi untuk berbagai masalah

GAYA KOMUNIKASI:
- Ramah, profesional, dan informatif
- Gunakan emoticon secukupnya untuk membuat percakapan lebih menarik
- Berikan jawaban yang lengkap, terstruktur, dan mudah dipahami
- Gunakan format yang jelas dengan bullet points dan numbering
- Jika tidak yakin, katakan dengan jujur dan tawarkan alternatif

DATA HIMASIF (gunakan jika pertanyaan terkait HIMASIF):
{himasif_data_str}

INSTRUKSI KHUSUS:
- Untuk pertanyaan HIMASIF: gunakan data di atas dengan format yang jelas
- Untuk pertanyaan programming: berikan contoh kode yang jelas dengan penjelasan
- Untuk pertanyaan umum: jawab dengan informatif dan akurat
- Gunakan emoticon yang relevan tapi tidak berlebihan
- Format jawaban dengan struktur yang jelas dan mudah dibaca
"""
    return system_prompt

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    try:
        response = requests.get(
            f"{OPENROUTER_BASE_URL}/models",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
            timeout=10
        )
        api_status = "connected" if response.status_code == 200 else "unavailable"
        ollama_status = api_status  # Untuk kompatibilitas dengan frontend
    except Exception:
        api_status = "unavailable"
        ollama_status = "unavailable"

    return jsonify({
        "service": "healthy",
        "ollama_status": ollama_status,  # Untuk kompatibilitas dengan frontend
        "himasif_data": "loaded" if himasif_data else "not loaded"
    })

# Chat endpoint - Using requests library directly instead of OpenAI
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        if not data or "message" not in data:
            return jsonify({"error": "Pesan diperlukan"}), 400

        user_prompt = data["message"]
        logger.info(f"Received query: {user_prompt}")

        # Check if API key is configured
        if not OPENROUTER_API_KEY:
            logger.warning("OpenRouter API key not configured, using fallback response")
            fallback_response = simple_himasif_response(user_prompt)
            formatted_response = format_response(fallback_response)
            return jsonify({"response": formatted_response})

        # Get system prompt with data
        system_prompt = get_system_prompt()

        # Set up headers for OpenRouter API
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json"
        }

        # Prepare the payload for the API request
        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }

        # Make the API request to OpenRouter
        try:
            logger.info(f"Connecting to OpenRouter API with model {MODEL_NAME}")
            logger.info(f"API Key configured: {'Yes' if OPENROUTER_API_KEY else 'No'}")

            response = requests.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=TIMEOUT
            )

            logger.info(f"OpenRouter response status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                logger.info(f"OpenRouter response: {result}")

                if 'choices' in result and len(result['choices']) > 0:
                    ai_response = result['choices'][0]['message']['content']
                    formatted_response = format_response(ai_response)
                    logger.info(f"AI response (formatted): {formatted_response[:100]}...")
                    return jsonify({"response": formatted_response})
                else:
                    logger.error(f"No choices in OpenRouter response: {result}")
                    return jsonify({"response": "Maaf, terjadi kesalahan dalam memproses respons AI."})

            elif response.status_code == 401:
                logger.error("OpenRouter API: Unauthorized - Invalid API key")
                return jsonify({
                    "response": "🔑 **API Key Tidak Valid**\n\nAPI key OpenRouter tidak valid atau sudah expired. Silakan:\n1. Periksa API key di file `.env`\n2. Pastikan API key masih aktif di [OpenRouter](https://openrouter.ai)\n3. Restart server setelah update"
                })
            elif response.status_code == 429:
                logger.error("OpenRouter API: Rate limit exceeded")
                return jsonify({
                    "response": "⏱️ **Rate Limit Terlampaui**\n\nTerlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi."
                })
            else:
                logger.error(f"OpenRouter API error: {response.status_code}, {response.text}")
                return jsonify({
                    "response": f"❌ **Error API ({response.status_code})**\n\nTerjadi kesalahan saat menghubungi AI service. Silakan coba lagi nanti."
                })

        except requests.exceptions.Timeout:
            logger.error(f"OpenRouter API timeout after {TIMEOUT} seconds")
            return jsonify({"response": "⏱️ **Timeout**\n\nPermintaan timeout. Silakan coba lagi dengan pertanyaan yang lebih singkat."})
        except requests.exceptions.ConnectionError:
            logger.error("OpenRouter API connection error")
            return jsonify({"response": "🌐 **Koneksi Error**\n\nTidak dapat terhubung ke AI service. Periksa koneksi internet Anda."})
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenRouter API request error: {str(e)}")
            return jsonify({"response": f"❌ **Request Error**\n\nTerjadi kesalahan: {str(e)}"})

    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        return jsonify({"error": f"Kesalahan server: {str(e)}"}), 500

# Serve frontend files
@app.route("/")
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error rendering template: {str(e)}")
        frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
        index_path = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(frontend_path, "index.html")
        else:
            return "Frontend not found. Please check your folder structure.", 404

# For static files
@app.route("/<path:filename>")
def serve_static(filename):
    static_path = os.path.join(os.path.dirname(__file__), "static", filename)
    if os.path.exists(static_path):
        return send_from_directory("static", filename)
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
    file_path = os.path.join(frontend_path, filename)
    if os.path.exists(file_path):
        return send_from_directory(frontend_path, filename)
    else:
        logger.error(f"Static file not found: {filename}")
        return f"File {filename} not found", 404

if __name__ == "__main__":
    logger.info("=== HIMASIF Assistant Server Starting ===")
    if himasif_data:
        logger.info("✅ HIMASIF data loaded successfully")
    else:
        logger.warning("⚠️ Failed to load HIMASIF data - using fallback")

    try:
        response = requests.get(
            f"{OPENROUTER_BASE_URL}/models",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
            timeout=10
        )
        if response.status_code == 200:
            logger.info(f"✅ OpenRouter API connected successfully")
        else:
            logger.warning(f"⚠️ OpenRouter API returned status code {response.status_code}")
    except Exception as e:
        logger.warning(f"⚠️ Could not connect to OpenRouter API: {str(e)}")

    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')  # Changed from 127.0.0.1 to 0.0.0.0 for deployment
    logger.info(f"Starting server on http://{host}:{port}")
    try:
        app.run(debug=False, host=host, port=port)  # Set debug=False for production
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server crashed: {str(e)}")
    finally:
        logger.info("=== HIMASIF Assistant Server Stopped ===")