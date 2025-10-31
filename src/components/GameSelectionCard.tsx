// src/components/GameSelectionCard.tsx
import React from 'react';
import { Game } from '../types';

interface GameSelectionCardProps {
  game: Game;
  onSelect: () => void;
}

const GameSelectionCard: React.FC<GameSelectionCardProps> = ({ game, onSelect }) => {
  return (
    <div 
        onClick={onSelect}
        className="bg-slate-800/50 p-4 rounded-lg border border-theme-border hover:border-theme-primary transition-all duration-300 cursor-pointer flex items-center gap-4"
    >
      <div className="w-16 h-16 bg-slate-700 rounded-md flex items-center justify-center">
        <game.Icon className="w-10 h-10 text-theme-primary" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-theme-secondary">{game.name}</h3>
        <p className="text-sm text-theme-muted">{game.description}</p>
      </div>
    </div>
  );
};

export default GameSelectionCard;
