import Tone from 'tone';

export const vol = new Tone.Volume().toMaster();
export const gain = new Tone.Gain(0.5).toMaster();

let fm = new Tone.FMSynth({
  harmonicity: 3.01,
  modulationIndex: 14,
  oscillator: {
    type: 'triangle',
  },
  envelope: {
    attack: 0.2,
    decay: 0.3,
    sustain: 0.1,
    release: 1.2,
  },
  modulation: {
    type: 'square',
  },
  modulationEnvelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.2,
    release: 0.1,
  },
}).chain(gain, vol);
fm.id = 5;
fm.name = 'fm';

let membrane = new Tone.MembraneSynth().chain(gain, vol);
membrane.id = 1;
membrane.name = 'membrane';

let am = new Tone.AMSynth().chain(gain, vol);
am.id = 2;
am.name = 'am';

let pluck = new Tone.PluckSynth().chain(gain, vol);
pluck.id = 3;
pluck.name = 'pluck';

let duo = new Tone.DuoSynth().chain(gain, vol);
duo.id = 4;
duo.name = 'duo';

let poly = new Tone.PolySynth(10, Tone.Synth, {
  oscillator: {
    type: 'fatsawtooth50',
    count: 3,
    spread: 30,
  },
  envelope: {
    attack: 0.2,
    decay: 0.1,
    sustain: 0.1,
    release: 0.1,
    attackCurve: 'exponential',
  },
}).chain(gain, vol);

poly.id = 0;
poly.name = 'poly';

let fmBass = new Tone.FMSynth().chain(gain, vol);
fmBass.id = 6;
fmBass.name = 'fmBass';

let membraneBass = new Tone.MembraneSynth().chain(gain, vol);
membraneBass.id = 7;
membraneBass.name = 'membraneBass';

let amBass = new Tone.AMSynth({
  volume: -18,
  harmonicity: 3.999,
  oscillator: {
    type: 'square',
  },
  envelope: {
    attack: 0.03,
    decay: 0.3,
    sustain: 0.7,
    release: 0.8,
  },
  modulation: {
    volume: 12,
    type: 'square6',
  },
  modulationEnvelope: {
    attack: 2,
    decay: 3,
    sustain: 0.8,
    release: 0.1,
  },
}).chain(gain, vol);
amBass.id = 8;
amBass.name = 'amBass';

let pluckBass = new Tone.Synth({
  portamento: 0.0,
  oscillator: {
    type: 'square4',
  },
  envelope: {
    attack: 2,
    decay: 1,
    sustain: 0.2,
    release: 2,
  },
}).chain(gain, vol);
pluckBass.id = 9;
pluckBass.name = 'pluckBass';

let duoBass = new Tone.DuoSynth().chain(gain, vol);
duoBass.id = 10;
duoBass.name = 'duoBass';

let polyBass = new Tone.PolySynth().chain(gain, vol);
polyBass.id = 11;
polyBass.name = 'polyBass';

let bass = new Tone.MonoSynth({
  portamento: 0.08,
  oscillator: {
    partials: [2, 1, 3, 2, 0.4],
  },
  filter: {
    Q: 4,
    type: 'lowpass',
    rolloff: -48,
  },
  envelope: {
    attack: 0.04,
    decay: 0.06,
    sustain: 0.4,
    release: 0.1,
  },
  filterEnvelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.6,
    release: 1.5,
    baseFrequency: 50,
    octaves: 3.4,
  },
}).toMaster();
bass.id = 12;
bass.name = 'bass';

let salamander = new Tone.Sampler(
  {
    A0: 'A0.[mp3|ogg]',
    C1: 'C1.[mp3|ogg]',
    'D#1': 'Ds1.[mp3|ogg]',
    'F#1': 'Fs1.[mp3|ogg]',
    A1: 'A1.[mp3|ogg]',
    C2: 'C2.[mp3|ogg]',
    'D#2': 'Ds2.[mp3|ogg]',
    'F#2': 'Fs2.[mp3|ogg]',
    A2: 'A2.[mp3|ogg]',
    C3: 'C3.[mp3|ogg]',
    'D#3': 'Ds3.[mp3|ogg]',
    'F#3': 'Fs3.[mp3|ogg]',
    A3: 'A3.[mp3|ogg]',
    C4: 'C4.[mp3|ogg]',
    'D#4': 'Ds4.[mp3|ogg]',
    'F#4': 'Fs4.[mp3|ogg]',
    A4: 'A4.[mp3|ogg]',
    C5: 'C5.[mp3|ogg]',
    'D#5': 'Ds5.[mp3|ogg]',
    'F#5': 'Fs5.[mp3|ogg]',
    A5: 'A5.[mp3|ogg]',
    C6: 'C6.[mp3|ogg]',
    'D#6': 'Ds6.[mp3|ogg]',
    'F#6': 'Fs6.[mp3|ogg]',
    A6: 'A6.[mp3|ogg]',
    C7: 'C7.[mp3|ogg]',
    'D#7': 'Ds7.[mp3|ogg]',
    'F#7': 'Fs7.[mp3|ogg]',
    A7: 'A7.[mp3|ogg]',
    C8: 'C8.[mp3|ogg]',
  },
  {
    release: 1,
    baseUrl: './audio/salamander/',
  },
).chain(gain, vol);
salamander.id = 13;
salamander.name = 'salamander';

export const instruments = [
  poly,
  membrane,
  am,
  pluck,
  duo,
  fm,
  fmBass,
  membraneBass,
  amBass,
  pluckBass,
  duoBass,
  polyBass,
  bass,
  salamander,
];
