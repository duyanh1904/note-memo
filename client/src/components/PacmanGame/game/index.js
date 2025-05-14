// game/index.js - Main game controller
import Controls from './Controls';
import Renderer from './Renderer';
import Physics from './Physics';
import gameMap from './Map';
import { Pacman, Ghost, createFoods } from './Entity';

class PacmanGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = 20;
    this.tileSize = 20;
    this.isGameOver = false;
    this.gameLoop = null;
    this.score = 0;
    this.highScore = this.loadHighScore();

    // Initialize game components
    this.initializeGameState();
    
    // Initialize game
    this.start();
  }
  
  initializeGameState() {
    // Set up game map and entities
    this.map = gameMap;
    this.pacman = new Pacman();
    this.ghost = new Ghost();
    this.foods = createFoods();
    
    // Initialize subsystems
    this.physics = new Physics(this.map, this.tileSize);
    this.renderer = new Renderer(this.ctx, this.tileSize);
    this.controls = new Controls(this.canvas, this.pacman);
    
    // Initialize controls
    this.controls.init();
  }

  update() {
    // Skip updates if game is over
    if (this.isGameOver) return;

    // Update entities
    this.physics.movePacman(this.pacman, this.ghost, this.foods);
    this.physics.moveGhost(this.ghost, this.pacman);
    
    // Check for ghost collision
    if (this.physics.checkCollision(this.pacman, this.ghost)) {
      if (this.pacman.isPowered) {
        // Reset ghost position if pacman is powered
        this.ghost.x = 13;
        this.ghost.y = 8;
        this.updateScore(200); // Bonus points for eating ghost
      } else {
        this.endGame();
      }
    }
    
    // Check if food was eaten and update score
    this.checkFoodStatus();
    
    // Check if all food is eaten
    this.checkLevelComplete();
    
    // Render the game
    this.draw();
  }
  
  checkFoodStatus() {
    // Check each food item to see if it was just eaten
    Object.values(this.foods).forEach(food => {
      if (food.eaten && !food.scoreAdded) {
        food.scoreAdded = true; // Mark that we've counted this food
        
        // Different food items give different points
        switch(food.type) {
          case 'fruit':
            this.updateScore(10);
            break;
          case 'burger':
            this.updateScore(30);
            break;
          case 'pizza':
            this.updateScore(50);
            break;
        }
      }
    });
  }
  
  checkLevelComplete() {
    // Check if all foods have been eaten
    const allFoodsEaten = Object.values(this.foods).every(food => food.eaten);
    
    if (allFoodsEaten) {
      // Add completion bonus
      this.updateScore(500);
      
      // Reset food for next level but keep score
      this.foods = createFoods();
      
      // Reset positions
      this.pacman.reset();
      this.ghost.reset();
    }
  }
  
  updateScore(points) {
    this.score += points;
    
    // Update high score if necessary
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }
  
  loadHighScore() {
    const savedScore = localStorage.getItem('pacmanHighScore');
    return savedScore ? parseInt(savedScore) : 0;
  }
  
  saveHighScore() {
    localStorage.setItem('pacmanHighScore', this.highScore.toString());
  }
  
  draw() {
    // Clear canvas
    this.renderer.clear(this.canvas);
    
    // Draw game elements
    this.renderer.drawMap(this.map);
    this.renderer.drawFood(this.foods);
    this.renderer.drawPacman(this.pacman);
    this.renderer.drawGhost(this.ghost);
    
    // Draw score
    this.drawScore();
  }
  
  drawScore() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, this.canvas.height - 10);
    
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`High Score: ${this.highScore}`, this.canvas.width - 10, this.canvas.height - 10);
  }

  endGame() {
    this.isGameOver = true;
    this.stop();
    this.renderer.showGameOver(this.canvas, this.score, this.highScore);
    
    // Add restart event listener
    this.canvas.addEventListener('click', () => this.restart(), { once: true });
  }

  restart() {
    // Reset game state
    this.isGameOver = false;
    this.score = 0;
    
    // Reset entities
    this.initializeGameState();
    this.start();
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