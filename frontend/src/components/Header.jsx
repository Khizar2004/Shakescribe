import React from 'react';
import logo from '../assets/logo.png';
import candle from '../assets/candle.gif';

const Header = () => {
  return (
    <header className="text-center relative py-8 overflow-hidden pixel-art bg-wooden-texture">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139, 69, 19, 0.1) 1px, rgba(139, 69, 19, 0.1) 4px)'
      }}></div>

      {/* Main Logo Section */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-center items-center gap-6">
          <div className="relative group">
            <img 
              src={logo} 
              alt="ShakeScribe Logo" 
              className="h-72 mx-auto mb-4 floating-element"
              style={{ 
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 0 15px rgba(255, 219, 88, 0.9))',
                transform: 'translateZ(0)'
              }}
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-4 bg-yellow-400/50 rounded-full blur-md animate-pulse-glow"></div>
          </div>
        </div>

        {/* Enhanced Title Card */}
        <div className="mt-6 px-8 py-6 bg-parchment inline-block mx-auto border-6 border-ink transform hover:scale-105 transition-all duration-300 pixel-border relative shadow-vintage">
          <div className="absolute -inset-4 border-4 border-ink/30 pointer-events-none"></div>
          <h1 
            className="font-bold text-ink mb-2 tracking-wide" 
            style={{ 
              fontFamily: "'Press Start 2P', cursive", 
              fontSize: '1.8rem',
              lineHeight: '1.3',
              textShadow: `
                3px 3px 0 rgba(0,0,0,0.25),
                -1px -1px 0 rgba(255,255,255,0.3)
              `,
              imageRendering: 'pixelated',
              letterSpacing: '2px'
            }}
          >
            <span className="block mb-3 text-amber-700/90">Transform Modern English</span>
            <span className="text-3xl text-crimson animate-text-glow">into Shakespearean Verse</span>
          </h1>
        </div>
      </div>

      {/* Enhanced Candle Elements */}
      <div className="absolute top-4 left-4 floating-element" style={{ animationDelay: '0.5s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
        <img 
          src={candle} 
          alt="Animated Candle" 
          className="h-24 transform -scale-x-100 pixelated"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'brightness(1.1) contrast(1.2)'
          }}
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-3 bg-yellow-400/50 rounded-full blur-sm animate-pulse-glow"></div>
      </div>
      
      <div className="absolute top-4 right-4 floating-element" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
        <img 
          src={candle} 
          alt="Animated Candle" 
          className="h-28 pixelated"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'brightness(1.1) contrast(1.2)'
          }}
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-3 bg-yellow-400/50 rounded-full blur-sm animate-pulse-glow"></div>
      </div>

      {/* Pixel Art Decorative Borders */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-900/70 pattern-cross-dots-xl"></div>
      <div className="absolute top-0 left-0 right-0 h-4 bg-amber-900/70 pattern-cross-dots-xl"></div>

      <style jsx global>{`
        .pixel-border {
          box-shadow: 
            8px 8px 0px 0px rgba(0, 0, 0, 0.3),
            inset 3px 3px 0px rgba(255, 255, 255, 0.3);
        }

        .shadow-vintage {
          filter: drop-shadow(4px 4px 6px rgba(0,0,0,0.2));
        }

        .pattern-cross-dots-xl {
          background-image: 
            radial-gradient(currentColor 20%, transparent 20%),
            radial-gradient(currentColor 20%, transparent 20%);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 8px rgba(188, 71, 54, 0.6); }
          50% { text-shadow: 0 0 12px rgba(188, 71, 54, 0.8); }
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .bg-wooden-texture {
          background: linear-gradient(45deg, #915f36 0%, #c69c6d 100%);
          background-image: 
            repeating-linear-gradient(45deg, 
              rgba(0,0,0,0.05) 0px, 
              rgba(0,0,0,0.05) 2px, 
              transparent 2px, 
              transparent 4px);
        }

        .bg-parchment {
          background: #f5e6d3;
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
    </header>
  );
};

export default Header;