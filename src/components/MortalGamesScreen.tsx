// src/components/MortalGamesScreen.tsx
import React from 'react';

const MortalGamesScreen: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold">Mortal Games</h1>
        <p className="text-theme-muted mt-2">Games of chance, free from divine influence.</p>
      </div>
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-theme-border rounded-lg">
          <p className="text-theme-muted">More games coming soon...</p>
      </div>
    </div>
  );
};

export default MortalGamesScreen;
