import React, { useState } from 'react';

interface FortunaWheelProps {
    winChance: number;
    onComplete: (result: 'win' | 'loss') => void;
}

const NUM_SEGMENTS = 12;

export const FortunaWheel: React.FC<FortunaWheelProps> = ({ winChance, onComplete }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [finalAngle, setFinalAngle] = useState(0);

    const handleSpin = () => {
        if (isSpinning) return;

        const isWin = Math.random() < winChance;
        const degreesPerSegment = 360 / NUM_SEGMENTS;
        
        // Find a winning or losing segment
        let targetSegment = 0;
        const winningSegments = Math.floor(NUM_SEGMENTS * winChance);
        if (isWin) {
            targetSegment = Math.floor(Math.random() * winningSegments);
        } else {
            targetSegment = winningSegments + Math.floor(Math.random() * (NUM_SEGMENTS - winningSegments));
        }

        const randomOffset = (Math.random() - 0.5) * degreesPerSegment * 0.8;
        const targetAngle = (targetSegment * degreesPerSegment) + randomOffset;
        
        const fullSpins = 5;
        const newFinalAngle = (fullSpins * 360) + targetAngle;
        
        setFinalAngle(newFinalAngle);
        setIsSpinning(true);

        setTimeout(() => {
            onComplete(isWin ? 'win' : 'loss');
        }, 5000); // Animation duration
    };

    const wheelSegments = Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
        const isWinSegment = i < Math.floor(NUM_SEGMENTS * winChance);
        return (
            <div
                key={i}
                className="absolute w-1/2 h-1/2 origin-bottom-right"
                style={{
                    transform: `rotate(${i * (360 / NUM_SEGMENTS)}deg)`,
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`
                }}
            >
                <div className={`w-full h-full ${isWinSegment ? 'bg-green-500/70' : 'bg-red-500/70'}`} />
            </div>
        );
    });

    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            {!isSpinning ? (
                <>
                    <h3 className="text-2xl font-bold text-white mb-2">Spin the Wheel of Fate</h3>
                    <p className="text-slate-400 mb-6">Fortuna awaits. Give the wheel a push and see where destiny lands.</p>
                    <button
                        onClick={handleSpin}
                        className="bg-rose-600 text-white font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-rose-500 transition-colors"
                    >
                        Spin
                    </button>
                </>
            ) : (
                <>
                    <div className="relative w-56 h-56 rounded-full border-8 border-amber-400 overflow-hidden shadow-2xl">
                        <div
                            className="w-full h-full transition-transform duration-[4000ms] ease-out"
                            style={{ transform: `rotate(${finalAngle}deg)` }}
                        >
                            {wheelSegments}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-amber-200 border-4 border-amber-500"></div>
                        </div>
                    </div>
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-amber-300"></div>
                     <p className="text-slate-400 mt-4 text-lg">The wheel turns...</p>
                </>
            )}
        </div>
    );
};
