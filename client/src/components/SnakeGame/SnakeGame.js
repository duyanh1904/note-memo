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

    const handleButtonDirection = (dx, dy) => {
        if (gameRef.current) {
            if (dx !== -gameRef.current.dx) {
                gameRef.current.dx = dx;
                gameRef.current.dy = dy;
            }
        }
    };

    return (
        <div className="game-container">
            <h1>Snake Game</h1>
            <canvas
                ref={canvasRef}
                id="gameCanvas"
                width="405"
                height="405"
            />
            <div className="controls">
                <button onClick={() => handleButtonDirection(0, -1)}>↑</button>
                <div>
                    <button onClick={() => handleButtonDirection(-1, 0)}>←</button>
                    <button onClick={() => handleButtonDirection(1, 0)}>→</button>
                </div>
                <button onClick={() => handleButtonDirection(0, 1)}>↓</button>
            </div>
            <div className="instructions">
                <p>Use arrow keys or swipe on desktop, buttons on mobile</p>
                <p>Avoid red obstacles and eat pulsing food!</p>
            </div>
        </div>
    );
};

export default SnakeGameComponent;