import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps } from '../../src/types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../src/services/audioService';

const AmmitsGamble: React.FC<GameComponentProps> = ({ god, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(100);
    const [virtues, setVirtues] = useState(0);
    const [sins, setSins] = useState(0);
    const [lastRoll, setLastRoll] = useState<number | null>(null);
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
    const [message, setMessage] = useState('');

    const primaryColor = '#2563eb';

    const handleStartGame = () => {
        if (wagerAmount > wager) return;
        if (!onWager(wagerAmount)) {
            setMessage("INSUFFICIENT SOULS");
            return;
        }
        setVirtues(0);
        setSins(0);
        setLastRoll(null);
        setGameState('playing');
        setMessage('Roll the die...');
        audioService.play('swoosh');
    };

    const handleRoll = () => {
        if (gameState !== 'playing') return;
        
        audioService.play('dice-roll');
        const roll = Math.floor(Math.random() * 6) + 1;
        setLastRoll(roll);

        let newVirtues = virtues;
        let newSins = sins;

        if (roll >= 4) { // 4, 5, 6 are virtues
            newVirtues++;
            setVirtues(newVirtues);
            setMessage(`A virtuous roll of ${roll}!`);
        } else { // 1, 2, 3 are sins
            newSins++;
            setSins(newSins);
            setMessage(`A sinful roll of ${roll}...`);
        }

        if (newVirtues >= 5) {
            const winAmount = wagerAmount * 2.5;
            onGameResult(wagerAmount, winAmount, god.id, false, false);
            setMessage(`Five virtues collected! You win ${winAmount.toLocaleString()} souls!`);
            setGameState('ended');
            audioService.play('win');
        } else if (newSins >= 3) {
            onGameResult(wagerAmount, 0, god.id, false, false);
            setMessage('Three sins... Ammit the Devourer claims your wager!');
            setGameState('ended');
            audioService.play('lose');
        }
    };
    
    const handlePlayAgain = () => {
        setGameState('betting');
        setMessage('');
    };

    return (
        <GameWrapper god={god}>
            <div className="text-center">
                {gameState === 'betting' && (
                    <div className="animate-fade-in">
                        <p className="text-theme-muted mb-6">Collect five virtues before you roll three sins. Ammit, the Devourer, awaits the outcome.</p>
                        <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-theme-background/70 rounded-lg">
                            <label className="text-theme-muted">Wager (Souls)</label>
                            <input
                                type="number"
                                min="10" step="10"
                                value={wagerAmount}
                                onChange={(e) => setWagerAmount(Math.max(10, parseInt(e.target.value) || 0))}
                                className="w-32 text-center p-2 rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition text-theme-secondary"
                            />
                        </div>
                        <button
                            onClick={handleStartGame}
                            disabled={wagerAmount <= 0 || wagerAmount > wager}
                            className="w-full py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                        >
                            Begin
                        </button>
                    </div>
                )}

                {gameState !== 'betting' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-around items-center mb-8">
                            <div>
                                <p className="text-xl font-bold text-theme-win">Virtues</p>
                                <p className="text-4xl font-black">{virtues} / 5</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-theme-loss">Sins</p>
                                <p className="text-4xl font-black">{sins} / 3</p>
                            </div>
                        </div>

                        <div className="min-h-[100px] flex items-center justify-center mb-4">
                            {lastRoll && (
                                <div className="w-20 h-20 bg-theme-surface border-2 border-theme-border rounded-lg flex items-center justify-center text-4xl font-bold" style={{color: lastRoll >= 4 ? 'var(--color-win)' : 'var(--color-loss)'}}>
                                    {lastRoll}
                                </div>
                            )}
                        </div>
                        
                        <p className="text-lg text-theme-muted mb-6 h-8">{message}</p>
                        
                        {gameState === 'playing' ? (
                            <button
                                onClick={handleRoll}
                                className="w-full py-3 text-xl font-bold rounded-lg shimmer-button"
                                style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}
                            >
                                Roll Die
                            </button>
                        ) : (
                            <button
                                onClick={handlePlayAgain}
                                className="w-full py-3 text-xl font-bold rounded-lg shimmer-button"
                                style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}
                            >
                                Play Again
                            </button>
                        )}
                    </div>
                )}
            </div>
        </GameWrapper>
    );
};

export default AmmitsGamble;