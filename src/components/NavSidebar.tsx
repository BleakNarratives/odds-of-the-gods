// src/components/NavSidebar.tsx

import React from 'react';
import { God, GodId } from '../types';
import { GAMES } from '../constants';
import { AspirantIcon } from './icons/MythicIcons';

interface NavSidebarProps {
  currentGod: God;
  onNavigateToSanctum: () => void;
  onNavigateToPantheon: () => void;
  onNavigateToMortalGames: () => void;
  onNavigateToDashboard: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeScreen: 'SANCTUM' | 'GAME' | 'PANTHEON' | 'WAR' | 'MORTAL_GAMES' | 'CLASH' | 'DASHBOARD';
}

const NavSidebar: React.FC<NavSidebarProps> = ({ currentGod, onNavigateToSanctum, onNavigateToPantheon, onNavigateToMortalGames, onNavigateToDashboard, isOpen, onClose, activeScreen }) => {
  const gameForGod = GAMES.find(g => g.godId === currentGod.id);
  const GodIcon = gameForGod ? gameForGod.Icon : AspirantIcon;

  const colorMap: Record<string, string> = {
      amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
      yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
      teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
  };
  const godColorHex = colorMap[currentGod.color] || '#ffffff';

  const getLinkClass = (screen: 'SANCTUM' | 'PANTHEON' | 'MORTAL_GAMES' | 'DASHBOARD') => {
    const isActive = (activeScreen === 'GAME' && screen === 'SANCTUM') || 
                     (activeScreen === 'WAR' && screen === 'SANCTUM') || 
                     (activeScreen === 'CLASH' && screen === 'SANCTUM') || 
                     activeScreen === screen;
    return `w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
        isActive
        ? 'bg-amber-800/70 text-white font-bold'
        : 'text-slate-300 hover:bg-amber-800/50 hover:text-white'
    }`;
  };

  const sidebarContent = (
    <div className="w-64 bg-black/80 backdrop-blur-lg border-r border-amber-500/10 p-4 flex flex-col h-full">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full mx-auto p-2 border-2" style={{ borderColor: godColorHex }}>
            <GodIcon className="w-full h-full" style={{ color: godColorHex }} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">{currentGod.name}</h3>
          <p className="text-sm text-slate-400">Your Patron</p>
        </div>

        <ul className="space-y-2">
          <li>
            <button
              onClick={onNavigateToDashboard}
              className={getLinkClass('DASHBOARD')}
            >
              Player Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={onNavigateToSanctum}
              className={getLinkClass('SANCTUM')}
            >
              Divine Sanctum
            </button>
          </li>
          <li>
            <button
              onClick={onNavigateToMortalGames}
              className={getLinkClass('MORTAL_GAMES')}
            >
              Mortal's Folly
            </button>
          </li>
          <li>
            <button
              onClick={onNavigateToPantheon}
              className={getLinkClass('PANTHEON')}
            >
              View Pantheon
            </button>
          </li>
        </ul>

        <div className="mt-auto text-center text-xs text-slate-600">
          <p>Your choices shape the cosmos.</p>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
        <div className={`relative transition-transform duration-300 h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-shrink-0 z-20 min-h-[calc(100vh-89px)]">
         {sidebarContent}
      </nav>
    </>
  );
};

export default NavSidebar;