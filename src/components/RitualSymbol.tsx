// src/components/RitualSymbol.tsx
import React from 'react';

interface RitualSymbolProps {
    godId: string;
    size?: number;
    className?: string;
}

const RitualSymbol: React.FC<RitualSymbolProps> = ({ godId, size = 100, className }) => {
  // A generic animated symbol for rituals
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 border-2 border-theme-primary rounded-full animate-pulse"></div>
      <div className="absolute inset-2 border border-theme-primary/50 rounded-full animate-spin-slow"></div>
       <div className="absolute inset-4 flex items-center justify-center text-theme-primary text-4xl font-bold">
         {godId.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default RitualSymbol;
