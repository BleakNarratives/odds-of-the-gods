// src/components/AscensionModal.tsx
import React from 'react';
import { AspirantIcon } from './icons/MythicIcons';

interface AscensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'Demigod' | 'Deity';
}

const AscensionModal: React.FC<AscensionModalProps> = ({ isOpen, onClose, tier }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-primary w-full max-w-md m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AspirantIcon className="w-24 h-24 text-theme-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-theme-primary">YOU HAVE ASCENDED</h2>
        <p className="text-slate-300 mt-4 mb-6">
          Your deeds have not gone unnoticed. The gods have elevated your status. You are now a <span className="font-bold text-white">{tier}</span>.
        </p>
        <p className="text-sm text-slate-400 mb-8">New abilities and higher stakes are now available to you.</p>
        <button
          onClick={onClose}
          className="w-full bg-theme-primary text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:bg-amber-500 transition-colors"
        >
          Embrace Your Power
        </button>
      </div>
    </div>
  );
};

export default AscensionModal;
