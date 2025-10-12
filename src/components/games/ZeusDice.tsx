// src/components/games/ZeusDice.tsx
import React, { useState } from 'react';
import { GameComponentProps } from '../../types';
import { audioService } from '../../services/audioService';
import GameWrapper from './GameWrapper';

const ZeusDice: React.FC<GameComponentProps> = ({ god, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(100);
    const [targetRoll, setTargetRoll] = useState<number>(7);
    const [result, setResult] = useState<{ roll: number, message: string } | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    
    const primaryColor = '#fca311';

    const handleRoll = () => {
        if (isRolling || wagerAmount > wager) return;

        if (!onWager(wagerAmount)) {
            setResult({ roll: 0, message: "INSUFFICIENT SOULS" });
            return;
        }

        setIsRolling(true);
        setResult(null);
        // audioService.play('dice-roll');

        setTimeout(() => {
            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            const roll = die1 + die2;
            let message = '';
            let multiplier = 0;
            
            if (roll === targetRoll) {
                multiplier = 5;
                message = `DIVINE HIT! You rolled a ${roll}!`;
                // audioService.play('jackpot-sound');
            } else {
                multiplier = 0;
                message = `You rolled a ${roll}. Not this time.`;
                // audioService.play('loss');
            }

            const winAmount = wagerAmount * multiplier;
            onGameResult(wagerAmount, winAmount, god.id);

            setResult({ roll, message });
            setIsRolling(false);
        }, 2000);
    };

    const renderDice = (value: number) => (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-theme-background text-2xl sm:text-4xl flex items-center justify-center rounded-lg shadow-inner-lg`} 
             style={{ boxShadow: `inset 0 0 15px ${primaryColor}40, 0 4px 15px ${primaryColor}60` }}
        >
            <span style={{ color: primaryColor }} className="font-extrabold">{value}</span>
        </div>
    );

    return (
        <GameWrapper god={god}>
            <div className="text-center">
                {/* Game Setup */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 p-4 bg-theme-background/70 rounded-lg">
                    <div className="w-full sm:w-auto">
                        <label className="block text-theme-muted mb-2">Wager (Souls)</label>
                        <input
                            type="number"
                            min="10"
                            step="10"
                            value={wagerAmount}
                            onChange={(e) => setWagerAmount(Math.max(10, parseInt(e.target.value) || 0))}
                            className="w-full text-center p-3 rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition duration-300 text-theme-secondary"
                            style={{ boxShadow: `0 0 10px ${primaryColor}20` }}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <label className="block text-theme-muted mb-2">Target Roll (Payout: 5x)</label>
                        <select
                            value={targetRoll}
                            onChange={(e) => setTargetRoll(parseInt(e.target.value))}
                            className="w-full text-center p-3 rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition duration-300 text-theme-secondary"
                            style={{ boxShadow: `0 0 10px ${primaryColor}20` }}
                        >
                            {[3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={`min-h-[120px] mb-8 flex items-center justify-center space-x-6`}>
                    {isRolling ? (
                        <span className="text-2xl animate-pulse" style={{ color: primaryColor }}>Rolling the Fates...</span>
                    ) : result?.roll ? (
                        <div className="flex space-x-4 animate-fade-in">
                            {renderDice(Math.floor(result.roll / 2))} 
                            {renderDice(result.roll - Math.floor(result.roll / 2))}
                        </div>
                    ) : (
                        <span className="text-theme-muted">Ready to Challenge the Sky</span>
                    )}
                </div>
                
                {result && (
                    <div className={`text-xl font-bold p-3 rounded-lg mb-6 ${result.message.includes('INSUFFICIENT') ? 'text-theme-loss bg-theme-loss/20' : result.message.includes('HIT') ? 'text-theme-win bg-theme-win/20' : 'text-theme-muted bg-theme-surface/50'}`} style={{ boxShadow: `0 0 10px ${primaryColor}40` }}>
                        {result.message}
                    </div>
                )}

                <button
                    onClick={handleRoll}
                    disabled={isRolling || wagerAmount <= 0 || wagerAmount > wager}
                    className={`w-full py-4 text-2xl font-extrabold rounded-xl transition duration-300 transform ${isRolling || wagerAmount <= 0 || wagerAmount > wager ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shimmer-button'}`}
                    style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000000' }}
                >
                    {isRolling ? 'ROLLING...' : `WAGER ${wagerAmount.toLocaleString()} SOULS`}
                </button>
            </div>
        </GameWrapper>
    );
};

export default ZeusDice;
