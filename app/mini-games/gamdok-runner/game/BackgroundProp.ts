import { Position } from '../types';

export class BackgroundProp {
  position: Position;
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor(x: number, y: number, image: HTMLImageElement, width: number, height: number) {
    this.position = { x, y };
    this.image = image;
    this.width = width;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}
