
// components/games/LokiCardFlip.tsx
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../types';
import { audioService } from '../../services/audioService';
import GameWrapper from './GameWrapper';
import WagerSlider from './WagerSlider';
// FIX: Changed import to named export
import { GameResultAnimation } from './GameResultAnimation';
import { LokiShellGameChoice, LokiShellGameAnimation } from '../game-animations/LokiShellGame';


const LokiCardFlip: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting' | 'choice' | 'shuffling' | 'result'>('betting');
    const [playerChoice, setPlayerChoice] = useState<number | null>(null);
    const [winResult, setWinResult] = useState(false);
    
    const primaryColor = '#10b981'; // Loki's Green

    const handleProceedToChoice = () => {
        if (wagerAmount > wager) return;
        if (!onWager(wagerAmount)) return;
        setGameState('choice');
    };

    const handleChoice = (choice: number) => {
        setPlayerChoice(choice);
        const isWin = Math.random() < game.winChance;
        setWinResult(isWin);
        setGameState('shuffling');
    };
    
    const handleAnimationEnd = () => {
        const payout = winResult ? wagerAmount * game.payoutMultiplier : 0;
        // FIX: Added missing arguments to onGameResult
        onGameResult(wagerAmount, payout, god.id, false, false);
        setGameState('result');
    };

    const handlePlayAgain = () => {
        setGameState('betting');
        setPlayerChoice(null);
    };

    return (
        <GameWrapper god={god}>
             <div className="flex flex-col items-center justify-center min-h-[300px]">
                {gameState === 'betting' && (
                     <div className="animate-fade-in text-center flex flex-col items-center justify-center space-y-8 w-full">
                        <p className="text-theme-muted max-w-md">{game.description}</p>
                        <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                        <button
                            onClick={handleProceedToChoice}
                            disabled={wagerAmount > wager || wager < game.minBet}
                            className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                        >
                            Begin the Trick
                        </button>
                    </div>
                )}
                
                {gameState === 'choice' && <LokiShellGameChoice onChoice={handleChoice} game={game} />}
                
                {gameState === 'shuffling' && playerChoice !== null && (
                    <LokiShellGameAnimation 
                        isWin={winResult}
                        choice={playerChoice}
                        onAnimationEnd={handleAnimationEnd}
                        game={game}
                    />
                )}

                {gameState === 'result' && (
                     <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center space-y-4">
                         <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />
                         <p className="text-lg text-theme-muted">Loki's trick is revealed.</p>
                         <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>
                     </div>
                )}

            </div>
        </GameWrapper>
    );
};

export default LokiCardFlip;