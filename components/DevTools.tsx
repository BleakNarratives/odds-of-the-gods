import React, { useState } from 'react';
import { DevToolsProps, GodId } from '../types';
import { PANTHEON } from '../constants';

const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose, actions }) => {
  const [soulsAmount, setSoulsAmount] = useState('1000');
  const [devotionGod, setDevotionGod] = useState<GodId>(PANTHEON[0].id);
  const [devotionAmount, setDevotionAmount] = useState('100');

  if (!isOpen) return null;

  const handleSetSouls = () => actions.onSetSouls(parseInt(soulsAmount, 10));
  const handleAddSouls = () => actions.onAddSouls(parseInt(soulsAmount, 10));
  const handleSetDevotion = () => actions.onSetDevotion(devotionGod, parseInt(devotionAmount, 10));

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-2xl shadow-red-500/20 border border-red-500/50 w-full max-w-lg m-4 p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-400">Developer Tools (Ctrl+Shift+D)</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto">
          {/* Souls Management */}
          <div className="bg-slate-800/50 p-3 rounded">
            <h3 className="font-bold text-slate-300 mb-2">Souls</h3>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={soulsAmount} 
                onChange={e => setSoulsAmount(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded p-1 text-center"
              />
              <button onClick={handleSetSouls} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm">Set</button>
              <button onClick={handleAddSouls} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm">Add</button>
            </div>
          </div>
          
          {/* Devotion Management */}
          <div className="bg-slate-800/50 p-3 rounded">
            <h3 className="font-bold text-slate-300 mb-2">Devotion</h3>
            <div className="flex items-center gap-2">
              {/* FIX: Cast e.target.value to GodId to match the state type. */}
              <select value={devotionGod} onChange={e => setDevotionGod(e.target.value as GodId)} className="bg-slate-700 border border-slate-600 rounded p-1">
                {PANTHEON.map(god => <option key={god.id} value={god.id}>{god.name}</option>)}
              </select>
              <input 
                type="number" 
                value={devotionAmount} 
                onChange={e => setDevotionAmount(e.target.value)}
                className="w-24 bg-slate-700 border border-slate-600 rounded p-1 text-center"
              />
              <button onClick={handleSetDevotion} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm">Set</button>
            </div>
          </div>

          {/* Quest Management */}
          <div className="bg-slate-800/50 p-3 rounded">
            <h3 className="font-bold text-slate-300 mb-2">Quests</h3>
            <button onClick={actions.onCompleteAllQuests} className="w-full bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded">Complete All Quests</button>
          </div>
          
          {/* Reset */}
          <div className="bg-red-900/50 p-3 rounded border border-red-500/50">
            <h3 className="font-bold text-red-300 mb-2">Danger Zone</h3>
            <button onClick={actions.onResetPlayerState} className="w-full bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">Reset All Player Data</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DevTools;
