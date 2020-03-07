import * as Tone from 'tone';

const delay = new Tone.FeedbackDelay();
const reverb = new Tone.Freeverb();
const phaser = new Tone.Phaser();
const chorus = new Tone.Chorus();
const distortion = new Tone.Distortion();
const bitcrusher = new Tone.BitCrusher();
const autofilter = new Tone.AutoFilter();
const pingpong = new Tone.PingPongDelay();
const pitchShift = new Tone.PitchShift();

delay.wet.value = .5;
delay.id = 0;
delay.name = 'FeedbackDelay';

reverb.wet.value = 1;
reverb.id = 1;
reverb.name = 'Freeverb';

phaser.wet.value = 1;
phaser.id = 2;
phaser.name = 'Phaser';

chorus.wet.value = 1;
chorus.id = 3;
chorus.name = 'chorus';

distortion.wet.value = 1;
distortion.id = 4;
distortion.name = 'distortion';

bitcrusher.wet.value = 1;
bitcrusher.id = 5;
bitcrusher.name = 'bitcrusher';

autofilter.wet.value = 1;
autofilter.id = 6;
autofilter.name = 'autofilter';

pingpong.wet.value = .5;
pingpong.id = 7;
pingpong.name = 'PingPongDelay';

pitchShift.wet.value = .5;
pitchShift.id = 8;
pitchShift.name = 'PitchShift';
pitchShift.pitch = 3;

export const effects = [
    delay,
    reverb,
    phaser,
    chorus,
    distortion,
    bitcrusher,
    autofilter,
    pingpong,
    pitchShift
];
