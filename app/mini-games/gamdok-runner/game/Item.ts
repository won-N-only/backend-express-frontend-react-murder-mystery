import { ItemType, Position } from '../types';

export class Item {
  position: Position;
  width: number;
  height: number;
  type: ItemType;
  image: HTMLImageElement | null;

  constructor(x: number, y: number, width: number = 40, height: number = 40, type: ItemType, image: HTMLImageElement | null = null) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.type = type;
    this.image = image;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    } else {
      // Temporary visual for different item types
      switch (this.type) {
        case ItemType.GAME_OVER: // leze
          context.fillStyle = 'black'; // Game Over item
          break;
        case ItemType.SPEED_UP: // shoes
          context.fillStyle = 'blue'; // Speed Up item
          break;
        case ItemType.SPEED_DOWN: // cookie
          context.fillStyle = 'orange'; // Speed Down item
          break;
        case ItemType.LIFE_UP: //coffee
          context.fillStyle = 'green'; // Life Up item
          break;
        default:
          context.fillStyle = 'purple'; // Default/unknown item
      }
      context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }

  update() {
    // Items are static for now
  }
}


