
import React from 'react';

interface SoulStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const soulPackages = [
  { name: "Mortal's Offering", souls: 100, price: 0.99, color: 'slate' },
  { name: "Demigod's Tribute", souls: 600, price: 4.99, color: 'amber' },
  { name: "Divine Endowment", souls: 3000, price: 19.99, color: 'purple' },
];

const SoulStoreModal: React.FC<SoulStoreModalProps> = ({ isOpen, onClose, onPurchase }) => {
  if (!isOpen) return null;

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
          <h2 className="text-2xl font-bold text-theme-primary">Replenish Your Soul Cache</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-slate-400 mb-8 text-center">
          Even gods require tribute. Bolster your essence to continue your challenge for eternity.
        </p>
        <div className="space-y-4">
          {soulPackages.map((pkg) => {
            const buttonColorClass = {
              slate: 'bg-slate-600 hover:bg-slate-500',
              amber: 'bg-amber-600 hover:bg-amber-500',
              purple: 'bg-purple-600 hover:bg-purple-500',
            }[pkg.color];

            return (
              <div key={pkg.name} className={`bg-black/20 p-4 rounded-lg border border-${pkg.color}-500/50 flex justify-between items-center`}>
                <div>
                  <h3 className={`text-lg font-bold text-${pkg.color}-300`}>{pkg.name}</h3>
                  <p className="text-2xl font-black text-white">{pkg.souls.toLocaleString()} Souls</p>
                </div>
                <button
                  onClick={() => onPurchase(pkg.souls)}
                  className={`text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300 ${buttonColorClass}`}
                >
                  ${pkg.price.toFixed(2)}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-6 text-center">Purchases are for entertainment purposes only and have no real-world value. This is a simulation.</p>
      </div>
    </div>
  );
};

export default SoulStoreModal;