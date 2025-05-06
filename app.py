from flask import Flask, request, jsonify, send_from_directory, render_template
import requests
import os
import json
import logging
import re

# Konfigurasi logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define the Flask app
app = Flask(__name__)

# Mengambil API Key dari variabel lingkungan
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "deepseek/deepseek-r1-distill-llama-70b:free"
SITE_URL = "https://www.sitename.com"
SITE_NAME = "SiteName"
TIMEOUT = 30

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
Anda adalah asisten virtual HIMASIF (Himpunan Mahasiswa Sistem Informasi) dari Universitas Pembangunan Jaya.
Anda juga bisa menjawab pertanyaan pertanyaan diluar dari data HIMASIF.
Gunakan data berikut untuk menjawab pertanyaan secara akurat dan alami:

{himasif_data_str}
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
            ]
        }
        
        # Make the API request to OpenRouter
        try:
            logger.info(f"Connecting to OpenRouter API with model {MODEL_NAME}")
            response = requests.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                formatted_response = format_response(ai_response)
                logger.info(f"AI response (formatted): {formatted_response[:100]}...")
                return jsonify({"response": formatted_response})
            else:
                logger.error(f"OpenRouter API error: {response.status_code}, {response.text}")
                fallback = himasif_data.get("defaultResponse", "Maaf, saya tidak bisa memberikan jawaban saat ini.")
                formatted_fallback = format_response(fallback)
                return jsonify({"response": formatted_fallback})
            
        except requests.exceptions.Timeout:
            logger.error(f"OpenRouter API timeout after {TIMEOUT} seconds")
            return jsonify({"response": "Maaf, permintaan timeout. Silakan coba lagi nanti."})
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenRouter API request error: {str(e)}")
            fallback = himasif_data.get("defaultResponse", "Maaf, saya tidak bisa memberikan jawaban saat ini.")
            formatted_fallback = format_response(fallback)
            return jsonify({"response": formatted_fallback})
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Kesalahan server: {str(e)}"}), 500

# Serve main homepage (using the new template)
@app.route("/")
def index():
    try:
        return render_template('homepage.html')
    except Exception as e:
        logger.error(f"Error rendering homepage template: {str(e)}")
        return "Homepage template not found. Please check your templates folder.", 404

# Serve chat page
@app.route("/chatpage")
def chatpage():
    try:
        return render_template('chatpage.html')
    except Exception as e:
        logger.error(f"Error rendering chatpage template: {str(e)}")
        return "Chatpage template not found. Please check your templates folder.", 404

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
    host = os.environ.get('HOST', '0.0.0.0')  # Using 127.0.0.1 for local development
    logger.info(f"Starting server on http://{host}:{port}")
    try:
        app.run(debug=True, host=host, port=port)  # Set debug=True for development
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server crashed: {str(e)}")
    finally:
        logger.info("=== HIMASIF Assistant Server Stopped ===")