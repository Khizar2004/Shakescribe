import React, { useState, useRef, useEffect } from 'react';
import { generateSonnet } from '../utils/api';
import sonnetButton from '../assets/sonnetbutton.png';
import longScrollBg from '../assets/longscroll.png';
import quill from '../assets/quill.png';
import inkpot from '../assets/inkpot.png';

const SonnetGenerator = ({ setIsLoading }) => {
  const [topic, setTopic] = useState('');
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
      setSonnet(response.sonnet);
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
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl transform transition-all hover:translate-y-[-2px]">
        <div 
          className="flex flex-col items-center relative"
          style={{
            backgroundImage: `url(${longScrollBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
            paddingTop: '120px',
            paddingBottom: '120px',
            paddingLeft: '60px',
            paddingRight: '60px',
            minHeight: isScrollOpen ? '1000px' : '600px',
          }}
        >
          <div className="w-full max-w-2xl">
            <h2 className="text-center text-2xl font-bold tracking-wide text-ink mb-8" 
                style={{ 
                  fontFamily: 'Press Start 2P', 
                  fontSize: '1.2rem',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                }}>
              SONNET SCROLL
            </h2>
            
            <div className="flex flex-col w-full items-center">
              <label 
                htmlFor="sonnet-topic" 
                className="block mb-3 font-medium px-3 py-2 bg-parchment dark:bg-ink-dark inline-block border-b-4 border-ink dark:border-parchment-light w-full text-center"
                style={{ fontFamily: 'Press Start 2P', fontSize: '0.9rem' }}
              >
                What shall I write about?
              </label>
              <input
                id="sonnet-topic"
                type="text"
                className="pixel-input mb-6 w-full"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic..."
                style={{
                  backgroundColor: 'rgba(245, 240, 225, 0.8)',
                  border: '4px solid #2a2a2a',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.3)',
                  fontFamily: 'VT323, monospace',
                  fontSize: '1.2rem'
                }}
              />
              
              <button
                onClick={handleGenerateSonnet}
                className="transition-all hover:scale-110 active:scale-95 relative group mb-8"
                aria-label="Generate sonnet"
              >
                <img 
                  src={sonnetButton} 
                  alt="Generate Sonnet" 
                  className="h-16 cursor-pointer relative z-10" 
                  style={{ 
                    imageRendering: 'pixelated',
                    filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.7))'
                  }} 
                />
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-500 border-2 border-red-700 text-center" style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}>
                <p style={{ fontFamily: 'Press Start 2P', fontSize: '0.8rem', color: 'white' }}>{error}</p>
              </div>
            )}
            
            {(isScrollOpen || isUnfolding) && (
              <div 
                ref={scrollRef}
                className={`w-full transition-all duration-1000 ease-in-out mt-4
                           ${isUnfolding ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
              >
                <h3 
                  className="text-xl font-bold mb-2 text-center italic text-ink"
                  style={{ fontFamily: 'IM Fell English', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
                >
                  A Sonnet on {topic}
                </h3>
                
                <div className="text-center text-ink text-lg mb-2">
                  """
                </div>
                
                <div 
                  className="whitespace-pre-line font-serif leading-relaxed text-ink mx-auto text-center"
                  style={{ 
                    fontFamily: 'IM Fell English', 
                    fontSize: '1rem', 
                    lineHeight: '1.3',
                    maxWidth: '95%' 
                  }}
                >
                  {sonnet}
                </div>
                
                <div className="text-center text-ink text-lg mt-2">
                  """
                </div>
                
                <div className="flex justify-end w-full pr-4 mt-6">
                  <img 
                    src={quill} 
                    alt="Quill signature" 
                    className="h-8 transform -rotate-12" 
                    style={{ 
                      imageRendering: 'pixelated',
                      filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.5))'
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements - candles at the sides */}
      <div className="hidden md:flex justify-between w-full absolute pointer-events-none" style={{ maxWidth: '800px' }}>
        <div className="transform -translate-x-16">
          <div className="h-8 w-8 bg-amber-500 rounded-sm animate-pulse-glow"
               style={{ filter: 'drop-shadow(0 0 15px rgba(255, 166, 0, 0.8))' }}></div>
        </div>
        <div className="transform translate-x-16">
          <div className="h-8 w-8 bg-amber-500 rounded-sm animate-pulse-glow"
               style={{ filter: 'drop-shadow(0 0 15px rgba(255, 166, 0, 0.8))' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SonnetGenerator; 