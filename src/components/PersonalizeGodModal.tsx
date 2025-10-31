// src/components/PersonalizeGodModal.tsx
import React from 'react';
import Modal from './modals/Modal';

interface PersonalizeGodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonalizeGodModal: React.FC<PersonalizeGodModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Personalize God">
        <div className="p-4 text-center">
            <p className="text-theme-muted">This feature is coming soon.</p>
        </div>
    </Modal>
  );
};

export default PersonalizeGodModal;
