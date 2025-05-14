// Renderer.js - Handles all game rendering

class Renderer {
  constructor(ctx, tileSize) {
    this.ctx = ctx;
    this.tileSize = tileSize;
  }

  drawMap(map) {
    // Cache map dimensions for performance
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const isWall = map[y][x] === 1;
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

  drawFood(foods) {
    Object.values(foods).forEach(food => {
      if (food.eaten) return;
      
      const foodX = food.x * this.tileSize + this.tileSize/2;
      const foodY = food.y * this.tileSize + this.tileSize/2;
      
      switch(food.type) {
        case 'fruit':
          this.drawFruit(foodX, foodY);
          break;
        case 'burger':
          this.drawBurger(foodX, foodY);
          break;
        case 'pizza':
          this.drawPizza(foodX, foodY);
          break;
      }
    });
  }
  
  drawFruit(x, y) {
    const radius = this.tileSize/3;
    // Draw orange circle
    this.ctx.fillStyle = 'orange';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add stem
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(x - 2, y - radius - 4, 4, 4);
  }
  
  drawBurger(x, y) {
    const radius = this.tileSize/3;
    const width = this.tileSize*2/3;
    const height = this.tileSize/6;
    const left = x - radius;
    
    // Brown bun top
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(left, y - radius, width, height);
    
    // Green lettuce
    this.ctx.fillStyle = '#228B22';
    this.ctx.fillRect(left, y - height, width, height);
    
    // Brown patty
    this.ctx.fillStyle = '#CD853F';
    this.ctx.fillRect(left, y, width, height);
    
    // Brown bun bottom
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(left, y + height, width, height);
  }
  
  drawPizza(x, y) {
    const radius = this.tileSize/3;
    
    // Draw pizza slice
    this.ctx.fillStyle = '#DAA520'; // Crust
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - radius, y - radius);
    this.ctx.lineTo(x + radius, y - radius);
    this.ctx.fill();
    
    // Pizza sauce
    this.ctx.fillStyle = '#FF4500';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - this.tileSize/12);
    this.ctx.lineTo(x - this.tileSize/4, y - this.tileSize/4);
    this.ctx.lineTo(x + this.tileSize/4, y - this.tileSize/4);
    this.ctx.fill();
    
    // Add pepperoni
    this.ctx.fillStyle = '#8B0000';
    this.ctx.beginPath();
    this.ctx.arc(x, y - radius/2, radius/4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawPacman(pacman) {
    const { x, y, direction, mouthAngle, isPowered } = pacman;
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

  drawGhost(ghost) {
    const { x, y, color } = ghost;
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

  showGameOver(canvas, score, highScore) {
    // Draw semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game over text
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 40);
    
    // Display final score
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 - 10);
    this.ctx.fillText(`High Score: ${highScore}`, canvas.width/2, canvas.height/2 + 20);

    this.ctx.font = '18px Arial';
    this.ctx.fillText('Click to restart', canvas.width/2, canvas.height/2 + 50);
  }

  clear(canvas) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export default Renderer; 