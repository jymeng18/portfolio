/** Gesture-safe playback, smooth fades, and persistent sound preferences. */
import { createMusic, BAR_SECONDS, MUSIC_VOLUME } from './music.js';

const STORAGE_KEY = 'jerry-portfolio-muted';

export function createAudio(onChange) {
  let muted = true;
  let context;
  let master;
  let music;
  let timer;
  let suspendTimer;
  let nextBarTime = 0;
  let bar = 0;
  let activated = false;
  let transition = 0;

  try { muted = localStorage.getItem(STORAGE_KEY) !== 'false'; } catch { /* Storage can be disabled. */ }

  function fadeTo(volume, seconds) {
    const now = context.currentTime;
    if (master.gain.cancelAndHoldAtTime) master.gain.cancelAndHoldAtTime(now);
    else {
      const current = master.gain.value;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(current, now);
    }
    master.gain.linearRampToValueAtTime(volume, now + seconds);
  }

  function schedule() {
    if (muted || document.hidden || context.state !== 'running') return;
    // Recover from a stalled timer without playing a burst of overdue bars.
    if (nextBarTime < context.currentTime - .1) {
      const skipped = Math.ceil((context.currentTime - nextBarTime) / BAR_SECONDS);
      bar += skipped;
      nextBarTime += skipped * BAR_SECONDS;
    }
    while (nextBarTime < context.currentTime + .25) {
      music.scheduleBar(bar++, nextBarTime);
      nextBarTime += BAR_SECONDS;
    }
    timer = window.setTimeout(schedule, 100);
  }

  async function start() {
    if (muted || !activated || document.hidden) return;
    const request = ++transition;
    window.clearTimeout(suspendTimer);
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      if (!context) {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
        music = createMusic(context, master);
      }
      await context.resume();
      if (request !== transition || muted || document.hidden) {
        if (muted || document.hidden) context.suspend().catch(() => {});
        return;
      }
      if (bar === 0) nextBarTime = context.currentTime + .04;
      fadeTo(MUSIC_VOLUME, .35);
      window.clearTimeout(timer);
      schedule();
    } catch { /* The visual controls remain usable if audio is unavailable. */ }
  }

  function stop() {
    ++transition;
    window.clearTimeout(timer);
    window.clearTimeout(suspendTimer);
    if (context?.state !== 'running') return;
    fadeTo(0, .09);
    suspendTimer = window.setTimeout(() => {
      if (muted || document.hidden) context.suspend().catch(() => {});
    }, 120);
  }

  function update() {
    onChange(muted);
    try { localStorage.setItem(STORAGE_KEY, String(muted)); } catch { /* Optional persistence. */ }
  }

  // Even a remembered "sound on" preference waits for an actual user gesture.
  document.addEventListener('click', () => { activated = true; start(); }, { once: true, capture: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  window.addEventListener('pagehide', () => {
    stop();
    context?.suspend().catch(() => {});
  });
  window.addEventListener('pageshow', start);
  onChange(muted);

  return {
    toggle() {
      activated = true;
      muted = !muted;
      update();
      if (muted) stop();
      else start();
    },
    effect(kind) {
      if (muted || context?.state !== 'running') return;
      music.effect(kind, context.currentTime + .005);
    },
  };
}
