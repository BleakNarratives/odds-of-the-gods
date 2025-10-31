import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import WagerSlider from './WagerSlider';
// FIX: Changed import to named export
import { GameResultAnimation } from './GameResultAnimation';
import { HecateCrossroadsChoice, HecateCrossroadsAnimation } from '../game-animations/HecateCrossroads';

const HecateCrossroads: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting'|'choice'|'shuffling'|'result'>('betting');
    const [playerChoice, setPlayerChoice] = useState<number | null>(null);
    const [winResult, setWinResult] = useState(false);
    const [eliminatedTorch, setEliminatedTorch] = useState<number | null>(null);

    const primaryColor = '#6366f1';
    const scryCost = Math.ceil(wagerAmount * 0.2);
    
    const handleProceedToChoice = () => {
        if(wagerAmount > wager) return;
        audioService.play('click');
        if(!onWager(wagerAmount)) return;
        
        const isWin = Math.random() < (eliminatedTorch !== null ? 0.5 : game.winChance);
        setWinResult(isWin);
        setGameState('choice');
    }
    
    const handleChoice = (choice: number) => {
        if (choice === eliminatedTorch) return; // Cannot choose eliminated torch
        audioService.play('click');
        setPlayerChoice(choice);
        setGameState('shuffling');
    }

    const handleScry = () => {
        if (eliminatedTorch !== null || wager < scryCost) return;
        audioService.play('swoosh');
        onWager(scryCost);
        
        // Determine a losing torch to eliminate that isn't the future winning choice
        const winIndex = winResult ? playerChoice : [0,1,2].find(i => i !== playerChoice); // simplified logic
        let toEliminate;
        do {
            toEliminate = Math.floor(Math.random() * 3);
        } while (toEliminate === winIndex);
        
        setEliminatedTorch(toEliminate);
    }
    
    const handleAnimationEnd = () => {
        const payout = winResult ? wagerAmount * game.payoutMultiplier : 0;
        onGameResult(wagerAmount, payout, god.id, false, false);
        setGameState('result');
    }

    const handlePlayAgain = () => {
        audioService.play('click');
        setGameState('betting');
        setPlayerChoice(null);
        setEliminatedTorch(null);
    }

    return (
        <GameWrapper god={god}>
             <div className="flex flex-col items-center justify-center min-h-[300px]">
                {gameState === 'betting' && (
                    <div className="animate-fade-in text-center flex flex-col items-center justify-center space-y-8 w-full">
                        <p className="text-theme-muted max-w-md">{game.description}</p>
                        <WagerSlider min={game.minBet} max={game.maxBet} value={wagerAmount} onChange={setWagerAmount} souls={wager} color={primaryColor} />
                        <button
                            onClick={handleProceedToChoice}
                            disabled={wagerAmount > wager || wager < game.minBet}
                            className="w-full max-w-sm py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                        >
                            Begin Ritual
                        </button>
                    </div>
                )}
                
                {gameState === 'choice' && (
                    <div className="animate-fade-in w-full">
                        <HecateCrossroadsChoice onChoice={handleChoice} eliminatedTorch={eliminatedTorch} />
                        <div className="text-center mt-4">
                             <button
                                onClick={handleScry}
                                disabled={eliminatedTorch !== null || wager < scryCost}
                                className="border-2 border-indigo-400 bg-indigo-900/50 text-indigo-300 font-bold py-2 px-6 rounded-full text-sm hover:bg-indigo-800/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Scry the Paths ({scryCost} Souls)
                            </button>
                        </div>
                    </div>
                )}
                
                {gameState === 'shuffling' && playerChoice !== null && (
                    <HecateCrossroadsAnimation 
                        isWin={winResult} 
                        choice={playerChoice} 
                        onAnimationEnd={handleAnimationEnd}
                        eliminatedTorch={eliminatedTorch}
                    />
                )}
                
                 {gameState === 'result' && (
                     <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center space-y-4">
                         <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />
                         <p className="text-lg text-theme-muted">You chose the {winResult ? 'correct' : 'wrong'} torch.</p>
                         <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>
                     </div>
                 )}
            </div>
        </GameWrapper>
    );
};

export default HecateCrossroads;