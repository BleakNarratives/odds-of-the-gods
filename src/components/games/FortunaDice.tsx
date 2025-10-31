// src/components/games/FortunaDice.tsx
import React, { useState } from 'react';
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';
import WagerSlider from './WagerSlider';
import { GameResultAnimation } from './GameResultAnimation';
import { FATE_METER_MAX } from '../../constants';

const Dice: React.FC<{ value: number, isRolling: boolean, isSelected?: boolean, onClick?: () => void }> = ({ value, isRolling, isSelected, onClick }) => {
    const finalFaceClass = isRolling ? '' : `dice-face-${value}`;
    const rollingClass = isRolling ? 'rolling' : '';
    const animationDelay = `-${Math.random() * 0.5}s`;
    const faceStyle = {backgroundColor: '#fffff0', border: '2px solid #e53e3e'};
    const dotStyle = {backgroundColor: '#e53e3e', boxShadow: 'inset 0 0 3px #9b2c2c'};
    const selectedStyle = isSelected ? { transform: 'scale(1.1)', boxShadow: '0 0 15px #fca311' } : {};

    return (
        <div className="dice-container" onClick={onClick} style={selectedStyle}>
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

const FortunaDice: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting' | 'rolling' | 'post-roll' | 'rerolling' | 'result'>('betting');
    const [playerRoll, setPlayerRoll] = useState({ d1: 1, d2: 1, total: 2 });
    const [fortunaRoll, setFortunaRoll] = useState({ d1: 1, d2: 1, total: 2 });
    const [winResult, setWinResult] = useState(false);
    const [isMultiplierActive, setIsMultiplierActive] = useState(false);
    const [dieToReroll, setDieToReroll] = useState<1 | 2 | null>(null);
    
    const colorMap: Record<string, string> = { rose: '#f43f5e' };
    const primaryColor = colorMap[god.color] || '#fca311';
    const isFateReady = playerState.fateMeter >= FATE_METER_MAX;

    const handleRoll = () => {
        if (gameState !== 'betting' || wagerAmount > wager) return;
        if (!onWager(wagerAmount)) return;

        setGameState('rolling');
        audioService.play('dice-roll');
        
        const p1 = Math.floor(Math.random() * 6) + 1;
        const p2 = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            setPlayerRoll({ d1: p1, d2: p2, total: p1 + p2 });
            audioService.play('dice-land');

            const f1 = Math.floor(Math.random() * 6) + 1;
            const f2 = Math.floor(Math.random() * 6) + 1;
            setFortunaRoll({ d1: f1, d2: f2, total: f1 + f2 });
            
            const playerWins = (p1 + p2) > (f1 + f2);

            if (isFateReady && !playerWins) {
                setGameState('post-roll');
            } else {
                endGame(playerWins, p1 + p2, f1+f2);
            }
        }, 2500);
    };

    const handleReroll = () => {
        if (!dieToReroll) return;
        setGameState('rerolling');
        audioService.play('dice-roll');
        setPlayerState(p => ({...p, fateMeter: 0}));

        const newDieValue = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            const newPlayerRoll = {...playerRoll};
            if(dieToReroll === 1) newPlayerRoll.d1 = newDieValue;
            if(dieToReroll === 2) newPlayerRoll.d2 = newDieValue;
            newPlayerRoll.total = newPlayerRoll.d1 + newPlayerRoll.d2;
            
            setPlayerRoll(newPlayerRoll);
            audioService.play('dice-land');
            
            const playerWins = newPlayerRoll.total > fortunaRoll.total;
            endGame(playerWins, newPlayerRoll.total, fortunaRoll.total);
        }, 1500);
    }
    
    const endGame = (isWin: boolean, pTotal: number, fTotal: number) => {
        setWinResult(isWin);
        const payout = isWin ? wagerAmount * game.payoutMultiplier : 0;
        onGameResult(wagerAmount, payout, god.id, false, false);
        setGameState('result');
    }

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
            
            {(gameState === 'rolling' || gameState === 'rerolling') && (
                <div className="animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-6">
                     <p className="text-2xl text-theme-muted italic">The threads of fate are spun...</p>
                     <div className="w-full flex justify-around items-center">
                        <div className="flex flex-col items-center"><p className="text-lg text-theme-secondary mb-2">Your Roll</p><div className="flex gap-4"><Dice value={1} isRolling={true} /><Dice value={1} isRolling={true} /></div></div>
                        <div className="flex flex-col items-center"><p className="text-lg text-rose-400 mb-2">Fortuna's Roll</p><div className="flex gap-4"><Dice value={fortunaRoll.d1} isRolling={gameState !== 'rerolling'} /><Dice value={fortunaRoll.d2} isRolling={gameState !== 'rerolling'} /></div></div>
                    </div>
                </div>
            )}

            {(gameState === 'post-roll' || gameState === 'result') && (
                 <div className="animate-fade-in relative flex flex-col items-center justify-center min-h-[300px] space-y-6">
                    {gameState === 'result' && <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />}
                     <div className="w-full flex justify-around items-center">
                        <div className="flex flex-col items-center"><p className="text-lg text-theme-secondary mb-2">Your Roll: {playerRoll.total}</p><div className="flex gap-4"><Dice value={playerRoll.d1} isRolling={false} isSelected={dieToReroll === 1} onClick={() => gameState === 'post-roll' && setDieToReroll(1)} /><Dice value={playerRoll.d2} isRolling={false} isSelected={dieToReroll === 2} onClick={() => gameState === 'post-roll' && setDieToReroll(2)} /></div></div>
                        <div className="flex flex-col items-center"><p className="text-lg text-rose-400 mb-2">Fortuna's Roll: {fortunaRoll.total}</p><div className="flex gap-4"><Dice value={fortunaRoll.d1} isRolling={false} /><Dice value={fortunaRoll.d2} isRolling={false} /></div></div>
                    </div>
                    {gameState === 'post-roll' && (
                        <div className="text-center">
                            <p className="text-lg text-theme-primary font-bold">Your Fate Meter is full! Select one of your dice to re-roll.</p>
                            <button onClick={handleReroll} disabled={!dieToReroll} className="mt-4 w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button disabled:opacity-50" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Twist Fate</button>
                        </div>
                    )}
                    {gameState === 'result' && <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>}
                </div>
            )}
        </GameWrapper>
    );
};

export default FortunaDice;
