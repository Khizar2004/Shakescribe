#!/usr/bin/env python3
"""
Simple startup script for ShakeScribe Analytics Service
Run this to start the analytics API on port 5000
"""

if __name__ == '__main__':
    try:
        from app import app
        print("🚀 Starting ShakeScribe Analytics Service...")
        print("📊 Analytics API will be available at: http://localhost:5000")
        print("💡 Make sure to install dependencies first: pip install -r requirements.txt")
        app.run(host='0.0.0.0', port=5000, debug=True)
    except ImportError as e:
        print(f"❌ Error importing dependencies: {e}")
        print("💡 Please install dependencies: pip install -r requirements.txt") 