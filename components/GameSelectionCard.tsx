import React from 'react';
import { Game } from '../types';

interface GameSelectionCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  color: string;
}

const GameSelectionCard: React.FC<GameSelectionCardProps> = ({ game, onSelectGame, color }) => {

    const hoverBorderClass = {
        amber: 'hover:border-amber-400',
        rose: 'hover:border-rose-400',
        slate: 'hover:border-slate-400',
        green: 'hover:border-green-400',
        yellow: 'hover:border-yellow-400',
        blue: 'hover:border-blue-400',
        red: 'hover:border-red-400',
        indigo: 'hover:border-indigo-400',
        teal: 'hover:border-teal-400',
      }[color] || 'hover:border-gray-400';

    const colorHex = {
        amber: '#f59e0b',
        rose: '#f43f5e',
        slate: '#64748b',
        green: '#22c55e',
        yellow: '#facc15',
        blue: '#3b82f6',
        red: '#ef4444',
        indigo: '#6366f1',
        teal: '#14b8a6',
    }[color] || '#6b7280';


    return (
        <div
            className={`bg-gradient-to-br from-slate-900/80 to-black/50 rounded-lg shadow-lg border border-slate-800 p-4 flex flex-col ${hoverBorderClass} transition-all duration-300 cursor-pointer group`}
            onClick={() => onSelectGame(game)}
        >
            <div className="flex items-center gap-4 mb-3">
                <game.Icon className="w-12 h-12 flex-shrink-0" style={{ color: colorHex }}/>
                <div>
                    <h3 className="text-xl font-bold text-white">{game.name}</h3>
                    <p className="text-sm text-slate-400">{game.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center my-3 text-xs">
                <div>
                    <div className="text-slate-500">Wager</div>
                    <div className="font-bold font-mono text-amber-400">{game.minBet}-{game.maxBet}</div>
                </div>
                <div>
                    <div className="text-slate-500">Payout</div>
                    <div className="font-bold font-mono text-green-400">{game.payoutMultiplier}x</div>
                </div>
                <div>
                    <div className="text-slate-500">Chance</div>
                    <div className="font-bold font-mono text-purple-400">{(game.winChance * 100).toFixed(0)}%</div>
                </div>
            </div>
            
            <button
            className={`w-full text-white font-bold py-2 px-4 rounded-md text-md uppercase tracking-widest transition-colors duration-300 mt-auto`} 
            style={{backgroundColor: colorHex, boxShadow: `0 0 10px ${colorHex}`}}
            >
            Play
            </button>
        </div>
    );
};

export default GameSelectionCard;
