import React, { useState, useMemo } from 'react';
import { ZeusIcon, HadesIcon, LokiIcon, FortunaIcon, AnubisIcon } from '../icons/MythicIcons';
import { audioService } from '../../services/audioService';

interface OlympianSlotsProps {
    winChance: number;
    payoutMultiplier: number; 
    onComplete: (result: 'win' | 'loss') => void;
}

const symbols = [
    { Icon: ZeusIcon, id: 'zeus', color: 'text-yellow-400' },
    { Icon: HadesIcon, id: 'hades', color: 'text-red-400' },
    { Icon: LokiIcon, id: 'loki', color: 'text-green-400' },
    { Icon: FortunaIcon, id: 'fortuna', color: 'text-rose-400' },
    { Icon: AnubisIcon, id: 'anubis', color: 'text-blue-400' },
];

const REEL_SPIN_DURATION = 3000; // ms

export const OlympianSlots: React.FC<OlympianSlotsProps> = ({ winChance, payoutMultiplier, onComplete }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [finalSymbols, setFinalSymbols] = useState<string[]>(['zeus', 'hades', 'loki']);
    const [isWin, setIsWin] = useState(false);

    const reels = useMemo(() => {
        return [0, 1, 2].map(() => {
            // Create a long, shuffled array for a more random spin appearance
            let reelStrip: typeof symbols = [];
            for (let i = 0; i < 5; i++) {
                reelStrip = reelStrip.concat([...symbols].sort(() => Math.random() - 0.5));
            }
            return reelStrip;
        });
    }, []);

    const handleSpin = () => {
        if (isSpinning) return;
        
        audioService.play('reel-spin');
        setIsSpinning(true);
        setIsWin(false);

        // Determine outcome
        const roll = Math.random();
        const win = roll < winChance;
        
        let resultSymbols: string[];
        if (win) {
            // Jackpot (3 Zeus) is a rare event within the win chance
            const isJackpot = Math.random() < 0.1; 
            if (isJackpot) {
                resultSymbols = ['zeus', 'zeus', 'zeus'];
            } else {
                // Pick a non-Zeus symbol for a regular win
                const winningSymbol = symbols[Math.floor(Math.random() * (symbols.length - 1)) + 1];
                resultSymbols = [winningSymbol.id, winningSymbol.id, winningSymbol.id];
            }
        } else {
            // create a losing combination, ensuring it's not a winning one
            let s1 = symbols[Math.floor(Math.random() * symbols.length)].id;
            let s2 = symbols[Math.floor(Math.random() * symbols.length)].id;
            let s3 = symbols[Math.floor(Math.random() * symbols.length)].id;
            while(s1 === s2 && s2 === s3) {
                 s2 = symbols[Math.floor(Math.random() * symbols.length)].id;
                 s3 = symbols[Math.floor(Math.random() * symbols.length)].id;
            }
            resultSymbols = [s1, s2, s3];
        }
        setFinalSymbols(resultSymbols);

        setTimeout(() => {
            audioService.stop('reel-spin');
            audioService.play('reel-stop');
            setIsSpinning(false);
            
            const finalIsWin = (resultSymbols[0] === resultSymbols[1] && resultSymbols[1] === resultSymbols[2]);
            setIsWin(finalIsWin);

            if (finalIsWin) {
                if (resultSymbols[0] === 'zeus') {
                    audioService.play('big-win');
                } else {
                    audioService.play('small-win');
                }
            } else {
                // A soft sound for a loss
            }

            setTimeout(() => {
                onComplete(finalIsWin ? 'win' : 'loss');
            }, 2000);
        }, REEL_SPIN_DURATION);
    };
    
    return (
         <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex justify-center items-center gap-4 bg-slate-900/50 border-2 border-theme-border p-4 rounded-lg shadow-inner">
                {reels.map((reel, reelIndex) => {
                     const finalPosition = reel.findIndex((s, i) => s.id === finalSymbols[reelIndex] && i > symbols.length);
                     const spinPosition = reel.length - symbols.length + finalPosition;

                    return (
                        <div key={reelIndex} className="w-24 h-24 bg-slate-800 rounded-md overflow-hidden relative">
                            <div 
                                className="flex flex-col items-center"
                                style={{
                                    transform: isSpinning
                                        ? `translateY(-${(reel.length - 3) * 6}rem)`
                                        : `translateY(-${finalPosition * 6}rem)`,
                                    transition: `transform ${isSpinning ? REEL_SPIN_DURATION + reelIndex * 200 : 500}ms cubic-bezier(0.25, 0.1, 0.25, 1.0)`,
                                }}
                            >
                                {reel.map((symbol, i) => (
                                    <div key={i} className={`w-24 h-24 flex items-center justify-center flex-shrink-0 ${!isSpinning && isWin && symbol.id === finalSymbols[reelIndex] ? 'animate-symbol-win' : ''}`}>
                                        <symbol.Icon className={`w-16 h-16 ${symbol.color}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 via-transparent to-slate-800/80" />
                        </div>
                    )
                })}
            </div>
            
            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-6 bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-yellow-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
            >
                {isSpinning ? 'Spinning...' : 'Spin for Zeus'}
            </button>
        </div>
    )
}
