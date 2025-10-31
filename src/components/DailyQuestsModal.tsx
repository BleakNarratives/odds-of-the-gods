// src/components/DailyQuestsModal.tsx
import React from 'react';
import { PlayerState, Quest } from '../types';
import { PANTHEON } from '../constants';
import GodIcon from './icons/GodIcon';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  onClaimReward: (amount: number) => void;
}

const QuestItem: React.FC<{ quest: Quest; onClaim: () => void }> = ({ quest, onClaim }) => {
    const god = PANTHEON.find(g => g.id === quest.godId);
    const isComplete = quest.progress >= quest.target;
    const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);

    return (
        <div className="bg-black/20 p-4 rounded-lg border border-theme-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                {god && <GodIcon godId={god.id} className="w-10 h-10" style={{color: god.color}} />}
                <div>
                    <p className="text-slate-200">{quest.description}</p>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
                        <div className="bg-theme-primary h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                     <p className="text-xs text-slate-400">{quest.progress} / {quest.target}</p>
                </div>
            </div>
            <button
                onClick={onClaim}
                disabled={!isComplete || quest.isClaimed}
                className="w-full sm:w-auto bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-amber-500"
            >
                {quest.isClaimed ? 'Claimed' : (isComplete ? `Claim ${quest.reward} Souls` : 'In Progress')}
            </button>
        </div>
    );
};

const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({ isOpen, onClose, playerState, setPlayerState, onClaimReward }) => {
  if (!isOpen) return null;

  const handleClaim = (questId: string) => {
    const quest = playerState.quests.find(q => q.id === questId);
    if (quest && !quest.isClaimed && quest.progress >= quest.target) {
        onClaimReward(quest.reward);
        setPlayerState(p => ({
            ...p,
            quests: p.quests.map(q => q.id === questId ? { ...q, isClaimed: true } : q)
        }));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-border w-full max-w-2xl m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-primary">Daily Quests</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-slate-400 mb-8 text-center">
          The gods demand tribute and offer rewards in turn. Complete these tasks to earn their favor.
        </p>
        <div className="space-y-4">
            {playerState.quests.length > 0 ? (
                playerState.quests.map((quest) => (
                    <QuestItem key={quest.id} quest={quest} onClaim={() => handleClaim(quest.id)} />
                ))
            ) : (
                <p className="text-center text-slate-500 italic">No quests available. Return tomorrow.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default DailyQuestsModal;
