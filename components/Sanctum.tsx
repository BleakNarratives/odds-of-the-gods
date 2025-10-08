import React from 'react';
import { GAMES, PANTHEON } from '../constants';
import { Game, God, PantheonInfluenceState, PlayerState } from '../types';
import PantheonInfluence from './PantheonInfluence';
import GameSelectionCard from './GameSelectionCard';

interface SanctumProps {
  god: God;
  playerState: PlayerState;
  onSelectGame: (game: Game) => void;
  onNavigateToWar: () => void;
  onActivateUltimate: (godId: string) => void;
  influence: PantheonInfluenceState;
  dominantGodId: string | null;
}

const Sanctum: React.FC<SanctumProps> = ({ god, playerState, onSelectGame, onNavigateToWar, onActivateUltimate, influence, dominantGodId }) => {

  const devotion = playerState.devotion[god.id] || 0;
  const ultimateCharge = playerState.ultimateCharge[god.id] || 0;
  const isUltimateReady = ultimateCharge >= god.ultimate.cost;
  
  const unlockedBoons = god.boons.filter(boon => devotion >= boon.devotionThreshold);
  const nextBoon = god.boons.find(boon => devotion < boon.devotionThreshold);

  const dominantGod = PANTHEON.find(g => g.id === dominantGodId);
  const DominantGodIcon = dominantGod ? GAMES.find(g => g.godId === dominantGod.id)?.Icon : null;

  const godGames = GAMES.filter(g => g.godId === god.id);
  
  const colorMap: Record<string, string> = {
    amber: '#f59e0b',
    rose: '#f43f5e',
    slate: '#64748b',
    green: '#22c55e',
    yellow: '#facc15',
    blue: '#3b82f6',
    red: '#ef4444',
    indigo: '#6366f1',
    teal: '#14b8a6',
  };
  const godColorHex = colorMap[god.color] || '#ffffff';

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="text-center mb-8 border-b-2 pb-8" style={{borderColor: godColorHex}}>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Sanctum of <span style={{color: godColorHex}}>{god.name}</span></h2>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          {god.lore}
        </p>
      </div>

      {dominantGod && DominantGodIcon && (
        <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-900 to-black/50 border-2 rounded-lg p-6 text-center shadow-2xl" style={{borderColor: dominantGod.color, boxShadow: `0 0 20px ${dominantGod.color}`}}>
                <h3 className="text-xl font-bold tracking-wider uppercase text-slate-300">CURRENT DOMINION</h3>
                <div className="flex items-center justify-center gap-4 mt-4">
                     <DominantGodIcon className="w-12 h-12" style={{color: dominantGod.color}} />
                     <p className="text-2xl font-bold" style={{color: dominantGod.color}}>{dominantGod.name} is Dominant</p>
                </div>
                <p className="text-slate-400 mt-2 italic">"{dominantGod.globalEffectDescription}"</p>
            </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        {/* Game Cards */}
        <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold mb-4 text-center text-white">Divine Games</h3>
            <div className="grid grid-cols-1 gap-6">
                {godGames.map(game => (
                    <GameSelectionCard key={game.id} game={game} onSelectGame={onSelectGame} color={god.color} />
                ))}
            </div>
        </div>

        {/* Devotion and Boons Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-slate-900/80 to-black/50 border border-slate-800 rounded-lg p-6 h-fit">
                <h3 className="text-2xl font-bold mb-4 text-center" style={{color: godColorHex}}>Your Devotion</h3>
                <div className="text-5xl font-black text-center text-white mb-4">{devotion.toFixed(0)}</div>
                {nextBoon && (
                    <div className="mb-6">
                        <p className="text-sm text-center text-slate-400 mb-2">Next Boon at {nextBoon.devotionThreshold} Devotion</p>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div className="h-2.5 rounded-full" style={{ width: `${(devotion / nextBoon.devotionThreshold) * 100}%`, backgroundColor: godColorHex, boxShadow: `0 0 8px ${godColorHex}` }}></div>
                        </div>
                    </div>
                )}
                <h4 className="text-lg font-bold mt-6 mb-3 text-slate-300 border-b border-slate-700 pb-2">Unlocked Boons</h4>
                {unlockedBoons.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                        {unlockedBoons.map(boon => (
                            <li key={boon.devotionThreshold} className="text-slate-300">
                                <span className="font-bold text-green-400">&#10003; {boon.description.split(':')[0]}:</span> {boon.description.split(':')[1]}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 italic text-center">Pledge more Souls to earn favor.</p>
                )}
            </div>
            {/* Ultimate Power Section */}
             <div className="bg-gradient-to-br from-slate-900/80 to-black/50 border-2 rounded-lg p-6 h-fit" style={{borderColor: godColorHex}}>
                <h3 className="text-2xl font-bold mb-2 text-center" style={{color: godColorHex}}>Ultimate Power</h3>
                 <p className="text-lg font-bold text-center text-white mb-2">{god.ultimate.name}</p>
                <p className="text-sm text-center text-slate-400 italic mb-4">"{god.ultimate.description}"</p>
                <div className="w-full bg-slate-700 rounded-full h-4 border border-slate-600">
                    <div className={`h-full rounded-full transition-all duration-500 ${isUltimateReady ? 'animate-charge-unleash' : ''}`} style={{ width: `${Math.min(ultimateCharge / god.ultimate.cost, 1) * 100}%`, backgroundColor: godColorHex, boxShadow: `0 0 10px ${godColorHex}`, color: godColorHex }}></div>
                </div>
                <button 
                    onClick={() => onActivateUltimate(god.id)}
                    disabled={!isUltimateReady}
                    className="w-full mt-4 text-white font-bold py-2 px-4 rounded-md text-md uppercase tracking-widest transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{backgroundColor: isUltimateReady ? godColorHex : '', boxShadow: isUltimateReady ? `0 0 15px ${godColorHex}` : 'none' }}
                >
                    {isUltimateReady ? 'Unleash Power' : `Charged: ${ultimateCharge.toFixed(0)}/${god.ultimate.cost}`}
                </button>
            </div>
        </div>
      </div>

      <div className="mt-12">
        <PantheonInfluence influence={influence} />
         <div className="text-center mt-6">
            <button
            onClick={onNavigateToWar}
            className="bg-theme-surface hover:bg-theme-primary/20 border border-theme-border text-theme-primary font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
            Witness the Divine Conflict
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sanctum;