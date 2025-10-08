import React, { useMemo } from 'react';
import { GAMES } from '../constants';

const MythicBackground: React.FC = () => {
  const streamItems = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const game = GAMES[i % GAMES.length];
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `scale(${Math.random() * 0.5 + 0.2})`,
        animationDuration: `${Math.random() * 20 + 15}s`,
        animationDelay: `${Math.random() * -30}s`,
      };
      return {
        id: i,
        Icon: game.Icon,
        style,
        className: 'w-16 h-16 opacity-10 animate-float'
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {streamItems.map(({ id, Icon, style, className }) => (
        <div key={id} className="absolute" style={style}>
          <Icon className={className} />
        </div>
      ))}
    </div>
  );
};

export default MythicBackground;