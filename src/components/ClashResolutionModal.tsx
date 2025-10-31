// src/components/ClashResolutionModal.tsx
import React from 'react';
import { God, Stance, ClashChallenge } from '../types';
import { PANTHEON } from '../constants';
import Modal from './modals/Modal';
import GodIcon from './icons/GodIcon';

interface ClashResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    outcome: 'win' | 'loss' | 'tie';
    wager: number;
    playerStance: Stance;
    opponentStance: Stance;
    opponentGodId: GodId;
    opponentName: string;
  } | null;
}

const getStanceResult = (player: Stance, opponent: Stance) => {
    if (player === opponent) return "Both chose the same path; a stalemate.";
    if (player === 'Aggressive' && opponent === 'Deceptive') return "Your aggression overcame their deception!";
    if (player === 'Aggressive' && opponent === 'Defensive') return "Your aggression was blunted by their defense.";
    if (player === 'Deceptive' && opponent === 'Defensive') return "Your deception bypassed their defenses!";
    if (player === 'Deceptive' && opponent === 'Aggressive') return "Your deception was crushed by their aggression.";
    if (player === 'Defensive' && opponent === 'Aggressive') return "Your defense weathered their aggression!";
    if (player === 'Defensive' && opponent === 'Deceptive') return "Your defense was fooled by their deception.";
    return "";
};

const ClashResolutionModal: React.FC<ClashResolutionModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  const opponentGod = PANTHEON.find(g => g.id === result.opponentGodId);

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Clash of Fates Resolved"
        borderColor={result.outcome === 'win' ? 'var(--color-win)' : (result.outcome === 'loss' ? 'var(--color-loss)' : 'var(--color-border)')}
    >
      <div className="text-center p-4">
        <h2 className={`text-4xl font-bold mb-4 ${result.outcome === 'win' ? 'text-theme-win' : 'text-theme-loss'}`}>
          {result.outcome.toUpperCase()}
        </h2>
        <p className="text-lg text-slate-300 mb-6">
          {result.outcome === 'win' && `You have claimed ${result.wager} souls from ${result.opponentName}!`}
          {result.outcome === 'loss' && `${result.opponentName} has claimed ${result.wager} souls from you.`}
          {result.outcome === 'tie' && `Your wager of ${result.wager} souls has been returned.`}
        </p>

        <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg">
            <div>
                <p className="font-bold text-slate-200">YOU</p>
                <p className="text-xl font-semibold text-theme-primary">{result.playerStance}</p>
            </div>
             <div>
                <p className="font-bold text-slate-400">{result.opponentName}</p>
                <p className="text-xl font-semibold" style={{color: opponentGod?.color}}>{result.opponentStance}</p>
            </div>
        </div>

        <p className="italic text-slate-400 mt-4">{getStanceResult(result.playerStance, result.opponentStance)}</p>

        <button
          onClick={onClose}
          className="w-full mt-8 bg-theme-primary text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase hover:bg-amber-500 transition-colors"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default ClashResolutionModal;
