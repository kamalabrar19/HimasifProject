from flask import Flask, request, jsonify, send_from_directory
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
MODEL_NAME = "deepseek/deepseek-r1:free"
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
    json_file_path = os.path.join(os.path.dirname(__file__), 'data', 'himasif_data.json')
    possible_locations = [
        json_file_path,
        os.path.join(os.path.dirname(__file__), '..', 'data', 'himasif_data.json'),
        os.path.join(os.path.dirname(__file__), 'himasif_data.json'),
        'himasif_data.json'
    ]
    for location in possible_locations:
        try:
            if os.path.exists(location):
                with open(location, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    logger.info(f"✅ Successfully loaded HIMASIF data from {location}")
                    return data
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error at {location}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error loading file at {location}: {str(e)}")
            return None
    
    logger.warning(f"⚠️ Failed to find HIMASIF data in any location: {possible_locations}")
    return {}

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
- Jika pertanyaan ambigu, pilih jawaban yang paling relevan berdasarkan konteks umum.
- Jika data tidak tersedia, jawab: "Maaf, informasi tidak tersedia."
- Jawab dalam Bahasa Indonesia yang sopan dan jelas.
- Gunakan format bold (**text**) untuk informasi penting.
- Gunakan heading Markdown (### untuk judul besar, #### untuk subjudul) jika perlu untuk struktur yang lebih jelas.
- Untuk media sosial, WAJIB gunakan format Markdown [teks](URL) untuk setiap tautan, misalnya [Instagram](https://www.instagram.com/himasif360upj/). 
- JANGAN tulis URL mentah tanpa format Markdown. JANGAN tulis nama platform tanpa tautan Markdown. JANGAN gabungkan teks dan tag HTML secara acak.
- Tambahkan kalimat ajakan seperti "Silakan kunjungi akun resmi HIMASIF untuk informasi terkini!" saat menjawab tentang media sosial.
- Hindari mencampur informasi yang tidak relevan (misalnya, visi dengan divisi).

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
    except Exception:
        api_status = "unavailable"
    
    return jsonify({
        "service": "healthy",
        "api_status": api_status,
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

# Serve frontend files
@app.route("/")
def serve_frontend():
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
    index_path = os.path.join(frontend_path, "index.html")
    if not os.path.exists(index_path):
        logger.error(f"Frontend index.html not found at: {index_path}")
        return "Frontend not found", 404
    return send_from_directory(frontend_path, "index.html")

@app.route("/<path:filename>")
def serve_static(filename):
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
    file_path = os.path.join(frontend_path, filename)
    if not os.path.exists(file_path):
        logger.error(f"Static file not found: {file_path}")
        return "File not found", 404
    return send_from_directory(frontend_path, filename)

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
    
    logger.info("Starting server on http://127.0.0.1:5000")
    try:
        app.run(debug=True, host="127.0.0.1", port=5000)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server crashed: {str(e)}")
    finally:
        logger.info("=== HIMASIF Assistant Server Stopped ===")