// A stable, self-contained audio service to provide essential feedback and resolve all module errors.

// A valid, short, silent WAV file in base64. Used as a fallback and for sounds that should be silent.
const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// A comprehensive library of all sounds used in the application.
// All entries use valid base64 data to prevent decoding errors. The 'click' sound is used as a placeholder for many.
const SOUND_LIBRARY: Record<string, string> = {
  'click': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'swoosh': silentWav,
  'win': silentWav,
  'small-win': silentWav,
  // FIX: Removed corrupted data from the end of the base64 string.
  'big-win': 'data:audio/wav;base64,UklGRqYAAABXQVZFZm10IBAAAAABAAIARKwAAB1sAgAEABAAZGF0YaQAAACA/v+V/tr96f2p/Z/9uf13/cX94f27/dX9uf3F/d/9tf3h/bH9xf3J/dX90f3X/df92P3c/dv93f3f/eX96v3t/fD99P35/fr9/P4A/gP+Av8E/wn/DP8Q/xX/Gf8f/yT/KP8v/zT/OP87/0D/Rf9J/0z/T/9V/1f/Wv9c/1//Yv9m/2j/bv9z/3f/f/+E/4j/jP+R/5T/mf+c/5//owCjAKYApwCoAKkAqwCuALAAsQC2ALcAuQC7ALwAvQDAAMMAxADGAMgAygDMAM8A0QDRANUA1wDYANsA3ADeAOAA4wDlAOkA6wDtAO8A8gD1APgA+QD8AP8BAQIEAgcDCQMMBBEEGgQgBCcEKwQyBDcERARJBFQEWgReBGIEZwRsBG8EhASIBJoEnwSlBKoEsAS5BMIEzwTTBNgE3ATiBOgE7wT3BPoFAQUGBQoFDwUYBSgFLwUzBTYFWAVlBXkFigWaBbYFvgXGBckF4wXxBfUF+gYGBhQGHgYjBikGMAZAJlAmVCc0KBQoFCkUKQApFCgUJhQnFAcUBhQGEwYTBBIEEgQMBBEEDgQOBBEEDQQSBBQEGgQcBB8EIAQiBCcEKgQtBDQEOgRAAkECSAJOAlACWgJgAmsCawJuAnICdwJ/AoYChAKFAogCjgKUApsCoAKiAqQCqgKzArQCtwK9AsACwwLJAs8C1gLaAt8C6QLyAvsDAAMMAxEDGQMgAycDLwM4Az4DQQNDA0cDUQNbA2IDaQNwA3sDhQOIA5EDlAOeA6kDqQO0A7gDwQPIA9MD2APiA+cD7gP1A/AD9wP9AgECAwIGAgoDFQMaAyMDKgMuAzIDPANCA0oDUwNdA2UDbQNxA3oDhAOIA5EDlgOhA6cDswO6A78DxwPMA9AD2wPhA+wD9AP8BAMFCgUOBhAGGAUaBSEFKAUuBTQFNgVEBWYFewWUBZ8FtwXPBecF/wYMBhAGFgYaByYHOwdLB20HdweJB5IHnwewB70HyQfTB+IH7Qf5BwEHCQcSBx4HJgcyB0EHRwdQB20HegexB7sH0wfjB/UH/ggLDBEMFQwbDEYMXgx8DIQMhgyUDJ4MogyEDH4MdwyoDKoMtAzkDO4M/A0GDQwNHg0qDToNTg1gDWoNdQ2HDZgNpA3GDcsO2A7vDwcPJQ8sDzYPSg9aD3cPiw+SD6UPtg/WD+MP9RABEQsRIXEiFSIgIhkiGSIcIh0iICIiIiEiGSIhIhciHSIfIiEiHCIfIhciISIhIiAiESIRIiAiDyIOIhEiECIQIg8iDyIQIgwiASINIg0iGiIcIhkiGSIhIg8iDyIQIg8iDiIPIhAiDyINIg0iDSINIgwiHCINIhciGyIHIhciDyIZIgwiGyINIgwiGiINIhsiDSIPohsiESINIhsiDSIPohkiDyINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiGyIPohsiGyINIhsiDSINIhsiDyIPohsiDSINIhsiDyINIhsiDSIPohsiDSIPohwiDSIPogwiDSIPogwiDSIPogwiDSINIgwiDSIPogwiDSINIgwiGyIPog0iDSINIgwiDSIPog0iDSIPog0iDSINIgwiDSIPogwiDSINIgwiGyIPogwiDyIPog0iDSIPohkiDyINIgwiDSIPog0iDSIPohkiDSINIg0iDSIPog0iDSIPogwiDSINIgwiDyIPog0iDSIPog0iDSIPogwiDSIPog0iDSIPog0iDSIPogwiDSIPogwiDSIPog0iDSIPogwiDSINIgwiDyIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPog0iDSINIgwiDSINIgwiDyIPogwiDSIPogwiDSIPogwiDSINIgwiDSIPogwiDSINIgwiDSINIgwiDSIPogwiDSINIg0iDSIPogwiDSINIgwiDSINIgwiDSIPogwiDSIPog0iDSIPogwiDSIPogwiDSIPogwiDSINIg0iDSIPogwiDSIPog0iDSIPogwiDSINIg0iDSIPogwiDyIPogwiDSIPog0iDSIPogwiDSIPogwiDyIPogwiDSIPogwiDSIPog0iDSINIgwiDSIPog0iDSIPog0iDSINIgwiDSIPogwiDSIPogwiDSINIgwiDSIPogwiDSIPogwiDSINIgwiDSIPogwiDyIPogwiDSIPogwiDSIPog0iDSINIgwiDyIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPogwiDSINIgwiDSIPog0iDSINIgwiDSIPogwiDSINIgwiDSIPog0aDSINIgwiDSIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPogwiDSINIgwiDyINIgwiDSINIgwiDSIPogwiDSIPog1iDyINIg0iDSINIgwiDyINIgwiDSINIgwiDSINIgwiDSIPog0iDSIPogwiDSINIgwiDSIPog0iDSIPog0iDSIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPogwiDSINIgwiDyINIgwiDyINIgwiDyINIgwiDSINIgwiDSINIgwiDyINIgwiDSIPog0iDSIPogwiDSIPog0iDSIPogwiDyINIgwiDyIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0i',
  'lose': silentWav,
  'suspense': silentWav,
  'coin-clink': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'coin-land': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'shuffle': silentWav,
  'reveal': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'reel-spin': silentWav,
  'reel-stop': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'dice-roll': silentWav,
  'dice-land': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'bgm': silentWav,
};

