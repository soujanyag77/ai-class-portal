class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  setMuted(m) {
    this.muted = Boolean(m);
  }

  getCtx() {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  tone(freq, dur, type = 'triangle', vol = 0.12, delay = 0) {
    const c = this.getCtx();
    if (!c) return;
    const now = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  pop() { this.tone(540, 0.07, 'triangle', 0.1); }
  tick() { this.tone(860, 0.04, 'square', 0.04); }
  good() {
    this.tone(523.25, 0.11, 'triangle', 0.14, 0);
    this.tone(659.25, 0.11, 'triangle', 0.14, 0.08);
    this.tone(783.99, 0.2, 'triangle', 0.16, 0.16);
  }
  bad() {
    this.tone(240, 0.14, 'sawtooth', 0.08, 0);
    this.tone(175, 0.22, 'sawtooth', 0.08, 0.11);
  }
  bonus() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.14, 'sine', 0.12, i * 0.065));
  }
  victory() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) =>
      this.tone(f, i === 5 ? 0.36 : 0.13, 'triangle', 0.15, i * 0.095)
    );
  }
}

export const sfx = new SoundEngine();

export function launchConfetti(count = 26, symbols = ['⭐', '🎉', '✨', '🤖', '🏆']) {
  if (typeof document === 'undefined') return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = symbols[(Math.random() * symbols.length) | 0];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 18 + Math.random() * 20 + 'px';
    el.style.animationDuration = 1.4 + Math.random() * 1.4 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}
