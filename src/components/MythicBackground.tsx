// src/components/MythicBackground.tsx
import React from 'react';

const MythicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-theme-background" />
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-theme-primary/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-400/10 via-transparent to-transparent opacity-50" />
    </div>
  );
};

export default MythicBackground;
