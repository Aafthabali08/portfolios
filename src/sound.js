// One shared, synthesized sound engine for the whole page (no audio files).
// Hero and toolkit both read and toggle the same on/off state.
import {useSyncExternalStore} from 'react';

let ctx = null, master = null, enabled = false;
const listeners = new Set();
const emit = () => listeners.forEach(l => l());

function ensure() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) throw new Error('unsupported');
  if (!ctx) {
    ctx = new Audio();
    master = ctx.createGain();
    master.gain.value = .9;
    master.connect(ctx.destination);
  }
  return ctx;
}

export async function toggleSound() {
  if (enabled) { enabled = false; emit(); await ctx?.suspend().catch(() => {}); return false; }
  ensure(); await ctx.resume(); enabled = true; emit(); return true;
}
export const isSoundOn = () => enabled && ctx?.state === 'running';

export function tone(frequency, duration = 1.8, volume = .035, type = 'sine') {
  if (!isSoundOn()) return;
  const now = ctx.currentTime, osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = type; osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  osc.connect(gain); gain.connect(master); osc.start(now); osc.stop(now + duration + .05);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
}

// A short mechanical "thock": filtered noise transient plus a low body tone.
export function keyClick(pitch = 1) {
  if (!isSoundOn()) return;
  const now = ctx.currentTime, length = Math.floor(ctx.sampleRate * .05);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate), data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 4);
  const noise = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
  noise.buffer = buffer; filter.type = 'bandpass'; filter.frequency.value = 2400 * pitch; filter.Q.value = .9;
  gain.gain.value = .22;
  noise.connect(filter); filter.connect(gain); gain.connect(master); noise.start(now);
  noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); };
  const body = ctx.createOscillator(), bodyGain = ctx.createGain();
  body.type = 'triangle';
  body.frequency.setValueAtTime(190 * pitch, now); body.frequency.exponentialRampToValueAtTime(70, now + .07);
  bodyGain.gain.setValueAtTime(.16, now); bodyGain.gain.exponentialRampToValueAtTime(.0001, now + .09);
  body.connect(bodyGain); bodyGain.connect(master); body.start(now); body.stop(now + .1);
  body.onended = () => { body.disconnect(); bodyGain.disconnect(); };
}

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend().catch(() => {}); else if (enabled) ctx.resume().catch(() => {});
});

const subscribe = l => { listeners.add(l); return () => listeners.delete(l); };
export const useSoundEnabled = () => useSyncExternalStore(subscribe, () => enabled, () => false);
