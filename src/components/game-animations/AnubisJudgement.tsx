import React, { useState, useEffect } from 'react';
import { audioService } from '../../services/audioService';

interface AnubisJudgementProps {
  isWin: boolean;
  onAnimationEnd: () => void;
}

const JayhawkStaff: React.FC = () => (
    <g transform="translate(15, 20) scale(0.3)">
        <path d="M62.3,42.1c-8.8,0-15.9,7.1-15.9,15.9c0,8.8,7.1,15.9,15.9,15.9s15.9-7.1,15.9-15.9C78.2,49.2,71.1,42.1,62.3,42.1z M62.3,67.4c-5.2,0-9.4-4.2-9.4-9.4c0-5.2,4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4C71.7,63.2,67.5,67.4,62.3,67.4z" fill="var(--color-primary)"/>
        <path d="M84,33.2c-2.3-2-5-3.1-7.9-3.1c-3.1,0-6,1.2-8.2,3.4l-1.8,1.8c-2.2,2.2-5.1,3.4-8.2,3.4s-6-1.2-8.2-3.4l-1.8-1.8 c-2.2-2.2-5.1-3.4-8.2-3.4c-2.9,0-5.6,1.1-7.9,3.1c-2.5,2.2-4.1,5.3-4.1,8.7v16c0,2.6,2.1,4.7,4.7,4.7h51.4c2.6,0,4.7-2.1,4.7-4.7 v-16C88.1,38.5,86.5,35.4,84,33.2z M81.5,55.9H32.4V41.9c0-1.7,0.7-3.4,2-4.6c1.2-1.1,2.8-1.7,4.5-1.7c2.9,0,5.6,1.1,7.9,3.1 l1.8,1.8c2.2,2.2,5.1,3.4,8.2,3.4s6-1.2,8.2-3.4l1.8-1.8c2.2-2.2,5.1-3.4,8.2-3.4c1.7,0,3.3,0.6,4.5,1.7c1.3,1.2,2,2.9,2,4.6 L81.5,55.9L81.5,55.9z" fill="var(--color-anubis-primary)"/>
        <path d="M50,10L50,10c-5.5,0-10,4.5-10,10v10h20V20C60,14.5,55.5,10,50,10z" fill="var(--color-anubis-accent)"/>
    </g>
);


export const AnubisJudgement: React.FC<AnubisJudgementProps> = ({ isWin, onAnimationEnd }) => {
    const [phase, setPhase] = useState<'weighing' | 'verdict' | 'outcome'>('weighing');

    useEffect(() => {
        const weighingTimer = setTimeout(() => {
            setPhase('verdict');
            audioService.play(isWin ? 'win' : 'lose');
        }, 2500); // Weighing animation duration
        const verdictTimer = setTimeout(() => setPhase('outcome'), 3500);
        const endTimer = setTimeout(onAnimationEnd, 6000);
        
        return () => {
            clearTimeout(weighingTimer);
            clearTimeout(verdictTimer);
            clearTimeout(endTimer);
        }
    }, [isWin, onAnimationEnd]);
    
    const beamAnimation = phase === 'weighing' ? 'weighing 2.5s ease-in-out forwards' : 
                          phase === 'verdict' && !isWin ? 'scale-beam-tip-loss 1s ease-in-out forwards' : 'none';

    return (
        <div className="flex flex-col items-center justify-center h-80 text-center relative w-full overflow-hidden">
            {/* Base weighing scene */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'outcome' ? 'opacity-0' : 'opacity-100'}`}>
                 <h3 className="text-2xl font-bold text-white mb-2">The Heart is Weighed...</h3>
                 <div className="relative w-full h-64 mt-4">
                     {/* Scales */}
                     <svg viewBox="0 0 200 150" className="w-full h-full">
                         {/* Staff Base */}
                         <path d="M 98 20 L 98 140 M 80 140 L 120 140" stroke="var(--color-text-muted)" strokeWidth="3" />
                         <JayhawkStaff />
                         {/* Beam */}
                         <g style={{ animation: beamAnimation, transformOrigin: '100px 20px' }}>
                             <path d="M 20 20 L 180 20" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
                             <path d="M 30 20 L 30 40 M 170 20 L 170 40" stroke="var(--color-primary)" strokeWidth="2" />
                             {/* Pans */}
                             <path d="M 10 45 Q 30 60 50 45" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
                             <path d="M 150 45 Q 170 60 190 45" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
                             {/* Heart */}
                             <path d="M25 40 C 10 25, 45 25, 30 40 Z" fill="var(--color-anubis-accent)" style={{ animation: 'heart-pulse 1.5s infinite' }}/>
                             {/* Feather */}
                             <path d="M170 30 Q 160 40 170 50 Q 180 40 170 30 Z" fill="#fff" opacity="0.8" />
                         </g>
                     </svg>
                 </div>
            </div>

            {/* Win Outcome */}
            {phase === 'outcome' && isWin && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center animate-gates-open-win">
                     <svg viewBox="0 0 100 100" className="w-32 h-32 text-theme-win filter" style={{filter: 'drop-shadow(0 0 15px currentColor)'}}>
                         <path d="M50,5 C75,5 95,25 95,50 C95,75 75,95 50,95 C25,95 5,75 5,50 C5,25 25,5 50,5 Z M30,50 L70,50 M50,30 L50,70" stroke="currentColor" strokeWidth="5" fill="none" />
                         <path d="M35,35 L65,65 M65,35 L35,65" stroke="currentColor" strokeWidth="3" fill="none" />
                     </svg>
                     <h3 className="text-3xl font-bold text-theme-win mt-4">Worthy! The Field of Reeds Awaits!</h3>
                 </div>
            )}
             
            {/* Loss Outcome */}
            {phase === 'outcome' && !isWin && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 animate-beast-lunge-loss">
                         <svg viewBox="0 0 100 100" className="text-theme-loss filter" style={{filter: 'drop-shadow(0 0 15px currentColor)'}}>
                            <path d="M50 10 C 20 10, 10 40, 10 50 C 10 80, 40 90, 50 90 C 60 90, 90 80, 90 50 C 90 40, 80 10, 50 10 Z" fill="currentColor"/>
                            <path d="M30 40 L 40 50 L 30 60 Z M 50 40 L 60 50 L 50 60 Z M 70 40 L 80 50 L 70 60 Z" fill="var(--color-background)"/>
                            <path d="M25 70 A 30 30 0 0 0 75 70" fill="none" stroke="var(--color-background)" strokeWidth="5"/>
                         </svg>
                    </div>
                     <h3 className="text-3xl font-bold text-theme-loss mt-4">Unworthy! Your Soul is Devoured!</h3>
                </div>
            )}

        </div>
    );
};