import React, { useState } from 'react';
import { God } from '../types';
import { GAMES, ASPIRANT_GOD } from '../constants';
import { AspirantIcon } from './icons/MythicIcons';

interface GodCardProps {
    god: God;
    onSelectCult: (godId: string) => void;
    personalizedImage?: string;
    onPersonalizeClick: (god: God) => void;
    onAscendClick: () => void;
    souls: number;
}

const GodCard: React.FC<GodCardProps> = ({ god, onSelectCult, personalizedImage, onPersonalizeClick, onAscendClick, souls }) => {
    const [style, setStyle] = useState({});
    
    const isAspirant = god.id === 'aspirant';
    const canAscend = souls >= 10000;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left - width / 2) / 25;
        const y = -(clientY - top - height / 2) / 25;
        setStyle({ transform: `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.05, 1.05, 1.05)` });
    };

    const handleMouseLeave = () => {
        setStyle({ transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)' });
    };

    const colorClass = {
        amber: 'border-amber-500 hover:bg-amber-900/40',
        rose: 'border-rose-500 hover:bg-rose-900/40',
        slate: 'border-slate-500 hover:bg-slate-900/40',
        green: 'border-green-500 hover:bg-green-900/40',
        yellow: 'border-yellow-500 hover:bg-yellow-900/40',
        blue: 'border-blue-500 hover:bg-blue-900/40',
        red: 'border-red-500 hover:bg-red-900/40',
        indigo: 'border-indigo-500 hover:bg-indigo-900/40',
        teal: 'border-teal-500 hover:bg-teal-900/40',
        primary: 'border-theme-primary hover:bg-theme-primary/20',
        secondary: 'border-theme-secondary hover:bg-theme-secondary/20',
    }[god.color];

    const buttonColorClass = {
        amber: 'bg-amber-600 group-hover:bg-amber-500',
        rose: 'bg-rose-600 group-hover:bg-rose-500',
        slate: 'bg-slate-600 group-hover:bg-slate-500',
        green: 'bg-green-600 group-hover:bg-green-500',
        yellow: 'bg-yellow-600 group-hover:bg-yellow-500',
        blue: 'bg-blue-600 group-hover:bg-blue-500',
        red: 'bg-red-600 group-hover:bg-red-500',
        indigo: 'bg-indigo-600 group-hover:bg-indigo-500',
        teal: 'bg-teal-600 group-hover:bg-teal-500',
        primary: 'bg-theme-primary group-hover:bg-amber-500',
        secondary: 'bg-theme-secondary group-hover:bg-gray-300',
    }[god.color];

    const textColorClass = {
        amber: 'text-amber-400',
        rose: 'text-rose-400',
        slate: 'text-slate-400',
        green: 'text-green-400',
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
        red: 'text-red-400',
        indigo: 'text-indigo-400',
        teal: 'text-teal-400',
        primary: 'text-theme-primary',
        secondary: 'text-theme-secondary',
    }[god.color] || 'text-slate-400';

    const GodIcon = isAspirant ? AspirantIcon : (GAMES.find(g => g.godId === god.id) || {}).Icon || AspirantIcon;
    const canPersonalize = !['aspirant', 'user_god'].includes(god.id);

    return (
        <div
            className={`card-3d bg-black/30 rounded-lg shadow-2xl border-2 ${colorClass} p-6 flex flex-col text-center group relative`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            {canPersonalize && (
                 <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPersonalizeClick(god);
                    }}
                    title="Offer a new face for this god"
                    className="absolute top-2 right-2 p-1 bg-slate-800/50 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-all z-10"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
            <div className="card-3d-content flex flex-col items-center flex-grow">
                 {personalizedImage ? (
                    <img src={`data:image/png;base64,${personalizedImage}`} alt={god.name} className="w-20 h-20 mb-4 rounded-full object-cover" />
                ) : (
                    <GodIcon className={`w-20 h-20 mb-4 ${textColorClass}`} />
                )}
                <h2 className="text-2xl font-bold text-white">{god.name}</h2>
                <p className="text-sm text-slate-400 mb-4">{god.title}</p>
                <p className="text-slate-300 text-sm flex-grow mb-6">"{god.philosophy}"</p>
                
                {isAspirant ? (
                    <button
                        onClick={onAscendClick}
                        disabled={!canAscend}
                        className={`w-full ${canAscend ? 'bg-theme-primary shimmer-button' : 'bg-slate-600'} text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-lg uppercase tracking-wider disabled:cursor-not-allowed`}
                    >
                        {canAscend ? 'Ascend' : `Need 10,000 Souls`}
                    </button>
                ) : (
                    <button
                        onClick={() => onSelectCult(god.id)}
                        className={`w-full ${buttonColorClass} text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-lg uppercase tracking-wider`}
                    >
                        Pledge
                    </button>
                )}

            </div>
        </div>
    );
};

export default GodCard;
