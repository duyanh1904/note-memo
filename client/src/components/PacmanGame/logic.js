class PacmanGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = 20;
    this.tileSize = 20;

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
    this.touchStartX = null;
    this.touchStartY = null;
    this.initControls();
    this.start();
  }

  initControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp': this.pacman.direction = 'up'; break;
        case 'ArrowDown': this.pacman.direction = 'down'; break;
        case 'ArrowLeft': this.pacman.direction = 'left'; break;
        case 'ArrowRight': this.pacman.direction = 'right'; break;
      }
    });

    // Enhanced touch controls for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleTouch(touch.clientX, touch.clientY);
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touchStartX = null;
      this.touchStartY = null;
    });
  }

  handleTouch(touchX, touchY) {
    if (this.touchStartX === null || this.touchStartY === null) return;

    const dx = touchX - this.touchStartX;
    const dy = touchY - this.touchStartY;
    const threshold = 20; // Minimum distance to register a swipe

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      this.pacman.direction = dx > 0 ? 'right' : 'left';
      this.touchStartX = touchX; // Reset start point for continuous movement
    } else if (Math.abs(dy) > threshold) {
      this.pacman.direction = dy > 0 ? 'down' : 'up';
      this.touchStartY = touchY; // Reset start point for continuous movement
    }
  }

  movePacman() {
    let newX = this.pacman.x;
    let newY = this.pacman.y;

    switch(this.pacman.direction) {
      case 'up': newY -= this.pacman.speed; break;
      case 'down': newY += this.pacman.speed; break;
      case 'left': newX -= this.pacman.speed; break;
      case 'right': newX += this.pacman.speed; break;
    }

    const pacmanSize = this.tileSize / 2;
    const left = newX * this.tileSize;
    const right = (newX + 1) * this.tileSize - 1;
    const top = newY * this.tileSize;
    const bottom = (newY + 1) * this.tileSize - 1;

    const topLeft = this.isWall(left / this.tileSize, top / this.tileSize);
    const topRight = this.isWall(right / this.tileSize, top / this.tileSize);
    const bottomLeft = this.isWall(left / this.tileSize, bottom / this.tileSize);
    const bottomRight = this.isWall(right / this.tileSize, bottom / this.tileSize);

    if (!topLeft && !topRight && !bottomLeft && !bottomRight) {
      this.pacman.x = newX;
      this.pacman.y = newY;
    }

    this.pacman.mouthAngle += this.pacman.mouthOpening ? 0.1 : -0.1;
    if (this.pacman.mouthAngle >= 0.5) this.pacman.mouthOpening = false;
    if (this.pacman.mouthAngle <= 0) this.pacman.mouthOpening = true;
  }

  moveGhost() {
    const dx = this.pacman.x - this.ghost.x;
    const dy = this.pacman.y - this.ghost.y;

    let newGhostX = this.ghost.x;
    let newGhostY = this.ghost.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      newGhostX += dx > 0 ? this.ghost.speed : -this.ghost.speed;
    } else {
      newGhostY += dy > 0 ? this.ghost.speed : -this.ghost.speed;
    }

    if (!this.isWall(newGhostX, newGhostY)) {
      this.ghost.x = newGhostX;
      this.ghost.y = newGhostY;
    }
  }

  isWall(x, y) {
    const gridX = Math.floor(x);
    const gridY = Math.floor(y);
    return gridX < 0 || gridX >= this.map[0].length ||
      gridY < 0 || gridY >= this.map.length ||
      this.map[gridY][gridX] === 1;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === 1) {
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        } else {
          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(x * this.tileSize + 8, y * this.tileSize + 8, 4, 4);
        }
      }
    }

    // Draw Pink Pacman
    this.ctx.fillStyle = '#ff69b4';
    this.ctx.beginPath();
    const pacX = this.pacman.x * this.tileSize + this.tileSize/2;
    const pacY = this.pacman.y * this.tileSize + this.tileSize/2;
    let startAngle, endAngle;

    switch(this.pacman.direction) {
      case 'right':
        startAngle = this.pacman.mouthAngle;
        endAngle = 2 * Math.PI - this.pacman.mouthAngle;
        break;
      case 'left':
        startAngle = Math.PI + this.pacman.mouthAngle;
        endAngle = Math.PI - this.pacman.mouthAngle;
        break;
      case 'up':
        startAngle = Math.PI/2 + this.pacman.mouthAngle;
        endAngle = Math.PI/2 - this.pacman.mouthAngle;
        break;
      case 'down':
        startAngle = 3*Math.PI/2 + this.pacman.mouthAngle;
        endAngle = 3*Math.PI/2 - this.pacman.mouthAngle;
        break;
    }
    this.ctx.arc(pacX, pacY, this.tileSize/2, startAngle, endAngle);
    this.ctx.lineTo(pacX, pacY);
    this.ctx.fill();

    // Draw ghost
    const ghostX = this.ghost.x * this.tileSize + this.tileSize/2;
    const ghostY = this.ghost.y * this.tileSize + this.tileSize/2;

    this.ctx.fillStyle = this.ghost.color;
    this.ctx.beginPath();
    this.ctx.arc(ghostX, ghostY - this.tileSize/4, this.tileSize/2, Math.PI, 0);
    this.ctx.lineTo(ghostX + this.tileSize/2, ghostY + this.tileSize/2);
    this.ctx.lineTo(ghostX + this.tileSize/3, ghostY + this.tileSize/3);
    this.ctx.lineTo(ghostX + this.tileSize/6, ghostY + this.tileSize/2);
    this.ctx.lineTo(ghostX, ghostY + this.tileSize/3);
    this.ctx.lineTo(ghostX - this.tileSize/6, ghostY + this.tileSize/2);
    this.ctx.lineTo(ghostX - this.tileSize/3, ghostY + this.tileSize/3);
    this.ctx.lineTo(ghostX - this.tileSize/2, ghostY + this.tileSize/2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(ghostX - this.tileSize/5, ghostY - this.tileSize/4, this.tileSize/5, 0, Math.PI * 2);
    this.ctx.arc(ghostX + this.tileSize/5, ghostY - this.tileSize/4, this.tileSize/5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    const pupilOffset = this.tileSize/10;
    this.ctx.arc(ghostX - this.tileSize/5 + pupilOffset, ghostY - this.tileSize/4, this.tileSize/10, 0, Math.PI * 2);
    this.ctx.arc(ghostX + this.tileSize/5 + pupilOffset, ghostY - this.tileSize/4, this.tileSize/10, 0, Math.PI * 2);
    this.ctx.fill();
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
