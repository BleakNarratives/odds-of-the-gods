import React, { useEffect, useMemo } from 'react';
import { God } from '../types';
import { GAMES } from '../constants';
import { audioService } from '../services/audioService';

interface DivineJudgementAnimationProps {
  isWin: boolean;
  patronGod: God;
  onAnimationEnd: () => void;
}

const ANIMATION_DURATION = 2500; // ms

const DivineJudgementAnimation: React.FC<DivineJudgementAnimationProps> = ({ isWin, patronGod, onAnimationEnd }) => {
  const GodIcon = useMemo(() => (GAMES.find(g => g.godId === patronGod.id) || {}).Icon, [patronGod.id]);

  useEffect(() => {
    audioService.play('suspense');
    const timer = setTimeout(() => {
      audioService.stop('suspense');
      onAnimationEnd();
    }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const colorMap: Record<string, string> = {
    amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
    yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
    teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
  };
  const godColorHex = colorMap[patronGod.color] || '#ffffff';

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center relative overflow-hidden">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Central God Icon */}
        {GodIcon && (
          <GodIcon
            className={`w-24 h-24 ${isWin ? 'animate-[judgement-win_2.5s_ease-in-out_forwards]' : 'animate-[judgement-loss_2.5s_ease-in-out_forwards]'}`}
            style={{ color: godColorHex }}
          />
        )}
      </div>
      <p className="text-slate-400 mt-4 text-lg animate-fade-in">Awaiting Divine Judgment...</p>
      
      <style>{`
        @keyframes judgement-win {
          0% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 5px ${godColorHex}); }
          50% { transform: scale(1.5) rotate(-15deg); filter: drop-shadow(0 0 20px ${godColorHex}); }
          80% { transform: scale(3) rotate(10deg); opacity: 1; filter: drop-shadow(0 0 50px var(--color-win)); color: var(--color-win); }
          100% { transform: scale(5); opacity: 0; filter: drop-shadow(0 0 100px var(--color-win)); color: var(--color-win); }
        }
        @keyframes judgement-loss {
          0% { transform: scale(1); filter: drop-shadow(0 0 5px ${godColorHex}); }
          50% { transform: scale(0.8); filter: drop-shadow(0 0 2px ${godColorHex}); }
          80% { transform: scale(1.2); filter: drop-shadow(0 0 20px var(--color-loss)); color: var(--color-loss); }
          100% { transform: scale(0.1) rotate(360deg); opacity: 0; filter: drop-shadow(0 0 5px var(--color-loss)); color: var(--color-loss); }
        }
      `}</style>
    </div>
  );
};

export default DivineJudgementAnimation;
