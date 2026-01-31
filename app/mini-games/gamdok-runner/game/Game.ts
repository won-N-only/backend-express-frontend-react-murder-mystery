import { GROUND_HEIGHT } from '../constants';
import { OBSTACLE_PATTERNS, ObstacleType } from '../constants/patterns';
import { GameState, ItemType } from '../types';
import { random } from '../utils';
import { Hole } from './Hole';
import { Item } from './Item';
import { Obstacle } from './Obstacle';
import { Player } from './Player';

export class Game {
  private player: Player | null = null;
  private obstacles: Obstacle[] = [];
  private items: Item[] = [];
  private holes: Hole[] = [];
  private canvas: HTMLCanvasElement;
  private gameSpeed = 3;
  private globalGameSpeedMultiplier = 1.0;
  private globalSpeedIncrementInterval = 40; // 10 seconds at 60 FPS
  private globalSpeedIncrementAmount = 0.01;
  private globalSpeedIncrementTimer = this.globalSpeedIncrementInterval;
  private tempSpeedMultiplier = 1.0; // Multiplier for temporary speed changes (from items)
  private tempSpeedTimer = 0;        // Timer for temporary speed effect duration
  private tempSpeedDuration = 120;   // 5 seconds at 60 FPS
  private obstacleInterval = 40;
  private obstacleSpawnTimer = this.obstacleInterval;
  private itemInterval = 300;
  private itemSpawnTimer = this.itemInterval;
  private groundHeight: number;

  private score = 0;
  private lives = 3; // Changed from health to lives
  private isGameOver = false;
  private fallTimer: number | null = null; // New timer for falling effect

  private currentPattern: ObstacleType[] = [];
  private patternIndex = 0;

  private playerImage: HTMLImageElement | null = null;
  private itemImages: Map<ItemType, HTMLImageElement> = new Map();
  private assetsLoadedPromise: Promise<void>; // New: Promise that resolves when assets are loaded

  public onStateChange: (state: GameState) => void;

  constructor(canvas: HTMLCanvasElement, onStateChange: (state: GameState) => void) {
    this.canvas = canvas;
    this.groundHeight = this.canvas.height - GROUND_HEIGHT;
    this.onStateChange = onStateChange; // Set onStateChange first
    this.assetsLoadedPromise = this.preloadAssets(); // Start preloading
    this.loadNextPattern(); // This can run in parallel
  }

  private async preloadAssets(): Promise<void> {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    // Load player image
    try {
      this.playerImage = await loadImage('/mini-games/gamdok-runner/full-body.png');
    } catch (error) {
      console.error('Failed to load player image: /mini-games/gamdok-runner/full-body.png', error);
    }
    // Instantiate player AFTER image is loaded
    this.player = new Player(150, this.groundHeight - 50, this.groundHeight, this.playerImage);


    // Load item images
    const itemImageMap = new Map<ItemType, string>([
      [ItemType.GAME_OVER, '/mini-games/gamdok-runner/items/alarm.png'],
      [ItemType.SPEED_UP, '/mini-games/gamdok-runner/items/shoes.png'],
      [ItemType.SPEED_DOWN, '/mini-games/gamdok-runner/items/cookie.png'],
      [ItemType.LIFE_UP, '/mini-games/gamdok-runner/items/coffee.png'],
    ]);

    const itemImagePromises: Promise<void>[] = [];
    itemImageMap.forEach(async (src, type) => {
      itemImagePromises.push(
        loadImage(src)
          .then(img => {
            this.itemImages.set(type, img);
          })
          .catch(error => {
            console.error(`Failed to load image for item type ${type}: ${src}`, error);
          }),
      );
    });
    await Promise.all(itemImagePromises);
  }



  loadNextPattern() {
    const pattern = OBSTACLE_PATTERNS[Math.floor(Math.random() * OBSTACLE_PATTERNS.length)];
    this.currentPattern = [...pattern, 'gap', 'gap', 'gap']; // Add more gaps between patterns
    this.patternIndex = 0;
  }

