// src/components/NavSidebar.tsx
import React from 'react';

interface NavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: 'pantheon' | 'account' | 'clash') => void;
  onCashOutClick: () => void;
  onReplenishClick: () => void;
}

const NavSidebar: React.FC<NavSidebarProps> = ({ isOpen, onClose, onNavigate, onCashOutClick, onReplenishClick }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-bold text-theme-primary mb-8">Navigation</h2>
            <nav className="flex flex-col space-y-4 flex-grow">
                <button onClick={() => onNavigate('pantheon')} className="text-left text-lg text-slate-300 hover:text-white transition-colors">The Pantheon</button>
                <button onClick={() => onNavigate('account')} className="text-left text-lg text-slate-300 hover:text-white transition-colors">Account</button>
                <button onClick={() => onNavigate('clash')} className="text-left text-lg text-slate-300 hover:text-white transition-colors">Clash of Fates</button>
            </nav>
            <div className="space-y-3">
                 <button onClick={onReplenishClick} className="w-full bg-green-600/80 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Replenish Souls
                </button>
                <button onClick={onCashOutClick} className="w-full bg-theme-primary/90 text-theme-background font-bold py-2 px-4 rounded-md hover:bg-theme-primary transition-colors">
                    Cash Out
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
