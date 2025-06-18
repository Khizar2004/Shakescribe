import React, { useState } from 'react';

const Analytics = ({ text, translatedText }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async (textToAnalyze, type) => {
    if (!textToAnalyze?.trim()) return null;
    
    try {
      console.log('Analyzing text:', textToAnalyze);
      const response = await fetch('http://localhost:5001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Analysis result:', result);
        return { ...result, type };
      } else {
        console.error('API response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Analytics error:', error);
              alert('Analytics service not available. Make sure the Python service is running on port 5001.');
    }
    return null;
  };

  const handleAnalyze = async () => {
    if (!text && !translatedText) return;
    
    setLoading(true);
    const results = await Promise.all([
      text ? analyzeText(text, 'Original') : null,
      translatedText ? analyzeText(translatedText, 'Shakespearean') : null
    ]);
    
    setAnalytics(results.filter(Boolean));
    setLoading(false);
  };

  const MetricCard = ({ title, value, suffix = '', color = 'bg-amber-100' }) => (
    <div className={`${color} p-4 rounded-lg border-2 border-amber-700 text-center`}>
      <div className="text-2xl font-bold text-amber-900">{value}{suffix}</div>
      <div className="text-sm text-amber-700">{title}</div>
    </div>
  );

  if (!text && !translatedText) return null;

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-700 rounded-lg">
      <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center" 
          style={{ fontFamily: "'Press Start 2P', cursive" }}>
        📊 TEXT ANALYTICS
      </h3>
      
      {!analytics ? (
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors font-bold"
          >
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {analytics.map((data, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg border-2 border-amber-200">
              <h4 className="text-lg font-bold text-amber-800 mb-3">{data.type} Text</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard title="Words" value={data.word_count} />
                <MetricCard title="Sentences" value={data.sentence_count} />
                <MetricCard title="Avg Words/Sentence" value={data.avg_sentence_length} />
                <MetricCard 
                  title="Reading Level" 
                  value={data.readability_grade} 
                  suffix=" grade"
                  color={data.readability_grade > 12 ? 'bg-red-100' : 'bg-green-100'}
                />
                <MetricCard 
                  title="Sentiment" 
                  value={`${data.sentiment_score > 0 ? '+' : ''}${data.sentiment_score}`}
                  color={data.sentiment_score > 0 ? 'bg-green-100' : data.sentiment_score < 0 ? 'bg-red-100' : 'bg-gray-100'}
                />
                <MetricCard 
                  title="Shakespearean Style" 
                  value={data.shakespeare_score} 
                  suffix="%"
                  color="bg-purple-100"
                />
              </div>
            </div>
          ))}
          
          <div className="text-center">
            <button
              onClick={() => setAnalytics(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics; 