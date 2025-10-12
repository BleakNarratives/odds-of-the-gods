import React from 'react';
import { PANTHEON, USER_GOD_TEMPLATE, ASPIRANT_GOD } from '../constants';
import { God, PlayerState } from '../types';
import GodCard from './GodCard';

interface PantheonScreenProps {
  onSelectCult: (godId: string) => void;
  playerState: PlayerState;
  onPersonalizeClick: (god: God) => void;
  onAscendClick: () => void;
  souls: number;
}

const PantheonScreen: React.FC<PantheonScreenProps> = ({ onSelectCult, playerState, onPersonalizeClick, onAscendClick, souls }) => {

  const displayedPantheon = playerState.hasAscended && playerState.ascendedGodDetails
    ? [
        ...PANTHEON.filter(g => g.id !== 'aspirant'),
        {
          ...USER_GOD_TEMPLATE,
          name: playerState.ascendedGodDetails.name,
          title: playerState.ascendedGodDetails.title,
          philosophy: playerState.ascendedGodDetails.philosophy,
        }
      ]
    : PANTHEON;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">THE HALL OF THE GODS</h1>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          The old pacts are broken. The gods, weakened by mortal apathy, now hunger for belief. Your soul is the ultimate currency in their cosmic war.
          Pledge your devotion and become the weapon in their struggle for dominion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedPantheon.map(god => {
          const personalizedImage = god.id === 'user_god' && playerState.ascendedGodDetails
            ? playerState.ascendedGodDetails.image
            : playerState.personalizedGods[god.id];
            
          return (
            <GodCard 
              key={god.id} 
              god={god} 
              onSelectCult={onSelectCult}
              personalizedImage={personalizedImage}
              onPersonalizeClick={onPersonalizeClick}
              onAscendClick={onAscendClick}
              souls={souls}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PantheonScreen;
