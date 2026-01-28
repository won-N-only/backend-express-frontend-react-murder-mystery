-- 게임 테이블
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  order_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  min_players INTEGER NOT NULL,
  max_players INTEGER,
  company VARCHAR(100),
  director VARCHAR(100),
  series VARCHAR(100),
  owned_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 참가자 테이블
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  last_updated DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 게임 완료 상태 테이블 (다대다 관계)
CREATE TABLE IF NOT EXISTS game_completions (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'X', -- '완료', 'X', '예정', '에러플💦'
  completed_at DATE,
  UNIQUE(game_id, player_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_game_completions_game ON game_completions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_completions_player ON game_completions(player_id);
CREATE INDEX IF NOT EXISTS idx_games_order ON games(order_number);
CREATE INDEX IF NOT EXISTS idx_games_company ON games(company);
CREATE INDEX IF NOT EXISTS idx_games_series ON games(series);
