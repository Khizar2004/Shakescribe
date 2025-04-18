# ShakeScribe

ShakeScribe is a full-stack, AI-powered web application designed to "bardify" modern English into Shakespearean language using the DeepSeek LLM. The app features a pixel-art themed UI styled like a cozy medieval scribe's study.

![ShakeScribe](frontend/src/assets/logo.png)

## Features

- Transform modern English text into Shakespearean style
- Generate Shakespearean sonnets on any topic
- Pixel-art themed interface with animated elements
- Dark/light mode toggle with different study backgrounds
- Rate limiting to prevent abuse
- Redis caching for performance

## Tech Stack

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **AI**: DeepSeek LLM via Together.ai API
- **Caching**: Redis

## Pixel Art Assets

The application uses custom pixel art for a fully immersive experience:

- Study room backgrounds (day/night variants)
- Animated candle
- Quill pen and inkpot
- Parchment scroll for sonnets
- Custom pixel buttons
- ShakeScribe logo

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Redis server (for caching and rate limiting)
- DeepSeek API key from Together.ai

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Then edit .env with your API keys
npm run dev
```

## Deployment

- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Make sure to set up environment variables for both

## Redis Setup

For local development, you can run Redis using Docker:

```bash
docker run -d -p 6379:6379 redis
```

## DeepSeek API

You'll need an API key from Together.ai to access the DeepSeek LLM:

1. Create an account at [Together.ai](https://www.together.ai/)
2. Generate an API key
3. Add it to your `.env` file 