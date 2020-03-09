import React, { useState, useEffect } from 'react';
import Tone from 'tone';
import { Midi } from '@tonejs/midi';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Select from 'react-select';
import colors from '../../styles/colors';

export const MidiSong = ({ className, player, children, musicStarted }) => {
  useEffect(() => {
    if (musicStarted.value) {
      playMIDI();
    } else {
      stopPlaying();
    }
  }, [musicStarted]);
  const [midiFile, setMidiFile] = useState('beethoven');
  useEffect(() => {
    musicStarted.setValue(false);
    Tone.Transport.cancel(0);
    getMidi().then(midi => console.info('midi file effect'));
  }, [midiFile, player]);

  const [loading, setLoading] = useState(true);
  const [activeSong, setActiveSong] = useState(null);

  const getMidi = () =>
    Midi.fromUrl(`./audio/${midiFile}.mid`).then(midi => {
      const events = [];
      midi.tracks.forEach(track => {
        // schedule all of the events
        track.notes.forEach(note => {
          const event = {
            note: note.name,
            duration: note.duration,
            time: note.time,
            velocity: note.velocity,
          };
          events.push(event);
        });
      });

      const song = new Tone.Part((time, value) => {
        player.triggerAttackRelease(value.note, value.duration, time, value.velocity);
      }, events);

      setActiveSong(song);
      setTimeout(() => setLoading(false), 500);
    });

  const changeFile = fileName => {
    setLoading(true);
    setMidiFile(fileName);
    getMidi();
  };

  const playMIDI = () => {
    activeSong.start('+0.01s');
    Tone.Transport.start('+0.01s');
    setTimeout(() => console.info(Tone.Transport.state), 500);
  };

  const stopPlaying = () => {
    Tone.Transport.stop(Tone.now());
    console.info(Tone.Transport.state);
  };

  const options = [
    { value: 'beethoven', label: 'Beethoven' },
    { value: 'tetris', label: 'Tetris' },
  ];

  return (
    <div className={className}>
      <div className="midi-selection">
        <div className="title">
          <h3>
            1) Choose a MIDI file from the list.{' '}
            <span className="disclaimer">(It can take a second to load sometimes.)</span>
          </h3>
        </div>

        <div className="select-menu">
          <Select
            options={options}
            onChange={value => changeFile(value.value)}
            placeholder="Beethoven"
          />
          {loading && <p className="loading">Loading...</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

MidiSong.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledMidiSong = styled(MidiSong)`
  position: relative;

  div.midi-selection {
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
    p.loading {
      color: white;
      // position: absolute;
      // bottom: -2rem;
      text-align: center;
    }
  }

  div.play-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    button {
      -webkit-appearance: none;
      padding: 0.5rem 1rem;
      max-width: 100px;
      font-size: 1.2rem;
      font-weight: 700;
      color: white;
      transition: all 250ms;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      &.play-button {
        background: ${colors.kermit};
      }
      &.stop-button {
        background: ${colors.recordRed};
      }
      &:hover {
        background: ${colors.orange};
        transition: all 250ms;
      }
    }
  }
`;

export default styledMidiSong;
