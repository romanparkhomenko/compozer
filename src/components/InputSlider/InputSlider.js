import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Knob } from '../index';
import { colors } from '../../styles';

export const InputSlider = props => {
  const [state, setState] = useState(props.initialValue);
  const handleSliderChange = e => {
    setState(e);
    props.handleChange(e.toFixed(1));
  };
  return (
    <div className={props.className}>
      <Knob
        size={60}
        numTicks={20}
        degrees={260}
        min={props.minValue}
        max={props.maxValue}
        value={state}
        color
        onChange={e => handleSliderChange(e)}
      />
      <p className="effect-label">{props.label}</p>
    </div>
  );
};

InputSlider.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledInputSlider = styled(InputSlider)`
  flex: 1 0 100px;
  display: flex;
  flex-flow: column;
  align-items: center;
  margin: 5px 10px;
  p.effect-label {
    text-align: center;
    color: white;
    margin: 0 0 0;
    z-index: 1;
    top: 1.25rem;
    position: relative;
  }

  .knob {
    display: flex;
    justify-content: center;
    position: relative;
  }
  .knob .ticks {
    position: absolute;
    top: -2px;
    left: -9px;
  }
  .knob .ticks .tick {
    position: absolute;
    background: black;
    box-shadow: inset 0 0 0 0 black;
    width: 3px;
    transition: box-shadow 0.5s;
  }
  .knob .ticks .tick.active {
    box-shadow: inset 0 0 5px 2px #509eec, 0 0 0 1px #369;
  }
  .knob.outer {
    border-radius: 50%;
    border: 1px solid #222;
    border-bottom: 5px solid #222;
    background-image: linear-gradient(125deg, ${colors.boulder} 0%, ${colors.battleship} 100%);
    box-shadow: 0 5px 15px 2px black, 0 0 5px 3px black, 0 0 0 12px #444;
  }
  .knob.inner {
    border-radius: 50%;
  }
  .knob.inner .grip {
    position: absolute;
    width: 5%;
    height: 5%;
    bottom: 2%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    background: #509eec;
    box-shadow: 0 0 3px 1px black;
    display: flex;
    justify-content: center;
  }
  p#knob-value-display {
    position: absolute;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 2px;
    color: white;
  }
`;

export default styledInputSlider;
