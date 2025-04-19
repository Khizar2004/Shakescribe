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
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl transform transition-all hover:translate-y-[-2px] relative">
        {/* Decorative Top Elements */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          <img 
            src={inkpot} 
            alt="Inkpot" 
            className="h-16 animate-float" 
            style={{ filter: 'drop-shadow(0 8px 4px rgba(0,0,0,0.3))' }}
          />
        </div>

        {/* Main Scroll Container */}
        <div 
          className="flex flex-col items-center relative transform rotate-1 transition-transform duration-300 hover:rotate-0"
          style={{
            backgroundImage: `url(${longScrollBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'crisp-edges',
            paddingTop: '140px',
            paddingBottom: '140px',
            paddingLeft: '80px',
            paddingRight: '80px',
            minHeight: isScrollOpen ? '1100px' : '650px',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))',
          }}
        >
          <div className="w-full max-w-2xl">
            {/* Enhanced Header */}
            <h2 
              className="text-center text-ink relative -mt-24"
              style={{ 
                fontFamily: "'Crimson Text', serif",
                fontSize: '3.2rem',
                fontWeight: 'bold',
                textShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                letterSpacing: '3px',
                transform: 'translateY(-20px)',
                color: '#2a2a2a'
              }}
            >
              <span className="block text-3xl mb-1" style={{ fontFamily: "'MedievalSharp', cursive" }}>✧ The</span>
              SONNET SCROLL
            </h2>

            {/* Input Section */}
            <div className="flex flex-col w-full items-center space-y-6 mt-10">
              <label 
                htmlFor="sonnet-topic" 
                className="block mb-4 px-4 py-3 bg-opacity-80 bg-parchment w-full text-center transition-all hover:scale-105"
                style={{ 
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: '1.4rem',
                  border: '3px solid #2a2a2a',
                  borderRadius: '8px',
                  boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 0.2)'
                }}
              >
                What shall I write about?
              </label>
              
              <input
                id="sonnet-topic"
                type="text"
                className="w-full transition-all focus:scale-102"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic..."
                style={{
                  backgroundColor: 'rgba(245, 240, 225, 0.9)',
                  border: '4px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '1rem',
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: '1.2rem',
                  boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
              />

              {/* Enhanced Generate Button */}
              <button
                onClick={handleGenerateSonnet}
                className="transition-all hover:scale-110 active:scale-95 relative group mb-8"
                aria-label="Generate sonnet"
              >
                <div className="absolute inset-0 bg-gold-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src={sonnetButton} 
                  alt="Generate Sonnet" 
                  className="h-24 cursor-pointer relative z-10 hover:brightness-110" 
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.5))'
                  }} 
                />
                <div className="absolute inset-0 animate-shine opacity-0 group-hover:opacity-30"></div>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/90 border-4 border-red-700 text-center backdrop-blur-sm rounded-lg" 
                   style={{ 
                     boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
                     animation: 'errorShake 0.4s ease'
                   }}>
                <p style={{ 
                  fontFamily: "'Crimson Pro', serif", 
                  fontSize: '1.1rem', 
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  ✖ {error}
                </p>
              </div>
            )}

            {/* Sonnet Display */}
            {(isScrollOpen || isUnfolding) && (
              <div 
                ref={scrollRef}
                className={`w-full transition-all duration-1000 ease-in-out mt-8
                           ${isUnfolding ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
              >
                <h3 
                  className="text-3xl font-bold mb-6 text-center text-ink"
                  style={{ 
                    fontFamily: "'Crimson Text', serif",
                    textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
                    letterSpacing: '1px'
                  }}
                >
                  A Sonnet on {currentSonnetTopic}
                </h3>
                
                <div className="text-center text-ink text-2xl mb-4 opacity-75">❝</div>
                
                <div 
                  className="whitespace-pre-line mx-auto text-center leading-relaxed"
                  style={{ 
                    fontFamily: "'Crimson Text', serif",
                    fontSize: '1.25rem',
                    lineHeight: '1.6',
                    maxWidth: '85%',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {sonnet}
                </div>
                
                <div className="text-center text-ink text-2xl mt-4 opacity-75">❞</div>
                
                <div className="flex justify-end w-full pr-8 mt-10 animate-quillGlide">
                  <img 
                    src={quill} 
                    alt="Quill signature" 
                    className="h-14 transform -rotate-12" 
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

        {/* Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-300/15 rounded-full blur-2xl mix-blend-multiply"></div>
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes quillGlide {
          0% { transform: translateX(20px) rotate(-12deg); }
          100% { transform: translateX(0) rotate(-12deg); }
        }
        .animate-quillGlide {
          animation: quillGlide 1.2s ease-out;
        }
        .animate-shine {
          background: linear-gradient(45deg,
            transparent 25%,
            rgba(255,255,255,0.3) 50%,
            transparent 75%
          );
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default SonnetGenerator;