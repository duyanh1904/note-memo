class PacmanGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = 20;
    this.tileSize = 20;
    this.isGameOver = false;

    this.pacman = {
      x: 1,
      y: 1,
      direction: 'right',
      speed: 0.1,
      mouthAngle: 0,
      mouthOpening: true
    };

    this.ghost = {
      x: 13,
      y: 8,
      speed: 0.08,
      color: 'red'
    };

    this.map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    this.gameLoop = null;
    this.touchStart = { x: null, y: null };
    this.initControls();
    this.start();
  }

  initControls() {
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };

    document.addEventListener('keydown', (e) => {
      if (keyMap[e.key]) this.pacman.direction = keyMap[e.key];
    });

    const touchHandler = {
      start: (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStart = { x: touch.clientX, y: touch.clientY };
      },
      move: (e) => {
        e.preventDefault();
        if (this.touchStart.x === null) return;
        const touch = e.touches[0];
        this.handleTouch(touch.clientX, touch.clientY);
      },
      end: (e) => {
        e.preventDefault();
        this.touchStart = { x: null, y: null };
      }
    };

    this.canvas.addEventListener('touchstart', touchHandler.start);
    this.canvas.addEventListener('touchmove', touchHandler.move);
    this.canvas.addEventListener('touchend', touchHandler.end);
  }

  handleTouch(touchX, touchY) {
    const dx = touchX - this.touchStart.x;
    const dy = touchY - this.touchStart.y;
    const threshold = 20;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      this.pacman.direction = dx > 0 ? 'right' : 'left';
      this.touchStart.x = touchX;
    } else if (Math.abs(dy) > threshold) {
      this.pacman.direction = dy > 0 ? 'down' : 'up';
      this.touchStart.y = touchY;
    }
  }

  movePacman() {
    if (this.isGameOver) return;

    const { direction, speed } = this.pacman;
    let newX = this.pacman.x + (direction === 'right' ? speed : direction === 'left' ? -speed : 0);
    let newY = this.pacman.y + (direction === 'down' ? speed : direction === 'up' ? -speed : 0);

    if (this.canMove(newX, newY)) {
      this.pacman.x = newX;
      this.pacman.y = newY;
    }

    this.pacman.mouthAngle += this.pacman.mouthOpening ? 0.1 : -0.1;
    this.pacman.mouthOpening = this.pacman.mouthAngle >= 0.5 ? false : this.pacman.mouthAngle <= 0 ? true : this.pacman.mouthOpening;
  }

  moveGhost() {
    if (this.isGameOver) return;

    const dx = this.pacman.x - this.ghost.x;
    const dy = this.pacman.y - this.ghost.y;
    const { speed } = this.ghost;
    let newX = this.ghost.x + (Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) * speed : 0);
    let newY = this.ghost.y + (Math.abs(dy) >= Math.abs(dx) ? Math.sign(dy) * speed : 0);

    if (this.canMove(newX, newY)) {
      this.ghost.x = newX;
      this.ghost.y = newY;
    }

    if (this.checkCollision()) this.endGame();
  }

  canMove(x, y) {
    const corners = [
      [x, y],
      [x + 0.9, y],
      [x, y + 0.9],
      [x + 0.9, y + 0.9]
    ];
    return corners.every(([cx, cy]) => !this.isWall(cx, cy));
  }

  isWall(x, y) {
    const gridX = Math.floor(x);
    const gridY = Math.floor(y);
    return gridX < 0 || gridX >= this.map[0].length ||
        gridY < 0 || gridY >= this.map.length ||
        this.map[gridY][gridX] === 1;
  }

  checkCollision() {
    const dx = Math.abs(this.pacman.x - this.ghost.x);
    const dy = Math.abs(this.pacman.y - this.ghost.y);
    return dx < 0.5 && dy < 0.5;
  }

  endGame() {
    this.isGameOver = true;
    this.stop();
    this.showGameOver();
  }

  showGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2 - 20);

    this.ctx.font = '20px Arial';
    this.ctx.fillText('Click to restart', this.canvas.width/2, this.canvas.height/2 + 20);

    this.canvas.addEventListener('click', () => this.restart(), { once: true });
  }

  restart() {
    this.isGameOver = false;
    this.pacman = { ...this.pacman, x: 1, y: 1, direction: 'right', mouthAngle: 0, mouthOpening: true };
    this.ghost = { ...this.ghost, x: 13, y: 8 };
    this.start();
  }

  drawMap() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.ctx.fillStyle = this.map[y][x] === 1 ? 'blue' : 'white';
        this.ctx.fillRect(
            x * this.tileSize + (this.map[y][x] === 0 ? 8 : 0),
            y * this.tileSize + (this.map[y][x] === 0 ? 8 : 0),
            this.map[y][x] === 1 ? this.tileSize : 4,
            this.map[y][x] === 1 ? this.tileSize : 4
        );
      }
    }
  }

  drawPacman() {
    const { x, y, direction, mouthAngle } = this.pacman;
    const pacX = x * this.tileSize + this.tileSize/2;
    const pacY = y * this.tileSize + this.tileSize/2;

    const angles = {
      right: [mouthAngle, 2 * Math.PI - mouthAngle],
      left: [Math.PI + mouthAngle, Math.PI - mouthAngle],
      up: [Math.PI/2 + mouthAngle, Math.PI/2 - mouthAngle],
      down: [3*Math.PI/2 + mouthAngle, 3*Math.PI/2 - mouthAngle]
    };

    this.ctx.fillStyle = '#ff69b4';
    this.ctx.beginPath();
    this.ctx.arc(pacX, pacY, this.tileSize/2, angles[direction][0], angles[direction][1]);
    this.ctx.lineTo(pacX, pacY);
    this.ctx.fill();
  }

  drawGhost() {
    const { x, y, color } = this.ghost;
    const ghostX = x * this.tileSize + this.tileSize/2;
    const ghostY = y * this.tileSize + this.tileSize/2;

    // Body
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(ghostX, ghostY - this.tileSize/4, this.tileSize/2, Math.PI, 0);
    const skirt = [[1/2, 1/2], [1/3, 1/3], [1/6, 1/2], [0, 1/3], [-1/6, 1/2], [-1/3, 1/3], [-1/2, 1/2]];
    skirt.forEach(([dx, dy]) => this.ctx.lineTo(ghostX + dx * this.tileSize, ghostY + dy * this.tileSize));
    this.ctx.fill();

    // Eyes
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    [-1/5, 1/5].forEach(dx =>
        this.ctx.arc(ghostX + dx * this.tileSize, ghostY - this.tileSize/4, this.tileSize/5, 0, Math.PI * 2)
    );
    this.ctx.fill();

    // Pupils
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    [-1/5, 1/5].forEach(dx =>
        this.ctx.arc(ghostX + dx * this.tileSize + this.tileSize/10, ghostY - this.tileSize/4, this.tileSize/10, 0, Math.PI * 2)
    );
    this.ctx.fill();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMap();
    this.drawPacman();
    this.drawGhost();
  }

  update() {
    this.movePacman();
    this.moveGhost();
    this.draw();
  }

  start() {
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.update(), 16);
  }

  stop() {
    if (this.gameLoop) clearInterval(this.gameLoop);
  }
}

export default PacmanGame;