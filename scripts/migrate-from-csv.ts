/**
 * CSV 파일을 데이터베이스로 마이그레이션하는 스크립트
 * 
 * 사용 방법:
 * 1. ts-node를 사용하여 실행: npx ts-node scripts/migrate-from-csv.ts
 * 2. 또는 Node.js에서 직접 실행: node --loader ts-node/esm scripts/migrate-from-csv.ts
 */

import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

interface CSVRow {
  order: number;
  name: string;
  players: string;
  company: string;
  director: string;
  owned_by: string;
  completions: Record<string, string>;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // 헤더 파싱
  const headers = parseCSVLine(lines[0]);

  // 컬럼 인덱스 찾기
  const orderIndex = headers.indexOf('순서');
  const nameIndex = headers.indexOf('목록');
  const playersIndex = headers.indexOf('인원');
  const companyIndex = headers.indexOf('회사');
  const directorIndex = headers.indexOf('감독'); // 감독은 참가자 컬럼
  const ownedByIndex = headers.indexOf('소장(괄호:대여)');

  // 참가자 컬럼 목록 (감독부터 소장 전까지)
  const playerColumns = headers.slice(directorIndex, ownedByIndex);

  const games: CSVRow[] = [];

  // 데이터 행 파싱 (첫 번째 행은 헤더, 두 번째와 세 번째는 메타데이터이므로 건너뛰기)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);

    // 순서가 0이거나 빈 값인 경우 건너뛰기 (메타데이터 행)
    const orderStr = values[orderIndex]?.trim();
    if (!orderStr || orderStr === '0' || isNaN(parseInt(orderStr))) {
      continue;
    }

    const order = parseInt(orderStr);
    const name = values[nameIndex]?.trim() || '';
    const players = values[playersIndex]?.trim() || '';
    const company = values[companyIndex]?.trim() || '';
    const ownedBy = values[ownedByIndex]?.trim() || '';

    // 게임명이 없으면 건너뛰기
    if (!name || name.includes('리스트 마지막') || name.includes('졸업률')) {
      continue;
    }

    // 감독 정보는 소장 컬럼에서 추출 (예: "감독,귤젤리,콩난")
    const director = ownedBy || null;

    // 참가자별 완료 상태 파싱
    const completions: Record<string, string> = {};
    for (let j = 0; j < playerColumns.length; j++) {
      const playerName = playerColumns[j];
      const status = values[directorIndex + j]?.trim() || '';
      if (status && status !== '') {
        // 상태 정규화 (완료, X, 예정, 에러플💦)
        let normalizedStatus = status;
        if (status === '완료') {
          normalizedStatus = '완료';
        } else if (status === 'X' || status === 'x') {
          normalizedStatus = 'X';
        } else if (status === '예정') {
          normalizedStatus = '예정';
        } else if (status.includes('에러') || status.includes('💦')) {
          normalizedStatus = '에러플💦';
        } else {
          // 빈 값이나 알 수 없는 상태는 건너뛰기
          continue;
        }
        completions[playerName] = normalizedStatus;
      }
    }

    games.push({
      order,
      name,
      players,
      company: company || null,
      director: director || null,
      owned_by: ownedBy || null,
      completions,
    });
  }

  return games;
}

function parsePlayerCount(playersStr: string): { min: number; max: number | null } {
  if (!playersStr) return { min: 4, max: null };

  // "2인", "3-4인", "4-5인" 등의 형식 파싱
  const match = playersStr.match(/(\d+)(?:-(\d+))?인/);
  if (!match) {
    return { min: 4, max: null }; // 기본값
  }
  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : null;
  return { min, max };
}

function extractSeries(name: string): string | null {
  // 시리즈명 추출 (예: "MMM 시리즈 : 시체와 온천" -> "MMM 시리즈")
  const seriesMatch = name.match(/^([^:]+)\s*:/);
  return seriesMatch ? seriesMatch[1].trim() : null;
}

