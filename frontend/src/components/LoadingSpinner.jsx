import React, { useEffect, useState } from 'react';
import quill from '../assets/quill.png';
import inkpot from '../assets/inkpot.png';
import scrollBg from '../assets/scroll.png';

const LoadingSpinner = ({ isLoading }) => {
  const [loadingText, setLoadingText] = useState('The scribe is writing');
  const [dots, setDots] = useState('');
  
  // Animated loading text
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div 
        className="text-center relative overflow-hidden p-10"
        style={{
          backgroundImage: `url(${scrollBg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '350px',
          height: '350px',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.7))'
        }}
      >
        {/* Ink splatter animation */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-3 h-3 bg-ink-dark dark:bg-parchment-dark rounded-full animate-float" 
              style={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="flex justify-center mb-8 mt-4">
          <div className="relative">
            <img 
              src={inkpot} 
              alt="Inkpot" 
              className="h-12 absolute -left-6 bottom-0 floating-element"
              style={{ 
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.6))',
                animationDuration: '3s' 
              }}
            />
            <img 
              src={quill} 
              alt="Quill Writing" 
              className="h-16 animate-pixel-spin"
              style={{ 
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 0 8px rgba(75, 124, 176, 0.7))',
                transformOrigin: 'bottom center',
                animationDuration: '2s'
              }} 
            />
          </div>
        </div>
        
        <div className="bg-parchment dark:bg-ink p-3"
          style={{
            border: '4px solid #2a2a2a',
            boxShadow: '5px 5px 0px 0px rgba(0, 0, 0, 0.4)'
          }}
        >
          <p 
            className="text-ink dark:text-parchment glowing-element"
            style={{ 
              fontFamily: 'Press Start 2P', 
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              lineHeight: '1.4',
              textShadow: '1px 1px 0 rgba(0,0,0,0.3)'
            }}
          >
            {loadingText}{dots}
          </p>
        </div>
        
        <div className="mt-8 h-4 relative overflow-hidden"
          style={{
            border: '3px solid #2a2a2a',
            boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.4)',
            backgroundColor: 'rgba(245, 240, 225, 1)'
          }}
        >
          <div 
            className="absolute h-full bg-candlelight"
            style={{ 
              width: '30%', 
              animation: 'loading 1.5s infinite',
              boxShadow: '0 0 10px 3px rgba(255, 219, 88, 0.6)'
            }}
          ></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 