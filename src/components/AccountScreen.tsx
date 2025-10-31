// src/components/AccountScreen.tsx
import React from 'react';
import { PlayerState } from '../types';
import { PANTHEON } from '../constants';
import GodIcon from './icons/GodIcon';
import { SoulIcon } from './icons/MythicIcons';

interface AccountScreenProps {
  playerState: PlayerState;
  souls: number;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ playerState, souls }) => {
  const patronGod = PANTHEON.find(g => g.id === playerState.currentCultId);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">MORTAL RECORD</h1>
        <p className="mt-4 text-lg text-slate-300">The Scribe has noted your deeds.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/50 border border-theme-border rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Player Info */}
        <div>
          <h2 className="text-2xl font-bold text-theme-primary mb-4">Identity</h2>
          <div className="space-y-3">
            <p><span className="font-bold text-slate-400">Name:</span> {playerState.name}</p>
            <p><span className="font-bold text-slate-400">Tier:</span> {playerState.accountTier}</p>
            <p className="flex items-center"><span className="font-bold text-slate-400 mr-2">Soul Balance:</span> <SoulIcon className="w-5 h-5 text-theme-souls mr-1"/> {souls.toLocaleString()}</p>
            <div>
                <span className="font-bold text-slate-400">Patron God:</span> 
                {patronGod ? (
                    <span className="ml-2 font-semibold" style={{color: patronGod.color}}>{patronGod.name}</span>
                ) : (
                    <span className="ml-2 text-slate-500 italic">None</span>
                )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-theme-primary mt-8 mb-4">Statistics</h2>
           <div className="space-y-3 text-sm">
             <p><span className="font-bold text-slate-400">Games Played:</span> {playerState.gamesPlayed.toLocaleString()}</p>
             <p><span className="font-bold text-slate-400">Total Wagered:</span> {playerState.totalWagered.toLocaleString()} Souls</p>
             <p><span className="font-bold text-slate-400">Total Won:</span> {playerState.totalWon.toLocaleString()} Souls</p>
             <p><span className="font-bold text-slate-400">Net Gain/Loss:</span> 
                <span className={playerState.totalWon >= playerState.totalWagered ? 'text-theme-win' : 'text-theme-loss'}>
                    {' '}{(playerState.totalWon - playerState.totalWagered).toLocaleString()} Souls
                </span>
            </p>
          </div>
        </div>

        {/* Right Side: God Devotion */}
        <div>
           <h2 className="text-2xl font-bold text-theme-primary mb-4">Godly Devotion</h2>
           <div className="space-y-4">
            {PANTHEON.map(god => {
                const progress = playerState.godProgress[god.id];
                const devotionLevel = Math.floor(progress.devotion / 20);
                const colorMap: Record<string, string> = {
                    amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
                    yellow: '#facc15', blue: '#2563eb', red: '#ef4444', indigo: '#6366f1',
                    teal: '#14b8a6'
                };
                const primaryColor = colorMap[god.color] || '#FFFFFF';

                return (
                    <div key={god.id} className="flex items-center gap-4">
                        <GodIcon godId={god.id} className="w-8 h-8 flex-shrink-0" style={{color: primaryColor}} />
                        <div className="w-full">
                            <p className="text-sm font-bold" style={{color: primaryColor}}>{god.name}</p>
                            <div className="flex items-center text-xs">
                                {Array.from({length: 5}).map((_, i) => (
                                    <span key={i} style={{color: i < devotionLevel ? primaryColor : 'var(--color-border)'}}>★</span>
                                ))}
                                <span className="ml-2 text-slate-400">({progress.gamesWon} wins)</span>
                            </div>
                        </div>
                    </div>
                )
            })}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AccountScreen;
