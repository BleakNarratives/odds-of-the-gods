import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import WagerSlider from './WagerSlider';
// FIX: Changed import to named export
import { GameResultAnimation } from './GameResultAnimation';
import { MorriganProphecyChoice, MorriganProphecyAnimation } from '../game-animations/MorriganProphecy';

const MorriganProphecy: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [gameState, setGameState] = useState<'betting'|'choice'|'shuffling'|'result'>('betting');
    const [playerChoice, setPlayerChoice] = useState<number | null>(null);
    const [winResult, setWinResult] = useState(false);

    const primaryColor = '#14b8a6';
    
    const handleProceedToChoice = () => {
        if(wagerAmount > wager) return;
        audioService.play('click');
        if(!onWager(wagerAmount)) return;
        setGameState('choice');
    }
    
    const handleChoice = (choice: number) => {
        audioService.play('click');
        setPlayerChoice(choice);
        const isWin = Math.random() < game.winChance;
        setWinResult(isWin);
        setGameState('shuffling');
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
                            Heed the Prophecy
                        </button>
                    </div>
                )}
                
                {gameState === 'choice' && <MorriganProphecyChoice onChoice={handleChoice} />}
                
                {gameState === 'shuffling' && playerChoice !== null && (
                    <MorriganProphecyAnimation 
                        isWin={winResult} 
                        choice={playerChoice} 
                        onAnimationEnd={handleAnimationEnd} 
                    />
                )}
                
                 {gameState === 'result' && (
                     <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center space-y-4">
                         <GameResultAnimation isWin={winResult} god={god} payout={wagerAmount * game.payoutMultiplier} onAnimationEnd={() => {}} />
                         <p className="text-lg text-theme-muted">You chose the {winResult ? 'crow of victory' : 'crow of ruin'}.</p>
                         <button onClick={handlePlayAgain} className="w-full max-w-sm py-3 text-xl font-bold rounded-lg shimmer-button" style={{ backgroundColor: primaryColor, color: 'var(--color-background)' }}>Play Again</button>
                     </div>
                 )}
            </div>
        </GameWrapper>
    );
};

export default MorriganProphecy;