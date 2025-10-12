import React from 'react';
import { God, ProvidenceEvent } from '../types';
import { SoulIcon } from './icons/MythicIcons';
import { GAMES } from '../constants';

interface DivineProvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  event: ProvidenceEvent | null;
}

const DivineProvidenceModal: React.FC<DivineProvidenceModalProps> = ({ isOpen, onClose, onClaim, event }) => {
  if (!isOpen || !event) return null;

  const GodIcon = GAMES.find(g => g.godId === event.god.id)?.Icon || SoulIcon;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl border w-full max-w-md m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop cosmic-background"
        style={{ borderColor: event.god.color, boxShadow: `0 0 25px ${event.god.color}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <GodIcon className="w-20 h-20 mb-4" style={{ color: event.god.color }} />
          <h2 className="text-2xl font-bold" style={{ color: event.god.color }}>A God Intervenes!</h2>
          <p className="text-slate-300 mt-4 mb-6">
            {event.message}
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 w-full mb-8">
             {event.boon && (
                <div className="flex items-center justify-center gap-4">
                    <GodIcon className="w-10 h-10" style={{ color: event.god.color }}/>
                    <div>
                        <p className="text-sm text-slate-400">You receive the boon:</p>
                        <p className="text-xl font-bold" style={{ color: event.god.color }}>{event.boon.type.replace('_', ' ').toLocaleUpperCase()}</p>
                    </div>
                </div>
            )}
             {event.soulGrant && (
                <div className="flex items-center justify-center gap-4">
                    <SoulIcon className="w-10 h-10 text-theme-souls" />
                    <div>
                        <p className="text-sm text-slate-400">You receive</p>
                        <p className="text-2xl font-bold text-theme-souls">{event.soulGrant} Souls</p>
                    </div>
                </div>
            )}
          </div>

          <button
            onClick={onClaim}
            className="w-full text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:brightness-125 transition-all duration-300"
            style={{ backgroundColor: event.god.color }}
          >
            Accept Blessing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivineProvidenceModal;
