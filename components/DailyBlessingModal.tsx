
import React from 'react';
import { ThothIcon, SoulIcon } from './icons/MythicIcons';

interface DailyBlessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  blessingAmount: number;
}

const DailyBlessingModal: React.FC<DailyBlessingModalProps> = ({ isOpen, onClose, onClaim, blessingAmount }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-border w-full max-w-md m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop cosmic-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <ThothIcon className="w-20 h-20 text-theme-primary mb-4" />
          <h2 className="text-2xl font-bold text-theme-primary">A Daily Blessing from Thoth</h2>
          <p className="text-slate-300 mt-4 mb-6">
            The Scribe of the Gods notes your return. Your continued presence in this cosmic game is a testament to your ambition. Accept this offering to aid your journey.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-center gap-4 mb-8">
            <SoulIcon className="w-10 h-10 text-theme-souls" />
            <div>
              <p className="text-sm text-slate-400">You receive</p>
              <p className="text-2xl font-bold text-theme-souls">{blessingAmount} Souls</p>
            </div>
          </div>
          <button
            onClick={onClaim}
            className="w-full bg-theme-primary text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:bg-amber-500 transition-colors duration-300"
          >
            Claim Blessing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyBlessingModal;