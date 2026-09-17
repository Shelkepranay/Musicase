import { BeastModeSettings, Sound8DSettings } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private panner: StereoPannerNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private clarityFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private synthOsc: OscillatorNode | null = null;
  private isSynthesizing: boolean = false;
  
  private orbitAngle: number = 0; // In radians
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;

  // Listeners for visualizer
  private angleListeners: ((angleDeg: number, panValue: number) => void)[] = [];

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;

    this.ctx = new AudioCtxClass();
    
    // Create nodes
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 1.0;

    // 8D Stereo Panner
    if (this.ctx.createStereoPanner) {
      this.panner = this.ctx.createStereoPanner();
      this.panner.pan.value = 0;
    }

    // Beast Mode Sub-Bass (60Hz Lowshelf)
    this.bassFilter = this.ctx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 75;
    this.bassFilter.gain.value = 0; // Off by default

    // EarPod Clarity Treble (3.5kHz Peaking)
    this.clarityFilter = this.ctx.createBiquadFilter();
    this.clarityFilter.type = 'peaking';
    this.clarityFilter.frequency.value = 3500;
    this.clarityFilter.Q.value = 1.2;
    this.clarityFilter.gain.value = 0;

    // Punch Dynamics Compressor
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 20;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.005;
    this.compressor.release.value = 0.15;

    // Frequency Analyser
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;

    // Chain: Source -> Bass -> Clarity -> Panner -> Compressor -> Gain -> Analyser -> Destination
    if (this.bassFilter && this.clarityFilter && this.compressor && this.gainNode && this.analyser) {
      this.bassFilter.connect(this.clarityFilter);
      if (this.panner) {
        this.clarityFilter.connect(this.panner);
        this.panner.connect(this.compressor);
      } else {
        this.clarityFilter.connect(this.compressor);
      }
      this.compressor.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
  }

  public ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public onAngleUpdate(callback: (angleDeg: number, panValue: number) => void) {
    this.angleListeners.push(callback);
    return () => {
      this.angleListeners = this.angleListeners.filter((cb) => cb !== callback);
    };
  }

  public update8DSettings(settings: Sound8DSettings) {
    if (!settings.enabled) {
      if (this.panner && this.ctx) {
        this.panner.pan.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
      this.notifyListeners(0, 0);
      return;
    }

    this.startOrbitLoop(settings);
  }

  private startOrbitLoop(settings: Sound8DSettings) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const step = (timestamp: number) => {
      if (!this.lastTimestamp) this.lastTimestamp = timestamp;
      const dt = (timestamp - this.lastTimestamp) / 1000;
      this.lastTimestamp = timestamp;

      if (settings.enabled) {
        // Speed in Hz (revolutions per second)
        const speed = settings.orbitSpeed || 0.2; // default ~5 sec full rotation
        const directionMultiplier = settings.direction === 'counter-clockwise' ? -1 : 1;
        this.orbitAngle += 2 * Math.PI * speed * dt * directionMultiplier;
        if (this.orbitAngle > 2 * Math.PI) this.orbitAngle -= 2 * Math.PI;
        if (this.orbitAngle < 0) this.orbitAngle += 2 * Math.PI;

        // Pan is sinusoidal: -1 (left) to +1 (right)
        const pan = Math.sin(this.orbitAngle) * ((settings.panWidth ?? 100) / 100);
        if (this.panner && this.ctx) {
          this.panner.pan.setValueAtTime(pan, this.ctx.currentTime);
        }

        const deg = Math.round((this.orbitAngle * 180) / Math.PI);
        this.notifyListeners(deg, pan);
      }

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame(step);
  }

  private notifyListeners(angleDeg: number, panValue: number) {
    for (const listener of this.angleListeners) {
      listener(angleDeg, panValue);
    }
  }

  public updateBeastMode(settings: BeastModeSettings) {
    this.ensureContext();
    if (!this.ctx || !this.bassFilter || !this.clarityFilter) return;

    if (settings.active) {
      const bassGain = settings.subBassBoost; // +12 to +18 dB
      const clarityGain = settings.earpodClarity; // +4 to +8 dB

      this.bassFilter.gain.setTargetAtTime(bassGain, this.ctx.currentTime, 0.05);
      this.clarityFilter.gain.setTargetAtTime(clarityGain, this.ctx.currentTime, 0.05);

      if (this.compressor) {
        this.compressor.threshold.setTargetAtTime(settings.punchCompressor ? -24 : -16, this.ctx.currentTime, 0.05);
        this.compressor.ratio.setTargetAtTime(settings.punchCompressor ? 6 : 3, this.ctx.currentTime, 0.05);
      }
    } else {
      this.bassFilter.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      this.clarityFilter.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      if (this.compressor) {
        this.compressor.threshold.setTargetAtTime(-14, this.ctx.currentTime, 0.1);
      }
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // Play an 8D Beast Mode preview pulse for testing earphones/earpods!
  public playEarPodTestTone() {
    this.ensureContext();
    if (!this.ctx || !this.bassFilter) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.bassFilter);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioEngine = new AudioEngine();
