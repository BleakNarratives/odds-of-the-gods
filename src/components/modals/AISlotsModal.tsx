import React, { useState } from 'react';
import { Game } from '../../types';
import { generateCustomAsset } from '../../services/geminiService';
import { audioService } from '../../services/audioService';

interface AISlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  slotSymbols: { id: string, Icon?: React.FC<any>, color?: string, customImage?: string }[];
  onSave: (gameId: string, assetId: string, imageBase64: string) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
};

const AISlotsModal: React.FC<AISlotsModalProps> = ({ isOpen, onClose, game, slotSymbols, onSave }) => {
    const [selectedAsset, setSelectedAsset] = useState<(typeof slotSymbols[0]) | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    if (!isOpen || !game) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setError('');
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!selectedFile || !prompt) {
            setError('Please select an image and provide a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
            const userImageBase64 = await blobToBase64(selectedFile);
            const newImage = await generateCustomAsset(userImageBase64, selectedFile.type, prompt);
            setGeneratedImage(newImage);
            audioService.play('win');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred during image generation.');
            audioService.play('lose');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (game && selectedAsset && generatedImage) {
            onSave(game.id, selectedAsset.id, generatedImage);
        }
    };

    const handleSelectAsset = (asset: typeof slotSymbols[0]) => {
        setSelectedAsset(asset);
        setGeneratedImage(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setPrompt('');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-primary w-full max-w-4xl m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-theme-primary">AI Slots Customizer - {game.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Symbol Selection */}
                    <div>
                        <h3 className="text-lg text-slate-300 mb-2">1. Select a Symbol to Replace</h3>
                        <div className="grid grid-cols-4 gap-2 bg-black/20 p-4 rounded-lg">
                            {slotSymbols.map(symbol => (
                                <button key={symbol.id} onClick={() => handleSelectAsset(symbol)} className={`aspect-square flex items-center justify-center rounded-md border-2 transition-colors ${selectedAsset?.id === symbol.id ? 'border-theme-primary bg-theme-primary/20' : 'border-theme-border bg-theme-surface hover:bg-theme-border/50'}`}>
                                    {symbol.customImage ? <img src={`data:image/png;base64,${symbol.customImage}`} alt={symbol.id} className="w-12 h-12 object-contain" /> : symbol.Icon ? <symbol.Icon className={`w-12 h-12 ${symbol.color}`} /> : <span className={`text-3xl font-bold ${symbol.color}`}>{symbol.id}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customization Area */}
                    <div className={!selectedAsset ? 'opacity-50' : ''}>
                         <h3 className="text-lg text-slate-300 mb-2">2. Provide Your Likeness & Prompt</h3>
                         <div className="bg-black/20 p-4 rounded-lg space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 bg-theme-surface rounded-md flex items-center justify-center border border-theme-border">
                                    {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" /> : <span className="text-slate-500 text-xs text-center">Your Image</span>}
                                </div>
                                 <input type="file" id="ai-slot-upload" accept="image/*" onChange={handleFileChange} className="hidden" disabled={!selectedAsset} />
                                 <label htmlFor="ai-slot-upload" className={`bg-slate-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors ${!selectedAsset ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-600'}`}>Choose Image</label>
                            </div>
                            <input
                                type="text"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g., 'God of Thunder', 'Queen of the Underworld'"
                                disabled={!selectedAsset}
                                className="w-full bg-slate-800 border border-theme-border rounded-md p-2 focus:ring-2 focus:ring-theme-primary focus:outline-none"
                            />
                            <button onClick={handleGenerate} disabled={isLoading || !selectedFile || !prompt} className="w-full bg-theme-primary text-theme-background font-bold py-2 rounded-lg disabled:opacity-50">
                                {isLoading ? 'Generating...' : 'Generate Icon'}
                            </button>
                         </div>
                         
                         <h3 className="text-lg text-slate-300 mt-4 mb-2">3. Confirm Your New Icon</h3>
                         <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg">
                             <div className="w-24 h-24 bg-theme-surface rounded-md flex items-center justify-center border border-theme-border">
                                {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>}
                                {generatedImage && <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="w-full h-full object-contain rounded-md" />}
                                {!isLoading && !generatedImage && <span className="text-slate-500 text-xs text-center">Result</span>}
                             </div>
                             <button onClick={handleSave} disabled={!generatedImage} className="flex-1 bg-theme-win text-theme-background font-bold py-3 rounded-lg disabled:opacity-50">
                                Save Icon
                             </button>
                         </div>
                         {error && <p className="text-sm text-theme-loss mt-2">{error}</p>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AISlotsModal;