async function migrateFromCSV() {
  try {
    console.log('🚀 CSV 파일 마이그레이션 시작...\n');

    // CSV 파일 경로
    const csvPath = path.join(__dirname, '머더 미스터리_대머리 - 오프라인 머더미스터리.csv');

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV 파일을 찾을 수 없습니다: ${csvPath}`);
    }

    console.log(`📄 CSV 파일 읽기: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const games = parseCSV(csvContent);

    console.log(`✅ ${games.length}개의 게임 데이터 파싱 완료\n`);

    // 참가자 목록 추출 (CSV 헤더에서)
    const csvLines = csvContent.split('\n');
    const headers = parseCSVLine(csvLines[0]);
    const directorIndex = headers.indexOf('감독');
    const ownedByIndex = headers.indexOf('소장(괄호:대여)');
    const playerNames = headers.slice(directorIndex, ownedByIndex);

    console.log('👥 참가자 생성 중...');
    const playerMap = new Map<string, number>();

    for (const name of playerNames) {
      if (!name || name.trim() === '') continue;

      try {
        const result = await sql`
          INSERT INTO players (name)
          VALUES (${name.trim()})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;
        playerMap.set(name.trim(), result.rows[0].id);
        console.log(`  ✓ ${name.trim()} (ID: ${result.rows[0].id})`);
      } catch (error: any) {
        console.error(`  ✗ ${name.trim()} 생성 실패:`, error.message);
      }
    }

    console.log(`\n✅ 총 ${playerMap.size}명의 참가자 생성 완료\n`);

    // 게임 데이터 입력
    console.log('🎮 게임 데이터 입력 중...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const game of games) {
      try {
        const { min, max } = parsePlayerCount(game.players);
        const series = extractSeries(game.name);

        // 게임 생성 또는 업데이트
        const gameResult = await sql`
          INSERT INTO games (order_number, name, min_players, max_players, company, director, series, owned_by)
          VALUES (
            ${game.order},
            ${game.name},
            ${min},
            ${max},
            ${game.company || null},
            ${game.director || null},
            ${series || null},
            ${game.owned_by || null}
          )
          ON CONFLICT DO NOTHING
          RETURNING id
        `;

        let gameId: number;

        if (gameResult.rows.length === 0) {
          // 이미 존재하는 경우 ID 조회
          const existing = await sql`
            SELECT id FROM games WHERE name = ${game.name} LIMIT 1
          `;
          if (existing.rows.length === 0) {
            console.error(`  ✗ 게임을 찾을 수 없습니다: ${game.name}`);
            errorCount++;
            continue;
          }
          gameId = existing.rows[0].id;
        } else {
          gameId = gameResult.rows[0].id;
        }

        // 완료 상태 입력
        for (const [playerName, status] of Object.entries(game.completions)) {
          const playerId = playerMap.get(playerName);
          if (!playerId) {
            continue;
          }

          try {
            await sql`
              INSERT INTO game_completions (game_id, player_id, status)
              VALUES (${gameId}, ${playerId}, ${status})
              ON CONFLICT (game_id, player_id) 
              DO UPDATE SET status = EXCLUDED.status
            `;
          } catch (error: any) {
            console.error(`    ⚠ 완료 상태 업데이트 실패 (${playerName}):`, error.message);
          }
        }

        console.log(`  ✓ ${game.order}. ${game.name}`);
        successCount++;
      } catch (error: any) {
        console.error(`  ✗ ${game.order}. ${game.name} 실패:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✅ 마이그레이션 완료!`);
    console.log(`   성공: ${successCount}개`);
    console.log(`   실패: ${errorCount}개`);
    console.log(`   총 게임: ${games.length}개`);

  } catch (error: any) {
    console.error('\n❌ 마이그레이션 오류:', error.message);
    console.error(error);
    throw error;
  }
}

// 실행
if (require.main === module) {
  migrateFromCSV()
    .then(() => {
      console.log('\n🎉 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 오류:', error);
      process.exit(1);
    });
}

export { migrateFromCSV };
