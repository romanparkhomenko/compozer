import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputSlider } from '../index';
import { colors } from '../../styles';
import { compoze } from '../../hooks';

export const InstrumentControls = ({ className, customInstrument, children }) => {
  const [showControls, setShowControls] = useState(true);
  const [renderedControls, setRenderedControls] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.info(customInstrument);
    setRenderedControls(renderControls());
    setLoading(false);
  }, [customInstrument]);
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
    'harmonicity',
    'modulationIndex',
    'modulation',
    'modulationEnvelope',
    'partials',
  ];

  // If instrument has voices, perform effect changes on the voices.
  const hasVoices = !!customInstrument.voices;

  /** This is where the magic happens.
   * We dynamically create effect parameters based on the attributes
   * the instrument object has using function composition via the compoze function */
  const renderControls = () => {
    console.info('Compoze Controls called');
    if (hasVoices) {
      return compoze(
        renderControlSliders,
        getEffectParams,
        getControlEffects,
      )(customInstrument.voices[0]);
    }
    return compoze(renderControlSliders, getEffectParams, getControlEffects)(customInstrument);
  };

  const handleOscillator = (oscillatorType, oscillatorValue) => {
    if (customInstrument[oscillatorType]) {
      customInstrument[oscillatorType].type = oscillatorValue;
    }
    if (customInstrument.voices) {
      for (let i = 0; i < customInstrument.voices.length; i++) {
        const voice = customInstrument.voices[i];
        voice[oscillatorType].type = oscillatorValue;
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

  const renderControlSliders = effectParams => {
    const inputs = [];
    effectParams.map((effect, idx) => {
      if (effect.properties) {
        const propertySliders = [];
        effect.properties.map(prop => {
          propertySliders.push(
            <InputSlider
              className="effect-slider"
              label={prop.name}
              initialValue={prop.initialValue}
              step={prop.step}
              minValue={prop.minValue}
              maxValue={prop.maxValue}
              key={effect.name + prop.name + idx}
              handleChange={prop.handleChange}
            />,
          );
        });
        inputs.push({ component: propertySliders, name: effect.name });
      } else if (effect.type) {
        inputs.push({
          component: (
            <>
              <button onClick={() => handleOscillator(effect.name, 'sine')}>Sine</button>
              <button onClick={() => handleOscillator(effect.name, 'amsine')}>AM Sine</button>
              <button onClick={() => handleOscillator(effect.name, 'fmsine')}>FM Sine</button>
              <button onClick={() => handleOscillator(effect.name, 'fatsine')}>Fat Sine</button>

              <button onClick={() => handleOscillator(effect.name, 'triangle')}>Triangle</button>
              <button onClick={() => handleOscillator(effect.name, 'amtriangle')}>
                AM Triangle
              </button>
              <button onClick={() => handleOscillator(effect.name, 'fmtriangle')}>
                FM Triangle
              </button>
              <button onClick={() => handleOscillator(effect.name, 'fattriangle')}>
                Fat Triangle
              </button>

              <button onClick={() => handleOscillator(effect.name, 'square50')}>Square</button>
              <button onClick={() => handleOscillator(effect.name, 'amsquare')}>AM Square</button>
              <button onClick={() => handleOscillator(effect.name, 'fmsquare')}>FM Square</button>
              <button onClick={() => handleOscillator(effect.name, 'fatsquare')}>Fat Square</button>

              <button onClick={() => handleOscillator(effect.name, 'sawtooth')}>Sawtooth</button>
              <button onClick={() => handleOscillator(effect.name, 'amsawtooth')}>
                AM Sawtooth
              </button>
              <button onClick={() => handleOscillator(effect.name, 'fmsawtooth')}>
                FM Sawtooth
              </button>
              <button onClick={() => handleOscillator(effect.name, 'fatsawtooth')}>
                Fat Sawtooth
              </button>
            </>
          ),
          name: effect.name,
        });
      } else {
        inputs.push({
          component: (
            <InputSlider
              className="effect-slider"
              label={effect.name}
              initialValue={effect.initialValue}
              step={effect.step}
              minValue={effect.minValue}
              maxValue={effect.maxValue}
              key={effect.name}
              handleChange={effect.handleChange}
            />
          ),
          name: effect.name,
        });
      }
    });

    return (
      <>
        {inputs.map(input => (
          <div className="control-block" key={`${input.name}input`}>
            <h3>{input.name.toUpperCase()}</h3>
            <div className="controls">{input.component}</div>
          </div>
        ))}
      </>
    );
  };

  const getEffectParams = effectData => {
    const effectParams = [];
    effectData.effects.map(effect => {
      const effectObject = { name: effect.name ? effect.name : effect };
      const isObject = typeof effect === 'object';
      const hasValue = !!effect.value;
      const hasType = !!effect.type;
      const maxValue = 3;
      const minValue = 0.1;
      const step = 0.1;

      if (hasType) {
        effectObject.type = effect.type;
      } else if (!isObject) {
        const { instrument } = effectData;
        effectObject.initialValue = instrument[effect];
        effectObject.minValue = minValue;
        effectObject.maxValue = instrument[effect] + 10;
        effectObject.step = 0.1;
        effectObject.handleChange = value => {
          customInstrument[effect] = value;
        };
      } else if (hasValue) {
        effectObject.initialValue = effect.value;
        effectObject.minValue = effect.minValue;
        effectObject.maxValue = effect.maxValue > 3000 ? 5000 : effect.maxValue;
        effectObject.step = effect.maxValue > 3000 ? 1 : step;
        effectObject.handleChange = value => handleChange(effect.name, effect, 'value', value);
      } else {
        const effectProperties = [];
        Object.keys(effect).map(key => {
          if (allowedEffects.includes(key)) {
            const effectWithParams = { name: key };
            effectWithParams.initialValue = effect[key];
            effectWithParams.minValue = minValue;
            effectWithParams.maxValue = effect[key] > 3000 ? 5000 : maxValue;
            effectWithParams.step = effect[key] > 3000 ? 1 : step;
            effectWithParams.handleChange = value => handleChange(effect.name, effect, key, value);
            effectProperties.push(effectWithParams);
          }
        });
        effectObject.properties = effectProperties;
      }

      effectParams.push(effectObject);
    });

    return effectParams;
  };

  const getControlEffects = instrument => {
    const effects = [];
    Object.keys(instrument).map(effect => {
      if (allowedEffects.includes(effect)) {
        if (typeof instrument[effect] === 'object') {
          instrument[effect].name = effect;
          effects.push(instrument[effect]);
        } else {
          effects.push(effect);
        }
      }
    });
    return { effects, instrument };
  };

  return (
    <div className={className}>
      <div className="control-selection">
        <p className="show-controls" onClick={() => setShowControls(!showControls)}>
          {showControls ? 'Hide' : 'Show'} Instrument Controls
          <FontAwesomeIcon icon={faChevronUp} rotation={showControls ? 180 : null} />
        </p>
        <div className={showControls ? 'control-grid open' : 'control-grid'}>
          {!loading && renderedControls}
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
