import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Select from 'react-select';
import { instruments } from '../../utilities/instruments';
import colors from '../../styles/colors';

export const Instrument = ({ className, instrument, children }) => {
  const options = instruments.map((option, index) => ({ value: option.id, label: option.name }));

  return (
    <div className={className}>
      <div className="instrument-selection">
        <div className="title">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <h3>2) Choose an instrument from the list and customize it's effects below.</h3>
        </div>

        <div className="select-menu">
          <Select
            onChange={instrument.onChange}
            options={options}
            placeholder="poly"
            defaultValue="0"
          />
        </div>
      </div>

      {children}
    </div>
  );
};

Instrument.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledInstrument = styled(Instrument)`
  position: relative;

  div.instrument-selection {
    background: ${colors.seablue};
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
  }
`;

export default styledInstrument;
