// src/services/speechService.ts

import { THOTH_VOICE_NAME } from '../constants';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isUnlocked = false;
  private thothVoice: SpeechSynthesisVoice | null = null;
  private messageQueue: SpeechSynthesisUtterance[] = [];
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Voices can load asynchronously.
      this.synth.onvoiceschanged = () => this.loadVoices();
      this.loadVoices();
    } else {
      console.warn('Speech Synthesis not supported in this browser.');
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    
    // Refined voice selection logic to find a suitable male voice
    this.thothVoice = this.voices.find(voice => voice.name === THOTH_VOICE_NAME) || // 1. Exact Name Match
                      this.voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Male') && !voice.default) || // 2. Any non-default English male
                      this.voices.find(voice => voice.lang.startsWith('en-GB') && !voice.default) || // 3. Any non-default British voice
                      this.voices.find(voice => voice.lang.startsWith('en-GB')) || // 4. Any British voice
                      this.voices.find(voice => voice.lang.startsWith('en-US') && voice.name.includes('Male')) || // 5. American male
                      this.voices.find(voice => voice.lang.startsWith('en')) || // 6. Any English voice
                      this.voices[0] || null; // 7. Absolute fallback

    if (this.thothVoice && this.isUnlocked) {
      this.processQueue();
    }
  }
  
  private processQueue() {
      if (!this.isSpeaking && this.messageQueue.length > 0 && this.thothVoice && this.isUnlocked && this.synth) {
          this.isSpeaking = true;
          const utterance = this.messageQueue.shift();
          if (utterance) {
              utterance.onend = () => {
                  this.isSpeaking = false;
                  this.processQueue();
              };
              utterance.onerror = (event) => {
                  console.error('SpeechSynthesisUtterance.onerror', event);
                  this.isSpeaking = false;
                  this.processQueue();
              }
              this.synth.speak(utterance);
          } else {
             this.isSpeaking = false;
          }
      }
  }

  public unlock() {
    if (this.isUnlocked || !this.synth) return;
    // A blank utterance is a common trick to "unlock" speech on mobile/some browsers.
    const unlockUtterance = new SpeechSynthesisUtterance('');
    this.synth.speak(unlockUtterance);
    this.isUnlocked = true;
    this.loadVoices(); // Try to load voices again after user interaction
  }

  public speak(text: string, rate = 0.9, pitch = 0.8) {
    if (!this.synth) {
      return;
    }
    
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false; 
      this.messageQueue = [];
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.thothVoice) {
      utterance.voice = this.thothVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    this.messageQueue.push(utterance);
    this.processQueue();
  }

  public onDominionChange(newDominantGodName: string) {
    this.speak(`A new power rises. ${newDominantGodName} now holds dominion.`);
  }

  public onBetrayal() {
    this.speak("Betrayal. The gods do not forget such transgressions.");
  }
  
  public onBigWin() {
    this.speak("A truly divine victory!");
  }
  
  public onNearWin() {
    this.speak("So close... Fate is a fickle thing.");
  }
  
  public onLoss() {
    this.speak("The cosmos are indifferent to your plight.");
  }
}

export const speechService = new SpeechService();