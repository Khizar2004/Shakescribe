import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TextConverter from './components/TextConverter';
import SonnetGenerator from './components/SonnetGenerator';
import ThemeToggle from './components/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './hooks/useTheme';
import backgroundLight from './assets/background-light.png';
import backgroundDark from './assets/background-dark.png';
import candle from './assets/candle.gif';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate random stars for the night sky in dark mode
  useEffect(() => {
    if (isDarkMode) {
      const newStars = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.5,
        animationDelay: Math.random() * 3 + 's',
      }));
      setStars(newStars);
    }
  }, [isDarkMode]);

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}
      style={{
        backgroundImage: `url(${isDarkMode ? backgroundDark : backgroundLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated'
      }}
    >
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute glowing-element"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: '#fff',
                borderRadius: '50%',
                opacity: star.alpha,
                animationDelay: star.animationDelay,
                boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.7)',
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-5xl relative">
        {/* Wall-mounted candle on the right */}
        <div className="absolute top-20 right-0 z-10 hidden md:block">
          <img 
            src={candle} 
            alt="Wall Candle" 
            className="h-24"
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 0 12px rgba(255, 219, 88, 0.8))'
            }}
          />
        </div>
        
        {/* Header section with logo and title */}
        <div className="mb-12">
          <Header />
        </div>
        
        {/* Main content in a wooden/parchment container */}
        <main className="mt-8 grid grid-cols-1 gap-16">
          <TextConverter setIsLoading={setIsLoading} />
          <SonnetGenerator setIsLoading={setIsLoading} />
        </main>
        
        {/* Theme toggle button */}
        <div className="fixed bottom-6 right-6 z-10">
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>

        <LoadingSpinner isLoading={isLoading} />
        
        {/* Pixel-art footer */}
        <footer className="mt-16 text-center p-4 bg-parchment dark:bg-ink"
          style={{
            border: '4px solid #2a2a2a',
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.3)'
          }}
        >
          <p className="font-bold" 
             style={{ 
               fontFamily: 'Press Start 2P', 
               fontSize: '0.7rem',
               color: isDarkMode ? '#f5f0e1' : '#2a2a2a'
             }}>
            Created with <span style={{ color: '#e91e63' }}>❤</span> by Khizar
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App; 