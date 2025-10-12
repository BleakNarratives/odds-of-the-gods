import React, { useMemo } from 'react';
import { PANTHEON, GAMES } from '../constants';
import { PantheonInfluenceState, PlayerState, God } from '../types';

interface GodsOfWarProps {
  playerState: PlayerState;
  influence: PantheonInfluenceState;
  onReturnToSanctum: () => void;
  patronGod: God | null;
  onBecomeChampion: () => void;
}

const GodsOfWar: React.FC<GodsOfWarProps> = ({ playerState, influence, onReturnToSanctum, patronGod, onBecomeChampion }) => {

  const [dominantGod, challengerGod] = useMemo(() => {
    const sortedGods = Object.entries(influence)
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .map(([id]) => PANTHEON.find(g => g.id === id)!);
    return [sortedGods[0], sortedGods[1]];
  }, [influence]);

  const DominantIcon = GAMES.find(g => g.godId === dominantGod.id)!.Icon;
  const ChallengerIcon = GAMES.find(g => g.godId === challengerGod.id)!.Icon;

  const patronDevotion = patronGod ? playerState.devotion[patronGod.id] || 0 : 0;
  const championThreshold = 1000; // Devotion needed to be considered for champion status
  const isChampionReady = patronDevotion >= championThreshold && patronGod?.id !== dominantGod.id;

  const progress = Math.min((patronDevotion / championThreshold) * 100, 100);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">THE PANTHEON AT WAR</h1>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          The shifting loyalties of mortals have thrown the divine hierarchy into chaos. The gods now clash for supremacy, their power echoing across the cosmos.
        </p>
      </div>

      <div className="relative bg-black/30 backdrop-blur-md rounded-lg shadow-2xl border border-theme-border/50 w-full max-w-4xl mx-auto p-8 h-80 flex items-center justify-around">
        {/* Dominant God */}
        <div className="flex flex-col items-center animate-[pulse-glow_3s_ease-in-out_infinite]">
          <DominantIcon className="w-24 h-24" style={{ color: dominantGod.color, filter: `drop-shadow(0 0 15px ${dominantGod.color})` }} />
          <h3 className="text-2xl font-bold mt-2" style={{ color: dominantGod.color }}>{dominantGod.name}</h3>
          <p className="text-sm text-theme-muted">The Defender</p>
        </div>

        {/* VS */}
        <div className="text-5xl font-black text-theme-muted animate-[pulse_2s_ease-in-out_infinite]">VS</div>

        {/* Challenger God */}
        <div className="flex flex-col items-center animate-[pulse-glow_3s_ease-in-out_infinite_1.5s]">
          <ChallengerIcon className="w-24 h-24" style={{ color: challengerGod.color, filter: `drop-shadow(0 0 15px ${challengerGod.color})` }} />
          <h3 className="text-2xl font-bold mt-2" style={{ color: challengerGod.color }}>{challengerGod.name}</h3>
          <p className="text-sm text-theme-muted">The Challenger</p>
        </div>
      </div>

      <div className="text-center mt-12 max-w-3xl mx-auto">
        {patronGod?.id === dominantGod.id ? (
          <>
            <h2 className="text-3xl font-bold text-theme-primary">Your Patron Reigns Supreme!</h2>
            <p className="text-slate-300 mt-4">
              Your patron holds dominion. There is no one to challenge. Bask in their glory and continue to enforce their will upon this realm.
            </p>
          </>
        ) : isChampionReady ? (
          <>
            <h2 className="text-3xl font-bold text-theme-primary">Your Time is Nigh!</h2>
            <p className="text-slate-300 mt-4">
              Your unwavering devotion has caught the eye of your patron. You are ready to challenge the dominant god. Pledge your soul as champion and enter the fray.
            </p>
            <button
                onClick={onBecomeChampion}
                className="mt-6 bg-theme-primary/90 text-theme-background font-bold py-3 px-8 rounded-lg text-lg tracking-wider uppercase hover:bg-theme-primary transition-colors duration-300 shadow-lg shadow-theme-primary/20"
            >
                Become Champion
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-400">Mortals May Not Interfere</h2>
            <p className="text-slate-300 mt-4">
              The clash of divinities is no place for the unproven. Your soul would be torn asunder. Prove your worth by dedicating yourself to a patron, and you may yet be chosen to turn the tide.
            </p>
            <div className="w-full bg-slate-700 rounded-full h-4 mt-6 border border-theme-border">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress}%`, backgroundColor: patronGod?.color, boxShadow: `0 0 10px ${patronGod?.color}` }}>
              </div>
            </div>
            <p className="text-sm text-theme-muted mt-2">Devotion towards Championhood: {patronDevotion.toFixed(0)} / {championThreshold}</p>
          </>
        )}
      </div>

       <div className="text-center mt-12">
            <button onClick={onReturnToSanctum} className="text-theme-muted hover:text-white transition-colors text-lg">
              &larr; Return to Sanctum
            </button>
        </div>

    </div>
  );
};

export default GodsOfWar;
