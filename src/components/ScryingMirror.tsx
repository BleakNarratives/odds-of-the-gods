// src/components/ScryingMirror.tsx
import React from 'react';

const ScryingMirror: React.FC = () => {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-4xl font-bold text-cyan-300">Scrying Mirror</h1>
            <p className="text-slate-400 mt-4">Gaze into the mirror to see the replays of your most glorious victories and devastating defeats.</p>
            <div className="mt-8 p-10 border-2 border-dashed border-theme-border rounded-lg">
                <p className="text-slate-500">Feature in development...</p>
            </div>
        </div>
    );
};

export default ScryingMirror;
