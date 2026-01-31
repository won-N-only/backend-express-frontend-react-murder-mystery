import { Position } from '../types';

export class Obstacle {
  position: Position;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    // Obstacles are static for now
  }
}
