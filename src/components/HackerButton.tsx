import React, { memo, useEffect, useState, useRef } from 'react';
import { RefreshCw, Check } from 'lucide-react';

// Define CSS styles with keyframes (refined and added shake/glow)
const BUTTON_STYLES = `
  @keyframes marquee-left {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes marquee-right {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 0.2; }
    100% { transform: translateY(250%); opacity: 0; }
  }
  @keyframes glitch {
    0% { transform: translate(0, 0); }
    20% { transform: translate(-1px, 1px); }
    40% { transform: translate(1px, -1px); }
    60% { transform: translate(-1px, 1px); }
    80% { transform: translate(1px, -1px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  @keyframes ripple-effect {
    0% { transform: scale(0); opacity: 0.7; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; transform: scale(1.1); } /* Added scale */
  }
  @keyframes glow { /* Added glow */
    0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.3); }
    50% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.6); }
  }
   @keyframes activate-shake { /* Added subtle shake */
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-1px); }
    75% { transform: translateX(1px); }
  }

  .hacker-button-marquee-left { animation: marquee-left 12s linear infinite; }
  .hacker-button-marquee-right { animation: marquee-right 10s linear infinite; }
  .hacker-button-scanline { animation: scanline 1.5s linear infinite; }
  .animate-glitch { animation: glitch 0.3s infinite steps(2, end); }
  .animate-activate-shake { animation: activate-shake 0.1s ease-in-out; }
  .terminal-cursor {
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 2px;
    height: 8px; /* Slightly taller */
    background-color: #00ff00;
    animation: blink 1s step-end infinite;
    opacity: 0; /* Hidden by default */
    transition: opacity 0.2s;
  }
  .group:hover .terminal-cursor {
      opacity: 1; /* Show on hover */
  }
  .ripple {
    position: absolute;
    inset: 0;
    background: rgba(0, 255, 0, 0.4); /* Slightly stronger */
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
    pointer-events: none; /* Prevent interference */
  }
  .group:active .ripple { /* Trigger only on active */
    animation: ripple-effect 0.4s ease-out;
  }
  .loading-ring {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border: 2px solid rgba(0, 255, 0, 0.1);
    border-top-color: #00ff00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
   .loading-glow { /* Added dedicated loading glow */
      animation: glow 1.5s linear infinite;
   }
  .binary-overlay {
    opacity: 0.05; /* Start more subtle */
    transition: opacity 0.4s ease-in-out;
  }
  .group:hover .binary-overlay {
    opacity: 0.3; /* Less intense hover opacity */
  }
  /* Delay classes remain the same */
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }

  /* Success animation flash */
  .success-flash {
      position: absolute;
      inset: -2px; /* Slightly larger */
      background: radial-gradient(ellipse at center, rgba(0,255,0,0.4) 0%, rgba(0,255,0,0) 70%);
      border-radius: 50%;
      animation: fadeOut 0.8s ease-out forwards; /* 'forwards' keeps end state */
      pointer-events: none;
  }
`;

// Define props interface
interface HackerButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDark: boolean;
  title?: string;
  className?: string; // Allow passing custom classes
  iconSize?: number; // Allow customizing icon size
}

