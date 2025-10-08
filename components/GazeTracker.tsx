import React from 'react';
import { useEffect, useRef } from 'react';

const RAGE_TAP_THRESHOLD_MS = 500; // ms between taps
const RAGE_TAP_COUNT = 3; // number of taps to trigger
const RAGE_TAP_RADIUS = 30; // pixels
const HESITATION_THRESHOLD_MS = 3000; // 3 seconds of inactivity

interface Click {
  x: number;
  y: number;
  time: number;
}

interface GazeTrackerProps {
  onBehaviorLog: (message: string) => void;
}

const GazeTracker: React.FC<GazeTrackerProps> = ({ onBehaviorLog }) => {
  const clickHistory = useRef<Click[]>([]);
  const hesitationTimer = useRef<number | null>(null);
  const lastInteractionTime = useRef<number>(Date.now());
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const resetHesitationTimer = () => {
      const { x, y } = lastPosition.current;
      if (Date.now() - lastInteractionTime.current > HESITATION_THRESHOLD_MS) {
          onBehaviorLog(`Hesitation ended. Focus at (${Math.round(x)}, ${Math.round(y)})`);
      }

      if (hesitationTimer.current) {
        clearTimeout(hesitationTimer.current);
      }
      
      hesitationTimer.current = window.setTimeout(() => {
        onBehaviorLog(`Hesitation detected. Last focus at (${Math.round(x)}, ${Math.round(y)})`);
      }, HESITATION_THRESHOLD_MS);
      
      lastInteractionTime.current = Date.now();
    };
    
    const handleInteraction = (x: number, y: number) => {
      lastPosition.current = { x, y };
      resetHesitationTimer();
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      const newClick = { x: e.clientX, y: e.clientY, time: now };
      
      const recentClicks = [
        ...clickHistory.current,
        newClick,
      ].filter(c => now - c.time < RAGE_TAP_THRESHOLD_MS);
      
      clickHistory.current = recentClicks;

      if (recentClicks.length >= RAGE_TAP_COUNT) {
        const firstClick = recentClicks[0];
        const isWithinRadius = recentClicks.every(
            c => Math.hypot(c.x - firstClick.x, c.y - firstClick.y) < RAGE_TAP_RADIUS
        );
        if (isWithinRadius) {
            onBehaviorLog(`Rage Tap detected at (${Math.round(newClick.x)}, ${Math.round(newClick.y)})`);
            clickHistory.current = [];
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);
    
    resetHesitationTimer();


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      if (hesitationTimer.current) clearTimeout(hesitationTimer.current);
    };
  }, [onBehaviorLog]);

  // This component renders nothing.
  return null;
};

export default GazeTracker;