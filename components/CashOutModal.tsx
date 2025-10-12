import React from 'react';

interface CashOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const CashOutModal: React.FC<CashOutModalProps> = ({ isOpen, onClose, balance }) => {
  if (!isOpen) return null;

  const soulValue = 0.10; // 1 Soul = $0.10
  const usdBalance = balance * soulValue;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-border w-full max-w-md m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop cosmic-background"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-primary">Redeem Souls</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6 text-center">
          <label className="block text-sm font-medium text-slate-400 mb-2">Your Soul Balance</label>
          <div className="text-4xl font-bold text-theme-souls">{balance.toFixed(2)}</div>
          <p className="text-lg text-slate-300 mt-2">= <span className="font-bold text-theme-win">${usdBalance.toFixed(2)} USD</span></p>
          <p className="text-xs text-slate-500 mt-1">Exchange Rate: 1 Soul = ${soulValue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">Minimum for redemption: $20.00</p>
        </div>

        <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-2">Souls to Redeem</label>
            <input type="number" id="amount" defaultValue={balance.toFixed(0)} className="w-full bg-slate-800 border border-theme-border rounded-md p-3 focus:ring-2 focus:ring-theme-primary focus:outline-none transition-shadow"/>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          Redemptions are processed within 24 hours. A confirmation will be sent to your registered email.
        </p>

        <button 
          onClick={onClose}
          disabled={usdBalance < 20}
          className="w-full bg-theme-win/90 text-theme-background font-bold py-3 px-6 rounded-lg text-lg tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-theme-win transition-colors duration-300"
        >
          {usdBalance < 20 ? 'Minimum Not Met' : 'Confirm Redemption'}
        </button>
      </div>
    </div>
  );
};

export default CashOutModal;
