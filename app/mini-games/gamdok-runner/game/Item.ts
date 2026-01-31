import { ItemType, Position } from '../types';

export class Item {
  position: Position;
  width: number;
  height: number;
  type: ItemType;

  constructor(x: number, y: number, width: number, height: number, type: ItemType) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.type = type;
  }

  draw(context: CanvasRenderingContext2D) {
    // Temporary visual for different item types
    switch (this.type) {
      case ItemType.GAME_OVER:
        context.fillStyle = 'black'; // Game Over item
        break;
      case ItemType.SPEED_UP:
        context.fillStyle = 'blue'; // Speed Up item
        break;
      case ItemType.SPEED_DOWN:
        context.fillStyle = 'orange'; // Speed Down item
        break;
      case ItemType.LIFE_UP:
        context.fillStyle = 'green'; // Life Up item
        break;
      default:
        context.fillStyle = 'purple'; // Default/unknown item
    }
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    // Items are static for now
  }
}

