from flask import Flask, request, jsonify
from flask_cors import CORS
import textstat
from collections import Counter
import re

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'], methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type'])

def analyze_text(text):
    """Analyze text for various linguistic metrics"""
    if not text.strip():
        return {}
    
    # Basic stats
    words = text.split()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Calculate metrics
    word_count = len(words)
    sentence_count = len(sentences)
    avg_sentence_length = word_count / max(sentence_count, 1)
    
    # Readability (higher = harder to read)
    readability = textstat.flesch_kincaid_grade(text)
    
    # Simple sentiment (count positive/negative words)
    positive_words = ['love', 'good', 'beautiful', 'joy', 'happy', 'fair', 'noble', 'sweet', 'true', 'bright']
    negative_words = ['death', 'dark', 'sorrow', 'grief', 'pain', 'cruel', 'hate', 'evil', 'bitter', 'false']
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    sentiment_score = (positive_count - negative_count) / max(word_count / 10, 1)
    
    # Shakespearean indicators
    archaic_words = ['thou', 'thee', 'thy', 'thine', 'doth', 'hath', 'art', 'ere', 'whence', 'wherefore']
    archaic_count = sum(1 for word in archaic_words if word in text_lower)
    shakespeare_score = min(archaic_count * 20, 100)  # Cap at 100%
    
    return {
        'word_count': word_count,
        'sentence_count': sentence_count,
        'avg_sentence_length': round(avg_sentence_length, 1),
        'readability_grade': round(readability, 1),
        'sentiment_score': round(sentiment_score, 2),
        'shakespeare_score': shakespeare_score
    }

@app.route('/analyze', methods=['POST'])
def analyze_endpoint():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Text is required'}), 400
        
        analysis = analyze_text(text)
        return jsonify(analysis)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("🚀 Starting Analytics Service on http://localhost:5001")
    app.run(host='0.0.0.0', debug=True, port=5001) 