'use client';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = 0.3; // Master volume
      }
    }
  }

  public playShootSound() {
    if (!this.audioContext || !this.gainNode || this.isMuted) return;

    // Rifle shot sound synthesis
    const t = this.audioContext.currentTime;
    
    // 1. Noise Burst (Gunpowder explosion)
    const bufferSize = this.audioContext.sampleRate * 0.1; // 100ms
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    // Filter noise to sound more like a gunshot (Lowpass)
    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1000, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, t + 0.1);

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(1, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.gainNode);
    noise.start(t);

    // 2. Punchy Oscillator (Body of the sound)
    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);

    const oscGain = this.audioContext.createGain();
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.gainNode);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playHitSound() {
      if (!this.audioContext || !this.gainNode || this.isMuted) return;
      
      const t = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start(t);
      osc.stop(t + 0.05);
  }
}

// Singleton instance
export const fpsAudio = new SoundManager();
