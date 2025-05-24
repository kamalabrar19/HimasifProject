#!/usr/bin/env python3
"""
Test script untuk HIMASIF AI Assistant Backend
Menguji apakah backend berfungsi dengan baik
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:5000"
TEST_QUESTIONS = [
    "Apa itu HIMASIF?",
    "Siapa ketua umum HIMASIF?",
    "Apa visi dan misi HIMASIF?",
    "Kegiatan apa saja yang ada di HIMASIF?",
    "Jelaskan tentang Python programming",
    "Bagaimana cara membuat website?"
]

def test_health_endpoint():
    """Test health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_chat_endpoint(question):
    """Test chat endpoint with a question"""
    print(f"\n💬 Testing question: '{question}'")
    try:
        payload = {"message": question}
        response = requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get("response", "No response")
            print(f"✅ Response received ({len(answer)} chars)")
            print(f"📝 Answer preview: {answer[:100]}...")
            return True
        else:
            print(f"❌ Chat failed: {response.status_code}")
            print(f"📝 Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return False

def main():
    print("=" * 50)
    print("🤖 HIMASIF AI Assistant Backend Test")
    print("=" * 50)
    
    # Test health endpoint
    if not test_health_endpoint():
        print("\n❌ Backend tidak berjalan atau bermasalah!")
        print("💡 Pastikan backend sudah dijalankan dengan: python backend/app.py")
        return
    
    print("\n" + "=" * 50)
    print("🧪 Testing Chat Functionality")
    print("=" * 50)
    
    success_count = 0
    total_tests = len(TEST_QUESTIONS)
    
    for i, question in enumerate(TEST_QUESTIONS, 1):
        print(f"\n[{i}/{total_tests}]", end=" ")
        if test_chat_endpoint(question):
            success_count += 1
        time.sleep(1)  # Small delay between requests
    
    print("\n" + "=" * 50)
    print("📊 Test Results")
    print("=" * 50)
    print(f"✅ Successful tests: {success_count}/{total_tests}")
    print(f"❌ Failed tests: {total_tests - success_count}/{total_tests}")
    
    if success_count == total_tests:
        print("\n🎉 Semua test berhasil! Backend berfungsi dengan baik.")
    elif success_count > 0:
        print("\n⚠️  Backend berfungsi sebagian. Periksa konfigurasi API key.")
    else:
        print("\n❌ Backend bermasalah. Periksa log server untuk detail error.")
    
    print("\n💡 Tips:")
    print("- Jika ada error 'Connection refused', pastikan backend sudah berjalan")
    print("- Jika response 'API key diperlukan', setup OpenRouter API key di .env")
    print("- Untuk AI yang lebih pintar, ikuti panduan di API_SETUP_GUIDE.md")

if __name__ == "__main__":
    main()
