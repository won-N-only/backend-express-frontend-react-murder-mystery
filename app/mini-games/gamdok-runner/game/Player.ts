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
  image: HTMLImageElement | null; // New property for player image
  shoesImage: HTMLImageElement | null;
  lowerBodyImage: HTMLImageElement | null;
  upperBodyImage: HTMLImageElement | null;

  constructor(
    x: number,
    y: number,
    groundHeight: number,
    image: HTMLImageElement | null = null,
    shoesImage: HTMLImageElement | null = null,
    lowerBodyImage: HTMLImageElement | null = null,
    upperBodyImage: HTMLImageElement | null = null,
  ) {
    this.position = { x, y };
    this.velocity = { x: 3, y: 0 };
    this.width = 80; // Fixed width for the player
    this.height = 80; // Fixed height for the player
    this.originalHeight = 80; // Fixed original height
    this.isJumping = false;
    this.isSliding = false;
    this.isFalling = false; // Initialize new state
    this.slideTimer = 0;
    this.groundHeight = groundHeight;
    this.image = image;
    this.shoesImage = shoesImage;
    this.lowerBodyImage = lowerBodyImage;
    this.upperBodyImage = upperBodyImage;
    this.position.y = groundHeight - this.height; // Adjust initial y based on fixed height
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.isFalling && this.height <= 0) {
      return; // Don't draw if fallen and shrunk
    }

    // Draw base player image
    if (this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    } else {
      // Fallback to drawing a colored rectangle
      context.fillStyle = this.isSliding ? 'purple' : 'blue';
      context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Draw clothing layers
    if (this.lowerBodyImage) {
      context.drawImage(this.lowerBodyImage, this.position.x, this.position.y, this.width, this.height);
    }
    if (this.upperBodyImage) {
      context.drawImage(this.upperBodyImage, this.position.x, this.position.y, this.width, this.height);
    }
    if (this.shoesImage) {
      context.drawImage(this.shoesImage, this.position.x, this.position.y, this.width, this.height);
    }
  }

  jump() {
    if (!this.isJumping && !this.isSliding && !this.isFalling) {
      this.isJumping = true;
      this.velocity.y = -13; // Revert to base jump force
    }
  }

  slide() {
    if (!this.isJumping && !this.isSliding && !this.isFalling) {
      this.isSliding = true;
      this.slideTimer = 45; // Revert to base slide duration
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
