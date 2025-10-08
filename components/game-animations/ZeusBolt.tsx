import React, { useState, useEffect, useRef } from 'react';

interface ZeusBoltProps {
    onComplete: (result: 'win' | 'loss') => void;
}

const MAX_CHARGE = 100;
const CHARGE_RATE = 150; // Points per second
const SWEET_SPOT_START = 85;
const SWEET_SPOT_END = 98;

export const ZeusBolt: React.FC<ZeusBoltProps> = ({ onComplete }) => {
    const [charge, setCharge] = useState(0);
    const [isCharging, setIsCharging] = useState(false);
    const [result, setResult] = useState<'win' | 'loss' | 'overload' | null>(null);
    const animationFrameId = useRef<number | null>(null);
    const chargeStartTime = useRef<number>(0);

    const startCharging = () => {
        if (result) return;
        setIsCharging(true);
        chargeStartTime.current = performance.now();
        animationFrameId.current = requestAnimationFrame(chargeLoop);
    };

    const stopCharging = () => {
        if (!isCharging || result) return;
        setIsCharging(false);
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        
        let finalCharge = charge;
        if (finalCharge >= SWEET_SPOT_START && finalCharge <= SWEET_SPOT_END) {
            setResult('win');
            setTimeout(() => onComplete('win'), 2000);
        } else {
            setResult('loss');
            setTimeout(() => onComplete('loss'), 2000);
        }
    };

    const chargeLoop = (now: number) => {
        const elapsed = now - chargeStartTime.current;
        const newCharge = Math.min(MAX_CHARGE, (elapsed / 1000) * CHARGE_RATE);
        setCharge(newCharge);

        if (newCharge >= MAX_CHARGE) {
            setResult('overload');
            setIsCharging(false);
            setTimeout(() => onComplete('loss'), 2000);
        } else {
            animationFrameId.current = requestAnimationFrame(chargeLoop);
        }
    };

    useEffect(() => {
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const getBarColor = () => {
        if (result === 'overload') return 'bg-red-500';
        if (charge > SWEET_SPOT_START) return 'bg-yellow-300';
        return 'bg-yellow-500';
    };
    
    const getMessage = () => {
        if(result === 'win') return "A strike worthy of Olympus!";
        if(result === 'overload') return "Hubris! The power was too great!";
        if(result === 'loss') return "A feeble spark...";
        if(isCharging) return "Unleash the storm!";
        return "Hold to gather the storm's fury.";
    }

    return (
        <div 
            className="flex flex-col items-center justify-center h-64 text-center cursor-pointer"
            onMouseDown={startCharging}
            onMouseUp={stopCharging}
            onTouchStart={startCharging}
            onTouchEnd={stopCharging}
        >
            <h3 className="text-2xl font-bold text-white mb-2">Harness the Heavens</h3>
            <p className="text-slate-400 mb-6 h-10">{getMessage()}</p>
            
            <div className="w-full max-w-sm h-12 bg-slate-800 rounded-lg border-2 border-slate-600 p-1 relative">
                {/* Sweet Spot */}
                <div 
                    className="absolute h-full top-0 bg-green-500/30 rounded"
                    style={{ left: `${SWEET_SPOT_START}%`, width: `${SWEET_SPOT_END - SWEET_SPOT_START}%` }}
                />
                {/* Charge Bar */}
                <div 
                    className={`h-full rounded-sm transition-all duration-100 ${getBarColor()}`}
                    style={{ width: `${charge}%`, boxShadow: `0 0 15px ${getBarColor().replace('bg-', '')}` }}
                />
            </div>

            {result && (
                <div className={`mt-4 text-3xl font-bold animate-fade-in ${result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                    {result === 'win' ? 'SUCCESS' : 'FAILURE'}
                </div>
            )}
        </div>
    );
};