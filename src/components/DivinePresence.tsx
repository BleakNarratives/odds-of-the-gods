// src/components/DivinePresence.tsx

import React from 'react';
import { God } from '../types';
import { GAMES } from '../constants';
import { AspirantIcon } from './icons/MythicIcons';


interface DivinePresenceProps {
    god: God;
    className?: string;
    message?: string;
}

const DivinePresence: React.FC<DivinePresenceProps> = ({ god, className = '', message }) => {
    
    const colorMap: Record<string, string> = {
        amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
        yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
        teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
    };
    const glowColor = colorMap[god.color] || '#FFFFFF';

    const GodIcon = GAMES.find(g => g.godId === god.id)?.Icon || AspirantIcon;

    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-inner ${className}`}
             style={{ 
                 backgroundColor: 'var(--color-surface)',
                 border: `2px solid ${glowColor}60`,
                 boxShadow: `0 0 20px ${glowColor}50, inset 0 0 10px #000000`,
             }}
        >
            <div 
                className="w-20 h-20 sm:w-24 sm:h-24 mb-3 transition duration-500"
                style={{ 
                    filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 5px ${glowColor})`,
                }}
            >
                <GodIcon className="w-full h-full" style={{ color: glowColor }} />
            </div>

            <h4 className="text-xl font-cinzel font-bold mb-1" style={{ color: glowColor }}>
                {god.name}
            </h4>
            <p className="text-xs text-theme-muted mb-3">
                {god.title}
            </p>

            {message && (
                <p className="text-sm italic p-1 px-3 rounded-full bg-theme-background/50 text-theme-secondary animate-pulse" 
                   style={{ borderColor: glowColor }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default DivinePresence;