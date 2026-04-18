const MUTE_KEY = "oracle-8ball:muted:v1";

let ctx: AudioContext | null = null;
let muted: boolean = localStorage.getItem(MUTE_KEY) === "1";
let ambientNodes: { stop: () => void } | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  if (value) {
    stopAmbient();
  } else {
    startAmbient();
  }
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

export function playShake(): void {
  if (muted) return;
  const c = getCtx();
  const duration = 0.9;
  const buffer = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const envelope = Math.exp(-i / (c.sampleRate * 0.35));
    const rattle = Math.sin(i * 0.04) * 0.5 + 1;
    data[i] = (Math.random() * 2 - 1) * envelope * rattle;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 1.5;

  const gain = c.createGain();
  gain.gain.value = 0.25;

  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

export function playReveal(): void {
  if (muted) return;
  const c = getCtx();
  const now = c.currentTime;

  const freqs = [196, 294, 392]; // G3, D4, G4 — open fifth power chime
  freqs.forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;

    const gain = c.createGain();
    const peak = 0.22 / (i + 1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 + i * 0.2);

    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + 2);
  });
}

export function startAmbient(): void {
  if (muted || ambientNodes) return;
  const c = getCtx();

  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 55;

  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;

  const lfoGain = c.createGain();
  lfoGain.gain.value = 2.5;
  lfo.connect(lfoGain).connect(osc.frequency);

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 220;

  const gain = c.createGain();
  gain.gain.value = 0.07;

  osc.connect(filter).connect(gain).connect(c.destination);
  osc.start();
  lfo.start();

  ambientNodes = {
    stop: () => {
      try {
        osc.stop();
        lfo.stop();
      } catch {
        /* already stopped */
      }
    }
  };
}

export function stopAmbient(): void {
  if (!ambientNodes) return;
  ambientNodes.stop();
  ambientNodes = null;
}
