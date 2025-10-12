import React, { useState, useMemo, useEffect } from 'react';
import { GameComponentProps } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';
import * as Icons from '../icons/MythicIcons';

const slotSymbols = [
    { Icon: Icons.HadesIcon, id: 'hades', payout: 50, color: 'text-red-500' },
    { Icon: Icons.ZeusIcon, id: 'zeus', payout: 25, color: 'text-yellow-400' },
    { Icon: Icons.LokiIcon, id: 'loki', payout: 15, color: 'text-green-400' },
    { id: 'A', payout: 10, color: 'text-orange-500' },
    { id: 'K', payout: 8, color: 'text-orange-600' },
    { id: 'Q', payout: 5, color: 'text-orange-700' },
];

const REEL_COUNT = 5;
const ROW_COUNT = 3;

const HadesSlots: React.FC<GameComponentProps> = ({ god, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(20);
    // FIX: Corrected the type of the reels state to be a 2D array of symbols, not a 3D array.
    const [reels, setReels] = useState<(typeof slotSymbols[0])[][]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    // Initialize reels
    useEffect(() => {
        const initialReels = Array.from({ length: REEL_COUNT }, () =>
            Array.from({ length: 30 }, () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)])
        );
        setReels(initialReels);
    }, []);
    
    const handleSpin = () => {
        if (isSpinning || wagerAmount > wager) return;
        if (!onWager(wagerAmount)) {
            setResultMessage("INSUFFICIENT SOULS");
            return;
        }

        setIsSpinning(true);
        setResultMessage('');
        audioService.play('reel-spin');

        // Create new randomized reels for the spin
        const newReels = Array.from({ length: REEL_COUNT }, (_, reelIndex) => {
             const reel = Array.from({ length: 30 }, () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
             // Ensure the final state is ready at the top of the reel strip for the animation
             const finalSymbol = reels[reelIndex][reels[reelIndex].length - ROW_COUNT];
             reel[0] = finalSymbol;
             return reel;
        });
        
        // Determine outcome and force it on the middle row
        const isWin = Math.random() < 0.25; // Game winChance
        const finalReels = JSON.parse(JSON.stringify(newReels));
        
        if (isWin) {
            const winSymbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            const winLength = Math.random() > 0.6 ? 5 : (Math.random() > 0.3 ? 4 : 3);
            for(let i=0; i < winLength; i++) {
                finalReels[i][finalReels[i].length - ROW_COUNT + 1] = winSymbol; // set middle row at the end of strip
            }
        }
        setReels(finalReels);


        setTimeout(() => {
            setIsSpinning(false);
            audioService.stop('reel-spin');
            audioService.play('reel-stop');

            // Check for wins on the middle row after spin
            const middleRow = finalReels.map(reel => reel[reel.length - ROW_COUNT + 1]);
            let winAmount = 0;
            let finalMessage = "The spirits are silent.";

            for(const symbol of slotSymbols) {
                if(middleRow[0].id === symbol.id && middleRow[1].id === symbol.id && middleRow[2].id === symbol.id) {
                     let payout = symbol.payout;
                     let count = 3;
                     if(middleRow[3].id === symbol.id) { count=4; payout *= 2; }
                     if(middleRow[4].id === symbol.id) { count=5; payout *= 2; }
                     winAmount = wagerAmount * payout;
                     finalMessage = `A line of ${count} ${symbol.id}s! You win ${winAmount.toLocaleString()} souls!`;
                     audioService.play('big-win');
                     break;
                }
            }

            if(winAmount === 0) audioService.play('lose');
            setResultMessage(finalMessage);
            onGameResult(wagerAmount, winAmount, god.id);

        }, 2000 + REEL_COUNT * 200); // Animation duration
    };

    return (
        <GameWrapper god={god}>
            <div className="flex flex-col items-center">
                {/* Reels */}
                <div className="grid grid-cols-5 gap-2 bg-black/50 p-4 rounded-lg border-2 border-slate-700 shadow-inner">
                    {reels.map((reel, i) => (
                        <div key={i} className="h-48 w-20 bg-slate-800 rounded overflow-hidden relative">
                            <div
                                className="flex flex-col items-center absolute top-0 left-0"
                                style={{
                                    transform: isSpinning ? `translateY(-${(reel.length - ROW_COUNT) * 4}rem)` : `translateY(-${(reel.length - ROW_COUNT) * 4}rem)`,
                                    transition: `transform ${isSpinning ? 2 + i * 0.2 : 0.5}s cubic-bezier(0.25, 1, 0.5, 1)`,
                                }}
                            >
                                {reel.map((symbol, j) => (
                                    <div key={j} className="h-16 w-20 flex items-center justify-center flex-shrink-0">
                                        {symbol.Icon ? <symbol.Icon className={`w-12 h-12 ${symbol.color}`} /> : <span className={`text-4xl font-bold ${symbol.color}`}>{symbol.id}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                 {resultMessage && <p className="mt-4 text-lg font-bold text-theme-primary">{resultMessage}</p>}
                
                {/* Controls */}
                <div className="mt-6 flex items-center gap-6 p-4 bg-theme-background/50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-theme-muted font-bold">Wager:</span>
                        <input
                            type="number"
                            value={wagerAmount}
                            onChange={(e) => setWagerAmount(Math.max(1, parseInt(e.target.value) || 1))}
                            disabled={isSpinning}
                            className="w-24 bg-theme-surface border border-theme-border rounded p-2 text-center font-bold"
                        />
                    </div>
                     <button
                        onClick={handleSpin}
                        disabled={isSpinning || wagerAmount > wager}
                        className="w-24 h-24 bg-yellow-500 rounded-full text-2xl font-black text-theme-background shadow-lg transform transition active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        SPIN
                    </button>
                </div>
            </div>
        </GameWrapper>
    );
};

export default HadesSlots;
