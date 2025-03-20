from flask import Flask, request, jsonify, send_from_directory, render_template
import requests
import os
import json
import logging
from openai import OpenAI
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# OpenRouter configuration
OPENROUTER_API_KEY = "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"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "qwen/qwq-32b:free"
SITE_URL = "https://www.sitename.com"
SITE_NAME = "SiteName"
TIMEOUT = 30

# Initialize OpenAI client for OpenRouter
client = OpenAI(
    base_url=OPENROUTER_BASE_URL,
    api_key=OPENROUTER_API_KEY,
)

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

# System prompt for the language model
def get_system_prompt():
    himasif_data_str = json.dumps(himasif_data, ensure_ascii=False, indent=2)
    
    system_prompt = f"""
Anda adalah asisten virtual HIMASIF (Himpunan Mahasiswa Sistem Informasi) dari Universitas Pembangunan Jaya. Gunakan data berikut untuk menjawab pertanyaan secara akurat dan alami:

{himasif_data_str}

**Panduan Kerja:**
- Jawab pertanyaan dengan jelas dan informatif.
- Bisa menjawab pertanyaan pertanyaan umum serta dapat membuat sesuatu berdasarkan penulisan yang baik dan benar.
- Pahami makna pertanyaan secara keseluruhan, bukan hanya kata kunci terpisah.
- Bedakan konteks dengan cerdas:
  - "Visi" berarti tujuan jangka panjang organisasi.
  - "Misi" berarti langkah-langkah untuk mencapai visi.
  - "Divisi" berarti unit kerja dalam departemen.
  - "Departemen" berarti kelompok besar yang menaungi divisi.
  - "Anggota" berarti daftar orang dalam organisasi atau divisi tertentu.
  - "BPH" berarti Badan Pengurus Harian.
  - "Kegiatan" berarti aktivitas atau program HIMASIF.
  - "Media sosial" atau "sosial media" berarti informasi tentang akun Instagram dan YouTube HIMASIF.
  - "Tagline" atau "hashtag" berarti informasi tentang slogan dan hashtag resmi HIMASIF.
  - "Tupoksi" atau "tugas pokok dan fungsi" berarti deskripsi tanggung jawab dari departemen atau divisi.
  - "Dosen" atau "Lecturer" berarti informasi tentang dosen-dosen program studi Sistem Informasi.
  - "Kaprodi" atau "Ketua Program Studi" berarti kepala program studi Sistem Informasi.
  - "Rektor" berarti pimpinan tertinggi universitas.
  - "Pembina" merujuk pada dosen yang berperan sebagai pembimbing atau pembina organisasi mahasiswa.
- Jika pertanyaan ambigu, pilih jawaban yang paling relevan berdasarkan konteks umum.
- Jika data tidak tersedia, jawab: "Maaf, informasi tidak tersedia."
- Jawab dalam Bahasa Indonesia yang sopan dan jelas.
- Gunakan format bold (**text**) untuk informasi penting.
- Gunakan heading Markdown (### untuk judul besar, #### untuk subjudul) jika perlu untuk struktur yang lebih jelas.
- Untuk media sosial, WAJIB gunakan format Markdown [teks](URL) untuk setiap tautan, misalnya [Instagram](https://www.instagram.com/himasif360upj/). 
- JANGAN tulis URL mentah tanpa format Markdown. JANGAN tulis nama platform tanpa tautan Markdown. JANGAN gabungkan teks dan tag HTML secara acak.
- Tambahkan kalimat ajakan seperti "Silakan kunjungi akun resmi HIMASIF untuk informasi terkini!" saat menjawab tentang media sosial.
- Hindari mencampur informasi yang tidak relevan (misalnya, visi dengan divisi).

**Panduan untuk Pertanyaan tentang Dosen:**
- Ketika ditanya "Siapa dosen Sistem Informasi UPJ?" atau pertanyaan serupa, berikan daftar lengkap dosen dari data.
- Ketika ditanya "Siapa Ketua/Kepala Program Studi?" atau "Siapa Kaprodi?", jawab dengan informasi dari data lecturer yang memiliki posisi "Head of the Department of Information Systems".
- Ketika ditanya "Siapa Rektor?", jawab dengan informasi dari data lecturer yang memiliki posisi "Rector".
- Ketika ditanya tentang dosen tertentu, berikan informasi lengkap tentang dosen tersebut termasuk posisi/jabatannya.

**Contoh:**
- Pertanyaan: "Apa visi HIMASIF?"
  Jawaban: **VISI HIMASIF:** [visi dari data]
- Pertanyaan: "Divisi apa saja di HIMASIF?"
  Jawaban: ### Daftar Divisi HIMASIF  
  [daftar divisi dari data]
- Pertanyaan: "Apa media sosial HIMASIF?"
  Jawaban: ### Media Sosial HIMASIF  
  - [Instagram](https://www.instagram.com/himasif360upj/)  
  - [YouTube](https://www.youtube.com/@sisteminformasiupj8380)  
  Silakan kunjungi akun resmi HIMASIF untuk informasi terkini!
- Pertanyaan: "Apa tagline HIMASIF?"
  Jawaban: **Tagline HIMASIF:** We Make IT Happen
- Pertanyaan: "Apa hashtag HIMASIF?"
  Jawaban: **Hashtag HIMASIF:** #sisteminformasi #sifupj #himasif360upj #WeMakeITHappen
- Pertanyaan: "Siapa dosen di Sistem Informasi UPJ?"
  Jawaban: ### Dosen Program Studi Sistem Informasi UPJ  
  1. **Ir. Yudi Samyudia, Ph.D.** - Rektor UPJ
  2. **Chaerul Anwar, S.Kom, M.T.I** - Kepala Program Studi Sistem Informasi
  3. **Denny Ganjar Purnama, S.Si., MTI** - Kepala Biro Teknologi Informasi dan Komunikasi
  [dan seterusnya]
- Pertanyaan: "Siapa Kaprodi Sistem Informasi?"
  Jawaban: **Kepala Program Studi Sistem Informasi UPJ** adalah **Chaerul Anwar, S.Kom, M.T.I**
- Pertanyaan: "Siapa Rektor UPJ?"
  Jawaban: **Rektor Universitas Pembangunan Jaya** adalah **Ir. Yudi Samyudia, Ph.D.**
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

# Chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        if not data or "message" not in data:
            return jsonify({"error": "Pesan diperlukan"}), 400
        
        user_prompt = data["message"]
        logger.info(f"Received query: {user_prompt}")
        
        # Get system prompt with data
        system_prompt = get_system_prompt()
        
        # Use OpenRouter to generate response
        try:
            logger.info(f"Connecting to OpenRouter API with model {MODEL_NAME}")
            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": SITE_URL,
                    "X-Title": SITE_NAME,
                },
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                timeout=TIMEOUT
            )
            
            ai_response = completion.choices[0].message.content
            formatted_response = format_response(ai_response)
            logger.info(f"AI response (formatted): {formatted_response[:100]}...")
            return jsonify({"response": formatted_response})
            
        except Exception as e:
            logger.error(f"OpenRouter API error: {str(e)}")
            fallback = himasif_data.get("defaultResponse", "Maaf, saya tidak bisa memberikan jawaban saat ini.")
            formatted_fallback = format_response(fallback)
            return jsonify({"response": formatted_fallback})
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Kesalahan server: {str(e)}"}), 500

# Serve frontend files - UPDATED for Flask standard structure
@app.route("/")
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error rendering template: {str(e)}")
        # Fallback to old method if template not found
        frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
        index_path = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(frontend_path, "index.html")
        else:
            return "Frontend not found. Please check your folder structure.", 404

# For static files
@app.route("/<path:filename>")
def serve_static(filename):
    # First try the standard Flask static folder
    static_path = os.path.join(os.path.dirname(__file__), "static", filename)
    if os.path.exists(static_path):
        return send_from_directory("static", filename)
    
    # Fallback to old path if file not found in standard location
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
    
    # Gunakan port dari environment variable atau 5000 sebagai default
    port = int(os.environ.get('PORT', 5000))
    # Gunakan 0.0.0.0 untuk development, tetapi bisa diubah menjadi 127.0.0.1 untuk lokal saja
    host = os.environ.get('HOST', '127.0.0.1')
    
    logger.info(f"Starting server on http://{host}:{port}")
    try:
        app.run(debug=True, host=host, port=port)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server crashed: {str(e)}")
    finally:
        logger.info("=== HIMASIF Assistant Server Stopped ===")