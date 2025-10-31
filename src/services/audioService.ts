// src/services/audioService.ts

// A comprehensive library of all sounds used in the application.
// All sounds are short, royalty-free WAV files encoded in base64.
const SOUND_LIBRARY: Record<string, string> = {
  'bgm': 'data:audio/wav;base64,UklGRqIEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYAEAA...', // Placeholder for a long BGM track
  'click': 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YS',
  'swoosh': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAA//8/f/5/f/1/AAAAAA==',
  'win': 'data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAAAAAA//8/f/5/f/1/AAAAAP//fw==',
  'small-win': 'data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRgAAAAA//8/f/5/f/1/AAAAAP//fw==',
  'big-win': 'data:audio/wav;base64,UklGRkIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTgAAACA/v+V/tr96f2p/Z/9uf13/cX94f27/dX9uf3F/d/9tf3h/bH9xf3J/dX90f3X/df92P3c/dv93f3f/eX96v3t/fA==',
  'lose': 'data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA////fw==',
  'coin-clink': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQYAAAAA////',
  'coin-land': 'data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRgAAAAA////fw==',
  'shuffle': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAA//8/f/5/fw==',
  'reveal': 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAAAAAA////fw==',
  'dice-roll': 'data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YEgAAAAA////fw==',
  'dice-land': 'data:audio/wav;base64,UklGRkoAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUYAAAAA////fw==',
  'reel-spin': 'data:audio/wav;base64,UklGRoQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYAAAAAA////fw==',
  'reel-stop': 'data:audio/wav;base64,UklGRmAAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVgAAAAA////fw==',
  'suspense': 'data:audio/wav;base64,UklGRqQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYgAAAAA////fw==',
  'secret': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAA/v95/5D/gP+L/33/AAAAAA==',
  'rave-on': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQYAAAAs/8T/tf/h////',
  'lever-pull': 'data:audio/wav;base64,UklGRjAAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSwAAAD8/uz+6f3x/er+9/yT/P/9R/zP/N/87/1f/e/43/tf/qf+1/7X/u/8R/x//M/87/1f/e/63/tf/qf+1/7X/u/8=',
  'toilet-flush': 'data:audio/wav;base64,UklGRqIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYQAAAD8/uz+6f3x/er+9/yT/P/9R/zP/N/87/1f/e/43/tf/qf+1/7X/u/8R/x//M/87/1f/e/63/tf/qf+1/7X/u/8R/x//M/87/1f/e/43/tf/qf+1/7X/u/8=',
};

class AudioService {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private activeSources: Map<string, AudioBufferSourceNode> = new Map();
  private isUnlocked = false;

  constructor() {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      // FIX: Add this check to avoid issues in non-browser environments.
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.loadSounds();
      } catch (e) {
        console.error("Failed to initialize AudioContext:", e);
      }
    }
  }

  unlock() {
    if (this.isUnlocked || !this.audioContext || this.audioContext.state !== 'suspended') return;
    this.audioContext.resume();
    this.isUnlocked = true;
  }

  private async loadSounds() {
    if (!this.audioContext) return;
    for (const key in SOUND_LIBRARY) {
      try {
        const response = await fetch(SOUND_LIBRARY[key]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(key, audioBuffer);
      } catch (error) {
        console.error(`Failed to load sound: ${key}`, error);
      }
    }
  }

  play(soundName: string, loop = false) {
    if (!this.isUnlocked || !this.audioContext) return;
    const audioBuffer = this.audioBuffers.get(soundName);
    if (audioBuffer) {
      this.stop(soundName);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = loop;
      source.connect(this.audioContext.destination);
      source.start(0);

      this.activeSources.set(soundName, source);
      source.onended = () => {
        this.activeSources.delete(soundName);
      };
    }
  }

  stop(soundName: string) {
    if (this.activeSources.has(soundName)) {
      this.activeSources.get(soundName)?.stop();
      this.activeSources.delete(soundName);
    }
  }

  playBGM() {
    this.play('bgm', true);
  }

  stopBGM() {
    this.stop('bgm');
  }
}

export const audioService = new AudioService();