import React from 'react';
import { PlayerState, PantheonInfluenceState, God } from '../types';
import { PANTHEON, GAMES, USER_GOD_TEMPLATE } from '../constants';
import { AspirantIcon } from './icons/MythicIcons';

const StatCard: React.FC<{ title: string; value: string | number; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="bg-slate-900/50 border border-theme-border rounded-lg p-4 text-center">
        <p className="text-sm text-slate-400 uppercase tracking-wider">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
);

const Dashboard: React.FC<{ playerState: PlayerState; pantheonInfluence: PantheonInfluenceState; }> = ({ playerState, pantheonInfluence }) => {
    const { stats, devotion } = playerState;
    const winRate = stats.totalWins + stats.totalLosses > 0 ? ((stats.totalWins / (stats.totalWins + stats.totalLosses)) * 100).toFixed(1) : '0.0';
    
    // Helper function to get the correct god data, including the ascended user god.
    const getGodById = (godId: string): God | null => {
        if (godId === 'user_god' && playerState.hasAscended && playerState.ascendedGodDetails) {
            return {
                ...USER_GOD_TEMPLATE,
                name: playerState.ascendedGodDetails.name,
                title: playerState.ascendedGodDetails.title,
                philosophy: playerState.ascendedGodDetails.philosophy,
            };
        }
        return PANTHEON.find(g => g.id === godId) || null;
    };
    
    const sortedDevotion = Object.entries(devotion)
        .filter(([, value]) => (value as number) > 0)
        .sort((a, b) => (b[1] as number) - (a[1] as number));
        
    const maxDevotion = sortedDevotion.length > 0 ? sortedDevotion[0][1] as number : 1;

    return (
        <div className="container mx-auto px-4 md:px-8 py-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-white mb-8">Player Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatCard title="Total Wagered" value={stats.totalWagered.toFixed(0)} colorClass="text-theme-primary" />
                <StatCard title="Souls Won" value={stats.soulsWon.toFixed(0)} colorClass="text-theme-win" />
                <StatCard title="Souls Lost" value={stats.soulsLost.toFixed(0)} colorClass="text-theme-loss" />
                <StatCard title="Win Rate" value={`${winRate}%`} colorClass="text-theme-secondary" />
            </div>

            <div className="bg-slate-900/50 border border-theme-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Devotion to the Pantheon</h2>
                <div className="space-y-4">
                    {sortedDevotion.length > 0 ? sortedDevotion.map(([godId, value]) => {
                        const god = getGodById(godId);
                        if (!god) return null;
                        const GodIcon = GAMES.find(g => g.godId === god.id)?.Icon || AspirantIcon;
                        const barWidth = ((value as number) / maxDevotion) * 100;
                        const colorHex = {
                            amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b', green: '#22c55e',
                            yellow: '#facc15', blue: '#3b82f6', red: '#ef4444', indigo: '#6366f1',
                            teal: '#14b8a6', primary: '#fca311', secondary: '#e5e5e5'
                        }[god.color] || '#ffffff';

                        return (
                            <div key={godId} className="flex items-center gap-4">
                                <div className="w-1/4 flex items-center gap-2 text-slate-300">
                                    {GodIcon && <GodIcon className="w-6 h-6 flex-shrink-0" style={{color: colorHex}}/>}
                                    <span className="font-bold truncate">{god.name}</span>
                                </div>
                                <div className="w-3/4 bg-slate-700 rounded-full h-6">
                                    <div 
                                        className="h-6 rounded-full flex items-center justify-end pr-2 text-sm font-bold text-slate-900"
                                        style={{ width: `${barWidth}%`, backgroundColor: colorHex, transition: 'width 0.5s ease-out' }}
                                    >
                                        {(value as number).toFixed(0)}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-center text-slate-500 italic">Your devotion has yet to be pledged.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;