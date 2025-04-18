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
      setError('Please enter some text to translate');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      setAnimateQuill(true);
      
      const response = await translateText(inputText);
      setOutputText(response.translated_text);
    } catch (err) {
      setError(err.message || 'Failed to translate. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimateQuill(false), 2000);
    }
  };

  return (
    <section 
      className="transform transition-all hover:translate-y-[-2px]"
      style={{
        backgroundImage: `url(${scroll})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        padding: '3rem',
        border: 'none'
      }}
    >
      <h2 className="pixel-header flex items-center justify-center gap-3">
        <div className={`transition-transform ${animateQuill ? 'animate-pixel-spin' : ''}`}>
          <img 
            src={quill} 
            alt="Quill" 
            className="h-8 floating-element" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 4px rgba(75, 124, 176, 0.6))',
              animationDuration: '6s'
            }} 
          />
        </div>
        <span className="text-center text-2xl font-bold tracking-wide text-ink" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>BARDIFY YOUR TEXT</span>
        <div className="floating-element" style={{ animationDelay: '0.5s' }}>
          <img 
            src={inkpot} 
            alt="Inkpot" 
            className="h-8 glowing-element" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 4px rgba(42, 42, 42, 0.6))'
            }} 
          />
        </div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="flex flex-col h-full">
          <label 
            htmlFor="modern-text" 
            className="block mb-3 font-medium px-3 py-2 bg-parchment dark:bg-ink-dark inline-block border-b-4 border-ink dark:border-parchment-light"
            style={{ fontFamily: 'Press Start 2P', fontSize: '0.9rem' }}
          >
            Modern English
          </label>
          <textarea
            id="modern-text"
            className="text-area flex-grow"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your modern text here..."
            style={{
              backgroundColor: 'rgba(245, 240, 225, 1)',
              border: '4px solid #2a2a2a',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
        
        <div className="flex flex-col h-full">
          <label 
            htmlFor="shakespeare-text" 
            className="block mb-3 font-medium px-3 py-2 bg-parchment dark:bg-ink-dark inline-block border-b-4 border-ink dark:border-parchment-light"
            style={{ fontFamily: 'Press Start 2P', fontSize: '0.9rem' }}
          >
            Shakespearean English
          </label>
          <textarea
            id="shakespeare-text"
            className="text-area flex-grow"
            value={outputText}
            readOnly
            placeholder="Translated text will appear here..."
            style={{
              backgroundColor: 'rgba(245, 240, 225, 1)',
              border: '4px solid #2a2a2a',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-3 bg-red-500 border-2 border-red-700 text-center" style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}>
          <p style={{ fontFamily: 'Press Start 2P', fontSize: '0.8rem', color: 'white' }}>{error}</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button
          onClick={handleTranslate}
          className="transition-all hover:scale-110 active:scale-95 relative group"
          aria-label="Translate text"
        >
          <img 
            src={bardifyButton} 
            alt="Bardify" 
            className="h-32 cursor-pointer relative z-10" 
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.7))'
            }} 
          />
        </button>
      </div>
    </section>
  );
};

export default TextConverter; 