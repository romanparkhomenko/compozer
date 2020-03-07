import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import colors from '../../styles/colors';
import { SoundCanvas } from '../index';

export const Animation = ({ className, customInstrument, isPlaying, controlsOpen }) => {
  // Sound object from PTS library. This allows frequencies to be displayed
  // properly in the animation
  // const sound = Sound.from(Tone.Master, Tone.Master.context, 'input').analyze(256);

  return (
    <div className={className}>
      <SoundCanvas
        background={colors.fog}
        customInstrument={customInstrument}
        style={{ height: '100vh' }}
        isPlaying={isPlaying}
        controlsOpen={controlsOpen}
      />
    </div>
  );
};

Animation.propTypes = {
  className: PropTypes.string.isRequired,
  customInstrument: PropTypes.object.isRequired,
};

const styledAnimation = styled(Animation)`
  position: relative;
`;

export default styledAnimation;
