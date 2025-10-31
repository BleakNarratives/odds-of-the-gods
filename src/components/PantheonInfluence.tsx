// src/components/PantheonInfluence.tsx
import React from 'react';
import { PANTHEON } from '../constants';
import { God } from '../types';

const PantheonInfluence: React.FC = () => {
  const sortedGods = [...PANTHEON].sort((a, b) => b.influence - a.influence);
  const totalInfluence = sortedGods.reduce((sum, god) => sum + god.influence, 0);

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-theme-border/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-theme-secondary mb-3 text-center">Pantheon Influence</h3>
      <div className="space-y-2">
        {sortedGods.map(god => {
          const percentage = (god.influence / totalInfluence) * 100;
          const colorMap: Record<string, string> = {
            amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
            yellow: '#facc15', blue: '#2563eb', red: '#ef4444', indigo: '#6366f1',
            teal: '#14b8a6'
          };
          const barColor = colorMap[god.color] || 'var(--color-primary)';
          
          return (
            <div key={god.id} className="group">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-300">{god.name}</span>
                <span className="text-slate-400">{god.influence}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: barColor, boxShadow: `0 0 5px ${barColor}` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PantheonInfluence;
