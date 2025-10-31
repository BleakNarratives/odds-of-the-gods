
import React, { useState, useRef } from 'react';

interface DiceThrowAreaProps {
  onThrow: () => void;
  disabled: boolean;
  color: string;
}

const DiceThrowArea: React.FC<DiceThrowAreaProps> = ({ onThrow, disabled, color }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // FIX: Use handleMouseMove which correctly extracts clientY from the MouseEvent.
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);
  };

  const handleMove = (y: number) => {
    if (!isDragging) return;
    const deltaY = y - startY.current;
    const progress = Math.min(1, Math.max(0, deltaY / 100)); // 100px drag to full power
    setDragProgress(progress);
  };
  
  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);

  const handleEnd = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleEnd);

    if (dragProgress >= 0.9) { // 90% pulled
        onThrow();
    }
    setIsDragging(false);
    setDragProgress(0);
  };

  const sliderStyle: React.CSSProperties = {
    '--slider-color': color,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`dice-throw-area ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      style={sliderStyle}
    >
      <div 
        className="dice-throw-indicator"
        style={{ height: `${dragProgress * 100}%` }}
      />
      <div className="relative z-10 text-center">
        <p className="text-white font-bold text-2xl drop-shadow-md">
            {isDragging ? 'RELEASE TO THROW' : 'DRAG TO THROW'}
        </p>
        <p className="text-theme-muted text-sm">Pull down to charge your throw</p>
      </div>
    </div>
  );
};

export default DiceThrowArea;