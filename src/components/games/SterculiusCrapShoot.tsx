import React, { useState } from 'react';
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';
import WagerSlider from './WagerSlider';
import { GameResultAnimation } from './GameResultAnimation';

const LumpyDice: React.FC<{ value: number, isRolling: boolean }> = ({ value, isRolling }) => {
    const finalFaceClass = isRolling ? '' : `dice-face-${value}`;
    const rollingClass = isRolling ? 'rolling' : '';
    const animationDelay = `-${Math.random() * 0.5}s`;
    const faceStyle = {backgroundColor: '#6b4f2c', border: '2px solid #4a371d'};
    const dotStyle = {backgroundColor: '#c9a473', boxShadow: 'inset 0 0 3px #4a371d'};

    return (
        <div className="dice-container">
            <div className={`dice ${rollingClass} ${finalFaceClass}`} style={isRolling ? { animationDelay } : {}}>
                {/* Visuals for lumpy, brown dice */}
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

const SterculiusCrapShoot: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting' | 'rolling' | 'result'>('betting');
    const [roll, setRoll] = useState({ d1: 1, d2: 1, total: 2 });
    const [winResult, setWinResult] = useState(false);
    const [message, setMessage] = useState('');

    const primaryColor = '#854d0e'; // Brown

    const handleRoll = () => {
        if (gameState !== 'betting' || wagerAmount > wager) return;
        audioService.play('click');
        if (!onWager(wagerAmount)) return;

        setGameState('rolling');
        audioService.play('dice-roll');

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2;

        setTimeout(() => {
            setRoll({ d1, d2, total });
            audioService.play('dice-land');
            
            let playerWins = false;
            if (total === 7 || total === 11) {
                playerWins = true;
                setMessage(`A natural ${total}! That's some good shit!`);
            } else if (total === 2 || total === 3 || total === 12) {
                playerWins = false;
                setMessage(`Craps! You rolled a ${total}. A total loss.`);
            } else {
                // Simplified: Any other roll is a push for this low-brow game
                playerWins = false; // To avoid payout
                setMessage(`You rolled a ${total}. It's a wash. How boring.`);
            }
            
            setWinResult(playerWins);
            const payout = playerWins ? wagerAmount * game.payoutMultiplier : (total !== 2 && total !== 3 && total !== 12 ? wagerAmount : 0);
            onGameResult(wagerAmount, payout, god.id, false, false);
            
            setTimeout(() => setGameState('result'), 500);
        }, 2500);
    };

    const handlePlayAgain = () => {
        audioService.play('click');
        setWagerAmount(game.minBet);
        setGameState('betting');
        setMessage('');
    };

    return (
        <GameWrapper god={god}>
             {gameState === 'betting' && (
                <div className="animate-fade-in text-center flex flex-col items-center justify-center min-h-[300px] space-y-8">
                    <p className="text-amber-200/60 max-w-md">{game.description}</p>
                    <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                    <button
                        onClick={handleRoll}
                        disabled={wagerAmount > wager || wager < game.minBet}
                        className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                        style={{ backgroundColor: primaryColor, color: '#f7f1e3', textShadow: '0 0 5px #000' }}
                    >
                        Shoot Craps
                    </button>
                </div>
            )}

            {(gameState === 'rolling' || gameState === 'result') && (
                <div className={`animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-6`}>
                    {gameState === 'rolling' && <p className="text-2xl text-amber-200/60 italic">Dropping the deuce...</p>}
                    
                    {gameState === 'result' && (
                        <div className="h-24">
                            <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />
                        </div>
                    )}

                     <div className="w-full flex justify-center items-center gap-8">
                        <div className="flex flex-col items-center">
                          <p className="text-lg text-amber-100 mb-2">Your Roll: {gameState === 'result' ? roll.total : ''}</p>
                          <div className="flex gap-4">
                            <LumpyDice value={roll.d1} isRolling={gameState === 'rolling'} />
                            <LumpyDice value={roll.d2} isRolling={gameState === 'rolling'} />
                          </div>
                        </div>
                    </div>
                     
                    {gameState === 'result' && (
                        <>
                           <p className="text-lg text-amber-200/80 h-6">{message}</p>
                           <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: '#f7f1e3' }}>Play Again</button>
                        </>
                    )}
                </div>
            )}
        </GameWrapper>
    );
};

export default SterculiusCrapShoot;