  update() {
    if (this.isGameOver || !this.player) return;

    const effectiveGameSpeed = this.gameSpeed * this.globalGameSpeedMultiplier * this.tempSpeedMultiplier;
    this.player.update();

    if (this.fallTimer !== null) {
      this.fallTimer--;
      if (this.fallTimer <= 0) {
        this.isGameOver = true;
      }
      // Do not update game elements if player is falling
      this.onStateChange({
        score: this.score,
        lives: this.lives,
        isGameOver: this.isGameOver,
      });
      return;
    }

    this.score += 1;

    // Gradually increase global game speed multiplier
    this.globalSpeedIncrementTimer--;
    if (this.globalSpeedIncrementTimer <= 0) {
      this.globalGameSpeedMultiplier += this.globalSpeedIncrementAmount;
      this.globalSpeedIncrementTimer = this.globalSpeedIncrementInterval;
    }

    // Update temporary speed effect timer
    if (this.tempSpeedTimer > 0) {
      this.tempSpeedTimer--;
      if (this.tempSpeedTimer <= 0) {
        this.tempSpeedMultiplier = 1.0; // Reset speed after effect
      }
    }

    this.obstacleSpawnTimer--;
    if (this.obstacleSpawnTimer <= 0) {
      this.spawnFromPattern();
      const dynamicObstacleInterval = Math.max(20, this.obstacleInterval / (this.globalGameSpeedMultiplier * this.tempSpeedMultiplier));
      this.obstacleSpawnTimer = dynamicObstacleInterval;
    }

    this.itemSpawnTimer--;
    if (this.itemSpawnTimer <= 0) {
      this.spawnItem();
      const dynamicItemInterval = Math.max(50, (this.itemInterval + random(-50, 50)) / (this.globalGameSpeedMultiplier * this.tempSpeedMultiplier));
      this.itemSpawnTimer = dynamicItemInterval;
    }

    this.obstacles.forEach(o => o.position.x -= effectiveGameSpeed);
    this.items.forEach(i => i.position.x -= effectiveGameSpeed);
    this.holes.forEach(h => h.position.x -= effectiveGameSpeed);

    this.obstacles = this.obstacles.filter(o => o.position.x + o.width > 0);
    this.items = this.items.filter(i => i.position.x + i.width > 0);
    this.holes = this.holes.filter(h => h.position.x + h.width > 0);

    this.checkCollisions();

    this.onStateChange({
      score: this.score,
      lives: this.lives, // Changed from health to lives
      isGameOver: this.isGameOver,
    });
  }

  draw(context: CanvasRenderingContext2D) {
    // Draw ground by segments, leaving holes
    context.fillStyle = 'gray';
    let lastX = 0;
    const sortedHoles = [...this.holes].sort((a, b) => a.position.x - b.position.x);
    sortedHoles.forEach(hole => {
      if (hole.position.x > lastX) {
        context.fillRect(lastX, this.groundHeight, hole.position.x - lastX, GROUND_HEIGHT);
      }
      lastX = hole.position.x + hole.width;
    });
    if (lastX < this.canvas.width) {
      context.fillRect(lastX, this.groundHeight, this.canvas.width - lastX, GROUND_HEIGHT);
    }

    if (!this.player) return;
    this.player.draw(context);
    this.obstacles.forEach(obstacle => obstacle.draw(context));
    this.items.forEach(item => item.draw(context));

    // Draw lives (hearts)
    context.font = '24px Arial'; // Set a suitable font size for the emoji
    context.fillStyle = 'red';   // Set color for the emoji
    const heartSpacing = 5;
    const heartWidth = 24; // Approximate width of a 24px heart emoji
    for (let i = 0; i < this.lives; i++) {
      context.fillText('❤️', this.canvas.width - (i + 1) * (heartWidth + heartSpacing) - 5, 30); // Adjust position as needed
    }
  }

  jump() {
    if (!this.player || this.player.isFalling) return; // Add null check for player
    this.player.jump();
  }

  slide() {
    if (!this.player || this.player.isFalling) return; // Add null check for player
    this.player.slide();
  }

  spawnFromPattern() {
    if (this.patternIndex >= this.currentPattern.length) {
      this.loadNextPattern();
    }

    const type = this.currentPattern[this.patternIndex];

    switch (type) {
      case 'bottom': {
        const height = random(30, 50);
        this.obstacles.push(new Obstacle(this.canvas.width, this.groundHeight - height, 20, height));
        break;
      }
      case 'top': {
        const y = this.groundHeight - 80;
        this.obstacles.push(new Obstacle(this.canvas.width, y, 30, 30));
        break;
      }
      case 'hole': {
        const width = random(80, 150);
        this.holes.push(new Hole(this.canvas.width, this.groundHeight, width));
        break;
      }
      case 'gap':
        break;
    }

    this.patternIndex++;
  }

