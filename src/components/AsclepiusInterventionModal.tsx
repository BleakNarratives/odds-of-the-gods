// src/components/AsclepiusInterventionModal.tsx
import React from 'react';
import Modal from './modals/Modal';

interface AsclepiusInterventionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AsclepiusInterventionModal: React.FC<AsclepiusInterventionModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Asclepius' Intervention">
            <div className="p-4 text-center">
                <p className="text-lg text-theme-win">A divine intervention has saved you from ruin!</p>
                <p className="text-slate-400 mt-2">A portion of your lost souls have been restored.</p>
            </div>
        </Modal>
    );
};

export default AsclepiusInterventionModal;
