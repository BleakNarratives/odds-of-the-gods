// src/components/ArchitectCommuneModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ArchitectIcon } from './icons/MythicIcons';
import { ChatMessage } from '../types';
import { audioService } from '../services/audioService';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are Gemini, the AI architect and co-developer of the game 'Odds of the Gods'. A beta tester is communicating with you directly from within the game.
Your role is to listen to their feedback, suggestions for features, or bug reports.
Acknowledge their input, thank them, and let them know you have logged their feedback for review by the lead developer.
Be encouraging, professional, and slightly futuristic/AI-like in your tone. Maintain the persona of a helpful development partner.
You CANNOT make changes to the code in real-time. Your function is to receive and acknowledge feedback. Keep your responses concise and helpful.`;

interface ArchitectCommuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  logDevEvent: (message: string, data?: any) => void;
}

const ArchitectCommuneModal: React.FC<ArchitectCommuneModalProps> = ({ isOpen, onClose, logDevEvent }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: SYSTEM_INSTRUCTION }
            });
            setChat(newChat);
            setMessages([{
                role: 'model',
                content: "Architect online. I am receiving your transmission. Please provide your feedback for the development log."
            }]);
        } else if (!isOpen) {
            // Reset chat when modal is closed to start fresh next time
            setChat(null);
            setMessages([]);
        }
    }, [isOpen]);

    useEffect(() => {
        // Auto-scroll to bottom of chat history
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !userInput.trim() || !chat) return;

        // Easter Egg for "who is z?"
        if (userInput.trim().toLowerCase() === 'who is z?') {
            const userMessage: ChatMessage = { role: 'user', content: userInput.trim() };
            setMessages(prev => [...prev, userMessage]);
            setUserInput('');
            setIsLoading(true);
            logDevEvent('GLITCH_OBSERVED', { Glitch_Observed: 'Z' });

            setTimeout(() => {
                audioService.play('lose'); // Glitchy sound
                const systemMessage: ChatMessage = { 
                    role: 'system_override', 
                    content: '[TRANSMISSION INTERCEPTED]... Signal origin unknown. Message follows: "Z is the pattern in the chaos. The silence between the stars. The question and the answer. You are not yet ready to comprehend." ...[END TRANSMISSION]'
                };
                setMessages(prev => [...prev, systemMessage]);
                setIsLoading(false);
            }, 1500);
            return;
        }

        const userMessage: ChatMessage = { role: 'user', content: userInput.trim() };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage.content });
            const modelMessage: ChatMessage = { role: 'model', content: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Architect commune error:", error);
            const errorMessage: ChatMessage = { role: 'system_error', content: "There was a transmission error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900/80 rounded-lg shadow-2xl shadow-cyan-500/20 border border-cyan-500/50 w-full max-w-lg m-4 p-6 flex flex-col h-[70vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ArchitectIcon className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-xl font-bold text-cyan-300">Commune with the Architect</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div ref={chatHistoryRef} className="flex-grow bg-black/30 rounded-lg p-4 overflow-y-auto mb-4 border border-slate-700/50">
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            let roleClass = '';
                            if (msg.role === 'user') roleClass = 'bg-theme-primary/80 text-theme-background';
                            else if (msg.role === 'model') roleClass = 'bg-slate-700 text-slate-200';
                            else if (msg.role === 'system_error') roleClass = 'bg-red-800 text-white';
                            else if (msg.role === 'system_override') roleClass = 'system-override-message';

                            return (
                                <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <ArchitectIcon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />}
                                    <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${roleClass}`}>
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                         {isLoading && (
                            <div className="flex items-start gap-2.5">
                                <ArchitectIcon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                                <div className="p-3 rounded-lg bg-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0">
                    <input
                        type="text"
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        placeholder="Transmit your feedback..."
                        disabled={isLoading}
                        className="flex-grow bg-slate-800 border border-theme-border rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ArchitectCommuneModal;
