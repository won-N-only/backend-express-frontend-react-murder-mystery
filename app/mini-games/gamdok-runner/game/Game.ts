import {
  BACKGROUND_SCROLL_SPEED_MULTIPLIER,
  FALL_TIMER_DURATION,
  GAME_OVER_ITEM_CHANCE,
  GAME_SPEED,
  GLOBAL_SPEED_INCREMENT_AMOUNT,
  GLOBAL_SPEED_INCREMENT_INTERVAL,
  GROUND_HEIGHT,
  HEART_SPACING,
  HEART_WIDTH,
  HEART_Y_OFFSET,
  HOLE_TRIGGER_ZONE_END_RATIO,
  HOLE_TRIGGER_ZONE_START_RATIO,
  ITEM_INTERVAL,
  ITEM_OVERLAP_CHECK_HEIGHT,
  ITEM_OVERLAP_CHECK_WIDTH,
  ITEM_SCORE_BOOST,
  ITEM_SPAWN_OFFSET_X,
  MAX_LIVES,
  OBSTACLE_INTERVAL,
  PLAYER_INITIAL_X,
  PLAYER_INITIAL_Y_OFFSET,
  PROP_SPAWN_INTERVAL,
  SPEED_DOWN_MULTIPLIER,
  SPEED_UP_MULTIPLIER,
  TEMP_SPEED_DURATION
} from '../constants';
import { OBSTACLE_PATTERNS, ObstacleType } from '../constants/patterns';
import { GameState, ItemType } from '../types';
import { random } from '../utils';
import { BackgroundProp } from './BackgroundProp';
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
  private gameSpeed = GAME_SPEED;
  private globalGameSpeedMultiplier = 1.0;
  private globalSpeedIncrementInterval = GLOBAL_SPEED_INCREMENT_INTERVAL; // 10 seconds at 60 FPS
  private globalSpeedIncrementAmount = GLOBAL_SPEED_INCREMENT_AMOUNT;
  private globalSpeedIncrementTimer = this.globalSpeedIncrementInterval;
  private tempSpeedMultiplier = 1.0; // Multiplier for temporary speed changes (from items)
  private tempSpeedTimer = 0;        // Timer for temporary speed effect duration
  private tempSpeedDuration = TEMP_SPEED_DURATION;
  private obstacleInterval = OBSTACLE_INTERVAL;
  private obstacleSpawnTimer = this.obstacleInterval;
  private itemInterval = ITEM_INTERVAL;
  private itemSpawnTimer = this.itemInterval;
  private groundHeight: number;

  private score = 0;
  private lives = MAX_LIVES;
  private isGameOver = false;
  private fallTimer: number | null = null; // New timer for falling effect

  private currentPattern: ObstacleType[] = [];
  private patternIndex = 0;

  private playerImage: HTMLImageElement | null = null;
  private itemImages: Map<ItemType, HTMLImageElement> = new Map();
  private selectedShoesImage: HTMLImageElement | null = null;
  private selectedLowerBodyImage: HTMLImageElement | null = null;
  private selectedUpperBodyImage: HTMLImageElement | null = null;
  private selectedHairImage: HTMLImageElement | null = null;
  private assetsLoadedPromise: Promise<void>;

  // Background and Prop management
  private backgroundImages: HTMLImageElement[] = [];
  private propImages: HTMLImageElement[] = [];
  private currentBackground: HTMLImageElement | null = null;
  private nextBackground: HTMLImageElement | null = null; // Next background for seamless scrolling
  private currentBackgroundX: number = 0;
  private backgroundActualWidth: number = 0; // Stores the actual width of the background images
  private propSpawnTimer: number = PROP_SPAWN_INTERVAL;
  private backgroundProps: BackgroundProp[] = [];

  public onStateChange: (state: GameState) => void;
  private _playerImageLoaded: boolean = false; // Track if the critical player image loaded

  constructor(
    canvas: HTMLCanvasElement,
    onStateChange: (state: GameState) => void,
    private selectedShoesPath: string | null = null,
    private selectedLowerBodyPath: string | null = null,
    private selectedUpperBodyPath: string | null = null,
    private selectedHairPath: string | null = null,
  ) {
    this.canvas = canvas;
    this.groundHeight = this.canvas.height - GROUND_HEIGHT;
    this.onStateChange = onStateChange;
    this.selectedShoesPath = selectedShoesPath || '/mini-games/gamdok-runner/shoes/shoes1.png';
    this.selectedLowerBodyPath = selectedLowerBodyPath || '/mini-games/gamdok-runner/lower-body/lowerbody1.png';
    this.loadNextPattern(); // This can run in parallel with asset loading
    this.assetsLoadedPromise = this.preloadAssets();
  }

  public async init(): Promise<void> {
    try {
      await this.assetsLoadedPromise;
      if (!this._playerImageLoaded || !this.playerImage) {
        throw new Error("Critical player asset failed to load, cannot initialize game.");
      }
      this.player = new Player(
        PLAYER_INITIAL_X,
        this.groundHeight - PLAYER_INITIAL_Y_OFFSET,
        this.groundHeight,
        this.playerImage,
        this.selectedShoesImage,
        this.selectedLowerBodyImage,
        this.selectedUpperBodyImage,
        this.selectedHairImage,
      );
    } catch (error) {
      console.error("Game initialization failed due to asset loading error:", error);
      this.isGameOver = true;
      this.onStateChange({
        score: this.score,
        lives: this.lives,
        isGameOver: this.isGameOver,
      });
      throw error; // Re-throw to propagate the error
    }
  }

  private async preloadAssets(): Promise<void> {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      });
    };

    const imagePromises: Promise<void>[] = [];

    // Load player base image - CRITICAL
    imagePromises.push(
      loadImage('/mini-games/gamdok-runner/full-body.png')
        .then(img => { this.playerImage = img; this._playerImageLoaded = true; console.log('Player base image loaded:', img.src); })
        .catch(error => { console.error('Failed to load critical player image:', error); throw error; }), // Re-throw for critical asset
    );

    // Load selected clothing images (using paths passed in constructor)
    if (this.selectedShoesPath) {
      imagePromises.push(
        loadImage(this.selectedShoesPath)
          .then(img => { this.selectedShoesImage = img; console.log('Shoes image loaded:', img.src); })
          .catch(error => { console.error('Failed to load shoes image:', error); }),
      );
    }
    if (this.selectedLowerBodyPath) {
      imagePromises.push(
        loadImage(this.selectedLowerBodyPath)
          .then(img => { this.selectedLowerBodyImage = img; console.log('Lower body image loaded:', img.src); })
          .catch(error => { console.error('Failed to load lower body image:', error); }),
      );
    }
    if (this.selectedUpperBodyPath) {
      imagePromises.push(
        loadImage(this.selectedUpperBodyPath)
          .then(img => { this.selectedUpperBodyImage = img; console.log('Upper body image loaded:', img.src); })
          .catch(error => { console.error('Failed to load upper body image:', error); }),
      );
    }
    if (this.selectedHairPath) {
      imagePromises.push(
        loadImage(this.selectedHairPath)
          .then(img => { this.selectedHairImage = img; console.log('Hair image loaded:', img.src); })
          .catch(error => { console.error('Failed to load hair image:', error); }),
      );
    }

    // Load item images
    const itemImageMap = new Map<ItemType, string>([
      [ItemType.GAME_OVER, '/mini-games/gamdok-runner/items/leze.png'],
      [ItemType.SPEED_UP, '/mini-games/gamdok-runner/items/shoes.png'],
      [ItemType.SPEED_DOWN, '/mini-games/gamdok-runner/items/cookie.png'],
      [ItemType.LIFE_UP, '/mini-games/gamdok-runner/items/coffee.png'],
    ]);

    itemImageMap.forEach((src, type) => {
      imagePromises.push(
        loadImage(src)
          .then(img => { this.itemImages.set(type, img); })
          .catch(error => { console.error(`Failed to load image for item type ${type}: ${src}`, error); }),
      );
    });

    // Load background images
    for (let i = 1; i <= 3; i++) {
      const src = `/mini-games/gamdok-runner/background/background${i}.png`;
      imagePromises.push(
        loadImage(src)
          .then(img => {
            this.backgroundImages.push(img);
            if (this.backgroundActualWidth === 0) { // Set actual width from the first loaded background
              this.backgroundActualWidth = img.width;
            }
          })
          .catch(error => { console.error(`Failed to load background image: ${src}`, error); }),
      );
    }

    // Load prop images
    for (let i = 1; i <= 5; i++) {
      const src = `/mini-games/gamdok-runner/background/prop${i}.png`;
      imagePromises.push(
        loadImage(src)
          .then(img => { this.propImages.push(img); })
          .catch(error => { console.error(`Failed to load prop image: ${src}`, error); }),
      );
    }

    await Promise.all(imagePromises);

    if (this.backgroundImages.length > 0) {
      this.currentBackground = this.backgroundImages[random(0, this.backgroundImages.length - 1)];
      this.nextBackground = this.backgroundImages[random(0, this.backgroundImages.length - 1)];
    }
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

    // Background scrolling
    if (this.currentBackground) {
      this.currentBackgroundX -= effectiveGameSpeed * BACKGROUND_SCROLL_SPEED_MULTIPLIER;
      // If current background has scrolled off-screen, reset and pick next
      if (this.currentBackgroundX <= -this.canvas.width) {
        this.currentBackgroundX = 0;
        // The current background becomes the next one
        this.currentBackground = this.nextBackground;
        // Load a new random image for the next background
        this.nextBackground = this.backgroundImages[random(0, this.backgroundImages.length - 1)];
      }
    }

    // Spawn props
    this.propSpawnTimer--;
    if (this.propSpawnTimer <= 0 && this.propImages.length > 0) {
      const randomPropImage = this.propImages[random(0, this.propImages.length - 1)];
      const propWidth = randomPropImage.width;
      const propHeight = randomPropImage.height;

      this.backgroundProps.push(new BackgroundProp(
        this.canvas.width,
        0,
        randomPropImage,
        propWidth,
        propHeight,
      ));
      this.propSpawnTimer = random(PROP_SPAWN_INTERVAL / 2, PROP_SPAWN_INTERVAL * 1.5);
    }

    // Update and filter props
    this.backgroundProps.forEach(prop => {
      prop.position.x -= effectiveGameSpeed;
    });
    this.backgroundProps = this.backgroundProps.filter(prop => prop.position.x + prop.width > 0);

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
      const dynamicObstacleInterval = Math.max(20, OBSTACLE_INTERVAL / (this.globalGameSpeedMultiplier * this.tempSpeedMultiplier));
      this.obstacleSpawnTimer = dynamicObstacleInterval;
    }

    this.itemSpawnTimer -= 1;
    if (this.itemSpawnTimer <= 0) {
      this.spawnItem();
      const dynamicItemInterval = Math.max(50, (ITEM_INTERVAL + random(-50, 50)) / (this.globalGameSpeedMultiplier * this.tempSpeedMultiplier));
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
    // Draw background
    if (this.currentBackground && this.nextBackground) { // Ensure both are loaded
      // Draw the current background
      context.drawImage(
        this.currentBackground,
        this.currentBackgroundX,
        0,
        this.canvas.width,
        this.canvas.height
      );
      // Draw the next background immediately after the current one
      context.drawImage(
        this.nextBackground,
        this.currentBackgroundX + this.canvas.width,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // Draw background props
    this.backgroundProps.forEach(prop => prop.draw(context));

    // Draw ground by segments, leaving holes (moved after background/props)
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
    const heartSpacing = HEART_SPACING;
    const heartWidth = HEART_WIDTH;
    for (let i = 0; i < this.lives; i++) {
      context.fillText('❤️', this.canvas.width - (i + 1) * (heartWidth + heartSpacing) - 5, HEART_Y_OFFSET);
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
    const yPositions = [
      this.groundHeight - 120, // Jumpable
      this.groundHeight - 80,  // Duckable
      this.groundHeight - 50,  // Straight-through/Collectable
    ];
    const y = yPositions[random(0, yPositions.length - 1)];
    let randomItemType: ItemType;

    // 10% chance for GAME_OVER item, otherwise pick from other types
    if (Math.random() < GAME_OVER_ITEM_CHANCE) {
      randomItemType = ItemType.GAME_OVER;
    } else {
      const otherItemTypes = Object.values(ItemType).filter(type => type !== ItemType.GAME_OVER);
      randomItemType = otherItemTypes[Math.floor(Math.random() * otherItemTypes.length)];
    }

    // Define potential item bounds for collision check
    // Using default item width and height from Item constructor (40x40)
    const potentialItemX = this.canvas.width + ITEM_SPAWN_OFFSET_X;
    const potentialItemY = y;
    const potentialItemWidth = ITEM_OVERLAP_CHECK_WIDTH;
    const potentialItemHeight = ITEM_OVERLAP_CHECK_HEIGHT;

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
    this.items.push(new Item(this.canvas.width + ITEM_SPAWN_OFFSET_X, y, 80, 80, randomItemType, itemImage || null));
  }

  private _checkPlayerObstacleCollision() {
    const player = this.player;
    if (!player) return;

    this.obstacles.forEach((obstacle, index) => {
      if (
        player.position.x < obstacle.position.x + obstacle.width &&
        player.position.x + player.hitboxWidth > obstacle.position.x &&
        player.position.y < obstacle.position.y + obstacle.height &&
        player.position.y + player.hitboxHeight > obstacle.position.y
      ) {
        this.obstacles.splice(index, 1);
        this.lives -= 1;
        if (this.lives <= 0) {
          this.lives = 0;
          this.isGameOver = true;
        }
      }
    });
  }

  private _checkPlayerItemCollision() {
    const player = this.player;
    if (!player) return;

    this.items.forEach((item, index) => {
      if (
        player.position.x < item.position.x + item.width &&
        player.position.x + player.hitboxWidth > item.position.x &&
        player.position.y < item.position.y + item.height &&
        player.position.y + player.hitboxHeight > item.position.y
      ) {
        this.items.splice(index, 1);
        switch (item.type) {
          case ItemType.GAME_OVER:
            this.isGameOver = true;
            break;
          case ItemType.SPEED_UP:
            if (this.tempSpeedTimer <= 0) {
              this.tempSpeedMultiplier = SPEED_UP_MULTIPLIER;
              this.tempSpeedTimer = this.tempSpeedDuration;
            }
            break;
          case ItemType.SPEED_DOWN:
            if (this.tempSpeedTimer <= 0) {
              this.tempSpeedMultiplier = SPEED_DOWN_MULTIPLIER;
              this.tempSpeedTimer = this.tempSpeedDuration;
            }
            break;
          case ItemType.LIFE_UP:
            this.lives = Math.min(MAX_LIVES, this.lives + 1);
            break;
        }
        this.score += ITEM_SCORE_BOOST;
      }
    });
  }

  private _checkPlayerHoleCollision() {
    const player = this.player;
    if (!player) return;

    const playerOnGround = player.position.y + player.hitboxHeight >= this.groundHeight;

    if (!player.isFalling && !player.isJumping && playerOnGround) {
      for (const hole of this.holes) {
        // Use player.hitboxWidth for playerCenter calculation
        const playerCenter = player.position.x + player.hitboxWidth / 2;

        const triggerZoneStart = hole.position.x + hole.width * HOLE_TRIGGER_ZONE_START_RATIO;
        const triggerZoneEnd = hole.position.x + hole.width * HOLE_TRIGGER_ZONE_END_RATIO;

        if (playerCenter > triggerZoneStart && playerCenter < triggerZoneEnd) {
          player.fallIntoHole();
          this.fallTimer = FALL_TIMER_DURATION;
          return;
        }
      }
    }
  }

  checkCollisions() {
    const player = this.player;
    if (!player) return;

    this._checkPlayerObstacleCollision();
    this._checkPlayerItemCollision();
    this._checkPlayerHoleCollision();
  }
}