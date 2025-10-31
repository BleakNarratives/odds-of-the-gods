import React, { useState, useEffect } from 'react';
// FIX: Corrected import path to be relative within the 'src' directory.
import { audioService } from '../../services/audioService';

interface HadesUnderworldRollProps {
    onComplete: (result: 'win' | 'loss') => void;
}

const Dice: React.FC<{ value: number, isRolling: boolean }> = ({ value, isRolling }) => {
    const finalFaceClass = isRolling ? '' : `dice-face-${value}`;
    const rollingClass = isRolling ? 'rolling' : '';

    // To make each dice roll look different, add a random animation start
    const animationDelay = `-${Math.random() * 0.5}s`;

    return (
        <div className="dice-container">
            <div 
                className={`dice ${rollingClass} ${finalFaceClass}`}
                style={isRolling ? { animationDelay } : {}}
            >
                <div className="face face-1">
                    <span className="dot"></span>
                </div>
                <div className="face face-2">
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
                <div className="face face-3">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
                <div className="face face-4">
                    <div className="column"><span className="dot"></span><span className="dot"></span></div>
                    <div className="column"><span className="dot"></span><span className="dot"></span></div>
                </div>
                <div className="face face-5">
                    <div className="column"><span className="dot"></span><span className="dot"></span></div>
                    <div className="column"><span className="dot"></span></div>
                    <div className="column"><span className="dot"></span><span className="dot"></span></div>
                </div>
                <div className="face face-6">
                    <div className="column"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>
                    <div className="column"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>
                </div>
            </div>
        </div>
    );
};

export const HadesUnderworldRoll: React.FC<HadesUnderworldRollProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'betting' | 'rolling' | 'revealed'>('betting');
    const [playerRoll, setPlayerRoll] = useState({ d1: 1, d2: 1, total: 2 });
    const [hadesRoll, setHadesRoll] = useState({ d1: 1, d2: 1, total: 2 });

    const handleRoll = () => {
        setPhase('rolling');
        audioService.play('dice-roll');

        // Pre-calculate final rolls
        const p1 = Math.floor(Math.random() * 6) + 1;
        const p2 = Math.floor(Math.random() * 6) + 1;
        const h1 = Math.floor(Math.random() * 6) + 1;
        const h2 = Math.floor(Math.random() * 6) + 1;
        
        setTimeout(() => {
            setPlayerRoll({ d1: p1, d2: p2, total: p1 + p2 });
            setHadesRoll({ d1: h1, d2: h2, total: h1 + h2 });
            audioService.play('dice-land');
            setPhase('revealed');
        }, 2500); // Animation duration

        setTimeout(() => {
            const isWin = (p1 + p2) > (h1 + h2);
            onComplete(isWin ? 'win' : 'loss');
        }, 4000);
    };

    if (phase === 'betting') {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-2">Cast the Bones</h3>
                <p className="text-theme-muted mb-6">Challenge Hades to a game of chance. Roll higher to win. Ties go to the house.</p>
                <button
                    onClick={handleRoll}
                    className="bg-red-700 border-2 border-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                    Roll the Bones
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            {phase === 'rolling' && <p className="text-theme-muted mb-6 text-lg">The bones dance in the dark...</p>}
            {phase === 'revealed' && <p className="text-theme-muted mb-6 text-lg">The Fates have decided.</p>}

            <div className="w-full flex justify-around items-center">
                {/* Player Dice */}
                <div className="flex flex-col items-center">
                    <p className="text-lg text-theme-secondary mb-2">Your Roll</p>
                    <div className="flex gap-4">
                        <Dice value={playerRoll.d1} isRolling={phase === 'rolling'} />
                        <Dice value={playerRoll.d2} isRolling={phase === 'rolling'} />
                    </div>
                    <p className={`text-2xl font-bold text-white mt-2 transition-opacity duration-300 ${phase === 'revealed' ? 'opacity-100' : 'opacity-0'}`}>Total: {playerRoll.total}</p>
                </div>
                {/* Hades Dice */}
                 <div className="flex flex-col items-center">
                    <p className="text-lg text-red-400 mb-2">Hades' Roll</p>
                    <div className="flex gap-4">
                        <Dice value={hadesRoll.d1} isRolling={phase === 'rolling'} />
                        <Dice value={hadesRoll.d2} isRolling={phase === 'rolling'} />
                    </div>
                    <p className={`text-2xl font-bold text-red-400 mt-2 transition-opacity duration-300 ${phase === 'revealed' ? 'opacity-100' : 'opacity-0'}`}>Total: {hadesRoll.total}</p>
                </div>
            </div>
        </div>
    );
};