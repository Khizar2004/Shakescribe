import React, { useState, useRef, useEffect } from 'react';
import { generateSonnet } from '../utils/api';
import sonnetButton from '../assets/sonnetbutton.png';
import longScrollBg from '../assets/longscroll.png';
import quill from '../assets/quill.png';
import inkpot from '../assets/inkpot.png';

const SonnetGenerator = ({ setIsLoading }) => {
  const [topic, setTopic] = useState('');
  const [currentSonnetTopic, setCurrentSonnetTopic] = useState('');
  const [sonnet, setSonnet] = useState('');
  const [error, setError] = useState('');
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const scrollRef = useRef(null);

  const handleGenerateSonnet = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your sonnet');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      
      const response = await generateSonnet(topic);
      
      // Clean up sonnet text to remove duplicate title if present
      let cleanedSonnet = response.sonnet;
      const titlePattern = new RegExp(`\\*\\*Sonnet on ${topic}\\*\\*`, 'i');
      cleanedSonnet = cleanedSonnet.replace(titlePattern, '').trim();
      
      // Store current topic for display
      setCurrentSonnetTopic(topic);
      setSonnet(cleanedSonnet);
      setIsUnfolding(true);
      setTimeout(() => {
        setIsScrollOpen(true);
        setIsUnfolding(false);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to generate sonnet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isScrollOpen && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isScrollOpen]);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl transform transition-all hover:translate-y-[-2px] relative">
        {/* Main Scroll Container */}
        <div 
          className="flex flex-col items-center relative"
          style={{
            backgroundImage: `url(${longScrollBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
            paddingTop: '90px',
            paddingBottom: '180px',
            paddingLeft: '80px',
            paddingRight: '80px',
            minHeight: isScrollOpen ? '1200px' : '650px',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))',
          }}
        >
          <div className="w-full max-w-2xl">
            {/* Header */}
            <h2 
              className="text-center text-ink relative -mt-10"
              style={{ 
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '2.2rem',
                fontWeight: 'bold',
                textShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                letterSpacing: '3px',
                color: '#2a2a2a',
                transform: 'translateY(5px)'
              }}
            >
              <span className="block text-xl mb-1">✧</span>
              THE SONNET SCROLL
              <span className="block text-xl mt-1">✧</span>
            </h2>

            {/* Input Section */}
            <div className="flex flex-col w-full items-center space-y-6 mt-10">
              <label 
                htmlFor="sonnet-topic" 
                className="block mb-4 px-4 py-3 bg-opacity-80 bg-parchment w-full text-center"
                style={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '1rem',
                  border: '4px solid #2a2a2a',
                  borderRadius: '8px',
                  boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 0.2)',
                  color: '#2a2a2a'
                }}
              >
                What shall I write about?
              </label>
              
              <input
                id="sonnet-topic"
                type="text"
                className="w-full hover:scale-[1.02] transition-transform"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic..."
                style={{
                  backgroundColor: 'rgba(245, 240, 225, 0.9)',
                  border: '4px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '1rem',
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '1rem',
                  boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  color: '#2a2a2a'
                }}
              />

              {/* Generate Button */}
              <button
                onClick={handleGenerateSonnet}
                className="transition-all hover:scale-110 active:scale-95 relative group mb-8 mt-6"
                aria-label="Generate sonnet"
              >
                <img 
                  src={sonnetButton} 
                  alt="Generate Sonnet" 
                  className="h-36 cursor-pointer relative z-10 hover:brightness-110" 
                  style={{ 
                    imageRendering: 'pixelated',
                    filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.5))'
                  }} 
                />
                <div className="absolute inset-0 bg-amber-400/20 blur-xl group-hover:opacity-50 transition-opacity"></div>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-600 border-4 border-red-800 text-center rounded-lg" 
                   style={{ 
                     boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
                     position: 'relative'
                   }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-600 border-4 border-red-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">!</span>
                </div>
                <p style={{ 
                  fontFamily: "'Press Start 2P', cursive", 
                  fontSize: '0.8rem', 
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Sonnet Display */}
            {(isScrollOpen || isUnfolding) && (
              <div 
                ref={scrollRef}
                className={`w-full transition-all duration-1000 ease-in-out mt-6 mb-16 p-6 bg-parchment/90 border-4 border-ink
                         ${isUnfolding ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                style={{
                  borderColor: "#2a2a2a",
                  borderRadius: "4px",
                  boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 0.3)"
                }}
              >
                <h3 
                  className="text-2xl font-bold mb-6 text-center"
                  style={{ 
                    fontFamily: "'Press Start 2P', cursive",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                    color: '#2a2a2a'
                  }}
                >
                  A Sonnet on {currentSonnetTopic}
                </h3>
                
                <div className="text-center text-2xl mb-4 opacity-75" style={{ color: '#2a2a2a' }}>❝</div>
                
                <div 
                  className="whitespace-pre-line mx-auto text-center leading-relaxed"
                  style={{ 
                    fontFamily: "'Crimson Text', serif",
                    fontSize: '1.25rem',
                    lineHeight: '1.6',
                    maxWidth: '85%',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    color: '#2a2a2a'
                  }}
                >
                  {sonnet}
                </div>
                
                <div className="text-center text-2xl mt-4 opacity-75" style={{ color: '#2a2a2a' }}>❞</div>
                
                <div className="flex justify-end w-full pr-8 mt-10">
                  <img 
                    src={quill} 
                    alt="Quill signature" 
                    className="h-12 transform -rotate-12" 
                    style={{ 
                      filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.4))',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SonnetGenerator;