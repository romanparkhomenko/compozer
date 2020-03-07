import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { InputSlider } from '../index';
import { colors } from '../../styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const InstrumentControls = ({ className, customInstrument, children }) => {
  const [showControls, setShowControls] = useState(true);
  const allowedEffects = [
    'oscillator',
    'envelope',
    'attack',
    'release',
    'sustain',
    'decay',
    'attackNoise',
    'dampening',
    'resonance',
    'filter',
    'Q',
    'type',
    'rolloff',
    'filterEnvelope',
    'baseFrequency',
    'octaves',
    'exponent',
    'harmoncity',
    'modulationIndex',
    'modulation',
    'modulationEnvelope',
  ];

  // If instrument has voices, perform effect changes on the voices.
  const hasVoices = !!customInstrument.voices;
  const controls = [];

  if (!hasVoices) {
    Object.keys(customInstrument).map(key => {
      if (allowedEffects.includes(key)) {
        controls.push(key);
      }
    });
  } else {
    Object.keys(customInstrument.voices[0]).map(key => {
      if (allowedEffects.includes(key)) {
        controls.push(key);
        const voiceProp = customInstrument.voices[0];
        customInstrument[key] = voiceProp[key];
      }
    });
  }

  const handleOscillator = oscillatorValue => {
    if (customInstrument.oscillator) {
      customInstrument.oscillator.type = oscillatorValue;
    }
    if (customInstrument.voices) {
      for (let i = 0; i < customInstrument.voices.length; i++) {
        customInstrument.voices[i].oscillator.type = oscillatorValue;
      }
    }
  };

  const handleChange = (control, controlProp, key, value) => {
    controlProp[key] = parseFloat(value);
    if (customInstrument.voices) {
      for (let i = 0; i < customInstrument.voices.length; i++) {
        const voice = customInstrument.voices[i];
        const voiceProp = voice[control];
        voiceProp[key] = parseFloat(value);
      }
    } else if (customInstrument[control]) {
      const effectControl = customInstrument[control];
      const effectProp = effectControl[key];
      if (effectProp) {
        if (effectProp.value) {
          effectProp.value = parseFloat(value);
        } else {
          effectControl[key] = parseFloat(value);
        }
      } else {
        customInstrument[control] = controlProp;
      }
    }
  };

  const renderControls = () =>
    controls.map(control => (
      <div className="control-block" key={`${control}block`}>
        <h3>{control.toUpperCase()}</h3>
        <div className="controls">
          {typeof customInstrument[control] !== 'object' && (
            <InputSlider
              className="effect-slider"
              label={control}
              key={control}
              initialValue={customInstrument[control]}
              step={0.1}
              minValue={0.1}
              maxValue={12}
              handleChange={value => {
                customInstrument[control] = value;
              }}
            />
          )}

          {Object.keys(customInstrument[control]).map(key => {
            if (allowedEffects.includes(key)) {
              const controlProp = customInstrument[control];
              const hasValue = !!controlProp.value;
              let maxValue = 3;
              let minValue = 0.1;
              if (hasValue) {
                // eslint-disable-next-line prefer-destructuring
                minValue = controlProp.minValue;
                maxValue = controlProp.maxValue > 3000 ? 5000 : controlProp.maxValue;
              }
              return (
                <InputSlider
                  label={key}
                  initialValue={controlProp[key]}
                  step={0.1}
                  minValue={minValue}
                  maxValue={maxValue}
                  key={key}
                  handleChange={value => handleChange(control, controlProp, key, value)}
                />
              );
            }
          })}

          {control === 'oscillator' && (
            <>
              <button onClick={() => handleOscillator('sine')}>Sine</button>
              <button onClick={() => handleOscillator('amsine')}>AM Sine</button>
              <button onClick={() => handleOscillator('fmsine')}>FM Sine</button>
              <button onClick={() => handleOscillator('fatsine')}>Fat Sine</button>

              <button onClick={() => handleOscillator('triangle')}>Triangle</button>
              <button onClick={() => handleOscillator('amtriangle')}>AM Triangle</button>
              <button onClick={() => handleOscillator('fmtriangle')}>FM Triangle</button>
              <button onClick={() => handleOscillator('fattriangle')}>Fat Triangle</button>

              <button onClick={() => handleOscillator('square50')}>Square</button>
              <button onClick={() => handleOscillator('amsquare')}>AM Square</button>
              <button onClick={() => handleOscillator('fmsquare')}>FM Square</button>
              <button onClick={() => handleOscillator('fatsquare')}>Fat Square</button>

              <button onClick={() => handleOscillator('sawtooth')}>Sawtooth</button>
              <button onClick={() => handleOscillator('amsawtooth')}>AM Sawtooth</button>
              <button onClick={() => handleOscillator('fmsawtooth')}>FM Sawtooth</button>
              <button onClick={() => handleOscillator('fatsawtooth')}>Fat Sawtooth</button>
            </>
          )}
        </div>
      </div>
    ));

  return (
    <div className={className}>
      <div className="control-selection">
        <p className="show-controls" onClick={() => setShowControls(!showControls)}>
          {showControls ? 'Hide' : 'Show'} Instrument Controls
          <FontAwesomeIcon icon={faChevronUp} rotation={showControls ? 180 : null} />
        </p>
        <div className={showControls ? 'control-grid open' : 'control-grid'}>
          {renderControls()}
          {children}
        </div>
      </div>
    </div>
  );
};

InstrumentControls.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledInstrumentControls = styled(InstrumentControls)`
  position: relative;

  .control-selection {
    background: #006992;
    padding: 0 1rem 1rem;
    margin-top: -1rem;
  }
  
  p.show-controls {
    width 95%;
    margin: 0 auto;
    color: white;
    text-align: center;
    cursor: pointer;
    padding: 1rem 0;
    svg {margin-left: 10px;}
  }

  .control-grid {
    display: none;
    &.open {
      display: flex;
    }
    flex-flow: row wrap;
    justify-content: center;
  }
  
  div.control-block {
    flex: 1 0 auto;
    margin: 0.5rem 5px;
    padding: 1rem;
    background: ${colors.orange};
    border-radius: 10px;
    box-shadow: 4px 8px 6px rgba(0,0,0,0.6);
    width: 42.5%;
    h3 {
      font-size: 1rem;
      text-align: center;
      color: white;
      margin: 0 auto;
      text-transform: uppercase;
    }
  }
  
  .controls {
    display: flex;
    justify-content: center;
    // align-items: center;
    width: 95%;
    flex-flow: column;
    margin: 1rem auto 0;
    > div {
      display: flex;
      margin: 0 auto 1rem;
      padding: 1rem;
      width: 95%;
    }
    button {
      flex: 1 0 auto;
      -webkit-appearance: none;
      padding: 0.5rem 1rem;
      margin: 5px auto;
      width: 100%;
      max-width: 125px;
      font-size: 0.9rem;
      font-weight: 700;
      color: white;
      transition: all 250ms;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      background: ${colors.seablue};
      &:hover {
        background: ${colors.oxford};
        transition: all 250ms;
      }
    }
  }
`;

export default styledInstrumentControls;
