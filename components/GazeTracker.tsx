import React, { useEffect, useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

interface GazeTrackerProps {
    onBehaviorLog: (eventType: string, data: any) => void;
}

const behaviorHistory: { type: string, timestamp: number }[] = [];

const RAPID_CLICK_THRESHOLD = 5; // Clicks within 3 seconds
const FOCUS_TIME_THRESHOLD = 60000; // 60 seconds of continuous focus on a game

const GazeTracker: React.FC<GazeTrackerProps> = ({ onBehaviorLog }) => {
    const [clickCount, setClickCount] = useState(0);

    const logBehavior = useCallback((type: string, data: any = {}) => {
        const timestamp = Date.now();
        behaviorHistory.push({ type, timestamp });
        
        if (behaviorHistory.length > 500) {
            behaviorHistory.shift();
        }

        onBehaviorLog(type, { ...data, timestamp });
    }, [onBehaviorLog]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            logBehavior('USER_CLICK', { x: e.clientX, y: e.clientY });
            setClickCount(prev => prev + 1);
        };

        window.addEventListener('click', handleClick);
        
        const clickTimer = setTimeout(() => {
            setClickCount(0);
        }, 3000);
        
        if (clickCount >= RAPID_CLICK_THRESHOLD) {
            logBehavior('EQUINEX_ALERT', { reason: 'RAPID_INPUT_DETECTED' });
            audioService.play('lose');
            setClickCount(0); // Reset after firing
        }

        return () => {
            window.removeEventListener('click', handleClick);
            clearTimeout(clickTimer);
        };
    }, [logBehavior, clickCount]);
    
    useEffect(() => {
        const checkFocus = setInterval(() => {
            const lastGameAction = behaviorHistory.filter(h => h.type.startsWith('GAME_')).pop();
            const now = Date.now();

            if (lastGameAction && (now - lastGameAction.timestamp) > FOCUS_TIME_THRESHOLD) {
                logBehavior('MODMIND_REMINDER', { reason: 'UI_STALL_DETECTED' });
            }
        }, 15000);

        return () => clearInterval(checkFocus);
    }, [logBehavior]);
    
    return null;
};

export default GazeTracker;