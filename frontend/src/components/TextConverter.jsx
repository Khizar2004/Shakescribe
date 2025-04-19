import React, { useState } from 'react';
import { translateText } from '../utils/api';
import bardifyButton from '../assets/bradifybutton.png';
import quill from '../assets/quill.png';
import inkpot from '../assets/inkpot.png';
import scroll from '../assets/scroll.png';

const TextConverter = ({ setIsLoading }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [animateQuill, setAnimateQuill] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Pray, entereth some text to translate!');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      setAnimateQuill(true);
      
      const response = await translateText(inputText);
      setOutputText(response.translated_text);
    } catch (err) {
      setError(err.message || 'Translation failed! Try once more, good sir/madam!');
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimateQuill(false), 2000);
    }
  };

  return (
    <section 
      className="transform transition-all hover:translate-y-[-2px] relative pixel-art-section"
      style={{
        backgroundImage: `linear-gradient(to bottom right, 
          rgba(245, 230, 200, 0.9) 0%, 
          rgba(245, 230, 200, 0.95) 100%),
          url(${scroll})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '4rem 2rem',
        border: '6px solid #3a2c28',
        boxShadow: `
          12px 12px 0 rgba(0,0,0,0.2),
          inset 3px 3px 4px rgba(255,255,255,0.3)
        `,
        imageRendering: 'pixelated'
      }}
    >
      {/* Decorative Corner Elements */}
      <div className="absolute top-2 left-2 w-8 h-8 border-4 border-ink transform rotate-45 opacity-60"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-4 border-ink transform rotate-45 opacity-60"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-ink transform rotate-45 opacity-60"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-4 border-ink transform rotate-45 opacity-60"></div>

      <h2 className="pixel-header flex items-center justify-center gap-4 mb-8">
        <div className={`relative ${animateQuill ? 'animate-quill-dip' : ''}`}>
          <img 
            src={quill} 
            alt="Quill" 
            className="h-12 floating-element" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 8px rgba(75, 124, 176, 0.8))',
              transform: 'rotate(-15deg)'
            }} 
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-blue-400/30 blur-sm animate-pulse-glow"></div>
        </div>
        <span className="text-center text-3xl font-bold tracking-wider text-ink" style={{ 
          fontFamily: "'Press Start 2P', cursive",
          textShadow: `
            3px 3px 0 rgba(0,0,0,0.25),
            -1px -1px 0 rgba(255,255,255,0.3)
          `,
          position: 'relative',
          background: 'linear-gradient(to right, #6b4f4a, #3a2c28)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          BARDIFY THY TEXT
        </span>
        <div className="relative group">
          <img 
            src={inkpot} 
            alt="Inkpot" 
            className="h-12 glowing-element transition-transform group-hover:scale-110" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 8px rgba(42, 42, 42, 0.8))'
            }} 
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-2 bg-amber-600/30 blur-sm animate-pulse-glow"></div>
        </div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 px-4">
        {/* Modern English Input */}
        <div className="flex flex-col h-full relative">
          <label 
            htmlFor="modern-text" 
            className="pixel-label mb-4 transform -skew-x-6 self-start px-6 py-2 bg-parchment"
          >
            <span className="block skew-x-6">Modern English</span>
          </label>
          <textarea
            id="modern-text"
            className="pixel-textarea flex-grow hover:scale-[1.02] transition-transform"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter thy modern text here..."
          />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-4 border-ink opacity-30"></div>
        </div>
        
        {/* Shakespearean Output */}
        <div className="flex flex-col h-full relative">
          <label 
            htmlFor="shakespeare-text" 
            className="pixel-label mb-4 transform skew-x-6 self-end px-6 py-2 bg-parchment"
          >
            <span className="block -skew-x-6">Shakespearean</span>
          </label>
          <textarea
            id="shakespeare-text"
            className="pixel-textarea flex-grow hover:scale-[1.02] transition-transform"
            value={outputText}
            readOnly
            placeholder="Thy translated verse shall appear here..."
          />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-4 border-ink opacity-30"></div>
        </div>
      </div>
      
      {error && (
        <div className="mt-8 p-4 bg-red-600 border-4 border-red-800 text-center pixel-error" style={{ 
          boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-600 border-4 border-red-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">!</span>
          </div>
          <p className="pixel-error-text">{error}</p>
        </div>
      )}
      
      <div className="mt-12 text-center relative">
        <button
          onClick={handleTranslate}
          className="transition-all hover:scale-110 active:scale-95 relative group"
          aria-label="Translate text"
        >
          <img 
            src={bardifyButton} 
            alt="Bardify" 
            className="h-44 cursor-pointer relative z-10 pixelated transition-all duration-300 group-hover:brightness-110" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 20px rgba(100, 70, 40, 0.5))'
            }} 
          />
          <div className="absolute inset-0 bg-amber-400/20 blur-xl group-hover:opacity-50 transition-opacity"></div>
        </button>
      </div>

      <style jsx global>{`
        .pixel-textarea {
          background: rgba(245, 240, 225, 1);
          border: 6px solid #3a2c28;
          box-shadow: 
            8px 8px 0px 0px rgba(0, 0, 0, 0.3),
            inset 3px 3px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          font-family: 'Press Start 2P', cursive;
          font-size: 0.9rem;
          line-height: 1.6;
          image-rendering: pixelated;
          color: #2a2a2a !important;
        }

        .pixel-label {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          border: 4px solid #3a2c28;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
          background: #f5e6d3;
          position: relative;
          z-index: 1;
          color: #2a2a2a !important;
        }

        .pixel-error-text {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.8rem;
          color: #fff;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
          margin-top: 0.5rem;
        }

        @keyframes quill-dip {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(8px) rotate(-25deg); }
        }

        .animate-quill-dip {
          animation: quill-dip 1.5s ease-in-out infinite;
        }

        .pixel-art-section {
          background-image: 
            linear-gradient(to bottom right, 
              transparent 50%, rgba(0,0,0,0.03) 50%),
            repeating-linear-gradient(-45deg, 
              rgba(0,0,0,0.05) 0px, 
              rgba(0,0,0,0.05) 2px, 
              transparent 2px, 
              transparent 4px);
        }
      `}</style>
    </section>
  );
};

export default TextConverter;