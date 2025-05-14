// Entity.js - Contains entity classes for game objects

export class Pacman {
  constructor() {
    this.x = 1;
    this.y = 1;
    this.direction = 'right';
    this.speed = 0.1;
    this.mouthAngle = 0;
    this.mouthOpening = true;
    this.isPowered = false;
    this.powerTimer = 0;
  }

  reset() {
    this.x = 1;
    this.y = 1;
    this.direction = 'right';
    this.speed = 0.1;
    this.mouthAngle = 0;
    this.mouthOpening = true;
    this.isPowered = false;
    this.powerTimer = 0;
  }
}

export class Ghost {
  constructor() {
    this.x = 13;
    this.y = 8;
    this.speed = 0.08;
    this.color = 'red';
  }

  reset() {
    this.x = 13;
    this.y = 8;
    this.speed = 0.08;
    this.color = 'red';
  }
}

export const createFoods = () => ({
  fruit: { x: 7, y: 5, eaten: false, scoreAdded: false, type: 'fruit' },
  burger: { x: 3, y: 3, eaten: false, scoreAdded: false, type: 'burger' },
  pizza: { x: 11, y: 7, eaten: false, scoreAdded: false, type: 'pizza' }
});
