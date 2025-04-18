const API_BASE_URL = '/api';

export async function translateText(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to translate text');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export async function generateSonnet(topic) {
  try {
    const response = await fetch(`${API_BASE_URL}/sonnet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate sonnet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Sonnet generation error:', error);
    throw error;
  }
} 