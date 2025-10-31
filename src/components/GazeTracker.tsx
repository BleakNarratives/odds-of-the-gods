// src/components/GazeTracker.tsx
import React, { useEffect, useRef } from 'react';

interface GazeTrackerProps {
  onFocusChange: (focusLevel: number) => void;
  isActive: boolean;
}

const GazeTracker: React.FC<GazeTrackerProps> = ({ onFocusChange, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // In a real implementation, this would involve loading a face tracking library
    // like face-api.js or MediaPipe, getting webcam access, and running a detection loop.
    // For this prototype, we will just simulate focus changes.

    let intervalId: NodeJS.Timeout | null = null;

    if (isActive) {
      // Simulate fluctuating focus
      intervalId = setInterval(() => {
        const simulatedFocus = 0.5 + (Math.random() - 0.5) * 0.8; // Random value between 0.1 and 0.9
        onFocusChange(simulatedFocus);
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, onFocusChange]);

  return (
    <div className="fixed bottom-4 left-4 z-50 w-32 h-24 bg-black border border-theme-border rounded-lg overflow-hidden opacity-50">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <p className="text-xs text-white">Gaze Tracking Sim</p>
      </div>
    </div>
  );
};

export default GazeTracker;
