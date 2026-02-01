// Game constants will be defined here
export const GROUND_HEIGHT = 150.5;

export const GAME_SPEED = 3;
export const GLOBAL_SPEED_INCREMENT_INTERVAL = 40;
export const GLOBAL_SPEED_INCREMENT_AMOUNT = 0.01;
export const TEMP_SPEED_DURATION = 120;
export const OBSTACLE_INTERVAL = 40;
export const ITEM_INTERVAL = 300;
export const PLAYER_INITIAL_X = 120;
export const PLAYER_INITIAL_Y_OFFSET = 50; // Offset from groundHeight for player initial Y
export const HOLE_TRIGGER_ZONE_START_RATIO = 0.4;
export const HOLE_TRIGGER_ZONE_END_RATIO = 0.8;
export const FALL_TIMER_DURATION = 60;
export const MAX_LIVES = 3;
export const ITEM_OVERLAP_CHECK_WIDTH = 80; // Consistent with Item constructor
export const ITEM_OVERLAP_CHECK_HEIGHT = 80; // Consistent with Item constructor
export const ITEM_SPAWN_OFFSET_X = 50;
export const GAME_OVER_ITEM_CHANCE = 0.05;
export const SPEED_UP_MULTIPLIER = 1.4;
export const SPEED_DOWN_MULTIPLIER = 0.6;
export const ITEM_SCORE_BOOST = 100;
export const HEART_SPACING = 5;
export const HEART_WIDTH = 24;
export const HEART_Y_OFFSET = 30; // Y position for drawing hearts

// Background and Prop constants
export const BACKGROUND_SCROLL_SPEED_MULTIPLIER = 1.0; // Background scrolls at same speed as foreground
export const PROP_SPAWN_INTERVAL = 180; // How often props spawn (frames)
export const PROP_MIN_Y_OFFSET = 50; // Minimum Y offset from ground for props
export const PROP_MAX_Y_OFFSET = 150; // Maximum Y offset from ground for props
export const PROP_MIN_SCALE = 0.5; // Minimum scale for props
export const PROP_MAX_SCALE = 1.2; // Maximum scale for props
export const HOLE_FILL_COLOR = '#f3f4f6';
