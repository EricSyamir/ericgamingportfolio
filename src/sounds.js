// 8-bit Sound Effects Generator
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.backgroundMusic = null;
    this.combatMusic = null;
    this.currentMusic = null;
    this.initAudioContext();
    this.initMusic();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  // Ensure audio context is running (required for user interaction)
  ensureAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Generate 8-bit style beep
  playBeep(frequency, duration, type = 'square', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;
    
    this.ensureAudioContext();

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

  // Interaction sound - when near object
  playNearObject() {
    this.playBeep(400, 0.1, 'sine', 0.15);
  }

  // Confirm interaction - when pressing E
  playInteract() {
    this.playBeep(600, 0.15, 'square', 0.25);
    setTimeout(() => {
      this.playBeep(800, 0.1, 'square', 0.2);
    }, 50);
  }

  // Open dialogue
  playDialogueOpen() {
    this.playBeep(523, 0.1, 'square', 0.2); // C5
    setTimeout(() => {
      this.playBeep(659, 0.1, 'square', 0.2); // E5
    }, 50);
    setTimeout(() => {
      this.playBeep(784, 0.15, 'square', 0.25); // G5
    }, 100);
  }

  // Next page in dialogue
  playDialogueNext() {
    this.playBeep(440, 0.1, 'square', 0.2); // A4
    setTimeout(() => {
      this.playBeep(554, 0.1, 'square', 0.2); // C#5
    }, 50);
  }

  // Close dialogue
  playDialogueClose() {
    this.playBeep(784, 0.1, 'square', 0.2); // G5
    setTimeout(() => {
      this.playBeep(659, 0.1, 'square', 0.2); // E5
    }, 50);
    setTimeout(() => {
      this.playBeep(523, 0.15, 'square', 0.25); // C5
    }, 100);
  }

  // Error/invalid action
  playError() {
    this.playBeep(200, 0.2, 'sawtooth', 0.3);
  }

  // Movement sound (optional, can be called on key press)
  playMove() {
    this.playBeep(300, 0.05, 'sine', 0.1);
  }

  // Initialize music audio elements
  initMusic() {
    // Background music
    this.backgroundMusic = new Audio("./Beneath the Mask -instrumental version-.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.preload = "auto";

    // Combat music
    this.combatMusic = new Audio("./Last Surprise -Scramble-.mp3");
    this.combatMusic.loop = true;
    this.combatMusic.volume = 0.5;
    this.combatMusic.preload = "auto";

    // Handle errors
    this.backgroundMusic.addEventListener('error', (e) => {
      console.warn('Background music failed to load:', e);
    });
    this.combatMusic.addEventListener('error', (e) => {
      console.warn('Combat music failed to load:', e);
    });
  }

  // Play background music
  playBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    // Stop combat music if playing
    if (this.combatMusic && !this.combatMusic.paused) {
      this.combatMusic.pause();
      this.combatMusic.currentTime = 0;
    }

    // Play background music
    if (this.backgroundMusic.paused || this.backgroundMusic.ended) {
      this.backgroundMusic.play().catch(e => {
        console.warn('Failed to play background music:', e);
      });
    }
    this.currentMusic = this.backgroundMusic;
  }

  // Play combat music
  playCombatMusic() {
    if (!this.combatMusic) return;
    
    // Stop background music if playing
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }

    // Play combat music
    if (this.combatMusic.paused || this.combatMusic.ended) {
      this.combatMusic.play().catch(e => {
        console.warn('Failed to play combat music:', e);
      });
    }
    this.currentMusic = this.combatMusic;
  }

  // Stop all music
  stopAllMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    if (this.combatMusic) {
      this.combatMusic.pause();
      this.combatMusic.currentTime = 0;
    }
    this.currentMusic = null;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

