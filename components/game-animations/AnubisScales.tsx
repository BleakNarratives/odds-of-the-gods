import React, { useState, useEffect, useRef } from 'react';

interface AnubisScalesProps {
    winChance: number;
    onComplete: (result: 'win' | 'loss') => void;
}

export const AnubisScales: React.FC<AnubisScalesProps> = ({ winChance, onComplete }) => {
    const [isStopped, setIsStopped] = useState(false);
    const needleRef = useRef<HTMLDivElement>(null);

    // Green zone size is based on win chance
    const greenZoneWidth = 80 * winChance; // 80 is the total swing in degrees (40 left, 40 right)
    const greenZoneStart = -greenZoneWidth / 2;

    const handleClick = () => {
        if (isStopped) return;

        const needle = needleRef.current;
        if (needle) {
            const computedStyle = window.getComputedStyle(needle);
            const transform = computedStyle.getPropertyValue('transform');
            const matrix = new DOMMatrix(transform);
            const angleRad = Math.atan2(matrix.b, matrix.a);
            const angleDeg = angleRad * (180 / Math.PI);

            needle.style.animationPlayState = 'paused';
            setIsStopped(true);

            const isWin = angleDeg >= greenZoneStart && angleDeg <= (greenZoneStart + greenZoneWidth);

            setTimeout(() => onComplete(isWin ? 'win' : 'loss'), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-64 text-center" onClick={handleClick}>
            <h3 className="text-2xl font-bold text-white mb-2">Balance the Scales</h3>
            <p className="text-slate-400 mb-6">Click at the perfect moment to prove your heart is true.</p>

            <div className="relative w-64 h-32">
                {/* Scale Base */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-slate-800 rounded-t-lg border-b-4 border-amber-500"></div>
                
                {/* Green Zone */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32"
                    style={{
                        clipPath: `path('M 128 128 A 128 128, 0, 0, 0, ${128 + 128 * Math.sin(greenZoneStart * Math.PI / 180)} ${128 - 128 * Math.cos(greenZoneStart * Math.PI / 180)} L 128 128 Z')`,
                        transform: `rotate(${greenZoneStart}deg)`,
                    }}
                >
                    <div className="absolute inset-0 bg-green-500/20" style={{ transform: `rotate(${-greenZoneStart}deg)` }}></div>
                </div>

                {/* Needle */}
                <div 
                    ref={needleRef}
                    className="absolute bottom-8 left-1/2 w-1 h-24 bg-amber-300 origin-bottom"
                    style={{ animation: 'needle-swing 1s linear infinite alternate' }}
                >
                    <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-400 border-2 border-slate-900"></div>
                </div>
            </div>
            
            <p className={`mt-4 text-lg transition-opacity duration-500 ${isStopped ? 'opacity-100' : 'opacity-0'}`}>The scales are set...</p>
        </div>
    );
};