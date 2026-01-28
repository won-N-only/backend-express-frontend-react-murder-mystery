import { sql } from '@vercel/postgres';

export { sql };

// 데이터베이스 연결 테스트
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    return { success: true, data: result };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error };
  }
}
