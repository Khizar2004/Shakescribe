from flask import Flask, request, jsonify
from flask_cors import CORS
import textstat

import re
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import numpy as np
import warnings

# Suppress transformer warnings for cleaner output
warnings.filterwarnings("ignore")

# Initialize ML models (loads once at startup)
print("🤖 Loading ML sentiment analyzer...")
sentiment_analyzer = pipeline("sentiment-analysis", 
                             model="cardiffnlp/twitter-roberta-base-sentiment-latest")
print("✅ ML sentiment analyzer ready!")

print("🤖 Loading similarity model...")
similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Similarity model ready!")

# Curated Shakespeare quotes database
SHAKESPEARE_QUOTES = [
    {"quote": "To be or not to be, that is the question", "source": "Hamlet, Act 3, Scene 1", "theme": "existential"},
    {"quote": "All the world's a stage, and all the men and women merely players", "source": "As You Like It, Act 2, Scene 7", "theme": "life philosophy"},
    {"quote": "Romeo, Romeo, wherefore art thou Romeo?", "source": "Romeo and Juliet, Act 2, Scene 2", "theme": "love"},
    {"quote": "What's in a name? That which we call a rose by any other name would smell as sweet", "source": "Romeo and Juliet, Act 2, Scene 2", "theme": "identity"},
    {"quote": "All that glisters is not gold", "source": "The Merchant of Venice, Act 2, Scene 7", "theme": "appearance vs reality"},
    {"quote": "Better three hours too soon than a minute too late", "source": "The Merry Wives of Windsor, Act 2, Scene 2", "theme": "time"},
    {"quote": "Cowards die many times before their deaths", "source": "Julius Caesar, Act 2, Scene 2", "theme": "courage"},
    {"quote": "Fair is foul, and foul is fair", "source": "Macbeth, Act 1, Scene 1", "theme": "deception"},
    {"quote": "If you prick us, do we not bleed? If you tickle us, do we not laugh?", "source": "The Merchant of Venice, Act 3, Scene 1", "theme": "humanity"},
    {"quote": "Love looks not with the eyes, but with the mind", "source": "A Midsummer Night's Dream, Act 1, Scene 1", "theme": "love"},
    {"quote": "Now is the winter of our discontent", "source": "Richard III, Act 1, Scene 1", "theme": "dissatisfaction"},
    {"quote": "Once more unto the breach, dear friends, once more", "source": "Henry V, Act 3, Scene 1", "theme": "courage"},
    {"quote": "Parting is such sweet sorrow", "source": "Romeo and Juliet, Act 2, Scene 2", "theme": "separation"},
    {"quote": "The course of true love never did run smooth", "source": "A Midsummer Night's Dream, Act 1, Scene 1", "theme": "love"},
    {"quote": "There is nothing either good or bad, but thinking makes it so", "source": "Hamlet, Act 2, Scene 2", "theme": "perception"},
    {"quote": "This above all: to thine own self be true", "source": "Hamlet, Act 1, Scene 3", "theme": "authenticity"},
    {"quote": "We are such stuff as dreams are made on", "source": "The Tempest, Act 4, Scene 1", "theme": "reality"},
    {"quote": "What is done cannot be undone", "source": "Macbeth, Act 5, Scene 1", "theme": "regret"},
    {"quote": "When sorrows come, they come not single spies, but in battalions", "source": "Hamlet, Act 4, Scene 5", "theme": "suffering"},
    {"quote": "Brevity is the soul of wit", "source": "Hamlet, Act 2, Scene 2", "theme": "communication"},
    {"quote": "All's well that ends well", "source": "All's Well That Ends Well, Act 4, Scene 4", "theme": "optimism"},
    {"quote": "The lady doth protest too much, methinks", "source": "Hamlet, Act 3, Scene 2", "theme": "deception"},
    {"quote": "Double, double toil and trouble", "source": "Macbeth, Act 4, Scene 1", "theme": "magic"},
    {"quote": "A rose by any other name would smell as sweet", "source": "Romeo and Juliet, Act 2, Scene 2", "theme": "essence"},
    {"quote": "Good night, good night! Parting is such sweet sorrow", "source": "Romeo and Juliet, Act 2, Scene 2", "theme": "farewell"}
]

# Pre-compute embeddings for Shakespeare quotes (cached)
print("Computing Shakespeare quote embeddings")
QUOTE_EMBEDDINGS = None

def get_quote_embeddings():
    global QUOTE_EMBEDDINGS
    if QUOTE_EMBEDDINGS is None:
        quotes_text = [q["quote"] for q in SHAKESPEARE_QUOTES]
        QUOTE_EMBEDDINGS = similarity_model.encode(quotes_text)
    return QUOTE_EMBEDDINGS

# Initialize embeddings
get_quote_embeddings()
print("Shakespeare quote embeddings ready")

def find_most_similar_quote(text):
    """Find the most similar Shakespeare quote to the given text"""
    if not text.strip():
        return None
    
    try:
        # Get embeddings
        text_embedding = similarity_model.encode([text])
        quote_embeddings = get_quote_embeddings()
        
        # Calculate cosine similarities
        similarities = np.dot(text_embedding, quote_embeddings.T)[0]
        
        # Find best match
        best_idx = np.argmax(similarities)
        similarity_score = float(similarities[best_idx])
        
        # Convert to percentage (cosine similarity ranges from -1 to 1, we normalize to 0-100)
        similarity_percentage = int((similarity_score + 1) * 50)
        
        best_quote = SHAKESPEARE_QUOTES[best_idx]
        
        return {
            "quote": best_quote["quote"],
            "source": best_quote["source"], 
            "theme": best_quote["theme"],
            "similarity_percentage": similarity_percentage
        }
        
    except Exception as e:
        return None

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
        

        
        # Handle different possible label formats
        if label.upper() in ['POSITIVE', 'POS', 'LABEL_2']:
            return round(confidence, 2)
        elif label.upper() in ['NEGATIVE', 'NEG', 'LABEL_0']:  
            return round(-confidence, 2)
        elif label.upper() in ['NEUTRAL', 'NEU', 'LABEL_1']:
            return 0
        else:
            # If unknown label format, use fallback
            return simple_sentiment_fallback(text)
            
    except Exception as e:
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
    
    # Find most similar Shakespeare quote
    similar_quote = find_most_similar_quote(text)
    
    return {
        'word_count': word_count,
        'sentence_count': sentence_count,
        'avg_sentence_length': round(avg_sentence_length, 1),
        'readability_grade': round(readability, 1),
        'sentiment_score': sentiment_score,
        'shakespeare_score': shakespeare_score,
        'similar_quote': similar_quote
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