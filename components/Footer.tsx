import React, { useMemo } from 'react';
import { PANTHEON } from '../constants';
import { PlayerState } from '../types';

interface FooterProps {
    onFairPlayClick: () => void;
    playerState: PlayerState;
}

const ScornRune: React.FC<{ scorn: number; scornfulGods: string[] }> = ({ scorn, scornfulGods }) => {
    if (scorn === 0) return null;

    const glowIntensity = Math.min(scorn / 500, 1); // Full glow at 500 scorn

    const scornColors = scornfulGods
        .map(id => PANTHEON.find(g => g.id === id)?.color)
        .filter(Boolean)
        .map(colorName => {
             const colorHex = {
                amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
                yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
            }[colorName as string] || '#6b7280';
            return colorHex;
        });

    const chaoticGlowStyle: React.CSSProperties = {
        opacity: glowIntensity,
        textShadow: scornColors.map((color, i) => 
            `${Math.sin(Date.now() / 200 + i) * 2}px ${Math.cos(Date.now() / 200 + i) * 2}px 4px ${color}`
        ).join(','),
        animation: `flicker ${2 - glowIntensity}s infinite alternate`
    };

    return (
        <div 
          className="w-4 h-4 text-center text-lg font-bold text-slate-600 cursor-default"
          style={chaoticGlowStyle}
          title="The rage of the forsaken empowers you..."
        >
         &# runes;
        </div>
    );
};


const Footer: React.FC<FooterProps> = ({ onFairPlayClick, playerState }) => {
  return (
    <footer className="bg-black/20 border-t border-theme-border/20 mt-8">
      <div className="container mx-auto px-4 md:px-8 py-6 text-center text-theme-muted text-sm">
        <p>&copy; {new Date().getFullYear()} Odds of the Gods. All rights reserved.</p>
        <p className="mt-2">
            Please play responsibly. This is for entertainment purposes only.
            Consult your local laws before playing.
        </p>
        <div className="mt-2 flex justify-center items-center gap-4">
            <ScornRune scorn={playerState.scorn} scornfulGods={playerState.scornfulGods} />
            <button onClick={onFairPlayClick} className="text-theme-muted/50 hover:text-theme-primary transition-colors text-xs underline">
                Fair Play / Dev Note
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
