// Physics.js - Handles game physics, collisions and movement

class Physics {
  constructor(map, tileSize) {
    this.map = map;
    this.tileSize = tileSize;
  }

  movePacman(pacman, ghost, foods) {
    const { direction, speed } = pacman;
    
    // Calculate new position based on direction
    let newX = pacman.x + (direction === 'right' ? speed : direction === 'left' ? -speed : 0);
    let newY = pacman.y + (direction === 'down' ? speed : direction === 'up' ? -speed : 0);

    // Move if possible
    if (this.canMove(newX, newY)) {
      pacman.x = newX;
      pacman.y = newY;
    }

    // Animate mouth
    pacman.mouthAngle += pacman.mouthOpening ? 0.1 : -0.1;
    if (pacman.mouthAngle >= 0.5) {
      pacman.mouthOpening = false;
    } else if (pacman.mouthAngle <= 0) {
      pacman.mouthOpening = true;
    }

    // Handle power mode
    if (pacman.isPowered) {
      pacman.powerTimer--;
      if (pacman.powerTimer <= 0) {
        pacman.isPowered = false;
        pacman.speed = 0.1; // Reset to default speed
        ghost.color = 'red';
      }
    }

    this.checkFoodCollision(pacman, ghost, foods);
  }

  moveGhost(ghost, pacman) {
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    const { speed } = ghost;
    
    // Ghost movement logic - chase or flee based on power mode
    const directionMultiplier = pacman.isPowered ? -1 : 1;
    let newX, newY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      newX = ghost.x + Math.sign(dx) * speed * directionMultiplier;
      newY = ghost.y;
    } else {
      newX = ghost.x;
      newY = ghost.y + Math.sign(dy) * speed * directionMultiplier;
    }

    if (this.canMove(newX, newY)) {
      ghost.x = newX;
      ghost.y = newY;
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

  checkCollision(pacman, ghost) {
    // Check if pacman and ghost are close enough to collide
    const dx = Math.abs(pacman.x - ghost.x);
    const dy = Math.abs(pacman.y - ghost.y);
    return dx < 0.5 && dy < 0.5;
  }

  checkFoodCollision(pacman, ghost, foods) {
    Object.values(foods).forEach(food => {
      if (food.eaten) return;

      // Increased collision radius to make it easier to eat food
      const dx = Math.abs(pacman.x - food.x);
      const dy = Math.abs(pacman.y - food.y);
      const collisionThreshold = 0.8; // Increased from 0.5

      if (dx < collisionThreshold && dy < collisionThreshold) {
        // Mark food as eaten
        food.eaten = true;
        
        // Apply power effects
        pacman.isPowered = true;
        ghost.color = 'blue';

        // Apply different effects based on food type
        switch(food.type) {
          case 'fruit':
            pacman.powerTimer = 600; // 10 seconds power
            break;
          case 'burger':
            pacman.powerTimer = 300; // 5 seconds power
            pacman.speed = 0.15; // Speed boost
            break;
          case 'pizza':
            pacman.powerTimer = 900; // 15 seconds power
            break;
        }
      }
    });
  }
}

export default Physics; 