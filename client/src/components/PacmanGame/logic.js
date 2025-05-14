class PacmanGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = 20;
    this.tileSize = 20;
    this.isGameOver = false;

    // Initial pacman configuration
    this.pacman = {
      x: 1,
      y: 1,
      direction: 'right',
      speed: 0.1,
      mouthAngle: 0,
      mouthOpening: true,
      isPowered: false,
      powerTimer: 0
    };

    // Initial ghost configuration
    this.ghost = {
      x: 13,
      y: 8,
      speed: 0.08,
      color: 'red'
    };

    // Food items with positions and types
    this.foods = {
      fruit: { x: 7, y: 5, eaten: false, type: 'fruit' },
      burger: { x: 3, y: 3, eaten: false, type: 'burger' },
      pizza: { x: 11, y: 7, eaten: false, type: 'pizza' }
    };

    // Game map (1 = wall, 0 = path)
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

    // Game state variables
    this.gameLoop = null;
    this.touchStart = { x: null, y: null };
    
    // Initialize game
    this.initControls();
    this.start();
  }

  initControls() {
    // Keyboard controls mapping
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };

    // Add keyboard event listener
    document.addEventListener('keydown', (e) => {
      if (keyMap[e.key]) this.pacman.direction = keyMap[e.key];
    });

    // Touch controls
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

    // Add touch event listeners
    this.canvas.addEventListener('touchstart', touchHandler.start);
    this.canvas.addEventListener('touchmove', touchHandler.move);
    this.canvas.addEventListener('touchend', touchHandler.end);
  }

  handleTouch(touchX, touchY) {
    const dx = touchX - this.touchStart.x;
    const dy = touchY - this.touchStart.y;
    const threshold = 20;

    // Determine swipe direction
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
    // Calculate new position based on direction
    let newX = this.pacman.x + (direction === 'right' ? speed : direction === 'left' ? -speed : 0);
    let newY = this.pacman.y + (direction === 'down' ? speed : direction === 'up' ? -speed : 0);

    // Move if possible
    if (this.canMove(newX, newY)) {
      this.pacman.x = newX;
      this.pacman.y = newY;
    }

    // Animate mouth
    this.pacman.mouthAngle += this.pacman.mouthOpening ? 0.1 : -0.1;
    if (this.pacman.mouthAngle >= 0.5) {
      this.pacman.mouthOpening = false;
    } else if (this.pacman.mouthAngle <= 0) {
      this.pacman.mouthOpening = true;
    }

    // Handle power mode
    if (this.pacman.isPowered) {
      this.pacman.powerTimer--;
      if (this.pacman.powerTimer <= 0) {
        this.pacman.isPowered = false;
        this.pacman.speed = 0.1; // Reset to default speed
      }
    }

    this.checkFoodCollision();
  }

  moveGhost() {
    if (this.isGameOver) return;

    const dx = this.pacman.x - this.ghost.x;
    const dy = this.pacman.y - this.ghost.y;
    const { speed } = this.ghost;
    
    // Ghost movement logic - chase or flee based on power mode
    const directionMultiplier = this.pacman.isPowered ? -1 : 1;
    let newX, newY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      newX = this.ghost.x + Math.sign(dx) * speed * directionMultiplier;
      newY = this.ghost.y;
    } else {
      newX = this.ghost.x;
      newY = this.ghost.y + Math.sign(dy) * speed * directionMultiplier;
    }

    if (this.canMove(newX, newY)) {
      this.ghost.x = newX;
      this.ghost.y = newY;
    }

    // Check collision with pacman
    if (this.checkCollision()) {
      if (this.pacman.isPowered) {
        // Reset ghost position if pacman is powered
        this.ghost.x = 13;
        this.ghost.y = 8;
      } else {
        this.endGame();
      }
    }
  }

  canMove(x, y) {
    // Check all four corners of the entity
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
    // Check if position is out of bounds or is a wall
    return gridX < 0 || gridX >= this.map[0].length ||
        gridY < 0 || gridY >= this.map.length ||
        this.map[gridY][gridX] === 1;
  }

  checkCollision() {
    // Check if pacman and ghost are close enough to collide
    const dx = Math.abs(this.pacman.x - this.ghost.x);
    const dy = Math.abs(this.pacman.y - this.ghost.y);
    return dx < 0.5 && dy < 0.5;
  }

  checkFoodCollision() {
    Object.values(this.foods).forEach(food => {
      if (food.eaten) return;

      const dx = Math.abs(this.pacman.x - food.x);
      const dy = Math.abs(this.pacman.y - food.y);

      if (dx < 0.5 && dy < 0.5) {
        // Apply power effects without marking food as eaten
        this.pacman.isPowered = true;
        this.ghost.color = 'blue';

        // Apply different effects based on food type
        switch(food.type) {
          case 'fruit':
            this.pacman.powerTimer = 600; // 10 seconds power
            break;
          case 'burger':
            this.pacman.powerTimer = 300; // 5 seconds power
            this.pacman.speed = 0.15; // Speed boost
            break;
          case 'pizza':
            this.pacman.powerTimer = 900; // 15 seconds power
            break;
        }
      }
    });
  }

  endGame() {
    this.isGameOver = true;
    this.stop();
    this.showGameOver();
  }

  showGameOver() {
    // Draw semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw game over text
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2 - 20);

    this.ctx.font = '20px Arial';
    this.ctx.fillText('Click to restart', this.canvas.width/2, this.canvas.height/2 + 20);

    // Add one-time click listener for restart
    this.canvas.addEventListener('click', () => this.restart(), { once: true });
  }

  restart() {
    // Reset game state
    this.isGameOver = false;
    
    // Reset pacman
    this.pacman = {
      x: 1,
      y: 1,
      direction: 'right',
      speed: 0.1,
      mouthAngle: 0,
      mouthOpening: true,
      isPowered: false,
      powerTimer: 0
    };
    
    // Reset ghost
    this.ghost = { 
      x: 13, 
      y: 8, 
      speed: 0.08,
      color: 'red' 
    };
    
    // Reset foods
    this.foods = {
      fruit: { x: 7, y: 5, eaten: false, type: 'fruit' },
      burger: { x: 3, y: 3, eaten: false, type: 'burger' },
      pizza: { x: 11, y: 7, eaten: false, type: 'pizza' }
    };
    
    this.start();
  }

  drawMap() {
    // Cache map dimensions for performance
    const mapHeight = this.map.length;
    const mapWidth = this.map[0].length;
    
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const isWall = this.map[y][x] === 1;
        this.ctx.fillStyle = isWall ? 'blue' : 'white';
        this.ctx.fillRect(
            x * this.tileSize + (isWall ? 0 : 8),
            y * this.tileSize + (isWall ? 0 : 8),
            isWall ? this.tileSize : 4,
            isWall ? this.tileSize : 4
        );
      }
    }
  }

  drawFood() {
    Object.values(this.foods).forEach(food => {
      if (food.eaten) return;
      
      const foodX = food.x * this.tileSize + this.tileSize/2;
      const foodY = food.y * this.tileSize + this.tileSize/2;
      const radius = this.tileSize/3;

      switch(food.type) {
        case 'fruit':
          // Draw orange circle
          this.ctx.fillStyle = 'orange';
          this.ctx.beginPath();
          this.ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'burger':
          // Draw burger layers
          const width = this.tileSize*2/3;
          const height = this.tileSize/6;
          const left = foodX - radius;
          
          // Brown bun top
          this.ctx.fillStyle = '#8B4513';
          this.ctx.fillRect(left, foodY - radius, width, height);
          
          // Green lettuce
          this.ctx.fillStyle = '#228B22';
          this.ctx.fillRect(left, foodY - height, width, height);
          
          // Brown patty
          this.ctx.fillStyle = '#CD853F';
          this.ctx.fillRect(left, foodY, width, height);
          
          // Brown bun bottom
          this.ctx.fillStyle = '#8B4513';
          this.ctx.fillRect(left, foodY + height, width, height);
          break;
          
        case 'pizza':
          // Draw pizza slice
          this.ctx.fillStyle = '#DAA520'; // Crust
          this.ctx.beginPath();
          this.ctx.moveTo(foodX, foodY);
          this.ctx.lineTo(foodX - radius, foodY - radius);
          this.ctx.lineTo(foodX + radius, foodY - radius);
          this.ctx.fill();
          
          // Pizza sauce
          this.ctx.fillStyle = '#FF4500';
          this.ctx.beginPath();
          this.ctx.moveTo(foodX, foodY - this.tileSize/12);
          this.ctx.lineTo(foodX - this.tileSize/4, foodY - this.tileSize/4);
          this.ctx.lineTo(foodX + this.tileSize/4, foodY - this.tileSize/4);
          this.ctx.fill();
          break;
      }
    });
  }

  drawPacman() {
    const { x, y, direction, mouthAngle, isPowered } = this.pacman;
    const pacX = x * this.tileSize + this.tileSize/2;
    const pacY = y * this.tileSize + this.tileSize/2;

    // Mouth angles for each direction
    const angles = {
      right: [mouthAngle, 2 * Math.PI - mouthAngle],
      left: [Math.PI + mouthAngle, Math.PI - mouthAngle],
      up: [Math.PI/2 + mouthAngle, Math.PI/2 - mouthAngle],
      down: [3*Math.PI/2 + mouthAngle, 3*Math.PI/2 - mouthAngle]
    };

    // Draw pacman
    this.ctx.fillStyle = isPowered ? '#00ffff' : '#ff69b4';
    this.ctx.beginPath();
    this.ctx.arc(pacX, pacY, this.tileSize/2, angles[direction][0], angles[direction][1]);
    this.ctx.lineTo(pacX, pacY);
    this.ctx.fill();
  }

  drawGhost() {
    const { x, y, color } = this.ghost;
    const ghostX = x * this.tileSize + this.tileSize/2;
    const ghostY = y * this.tileSize + this.tileSize/2;
    const radius = this.tileSize/2;

    // Draw ghost body
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(ghostX, ghostY - this.tileSize/4, radius, Math.PI, 0);
    
    // Draw ghost skirt
    const skirt = [[1/2, 1/2], [1/3, 1/3], [1/6, 1/2], [0, 1/3], [-1/6, 1/2], [-1/3, 1/3], [-1/2, 1/2]];
    skirt.forEach(([dx, dy]) => {
      this.ctx.lineTo(ghostX + dx * this.tileSize, ghostY + dy * this.tileSize);
    });
    this.ctx.fill();

    // Draw eyes (white part)
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    [-1/5, 1/5].forEach(dx => {
      this.ctx.arc(ghostX + dx * this.tileSize, ghostY - this.tileSize/4, this.tileSize/5, 0, Math.PI * 2);
    });
    this.ctx.fill();

    // Draw pupils
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    [-1/5, 1/5].forEach(dx => {
      this.ctx.arc(ghostX + dx * this.tileSize + this.tileSize/10, ghostY - this.tileSize/4, this.tileSize/10, 0, Math.PI * 2);
    });
    this.ctx.fill();
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw game elements
    this.drawMap();
    this.drawFood();
    this.drawPacman();
    this.drawGhost();
  }

  update() {
    // Update game state
    this.movePacman();
    this.moveGhost();
    this.draw();

    // Reset ghost color when power mode ends
    if (!this.pacman.isPowered && this.ghost.color === 'blue') {
      this.ghost.color = 'red';
    }
  }

  start() {
    // Clear any existing game loop
    if (this.gameLoop) clearInterval(this.gameLoop);
    
    // Start new game loop at ~60fps
    this.gameLoop = setInterval(() => this.update(), 16);
  }

  stop() {
    if (this.gameLoop) clearInterval(this.gameLoop);
  }
}

export default PacmanGame;