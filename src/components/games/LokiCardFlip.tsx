// src/components/games/LokiCardFlip.tsx
import React, { useState, useEffect } from 'react';
import { GameComponentProps } from '../../types';
import { audioService } from '../../services/audioService';
import GameWrapper from './GameWrapper';

const LokiCardFlip: React.FC<GameComponentProps> = ({ god, wager, onWager, onGameResult }) => {
    const [wagerAmount, setWagerAmount] = useState(100);
    const [cards, setCards] = useState<( 'win' | 'loss')[]>(['loss', 'loss', 'loss']);
    const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
    const [resultMessage, setResultMessage] = useState<string>('');
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'revealed'>('betting');
    
    const primaryColor = '#10b981'; // Loki's Green

    const setupNewGame = () => {
        const winIndex = Math.floor(Math.random() * 3);
        const newCards: ('win'|'loss')[] = ['loss', 'loss', 'loss'];
        newCards[winIndex] = 'win';
        setCards(newCards);
        setRevealed([false, false, false]);
        setResultMessage('');
        setGameState('playing');
        audioService.play('shuffle');
    };

    const handleCardClick = (index: number) => {
        if (gameState !== 'playing' || wagerAmount > wager) return;

        if (!onWager(wagerAmount)) {
            setResultMessage("INSUFFICIENT SOULS TO TEST LOKI'S LUCK");
            return;
        }

        audioService.play('click');
        const isWin = cards[index] === 'win';
        const winAmount = isWin ? wagerAmount * 3 : 0;
        
        onGameResult(wagerAmount, winAmount, god.id);

        setResultMessage(isWin ? `LOKI'S PRIZE! You win ${winAmount.toLocaleString()} Souls!` : "LOKI'S TRICK. A card of shadows.");
        setRevealed([true, true, true]);
        setGameState('revealed');
        // if (isWin) audioService.play('big-win'); else audioService.play('loss');
    };

    const handlePlayAgain = () => {
        setGameState('betting');
        setResultMessage('');
    };

    return (
        <GameWrapper god={god}>
            <div className="text-center">
                {gameState === 'betting' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-center items-center space-x-4 mb-8 p-4 bg-theme-background/70 rounded-lg">
                            <label className="text-theme-muted">Wager (Souls)</label>
                            <input
                                type="number"
                                min="10"
                                step="10"
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
                            Start Game
                        </button>
                    </div>
                )}

                {gameState !== 'betting' && (
                    <div className="min-h-[200px] mb-8 flex items-center justify-center space-x-4 sm:space-x-6 animate-fade-in">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className={`w-24 h-36 sm:w-32 sm:h-48 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-500 transform-gpu ${gameState === 'playing' ? 'cursor-pointer hover:scale-105' : ''}`}
                                style={{
                                    border: `2px solid ${primaryColor}50`,
                                    boxShadow: `0 0 15px ${primaryColor}30`,
                                }}
                            >
                                <div className={`w-full h-full rounded-lg flex items-center justify-center text-theme-background ${revealed[index] ? (card === 'win' ? 'bg-theme-win' : 'bg-theme-loss') : 'bg-theme-surface'}`}>
                                    <span style={{textShadow: '0 1px 3px #000'}}>{revealed[index] ? (card === 'win' ? 'GOLD' : 'SHADOW') : 'LOKI'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {resultMessage && (
                    <div className={`text-xl font-bold p-3 rounded-lg mb-6 ${resultMessage.includes('INSUFFICIENT') || resultMessage.includes('TRICK') ? 'text-theme-loss bg-theme-loss/20' : 'text-theme-win bg-theme-win/20'}`}>
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

export default LokiCardFlip;