  spawnItem() {
    const y = random(this.groundHeight - 200, this.groundHeight - 80);
    let randomItemType: ItemType;

    // 10% chance for GAME_OVER item, otherwise pick from other types
    if (Math.random() < 0.05) {
      randomItemType = ItemType.GAME_OVER;
    } else {
      const otherItemTypes = Object.values(ItemType).filter(type => type !== ItemType.GAME_OVER);
      randomItemType = otherItemTypes[Math.floor(Math.random() * otherItemTypes.length)];
    }

    // Define potential item bounds for collision check
    // Using default item width and height from Item constructor (40x40)
    const potentialItemX = this.canvas.width;
    const potentialItemY = y;
    const potentialItemWidth = 50;
    const potentialItemHeight = 50;

    // Check for overlap with existing obstacles
    const overlapsWithObstacle = this.obstacles.some(obstacle =>
      potentialItemX < obstacle.position.x + obstacle.width &&
      potentialItemX + potentialItemWidth > obstacle.position.x &&
      potentialItemY < obstacle.position.y + obstacle.height &&
      potentialItemY + potentialItemHeight > obstacle.position.y,
    );

    if (overlapsWithObstacle) {
      return; // Skip spawning this item if it overlaps an obstacle
    }

    const itemImage = this.itemImages.get(randomItemType);
    this.items.push(new Item(this.canvas.width, y, 80, 80, randomItemType, itemImage || null));
  }

  checkCollisions() {
    const player = this.player;
    if (!player) return;

    // Obstacle collision
    this.obstacles.forEach((obstacle, index) => {
      if (
        player.position.x < obstacle.position.x + obstacle.width &&
        player.position.x + player.width > obstacle.position.x &&
        player.position.y < obstacle.position.y + obstacle.height &&
        player.position.y + player.height > obstacle.position.y
      ) {
        this.obstacles.splice(index, 1);
        this.lives -= 1; // Decrement lives
        if (this.lives <= 0) {
          this.lives = 0;
          this.isGameOver = true;
        }
      }
    });

    // Item collision
    this.items.forEach((item, index) => {
      if (
        player.position.x < item.position.x + item.width &&
        player.position.x + player.width > item.position.x &&
        player.position.y < item.position.y + item.height &&
        player.position.y + player.height > item.position.y
      ) {
        this.items.splice(index, 1);
        switch (item.type) {
          case ItemType.GAME_OVER:
            this.isGameOver = true;
            break;
          case ItemType.SPEED_UP:
            if (this.tempSpeedTimer <= 0) { // Only apply if no temporary effect is active
              this.tempSpeedMultiplier = 1.4; // Increase speed by 50%
              this.tempSpeedTimer = this.tempSpeedDuration;
            }
            break;
          case ItemType.SPEED_DOWN:
            if (this.tempSpeedTimer <= 0) { // Only apply if no temporary effect is active
              this.tempSpeedMultiplier = 0.6; // Decrease speed by 50%
              this.tempSpeedTimer = this.tempSpeedDuration;
            }
            break;
          case ItemType.LIFE_UP:
            this.lives = Math.min(3, this.lives + 1); // Cap lives at 3
            break;
        }
        this.score += 100;
      }
    });

    // Hole collision
    // Check if player is over a hole when they are on the ground (or about to land)
    const playerOnGround = player.position.y + player.height >= this.groundHeight;

    if (!player.isFalling && !player.isJumping && playerOnGround) {
      for (const hole of this.holes) {
        const playerCenter = player.position.x + player.width / 2;

        // Define a narrow central "trigger zone" within the hole (e.g., central 20% of the hole width)
        const triggerZoneStart = hole.position.x + hole.width * 0.4; // 40% from left edge
        const triggerZoneEnd = hole.position.x + hole.width * 0.8;   // 80% from left edge

        // Check if the player's center is within this narrow trigger zone
        if (playerCenter > triggerZoneStart && playerCenter < triggerZoneEnd) {
          // Player is on the ground and over a hole's trigger zone -> start falling
          player.fallIntoHole();
          this.fallTimer = 60; // 1 second delay before game over
          return;
        }
      }
    }
  }
}