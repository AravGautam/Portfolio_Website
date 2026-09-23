/**
 * High-Performance Web Audio Synthesizer, Speech Engine & BGM Controller
 * Handles:
 * - Speech synthesis voice greeting ("Namaste. Welcome to Arav Gautam's portfolio")
 * - Default Ambient BGM: /audio/ambient-bgm.mp3 (auto-starts on load / interaction)
 * - Projects Section BGM: /audio/482961__yellowtree__super-strange-synths.wav
 * - Loading Screen SFX: /audio/122276__zimbot__squirble9.wav
 * - Automatic pause/resume on browser tab visibility changes
 * - Tactile UI clicks, whooshes, and interactive chimes
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = typeof window !== 'undefined' ? localStorage.getItem('sound_muted') === 'true' : false;
    this.currentTrack = 'default'; // 'default' | 'projects'
    this.bgmAudio = null;
    this.projectsBgmAudio = null;
    this.loadingAudio = null;
    this.bgmPlaying = false;
    this.wasPlayingBeforeHidden = false;
    this.hasSpokenVoice = false;
    this.hasInteracted = false;
    this.loadingScreenActive = true;

    if (typeof window !== 'undefined') {
      this.initAudioElements();
      this.setupGlobalAutoplay();
      this.setupTabVisibilityListener();
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  finishLoadingScreen() {
    this.loadingScreenActive = false;
    if (this.loadingAudio && !this.loadingAudio.paused) {
      try {
        this.loadingAudio.pause();
        this.loadingAudio.currentTime = 0;
      } catch {}
    }
  }

  hasAudioStarted() {
    return this.bgmPlaying || (this.bgmAudio && !this.bgmAudio.paused) || (this.ctx && this.ctx.state === 'running');
  }

  initAudioElements() {
    try {
      // 1. Default Ambient Background Music (Subtle & Atmospheric)
      this.bgmAudio = new Audio('/audio/ambient-bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.16;
      this.bgmAudio.preload = 'auto';

      // 2. Projects Section Synthesizer Music (Subtle)
      this.projectsBgmAudio = new Audio('/audio/482961__yellowtree__super-strange-synths.wav');
      this.projectsBgmAudio.loop = true;
      this.projectsBgmAudio.volume = 0.14;
      this.projectsBgmAudio.preload = 'auto';

      // 3. Loading Screen SFX
      this.loadingAudio = new Audio('/audio/122276__zimbot__squirble9.wav');
      this.loadingAudio.volume = 0.75;
      this.loadingAudio.preload = 'auto';
    } catch {
      // Fallback
    }
  }

  /**
   * Listen for browser tab changes (Visibility API)
   * Stops music when tab is hidden, resumes when tab is active again.
   */
  setupTabVisibilityListener() {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleTabHidden();
      } else {
        this.handleTabVisible();
      }
    });

    window.addEventListener('pagehide', () => {
      this.handleTabHidden();
    });
  }

  handleTabHidden() {
    this.wasPlayingBeforeHidden = this.bgmPlaying;
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
    if (this.projectsBgmAudio && !this.projectsBgmAudio.paused) {
      this.projectsBgmAudio.pause();
    }
    if (this.loadingAudio && !this.loadingAudio.paused) {
      this.loadingAudio.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.bgmPlaying = false;
  }

  handleTabVisible() {
    if (this.wasPlayingBeforeHidden && !this.muted) {
      this.playBGM(this.currentTrack);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  }

  /**
   * Natural Web Speech Voice Greeting
   */
  speakGreeting(text = "Namaste. Welcome to Arav Gautam's portfolio.") {
    if (this.muted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.hasSpokenVoice) return;
    this.hasSpokenVoice = true;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 0.90;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const selectedVoice =
          voices.find(v => (v.lang.includes('en') || v.lang.includes('hi')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) ||
          voices.find(v => v.lang.startsWith('en')) ||
          voices[0];
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis is disabled by browser
    }
  }

  setupGlobalAutoplay() {
    const unlockAndStart = () => {
      this.hasInteracted = true;
      this.initContext();
      if (!this.muted) {
        // Strictly only play loading sound while loading screen is active
        if (this.loadingScreenActive) {
          this.playLoadingSound();
        }
        this.speakGreeting();
        this.playBGM(this.currentTrack);
      }
    };

    if (typeof window !== 'undefined') {
      // Try playing immediately as soon as tab is opened
      this.playBGM(this.currentTrack);
      if (this.loadingScreenActive) {
        this.playLoadingSound();
      }
      this.speakGreeting();

      window.addEventListener('load', () => {
        this.playBGM(this.currentTrack);
        if (this.loadingScreenActive) {
          this.playLoadingSound();
        }
      }, { once: true });

      // Immediate unlock on ANY user touch, click, scroll or keypress
      ['click', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'mousemove'].forEach(evt => {
        window.addEventListener(evt, unlockAndStart, { once: true, passive: true });
      });

      // UNIVERSAL GLOBAL CLICK SOUND: Guarantees EVERY button, link, and interactive element clicks audibly!
      window.addEventListener('click', (e) => {
        const target = e.target;
        if (!target || !(target instanceof Element)) return;
        const clickable = target.closest('button, a, [role="button"], [role="link"], input[type="submit"], input[type="button"], .cursor-pointer, [data-interactive]');
        if (clickable) {
          this.playClick();
        }
      }, { capture: true, passive: true });
    }
  }

  playLoadingSound() {
    // Strictly prevent loading sound from ever playing after loading screen has completed
    if (!this.loadingScreenActive || this.muted) return;
    this.initContext();

    if (this.loadingAudio) {
      try {
        this.loadingAudio.currentTime = 0;
        this.loadingAudio.play().catch(() => {});
      } catch {
        // Fallback
      }
    }

    // Procedural futuristic chime overlay
    this.playFuturisticChime();
  }

  playFuturisticChime() {
    if (!this.loadingScreenActive || this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [440, 660, 880, 1320];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.52);
      });
    } catch {
      // Ignore
    }
  }


  playBGM(track = 'default') {
    if (this.muted) return;
    this.initContext();
    this.currentTrack = track;

    const activeAudio = track === 'projects' ? this.projectsBgmAudio : this.bgmAudio;
    const inactiveAudio = track === 'projects' ? this.bgmAudio : this.projectsBgmAudio;

    if (inactiveAudio && !inactiveAudio.paused) {
      try {
        inactiveAudio.pause();
        inactiveAudio.currentTime = 0;
      } catch {
        // Ignore
      }
    }

    if (activeAudio) {
      activeAudio.play()
        .then(() => {
          this.bgmPlaying = true;
        })
        .catch(() => {
          // Will start on first user interaction
        });
    }
  }

  pauseBGM() {
    if (this.bgmAudio) this.bgmAudio.pause();
    if (this.projectsBgmAudio) this.projectsBgmAudio.pause();
    this.bgmPlaying = false;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_muted', String(this.muted));
    }
    if (this.muted) {
      this.pauseBGM();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      this.playBGM(this.currentTrack);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Delicate, Crystal Glass Acoustic Tick on Hover
   * Subtle, high-frequency, distinctly different from click.
   */
  playHover() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const doHover = () => {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Ultra-short, delicate crystal tick (1850Hz -> 2500Hz)
        osc.frequency.setValueAtTime(1850, now);
        osc.frequency.exponentialRampToValueAtTime(2500, now + 0.025);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
      } catch {
        // Ignore
      }
    };

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(doHover).catch(() => {});
    } else {
      doHover();
    }
  }

  /**
   * Satisfying, Deep Mechanical Switch Actuation on Click
   * Resonant low punch + crisp switch transient. Unmistakable from hover!
   */
  playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const doClick = () => {
      try {
        const now = this.ctx.currentTime;

        // 1. Deep tactile mechanical thump (160Hz -> 48Hz)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.065);

        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);

        // 2. High crisp snap transient (switch actuation click)
        const snap = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();

        snap.type = 'sine';
        snap.frequency.setValueAtTime(950, now);
        snap.frequency.exponentialRampToValueAtTime(220, now + 0.02);

        snapGain.gain.setValueAtTime(0.20, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        snap.connect(snapGain);
        snapGain.connect(this.ctx.destination);

        snap.start(now);
        snap.stop(now + 0.022);
      } catch {
        // Ignore
      }
    };

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(doClick).catch(() => {});
    } else {
      doClick();
    }
  }

  /**
   * Resonant Harmonic Chime (Used for skill constellation & interactive chips)
   */
  playNote(freq = 528) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const doNote = () => {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.34);
      } catch {
        // Ignore
      }
    };

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(doNote).catch(() => {});
    } else {
      doNote();
    }
  }



  playWhoosh() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  playRadarPing() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
