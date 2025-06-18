from flask import Flask, request, jsonify
from flask_cors import CORS
import textstat
from collections import Counter
import re
from transformers import pipeline
import warnings

# Suppress transformer warnings for cleaner output
warnings.filterwarnings("ignore")

# Initialize ML sentiment analyzer (loads once at startup)
print("🤖 Loading ML sentiment analyzer...")
sentiment_analyzer = pipeline("sentiment-analysis", 
                             model="cardiffnlp/twitter-roberta-base-sentiment-latest")
print("✅ ML sentiment analyzer ready!")

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'], methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type'])

def calculate_shakespeare_score(text):
    """Advanced Shakespeare detection using patterns and vocabulary"""
    text_lower = text.lower()
    score = 0
    
    # 1. Archaic contractions and patterns (High weight - very distinctive)
    archaic_patterns = [
        (r"'er\b", 15),          # o'er, ne'er, e'er
        (r"'twixt\b", 15),       # 'twixt, betwixt
        (r"\bhark\b", 20),       # Hark!
        (r"\bdoth\b", 20),       # doth
        (r"\bhath\b", 20),       # hath
        (r"'d\b", 10),           # grac'd, layer'd
        (r"\b\w+est\b", 8),      # thou speakest, fairest
        (r"\b\w+eth\b", 12),     # speaketh, cometh
        (r"\bnay\b", 12),        # nay (no)
        (r"\baye\b", 12),        # aye (yes)
        (r"\bverily\b", 15),     # verily
        (r"\bprithee\b", 18),    # prithee
        (r"\bforsooth\b", 18),   # forsooth
    ]
    
    for pattern, points in archaic_patterns:
        matches = len(re.findall(pattern, text_lower))
        score += matches * points
    
    # 2. Classic Shakespeare pronouns (Medium weight)
    pronouns = ['thou', 'thee', 'thy', 'thine']
    pronoun_count = sum(1 for pronoun in pronouns if pronoun in text_lower)
    score += pronoun_count * 15
    
    # 3. Shakespearean vocabulary (Lower weight - more common)
    shakespeare_vocab = [
        'bosom', 'fair', 'noble', 'tender', 'splendor', 'morsels', 'delight',
        'grace', 'savory', 'repast', 'cunning', 'gilded', 'profound', 'leisure',
        'crown', 'golden', 'sweet', 'bright', 'gentle', 'maiden', 'gallant',
        'beauteous', 'wondrous', 'divine', 'celestial', 'radiant', 'glorious'
    ]
    
    text_words = set(re.findall(r'\b\w+\b', text_lower))
    vocab_matches = len(text_words.intersection(shakespeare_vocab))
    score += vocab_matches * 6
    
    # 4. Inverted/poetic syntax patterns (Medium weight)
    syntax_patterns = [
        (r'\bdo\s+\w+', 8),      # "do hail", "do speak"
        (r'\bmost\s+\w+', 5),    # "most true", "most fair"
        (r'\b\w+\s+most\s+\w+', 8),  # "beauty most divine"
        (r'\bin\s+\w+\'s\s+\w+', 6), # "in heaven's name"
    ]
    
    for pattern, points in syntax_patterns:
        matches = len(re.findall(pattern, text_lower))
        score += matches * points
    
    # 5. Bonus for multiple archaic elements
    if score > 50:
        score *= 1.1  # 10% bonus for very Shakespearean text
    
    return min(round(score), 100)

def ml_sentiment_analysis(text):
    """Advanced ML-based sentiment analysis using transformers"""
    if not text.strip():
        return 0
    
    try:
        # Get ML prediction
        result = sentiment_analyzer(text)[0]
        label = result['label']
        confidence = result['score']
        
        print(f"DEBUG: ML result = {result}")  # Debug what we're getting
        
        # Handle different possible label formats
        if label.upper() in ['POSITIVE', 'POS', 'LABEL_2']:
            return round(confidence, 2)
        elif label.upper() in ['NEGATIVE', 'NEG', 'LABEL_0']:  
            return round(-confidence, 2)
        elif label.upper() in ['NEUTRAL', 'NEU', 'LABEL_1']:
            return 0
        else:
            # If unknown label format, print it and use fallback
            print(f"Unknown label format: {label}")
            return simple_sentiment_fallback(text)
            
    except Exception as e:
        print(f"ML sentiment analysis failed: {e}")
        # Fallback to simple analysis if ML fails
        return simple_sentiment_fallback(text)

def simple_sentiment_fallback(text):
    """Fallback sentiment analysis if ML fails"""
    positive_words = ['love', 'good', 'beautiful', 'joy', 'happy', 'fair', 'noble', 'sweet', 'true', 'bright']
    negative_words = ['death', 'dark', 'sorrow', 'grief', 'pain', 'cruel', 'hate', 'evil', 'bitter', 'false', 
                     'despise', 'vehemently', 'woe', 'naught', 'awful', 'terrible', 'horrible']
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    word_count = len(text.split())
    if word_count == 0:
        return 0
    
    sentiment_score = (positive_count - negative_count) / max(word_count / 10, 1)
    print(f"DEBUG Fallback: pos={positive_count}, neg={negative_count}, score={sentiment_score}")
    return round(sentiment_score, 2)

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
    
    # Advanced ML sentiment analysis
    sentiment_score = ml_sentiment_analysis(text)
    
    # Advanced Shakespearean detection
    shakespeare_score = calculate_shakespeare_score(text)
    
    return {
        'word_count': word_count,
        'sentence_count': sentence_count,
        'avg_sentence_length': round(avg_sentence_length, 1),
        'readability_grade': round(readability, 1),
        'sentiment_score': sentiment_score,
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