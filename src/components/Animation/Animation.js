import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import colors from '../../styles/colors';
import { SoundCanvas } from '../index';

export const Animation = ({ className, customInstrument, isPlaying, controlsOpen, isMobile }) => {
  const [canvas, setCanvas] = useState(null);
  useEffect(() => {
    setCanvas(
      <SoundCanvas
        background={colors.fog}
        customInstrument={customInstrument}
        style={{ height: isMobile ? '50vh' : '100vh' }}
        isPlaying={isPlaying}
        controlsOpen={controlsOpen}
        isMobile={isMobile}
      />,
    );
  }, [isMobile, isPlaying, controlsOpen]);

  return <div className={className}>{canvas}</div>;
};

Animation.propTypes = {
  className: PropTypes.string.isRequired,
  customInstrument: PropTypes.object.isRequired,
};

const styledAnimation = styled(Animation)`
  position: relative;
`;

export default styledAnimation;
