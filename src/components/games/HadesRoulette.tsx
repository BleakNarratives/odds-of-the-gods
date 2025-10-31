
// src/components/games/HadesRoulette.tsx
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../types';
import { audioService } from '../../services/audioService';
import GameWrapper from './GameWrapper';
import WagerSlider from './WagerSlider';
// FIX: Changed to named import for GameResultAnimation
import { GameResultAnimation } from './GameResultAnimation';

type BetType = number | 'even' | 'odd' | null;

const HadesRoulette: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [bet, setBet] = useState<BetType>(null);
    const [resultNumber, setResultNumber] = useState<number | null>(null);
    const [gameState, setGameState] = useState<'betting' | 'spinning' | 'result'>('betting');
    const [winResult, setWinResult] = useState(false);
    
    const primaryColor = '#ef4444'; // Hades' Red

    const handleBet = (newBet: BetType) => {
        if (gameState !== 'betting') return;
        setBet(newBet);
        audioService.play('click');
    };

    const handleSpin = () => {
        if (gameState !== 'betting' || bet === null || wagerAmount > wager) {
            return;
        }
        audioService.play('click');
        if (!onWager(wagerAmount)) return;

        setGameState('spinning');
        setResultNumber(null);
        audioService.play('reel-spin');

        setTimeout(() => {
            audioService.stop('reel-spin');
            audioService.play('reel-stop');
            const finalNumber = Math.floor(Math.random() * 13); // 0-12 for simplicity
            setResultNumber(finalNumber);

            let isWin = false;
            let payoutMultiplier = 0;

            if (typeof bet === 'number' && bet === finalNumber) {
                isWin = true;
                payoutMultiplier = 10;
            } else if (bet === 'even' && finalNumber !== 0 && finalNumber % 2 === 0) {
                isWin = true;
                payoutMultiplier = 2;
            } else if (bet === 'odd' && finalNumber % 2 !== 0) {
                isWin = true;
                payoutMultiplier = 2;
            }

            setWinResult(isWin);
            // FIX: Pass all required arguments to onGameResult
            onGameResult(wagerAmount, isWin ? wagerAmount * payoutMultiplier : 0, god.id, false, false);
            setGameState('result');
        }, 3000);
    };

    const handlePlayAgain = () => {
        audioService.play('click');
        setGameState('betting');
        setBet(null);
    };

    const getNumberClass = (num: BetType) => {
        if (bet === num) return `border-theme-win ring-2 ring-theme-win`;
        return `border-theme-border`;
    }

    return (
        <GameWrapper god={god}>
            <div className="text-center">
                {gameState === 'betting' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-6">
                        <p className="text-theme-muted max-w-md">{game.description}</p>
                        <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                        
                        <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                             <button onClick={() => handleBet('even')} className={`py-3 font-bold rounded-lg transition bg-theme-surface hover:bg-theme-surface/50 border-2 ${getNumberClass('even')}`}>EVEN (2x)</button>
                             <button onClick={() => handleBet(0)} className={`py-3 font-bold rounded-lg transition bg-theme-surface hover:bg-theme-surface/50 border-2 ${getNumberClass(0)}`}>0 (10x)</button>
                             <button onClick={() => handleBet('odd')} className={`py-3 font-bold rounded-lg transition bg-theme-surface hover:bg-theme-surface/50 border-2 ${getNumberClass('odd')}`}>ODD (2x)</button>
                        </div>

                        <button
                            onClick={handleSpin}
                            disabled={bet === null || wagerAmount > wager}
                            className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                        >
                           Spin Wheel
                        </button>
                    </div>
                )}

                {gameState === 'spinning' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-6">
                        <div className="w-32 h-32 rounded-full border-8 border-dashed border-red-500 animate-spin flex items-center justify-center">
                             <div className="w-24 h-24 rounded-full bg-theme-surface flex items-center justify-center text-4xl font-bold text-theme-muted">?</div>
                        </div>
                        <p className="text-2xl text-theme-muted italic">The River Styx churns...</p>
                    </div>
                )}
                
                {gameState === 'result' && (
                     <div className="animate-fade-in flex flex-col items-center justify-center min-h-[300px] space-y-4">
                        <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * (winResult ? (typeof bet === 'number' ? 10 : 2) : 0)} onAnimationEnd={()=>{}} />
                        <div className="w-32 h-32 rounded-full border-8 border-red-700 bg-theme-surface flex items-center justify-center text-5xl font-bold text-white">
                            {resultNumber}
                        </div>
                        <p className="text-lg text-theme-muted">You bet on <span className="font-bold text-white">{bet}</span>. The result was <span className="font-bold text-white">{resultNumber}</span>.</p>
                         <button
                            onClick={handlePlayAgain}
                            className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
};

export default HadesRoulette;