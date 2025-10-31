// src/components/DevLog.tsx
import React, { useEffect, useRef } from 'react';
import { DevLogEntry } from '../types';

interface DevLogProps {
  logs: DevLogEntry[];
  onClose: () => void;
  onClear: () => void;
}

const DevLog: React.FC<DevLogProps> = ({ logs, onClose, onClear }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new logs are added
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      className="fixed bottom-4 right-4 z-[999] w-full max-w-lg h-1/2 bg-slate-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-theme-border flex flex-col animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center p-3 border-b border-theme-border/50 flex-shrink-0">
        <h3 className="text-lg font-bold text-theme-secondary">Developer Log (Ctrl+Shift+L)</h3>
        <div className="flex items-center gap-2">
           <button 
                onClick={onClear}
                className="text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
            >
                Clear
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      </div>
      
      <div ref={logContainerRef} className="flex-grow p-3 overflow-y-auto">
        {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-500 italic">Log is empty. Waiting for events...</p>
            </div>
        ) : (
            <div className="font-mono text-xs text-slate-300 space-y-2">
            {logs.map((log, index) => (
                <div key={index} className="bg-black/20 p-2 rounded">
                    <span className="text-slate-500 mr-2">{log.timestamp}</span>
                    {typeof log.message === 'string' ? (
                        <span>{log.message}</span>
                    ) : (
                        <pre className="whitespace-pre-wrap text-xs"><code>{JSON.stringify(log.message, null, 2)}</code></pre>
                    )}
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DevLog;
