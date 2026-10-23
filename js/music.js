/**
 * "A Little World" — an original pastoral title theme in G major.
 * Flute, plucked strings, soft bowed chords, bass, and a few mallet accents.
 * All notes and instrument waveforms are authored here; no samples are loaded.
 */
export const TEMPO = 84;
export const BEAT_SECONDS = 60 / TEMPO;
export const BAR_SECONDS = BEAT_SECONDS * 4;
export const LOOP_BARS = 24;
export const MUSIC_VOLUME = .48;

const chords = {
  G: { bass: 43, notes: [55, 59, 62, 69] },
  C: { bass: 36, notes: [55, 60, 64, 71] },
  Em: { bass: 40, notes: [55, 59, 64, 66] },
  Bm: { bass: 35, notes: [54, 59, 62, 69] },
  Am: { bass: 33, notes: [55, 60, 64, 69] },
  Dsus: { bass: 38, notes: [57, 62, 67, 69] },
  D: { bass: 38, notes: [54, 57, 62, 66] },
  GB: { bass: 35, notes: [55, 59, 62, 69] },
};

const progression = [
  'G', 'C', 'G', 'C', 'Em', 'C', 'GB', 'Dsus',
  'G', 'Bm', 'C', 'D', 'Em', 'Bm', 'C', 'G',
  'Am', 'C', 'Dsus', 'D', 'G', 'C', 'Am', 'G',
];

// Each event is [beat within the bar, duration in beats, MIDI pitch].
// Two instrumental bars introduce the theme before the flute enters.
const melody = [
  [], [],
  [[0, 1.5, 71], [1.75, .5, 69], [2.5, .75, 67], [3.5, .45, 74]],
  [[0, 1, 76], [1.5, .5, 74], [2.25, 1.5, 71]],
  [[0, .75, 71], [1, .5, 74], [1.75, 1, 76], [3, .75, 74]],
  [[0, 1, 72], [1.5, .5, 71], [2.25, 1.5, 67]],
  [[.25, .75, 69], [1.25, .5, 71], [2, 1, 74], [3.25, .5, 71]],
  [[0, 1.5, 69], [2, .5, 67], [2.75, 1, 66]],
  [[0, 1.25, 67], [1.5, .5, 71], [2.25, 1.5, 74]],
  [[.25, .75, 78], [1.25, .5, 76], [2, 1.5, 74]],
  [[0, .75, 76], [1, .5, 74], [1.75, 1, 72], [3, .75, 71]],
  [[0, 1.5, 69], [2, .5, 66], [2.75, 1, 69]],
  [[0, 1, 76], [1.5, .5, 78], [2.25, 1.5, 79]],
  [[0, 1.5, 78], [2, .5, 74], [2.75, .75, 71]],
  [[.25, .75, 72], [1.25, .75, 76], [2.5, 1, 74]],
  [[0, 1.5, 71], [2, .5, 69], [2.75, .75, 67]],
  [[0, .75, 69], [1, .5, 72], [1.75, 1.5, 76]],
  [[.25, .75, 74], [1.25, .5, 72], [2.25, 1.25, 71]],
  [[0, 1.5, 69], [2, .75, 67], [3, .75, 69]],
  [[0, 1, 66], [1.5, .5, 69], [2.25, 1.5, 74]],
  [[0, 1.5, 71], [2, .75, 69], [3, .75, 67]],
  [[0, 1.5, 64], [2, 1.5, 67]],
  [[.5, 1, 69], [2, .75, 67], [3, .75, 64]],
  [[0, 2.75, 67]],
];

const instruments = {
  harp: { harmonics: [0, 1, .46, .2, .11, .05, .025], attack: .005, decay: .16, sustain: .2 },
  flute: { harmonics: [0, 1, .19, .07, .025, .012], attack: .055, decay: .16, sustain: .82 },
  strings: { harmonics: [0, 1, .3, .16, .075, .035], attack: .55, decay: 1.3, sustain: .72 },
  bass: { harmonics: [0, 1, .22, .055], attack: .035, decay: .24, sustain: .55 },
  mallet: { harmonics: [0, 1, 0, .16, 0, .045], attack: .004, decay: .12, sustain: .12 },
};

const frequency = pitch => 440 * 2 ** ((pitch - 69) / 12);

