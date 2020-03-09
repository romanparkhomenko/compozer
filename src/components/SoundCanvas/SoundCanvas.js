import React, { useEffect } from 'react';
import { Circle, Create, Sound, Const, Curve, Geom, Group, Num, Shaping, Rectangle } from 'pts';
import Tone from 'tone';
import { PtsCanvas, QuickStartCanvas } from 'react-pts-canvas';
import colors from '../../styles/colors';
import {
  generateFaceDude,
  generateTitle,
  generateBlankFaceDude,
  getSpaceAndPointer,
  getWaveForms,
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
    const { isPlaying } = this.props;

    getSpaceAndPointer(sound, space, form, pts);
    if (isPlaying) {
      generateFaceDude(sound, space, form, time);
    } else {
      generateBlankFaceDude(sound, space, form, time);
    }
  }
}
