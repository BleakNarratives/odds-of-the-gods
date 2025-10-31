import React, { useState } from 'react';
import { PlayerState, Stance, ClashChallenge, GodId } from '../types';
import { SoulIcon } from './icons/MythicIcons';
import { PANTHEON } from '../constants';

interface ClashScreenProps {
  playerState: PlayerState;
  souls: number;
  onIssueChallenge: (wager: number, stance: Stance) => void;
  incomingClashes: ClashChallenge[];
  onAcceptChallenge: (challenge: ClashChallenge) => void;
}

const ChallengeCard: React.FC<{ challenge: ClashChallenge, onAccept: () => void }> = ({ challenge, onAccept }) => {
    const god = PANTHEON.find(g => g.id === challenge.challengerGodId);
    const color = god?.color || 'gray';
    const colorMap: Record<string, string> = {
        amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
        yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
        teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
    };
    const borderColor = colorMap[color] || '#64748b';

    return (
        <div className="bg-slate-800/70 p-4 rounded-md flex justify-between items-center border-l-4" style={{ borderColor }}>
            <div>
                <p className="text-white">Challenge from <span className="font-bold" style={{ color: borderColor }}>{challenge.challengerName}</span></p>
                <p className="text-sm text-slate-400">Wager: <span className="font-semibold text-theme-souls">{challenge.wager} Souls</span></p>
                {challenge.truceOffered && <p className="text-sm text-cyan-300 italic">They have offered a truce.</p>}
            </div>
            <button onClick={onAccept} className="bg-theme-primary text-theme-background font-bold py-2 px-4 rounded-md hover:bg-amber-500 transition-colors">
                Accept
            </button>
        </div>
    );
};


const ClashScreen: React.FC<ClashScreenProps> = ({ playerState, souls, onIssueChallenge, incomingClashes, onAcceptChallenge }) => {
  const [wager, setWager] = useState(100);
  const [stance, setStance] = useState<Stance | null>(null);

  const handleIssueChallenge = () => {
    if (stance && wager > 0 && wager <= souls) {
      onIssueChallenge(wager, stance);
      setStance(null);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">CLASH OF FATES</h1>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          Challenge another mortal soul in the ether. Set your wager, choose your stance, and await their response. The gods watch this display with great interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Issue Challenge Section */}
          <div className="bg-slate-900/50 border border-theme-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center text-theme-primary mb-6">Issue a New Challenge</h2>
            
            <div className="mb-6">
              <label className="block text-lg text-slate-300 mb-2">Wager Amount</label>
              <div className="flex items-center gap-2 bg-theme-surface p-2 rounded-md">
                <SoulIcon className="w-6 h-6 text-theme-souls" />
                <input 
                  type="number"
                  value={wager}
                  onChange={e => setWager(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-transparent text-white text-xl font-bold focus:outline-none"
                  max={souls}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-lg text-slate-300 mb-2">Choose Your Stance</label>
              <div className="grid grid-cols-3 gap-4">
                {(['Aggressive', 'Deceptive', 'Defensive'] as Stance[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setStance(s)}
                    className={`py-4 font-bold rounded-lg border-2 transition-all ${stance === s ? 'bg-theme-primary/20 border-theme-primary scale-105' : 'bg-theme-surface border-theme-border hover:border-theme-primary/50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleIssueChallenge}
              disabled={!stance || wager <= 0 || wager > souls}
              className="w-full bg-theme-primary text-theme-background font-bold py-4 rounded-lg text-xl uppercase tracking-wider hover:bg-amber-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Send Challenge to the Ether
            </button>
          </div>

          {/* Incoming/Outgoing Challenges */}
          <div>
              <div className="mb-8">
                 <h2 className="text-2xl font-bold text-slate-300 mb-4">Incoming Challenges</h2>
                 <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {incomingClashes.length > 0 ? incomingClashes.map(challenge => (
                        <ChallengeCard key={challenge.id} challenge={challenge} onAccept={() => onAcceptChallenge(challenge)} />
                    )) : (
                        <p className="text-center text-slate-500 italic">The ether is silent... for now.</p>
                    )}
                 </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-300 mb-4">Your Pending Challenges</h2>
                <div className="space-y-3">
                    {playerState.clashes.filter(c => !c.isResolved).map(challenge => (
                        <div key={challenge.id} className="bg-slate-800/70 p-4 rounded-md flex justify-between items-center border-l-4 border-theme-secondary">
                            <div>
                                <p className="text-white">Challenging the void with <span className="font-bold text-theme-souls">{challenge.wager} Souls</span>.</p>
                                <p className="text-sm text-slate-400">Your chosen stance: <span className="font-semibold text-slate-200">{challenge.stance}</span></p>
                            </div>
                            <span className="text-sm font-bold text-yellow-400 animate-pulse">Awaiting Response...</span>
                        </div>
                    ))}
                    {playerState.clashes.filter(c => !c.isResolved).length === 0 && (
                        <p className="text-center text-slate-500 italic">You have no challenges awaiting a response.</p>
                    )}
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ClashScreen;