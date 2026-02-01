import { Position } from '../types';

const GRAVITY = 0.5;

export class Player {
  position: Position;
  velocity: Position;
  width: number; // Visual width
  height: number; // Visual height
  hitboxWidth: number; // Collision width
  hitboxHeight: number; // Collision height
  originalHeight: number; // Visual original height
  originalHitboxHeight: number; // Collision original height (for sliding)
  isJumping: boolean;
  isSliding: boolean;
  isFalling: boolean; // New state for falling into a hole
  slideTimer: number;
  groundHeight: number;
  image: HTMLImageElement | null; // New property for player image
  shoesImage: HTMLImageElement | null;
  lowerBodyImage: HTMLImageElement | null;
  upperBodyImage: HTMLImageElement | null;
  hairImage: HTMLImageElement | null; // New property for hair image

  constructor(
    x: number,
    y: number,
    groundHeight: number,
    image: HTMLImageElement | null = null,
    shoesImage: HTMLImageElement | null = null,
    lowerBodyImage: HTMLImageElement | null = null,
    upperBodyImage: HTMLImageElement | null = null,
    hairImage: HTMLImageElement | null = null, // New: hair image
  ) {
    this.position = { x, y };
    this.velocity = { x: 3, y: 0 };

    this.width = 70; // Visual width
    this.height = 80; // Visual height
    this.originalHeight = 80;

    this.hitboxWidth = 40; // Hitbox width
    this.hitboxHeight = 60; // Hitbox height
    this.originalHitboxHeight = 60;

    this.isJumping = false;
    this.isSliding = false;
    this.isFalling = false; // Initialize new state
    this.slideTimer = 0;
    this.groundHeight = groundHeight;
    this.image = image;
    this.shoesImage = shoesImage;
    this.lowerBodyImage = lowerBodyImage;
    this.upperBodyImage = upperBodyImage;
    this.hairImage = hairImage;
    this.position.y = groundHeight - this.hitboxHeight; // Adjust initial y based on fixed height
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.isFalling && this.height <= 0) {
      return; // Don't draw if fallen and shrunk
    }

    // Calculate dynamic offsets for drawing
    const currentDrawOffsetX = (this.width - this.hitboxWidth) / 2; // Center visual horizontally on hitbox
    const currentDrawOffsetY = this.height - this.hitboxHeight; // Align visual bottom with hitbox bottom

    const drawX = this.position.x - currentDrawOffsetX;
    const drawY = this.position.y - currentDrawOffsetY;

    // Draw base player image
    if (this.image) {
      context.drawImage(this.image, drawX, drawY, this.width, this.height);
    } else {
      // Fallback to drawing a colored rectangle
      context.fillStyle = this.isSliding ? 'purple' : 'blue';
      context.fillRect(this.position.x, this.position.y, this.hitboxWidth, this.hitboxHeight); // Draw hitbox for debugging
    }

    // Draw clothing layers
    if (this.lowerBodyImage) {
      context.drawImage(this.lowerBodyImage, drawX, drawY, this.width, this.height);
    }
    if (this.upperBodyImage) {
      context.drawImage(this.upperBodyImage, drawX, drawY, this.width, this.height);
    }
    if (this.shoesImage) {
      context.drawImage(this.shoesImage, drawX, drawY, this.width, this.height);
    }
    if (this.hairImage) {
      context.drawImage(this.hairImage, drawX, drawY, this.width, this.height);
    }
  }

  jump() {
    if (!this.isJumping && !this.isFalling) {
      this.isJumping = true;
      this.velocity.y = -14; // Revert to base jump force
    }
  }

  slide() {
    if (!this.isJumping && !this.isSliding && !this.isFalling) {
      this.isSliding = true;
      this.slideTimer = 50;

      // Adjust visual height
      this.height = this.originalHeight / 2;

      // Adjust hitbox height and position to stick to ground
      this.hitboxHeight = this.originalHitboxHeight / 2;
      this.position.y = this.groundHeight - this.hitboxHeight;
    }
  }

  unslide() {
    this.isSliding = false;

    // Restore visual height
    this.height = this.originalHeight;

    // Restore hitbox height and position to stick to ground
    this.hitboxHeight = this.originalHitboxHeight;
    this.position.y = this.groundHeight - this.hitboxHeight;
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



      // Shrink both visual and hitbox

      this.height -= 1;

      this.width -= 1;

      this.hitboxHeight -= 1;

      this.hitboxWidth -= 1;



      if (this.height < 0) this.height = 0;

      if (this.width < 0) this.width = 0;

      if (this.hitboxHeight < 0) this.hitboxHeight = 0;

      if (this.hitboxWidth < 0) this.hitboxWidth = 0;

      return;

    }



    // Vertical movement

    if (!this.isSliding) {

      this.velocity.y += GRAVITY;

      this.position.y += this.velocity.y;

    }





    // Ground collision - use hitboxHeight

    if (this.position.y + this.hitboxHeight > this.groundHeight) {

      this.position.y = this.groundHeight - this.hitboxHeight;

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
