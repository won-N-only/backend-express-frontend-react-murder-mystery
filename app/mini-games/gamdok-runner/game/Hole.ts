import { GROUND_HEIGHT, HOLE_FILL_COLOR } from '../constants';
import { Position } from '../types';

export class Hole {
  position: Position;
  width: number;

  constructor(x: number, y: number, width: number) {
    this.position = { x, y };
    this.width = width;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = HOLE_FILL_COLOR;
    context.fillRect(this.position.x, this.position.y, this.width, GROUND_HEIGHT);
  }
}
