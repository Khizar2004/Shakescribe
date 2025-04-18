import React, { useState, useEffect } from 'react';
import candle from '../assets/candle.gif';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 1000);
  };
  
  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`p-2 rounded-none transform transition-all duration-300
                 ${isHovering ? 'scale-110' : 'scale-100'} 
                 ${isAnimating ? 'rotate-12' : ''}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAARklEQVQYlWP8////fwYGBgYGJgYKABMDhYAFXeLnr18MX75+ZeAUEGAQFRJiYPjw6RPDg4cPGYRFRBiYmZnx28TIyMjA+P//fwABmw4HUyL+aAAAAABJRU5ErkJggg==")',
        imageRendering: 'pixelated',
        border: isDarkMode ? '4px solid #f5f0e1' : '4px solid #2a2a2a',
        boxShadow: isHovering 
          ? '0 0 10px 2px rgba(255, 219, 88, 0.4)' 
          : '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="relative">
        <div className={`absolute inset-0 rounded-full bg-candlelight/30 blur-md 
                        ${isHovering ? 'animate-pulse-glow opacity-100' : 'opacity-50'}`}></div>
        
        <img 
          src={candle} 
          alt="Theme Toggle" 
          className={`h-12 relative z-10 ${isAnimating ? 'animate-pixel-spin' : 'floating-element'}`}
          style={{ 
            imageRendering: 'pixelated',
            filter: isHovering ? 'drop-shadow(0 0 8px rgba(255, 219, 88, 0.6))' : 'none',
            transformOrigin: 'center'
          }}
        />
        
        <div className="absolute -bottom-4 left-0 right-0 text-center bg-parchment dark:bg-ink-dark px-2 py-1 transform translate-y-1"
          style={{
            border: isDarkMode ? '2px solid #f5f0e1' : '2px solid #2a2a2a',
            boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          <span 
            className="font-bold text-ink dark:text-parchment"
            style={{ fontFamily: 'Press Start 2P', fontSize: '0.6rem' }}
          >
            {isDarkMode ? 'DAY' : 'NIGHT'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle; 