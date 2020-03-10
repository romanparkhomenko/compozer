import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { motion, useCycle } from 'framer-motion';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from '../../styles/colors';

export const Intro = ({ className }) => {
  const [audioContext, toggleAudioContext] = useCycle(false, true);
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
  };

  return (
    <div className={className}>
      <motion.div initial={false} animate={audioContext ? 'closed' : 'open'}>
        <motion.div className="start-screen" variants={controls}>
          <h2>Welcome to Compozer</h2>
          <div className="start-context">
            <button onClick={toggleAudioContext}>Get Started</button>
            <p className="warning">
              Fair warning, you may want to start with your volume at 50%. Synthesizers with effects
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              can get pretty loud. If you're on mobile, make sure your phone isn't muted.
            </p>
          </div>
          <a className="shameless-plug" href="https://github.com/romanparkhomenko/compozer">
            <span>Check it out on</span>
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

Intro.propTypes = {
  className: PropTypes.string.isRequired,
};

const styledIntro = styled(Intro)`
  .start-screen {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 105, 146, 0.9);
    z-index: 100;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    h2 {
      color: ${colors.fog};
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 2rem;
    }
    p.intro {
      color: ${colors.fog};
      font-size: 1.2rem;
      text-align: center;
      max-width: 600px;
    }
    a.shameless-plug {
      position: absolute;
      bottom: 3rem;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: all 250ms;
      span {
        margin-right: 5px;
      }
      svg {
        font-size: 2rem;
      }
      &:hover {
        color: ${colors.orange};
        transition: all 250ms;
      }
    }
  }

  .start-context {
    max-width: 500px;
    width: 100%;
    margin-top: 1rem;
    p.warning {
      color: ${colors.lightyellow};
      font-size: 1.1rem;
      text-align: center;
      margin: 2rem 0;
      max-width: 500px;
    }
    button {
      -webkit-appearance: none;
      padding: 0.75rem 1rem;
      font-size: 1.2rem;
      width: 100%;
      display: block;
      margin: 0 auto;
      max-width: 300px;
      font-weight: 400;
      color: ${colors.boulder};
      transition: all 250ms;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      background: ${colors.fog};
      &:hover {
        background: ${colors.orange};
        color: ${colors.white};
        transition: all 250ms;
      }
    }
  }
`;

export default styledIntro;
