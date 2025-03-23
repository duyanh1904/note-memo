// src/PacmanGame.jsx
import React, { useRef, useEffect } from 'react';
import './style.css'; // Import the CSS file
import PacmanGame from './logic';

const Pacman = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 300;
    canvas.height = 220;

    gameRef.current = new PacmanGame(canvas);

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="pacman-container">
      <h1 className="pacman-title">Pacman Game</h1>
      <canvas
        ref={canvasRef}
        className="pacman-canvas"
      />
      <p className="instructions">Swipe to move Pink Pacman (mobile) or use arrow keys (desktop)</p>
    </div>
  );
};

export default Pacman;
