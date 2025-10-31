
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';
import { AnubisJudgement } from '../game-animations/AnubisJudgement';

const AnubisScales: React.FC<GameComponentProps> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(100);
    const [isWin, setIsWin] = useState(false);
    const [gameState, setGameState] = useState<'betting' | 'weighing' | 'judgement' | 'revealed'>('betting');

    const primaryColor = '#2563eb';

    const handleWeighSouls = () => {
        if (gameState !== 'betting' || wagerAmount > wager) return;
        audioService.play('click');
        if (!onWager(wagerAmount)) {
            return;
        }

        setGameState('weighing');
        const win = Math.random() < 0.5;
        setIsWin(win);

        setTimeout(() => {
            setGameState('judgement');
        }, 1000); // Short delay before transitioning to the full animation
    };
    
    const handleAnimationEnd = () => {
        const winAmount = isWin ? wagerAmount * 2 : 0;
        // FIX: Pass all required arguments to onGameResult
        onGameResult(wagerAmount, winAmount, god.id, false, false);
        setGameState('revealed');
    };


    const handlePlayAgain = () => {
        audioService.play('click');
        setGameState('betting');
        setWagerAmount(100);
    };

    if (gameState === 'judgement') {
        return <GameWrapper god={god}><AnubisJudgement isWin={isWin} onAnimationEnd={handleAnimationEnd} /></GameWrapper>;
    }
    
    if (gameState === 'revealed') {
        return (
            <GameWrapper god={god}>
                <div className="text-center animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-6">
                     <h2 className={`text-3xl font-bold ${isWin ? 'text-theme-win' : 'text-theme-loss'}`}>
                        {isWin ? 'Your soul is worthy!' : 'Your soul has been devoured.'}
                    </h2>
                    <button
                        onClick={handlePlayAgain}
                        className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button"
                        style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}
                    >
                        Face Judgment Again
                    </button>
                </div>
            </GameWrapper>
        );
    }


    return (
        <GameWrapper god={god}>
            <div className="text-center flex flex-col items-center justify-center min-h-[300px] space-y-6">
                <p className="text-theme-muted max-w-md mx-auto">
                    Offer a portion of your essence. If your wager is found pure against the Feather of Ma'at, your reward will be doubled. If not, it will be consumed by the void.
                </p>

                <div className="my-4">
                    <label className="block text-theme-muted mb-2">Wager (Souls)</label>
                    <input
                        type="number"
                        min="10"
                        step="10"
                        value={wagerAmount}
                        onChange={(e) => setWagerAmount(Math.max(10, Math.min(wager, parseInt(e.target.value) || 0)))}
                        disabled={gameState === 'weighing'}
                        className="w-48 text-center p-3 text-2xl font-bold rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition duration-300 text-theme-secondary"
                    />
                </div>
                
                <button
                    onClick={handleWeighSouls}
                    disabled={gameState === 'weighing' || wagerAmount <= 0 || wagerAmount > wager}
                    className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                    style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000000' }}
                >
                    {gameState === 'weighing' ? 'WEIGHING...' : `WAGER ${wagerAmount.toLocaleString()} SOULS`}
                </button>
            </div>
        </GameWrapper>
    );
};

// FIX: Added default export.
export default AnubisScales;