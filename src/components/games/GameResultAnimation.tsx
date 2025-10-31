import React, { useEffect, useMemo } from 'react';
// FIX: Corrected import path to be explicitly relative.
import { God } from '../../types';
import { audioService } from '../../services/audioService';
import * as MythicIcons from '../icons/MythicIcons';

interface GameResultAnimationProps {
    isWin: boolean;
    god: God;
    payout: number;
    onAnimationEnd: () => void;
}

const godSymbols: Record<string, React.FC<any>> = {
    zeus: (props) => <path d="M11,21h-1l1-7H7.5c-.58,0-.57-.32-.38-.66,1.96-3.47,4.51-8.12,4.88-8.84.04-.08,.12-.1,.2-.1H13l-1,7h3.5c.49,0,.56,.33,.47,.65C13.98,12.51,11,19.33,11,21Z" {...props} />,
    hades: (props) => <path d="M12,2C9.48,2,7.5,3.98,7.5,6.5S9.48,11,12,11s4.5-1.98,4.5-4.5S14.52,2,12,2z M12,8.5c-1.1,0-2-0.9-2-2s0.9-2,2-2 s2,0.9,2,2S13.1,8.5,12,8.5z M18.5,9.5C17.12,9.5,16,10.62,16,12s1.12,2.5,2.5,2.5s2.5-1.12,2.5-2.5S19.88,9.5,18.5,9.5z M5.5,9.5 C4.12,9.5,3,10.62,3,12s1.12,2.5,2.5,2.5s2.5-1.12,2.5-2.5S6.88,9.5,5.5,9.5z M12,13c-3.14,0-6,1.7-7.5,4.25C4.5,17.75,4,18.5,4,19.5 C4,20.88,5.12,22,6.5,22h11c1.38,0,2.5-1.12,2.5-2.5c0-1-0.5-1.75-0.5-2.25C18,14.7,15.14,13,12,13z" {...props} />,
    fortuna: (props) => <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zM12 5a1 1 0 00-1 1v5a1 1 0 102 0V6a1 1 0 00-1-1zm0 12a1 1 0 001-1v-5a1 1 0 10-2 0v5a1 1 0 001 1zm-6-6a1 1 0 00-1 1h5a1 1 0 100-2H6a1 1 0 00-1 1zm12 0a1 1 0 00-1 1h5a1 1 0 100-2h-5a1 1 0 00-1 1z" {...props} />,
};

export const GameResultAnimation: React.FC<GameResultAnimationProps> = ({ isWin, god, payout, onAnimationEnd }) => {
    
    useEffect(() => {
        audioService.play(isWin ? 'big-win' : 'lose');
        const timer = setTimeout(onAnimationEnd, 3000);
        return () => clearTimeout(timer);
    }, [isWin, onAnimationEnd]);
    
    const GodSymbol = godSymbols[god.id] || MythicIcons.AspirantIcon;

    return (
        <div className="flex flex-col items-center justify-center h-48 text-center relative overflow-hidden">
            {isWin ? (
                <div className="animate-esoteric-win">
                    <svg viewBox="0 0 24 24" className="w-32 h-32" style={{color: god.color, filter: `drop-shadow(0 0 15px ${god.color})`}}>
                        <GodSymbol />
                    </svg>
                    <p className="text-3xl font-bold mt-4 text-theme-win">VICTORY</p>
                    <p className="text-lg text-theme-secondary">+{payout.toLocaleString()} Souls</p>
                </div>
            ) : (
                <div className="animate-esoteric-loss">
                    <svg viewBox="0 0 24 24" className="w-32 h-32" style={{color: god.color}}>
                        <GodSymbol />
                    </svg>
                    <p className="text-3xl font-bold mt-4 text-theme-loss">DEFEAT</p>
                </div>
            )}
        </div>
    );
};