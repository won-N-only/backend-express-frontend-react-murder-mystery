export interface Game {
  id: number;
  order_number: number;
  name: string;
  min_players: number;
  max_players: number | null;
  company: string | null;
  director: string | null;
  series: string | null;
  owned_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Player {
  id: number;
  name: string;
  last_updated: Date | null;
  created_at: Date;
}

export interface GameCompletion {
  id: number;
  game_id: number;
  player_id: number;
  status: '완료' | 'X' | '예정' | '에러플💦';
  completed_at: Date | null;
}

export interface GameWithCompletions extends Game {
  completions: GameCompletion[];
}

export interface PlayerStats {
  player_id: number;
  player_name: string;
  completed_count: number;
  total_games: number;
  completion_rate: number;
}

export interface MatchRequest {
  player_ids: number[];
  player_count: number;
}

export interface MatchResult extends Game {
  match_score: number;
  incomplete_players: string[];
}
