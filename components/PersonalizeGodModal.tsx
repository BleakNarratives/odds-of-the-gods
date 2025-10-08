import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { God } from '../types';
import { GOD_BASE_IMAGES } from './icons/AnubisBaseImage';
import { SoulIcon } from './icons/MythicIcons';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // The reader result includes the data URL prefix, which we need to remove.
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface PersonalizeGodModalProps {
  isOpen: boolean;
  onClose: () => void;
  god: God;
  onPersonalize: (godId: string, imageBase64: string) => void;
}

const PersonalizeGodModal: React.FC<PersonalizeGodModalProps> = ({ isOpen, onClose, god, onPersonalize }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const baseImage = GOD_BASE_IMAGES[god.id] || '';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGeneratedImage(null);
      setError('');
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please select an image file to offer.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      const userImageBase64 = await blobToBase64(selectedFile);

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
              parts: [
                  { inlineData: { data: baseImage, mimeType: 'image/png' } },
                  { inlineData: { data: userImageBase64, mimeType: selectedFile.type } },
                  { text: "Take the primary subject from the second image and artistically merge them with the character in the first image. The goal is to make it look like the person in the second image IS the character from the first. Maintain the divine, powerful, and artistic style of the first image. The output should be just the new character on a transparent background." }
              ]
          },
          config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
          }
      });
      
      const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setGeneratedImage(imagePart.inlineData.data);
      } else {
        const textPart = response.candidates?.[0]?.content.parts.find(p => p.text);
        setError(`The gods could not forge this likeness. Reason: ${textPart?.text || 'Unknown Error'}`);
      }

    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while communing with the gods.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirm = () => {
    if (generatedImage) {
        onPersonalize(god.id, generatedImage);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-fade-in" onClick={onClose}>
      <div className="bg-slate-900 rounded-lg shadow-2xl shadow-theme-primary/20 border border-theme-border w-full max-w-3xl m-4 p-8 transform transition-all duration-300 scale-95 animate-modal-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-theme-primary">Create a Divine Likeness</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-slate-400 mb-6 text-center">
          Offer a face to the divine, and {god.name} may adopt the likeness. Your friend shall be immortalized.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          {/* Base God */}
          <div>
            <h3 className="text-lg text-slate-400 mb-2">The Divine Canvas</h3>
            <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center p-4 border border-theme-border">
                {baseImage ? (
                  <img src={`data:image/png;base64,${baseImage}`} alt={god.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <p className="text-slate-500">No base image</p>
                )}
            </div>
          </div>

          {/* User Upload */}
          <div className="flex flex-col items-center">
             <h3 className="text-lg text-slate-400 mb-2">Your Offering</h3>
             <div className="aspect-square w-full bg-black/20 rounded-lg flex items-center justify-center p-4 border border-theme-border">
                {previewUrl ? (
                    <img src={previewUrl} alt="Your upload" className="max-w-full max-h-full object-contain rounded-md" />
                ) : (
                    <p className="text-slate-500">Select an image</p>
                )}
             </div>
              <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
              <label htmlFor="image-upload" className="mt-4 bg-slate-700 text-white font-bold py-2 px-4 rounded-md text-sm cursor-pointer hover:bg-slate-600 transition-colors">Choose Image</label>
          </div>

          {/* Result */}
          <div>
             <h3 className="text-lg text-slate-400 mb-2">The Fused Likeness</h3>
             <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center p-4 border border-theme-border">
                {isLoading && <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme-primary"></div>}
                {generatedImage && <img src={`data:image/png;base64,${generatedImage}`} alt="Generated likeness" className="max-w-full max-h-full object-contain" />}
                {!isLoading && !generatedImage && <p className="text-slate-500">Awaiting fusion...</p>}
             </div>
          </div>
        </div>
        
        {error && <p className="text-center text-theme-loss mt-4">{error}</p>}

        <div className="mt-8 flex justify-center gap-4">
            <button onClick={handleGenerate} disabled={isLoading || !selectedFile} className="bg-theme-primary text-theme-background font-bold py-3 px-8 rounded-lg text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors">
                {isLoading ? 'Fusing...' : 'Fuse Likeness'}
            </button>
             <button onClick={handleConfirm} disabled={!generatedImage} className="bg-theme-win text-theme-background font-bold py-3 px-8 rounded-lg text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 transition-colors">
                Confirm
            </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeGodModal;