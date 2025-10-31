
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { GameComponentProps, Game } from '../../types';
import GameWrapper from './GameWrapper';
import { audioService } from '../../services/audioService';

const AnubisJars: React.FC<GameComponentProps & { game: Game }> = ({ god, game, wager, onWager, onGameResult, playerState, setPlayerState }) => {
    const [wagerAmount, setWagerAmount] = useState(game.minBet);
    const [jars, setJars] = useState<('win' | 'loss')[]>(['loss', 'loss', 'loss']);
    const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
    const [resultMessage, setResultMessage] = useState<string>('');
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'revealed'>('betting');
    
    const primaryColor = '#2563eb';

    const setupNewGame = () => {
        audioService.play('click');
        const winIndex = Math.floor(Math.random() * 3);
        const newJars: ('win'|'loss')[] = ['loss', 'loss', 'loss'];
        newJars[winIndex] = 'win';
        setJars(newJars);
        setRevealed([false, false, false]);
        setResultMessage('');
        setGameState('playing');
        audioService.play('shuffle');
    };

    const handleJarClick = (index: number) => {
        if (gameState !== 'playing' || wagerAmount > wager) return;

        if (!onWager(wagerAmount)) {
            setResultMessage("INSUFFICIENT SOULS TO DISTURB THE SACRED JARS");
            return;
        }

        audioService.play('click');
        const isWin = jars[index] === 'win';
        const winAmount = isWin ? wagerAmount * 3 : 0;
        
        // FIX: Add missing arguments
        onGameResult(wagerAmount, winAmount, god.id, false, false);

        setResultMessage(isWin ? `The Heart is Found! You win ${winAmount.toLocaleString()} Souls!` : "An empty vessel. Your offering is lost.");
        setRevealed([true, true, true]);
        setGameState('revealed');
        if (isWin) audioService.play('win'); else audioService.play('lose');
    };

    const handlePlayAgain = () => {
        audioService.play('click');
        setGameState('betting');
        setResultMessage('');
    };

    const JarIcon = () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-200">
            <path d="M6 3H18V5H6V3M6 7H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7Z" />
        </svg>
    );

    // FIX: Added return statement with JSX to make this a valid React component.
    return (
        <GameWrapper god={god}>
            <div className="text-center">
                {gameState === 'betting' && (
                    <div className="animate-fade-in">
                        <p className="text-theme-muted mb-6">{game.description}</p>
                        <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-theme-background/70 rounded-lg">
                            <label className="text-theme-muted">Wager (Souls)</label>
                            <input
                                type="number"
                                min="10" step="10"
                                value={wagerAmount}
                                onChange={(e) => setWagerAmount(Math.max(10, parseInt(e.target.value) || 0))}
                                className="w-32 text-center p-2 rounded-lg bg-theme-surface border-2 border-theme-border focus:border-theme-primary transition text-theme-secondary"
                            />
                        </div>
                        <button
                            onClick={setupNewGame}
                            disabled={wagerAmount <= 0 || wagerAmount > wager}
                            className="w-full py-4 text-2xl font-extrabold rounded-xl transition transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98 shimmer-button"
                            style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                        >
                            Begin the Ritual
                        </button>
                    </div>
                )}

                {gameState !== 'betting' && (
                    <div className="min-h-[200px] mb-8 flex items-center justify-center space-x-4 sm:space-x-8 animate-fade-in">
                        {jars.map((card, index) => (
                            <div
                                key={index}
                                onClick={() => handleJarClick(index)}
                                className={`p-4 rounded-lg flex items-center justify-center transition-all duration-300 ${gameState === 'playing' ? 'cursor-pointer hover:scale-105' : ''}`}
                                style={{ backgroundColor: revealed[index] ? (card === 'win' ? 'var(--color-win)' : 'var(--color-loss)') : 'var(--color-surface)', border: `2px solid ${primaryColor}80`}}
                            >
                                <JarIcon />
                            </div>
                        ))}
                    </div>
                )}
                
                {resultMessage && (
                    <div className={`text-xl font-bold p-3 rounded-lg mb-6 ${resultMessage.includes('INSUFFICIENT') || resultMessage.includes('lost') ? 'text-theme-loss bg-theme-loss/20' : 'text-theme-win bg-theme-win/20'}`}>
                        {resultMessage}
                    </div>
                )}

                {gameState === 'revealed' && (
                    <button
                        onClick={handlePlayAgain}
                        className="w-full py-4 text-2xl font-extrabold rounded-xl transition transform hover:scale-102 active:scale-98 shimmer-button"
                        style={{ backgroundColor: primaryColor, color: 'var(--color-background)', textShadow: '0 0 5px #000' }}
                    >
                        Play Again
                    </button>
                )}
            </div>
        </GameWrapper>
    );
};

export default AnubisJars;