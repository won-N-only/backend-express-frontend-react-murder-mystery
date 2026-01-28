# 데이터 마이그레이션 스크립트

## 사용 방법

### 1. 환경 변수 설정

`.env.local` 파일에 Vercel Postgres 연결 정보를 설정하세요:

```
POSTGRES_URL=your_vercel_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
```

### 2. 데이터베이스 초기화

먼저 데이터베이스 테이블을 생성해야 합니다:

```sql
-- scripts/init-db.sql 파일의 내용을 실행하세요
```

Vercel Postgres 대시보드에서 SQL Editor를 사용하거나, psql을 통해 실행할 수 있습니다.

### 3. CSV 파일 마이그레이션

CSV 파일을 데이터베이스로 마이그레이션:

```bash
npm install
npm run migrate
```

또는 직접 실행:

```bash
npx tsx scripts/migrate-from-csv.ts
```

## 스크립트 설명

### migrate-from-csv.ts

CSV 파일을 파싱하여 데이터베이스에 게임과 참가자 정보를 입력합니다.

- CSV 파일 경로: `scripts/머더 미스터리_대머리 - 오프라인 머더미스터리.csv`
- 참가자 자동 생성
- 게임 정보 입력
- 완료 상태 입력

### init-db.sql

데이터베이스 스키마를 생성하는 SQL 스크립트입니다.

## 문제 해결

### CSV 파일을 찾을 수 없습니다

CSV 파일이 `scripts/` 디렉토리에 있는지 확인하세요.
파일명이 정확히 일치해야 합니다: `머더 미스터리_대머리 - 오프라인 머더미스터리.csv`

### 데이터베이스 연결 오류

환경 변수가 올바르게 설정되었는지 확인하세요.
Vercel Postgres 데이터베이스가 생성되었는지 확인하세요.

### 중복 데이터

스크립트는 `ON CONFLICT` 처리를 사용하므로 중복 실행해도 안전합니다.
기존 데이터는 업데이트되지 않고 새 데이터만 추가됩니다.
