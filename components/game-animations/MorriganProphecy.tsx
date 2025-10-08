import React, { useState, useEffect, useMemo } from 'react';
import { audioService } from '../../services/audioService';
import { SoulIcon, MorriganIcon } from '../icons/MythicIcons';

interface MorriganProphecyChoiceProps {
    onChoice: (choice: number) => void;
}

interface MorriganProphecyAnimationProps {
    isWin: boolean;
    choice: number;
    onAnimationEnd: () => void;
}

const Crow: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="relative w-full h-full">
        {children}
        <MorriganIcon className="w-full h-full text-slate-400 group-hover:text-teal-400 transition-colors duration-200 drop-shadow-lg" />
    </div>
);

// Component for the choice phase
export const MorriganProphecyChoice: React.FC<MorriganProphecyChoiceProps> = ({ onChoice }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2">Heed the Harbinger</h3>
            <p className="text-theme-muted mb-6">The crows speak of what is to come. One speaks the truth. Which do you trust?</p>
            <div className="flex gap-8 md:gap-20">
                {[0, 1, 2].map(i => (
                    <button
                        key={i}
                        onClick={() => onChoice(i)}
                        className="w-24 h-24 relative group"
                        aria-label={`Choose crow ${i + 1}`}
                    >
                         <Crow />
                    </button>
                ))}
            </div>
        </div>
    );
}

const CrowWithSoul: React.FC<{ index: number; animation: string; hasSoul: boolean; isRevealed: boolean }> = ({ index, animation, hasSoul, isRevealed }) => (
    <div
        className="absolute w-24 h-24"
        style={{
            left: `calc(50% - 48px + ${(index - 1) * 140}px)`,
            bottom: '50px',
            animation: animation,
            transformOrigin: 'center center',
        }}
    >
        <div className="relative w-full h-full">
            {hasSoul && (
                <SoulIcon 
                    className="w-12 h-12 text-theme-souls absolute left-1/2 -translate-x-1/2 top-8 transition-opacity duration-300"
                    style={{ 
                        opacity: isRevealed ? 1 : 0,
                        filter: `drop-shadow(0 0 10px var(--color-souls))`
                    }}
                />
            )}
            <Crow />
        </div>
    </div>
);


// Component for the animation phase
export const MorriganProphecyAnimation: React.FC<MorriganProphecyAnimationProps> = ({ isWin, choice, onAnimationEnd }) => {
    const [phase, setPhase] = useState<'shuffling' | 'revealing' | 'done'>('shuffling');

    const winningCrowIndex = useMemo(() => {
        if (isWin) return choice;
        // Ensure the winning crow is not the chosen one if the player lost
        let otherCrows = [0, 1, 2].filter(i => i !== choice);
        return otherCrows[Math.floor(Math.random() * otherCrows.length)];
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
            return `shuffle-crow-${(index % 3) + 1} 2s cubic-bezier(0.45, 0, 0.55, 1) forwards`;
        }
        if (phase === 'revealing' && index === choice) {
            return `lift-crow 1s ease-in-out forwards`;
        }
        return 'none';
    };

    return (
         <div className="flex flex-col items-center justify-center h-64 text-center">
             <div className="relative w-full h-48">
                {[0, 1, 2].map(i => (
                    <CrowWithSoul 
                        key={i} 
                        index={i} 
                        animation={getAnimationFor(i)} 
                        hasSoul={i === winningCrowIndex}
                        isRevealed={phase === 'revealing' && (i === choice || (i === winningCrowIndex && !isWin))}
                    />
                ))}
            </div>
            <p className="text-theme-muted mt-4 text-lg animate-fade-in">
                {phase === 'shuffling' ? "Fate is woven..." : "The prophecy is revealed..."}
            </p>
        </div>
    );
};