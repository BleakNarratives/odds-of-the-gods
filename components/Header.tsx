import React from 'react';
import { ThothIcon, SoulIcon, ArchitectIcon } from './icons/MythicIcons';

interface HeaderProps {
  souls: number;
  onCashOutClick: () => void;
  onReplenishClick: () => void;
  showMenuButton: boolean;
  onMenuClick: () => void;
  onThothClick: () => void;
  onQuestsClick: () => void;
  unclaimedQuestsCount: number;
  soulUpdateClass: string;
  onArchitectClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ souls, onCashOutClick, onReplenishClick, showMenuButton, onMenuClick, onThothClick, onQuestsClick, unclaimedQuestsCount, soulUpdateClass, onArchitectClick }) => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-theme-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <button onClick={onThothClick} className="group relative" aria-label="Seek Thoth's Counsel">
            <ThothIcon className="w-8 h-8 text-theme-primary transition-all duration-300 group-hover:text-white group-hover:scale-110" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-theme-primary/30 blur-md transition-all duration-300 group-hover:w-12 group-hover:h-12 animate-pulse"></div>
          </button>
           <button onClick={onArchitectClick} className="group relative" aria-label="Commune with the Architect">
            <ArchitectIcon className="w-8 h-8 text-cyan-400 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-400/30 blur-md transition-all duration-300 group-hover:w-12 group-hover:h-12 animate-pulse"></div>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase">
            Odds of the <span className="text-theme-primary">Gods</span>
          </h1>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3 md:gap-6">
           <button onClick={onQuestsClick} className="relative bg-theme-surface/50 text-theme-secondary font-bold py-2 px-4 rounded-md hover:bg-theme-surface transition-colors duration-300 border border-theme-border">
            Daily Quests
            {unclaimedQuestsCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-theme-primary text-theme-background rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
                {unclaimedQuestsCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-4 bg-theme-surface/50 px-4 py-1 rounded-full border border-theme-border">
            <div className="flex items-center gap-2">
                <SoulIcon className="w-5 h-5 text-theme-souls" />
                <span className={`text-lg font-bold text-theme-souls ${soulUpdateClass}`}>{souls.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onReplenishClick}
            className="bg-theme-primary/90 text-theme-background font-bold py-2 px-4 rounded-md hover:bg-theme-primary transition-colors duration-300 shadow-lg shadow-theme-primary/20"
          >
            Replenish
          </button>
          <button 
            onClick={onCashOutClick}
            className="bg-theme-win/90 text-theme-background font-bold py-2 px-4 rounded-md hover:bg-theme-win transition-colors duration-300 shadow-lg shadow-theme-win/20">
            Cash Out
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          {showMenuButton ? (
            <>
               <button onClick={onQuestsClick} className="relative p-2 text-theme-muted hover:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                {unclaimedQuestsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-theme-primary text-theme-background rounded-full text-xs font-bold flex items-center justify-center">
                    {unclaimedQuestsCount}
                  </span>
                )}
               </button>
              <div className="flex items-center gap-2 bg-theme-surface/50 px-3 py-1 rounded-full border border-theme-border">
                <SoulIcon className="w-4 h-4 text-theme-souls" />
                <span className={`text-sm font-bold text-theme-souls ${soulUpdateClass}`}>{souls.toFixed(0)}</span>
              </div>
              <button onClick={onMenuClick} className="p-2 text-theme-muted hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          ) : (
            <div className="h-10"></div> // Placeholder to maintain height
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;