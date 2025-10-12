// src/components/games/GameWrapper.tsx

import React from 'react';
import { God } from '../../types';

interface GameWrapperProps {
    god: God;
    children: React.ReactNode;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ god, children }) => {
    
    const colorMap: Record<string, string> = {
        amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
        yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
        teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
    };
    const primaryColor = colorMap[god.color] || 'var(--color-primary)';

    return (
        <div className="bg-theme-surface rounded-2xl shadow-3xl p-6 md:p-10 transition duration-500 min-h-[500px]"
             style={{ 
                 boxShadow: `0 0 80px -15px ${primaryColor}50`, 
                 border: `1px solid ${primaryColor}40`,
             }}
        >
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold font-cinzel text-theme-secondary" 
                    style={{ color: primaryColor, textShadow: `0 0 10px ${primaryColor}80` }}
                >
                    {god.name}'s Challenge
                </h1>
                <p className="text-xl text-theme-muted mt-2">
                    The {god.title} awaits your offering.
                </p>
            </div>
            
            <div className="game-content">
                {children}
            </div>
        </div>
    );
};

export default GameWrapper;
