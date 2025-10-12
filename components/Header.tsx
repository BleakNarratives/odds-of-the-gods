import React from 'react';
import { ThothIcon, SoulIcon, ArchitectIcon, DevToolsIcon } from './icons/MythicIcons';
// FIX: Removed unused import for 'GodId' which was causing a type error.

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
  onDevToolsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ souls, onCashOutClick, onReplenishClick, showMenuButton, onMenuClick, onThothClick, onQuestsClick, unclaimedQuestsCount, soulUpdateClass, onArchitectClick, onDevToolsClick }) => {
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
          <button onClick={onDevToolsClick} className="group relative" aria-label="Open Developer Tools">
            <DevToolsIcon className="w-8 h-8 text-slate-400 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
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
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-theme-primary text-theme-background text-xs font-bold rounded-full flex items-center justify-center">
                {unclaimedQuestsCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 bg-theme-surface/50 border border-theme-border rounded-md p-1">
            <SoulIcon className="w-6 h-6 text-theme-souls" />
            <span className={`text-lg font-bold text-white w-24 text-right transition-colors duration-300 ${soulUpdateClass}`}>{souls.toFixed(0)}</span>
            <button onClick={onReplenishClick} className="bg-green-600/80 hover:bg-green-500 text-white rounded-sm w-5 h-5 flex items-center justify-center">+</button>
          </div>
          <button onClick={onCashOutClick} className="bg-theme-primary/90 text-theme-background font-bold py-2 px-4 rounded-md hover:bg-theme-primary transition-colors duration-300">
            Cash Out
          </button>
        </div>

        {/* Mobile Controls */}
        {showMenuButton && (
          <div className="md:hidden">
            <button onClick={onMenuClick} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
