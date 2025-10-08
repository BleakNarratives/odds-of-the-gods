import React, { useState, useEffect } from 'react';
import { JanusPlayerChoice } from '../../types';
import { audioService } from '../../services/audioService';

interface JanusChoiceProps {
    onChoice: (choice: JanusPlayerChoice) => void;
}

interface JanusCoinFlipAnimationProps {
    isWin: boolean;
    choice: JanusPlayerChoice;
    onAnimationEnd: () => void;
}

// Separate component for the choice phase
export const JanusChoice: React.FC<JanusChoiceProps> = ({ onChoice }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-2">Choose a Face of Fate</h3>
            <p className="text-theme-muted mb-6">Janus offers a simple choice. Order or Chaos. What is your path?</p>
            <div className="flex gap-8">
                <button
                    onClick={() => onChoice('Order')}
                    className="border-2 border-slate-400 bg-slate-800 text-slate-200 font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-slate-700 hover:border-white transition-colors"
                >
                    Order
                </button>
                <button
                    onClick={() => onChoice('Chaos')}
                    className="border-2 border-yellow-400 bg-yellow-800 text-yellow-200 font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-yellow-700 hover:border-white transition-colors"
                >
                    Chaos
                </button>
            </div>
        </div>
    );
}

// Separate component for the animation phase
export const JanusCoinFlipAnimation: React.FC<JanusCoinFlipAnimationProps> = ({ isWin, choice, onAnimationEnd }) => {
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        audioService.play('coin-clink');
        setIsFlipping(true);
        const landTimer = setTimeout(() => audioService.play('coin-land'), 1500);
        const endTimer = setTimeout(onAnimationEnd, 2500); // Animation duration + buffer
        return () => {
            clearTimeout(landTimer);
            clearTimeout(endTimer);
        }
    }, [onAnimationEnd]);

    // Determine final side based on both win state AND player choice
    const finalSideIsOrder = (isWin && choice === 'Order') || (!isWin && choice === 'Chaos');

    const flipAnimation = finalSideIsOrder ? 'flip-heads-fast' : 'flip-tails-fast';
    
    return (
         <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="coin-container">
                <div className="coin" style={{ animation: isFlipping ? `${flipAnimation} 1.5s cubic-bezier(0.3, 0, 0.4, 1) forwards` : 'none' }}>
                    <div className="coin-face coin-heads bg-gradient-to-br from-slate-600 to-slate-800 border-4 border-slate-400">
                         <p className="text-4xl font-black text-slate-300">ORDER</p>
                    </div>
                    <div className="coin-face coin-tails bg-gradient-to-br from-yellow-700 to-yellow-900 border-4 border-yellow-500">
                        <p className="text-4xl font-black text-yellow-300">CHAOS</p>
                    </div>
                </div>
            </div>
            <p className="text-theme-muted mt-8 text-lg animate-fade-in" style={{animationDelay: '1.5s'}}>The coin has been cast...</p>
        </div>
    );
};
