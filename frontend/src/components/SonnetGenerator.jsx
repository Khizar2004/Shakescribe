import React, { useState, useRef, useEffect } from 'react';
import { generateSonnet } from '../utils/api';
import sonnetButton from '../assets/sonnetbutton.png';
import scrollBg from '../assets/scroll.png';
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
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isScrollOpen]);

  return (
    <section 
      className="transform transition-all hover:translate-y-[-2px]"
      style={{
        backgroundImage: `url(${scrollBg})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        padding: '3rem',
        border: 'none'
      }}
    >
      <h2 className="pixel-header flex items-center justify-center gap-3">
        <div className="floating-element" style={{ animationDuration: '5s' }}>
          <img 
            src={quill} 
            alt="Quill" 
            className="h-8 transform rotate-12" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 4px rgba(75, 124, 176, 0.6))'
            }} 
          />
        </div>
        <span className="text-center text-2xl font-bold tracking-wide" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>GENERATE A SONNET</span>
        <div className="floating-element" style={{ animationDelay: '0.7s' }}>
          <img 
            src={inkpot} 
            alt="Inkpot" 
            className="h-8" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 4px rgba(42, 42, 42, 0.6))'
            }} 
          />
        </div>
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 items-end mt-8">
        <div className="flex-grow">
          <label 
            htmlFor="sonnet-topic" 
            className="block mb-3 font-medium px-3 py-2 bg-parchment dark:bg-ink-dark inline-block border-b-4 border-ink dark:border-parchment-light"
            style={{ fontFamily: 'Press Start 2P', fontSize: '0.9rem' }}
          >
            Topic or Theme
          </label>
          <input
            id="sonnet-topic"
            type="text"
            className="pixel-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., love, friendship, autumn)..."
            style={{
              backgroundColor: 'rgba(245, 240, 225, 1)',
              border: '4px solid #2a2a2a',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
        
        <div className="flex flex-col items-center">
          <button
            onClick={handleGenerateSonnet}
            className="relative w-32 h-16 flex items-center justify-center border-4 border-brown-800 bg-parchment-light"
            style={{ 
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
              imageRendering: 'pixelated'
            }}
            aria-label="Generate sonnet"
          >
            <span 
              className="text-ink font-bold tracking-wide"
              style={{ 
                fontFamily: 'Press Start 2P', 
                fontSize: '0.7rem',
                textShadow: '1px 1px 0 rgba(0,0,0,0.2)'
              }}
            >
              GENERATE
              <br/>
              SONNET
            </span>
          </button>
          
          <div 
            className="mt-2 px-4 py-2 bg-candlelight text-ink border-2 border-brown-800"
            style={{ 
              fontFamily: 'Press Start 2P', 
              fontSize: '0.6rem',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.3)'
            }}
          >
            CLICK TO GENERATE
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-3 bg-red-500 border-2 border-red-700 text-center" style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}>
          <p style={{ fontFamily: 'Press Start 2P', fontSize: '0.8rem', color: 'white' }}>{error}</p>
        </div>
      )}
      
      {(isScrollOpen || isUnfolding) && (
        <div className="mt-10 relative" ref={scrollRef}>
          <div 
            className={`p-10 transition-all duration-1000 ease-in-out
                       ${isUnfolding ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            style={{
              backgroundImage: `url(${scrollBg})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '400px',
              imageRendering: 'pixelated',
              transformOrigin: 'top center',
              filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.4))'
            }}
          >
            <h3 
              className="text-2xl font-bold mb-6 text-center italic text-ink"
              style={{ fontFamily: 'IM Fell English', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
            >
              A Sonnet on {topic}
            </h3>
            
            <div 
              className="whitespace-pre-line font-serif leading-relaxed text-ink max-w-2xl mx-auto text-center"
              style={{ fontFamily: 'IM Fell English', fontSize: '1.2rem', fontWeight: '500' }}
            >
              {sonnet}
            </div>
            
            <div className="mt-8 text-center">
              <img 
                src={quill} 
                alt="Quill signature" 
                className="h-10 inline-block transform -rotate-12" 
                style={{ 
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.5))'
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SonnetGenerator; 