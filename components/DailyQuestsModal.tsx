import React from 'react';
import { DailyQuest } from '../types';
import { SoulIcon } from './icons/MythicIcons';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: DailyQuest[];
  onClaim: (questId: string) => void;
  onClaimAll: () => void;
}

const QuestItem: React.FC<{ quest: DailyQuest; onClaim: (id: string) => void }> = ({ quest, onClaim }) => {
    const progress = Math.min((quest.currentValue / quest.targetValue) * 100, 100);
    const isReadyToClaim = quest.isCompleted && !quest.isClaimed;

    return (
        <div className={`bg-black/20 p-4 rounded-lg border ${isReadyToClaim ? 'border-theme-primary' : 'border-theme-border/50'}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-theme-secondary">{quest.description}</p>
                    <p className="text-xs text-theme-muted">Reward: {quest.reward} Souls</p>
                </div>
                {isReadyToClaim && (
                    <button onClick={() => onClaim(quest.id)} className="bg-theme-primary text-theme-background font-bold py-1 px-3 rounded-md text-sm hover:bg-amber-500 transition-colors">
                        Claim
                    </button>
                )}
                {quest.isClaimed && (
                     <span className="text-theme-win font-bold text-sm">Claimed</span>
                )}
            </div>
            {!quest.isClaimed && (
                 <div className="mt-2">
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-theme-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-right text-xs text-theme-muted mt-1">{Math.floor(quest.currentValue)} / {quest.targetValue}</p>
                </div>
            )}
        </div>
    );
};


const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({ isOpen, onClose, quests, onClaim, onClaimAll }) => {
  if (!isOpen) return null;

  const canClaimAll = quests.some(q => q.isCompleted && !q.isClaimed);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-border w-full max-w-lg m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop cosmic-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-primary">Thoth's Daily Edicts</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-slate-400 mb-6 text-center">
          Prove your worth to the pantheon. These tasks, dictated by the Scribe of Gods, offer rewards for the diligent.
        </p>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {quests.length > 0 ? (
                quests.map(q => <QuestItem key={q.id} quest={q} onClaim={onClaim} />)
            ) : (
                <p className="text-center text-theme-muted italic">No edicts at this time.</p>
            )}
        </div>
         <button
            onClick={onClaimAll}
            disabled={!canClaimAll}
            className="w-full mt-6 bg-theme-win/90 text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-theme-win transition-colors duration-300"
          >
            Claim All Completed
          </button>
      </div>
    </div>
  );
};

export default DailyQuestsModal;
