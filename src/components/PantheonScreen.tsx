// src/components/PantheonScreen.tsx
import React from 'react';
import { God, PlayerState } from '../types';
import { PANTHEON } from '../constants';
import GodCard from './GodCard';
import PantheonInfluence from './PantheonInfluence';

interface PantheonScreenProps {
  onSelectGod: (god: God) => void;
  playerState: PlayerState;
}

const PantheonScreen: React.FC<PantheonScreenProps> = ({ onSelectGod, playerState }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          CHOOSE YOUR PATRON
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          The gods are restless. Pledge your soul to a patron and enter their divine games. Your victories and losses will shift the balance of power in the cosmos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PANTHEON.map(god => (
              <GodCard 
                key={god.id} 
                god={god} 
                onSelect={() => onSelectGod(god)} 
                isCultMember={playerState.currentCultId === god.id}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
            <PantheonInfluence />
        </div>
      </div>
    </div>
  );
};

export default PantheonScreen;
