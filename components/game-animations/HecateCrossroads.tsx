import React, { useState, useEffect, useMemo } from 'react';
import { audioService } from '../../services/audioService';

interface HecateCrossroadsChoiceProps {
    onChoice: (choice: number) => void;
}

interface HecateCrossroadsAnimationProps {
    isWin: boolean;
    choice: number;
    onAnimationEnd: () => void;
}

const Torch: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="relative w-full h-full">
        {children}
        <svg viewBox="0 0 24 24" className="w-full h-full text-slate-600 group-hover:text-indigo-400 transition-colors duration-200 drop-shadow-lg">
            <path d="M12.7 12.3c-.2.2-.5.3-.7.3s-.5-.1-.7-.3c-1-1-2.4-1.3-3.7-1-.6.1-1.1.6-1.1 1.2s.4 1.1 1 1.2c.7.1 1.4.4 2 .8.6.4 1.4.4 2 0 .6-.4 1.3-.7 2-.8.6-.1 1.1-.6 1-1.2s-.5-1.1-1.1-1.2c-1.3-.3-2.7 0-3.7 1zM11 15v5c0 .6.4 1 1 1s1-.4 1-1v-5c0-.6-.4-1-1-1s-1 .4-1 1z" fill="currentColor"/>
        </svg>
    </div>
);

// Component for the choice phase
export const HecateCrossroadsChoice: React.FC<HecateCrossroadsChoiceProps> = ({ onChoice }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2">A Glimpse Beyond the Veil</h3>
            <p className="text-theme-muted mb-6">Hecate conceals the true flame. Trust your inner sight. Choose a torch.</p>
            <div className="flex gap-8 md:gap-20">
                {[0, 1, 2].map(i => (
                    <button
                        key={i}
                        onClick={() => onChoice(i)}
                        className="w-24 h-24 relative group"
                        aria-label={`Choose torch ${i + 1}`}
                    >
                         <Torch />
                    </button>
                ))}
            </div>
        </div>
    );
}

const TorchWithFlame: React.FC<{ index: number; animation: string; isWinning: boolean; isRevealed: boolean }> = ({ index, animation, isWinning, isRevealed }) => (
    <div
        className="absolute w-24 h-24"
        style={{
            left: `calc(50% - 48px + ${(index - 1) * 150}px)`,
            bottom: '50px',
            animation: animation,
            transformOrigin: 'center center',
        }}
    >
        <div className="relative w-full h-full">
            {isRevealed && (
                isWinning ? (
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-16">
                         <div className="w-full h-full bg-hecate-accent rounded-full animate-true-flame" style={{backgroundColor: 'var(--color-hecate-accent)'}}></div>
                     </div>
                ) : (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-800/80 rounded-full animate-smoke-puff"></div>
                )
            )}
            <Torch />
        </div>
    </div>
);


// Component for the animation phase
export const HecateCrossroadsAnimation: React.FC<HecateCrossroadsAnimationProps> = ({ isWin, choice, onAnimationEnd }) => {
    const [phase, setPhase] = useState<'shuffling' | 'revealing' | 'done'>('shuffling');

    const winningTorchIndex = useMemo(() => {
        if (isWin) return choice;
        // Ensure the winning torch is not the chosen one if the player lost
        let otherTorches = [0, 1, 2].filter(i => i !== choice);
        return otherTorches[Math.floor(Math.random() * otherTorches.length)];
    }, [isWin, choice]);

    useEffect(() => {
        const shuffleSounds = setInterval(() => audioService.play('swoosh'), 500);
        
        const shuffleTimer = setTimeout(() => {
            clearInterval(shuffleSounds);
            setPhase('revealing');
        }, 2000); // Shuffle animation is 2s

        const revealTimer = setTimeout(() => {
            audioService.play('reveal');
        }, 2500); // Reveal starts after shuffle

        const endTimer = setTimeout(() => {
            onAnimationEnd();
        }, 4000);

        return () => {
            clearInterval(shuffleSounds);
            clearTimeout(shuffleTimer);
            clearTimeout(revealTimer);
            clearTimeout(endTimer);
        };
    }, [onAnimationEnd]);

    const getAnimationFor = (index: number) => {
        if (phase === 'shuffling') {
            return `shuffle-torch-${(index % 3) + 1} 2s cubic-bezier(0.45, 0, 0.55, 1) forwards`;
        }
        if (phase === 'revealing' && index === choice) {
            return `lift-torch 1s ease-in-out forwards`;
        }
        return 'none';
    };

    return (
         <div className="flex flex-col items-center justify-center h-64 text-center">
             <div className="relative w-full h-48">
                {[0, 1, 2].map(i => (
                    <TorchWithFlame 
                        key={i} 
                        index={i} 
                        animation={getAnimationFor(i)} 
                        isWinning={i === winningTorchIndex}
                        isRevealed={phase === 'revealing' && (i === choice || (i === winningTorchIndex && !isWin))}
                    />
                ))}
            </div>
            <p className="text-theme-muted mt-4 text-lg animate-fade-in">
                {phase === 'shuffling' ? "The path is obscured..." : "The choice is made..."}
            </p>
        </div>
    );
};
