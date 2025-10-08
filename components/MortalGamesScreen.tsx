import React from 'react';
import { GAMES } from '../constants';
import { Game, God } from '../types';
import GameSelectionCard from './GameSelectionCard';

interface MortalGamesScreenProps {
  onSelectGame: (game: Game) => void;
  patronGod: God;
}

const MortalGamesScreen: React.FC<MortalGamesScreenProps> = ({ onSelectGame, patronGod }) => {
  const mortalGames = GAMES.filter(g => g.category === 'MORTAL');

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="text-center mb-8 border-b-2 border-slate-600 pb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The Mortal's Folly</h2>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          Here, the gods do not preside. These are games of pure chance and simple mechanics, brought from the mortal realm. Yet, your patron still watches, granting favor for any victory won in their name.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mortalGames.map(game => (
            <GameSelectionCard key={game.id} game={game} onSelectGame={onSelectGame} color={patronGod.color} />
        ))}
      </div>
    </div>
  );
};

export default MortalGamesScreen;
