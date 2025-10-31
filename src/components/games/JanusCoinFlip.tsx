import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { JanusPlayerChoice, GameComponentProps, Game } from '../../types';
import { audioService } from '../../services/audioService';
import GameWrapper from './GameWrapper';
import WagerSlider from './WagerSlider';
// FIX: Changed import to named export
import { GameResultAnimation } from './GameResultAnimation';
import { JanusCoinFlipAnimation } from '../game-animations/JanusCoinFlip';

type BetType = 'Order' | 'Chaos' | 'Angle';

const JanusCoinFlip: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting' | 'flipping' | 'result'>('betting');
    const [playerChoice, setPlayerChoice] = useState<BetType | null>(null);
    const [winResult, setWinResult] = useState(false);
    const [isAngleWin, setIsAngleWin] = useState(false);

    const primaryColor = '#64748b';

    const handleFlip = (choice: BetType) => {
        if (wagerAmount > wager) return;
        audioService.play('click');
        if (!onWager(wagerAmount)) return;
        
        setPlayerChoice(choice);
        
        // The "Exact Angle" bet has a very low chance of success
        const angleRoll = Math.random();
        const angleWin = angleRoll < 0.1; // 10% chance for angle win
        
        let isWin = false;
        if (choice === 'Angle') {
            isWin = angleWin;
        } else {
            // Standard 50/50 for Order/Chaos, but an angle win can't happen here
            isWin = angleWin ? false : Math.random() < game.winChance;
        }
        
        setWinResult(isWin);
        setIsAngleWin(angleWin);
        setGameState('flipping');
    };

    const handleAnimationEnd = () => {
        let payout = 0;
        if (winResult) {
            payout = wagerAmount * (playerChoice === 'Angle' ? 10 : game.payoutMultiplier);
        }
        onGameResult(wagerAmount, payout, god.id, false, false);
        setGameState('result');
    };
    
    const handlePlayAgain = () => {
        audioService.play('click');
        setGameState('betting');
        setPlayerChoice(null);
    }
    
    return (
        <GameWrapper god={god}>
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                 {gameState === 'betting' && (
                    <div className="animate-fade-in text-center flex flex-col items-center justify-center space-y-6 w-full">
                        <p className="text-theme-muted max-w-md">{game.description}</p>
                        <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                         <p className="text-theme-muted text-sm">Choose your conviction.</p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                             <button
                                onClick={() => handleFlip('Order')}
                                disabled={wagerAmount > wager}
                                className="flex-1 border-2 border-slate-400 bg-slate-800 text-slate-200 font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:bg-slate-700 hover:border-white transition-colors disabled:opacity-50"
                            >
                                Bet on Order (2x)
                            </button>
                            <button
                                onClick={() => handleFlip('Chaos')}
                                disabled={wagerAmount > wager}
                                className="flex-1 border-2 border-yellow-400 bg-yellow-800 text-yellow-200 font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:bg-yellow-700 hover:border-white transition-colors disabled:opacity-50"
                            >
                                Bet on Chaos (2x)
                            </button>
                        </div>
                         <button
                            onClick={() => handleFlip('Angle')}
                            disabled={wagerAmount > wager}
                            className="w-full max-w-lg border-2 border-theme-primary bg-theme-primary/10 text-theme-primary font-bold py-2 px-6 rounded-lg text-md tracking-wider uppercase hover:bg-theme-primary/30 transition-colors disabled:opacity-50"
                        >
                            The Exact Angle Bet (10x Payout)
                        </button>
                    </div>
                )}
                
                 {gameState === 'flipping' && playerChoice && (
                    <JanusCoinFlipAnimation 
                        isWin={winResult} 
                        choice={playerChoice === 'Angle' ? (isAngleWin ? 'Order' : 'Chaos') : playerChoice as JanusPlayerChoice}
                        onAnimationEnd={handleAnimationEnd}
                        isAngleWin={isAngleWin}
                    />
                 )}
                 
                 {gameState === 'result' && playerChoice && (
                     <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center space-y-4">
                         <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * (isAngleWin ? 10 : game.payoutMultiplier)} onAnimationEnd={() => {}} />
                         <p className="text-lg text-theme-muted">
                            {isAngleWin ? <span className="text-theme-primary font-bold">The Exact Angle! A perfect outcome!</span> : `The coin has settled.`}
                        </p>
                         <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>
                     </div>
                 )}
            </div>
        </GameWrapper>
    );
};

export default JanusCoinFlip;