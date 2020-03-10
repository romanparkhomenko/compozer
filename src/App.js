import React, { useEffect, useRef, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import { useInstrument, usePlaying, useDimensions, useWindowWidth } from './hooks';
import { instruments } from './utilities/instruments';
import { Instrument, MidiSong, InstrumentControls, Plugins, Animation } from './components';

export const App = () => {
  const mobile = useWindowWidth();
  const instrument = useInstrument(instruments[0]);
  const customInstrument = instruments[instrument.value];
  const started = usePlaying(false);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  const controls = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: 'spring',
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: 'circle(0px at 40px 40px)',
      transition: {
        delay: 0,
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },

    short: {
      width: mobile <= 800 ? '100%' : '75%',
      right: '0',
      transition: {
        delay: 0.1,
        type: 'spring',
        stiffness: 1000,
        restDelta: 2,
        damping: 50,
      },
    },

    big: {
      width: '100%',
      right: '0',
      transition: {
        delay: 0.1,
        type: 'spring',
        stiffness: 1000,
        restDelta: 2,
        damping: 40,
      },
    },
  };

  return (
    <div className="app">
      <motion.div animate={isOpen ? 'short' : 'big'} className="animation">
        <Animation
          className="animation-container"
          customInstrument={customInstrument}
          isPlaying={started.value}
          controlsOpen={isOpen}
          isMobile={mobile <= 800}
        />

        <motion.div className="show-controls" variants={controls}>
          <button className="control-toggle" onClick={toggleOpen}>
            {isOpen ? 'HIDE' : 'SHOW'} CONTROLS
          </button>
          <button className="play-toggle" onClick={() => started.setValue(!started.value)}>
            {started.value ? 'STOP' : 'PLAY MUSIC'}
          </button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={false}
        animate={isOpen || mobile <= 800 ? 'open' : 'closed'}
        custom={height}
        ref={containerRef}
      >
        <motion.div className="controls-menu" variants={controls}>
          <MidiSong className="song-container" player={customInstrument} musicStarted={started}>
            <Instrument className="instrument" instrument={instrument}>
              <InstrumentControls className="effect" customInstrument={customInstrument} />
            </Instrument>
            <Plugins className="plugins" customInstrument={customInstrument} />
          </MidiSong>
        </motion.div>
      </motion.div>
    </div>
  );
};
