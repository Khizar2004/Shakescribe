# ShakeScribe

ShakeScribe is a full-stack, AI-powered web application designed to "bardify" modern English into Shakespearean language using the DeepSeek LLM. The app features a pixel-art themed UI styled like a cozy medieval scribe's study with advanced ML-powered text analytics.

![ShakeScribe](frontend/src/assets/logo.png)

## Features

### Core Functionality
- **Text Translation**: Transform modern English text into Shakespearean style using DeepSeek LLM
- **Sonnet Generation**: Generate authentic Shakespearean sonnets on any topic
- **Shakespeare Quote Similarity**: ML-powered engine that finds the most similar famous Shakespeare quote to your text

### Analytics Dashboard
- **Advanced Text Analysis**: Word count, sentence analysis, readability scoring
- **ML Sentiment Analysis**: RoBERTa-based sentiment detection
- **Shakespearean Style Scoring**: Custom algorithm to rate how "Shakespearean" text sounds
- **Quote Similarity Engine**: Semantic similarity matching with 25+ famous Shakespeare quotes
- **Interactive Visualizations**: Charts and graphs powered by Recharts

### User Experience
- **Pixel-art themed interface** with animated elements
- **Dark/light mode toggle** with different study backgrounds
- **Responsive design** for all devices
- **Loading animations** and smooth transitions

### Performance & Security
- **Redis caching** for improved performance
- **Rate limiting** to prevent abuse
- **Error handling** and fallback systems

## Tech Stack

### Frontend
- **React** - Component-based UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Recharts** - Interactive data visualization

### Backend
- **Node.js & Express** - Main API server
- **Python Flask** - Analytics microservice
- **DeepSeek LLM** - AI text generation via Together.ai API
- **Redis** - Caching and rate limiting

### Machine Learning
- **Transformers** - RoBERTa sentiment analysis
- **Sentence Transformers** - Semantic similarity embeddings
- **TextStat** - Readability analysis
- **Custom ML Models** - Shakespeare style detection

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Python 3.9+
- Redis server (for caching and rate limiting)
- DeepSeek API key from Together.ai

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your API keys
npm run dev
```

### 3. Analytics Service Setup

```bash
cd analytics
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=8000
DEEPSEEK_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
MAX_REQUESTS_PER_DAY=10
NODE_ENV=development
```

## Services Architecture

The application runs on multiple services:

- **Frontend**: React app on `http://localhost:5173`
- **Backend API**: Node.js server on `http://localhost:8000`
- **Analytics Service**: Python Flask on `http://localhost:5001`
- **Redis**: Cache server on `localhost:6379`

## API Integration

### DeepSeek API
Get your API key from [Together.ai](https://www.together.ai/):
1. Create an account at Together.ai
2. Generate an API key
3. Add it to your `.env` file

### Analytics Endpoints
- `POST /analyze` - Comprehensive text analysis with ML features
- `GET /health` - Service health check

## Project Structure

```
ShakeScribe/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── assets/    # Pixel art assets
│   │   └── utils/
├── backend/           # Node.js API server
├── analytics/         # Python ML service
│   ├── app.py        # Flask analytics server
│   ├── requirements.txt
│   └── venv/
└── README.md
```
