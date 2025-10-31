// src/components/game-animations/JanusCoinFlip.tsx
import React, { useState, useEffect } from 'react';
import { JanusPlayerChoice } from '../../types';
import { audioService } from '../../services/audioService';

interface JanusCoinFlipAnimationProps {
    isWin: boolean;
    choice: JanusPlayerChoice;
    onAnimationEnd: () => void;
    isAngleWin: boolean;
}

export const JanusCoinFlipAnimation: React.FC<JanusCoinFlipAnimationProps> = ({ isWin, choice, onAnimationEnd, isAngleWin }) => {
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        audioService.play('coin-clink');
        setIsFlipping(true);
        const landTimer = setTimeout(() => audioService.play('coin-land'), 2500);
        const endTimer = setTimeout(onAnimationEnd, 3500); // Animation duration + buffer
        return () => {
            clearTimeout(landTimer);
            clearTimeout(endTimer);
        }
    }, [onAnimationEnd]);

    // Determine final side based on both win state AND player choice
    const finalSideIsOrder = (isWin && choice === 'Order') || (!isWin && choice === 'Chaos');
    const finalRotation = finalSideIsOrder ? 3600 : 3780; // Heads (Order) vs Tails (Chaos)

    return (
         <div className="flex flex-col items-center justify-center h-64 text-center relative">
            {isAngleWin && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 bg-theme-primary rounded-full animate-[angle-win-flash_1s_ease-out_2s_forwards]" />
                </div>
            )}
            <div className="coin-container">
                <div 
                    className="coin" 
                    style={{ 
                        animation: isFlipping ? `flip-cinematic 2.5s cubic-bezier(0.2, 0.8, 0.5, 1) forwards` : 'none' ,
                        '--final-rotation': `${finalRotation}deg`
                    } as React.CSSProperties}
                >
                    <div className="coin-face coin-heads bg-gradient-to-br from-slate-600 to-slate-800 border-4 border-slate-400">
                         <p className="text-4xl font-black text-slate-300">ORDER</p>
                    </div>
                    <div className="coin-face coin-tails bg-gradient-to-br from-yellow-700 to-yellow-900 border-4 border-yellow-500">
                        <p className="text-4xl font-black text-yellow-300">CHAOS</p>
                    </div>
                </div>
            </div>
            <p className="text-theme-muted mt-8 text-lg animate-fade-in" style={{animationDelay: '2.5s'}}>The coin has been cast...</p>
            <style>{`
                @keyframes flip-cinematic {
                    0% { transform: rotateY(0deg) scale(0.5) translateY(-100px); }
                    50% { transform: rotateY(calc(var(--final-rotation) * 0.5)) scale(1.2) translateY(0); }
                    100% { transform: rotateY(var(--final-rotation)) scale(1) translateY(0); }
                }
                @keyframes angle-win-flash {
                    0% { transform: scale(0); opacity: 0.8; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
