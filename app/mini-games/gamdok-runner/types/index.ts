// Type definitions for the game will be here
export interface Position {
  x: number;
  y: number;
}

export enum ItemType {
  GAME_OVER = 'GAME_OVER',
  SPEED_UP = 'SPEED_UP',
  SPEED_DOWN = 'SPEED_DOWN',
  LIFE_UP = 'LIFE_UP',
}

export type GameState = {
  score: number;
  lives: number;
  isGameOver: boolean;
};