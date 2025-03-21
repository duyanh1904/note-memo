import React, { useEffect, useRef } from 'react';
import SnakeGame from './logic';
import './style.css';

const SnakeGameComponent = () => {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);

    useEffect(() => {
        gameRef.current = new SnakeGame();
        gameRef.current.startGame();

        return () => {
            if (gameRef.current && gameRef.current.gameLoop) {
                clearInterval(gameRef.current.gameLoop);
            }
        };
    }, []);

    return (
        <div className="game-container">
            <h1>Snake Game</h1>
            <canvas
                ref={canvasRef}
                id="gameCanvas"
                width="1000" // Must be multiple of gridSize (15 * 27)
                height="1000"
            />
            <div className="instructions">
                <p>Use arrow keys to control the snake</p>
                <p>Avoid red obstacles and eat pulsing food!</p>
            </div>
        </div>
    );
};

export default SnakeGameComponent;