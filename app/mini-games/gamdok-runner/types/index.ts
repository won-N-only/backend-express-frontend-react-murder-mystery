// Type definitions for the game will be here
export interface Position {
  x: number;
  y: number;
}

export type GameState = {
  score: number;
  lives: number;
  isGameOver: boolean;
};