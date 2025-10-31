import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../src/types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../src/services/audioService';
import WagerSlider from './WagerSlider';
// FIX: Corrected to named import
import { GameResultAnimation } from './GameResultAnimation';

const Dice: React.FC<{ value: number, isRolling: boolean }> = ({ value, isRolling }) => {
    const finalFaceClass = isRolling ? '' : `dice-face-${value}`;
    const rollingClass = isRolling ? 'rolling' : '';
    const animationDelay = `-${Math.random() * 0.5}s`;
    const faceStyle = {backgroundColor: '#fffff0', border: '2px solid #e53e3e'};
    const dotStyle = {backgroundColor: '#e53e3e', boxShadow: 'inset 0 0 3px #9b2c2c'};

    return (
        <div className="dice-container">
            <div className={`dice ${rollingClass} ${finalFaceClass}`} style={isRolling ? { animationDelay } : {}}>
                <div className="face face-1" style={faceStyle}><span className="dot" style={dotStyle}></span></div>
                <div className="face face-2" style={faceStyle}><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div>
                <div className="face face-3" style={faceStyle}><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div>
                <div className="face face-4" style={faceStyle}><div className="column"><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div><div className="column"><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div></div>
                <div className="face face-5" style={faceStyle}><div className="column"><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div><div className="column"><span className="dot" style={dotStyle}></span></div><div className="column"><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div></div>
                <div className="face face-6" style={faceStyle}><div className="column"><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div><div className="column"><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span><span className="dot" style={dotStyle}></span></div></div>
            </div>
        </div>
    );
};

const FortunaDice: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting' | 'rolling' | 'result'>('betting');
    const [playerRoll, setPlayerRoll] = useState({ d1: 1, d2: 1, total: 2 });
    const [fortunaRoll, setFortunaRoll] = useState({ d1: 1, d2: 1, total: 2 });
    const [winResult, setWinResult] = useState(false);
    
    const colorMap: Record<string, string> = { rose: '#f43f5e' };
    const primaryColor = colorMap[god.color] || '#fca311';

    const handleRoll = () => {
        if (gameState !== 'betting' || wagerAmount > wager) return;
        if (!onWager(wagerAmount)) return;

        setGameState('rolling');
        audioService.play('dice-roll');

        const p1 = Math.floor(Math.random() * 6) + 1;
        const p2 = Math.floor(Math.random() * 6) + 1;
        const f1 = Math.floor(Math.random() * 6) + 1;
        const f2 = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            setPlayerRoll({ d1: p1, d2: p2, total: p1 + p2 });
            setFortunaRoll({ d1: f1, d2: f2, total: f1 + f2 });
            audioService.play('dice-land');
            
            const playerWins = (p1 + p2) > (f1 + f2);
            setWinResult(playerWins);

            const payout = playerWins ? wagerAmount * game.payoutMultiplier : 0;
            onGameResult(wagerAmount, payout, god.id, false, false);
            
            setTimeout(() => setGameState('result'), 500);
        }, 2500);
    };

    const handlePlayAgain = () => {
        setWagerAmount(game.minBet);
        setGameState('betting');
    };

    return (
        <GameWrapper god={god}>
            {gameState === 'betting' && (
                <div className="animate-fade-in text-center flex flex-col items-center justify-center min-h-[300px] space-y-8">
                    <p className="text-theme-muted max-w-md">{game.description}</p>
                    <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                    <button
                        onClick={handleRoll}
                        disabled={wagerAmount > wager || wager < game.minBet}
                        className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                        style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                    >
                        Roll Dice
                    </button>
                </div>
            )}
            
            {gameState === 'rolling' && (
                <div className="animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-6">
                     <p className="text-2xl text-theme-muted italic">The threads of fate are spun...</p>
                     <div className="w-full flex justify-around items-center">
                        <div className="flex flex-col items-center"><p className="text-lg text-theme-secondary mb-2">Your Roll</p><div className="flex gap-4"><Dice value={1} isRolling={true} /><Dice value={1} isRolling={true} /></div></div>
                        <div className="flex flex-col items-center"><p className="text-lg text-rose-400 mb-2">Fortuna's Roll</p><div className="flex gap-4"><Dice value={1} isRolling={true} /><Dice value={1} isRolling={true} /></div></div>
                    </div>
                </div>
            )}

            {gameState === 'result' && (
                <div className="animate-fade-in relative flex flex-col items-center justify-center min-h-[300px] space-y-6">
                    {winResult && (
                        <div className="win-animation-overlay">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="coin-fall"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        animationDuration: `${Math.random() * 2 + 1}s`,
                                        animationDelay: `${Math.random() * 1.5}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />
                     <div className="w-full flex justify-around items-center">
                        <div className="flex flex-col items-center"><p className="text-lg text-theme-secondary mb-2">Your Roll: {playerRoll.total}</p><div className="flex gap-4"><Dice value={playerRoll.d1} isRolling={false} /><Dice value={playerRoll.d2} isRolling={false} /></div></div>
                        <div className="flex flex-col items-center"><p className="text-lg text-rose-400 mb-2">Fortuna's Roll: {fortunaRoll.total}</p><div className="flex gap-4"><Dice value={fortunaRoll.d1} isRolling={false} /><Dice value={fortunaRoll.d2} isRolling={false} /></div></div>
                    </div>
                    <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>
                </div>
            )}
        </GameWrapper>
    );
};

export default FortunaDice;