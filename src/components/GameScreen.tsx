// src/components/GameScreen.tsx

import React from 'react';
import { God, Game, GodId } from '../types';
import DivinePresence from './DivinePresence';

// Import all game components
import ZeusDice from './games/ZeusDice';
import HadesRoulette from './games/HadesRoulette';
import LokiCardFlip from './games/LokiCardFlip';
import AnubisScales from './games/AnubisScales';
import AnubisJars from './games/AnubisJars';
import AmmitsGamble from './games/AmmitsGamble';

// Map game IDs to their respective components
const gameComponents: { [key: string]: React.FC<any> } = {
    'zeus-dice': ZeusDice,
    'hades-roulette': HadesRoulette,
    'loki-flip': LokiCardFlip,
    'anubis-scales-new': AnubisScales,
    'anubis-jars-new': AnubisJars,
    'ammits-gamble-new': AmmitsGamble,
    // 'fortuna-wheel': FortunaWheel, // TODO: Add when created
};

interface GameScreenProps {
    god: God;
    game: Game;
    souls: number;
    onNavigateToSanctum: (godId: GodId) => void;
    onWager: (amount: number) => boolean;
    onGameResult: (wagered: number, won: number, godId: GodId) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ 
    god, 
    game, 
    souls, 
    onNavigateToSanctum, 
    onWager, 
    onGameResult 
}) => {
    
    const GameComponent = gameComponents[game.id];

    if (!GameComponent) {
        return (
            <div className="p-10 text-center animate-fade-in">
                <h2 className="text-3xl text-theme-loss">ERROR: Game Component Not Found</h2>
                <p className="text-theme-muted mt-4">The game ID '{game.id}' does not match a known component. The developer has been notified.</p>
                <button 
                    onClick={() => onNavigateToSanctum(god.id)}
                    className="mt-6 py-2 px-6 bg-theme-primary text-theme-background rounded-lg hover:bg-theme-primary/80"
                >
                    Return to {god.name}'s Sanctum
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-0 lg:space-x-8 animate-fade-in">
            
            <div className="w-full lg:w-1/4 flex flex-col space-y-6">
                
                <DivinePresence 
                    god={god} 
                    message={`Witnessing Your Game`}
                />

                <div className="p-4 bg-theme-surface rounded-xl border-t-4 border-theme-primary/50 shadow-md">
                    <h4 className="text-xl font-bold text-theme-secondary mb-3">Game Info</h4>
                    <p className="text-theme-muted mb-4">{game.description}</p>
                    <button 
                        onClick={() => onNavigateToSanctum(god.id)}
                        className="w-full py-2 bg-theme-border text-theme-muted rounded-lg hover:bg-theme-border/70 transition duration-300"
                    >
                        Return to Sanctum
                    </button>
                </div>

                <div className="p-4 bg-theme-surface rounded-xl border-t-4 border-theme-souls/50 shadow-md">
                    <h4 className="text-xl font-bold text-theme-souls mb-1">Your Fortune</h4>
                    <p className="text-3xl font-extrabold">{souls.toLocaleString()} Souls</p>
                    <p className="text-theme-muted text-sm mt-1">Wager with caution.</p>
                </div>

            </div>

            <div className="w-full lg:w-3/4">
                <GameComponent 
                    god={god} 
                    wager={souls} 
                    onWager={onWager} 
                    onGameResult={onGameResult} 
                />
            </div>
        </div>
    );
};

export default GameScreen;