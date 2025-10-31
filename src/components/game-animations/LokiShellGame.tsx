// src/components/game-animations/LokiShellGame.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { audioService } from '../../services/audioService';
import { SoulIcon } from '../icons/MythicIcons';
import { Game } from '../../types';

interface LokiShellGameChoiceProps {
    onChoice: (choice: number) => void;
    game: Game;
}

interface LokiShellGameAnimationProps {
    isWin: boolean;
    choice: number;
    onAnimationEnd: () => void;
    game: Game;
    gambitResult?: 'reveal' | 'prank' | null;
}

const Cup: React.FC<{ index: number; animation: string; isRevealed: boolean; children?: React.ReactNode; }> = ({ index, animation, isRevealed, children }) => (
    <div 
        className="absolute w-24 h-24"
        style={{
            left: `calc(50% - 48px + ${(index - 1) * 120}px)`,
            bottom: '50px',
            animation: animation,
            transformOrigin: 'center center',
        }}
    >
        <div className={`relative w-full h-full transition-all duration-300 ${isRevealed ? 'scale-110' : ''}`}>
            {children}
            <svg viewBox="0 0 100 100" className={`w-full h-full absolute drop-shadow-lg filter group-hover:brightness-125 transition-all ${isRevealed ? 'brightness-150' : ''}`}>
                <defs>
                    <radialGradient id="cupGradient" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </radialGradient>
                </defs>
                <path d="M 10 90 Q 15 20 50 10 Q 85 20 90 90 Z" fill="url(#cupGradient)" />
                 <path d="M 10 90 Q 50 80 90 90" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            </svg>
        </div>
    </div>
);

// Component for the choice phase
export const LokiShellGameChoice: React.FC<LokiShellGameChoiceProps> = ({ onChoice, game }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
            <p className="text-theme-muted mb-6">{game.description}</p>
            <div className="flex gap-8 md:gap-20">
                {[0, 1, 2].map(i => (
                    <button
                        key={i}
                        onClick={() => onChoice(i)}
                        className="w-24 h-24 relative group"
                        aria-label={`Choose cup ${i + 1}`}
                    >
                         <svg viewBox="0 0 100 100" className="w-full h-full text-slate-700 group-hover:text-green-600 transition-colors duration-200 drop-shadow-lg">
                            <defs>
                                <radialGradient id="cupGradientStatic" cx="50%" cy="30%" r="70%">
                                    <stop offset="0%" stopColor="#475569" />
                                    <stop offset="100%" stopColor="#1e293b" />
                                </radialGradient>
                            </defs>
                            <path d="M 10 90 Q 15 20 50 10 Q 85 20 90 90 Z" fill="url(#cupGradientStatic)" />
                            <path d="M 10 90 Q 50 80 90 90" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Component for the animation phase
export const LokiShellGameAnimation: React.FC<LokiShellGameAnimationProps> = ({ isWin, choice, onAnimationEnd, game, gambitResult }) => {
    const [phase, setPhase] = useState<'shuffling' | 'revealing' | 'done'>('shuffling');
    const [isRevealedForGambit, setIsRevealedForGambit] = useState(false);

    const winningCupIndex = useMemo(() => {
        if (isWin) return choice;
        let otherCups = [0, 1, 2].filter(i => i !== choice);
        return otherCups[Math.floor(Math.random() * otherCups.length)];
    }, [isWin, choice]);

    useEffect(() => {
        const shuffleSounds = setInterval(() => audioService.play('shuffle'), 400);
        let shuffleDuration = gambitResult === 'prank' ? 1000 : 2000;
        
        const shuffleTimer = setTimeout(() => {
            clearInterval(shuffleSounds);
            setPhase('revealing');
        }, shuffleDuration);

        const revealTimer = setTimeout(() => audioService.play('reveal'), shuffleDuration + 500);

        const endTimer = setTimeout(() => onAnimationEnd(), shuffleDuration + 2000);

        if (gambitResult === 'reveal') {
            setTimeout(() => setIsRevealedForGambit(true), shuffleDuration - 800);
            setTimeout(() => setIsRevealedForGambit(false), shuffleDuration - 400);
        }

        return () => {
            clearInterval(shuffleSounds);
            clearTimeout(shuffleTimer);
            clearTimeout(revealTimer);
            clearTimeout(endTimer);
        };
    }, [onAnimationEnd, gambitResult]);

    const getAnimationFor = (index: number) => {
        if (phase === 'shuffling') {
            const duration = gambitResult === 'prank' ? '1s' : '2s';
            return `shuffle-cup-${(index % 3) + 1} ${duration} cubic-bezier(0.45, 0, 0.55, 1) forwards`;
        }
        if (phase === 'revealing' && index === choice) {
            return `lift-cup 1s ease-in-out forwards`;
        }
        return 'none';
    };

    return (
         <div className="flex flex-col items-center justify-center h-64 text-center">
             <div className="relative w-full h-48">
                {[0, 1, 2].map(i => (
                    <Cup 
                        key={i} 
                        index={i} 
                        animation={getAnimationFor(i)}
                        isRevealed={isRevealedForGambit && i === winningCupIndex}
                    >
                        {i === winningCupIndex && (
                             <SoulIcon 
                                className="w-12 h-12 text-theme-souls absolute left-1/2 -translate-x-1/2 top-8 transition-opacity duration-300"
                                style={{ 
                                    opacity: (phase === 'revealing' && (i === choice || !isWin)) || isRevealedForGambit ? 1 : 0,
                                    filter: `drop-shadow(0 0 10px var(--color-souls))`
                                }}
                            />
                        )}
                    </Cup>
                ))}
            </div>
            <p className="text-theme-muted mt-4 text-lg animate-fade-in">
                {phase === 'shuffling' ? (gambitResult === 'prank' ? "A prank! The cups dance again!" : "The hands move in a blur...") : "The choice is made..."}
            </p>
        </div>
    );
};
