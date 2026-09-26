/**
 * Zero-dependency, zero-asset Web Audio Synthesizer Engine.
 * Generates synthetic UI sound effects dynamically using the native Web Audio API.
 * Strict SSR guards and opt-in mute state with localStorage persistence.
 */

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const STORAGE_KEY = 'portfolio_sound';

let sharedAudioContext: AudioContext | null = null;
let isMutedState = true;
let isInitialized = false;
let isEagerUnlockAttached = false;

/**
 * Initializes the mute state from localStorage if running in browser.
 * Default is strictly opt-in (isMuted = true).
 */
function initMuteState(): void {
  if (isInitialized || typeof window === 'undefined') {
    return;
  }
  isInitialized = true;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      // 'false' or 'unmuted' enables audio, otherwise stays muted
      isMutedState = stored !== 'false' && stored !== 'unmuted';
    } else {
      isMutedState = true;
    }
  } catch {
    isMutedState = true;
  }
}

/**
 * Returns the singleton AudioContext instance.
 * Resumes audio context if suspended, or initializes it on first interaction.
 * Fails silently if Web Audio is unsupported or blocked.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (!sharedAudioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkitAudio).webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      sharedAudioContext = new AudioContextClass();
    }

    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {
        // Silently catch autoplay policy rejections
      });
    }

    return sharedAudioContext;
  } catch {
    return null;
  }
}

// Attach eager unlock listeners to resume suspended AudioContext on user gesture
if (typeof window !== 'undefined' && !isEagerUnlockAttached) {
  isEagerUnlockAttached = true;
  const resumeOnGesture = () => {
    try {
      if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume().catch(() => {});
      }
    } catch {
      // Fail silently
    }
  };

  window.addEventListener('pointerdown', resumeOnGesture, { once: true, passive: true });
  window.addEventListener('keydown', resumeOnGesture, { once: true, passive: true });
}

/**
 * Checks whether the user has requested reduced motion.
 */
function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Checks whether audio is permitted to play (not muted, reduced motion inactive, window present).
 */
function canPlayAudio(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (getMuted() || isReducedMotion()) {
    return false;
  }
  return true;
}

/**
 * Dispatches a custom event to notify listeners of sound toggle changes.
 */
function notifyMuteChange(muted: boolean): void {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(
        new CustomEvent('portfolio:sound-change', { detail: { isMuted: muted } })
      );
    } catch {
      // Fail silently
    }
  }
}

/**
 * Returns current mute status (default: true).
 */
export function getMuted(): boolean {
  initMuteState();
  return isMutedState;
}

/**
 * Sets the mute status and persists preference to localStorage.
 */
export function setMuted(muted: boolean): void {
  initMuteState();
  isMutedState = muted;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
    } catch {
      // Fail silently in private/sandboxed windows
    }

    // Warm up context if unmuting
    if (!muted) {
      getAudioContext();
    }

    notifyMuteChange(muted);
  }
}

/**
 * Toggles mute status and saves to localStorage.
 * Returns the new mute status.
 */
export function toggleMute(): boolean {
  const next = !getMuted();
  setMuted(next);
  return next;
}

/**
 * Subtle, high-end 40ms micro-click.
 * Sine oscillator ramping from 800Hz to 1200Hz with exponential gain decay.
 * Fails silently if muted, reduced-motion active, or audio blocked.
 */
export function playHoverBeep(): void {
  if (!canPlayAudio()) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const duration = 0.04; // 40ms

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + duration);

    // Subtle micro-click envelope
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.005);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Silent disconnect
      }
    };
  } catch {
    // Fail silently without throwing
  }
}

/**
 * Crisp dual-frequency resonant ping (1200Hz + 2400Hz with fast release).
 * Harmonic octave ping designed for button/link clicks.
 */
export function playClickChime(): void {
  if (!canPlayAudio()) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const duration = 0.09; // 90ms fast release

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, now);

    // Fast release exponential envelope
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + duration + 0.005);
    osc2.stop(now + duration + 0.005);

    osc1.onended = () => {
      try {
        osc1.disconnect();
        osc2.disconnect();
        gain.disconnect();
      } catch {
        // Silent disconnect
      }
    };
  } catch {
    // Fail silently without throwing
  }
}

/**
 * Plays mode switch transition sound.
 * - toBoring = true: Retro CRT 80Hz square wave power-down buzz with resonant lowpass filter sweep.
 * - toBoring = false: Sci-fi charge up chirp (300Hz -> 1800Hz exponential sweep).
 */
export function playModeSwitchSound(toBoring: boolean): void {
  if (!canPlayAudio()) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;

    if (toBoring) {
      // Retro CRT 80Hz square wave power-down buzz with lowpass filter sweep
      const duration = 0.28;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + duration);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4, now);
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(45, now + duration);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);

      osc.onended = () => {
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch {
          // Silent disconnect
        }
      };
    } else {
      // Sci-fi charge up chirp (300Hz -> 1800Hz exponential sweep)
      const duration = 0.2;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Silent disconnect
        }
      };
    }
  } catch {
    // Fail silently without throwing
  }
}

/**
 * Multi-oscillator chord swell (major triad: C5, E5, G5) with subtle vibrato.
 * Creates an ethereal resonance chord swell.
 */
export function playOverdriveChime(): void {
  if (!canPlayAudio()) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const duration = 0.65;
    const attackTime = 0.12;

    // Major triad frequencies: C5, E5, G5
    const chordFrequencies = [523.25, 659.25, 783.99] as const;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.06, now + attackTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Subtle vibrato LFO (5.5Hz, depth 3.5Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.5, now);
    lfoGain.gain.setValueAtTime(3.5, now);
    lfo.connect(lfoGain);

    const oscillators = chordFrequencies.map((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      lfoGain.connect(osc.frequency);
      osc.connect(masterGain);
      return osc;
    });

    masterGain.connect(ctx.destination);

    lfo.start(now);
    lfo.stop(now + duration + 0.01);

    oscillators.forEach((osc) => {
      osc.start(now);
      osc.stop(now + duration + 0.01);
    });

    oscillators[0].onended = () => {
      try {
        lfo.disconnect();
        lfoGain.disconnect();
        oscillators.forEach((osc) => osc.disconnect());
        masterGain.disconnect();
      } catch {
        // Silent disconnect
      }
    };
  } catch {
    // Fail silently without throwing
  }
}

/**
 * High-velocity motorsport acceleration chime for M Sport theme activation.
 * Dual-tone ascending turbo spool (360Hz -> 1600Hz with resonant harmonic boost).
 */
export function playMotorsportChime(): void {
  if (!canPlayAudio()) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.22;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3600, now + duration);
    filter.Q.setValueAtTime(4.5, now);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);

    osc.onended = () => {
      try {
        osc.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {
        // Silent
      }
    };
  } catch {
    // Fail silently
  }
}

/**
 * Clinical mechanical relay click for Nothing theme activation.
 * Sharp analog-digital impulse (1800Hz with damped exponential mechanical snap).
 */
export function playNothingChime(): void {
  if (!canPlayAudio()) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.045; // 45ms sharp impulse

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + duration);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.005);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Silent
      }
    };
  } catch {
    // Fail silently
  }
}

