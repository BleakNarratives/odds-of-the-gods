import React from 'react';
import Modal from './Modal';
import { GodId } from '../../types';
import GodIcon from '../icons/GodIcon';
import { PANTHEON } from '../../constants';


interface EquiNexModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
    targetGodId: GodId;
}

const EquiNexModal: React.FC<EquiNexModalProps> = ({ isOpen, onClose, reason, targetGodId }) => {
    
    const god = PANTHEON.find(g => g.id === 'anubis');

    if (!god) return null;

    let title = "EquiNex Warning";
    let message = "A system anomaly has been detected. Please ensure smooth interaction.";
    let icon = "⚠️";

    switch (reason) {
        case 'RAPID_INPUT_DETECTED':
            title = "EquiLex Compliance Breach";
            message = "Your input speed is highly erratic. The system suspects an attempt to circumvent the UI/UX consistency protocols. **ModMind** requires your actions be deliberate.";
            icon = "🛑";
            break;
        case 'UI_STALL_DETECTED':
            title = "ModMind UX Consistency Check";
            message = "We detect a long period of inactivity on the current screen. Is the UI/UX not serving your needs? A prompt response ensures a smooth cross-platform experience.";
            icon = "💡";
            break;
        default:
            break;
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
        >
            <div className="flex flex-col items-center space-y-6 p-4 text-center">
                
                <div 
                    className="w-20 h-20 flex items-center justify-center rounded-full text-4xl shadow-inner" 
                    style={{ backgroundColor: god.color, boxShadow: `0 0 15px ${god.color}` }}
                >
                    <GodIcon godId={god.id} className="w-12 h-12" color='var(--color-background)' />
                </div>
                
                <h3 className="text-3xl font-cinzel font-bold text-theme-secondary" style={{ color: god.color }}>
                    {icon} {god.name} ({title}) {icon}
                </h3>
                
                <p className="text-lg text-theme-base">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 text-lg font-extrabold rounded-lg transition duration-300 hover:bg-theme-primary/80"
                    style={{ backgroundColor: god.color, color: 'var(--color-background)' }}
                >
                    Acknowledge ModMind Protocol
                </button>
            </div>
        </Modal>
    );
};

export default EquiNexModal;