// HackerButton component
const HackerButton = memo(({
  onClick,
  isLoading,
  isDark,
  title = 'Refresh emails',
  className = '',
  iconSize = 5, // Default size (w-5, h-5)
}: HackerButtonProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // Track click state for shake
  const prevIsLoadingRef = useRef(isLoading);

  // Detect when loading completes to trigger success animation
  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 800); // Match fadeOut duration
      return () => clearTimeout(timer);
    }
    prevIsLoadingRef.current = isLoading;
  }, [isLoading]);

  // Inject styles into the document head (same logic)
  useEffect(() => {
    const styleId = 'hacker-button-styles';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.innerHTML = BUTTON_STYLES;
      document.head.appendChild(styleSheet);
      // Optional: Cleanup function if component unmounts
      // return () => {
      //   const existingStyle = document.getElementById(styleId);
      //   if (existingStyle) {
      //     existingStyle.remove();
      //   }
      // };
    }
    // No cleanup needed if styles should persist for other instances
  }, []);

  const handleMouseDown = () => {
      setIsClicked(true);
  };

  const handleMouseUp = () => {
      // Reset shake animation trigger slightly after animation ends
      setTimeout(() => setIsClicked(false), 100);
  };

  const handleClick = () => {
    if (!isLoading) {
      onClick();
      // Note: Ripple effect is handled purely by CSS :active state now
    }
  }

  const iconColor = isDark ? 'text-green-500' : 'text-green-600';
  const iconHoverColor = 'group-hover:text-green-400';
  const iconShadow = 'group-hover:drop-shadow-[0_0_4px_rgba(0,255,0,0.8)]';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-200'; // Darker dark, lighter light
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const iconDimensions = `w-${iconSize} h-${iconSize}`;

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset if mouse leaves while pressed
      disabled={isLoading}
      className={`group relative p-2.5 rounded-full transition-all duration-300 ease-in-out overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${isDark ? 'focus-visible:ring-offset-black' : 'focus-visible:ring-offset-white'} ${bgColor} ${isLoading ? 'cursor-not-allowed opacity-70' : `${hoverBg} hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] active:scale-[0.98]`} ${isClicked && !isLoading ? 'animate-activate-shake' : ''} ${className}`} // Increased padding slightly
      title={title}
      aria-label={isLoading ? `${title} (loading)` : title}
      aria-busy={isLoading}
    >
      {/* Binary overlay */}
      <div className="absolute inset-0 overflow-hidden binary-overlay pointer-events-none">
        <div className="absolute text-[5px] leading-none text-green-500/80 whitespace-nowrap hacker-button-marquee-left">
          01101001 01101110 01101001 01110100 00100000 01110011 01100101 01110001 00101110 00101110 00101110 00100000 01110010 01100101 01100110 01110010 01100101 01110011 01101000 00100000 01110000 01110010 01101111 01100011 01100101 01110011 01110011
        </div>
        <div className="absolute text-[5px] leading-none text-green-500/60 whitespace-nowrap top-2 hacker-button-marquee-right">
          Accessing node... Syncing data stream... Auth bypass attempt... OK. Fetching updates... Compiling response... Done.
        </div>
        <div className="absolute text-[5px] leading-none text-green-500/70 whitespace-nowrap bottom-0.5 hacker-button-marquee-left delay-100">
           DATA FLOW ACTIVE :: SECURE CHANNEL ESTABLISHED :: REFRESH CYCLE INITIATED :: STANDBY :: ...
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent opacity-0 group-hover:opacity-100 hacker-button-scanline pointer-events-none"></div>

      {/* Main icon container */}
      <div className={`relative z-10 flex items-center justify-center ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading ? (
          <div className="animate-spin">
            <RefreshCw className={`${iconDimensions} ${iconColor}`} strokeWidth={2} />
          </div>
        ) : showSuccess ? (
          <Check
             className={`${iconDimensions} text-green-400 animate-[bounce_0.5s_ease-out]`}
             strokeWidth={3} // Make check thicker
           />
        ) : (
          <RefreshCw
            className={`${iconDimensions} transition-all duration-200 ease-out ${iconColor} ${iconHoverColor} ${iconShadow} group-hover:rotate-[-180deg] group-hover:animate-glitch`} // Note: rotate negative for opposite spin
             strokeWidth={2}
          />
        )}
      </div>

      {/* Loading state visuals */}
      {isLoading && (
        <div className="absolute inset-0 pointer-events-none z-20">
           {/* Loading Background Dim */}
           <div className="absolute inset-0 bg-black/60 rounded-full"></div>
           {/* Central Spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 relative"> {/* Container for spinner elements */}
                {/* The main spinning ring */}
                <div className="loading-ring"></div>
                {/* Subtle inner pulsing glow */}
                <div className="absolute inset-[25%] bg-green-500/20 rounded-full animate-pulse"></div>
                 {/* Static dashed ring (visual texture) */}
                 <div className="absolute inset-1 border border-dashed border-green-500/20 rounded-full opacity-50"></div>
             </div>
          </div>
           {/* Corner Pings */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1 right-1 w-1 h-1 bg-green-500 rounded-full animate-ping delay-100 opacity-75"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-green-500 rounded-full animate-ping delay-200 opacity-75"></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-green-500 rounded-full animate-ping delay-300 opacity-75"></div>
          {/* Outer Glow during loading */}
          <div className="absolute -inset-1 rounded-full loading-glow pointer-events-none"></div>
        </div>
      )}

      {/* Border, Ripple, and Status dots */}
      <div className={`absolute inset-0 border ${isLoading ? 'border-green-500/30' : 'border-transparent group-hover:border-green-500/60'} rounded-full transition-all duration-300 pointer-events-none`}></div>
      <div className="ripple"></div> {/* Ripple handled by :active state */}

      {/* Status dots (appear on hover, slightly offset) */}
      <div className="absolute top-1 right-1 rounded-full w-1.5 h-1.5 bg-transparent group-hover:bg-green-500/70 transition-all duration-100 delay-100 pointer-events-none"></div>
      <div className="absolute top-1 right-3 rounded-full w-1.5 h-1.5 bg-transparent group-hover:bg-green-500/70 transition-all duration-100 delay-200 pointer-events-none"></div>
      <div className="absolute top-1 right-5 rounded-full w-1.5 h-1.5 bg-transparent group-hover:bg-green-500/70 transition-all duration-100 delay-300 pointer-events-none"></div>

      {/* Terminal cursor (appears on hover) */}
      <div className="terminal-cursor"></div>

      {/* Success flash (appears briefly when loading finishes) */}
      {showSuccess && (
        <div className="success-flash"></div>
      )}
    </button>
  );
});

HackerButton.displayName = 'HackerButton'; // Helps with debugging

export default HackerButton;

// --- How to Use ---
// 1. Install dependencies: npm install react lucide-react (or yarn add)
// 2. Make sure you have Tailwind CSS setup in your project.
// 3. Import and use the component:

/*
import React, { useState } from 'react';
import HackerButton from './HackerButton'; // Adjust path as needed

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Example state for dark mode

  const handleRefresh = () => {
    console.log('Refresh initiated...');
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      console.log('Refresh complete!');
      setIsLoading(false);
    }, 3000); // Simulate 3 seconds loading time
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-10 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
       <button onClick={() => setIsDarkMode(!isDarkMode)} className="mb-4 p-2 border rounded">
         Toggle Dark Mode ({isDarkMode ? 'On' : 'Off'})
       </button>
      <HackerButton
        onClick={handleRefresh}
        isLoading={isLoading}
        isDark={isDarkMode}
        title="Initiate Data Refresh Sequence" // Optional custom title
        iconSize={6} // Optional custom icon size (w-6, h-6)
      />
       <p className="mt-4 text-sm text-gray-500">Click the button!</p>
    </div>
  );
}

export default App;
*/