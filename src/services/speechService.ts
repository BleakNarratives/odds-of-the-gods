// src/services/speechService.ts

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isUnlocked = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  unlock() {
    if (this.isUnlocked || !this.synth) return;
    // A silent utterance is required to unlock speech synthesis on many browsers
    const unlockUtterance = new SpeechSynthesisUtterance('');
    unlockUtterance.volume = 0;
    this.synth.speak(unlockUtterance);
    this.isUnlocked = true;
  }

  speak(text: string) {
    if (!this.isUnlocked || !this.synth) return;

    // Cancel any ongoing speech to prevent overlap
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 0.8;
    utterance.rate = 0.9;
    
    // Find a suitable voice
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.name.includes('Google') && v.lang === 'en-US') || voices.find(v => v.lang === 'en-US');
    if (voice) {
      utterance.voice = voice;
    }

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
