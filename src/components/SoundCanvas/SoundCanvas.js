import React from 'react';
import { Create, Sound } from 'pts';
import Tone from 'tone';
import { PtsCanvas } from 'react-pts-canvas';
import colors from '../../styles/colors';
import {
  generateFaceDude,
  generateBlankFaceDude,
  getSpaceAndPointer,
} from '../../utilities/animations';

export default class SoundCanvas extends PtsCanvas {
  constructor(props) {
    super(props);
    this.pts = null;
    this.colorShades = [colors.oxford, colors.orange, colors.white, colors.lemonade, colors.kermit];
    this.sound = Sound.from(Tone.Master, Tone.Master.context, 'input').analyze(256);
  }

  createCanvas() {
    this.pts = Create.distributeRandom(this.space.innerBound, 200);
  }

  // Override PtsCanvas' start function
  start(space, bound) {
    this.createCanvas();
  }

  // Override PtsCanvas' resize function
  resize() {
    this.createCanvas();
  }

  // Override PtsCanvas' animate function
  animate(time, ftime) {
    const { space, form, pts, colorShades, sound } = this;
    const { isPlaying, controlsOpen, isMobile } = this.props;

    getSpaceAndPointer(sound, space, form, pts);
    if (isPlaying) {
      generateFaceDude(sound, space, form, time, controlsOpen, isMobile);
    } else {
      generateBlankFaceDude(sound, space, form, time, controlsOpen, isMobile);
    }
  }
}
