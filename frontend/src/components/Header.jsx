import React from 'react';
import logo from '../assets/logo.png';
import candle from '../assets/candle.gif';

const Header = () => {
  return (
    <header className="text-center relative py-2">
      <div className="flex justify-center items-center relative">
        <div className="relative">
          <img 
            src={logo} 
            alt="ShakeScribe Logo" 
            className="h-28 mx-auto mb-4 floating-element"
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 10px rgba(255, 219, 88, 0.7))'
            }}
          />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-candlelight rounded-full blur-sm animate-pulse-glow"></div>
        </div>
      </div>
      
      <div className="mt-6 px-8 py-5 bg-parchment dark:bg-ink inline-block mx-auto max-w-2xl transform hover:scale-105 transition-all duration-300"
        style={{
          border: '4px solid #2a2a2a',
          boxShadow: '5px 5px 0px 0px rgba(0, 0, 0, 0.3)'
        }}
      >
        <h1 className="font-bold" 
          style={{ 
            fontFamily: 'Press Start 2P', 
            fontSize: '1rem', 
            lineHeight: '1.7',
            textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
          }}
        >
          Transform Modern English<br />into the Eloquent Prose of Shake­speare
        </h1>
      </div>
      
      <div className="absolute top-0 left-4 floating-element" style={{ animationDelay: '0.5s' }}>
        <img 
          src={candle} 
          alt="Animated Candle" 
          className="h-16 transform -scale-x-100"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 10px rgba(255, 219, 88, 0.7))'
          }}
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-2 bg-candlelight rounded-full blur-sm animate-pulse-glow"></div>
      </div>
      
      <div className="absolute top-0 right-4 floating-element">
        <img 
          src={candle} 
          alt="Animated Candle" 
          className="h-16"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 10px rgba(255, 219, 88, 0.7))'
          }}
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-2 bg-candlelight rounded-full blur-sm animate-pulse-glow"></div>
      </div>
    </header>
  );
};

export default Header; 