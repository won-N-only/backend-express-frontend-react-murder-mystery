import { Position } from '../types';

export class Hole {
  position: Position;
  width: number;

  constructor(x: number, y: number, width: number) {
    this.position = { x, y };
    this.width = width;
  }

  // A hole doesn't need a draw method itself, it's a lack of ground.
  // It also doesn't need an update method as it moves with the game speed.
}
