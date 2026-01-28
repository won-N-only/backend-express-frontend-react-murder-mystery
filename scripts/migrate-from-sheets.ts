/**
 * Google Sheets 데이터를 데이터베이스로 마이그레이션하는 스크립트
 * 
 * 사용 방법:
 * 1. Google Sheets에서 CSV로 내보내기
 * 2. CSV 파일을 scripts/games-data.csv로 저장
 * 3. npm run migrate 실행
 */

import { sql } from '@vercel/postgres';

interface SheetRow {
  order: number;
  name: string;
  players: string;
  company: string;
  director: string;
  [key: string]: any; // 참가자별 완료 상태
}

function parsePlayerCount(playersStr: string): { min: number; max: number | null } {
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

async function migrateGames() {
  try {
    console.log('게임 데이터 마이그레이션 시작...');

    // CSV 파일 읽기 (실제로는 Google Sheets API를 사용하거나 CSV 파일을 읽어야 함)
    // 여기서는 예시 데이터 구조를 보여줍니다

    // 참가자 목록 (시트의 헤더에서 추출)
    const playerNames = [
      '감독', '연두', '키키', '고래', '콩난', '귤젤리', '태산', '러프', '태규',
      '물망쵸', '무디', '내장지방', '돌멩이', '돌게', '아마추어', '찐빵', '결',
      '땅물', 'SUN', '오네', '제로', '피아', '동그리', '바다', '범신', '은'
    ];

    // 참가자 생성
    console.log('참가자 생성 중...');
    const playerMap = new Map<string, number>();

    for (const name of playerNames) {
      try {
        const result = await sql`
          INSERT INTO players (name)
          VALUES (${name})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;
        playerMap.set(name, result.rows[0].id);
        console.log(`  ✓ ${name} (ID: ${result.rows[0].id})`);
      } catch (error) {
        console.error(`  ✗ ${name} 생성 실패:`, error);
      }
    }

    console.log(`\n총 ${playerMap.size}명의 참가자 생성 완료\n`);

    // 게임 데이터는 수동으로 입력하거나 Google Sheets API를 사용해야 합니다
    // 아래는 예시입니다:

    console.log('게임 데이터 마이그레이션:');
    console.log('Google Sheets에서 데이터를 추출하여 아래 형식으로 변환하세요:');
    console.log(`
    {
      order: 1,
      name: "MMM 시리즈 : 시체와 온천",
      players: "4-5인",
      company: "언더독 게임즈",
      director: "감독",
      completions: {
        "감독": "완료",
        "연두": "완료",
        // ...
      }
    }
    `);

    console.log('\n마이그레이션 완료!');
    console.log('실제 데이터는 Google Sheets API를 사용하거나 CSV 파일을 파싱하여 입력하세요.');

  } catch (error) {
    console.error('마이그레이션 오류:', error);
    throw error;
  }
}

// 실행
if (require.main === module) {
  migrateGames()
    .then(() => {
      console.log('완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('오류:', error);
      process.exit(1);
    });
}

export { migrateGames };
