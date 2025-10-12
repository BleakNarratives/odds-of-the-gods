import React from 'react';
import { PantheonInfluenceState } from '../types';
import { PANTHEON, GAMES } from '../constants';

interface PantheonInfluenceProps {
  influence: PantheonInfluenceState;
}

const PantheonInfluence: React.FC<PantheonInfluenceProps> = ({ influence }) => {
  // Fix: Explicitly cast Object.values to number[] to ensure correct type inference for totalInfluence.
  const totalInfluence = (Object.values(influence) as number[]).reduce((sum, val) => sum + val, 0);

  const godInfluences = PANTHEON.map(god => {
    const godInfluence = influence[god.id] || 0;
    const percentage = totalInfluence > 0 ? (godInfluence / totalInfluence) * 100 : 20; // Default to equal share
    const game = GAMES.find(g => g.godId === god.id);
    return {
      ...god,
      Icon: game!.Icon,
      percentage: Math.max(percentage, 5), // Ensure a minimum visible height
    };
  });

  const getBarColorClass = (color: string) => ({
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
  }[color] || 'bg-gray-500');

  const getGlowStyle = (color: string, percentage: number): React.CSSProperties => {
    const opacity = Math.min(1, (percentage / 50)); // Glow becomes more intense as percentage increases
    const colorHex = {
      amber: '#f59e0b',
      rose: '#f43f5e',
      slate: '#64748b',
      green: '#22c55e',
      yellow: '#facc15',
      blue: '#3b82f6',
      red: '#ef4444',
      indigo: '#6366f1',
      teal: '#14b8a6',
    }[color] || '#6b7280';
    
    return {
      boxShadow: `0px 0px ${percentage * 0.5}px ${percentage * 0.2}px ${colorHex}`,
      opacity: opacity,
    };
  };

  return (
    <div className="bg-black/20 border border-amber-800/50 rounded-lg p-6 w-full max-w-4xl mx-auto animate-fade-in">
      <h3 className="text-center text-lg text-slate-300 tracking-wider mb-6">DIVINE HIERARCHY</h3>
      <div className="flex justify-around items-end h-40 gap-4">
        {godInfluences.map(({ id, Icon, percentage, color }) => (
          <div key={id} className="flex flex-col items-center justify-end w-full h-full text-center group">
            <div 
              className="w-full flex-shrink-0 rounded-t-md transition-all duration-700 ease-out relative" 
              style={{ height: `${percentage}%` }}
            >
              <div 
                className={`absolute inset-x-0 top-0 h-full w-full rounded-t-md ${getBarColorClass(color)} transition-all duration-700`}
                style={getGlowStyle(color, percentage)}
              ></div>
            </div>
            <Icon className="w-10 h-10 mt-3 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PantheonInfluence;
