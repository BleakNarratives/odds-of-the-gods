// src/components/DevTools.tsx
import React, { useState } from 'react';
import { PlayerState, DevLogEntry } from '../types';

interface DevToolsProps {
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  souls: number;
  setSouls: React.Dispatch<React.SetStateAction<number>>;
  logDevEvent: (message: string, data?: any) => void;
  devLogs: DevLogEntry[];
  onClearLogs: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ playerState, setPlayerState, souls, setSouls, logDevEvent, devLogs, onClearLogs }) => {
    const [soulAmount, setSoulAmount] = useState(1000);
    const [logVisible, setLogVisible] = useState(true);

    const handleAddSouls = () => {
        setSouls(s => s + soulAmount);
        logDevEvent(`Manually added ${soulAmount} souls.`);
    };
    
    const handleSetSouls = () => {
        setSouls(soulAmount);
        logDevEvent(`Manually set souls to ${soulAmount}.`);
    };

    const handleTierChange = (tier: 'Mortal' | 'Demigod' | 'Deity') => {
        setPlayerState(p => ({ ...p, accountTier: tier }));
        logDevEvent(`Account tier changed to ${tier}.`);
    };

    return (
        <div className="fixed bottom-4 right-4 z-[998] w-full max-w-sm bg-slate-800/90 backdrop-blur-md rounded-lg shadow-2xl border border-theme-border flex flex-col animate-fade-in">
            <div className="p-3 border-b border-theme-border/50">
                <h3 className="text-lg font-bold text-slate-400">Dev Tools</h3>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={soulAmount} 
                        onChange={e => setSoulAmount(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-700 p-2 rounded"
                    />
                    <button onClick={handleAddSouls} className="bg-green-600 px-3 py-2 rounded text-sm">Add</button>
                    <button onClick={handleSetSouls} className="bg-blue-600 px-3 py-2 rounded text-sm">Set</button>
                </div>
                 <div>
                    <p className="text-sm text-slate-400 mb-1">Account Tier</p>
                    <div className="flex items-center gap-2">
                        {(['Mortal', 'Demigod', 'Deity'] as const).map(tier => (
                            <button key={tier} onClick={() => handleTierChange(tier)} className={`px-2 py-1 rounded text-xs ${playerState.accountTier === tier ? 'bg-cyan-500' : 'bg-slate-600'}`}>{tier}</button>
                        ))}
                    </div>
                </div>
                <button onClick={() => setLogVisible(prev => !prev)} className="text-slate-400 text-sm hover:text-white">
                    {logVisible ? 'Hide' : 'Show'} Dev Log
                </button>
            </div>
            {logVisible && (
                 <div className="border-t border-theme-border/50 p-2 text-xs font-mono text-slate-400 h-48 overflow-y-auto">
                    {devLogs.length > 0 ? devLogs.map((log, i) => (
                        <div key={i}><span className="text-slate-600">{log.timestamp}</span> {typeof log.message === 'string' ? log.message : JSON.stringify(log.message)}</div>
                    )) : <p>Log empty.</p>}
                 </div>
            )}
             <button onClick={onClearLogs} className="w-full text-xs p-1 bg-slate-700/50 hover:bg-slate-700">Clear Logs</button>
        </div>
    );
};

export default DevTools;
