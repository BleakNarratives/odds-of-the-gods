import React, { useState, useRef, useEffect } from 'react';
import { audioService } from '../../services/audioService';

interface SlotLeverProps {
  onPull: () => void;
  disabled: boolean;
}

const SlotLever: React.FC<SlotLeverProps> = ({ onPull, disabled }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [angle, setAngle] = useState(0);
  const startY = useRef(0);
  const leverRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsPulling(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Add window listeners for dragging outside the element
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPulling) return;
    const deltaY = e.clientY - startY.current;
    const newAngle = Math.min(80, Math.max(0, deltaY * 0.75)); // Clamp between 0 and 80 degrees
    setAngle(newAngle);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling) return;
    const deltaY = e.touches[0].clientY - startY.current;
    const newAngle = Math.min(80, Math.max(0, deltaY * 0.75));
    setAngle(newAngle);
  };


  const handleMouseUp = () => {
    if (!isPulling) return;
    
    // Remove window listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleMouseUp);
    
    if (angle >= 75) { // Pulled almost all the way
      onPull();
      audioService.play('lever-pull');
    }
    
    // Animate back via CSS transition
    setAngle(0);
    setIsPulling(false);
  };
  
  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
        <div className="slot-lever-base">
            <div 
                ref={leverRef}
                className="slot-lever-arm"
                style={{ transform: `rotate(${angle}deg)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="slot-lever-handle" />
            </div>
        </div>
        <p className="text-theme-muted mt-2 text-sm select-none">PULL</p>
    </div>
  );
};

export default SlotLever;