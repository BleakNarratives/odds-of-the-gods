// src/components/PsychicResonanceProfile.tsx
import React from 'react';
import { PlayerState } from '../types';

interface PsychicResonanceProfileProps {
    playerState: PlayerState;
}

const PsychicResonanceProfile: React.FC<PsychicResonanceProfileProps> = ({ playerState }) => {
    const { dominance, intuition, aggression } = playerState.psychicProfile;
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-theme-border">
            <h3 className="text-lg font-bold text-center text-indigo-300 mb-4">Psychic Resonance</h3>
            <div className="space-y-2 text-sm">
                <div>
                    <p>Dominance: {dominance}</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-red-500 h-2 rounded-full" style={{width: `${dominance}%`}}></div></div>
                </div>
                <div>
                    <p>Intuition: {intuition}</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full" style={{width: `${intuition}%`}}></div></div>
                </div>
                <div>
                    <p>Aggression: {aggression}</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-yellow-500 h-2 rounded-full" style={{width: `${aggression}%`}}></div></div>
                </div>
            </div>
        </div>
    );
};

export default PsychicResonanceProfile;
