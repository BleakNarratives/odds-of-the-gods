import React from 'react';

interface IntroScreenProps {
  onEnter: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white p-4">
      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl shadow-theme-primary/20 border border-theme-border/50 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-shadow-glow">
          Odds of the <span className="text-theme-primary">Gods</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed">
          The Pantheon is in turmoil. Their power wanes as mortal belief fades.
          Now, they turn to you. Wager your very soul in their divine games, shift the balance of power, and perhaps, carve your own myth among the stars.
        </p>
        <button
          onClick={onEnter}
          className="mt-8 bg-theme-primary text-theme-background font-bold py-4 px-10 rounded-lg text-xl tracking-wider uppercase hover:bg-amber-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-theme-primary/30 shimmer-button"
        >
          Enter the Pantheon
        </button>
      </div>
       <div className="absolute bottom-4 text-xs text-theme-muted/50">
            <p>&copy; {new Date().getFullYear()} A purely fictional experience.</p>
        </div>
    </div>
  );
};

export default IntroScreen;