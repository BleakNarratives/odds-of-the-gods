// src/components/SanctumScreen.tsx
import React from 'react';
import { God, GodId, Game } from '../types';
import GodIcon from './icons/GodIcon';
import { GAMES } from '../constants';

interface SanctumScreenProps {
    god: God;
    onNavigateToHome: () => void;
    onNavigateToGame: (game: Game) => void;
    onJoinCult: (godId: GodId) => void;
    currentCultId: GodId | null;
    devotionLevel: number; // 0 to 5
}

const SanctumScreen: React.FC<SanctumScreenProps> = ({ 
    god, 
    onNavigateToHome, 
    onNavigateToGame, 
    onJoinCult, 
    currentCultId,
    devotionLevel
}) => {
    
    const isCurrentCult = currentCultId === god.id;
    // FIX: Use the 'color' property and a map to get the hex value.
    const colorMap: Record<string, string> = {
        amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
        yellow: '#facc15', blue: '#2563eb', red: '#ef4444', indigo: '#6366f1',
        teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
    };
    const primaryColor = colorMap[god.color] || '#FFFFFF';
    
    // FIX: Look up game details from the GAMES constant.
    const gameForGod = GAMES.find(g => g.godId === god.id);

    // Helper to render devotion stars
    const renderDevotionStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={`text-2xl transition-colors duration-500`}
                    style={{ color: i <= devotionLevel ? primaryColor : 'var(--color-border)' }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };
    
    // Logic for Anubis Z cult message (ModMind Activation)
    const renderCultMessage = () => {
        if (god.id === 'anubis' && isCurrentCult) {
            return (
                <p className="text-sm font-bold mt-2 text-theme-win">
                    ⚠️ The ModMind Protocol (EquiNex Mask) is Active. Your focus is tracked.
                </p>
            );
        }
        if (isCurrentCult) {
            return (
                <p className="text-sm font-bold mt-2" style={{ color: primaryColor }}>
                    You are currently pledged to {god.name}.
                </p>
            );
        }
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            
            {/* God Banner */}
            <div className="p-8 rounded-3xl shadow-3xl mb-12 relative overflow-hidden" 
                 style={{ 
                     backgroundColor: 'var(--color-surface)',
                     border: `3px solid ${primaryColor}70`,
                     boxShadow: `0 0 50px ${primaryColor}40`,
                 }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 100% 0%, ${primaryColor}, transparent 70%)` }} />

                <div className="relative flex flex-col md:flex-row items-start md:space-x-8">
                    {/* God Icon */}
                    <div className="flex-shrink-0 mb-6 md:mb-0 w-32 h-32 flex items-center justify-center rounded-full border-4" 
                         style={{ borderColor: primaryColor, backgroundColor: 'var(--color-background)' }}
                    >
                        {/* FIX: Replaced unsupported 'size' prop with 'className'. */}
                        <GodIcon godId={god.id} className="w-28 h-28" style={{ color: primaryColor }} />
                    </div>

                    {/* Info */}
                    <div>
                        <h2 className="text-5xl font-cinzel font-extrabold" style={{ color: primaryColor, textShadow: `0 0 10px ${primaryColor}80` }}>
                            The Sanctum of {god.name}
                        </h2>
                        {/* FIX: Replaced 'domain' with 'title'. */}
                        <p className="text-xl font-bold text-theme-secondary mt-1">{god.title}</p>
                        {/* FIX: Replaced 'description' with 'lore'. */}
                        <p className="text-theme-text-base mt-4 max-w-2xl">{god.lore}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center space-x-4 border-t border-theme-border/50 pt-6">
                    <button 
                        onClick={onNavigateToHome}
                        className="py-2 px-4 bg-theme-border text-theme-muted rounded-lg hover:bg-theme-border/70 transition duration-300"
                    >
                        ← Back to Gods
                    </button>
                    
                    <button 
                        onClick={() => onJoinCult(god.id)}
                        disabled={isCurrentCult}
                        className={`py-2 px-6 text-lg font-bold rounded-lg transition duration-300 transform ${
                            isCurrentCult 
                                ? 'bg-theme-text-muted/20 text-theme-muted cursor-not-allowed' 
                                : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: isCurrentCult ? undefined : primaryColor, color: isCurrentCult ? undefined : 'var(--color-background)' }}
                    >
                        {isCurrentCult ? 'CULT JOINED' : `JOIN CULT OF ${god.name.toUpperCase()}`}
                    </button>
                </div>
                {renderCultMessage()}
            </div>

            {/* Devotion and Game Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Devotion Panel */}
                <div className="p-6 bg-theme-surface rounded-xl shadow-2xl border-t-4" style={{ borderColor: primaryColor }}>
                    <h3 className="text-3xl font-bold font-cinzel mb-4 text-theme-secondary">
                        Your Devotion
                    </h3>
                    <div className="flex items-center space-x-2 mb-4">
                        {renderDevotionStars()}
                    </div>
                    <p className="text-theme-text-base">
                        Your devotion level ({devotionLevel}/5) influences your luck and unlocks favor. Increase it by wagering in their game and winning.
                    </p>
                </div>
                
                {/* Game Panel */}
                {gameForGod && (
                    <div className="p-6 bg-theme-surface rounded-xl shadow-2xl border-t-4" style={{ borderColor: primaryColor }}>
                        <h3 className="text-3xl font-bold font-cinzel mb-4 text-theme-secondary">
                            The Divine Game
                        </h3>
                        {/* FIX: Replaced god.game with properties from the looked-up gameForGod object. */}
                        <h4 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
                            {gameForGod.name}
                        </h4>
                        <p className="text-theme-text-base mb-4">{gameForGod.description}</p>
                        <button 
                            onClick={() => onNavigateToGame(gameForGod)}
                            className={`w-full py-3 text-xl font-extrabold rounded-lg transition duration-300 transform hover:scale-[1.01] shimmer-neon`}
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000000' }}
                        >
                            PLAY NOW: {gameForGod.minBet.toLocaleString()} - {gameForGod.maxBet.toLocaleString()} Souls
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
};

export default SanctumScreen;
