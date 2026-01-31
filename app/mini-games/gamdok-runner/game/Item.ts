import { Position } from '../types';

export class Item {
  position: Position;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'green';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    // Items are static for now
  }
}
