import { Position } from '../types';

const GRAVITY = 0.5;

export class Player {
  position: Position;
  velocity: Position;
  width: number;
  height: number;
  originalHeight: number;
  isJumping: boolean;
  isSliding: boolean;
  isFalling: boolean; // New state for falling into a hole
  slideTimer: number;
  groundHeight: number;

  constructor(x: number, y: number, groundHeight: number) {
    this.position = { x, y };
    this.velocity = { x: 3, y: 0 };
    this.width = 50;
    this.height = 50;
    this.originalHeight = 50;
    this.isJumping = false;
    this.isSliding = false;
    this.isFalling = false; // Initialize new state
    this.slideTimer = 0;
    this.groundHeight = groundHeight;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.isFalling && this.height <= 0) {
      return; // Don't draw if fallen and shrunk
    }
    context.fillStyle = this.isSliding ? 'purple' : 'blue';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  jump() {
    if (!this.isJumping && !this.isSliding && !this.isFalling) {
      this.isJumping = true;
      this.velocity.y = -15;
    }
  }

  slide() {
    if (!this.isJumping && !this.isSliding && !this.isFalling) {
      this.isSliding = true;
      this.slideTimer = 60; // 1 second at 60fps
      this.height = this.originalHeight / 2;
      this.position.y += this.originalHeight / 2;
    }
  }

  unslide() {
    this.isSliding = false;
    this.height = this.originalHeight;
    this.position.y -= this.originalHeight / 2;
  }

  fallIntoHole() {
    if (!this.isFalling) {
      this.isFalling = true;
      this.velocity.y = 5; // Start falling downwards
    }
  }

  update() {
    if (this.isFalling) {
      this.velocity.y += GRAVITY * 0.5; // Continue falling faster
      this.position.y += this.velocity.y;
      this.height -= 1; // Shrink
      this.width -= 1; // Shrink
      if (this.height < 0) this.height = 0;
      if (this.width < 0) this.width = 0;
      return;
    }

    // Vertical movement
    if (!this.isSliding) {
      this.velocity.y += GRAVITY;
      this.position.y += this.velocity.y;
    }


    // Ground collision
    if (this.position.y + this.height > this.groundHeight) {
      this.position.y = this.groundHeight - this.height;
      this.velocity.y = 0;
      this.isJumping = false;
    }

    // Sliding timer
    if (this.isSliding) {
      this.slideTimer--;
      if (this.slideTimer <= 0) {
        this.unslide();
      }
    }
  }
}
