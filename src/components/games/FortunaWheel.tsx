import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';
import WagerSlider from './WagerSlider';
// FIX: Changed import to named export
import { GameResultAnimation } from './GameResultAnimation';

const NUM_SEGMENTS = 16;

const FortunaWheel: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [isSpinning, setIsSpinning] = useState(false);
    const [finalAngle, setFinalAngle] = useState(0);
    const [gameState, setGameState] = useState<'betting'|'spinning'|'result'>('betting');
    const [winResult, setWinResult] = useState(false);
    
    const primaryColor = '#f43f5e';

    const handleSpin = () => {
        if (isSpinning || wagerAmount > wager) return;
        audioService.play('click');
        if (!onWager(wagerAmount)) return;

        setGameState('spinning');
        setIsSpinning(true);
        audioService.play('reel-spin');

        const isWin = Math.random() < game.winChance;
        setWinResult(isWin);
        const degreesPerSegment = 360 / NUM_SEGMENTS;
        
        const winningSegments = Math.floor(NUM_SEGMENTS * game.winChance);
        let targetSegment = 0;
        if (isWin) {
            targetSegment = Math.floor(Math.random() * winningSegments);
        } else {
            targetSegment = winningSegments + Math.floor(Math.random() * (NUM_SEGMENTS - winningSegments));
        }

        const randomOffset = (Math.random() - 0.5) * degreesPerSegment * 0.8;
        const targetAngle = (targetSegment * degreesPerSegment) + randomOffset;
        
        const fullSpins = 5;
        const newFinalAngle = (fullSpins * 360) + targetAngle;
        
        setFinalAngle(newFinalAngle);

        setTimeout(() => {
            setIsSpinning(false);
            audioService.stop('reel-spin');
            audioService.play('reel-stop');
            const payout = isWin ? wagerAmount * game.payoutMultiplier : 0;
            onGameResult(wagerAmount, payout, god.id, false, false);
            setGameState('result');
        }, 5000); // Animation duration
    };

    const handlePlayAgain = () => {
        audioService.play('click');
        setGameState('betting');
    };

    const wheelSegments = Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
        const isWinSegment = i < Math.floor(NUM_SEGMENTS * game.winChance);
        return (
            <div
                key={i}
                className="absolute w-1/2 h-1/2 origin-bottom-right"
                style={{
                    transform: `rotate(${i * (360 / NUM_SEGMENTS)}deg)`,
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`
                }}
            >
                <div className={`w-full h-full ${isWinSegment ? 'bg-green-500/70' : 'bg-red-500/70'}`} />
            </div>
        );
    });

    return (
        <GameWrapper god={god}>
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                {gameState === 'betting' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center space-y-8 w-full">
                        <p className="text-theme-muted max-w-md">{game.description}</p>
                        <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                        <button
                            onClick={handleSpin}
                            disabled={wagerAmount > wager || wager < game.minBet}
                            className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                        >
                            Spin the Wheel
                        </button>
                    </div>
                )}
                
                {(gameState === 'spinning' || gameState === 'result') && (
                     <div className="relative w-64 h-64">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+32px)] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-amber-300 z-10"></div>
                        <div
                            className="w-full h-full rounded-full border-8 border-amber-400 overflow-hidden shadow-2xl"
                             style={{
                                transition: `transform 4s cubic-bezier(0.25, 1, 0.5, 1)`,
                                transform: `rotate(${finalAngle}deg)`
                            }}
                        >
                            {wheelSegments}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-amber-200 border-4 border-amber-500"></div>
                        </div>
                    </div>
                )}

                {gameState === 'spinning' && <p className="text-slate-400 mt-6 text-2xl italic">The wheel turns...</p>}

                {gameState === 'result' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center text-center space-y-4 mt-6">
                         <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />
                         <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>
                     </div>
                )}
            </div>
        </GameWrapper>
    );
};

export default FortunaWheel;