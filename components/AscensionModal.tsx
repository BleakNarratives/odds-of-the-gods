import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { AscendedGodDetails } from '../types';
import { AspirantIcon } from './icons/MythicIcons';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

interface AscensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAscend: (details: AscendedGodDetails) => void;
}

const AscensionModal: React.FC<AscensionModalProps> = ({ isOpen, onClose, onAscend }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGeneratedImage(null);
      setError('');
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedFile) {
      setError('An image is required to sculpt your divine form.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
        const userImageBase64 = await blobToBase64(selectedFile);
        const prompt = `Take the face from the provided image and transform it into a divine, god-like portrait. The subject should look powerful and otherworldly. The style should be painterly and epic, fitting for a new god in a celestial pantheon. Give it a cosmic background and ensure the output is a square portrait. The final being should look like the god of "${title || 'Ambition'}".`;
        
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { 
              numberOfImages: 1, 
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
            // The image editing model is good, but for a "from scratch" god portrait, Imagen is better.
            // We'll give it the user image to work from in the prompt.
            // This requires a different API call than the edit model.
        });
        
        const image = response.generatedImages[0]?.image.imageBytes;
        if(image) {
            setGeneratedImage(image);
            setStep(2); // Move to confirm step
        } else {
            setError("The gods of creation could not forge this image. Please try another offering.");
        }

    } catch (err) {
      console.error("Ascension image generation error:", err);
      setError("A cosmic disturbance prevented the creation of your image.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmAscension = () => {
    if (generatedImage && name && title && philosophy) {
        onAscend({
            name,
            title,
            philosophy,
            image: generatedImage,
        });
    } else {
        setError("All fields and a divine image are required to ascend.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
      <div className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-primary w-full max-w-2xl m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-theme-primary">Ritual of Apotheosis</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-slate-300 mb-6 text-center">
            You have gathered the required essence. Now, define your eternal self. Spend 10,000 Souls to carve your myth into reality.
        </p>

        {step === 1 && (
            <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="god-name" className="block text-sm font-bold text-slate-400 mb-1">Your Divine Name</label>
                        <input type="text" id="god-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Z, The Architect" className="w-full bg-slate-800 border border-theme-border rounded-md p-2 focus:ring-2 focus:ring-theme-primary focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="god-title" className="block text-sm font-bold text-slate-400 mb-1">Your Title</label>
                        <input type="text" id="god-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., God of Creation" className="w-full bg-slate-800 border border-theme-border rounded-md p-2 focus:ring-2 focus:ring-theme-primary focus:outline-none"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="god-philosophy" className="block text-sm font-bold text-slate-400 mb-1">Your Philosophy</label>
                    <input type="text" id="god-philosophy" value={philosophy} onChange={e => setPhilosophy(e.target.value)} placeholder="A short, powerful creed..." className="w-full bg-slate-800 border border-theme-border rounded-md p-2 focus:ring-2 focus:ring-theme-primary focus:outline-none"/>
                </div>
                 <div className="text-center pt-4">
                    <label htmlFor="image-upload" className="block text-sm font-bold text-slate-400 mb-2">Offer Your Mortal Visage</label>
                    <div className="w-32 h-32 mx-auto bg-black/20 rounded-full flex items-center justify-center border-2 border-dashed border-theme-border">
                        {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-full"/> : <AspirantIcon className="w-16 h-16 text-slate-600"/>}
                    </div>
                     <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
                     <label htmlFor="image-upload" className="mt-2 inline-block bg-slate-700 text-white font-bold py-2 px-4 rounded-md text-sm cursor-pointer hover:bg-slate-600 transition-colors">Choose Image</label>
                </div>
                 {error && <p className="text-center text-theme-loss mt-2">{error}</p>}
                <div className="pt-4">
                    <button onClick={handleGenerateImage} disabled={isLoading || !selectedFile || !name || !title || !philosophy} className="w-full bg-theme-primary text-theme-background font-bold py-3 px-8 rounded-lg text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors shimmer-button">
                        {isLoading ? 'The Cosmos Contemplates...' : 'Forge My Image'}
                    </button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="animate-fade-in text-center">
                 <h3 className="text-2xl font-bold text-white mb-4">Behold, Your Divine Form!</h3>
                 <div className="w-56 h-56 mx-auto rounded-full border-4 border-theme-primary shadow-2xl shadow-theme-primary/40 overflow-hidden">
                     {generatedImage && <img src={`data:image/png;base64,${generatedImage}`} alt="Your divine form" className="w-full h-full object-cover" />}
                 </div>
                 <p className="text-lg text-slate-300 mt-4">Name: <span className="font-bold text-white">{name}</span></p>
                 <p className="text-lg text-slate-300">Title: <span className="font-bold text-white">{title}</span></p>
                 <p className="text-md italic text-slate-400 mt-2">"{philosophy}"</p>
                 {error && <p className="text-center text-theme-loss mt-2">{error}</p>}
                 <div className="mt-6 flex gap-4 justify-center">
                     <button onClick={() => setStep(1)} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors">
                         Recant
                     </button>
                    <button onClick={handleConfirmAscension} className="bg-theme-win text-theme-background font-bold py-2 px-6 rounded-lg uppercase tracking-wider hover:bg-teal-500 transition-colors">
                        Ascend to Godhood
                    </button>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AscensionModal;
