import React from 'react';
import './CircularTextLogo.scss';
import LoadingSVG from './LoadingSVG';

const CircularTextLogo = () => {
  const text = "Pierre Letellier - Concepteur 3D & Designer  ";
  const letters = text.split('');

  return (
    <div className="circular-container">
      <LoadingSVG />
      <div className="circular-text">
        {letters.map((letter, i) => (
          <span
            key={i}
            style={{ transform: `rotate(${i * (360 / letters.length)}deg)` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CircularTextLogo;
