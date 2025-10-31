import React from 'react';

interface SaveStateModalProps {
  onContinue: () => void;
  onFlush: () => void;
}

const Fly: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="fly" style={style} />
);

const SaveStateModal: React.FC<SaveStateModalProps> = ({ onContinue, onFlush }) => {
  const flies = Array.from({ length: 5 }).map((_, i) => ({
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    animation: `buzz-${(i % 2) + 1} ${Math.random() * 4 + 4}s linear infinite`,
    animationDelay: `${Math.random() * 2}s`,
  }));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] animate-fade-in">
      <div className="restroom-tile-bg rounded-lg shadow-2xl w-full max-w-lg m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop text-center relative">
        {flies.map((style, i) => <Fly key={i} style={style} />)}
        
        <div className="relative z-10">
          <h2 className="text-4xl text-slate-800 filthy-font">A Filthy Remnant...</h2>
          <p className="text-slate-700 font-semibold mt-4 mb-6">
            The Fates have found a... soiled memory of your journey. Do you dare continue from where you left off, or would you rather flush it all away and begin anew?
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onContinue}
              className="flex-1 bg-[#6b4f2c] text-yellow-100 font-bold py-3 px-6 rounded-md border-2 border-[#4a371d] hover:bg-[#856d4d] transition-colors duration-300"
            >
              Continue Filthy Pilgrimage
            </button>
            <button
              onClick={onFlush}
              className="flex-1 bg-[#9ca3af] text-slate-800 font-bold py-3 px-6 rounded-md border-2 border-[#4b5563] hover:bg-[#6b7280] transition-colors duration-300"
            >
              Flush It All Away
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveStateModal;