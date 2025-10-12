// src/components/games/HadesRoulette.tsx
import React, { useState } from 'react';
import { GameComponentProps } from '../../types';
import { audioService } from '../../services/audioService';
import GameWrapper from './GameWrapper';

const HadesRoulette: React.FC<GameComponentProps> = ({ god, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(100);
    const [bet, setBet] = useState<number | 'even' | 'odd' | null>(null);
    const [resultNumber, setResultNumber] = useState<number | null>(null);
    const [resultMessage, setResultMessage] = useState<string>('');
    const [isSpinning, setIsSpinning] = useState(false);
    
    const primaryColor = '#8a0000'; // Hades' dark color
    const accentColor = '#4a4a6a'; // Underworld accent

    const handleBet = (newBet: number | 'even' | 'odd') => {
        if (isSpinning) return;
        setBet(newBet);
        setResultMessage(`Bet placed on: ${typeof newBet === 'string' ? newBet.toUpperCase() : newBet}`);
        audioService.play('click');
    };

    const handleSpin = () => {
        if (isSpinning || bet === null || wagerAmount > wager) {
            setResultMessage(bet === null ? "Please place a bet first." : "Wheel is spinning.");
            return;
        }

        if (!onWager(wagerAmount)) {
            setResultMessage("INSUFFICIENT SOULS");
            return;
        }

        setIsSpinning(true);
        setResultNumber(null);
        setResultMessage("THE RIVERS OF STYX ARE TURNING...");
        // audioService.play('roulette-spin');

        setTimeout(() => {
            const finalNumber = Math.floor(Math.random() * 37); // 0-36
            let winAmount = 0;
            let message = '';
            let isWin = false;

            if (typeof bet === 'number' && bet === finalNumber) {
                isWin = true;
                winAmount = wagerAmount * 35;
                message = `HADES SMILES! Rolled ${finalNumber}. Payout: 35x`;
            } else if (bet === 'even' && finalNumber !== 0 && finalNumber % 2 === 0) {
                isWin = true;
                winAmount = wagerAmount * 2;
                message = `EVEN LUCK! Rolled ${finalNumber}. Payout: 2x`;
            } else if (bet === 'odd' && finalNumber % 2 !== 0) {
                isWin = true;
                winAmount = wagerAmount * 2;
                message = `ODD FORTUNE! Rolled ${finalNumber}. Payout: 2x`;
            } else {
                isWin = false;
                message = `LOST TO THE VOID. Rolled ${finalNumber}.`;
            }

            onGameResult(wagerAmount, winAmount, god.id);
            setResultNumber(finalNumber);
            setResultMessage(message);
            setIsSpinning(false);
            // if (isWin) { audioService.play('big-win'); } else { audioService.play('loss'); }

        }, 3000);
    };

    const getNumberStyle = (num: number) => {
        if (num === 0) return { backgroundColor: '#2dd4bf', color: 'var(--color-background)' };
        if (num % 2 === 0) return { backgroundColor: '#f43f5e', color: 'white' };
        return { backgroundColor: 'var(--color-background)', color: 'white' };
    };

    const getBetClass = (b: number | 'even' | 'odd') => 
        bet === b ? 'border-4 border-theme-win ring-4 ring-theme-win/50' : 'border-2 border-theme-border';

    return (
        <GameWrapper god={god}>
            <div className="text-center">
                <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-theme-background/70 rounded-lg">
                    <label className="text-theme-muted">Wager (Souls)</label>
                    <input
                        type="number"
                        min="10"
                        step="10"
                        value={wagerAmount}
                        onChange={(e) => setWagerAmount(Math.max(10, parseInt(e.target.value) || 0))}
                        className="w-32 text-center p-2 rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition text-theme-secondary"
                    />
                </div>

                <div className="mb-8 flex flex-col items-center">
                    <div className={`w-36 h-36 flex items-center justify-center rounded-full border-8 transition-all duration-500 ${isSpinning ? 'animate-spin' : 'animate-none'}`} 
                         style={{ borderColor: primaryColor, backgroundColor: primaryColor, boxShadow: `0 0 30px ${accentColor}80` }}>
                        {resultNumber !== null ? (
                            <div className="text-4xl font-extrabold w-24 h-24 flex items-center justify-center rounded-full border-4" style={getNumberStyle(resultNumber)}>
                                {resultNumber}
                            </div>
                        ) : (
                            <span className="text-2xl text-theme-secondary/70">SPIN</span>
                        )}
                    </div>
                    
                    {resultMessage && (
                        <div className={`mt-4 text-xl font-bold p-3 rounded-lg ${resultMessage.includes('VOID') || resultMessage.includes('INSUFFICIENT') ? 'text-theme-loss' : 'text-theme-win'}`}>
                            {resultMessage}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6">
                    <button onClick={() => handleBet('even')} className={`col-span-2 py-3 font-bold rounded-lg transition bg-theme-surface hover:bg-theme-loss/30 ${getBetClass('even')}`} style={{ color: '#f43f5e' }}>EVEN (2x)</button>
                    <button onClick={() => handleBet('odd')} className={`col-span-2 py-3 font-bold rounded-lg transition bg-theme-surface hover:bg-theme-secondary/30 ${getBetClass('odd')}`} style={{ color: 'white' }}>ODD (2x)</button>
                    
                    {[0, 1, 13, 25].map(num => (
                        <button key={num} onClick={() => handleBet(num)} className={`py-3 font-bold rounded-lg transition bg-theme-surface hover:bg-theme-win/30 ${getBetClass(num)}`} style={{ color: '#2dd4bf' }}>
                            {num} (35x)
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={handleSpin}
                    disabled={isSpinning || bet === null || wagerAmount <= 0 || wagerAmount > wager}
                    className={`w-full py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shimmer-button`}
                    style={{ backgroundColor: primaryColor, color: 'white', textShadow: '0 0 5px #000000' }}
                >
                    {isSpinning ? 'SPINNING...' : `SPIN & WAGER ${wagerAmount.toLocaleString()} SOULS`}
                </button>
            </div>
        </GameWrapper>
    );
};

export default HadesRoulette;
