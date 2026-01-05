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
    this.combatMusic.volume = 0.3; // Reduced volume for combat music
    this.combatMusic.preload = "auto";

    // Handle errors
    this.backgroundMusic.addEventListener('error', (e) => {
      console.warn('Background music failed to load:', e);
    });
    this.combatMusic.addEventListener('error', (e) => {
      console.warn('Combat music failed to load:', e);
    });
  }

  // Fade out audio smoothly
  fadeOutAudio(audio, duration = 500, callback) {
    if (!audio) {
      if (callback) callback();
      return;
    }
    
    const startVolume = audio.volume;
    const fadeStep = startVolume / (duration / 50); // Update every 50ms
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(0, audio.volume - fadeStep);
      } else {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        if (callback) callback();
      }
    }, 50);
  }

  // Fade in audio smoothly
  fadeInAudio(audio, targetVolume, duration = 500) {
    if (!audio) return;
    
    audio.volume = 0;
    const fadeStep = targetVolume / (duration / 50); // Update every 50ms
    
    if (audio.paused || audio.ended) {
      audio.play().catch(e => {
        console.warn('Failed to play audio:', e);
      });
    }
    
    const fadeInterval = setInterval(() => {
      if (audio.volume < targetVolume) {
        audio.volume = Math.min(targetVolume, audio.volume + fadeStep);
      } else {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
      }
    }, 50);
  }

  // Play background music with smooth transition
  playBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    // If combat music is playing, fade it out first
    if (this.combatMusic && !this.combatMusic.paused) {
      this.fadeOutAudio(this.combatMusic, 500, () => {
        // After combat music fades out, fade in background music
        this.fadeInAudio(this.backgroundMusic, 0.5, 500);
        this.currentMusic = this.backgroundMusic;
      });
    } else {
      // No music playing, just fade in background music
      this.fadeInAudio(this.backgroundMusic, 0.5, 500);
      this.currentMusic = this.backgroundMusic;
    }
  }

  // Play combat music with smooth transition
  playCombatMusic() {
    if (!this.combatMusic) return;
    
    // If background music is playing, fade it out first
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.fadeOutAudio(this.backgroundMusic, 500, () => {
        // After background music fades out, fade in combat music
        this.fadeInAudio(this.combatMusic, 0.3, 500);
        this.currentMusic = this.combatMusic;
      });
    } else {
      // No music playing, just fade in combat music
      this.fadeInAudio(this.combatMusic, 0.3, 500);
      this.currentMusic = this.combatMusic;
    }
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

