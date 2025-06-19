import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

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

  // Prepare data for charts
  const prepareChartData = () => {
    if (!analytics || analytics.length === 0) return null;

    // Comparison bar chart data
    const comparisonData = [
      {
        metric: 'Words',
        Original: analytics[0]?.word_count || 0,
        Shakespearean: analytics[1]?.word_count || analytics[0]?.word_count || 0
      },
      {
        metric: 'Sentences', 
        Original: analytics[0]?.sentence_count || 0,
        Shakespearean: analytics[1]?.sentence_count || analytics[0]?.sentence_count || 0
      },
      {
        metric: 'Avg Length',
        Original: analytics[0]?.avg_sentence_length || 0,
        Shakespearean: analytics[1]?.avg_sentence_length || analytics[0]?.avg_sentence_length || 0
      },
      {
        metric: 'Reading Level',
        Original: (analytics[0]?.readability_grade || 0),
        Shakespearean: (analytics[1]?.readability_grade || analytics[0]?.readability_grade || 0)
      }
    ];

    // Radar chart data for complexity analysis
    const radarData = [
      {
        subject: 'Words',
        Original: Math.min(100, (analytics[0]?.word_count || 0) * 10),
        Shakespearean: Math.min(100, (analytics[1]?.word_count || analytics[0]?.word_count || 0) * 10)
      },
      {
        subject: 'Complexity',
        Original: Math.min(100, Math.max(0, (analytics[0]?.readability_grade || 0) * 8)),
        Shakespearean: Math.min(100, Math.max(0, (analytics[1]?.readability_grade || analytics[0]?.readability_grade || 0) * 8))
      },
      {
        subject: 'Sentiment',
        Original: 50 + (analytics[0]?.sentiment_score || 0) * 25,
        Shakespearean: 50 + ((analytics[1]?.sentiment_score || analytics[0]?.sentiment_score || 0) * 25)
      },
      {
        subject: 'Style',
        Original: analytics[0]?.shakespeare_score || 0,
        Shakespearean: analytics[1]?.shakespeare_score || analytics[0]?.shakespeare_score || 0
      }
    ];

    // Text stats pie chart  
    const originalWords = analytics[0]?.word_count || 0;
    const shakespeareanWords = analytics[1]?.word_count || analytics[0]?.word_count || 0;
    const totalWords = originalWords + shakespeareanWords;
    
    const textStatsData = [
      { 
        name: 'Original', 
        value: originalWords, 
        color: '#f59e0b',
        percentage: totalWords > 0 ? ((originalWords / totalWords) * 100).toFixed(1) : 0
      },
      { 
        name: 'Shakespearean', 
        value: shakespeareanWords, 
        color: '#7c3aed',
        percentage: totalWords > 0 ? ((shakespeareanWords / totalWords) * 100).toFixed(1) : 0
      }
    ].filter(item => item.value > 0);

    return { comparisonData, radarData, textStatsData };
  };

  const chartData = prepareChartData();

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
              
              {/* Similar Shakespeare Quote */}
              {data.similar_quote && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                  <h5 className="text-md font-bold text-purple-800 mb-2">
                    📜 Most Similar Shakespeare Quote ({data.similar_quote.similarity_percentage}%)
                  </h5>
                  <blockquote className="text-purple-700 italic mb-2">
                    "{data.similar_quote.quote}"
                  </blockquote>
                  <p className="text-sm text-purple-600">
                    <strong>Source:</strong> {data.similar_quote.source}<br/>
                    <span className="bg-purple-100 px-2 py-1 rounded text-xs">
                      Theme: {data.similar_quote.theme}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {/* Interactive Charts Section */}
          {chartData && (
            <div className="mt-8 space-y-8">
              <h4 className="text-xl font-bold text-amber-800 text-center mb-6">📊 Visual Analytics</h4>
              
              {/* Comparison Bar Chart */}
              <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
                <h5 className="text-lg font-semibold text-amber-700 mb-4 text-center">Metrics Comparison</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Original" fill="#f59e0b" />
                    <Bar dataKey="Shakespearean" fill="#7c3aed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart for Complexity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
                  <h5 className="text-lg font-semibold text-amber-700 mb-4 text-center">Text Complexity Radar</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={chartData.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Original" dataKey="Original" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                      <Radar name="Shakespearean" dataKey="Shakespearean" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Word Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
                  <h5 className="text-lg font-semibold text-amber-700 mb-4 text-center">Word Distribution</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData.textStatsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.textStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} words (${props.payload.percentage}%)`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
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