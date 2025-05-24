#!/usr/bin/env python3
"""
360 AI - HIMASIF Assistant Requirements Checker
Checks if all required dependencies and tools are installed correctly.
"""

import sys
import subprocess
import importlib
import os
from pathlib import Path

def check_python_version():
    """Check Python version"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Need Python 3.8+")
        return False

def check_node_version():
    """Check Node.js version"""
    print("\n📦 Checking Node.js version...")
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            major_version = int(version[1:].split('.')[0])
            if major_version >= 16:
                print(f"✅ Node.js {version} - OK")
                return True
            else:
                print(f"❌ Node.js {version} - Need Node.js 16+")
                return False
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        return False

def check_npm_version():
    """Check npm version"""
    print("\n📦 Checking npm version...")
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ npm {version} - OK")
            return True
        else:
            print("❌ npm not found")
            return False
    except FileNotFoundError:
        print("❌ npm not found")
        return False

def check_python_packages():
    """Check Python packages"""
    print("\n🐍 Checking Python packages...")
    
    required_packages = [
        'flask',
        'flask_cors',
        'requests',
        'dotenv',
        'gunicorn'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'flask_cors':
                importlib.import_module('flask_cors')
            elif package == 'dotenv':
                importlib.import_module('dotenv')
            else:
                importlib.import_module(package)
            print(f"✅ {package} - OK")
        except ImportError:
            print(f"❌ {package} - Missing")
            missing_packages.append(package)
    
    return len(missing_packages) == 0, missing_packages

def check_node_packages():
    """Check Node.js packages"""
    print("\n📦 Checking Node.js packages...")
    
    frontend_path = Path('frontend')
    if not frontend_path.exists():
        print("❌ Frontend directory not found")
        return False
    
    node_modules_path = frontend_path / 'node_modules'
    if not node_modules_path.exists():
        print("❌ node_modules not found - run 'npm install' in frontend directory")
        return False
    
    package_json_path = frontend_path / 'package.json'
    if not package_json_path.exists():
        print("❌ package.json not found")
        return False
    
    print("✅ Node.js packages - OK")
    return True

def check_environment_file():
    """Check environment file"""
    print("\n🔧 Checking environment configuration...")
    
    env_file = Path('.env')
    env_example = Path('.env.example')
    
    if not env_example.exists():
        print("❌ .env.example not found")
        return False
    
    if not env_file.exists():
        print("⚠️  .env file not found - copy from .env.example")
        return False
    
    # Check if API key is configured
    with open(env_file, 'r') as f:
        content = f.read()
        if 'OPENROUTER_API_KEY=' in content and 'your-api-key-here' not in content:
            print("✅ Environment file configured - OK")
            return True
        else:
            print("⚠️  API key not configured in .env file")
            return False

def check_project_structure():
    """Check project structure"""
    print("\n📁 Checking project structure...")
    
    required_files = [
        'backend/app.py',
        'backend/requirements.txt',
        'frontend/package.json',
        'frontend/src/App.jsx',
        'static/data/himasif_data.json'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path} - OK")
        else:
            print(f"❌ {file_path} - Missing")
            missing_files.append(file_path)
    
    return len(missing_files) == 0, missing_files

def main():
    """Main function"""
    print("=" * 60)
    print("🤖 360 AI - HIMASIF Assistant Requirements Checker")
    print("=" * 60)
    
    checks = []
    
    # Check Python version
    checks.append(check_python_version())
    
    # Check Node.js and npm
    checks.append(check_node_version())
    checks.append(check_npm_version())
    
    # Check project structure
    structure_ok, missing_files = check_project_structure()
    checks.append(structure_ok)
    
    # Check Python packages
    packages_ok, missing_packages = check_python_packages()
    checks.append(packages_ok)
    
    # Check Node.js packages
    checks.append(check_node_packages())
    
    # Check environment
    checks.append(check_environment_file())
    
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    passed = sum(checks)
    total = len(checks)
    
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 All requirements satisfied! Ready to run 360 AI!")
        print("\n🚀 Next steps:")
        print("1. Run: start-dev.bat (Windows) or ./start-dev.sh (Linux/Mac)")
        print("2. Open: http://localhost:5173")
    else:
        print("\n⚠️  Some requirements are missing. Please fix the issues above.")
        
        if missing_packages:
            print(f"\n📦 Install missing Python packages:")
            print(f"   pip install {' '.join(missing_packages)}")
        
        if not check_node_packages():
            print(f"\n📦 Install Node.js packages:")
            print(f"   cd frontend && npm install")
    
    print("\n📖 For detailed instructions, see INSTALLATION.md")

if __name__ == "__main__":
    main()