/** Works with both a live AudioContext and an OfflineAudioContext for verification. */
export function createMusic(context, destination) {
  const input = context.createGain();
  const lowpass = context.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 5800;
  lowpass.Q.value = .5;
  const highpass = context.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 35;
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 15;
  compressor.ratio.value = 2;
  compressor.attack.value = .015;
  compressor.release.value = .25;
  input.connect(lowpass).connect(highpass).connect(compressor).connect(destination);

  // A pair of quiet, filtered stereo echoes recalls a small sampled-game soundstage.
  for (const [seconds, volume, pan] of [[.19, .16, -.45], [.32, .1, .45]]) {
    const delay = context.createDelay(1);
    delay.delayTime.value = seconds;
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2300;
    const gain = context.createGain();
    gain.gain.value = volume;
    const panner = context.createStereoPanner();
    panner.pan.value = pan;
    input.connect(delay).connect(filter).connect(gain).connect(panner).connect(compressor);
  }

  const waves = Object.fromEntries(Object.entries(instruments).map(([name, instrument]) => [
    name,
    context.createPeriodicWave(new Float32Array(instrument.harmonics.length), new Float32Array(instrument.harmonics)),
  ]));

  // Very quiet filtered breath gives the flute an airy attack, rather than a beep.
  const breath = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = breath.getChannelData(0);
  let seed = 731;
  for (let index = 0; index < samples.length; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    samples[index] = seed / 2147483648 - 1;
  }

  function note(kind, pitch, start, duration, volume, pan = 0) {
    const instrument = instruments[kind];
    const oscillator = context.createOscillator();
    oscillator.setPeriodicWave(waves[kind]);
    oscillator.frequency.value = frequency(pitch);
    const envelope = context.createGain();
    const attack = Math.min(instrument.attack, duration * .2);
    const decay = Math.min(instrument.decay, duration * .55);
    envelope.gain.setValueAtTime(.0001, start);
    envelope.gain.linearRampToValueAtTime(volume, start + attack);
    envelope.gain.exponentialRampToValueAtTime(volume * instrument.sustain, start + attack + decay);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    const panner = context.createStereoPanner();
    panner.pan.value = pan;
    oscillator.connect(envelope).connect(panner).connect(input);
    const auxiliary = [];

    if (kind === 'flute') {
      const vibrato = context.createOscillator();
      const depth = context.createGain();
      vibrato.frequency.value = 5.1;
      depth.gain.setValueAtTime(0, start);
      depth.gain.linearRampToValueAtTime(5, start + Math.min(.25, duration * .6));
      vibrato.connect(depth).connect(oscillator.detune);
      vibrato.start(start);
      vibrato.stop(start + duration);

      const air = context.createBufferSource();
      air.buffer = breath;
      air.loop = true;
      const airFilter = context.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.value = 1800;
      airFilter.Q.value = .7;
      const airGain = context.createGain();
      airGain.gain.value = .035;
      air.connect(airFilter).connect(airGain).connect(envelope);
      air.start(start);
      air.stop(start + duration);
      auxiliary.push(vibrato, depth, air, airFilter, airGain);
    }

    oscillator.start(start);
    oscillator.stop(start + duration + .02);
    oscillator.onended = () => {
      for (const node of [oscillator, envelope, panner, ...auxiliary]) node.disconnect();
    };
  }

  function scheduleBar(index, start) {
    const bar = index % LOOP_BARS;
    const chord = chords[progression[bar]];
    const ending = bar >= 20;
    const pattern = bar % 2 ? [0, 2, 1, 3, 2, 1, 3, 1] : [0, 1, 2, 1, 3, 2, 1, 2];
    const accents = [1, .62, .8, .66, .88, .6, .76, .64];
    pattern.forEach((degree, step) => {
      const timing = step % 2 ? .009 : 0;
      note('harp', chord.notes[degree], start + step * BEAT_SECONDS / 2 + timing,
        1.45, .19 * accents[step] * (ending ? .82 : 1), step % 2 ? -.28 : .2);
    });

    note('bass', chord.bass, start, BEAT_SECONDS * 2.6, .2);
    note('bass', chord.bass + 7, start + BEAT_SECONDS * 2, BEAT_SECONDS * 1.9, .1);
    chord.notes.slice(0, 3).forEach((pitch, voice) => {
      note('strings', pitch, start + voice * .012, BAR_SECONDS + .6,
        bar < 2 ? .022 : .038, (voice - 1) * .3);
    });
    melody[bar].forEach(([beat, beats, pitch], phrase) => {
      note('flute', pitch, start + beat * BEAT_SECONDS,
        beats * BEAT_SECONDS * .96 + .06, .22 * (phrase % 2 ? .88 : 1), -.04);
    });
    if (bar % 4 === 3 && !ending) {
      note('mallet', chord.notes[3] + 12, start + BEAT_SECONDS * 3, 1.8, .055, .32);
    }
  }

  return {
    scheduleBar,
    effect(kind, start) {
      note('mallet', kind === 'hover' ? 79 : 74, start, .13, .12, .08);
      if (kind === 'click') note('mallet', 81, start + .065, .2, .09, -.08);
    },
  };
}
