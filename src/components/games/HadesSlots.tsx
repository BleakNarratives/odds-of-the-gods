// src/components/games/HadesSlots.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';
import * as Icons from '../icons/MythicIcons';
import SlotLever from './SlotLever';

const baseSlotSymbols = [
    { Icon: Icons.HadesIcon, id: 'hades', payout: 50, color: 'text-red-500' },
    { Icon: Icons.ZeusIcon, id: 'zeus', payout: 25, color: 'text-yellow-400' },
    { Icon: Icons.LokiIcon, id: 'loki', payout: 15, color: 'text-green-400' },
    { id: 'A', payout: 10, color: 'text-orange-500' },
    { id: 'K', payout: 8, color: 'text-orange-600' },
    { id: 'Q', payout: 5, color: 'text-orange-700' },
    { Icon: Icons.RoosterIcon, id: 'rooster', payout: 0, color: 'text-red-300' },
    { Icon: Icons.LollipopIcon, id: 'lollipop', payout: 0, color: 'text-pink-400' },
];

const REEL_COUNT = 5;
const ROW_COUNT = 3;

interface HadesSlotsProps extends GameComponentProps {
    onCustomizeClick: () => void;
    game: Game;
}

const HadesSlots: React.FC<HadesSlotsProps> = ({ god, game, wager, onWager, onGameResult, playerState, onCustomizeClick }) => {
    const [wagerAmount, setWagerAmount] = useState(20);
    // FIX: Corrected the type of the reels state to be a 2D array of symbols, not a 3D array.
    const [reels, setReels] = useState<(typeof baseSlotSymbols[0])[][]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    const slotSymbols = useMemo(() => {
        const customAssets = playerState.customGameAssets[game.id] || {};
        return baseSlotSymbols.map(symbol => ({
            ...symbol,
            customImage: customAssets[symbol.id],
        }));
    }, [playerState.customGameAssets, game.id]);

    // Initialize reels
    useEffect(() => {
        const initialReels = Array.from({ length: REEL_COUNT }, () =>
            Array.from({ length: 30 }, () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)])
        );
        setReels(initialReels);
    }, [slotSymbols]);
    
    const handleSpin = () => {
        if (isSpinning || wagerAmount > wager) return;
        if (!onWager(wagerAmount)) {
            setResultMessage("INSUFFICIENT SOULS");
            return;
        }

        setIsSpinning(true);
        setResultMessage('');
        audioService.play('reel-spin');

        // This part becomes purely visual, the result is calculated and then displayed
        setTimeout(() => {
            setIsSpinning(false);
            audioService.stop('reel-spin');
            audioService.play('reel-stop');
            
            // Calculate a random result and update the reels to show it
            const newReels = [...reels];
            let winAmount = 0;
            let finalMessage = "The spirits are silent.";

            const isWin = Math.random() < 0.25; // Game winChance
            let winningSymbol = null;
            if(isWin) {
                winningSymbol = slotSymbols[Math.floor(Math.random() * (slotSymbols.length - 2))]; // No roosters/lollipops
            }

            for (let i = 0; i < REEL_COUNT; i++) {
                const newReel = [...newReels[i]];
                const symbolToShow = isWin && i < 3 ? winningSymbol : slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                newReel[newReel.length - 2] = symbolToShow!;
                newReels[i] = newReel;
            }
            setReels(newReels);

            const middleRow = newReels.map(reel => reel[reel.length - 2]);

            // Check for wins on the middle row after spin
            for(const symbol of slotSymbols) {
                if(symbol.payout === 0) continue;
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

            if(winAmount === 0) {
                 // Special "c*ck s*cker" message
                 const roosterIndex = middleRow.findIndex(s => s.id === 'rooster');
                 const lollipopIndex = middleRow.findIndex(s => s.id === 'lollipop');
                 if (roosterIndex !== -1 && lollipopIndex !== -1 && roosterIndex < lollipopIndex) {
                     finalMessage = "Hades finds your offering... distasteful.";
                 }
                audioService.play('lose');
            }
            setResultMessage(finalMessage);
            // FIX: Added missing arguments
            onGameResult(wagerAmount, winAmount, god.id, false, false);

        }, 2000 + REEL_COUNT * 200); // Animation duration
    };

    return (
        <GameWrapper god={god}>
            <div className="flex flex-col items-center">
                <div className="flex gap-4">
                     {/* Reels */}
                    <div className="grid grid-cols-5 gap-2 bg-black/50 p-4 rounded-lg border-2 border-slate-700 shadow-inner">
                        {reels.map((reel, i) => (
                            <div key={i} className="h-48 w-20 bg-slate-800 rounded overflow-hidden relative">
                                <div
                                    className="flex flex-col items-center absolute top-0 left-0"
                                    style={{
                                        transform: `translateY(-${(reel.length - ROW_COUNT) * 4}rem)`,
                                        transition: `transform ${isSpinning ? 2 + i * 0.2 : 0.5}s cubic-bezier(0.25, 1, 0.5, 1)`,
                                    }}
                                >
                                    {reel.map((symbol, j) => (
                                        <div key={j} className="h-16 w-20 flex items-center justify-center flex-shrink-0">
                                            {symbol.customImage ? <img src={`data:image/png;base64,${symbol.customImage}`} alt={symbol.id} className="w-12 h-12 object-contain" /> : symbol.Icon ? <symbol.Icon className={`w-12 h-12 ${symbol.color}`} /> : <span className={`text-4xl font-bold ${symbol.color}`}>{symbol.id}</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 via-transparent to-slate-800/80 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col justify-center items-center">
                         <SlotLever onPull={handleSpin} disabled={isSpinning || wagerAmount > wager} />
                    </div>
                </div>
                 {resultMessage && <p className="mt-4 text-lg font-bold text-theme-primary h-6">{resultMessage}</p>}
                
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
                    {playerState.accountTier === 'Deity' && (
                        <button onClick={onCustomizeClick} className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-md text-sm hover:bg-cyan-500 transition-colors">
                            Customize
                        </button>
                    )}
                </div>
            </div>
        </GameWrapper>
    );
};

export default HadesSlots;
