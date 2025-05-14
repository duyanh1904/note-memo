// Controls.js - Handles all user input

class Controls {
  constructor(canvas, pacman) {
    this.canvas = canvas;
    this.pacman = pacman;
    this.touchStart = { x: null, y: null };
    this.activeKeys = new Set(); // Track currently pressed keys
  }

  init() {
    this.initKeyboardControls();
    this.initTouchControls();
  }

  initKeyboardControls() {
    // Keyboard controls mapping (support both arrow keys and WASD)
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      'W': 'up',
      's': 'down',
      'S': 'down',
      'a': 'left',
      'A': 'left',
      'd': 'right',
      'D': 'right'
    };

    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => {
      if (keyMap[e.key]) {
        // Prevent scrolling when using arrow keys
        e.preventDefault();
        
        // Store active key
        this.activeKeys.add(e.key);
        
        // Update pacman direction
        this.pacman.direction = keyMap[e.key];
      }
    });
    
    document.addEventListener('keyup', (e) => {
      // Remove released key
      this.activeKeys.delete(e.key);
      
      // If there are still active keys, use the latest one
      if (this.activeKeys.size > 0) {
        const lastKey = Array.from(this.activeKeys).pop();
        if (keyMap[lastKey]) {
          this.pacman.direction = keyMap[lastKey];
        }
      }
    });
  }

  initTouchControls() {
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

    // Determine swipe direction (using stricter angle detection)
    if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > threshold) {
      // Horizontal movement dominant (1.5x more than vertical)
      this.pacman.direction = dx > 0 ? 'right' : 'left';
      this.touchStart.x = touchX;
    } else if (Math.abs(dy) > Math.abs(dx) * 1.5 && Math.abs(dy) > threshold) {
      // Vertical movement dominant (1.5x more than horizontal)
      this.pacman.direction = dy > 0 ? 'down' : 'up';
      this.touchStart.y = touchY;
    }
  }
}

export default Controls; 