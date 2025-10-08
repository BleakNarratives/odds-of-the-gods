import React, { useState, useEffect, useMemo } from 'react';
import { God } from '../types';
import { GAMES } from '../constants';
import { audioService } from '../services/audioService';

interface RitualSymbolProps {
  god: God;
  onComplete: (focus: number) => void;
}

const RITUAL_DURATION = 3000; // 3 seconds
const NUM_FRAGMENTS = 7;

const RitualSymbol: React.FC<RitualSymbolProps> = ({ god, onComplete }) => {
  const [startTime, setStartTime] = useState(0);
  const [clickedFragments, setClickedFragments] = useState<boolean[]>(new Array(NUM_FRAGMENTS).fill(false));
  const [isComplete, setIsComplete] = useState(false);

  const GodIcon = useMemo(() => (GAMES.find(g => g.godId === god.id) || {}).Icon, [god.id]);

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= RITUAL_DURATION && !isComplete) {
        setIsComplete(true);
        clearInterval(timer);
        const focus = clickedFragments.filter(Boolean).length / NUM_FRAGMENTS;
        onComplete(focus);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [startTime, onComplete, clickedFragments, isComplete]);

  const handleFragmentClick = (index: number) => {
    if (clickedFragments[index] || isComplete) return;
    audioService.play('click');
    const newFragments = [...clickedFragments];
    newFragments[index] = true;
    setClickedFragments(newFragments);

    if (newFragments.every(Boolean)) {
        setIsComplete(true);
        const focus = 1.0; // Perfect focus
        setTimeout(() => onComplete(focus), 300); // Short delay for visual feedback
    }
  };
  
  const fragments = useMemo(() => {
    return Array.from({ length: NUM_FRAGMENTS }).map((_, i) => {
      const angle = (i / NUM_FRAGMENTS) * 2 * Math.PI + Date.now()/1000;
      const radius = 90;
      return {
        left: `calc(50% + ${Math.cos(angle) * radius}px - 16px)`,
        top: `calc(50% + ${Math.sin(angle) * radius}px - 16px)`,
        animationDelay: `${Math.random() * 500}ms`
      }
    });
  }, []);
  
  const colorMap: Record<string, string> = {
    amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
    yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
    teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
  };
  const godColorHex = colorMap[god.color] || '#ffffff';

  const progress = isComplete ? 100 : ((Date.now() - startTime) / RITUAL_DURATION) * 100;
  const collectedCount = clickedFragments.filter(Boolean).length;
  const opacity = collectedCount / NUM_FRAGMENTS;

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-2">Focus Your Will!</h3>
      <p className="text-theme-muted mb-6">Re-forge the divine symbol before time runs out!</p>
      
      <div className="relative w-48 h-48">
        {fragments.map((style, i) => (
          <button
            key={i}
            onClick={() => handleFragmentClick(i)}
            className={`absolute w-8 h-8 rounded-full transition-all duration-300 transform animate-fade-in ${clickedFragments[i] ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
            style={{ ...style, backgroundColor: godColorHex, boxShadow: `0 0 10px ${godColorHex}` }}
            aria-label={`Fragment ${i + 1}`}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {GodIcon && <GodIcon className="w-20 h-20 transition-opacity duration-500" style={{color: godColorHex, opacity: opacity, filter: `drop-shadow(0 0 ${opacity * 15}px ${godColorHex})`}} />}
        </div>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2.5 mt-6">
        <div 
          className="bg-red-500 h-2.5 rounded-full transition-all duration-100" 
          style={{ width: `${100-progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RitualSymbol;