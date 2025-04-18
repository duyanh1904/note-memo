class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 15;
        this.tileCount = this.canvas.width / this.gridSize;

        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.obstacles = [];
        this.baseSpeed = 100;
        this.gameLoop = null;

        // Touch variables
        this.touchStartX = 0;
        this.touchStartY = 0;
    }

    startGame() {
        // Keyboard controls
        document.addEventListener('keydown', this.changeDirection.bind(this));

        // Touch controls
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });

        this.updateSpeed();
    }

    updateSpeed() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        const speed = Math.max(50, this.baseSpeed - this.score * 2);
        this.gameLoop = setInterval(this.game.bind(this), speed);
    }

    game() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 1;
            this.generateFood();
            this.updateSpeed();
            if (this.score % 5 === 0) this.generateObstacle();
        } else {
            this.snake.pop();
        }

        this.drawBackground();
        this.drawScore();
        this.drawObstacles();
        this.drawSnake();
        this.drawFood();

        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
    }

    // Touch handling
    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    handleTouchMove(event) {
        event.preventDefault();
        if (!this.touchStartX || !this.touchStartY) return;

        const touch = event.touches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;

        // Determine swipe direction (only if significant movement)
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
            // Horizontal swipe
            if (dx > 0 && this.dx !== -1) { // Swipe right
                this.dx = 1;
                this.dy = 0;
            } else if (dx < 0 && this.dx !== 1) { // Swipe left
                this.dx = -1;
                this.dy = 0;
            }
        } else if (Math.abs(dy) > 20) {
            // Vertical swipe
            if (dy > 0 && this.dy !== -1) { // Swipe down
                this.dx = 0;
                this.dy = 1;
            } else if (dy < 0 && this.dy !== 1) { // Swipe up
                this.dx = 0;
                this.dy = -1;
            }
        }

        // Reset touch start after processing
        this.touchStartX = 0;
        this.touchStartY = 0;
    }

    // Existing methods (unchanged except for cleanup)
    changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        switch (event.keyCode) {
            case LEFT_KEY:
                if (this.dx !== 1) { this.dx = -1; this.dy = 0; }
                break;
            case UP_KEY:
                if (this.dy !== 1) { this.dx = 0; this.dy = -1; }
                break;
            case RIGHT_KEY:
                if (this.dx !== -1) { this.dx = 1; this.dy = 0; }
                break;
            case DOWN_KEY:
                if (this.dy !== -1) { this.dx = 0; this.dy = 1; }
                break;
        }
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#00ff9d' : '#00cc7a';
            this.ctx.beginPath();
            this.ctx.arc(
                segment.x * this.gridSize + this.gridSize / 2,
                segment.y * this.gridSize + this.gridSize / 2,
                this.gridSize / 2 - 1,
                0,
                Math.PI * 2
            );
            this.ctx.fill();

            if (index === 0) {
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(
                    segment.x * this.gridSize + this.gridSize / 3,
                    segment.y * this.gridSize + this.gridSize / 3,
                    2,
                    0,
                    Math.PI * 2
                );
                this.ctx.arc(
                    segment.x * this.gridSize + this.gridSize * 2 / 3,
                    segment.y * this.gridSize + this.gridSize / 3,
                    2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        });
    }

    drawFood() {
        this.ctx.fillStyle = '#ff4757';
        this.ctx.beginPath();
        const pulse = Math.sin(Date.now() / 200) * 2 + this.gridSize / 2;
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            pulse,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    drawObstacles() {
        this.ctx.fillStyle = '#e63946';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x * this.gridSize,
                obstacle.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });
    }

    drawScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    generateFood() {
        this.food.x = Math.floor(Math.random() * this.tileCount);
        this.food.y = Math.floor(Math.random() * this.tileCount);
    }

    generateObstacle() {
        const obstacle = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        if (!this.snake.some(s => s.x === obstacle.x && s.y === obstacle.y) &&
            !(obstacle.x === this.food.x && obstacle.y === this.food.y)) {
            this.obstacles.push(obstacle);
        }
    }

    checkCollision(head) {
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) return true;
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) return true;
        }
        return this.obstacles.some(obstacle => head.x === obstacle.x && head.y === obstacle.y);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Game Over! Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
    }
}

export default SnakeGame;