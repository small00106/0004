class SoundManager {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playSlideTone(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  jump() {
    this.playSlideTone(400, 800, 0.15, 'square', 0.08);
  }

  coin() {
    this.playTone(988, 0.1, 'square', 0.1);
    setTimeout(() => this.playTone(1319, 0.15, 'square', 0.1), 50);
  }

  brickBreak() {
    this.playTone(200, 0.1, 'sawtooth', 0.08);
    setTimeout(() => this.playTone(150, 0.1, 'sawtooth', 0.06), 30);
  }

  bump() {
    this.playTone(300, 0.08, 'square', 0.08);
  }

  powerUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.12, 'square', 0.08), i * 80);
    });
  }

  stomp() {
    this.playTone(200, 0.1, 'square', 0.1);
  }

  fireball() {
    this.playSlideTone(800, 400, 0.1, 'sawtooth', 0.06);
  }

  death() {
    const notes = [440, 392, 349, 294, 262];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'square', 0.1), i * 150);
    });
  }

  win() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'square', 0.1), i * 120);
    });
  }

  gameOver() {
    const notes = [392, 349, 294, 262, 220];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'square', 0.1), i * 200);
    });
  }
}

export const soundManager = new SoundManager();