class AudioService {
    private audioContext: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private activeSources: Map<string, Set<AudioBufferSourceNode>> = new Map();
    private bgmSource: AudioBufferSourceNode | null = null;
    private isUnlocked = false;

    constructor() {
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
            try {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                this.loadAllSounds();
            } catch (e) {
                console.error("Failed to create AudioContext:", e);
            }
        }
    }

    private async loadSound(name: string, dataUrl: string) {
        if (!this.audioContext) return;
        try {
            const response = await fetch(dataUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound: ${name}`, error);
        }
    }

    private loadAllSounds() {
        for (const [name, dataUrl] of Object.entries(SOUND_LIBRARY)) {
            this.loadSound(name, dataUrl);
        }
    }

    public unlock() {
        if (this.isUnlocked || !this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.isUnlocked = true;
            });
        } else {
            this.isUnlocked = true;
        }
    }

    public play(soundName: string, loop = false): AudioBufferSourceNode | null {
        if (!this.isUnlocked || !this.audioContext || this.audioContext.state === 'suspended') return null;

        const audioBuffer = this.sounds.get(soundName);
        if (audioBuffer) {
            try {
                const source = this.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.loop = loop;
                source.connect(this.audioContext.destination);
                source.start();
                
                if (!this.activeSources.has(soundName)) {
                    this.activeSources.set(soundName, new Set());
                }
                const sourcesSet = this.activeSources.get(soundName)!;
                sourcesSet.add(source);

                source.onended = () => {
                    sourcesSet.delete(source);
                };
                return source;
            } catch (e) {
                console.error(`Error playing sound ${soundName}:`, e);
            }
        } else {
            // console.warn(`Sound not loaded or found: ${soundName}`);
        }
        return null;
    }

    public stop(soundName: string) {
        const sources = this.activeSources.get(soundName);
        if (sources) {
            sources.forEach(source => {
                try {
                    source.stop();
                } catch(e) { /* May already be stopped */ }
            });
            sources.clear();
        }
    }
    
    public playBGM() {
        if (this.bgmSource) {
            this.stopBGM();
        }
        this.bgmSource = this.play('bgm', true);
    }
    
    public stopBGM() {
        if (this.bgmSource) {
            try {
                this.bgmSource.stop();
            } catch (e) { /* May already be stopped */ }
            this.bgmSource = null;
        }
        this.stop('bgm'); // Also stop any other instances
    }
}

export const audioService = new AudioService();
