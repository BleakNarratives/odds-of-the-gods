import React, { useState, useEffect } from 'react';
import { ArchitectIcon } from './icons/MythicIcons';
import { getSurveyQuestion } from '../services/geminiService';
import { SurveyQuestion } from '../types';

interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questionData, setQuestionData] = useState<SurveyQuestion | null>(null);
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            setIsCompleted(false);
            setError('');
            getSurveyQuestion()
                .then(data => {
                    setQuestionData(data);
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to load survey. The Architect is busy.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen]);

    const handleAnswerClick = () => {
        setIsCompleted(true);
        setTimeout(() => {
            onComplete();
        }, 2000); // Wait 2s before calling complete to show message
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900/80 rounded-lg shadow-2xl shadow-cyan-500/20 border border-cyan-500/50 w-full max-w-lg m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <ArchitectIcon className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-xl font-bold text-cyan-300">Development Inquiry</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="min-h-[200px] flex items-center justify-center">
                    {isLoading && (
                        <div className="flex flex-col items-center gap-4 text-cyan-300">
                             <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                             <p>Querying the data stream...</p>
                        </div>
                    )}
                    {error && <p className="text-theme-loss">{error}</p>}
                    
                    {!isLoading && !error && questionData && !isCompleted && (
                        <div className="w-full text-center animate-fade-in">
                            <p className="text-lg text-slate-200 mb-6">{questionData.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {questionData.answers.map((answer, index) => (
                                    <button
                                        key={index}
                                        onClick={handleAnswerClick}
                                        className="w-full bg-slate-700/50 text-slate-200 font-semibold py-3 px-4 rounded-md hover:bg-cyan-600/50 hover:border-cyan-500 border border-slate-600 transition-colors"
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="text-center animate-fade-in">
                            <h3 className="text-2xl font-bold text-theme-win">Transmission Received</h3>
                            <p className="text-slate-300 mt-2">Thank you. Your feedback has been logged.</p>
                            <p className="text-lg font-bold text-theme-primary mt-4">+25 Souls have been credited to your account.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurveyModal;