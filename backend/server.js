import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis setup
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.together.xyz/v1/completions';

// Rate limiter - 10 requests per day per IP
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: parseInt(process.env.MAX_REQUESTS_PER_DAY || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    detail: 'Rate limit exceeded. Maximum 10 requests per day.'
  }
});

// Utility functions
async function logRequest(clientIp, endpoint, requestData) {
  const logEntry = {
    timestamp: Date.now(),
    ip: clientIp,
    endpoint,
    request: requestData
  };
  
  await redis.lpush('request_logs', JSON.stringify(logEntry));
  await redis.ltrim('request_logs', 0, 999); // Keep last 1000 logs
}

async function callDeepseekApi(prompt) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured');
  }
  
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-llm/deepseek-coder-33b-instruct',
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`DeepSeek API error: ${error.detail || response.statusText}`);
  }
  
  const result = await response.json();
  return result.choices[0].text.trim();
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ShakeScribe API' });
});

app.post('/translate', limiter, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ detail: 'Text is required' });
    }
    
    // Check cache first
    const cacheKey = `translate:${text}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }
    
    // Log the request
    await logRequest(req.ip, '/translate', { text });
    
    // Generate prompt for Shakespeare translation
    const prompt = `
    You are a Shakespearean language expert. Translate the following modern English text into Shakespearean English.
    Maintain the meaning but use the vocabulary, grammar, and style typical of Shakespeare's works.
    Add appropriate thee, thou, thy, hath, doth, etc. where it makes sense.
    
    Modern text: ${text}
    
    Shakespearean translation:
    `;
    
    // Call DeepSeek API
    const translatedText = await callDeepseekApi(prompt);
    
    // Cache the result (expires in 7 days)
    const result = { translated_text: translatedText };
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 7 * 86400);
    
    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ detail: error.message });
  }
});

app.post('/sonnet', limiter, async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic || !topic.trim()) {
      return res.status(400).json({ detail: 'Topic is required' });
    }
    
    // Check cache first
    const cacheKey = `sonnet:${topic}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }
    
    // Log the request
    await logRequest(req.ip, '/sonnet', { topic });
    
    // Generate prompt for sonnet creation
    const prompt = `
    You are a poet in the style of William Shakespeare. Write a Shakespearean sonnet (14 lines, in iambic pentameter) 
    on the following topic or theme. Follow the traditional Shakespearean sonnet structure:
    - Three quatrains (4-line stanzas) and a final couplet
    - Follow the rhyme scheme: ABAB CDCD EFEF GG
    - Use iambic pentameter throughout
    - Add depth and meaning, possibly with a turn/volta at the couplet
    
    Topic: ${topic}
    
    Sonnet:
    `;
    
    // Call DeepSeek API
    const sonnetText = await callDeepseekApi(prompt);
    
    // Cache the result (expires in 7 days)
    const result = { sonnet: sonnetText };
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 7 * 86400);
    
    res.json(result);
  } catch (error) {
    console.error('Sonnet generation error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 