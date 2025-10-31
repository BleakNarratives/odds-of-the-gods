// src/components/GodCard.tsx
import React from 'react';
import { God } from '../types';
import GodIcon from './icons/GodIcon';

interface GodCardProps {
  god: God;
  onSelect: () => void;
  isCultMember: boolean;
}

const GodCard: React.FC<GodCardProps> = ({ god, onSelect, isCultMember }) => {
    const colorMap: Record<string, string> = {
        amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
        yellow: '#facc15', blue: '#2563eb', red: '#ef4444', indigo: '#6366f1',
        teal: '#14b8a6'
    };
    const primaryColor = colorMap[god.color] || 'var(--color-primary)';
  
    const glowStyle = {
      boxShadow: `0 0 25px -5px ${primaryColor}60`,
      '--god-color': primaryColor
    } as React.CSSProperties;

  return (
    <div
      onClick={onSelect}
      className="god-card-container group relative bg-slate-900/50 rounded-2xl p-6 border border-theme-border/70 cursor-pointer transition-all duration-300 hover:border-theme-primary/80 hover:scale-105"
      style={glowStyle}
    >
      <div className="flex flex-col items-center text-center">
        <div 
            className="w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-110" 
            style={{ filter: `drop-shadow(0 0 10px ${primaryColor})` }}
        >
          <GodIcon godId={god.id} className="w-full h-full" style={{ color: primaryColor }} />
        </div>
        <h2 className="text-2xl font-bold font-cinzel text-theme-secondary">{god.name}</h2>
        <p className="text-sm text-theme-muted mb-3">{god.title}</p>
        <p className="text-xs text-slate-400 h-16">{god.lore}</p>
      </div>
      {isCultMember && (
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-theme-background rounded-full" style={{ backgroundColor: primaryColor }}>
            PATRON
        </div>
      )}
    </div>
  );
};

export default GodCard;
