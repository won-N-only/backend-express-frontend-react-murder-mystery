# 머더 미스터리 게임 매칭 시스템

Next.js와 Vercel Postgres를 사용한 파티 게임 매칭 시스템입니다.

## 기능

- 게임 목록 관리 및 검색
- 참가자별 게임 완료 상태 추적
- 인원 수 기반 게임 매칭
- 참가자별 졸업률 통계
- 게임별 완료율 통계

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **데이터베이스**: Vercel Postgres
- **스타일링**: Tailwind CSS
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```
POSTGRES_URL=your_vercel_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
```

### 3. 데이터베이스 초기화

Vercel 대시보드에서 Postgres 데이터베이스를 생성한 후, `scripts/init-db.sql` 파일의 SQL을 실행하여 테이블을 생성하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 배포

1. GitHub에 코드를 푸시합니다.
2. Vercel에 프로젝트를 연결합니다.
3. Vercel 대시보드에서 Postgres 데이터베이스를 생성하고 환경 변수를 설정합니다.
4. 자동으로 배포됩니다.

## API 엔드포인트

### 게임

- `GET /api/games` - 게임 목록 조회
- `POST /api/games` - 새 게임 추가
- `GET /api/games/[id]` - 게임 상세 조회
- `PUT /api/games/[id]` - 게임 수정
- `DELETE /api/games/[id]` - 게임 삭제
- `POST /api/games/[id]/completions` - 완료 상태 업데이트

### 참가자

- `GET /api/players` - 참가자 목록 조회
- `POST /api/players` - 새 참가자 추가
- `GET /api/players/[id]` - 참가자 상세 조회
- `PUT /api/players/[id]` - 참가자 수정
- `DELETE /api/players/[id]` - 참가자 삭제

### 매칭

- `POST /api/match` - 게임 매칭

### 통계

- `GET /api/stats` - 통계 조회

## 프로젝트 구조

```
party-game-matching/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── games/             # 게임 페이지
│   ├── match/             # 매칭 페이지
│   └── stats/             # 통계 페이지
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 및 쿼리
│   ├── queries/          # 데이터베이스 쿼리
│   └── utils/            # 유틸리티 함수
├── types/                 # TypeScript 타입 정의
└── scripts/               # 스크립트 파일
```
