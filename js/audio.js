/** Quiet, original pentatonic music and interaction sounds; no downloaded audio. */
const STORAGE_KEY = 'jerry-portfolio-muted';
const melody = [
  76, 0, 79, 81, 0, 79, 76, 0, 74, 0, 72, 74, 0, 76, 0, 0,
  72, 0, 76, 79, 0, 76, 74, 0, 69, 0, 72, 74, 0, 72, 0, 0,
];
const chords = [[48, 55, 64], [45, 52, 60], [53, 60, 67], [55, 62, 69]];
const frequency = note => 440 * 2 ** ((note - 69) / 12);

export function createAudio(onChange) {
  let muted = true;
  let context;
  let master;
  let timer;
  let nextNote = 0;
  let step = 0;
  let activated = false;

  try { muted = localStorage.getItem(STORAGE_KEY) !== 'false'; } catch { /* Storage can be disabled. */ }

  function tone(note, start, duration, volume, type = 'triangle') {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency(note);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(volume, start + .018);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(envelope).connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + .03);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }

  function schedule() {
    if (muted || context.state !== 'running') return;
    while (nextNote < context.currentTime + .35) {
      const note = melody[step % melody.length];
      if (note) tone(note, nextNote, 1.2, .14);
      if (step % 8 === 0) {
        const chord = chords[Math.floor(step / 8) % chords.length];
        chord.forEach((pitch, index) => tone(pitch, nextNote + index * .08, 3.2, .07, 'sine'));
      }
      step++;
      nextNote += .45;
    }
    timer = window.setTimeout(schedule, 180);
  }

  async function start() {
    if (muted || !activated || document.hidden) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      if (!context) {
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = .12;
        master.connect(context.destination);
      }
      await context.resume();
      window.clearTimeout(timer);
      nextNote = context.currentTime + .08;
      schedule();
    } catch { /* The visual controls remain usable if audio is unavailable. */ }
  }

  function stop() {
    window.clearTimeout(timer);
    if (context?.state === 'running') context.suspend().catch(() => {});
  }

  function update() {
    onChange(muted);
    try { localStorage.setItem(STORAGE_KEY, String(muted)); } catch { /* Optional persistence. */ }
  }

  // Even a remembered "sound on" preference waits for an actual user gesture.
  document.addEventListener('click', () => { activated = true; start(); }, { once: true, capture: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  window.addEventListener('pagehide', stop);
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
      const now = context.currentTime;
      tone(kind === 'hover' ? 76 : 72, now, .09, .16, 'sine');
      if (kind === 'click') tone(79, now + .055, .14, .13, 'sine');
    },
  };
}
