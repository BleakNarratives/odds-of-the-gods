// src/components/DivineProvidenceModal.tsx
import React from 'react';
import Modal from './modals/Modal';

interface DivineProvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DivineProvidenceModal: React.FC<DivineProvidenceModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Divine Providence">
        <div className="p-4 text-center">
            <p className="text-theme-muted">You have received a blessing!</p>
            <p className="text-lg font-bold text-theme-win mt-2">+500 Souls</p>
        </div>
    </Modal>
  );
};

export default DivineProvidenceModal;
