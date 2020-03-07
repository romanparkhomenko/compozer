import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Select from 'react-select';
import { effects } from '../../utilities/effects';
import { colors } from '../../styles';
import { useAudioEffects } from '../../hooks';
import { InputSlider } from '../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

export const Plugins = ({ className, customInstrument, children }) => {
  const [showControls, setShowControls] = useState(false);
  const allowedEffects = [
    'oscillator',
    'envelope',
    'curve',
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
    'roomSize',
    'wet',
    'feedback',
    'delayTime',
  ];
  const [selectedEffect, setSelectedEffect] = useState(0);
  const audioEffects = useAudioEffects([]);
  const options = effects.map((option, index) => ({ value: option.id, label: option.name }));

  const effectValues = audioEffects.value;
  if (effectValues !== null && effectValues.length > 0) {
    for (let i = 0; i < effectValues.length; i++) {
      if (effectValues[i]) {
        customInstrument.chain(effectValues[i].toMaster());
      }
    }
  }

  const customEffectChain = {};
  const controls = [];
  effectValues.map(effect => {
    const { name } = effect;
    controls.push(name);
    customEffectChain[name] = effect;
  });

  const handleAddEffect = () => {
    audioEffects.add(effects[selectedEffect]);
    setShowControls(true);
  };

  const handleRemoveEffect = effect => {
    effect.disconnect();
    audioEffects.removeById(effect.id);
  };

  const handleChange = (control, key, value) => {
    const effectControl = customEffectChain[control];
    const effectProp = effectControl[key];
    if (effectProp) {
      effectProp.value = parseFloat(value);
    }
  };

  const renderControls = () =>
    controls.map(control => (
      <div className="control-block" key={`${control}block`}>
        <h3>{control.toUpperCase()}</h3>
        <div className="controls">
          {Object.keys(customEffectChain[control]).map(key => {
            if (allowedEffects.includes(key)) {
              const controlType = customEffectChain[control];
              const controlProp = controlType[key];
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
                  initialValue={hasValue ? controlProp.value : controlProp}
                  step={maxValue > 3000 ? 1 : 0.1}
                  minValue={minValue}
                  maxValue={maxValue}
                  key={key}
                  handleChange={value => handleChange(control, key, value)}
                />
              );
            }
          })}
        </div>
        <button
          className="remove-effect-button"
          onClick={() => handleRemoveEffect(customEffectChain[control])}
        >
          Remove
        </button>
      </div>
    ));

  return (
    <div className={className}>
      <div className="plugin-selection">
        <div className="title">
          <h3>Chain some plugins from the list and customize their effects below.</h3>
        </div>

        <div className="select-menu">
          <Select
            onChange={e => setSelectedEffect(parseInt(e.value))}
            placeholder="FeedbackDelay"
            options={options}
          />
          <button onClick={() => handleAddEffect()}>Add Effect</button>
        </div>
      </div>

      <div className="control-selection">
        <p className="show-controls" onClick={() => setShowControls(!showControls)}>
          {showControls ? 'Hide' : 'Show'} Plugin Controls
          <FontAwesomeIcon icon={faChevronUp} rotation={showControls ? 180 : null} />
        </p>
        <div className={showControls ? 'control-grid open' : 'control-grid'}>
          {effectValues.length > 0 ? renderControls() : <p>Add some effects to get started!</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

Plugins.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledEffect = styled(Plugins)`
  position: relative;

  div.plugin-selection {
    background: ${colors.koamaru};
    padding: 1rem 0.5rem;
    display: flex;
    flex-flow: column;
  }

  div.title {
    padding: 0.5rem;
    text-align: center;
    color: white;
    h3 {
      font-size: 1rem;
      margin: 0;
    }
    span.disclaimer {
      display: block;
      font-size: 0.8rem;
      font-weight: 400;
      margin-top: 10px;
    }
  }

  div.select-menu {
    position: relative;
    padding: 1rem;
    flex: 1 0 auto;
    button {
      -webkit-appearance: none;
      padding: 0.5rem 1rem;
      margin: 0.5rem auto;
      width: 100%;
      font-size: 1rem;
      font-weight: 700;
      color: white;
      transition: all 250ms;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      background: ${colors.kermit};
      &:hover {
        background: ${colors.orange};
        transition: all 250ms;
      }
    }
  }
  
  .control-selection {
    background: ${colors.koamaru};
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
    button.remove-effect-button {
      flex: 1 0 auto;
      -webkit-appearance: none;
      padding: 0.5rem 1rem;
      margin: 5px auto;
      width: 100%;
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

export default styledEffect;
