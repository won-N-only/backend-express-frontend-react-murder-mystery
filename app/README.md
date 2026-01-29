# App Router 폴더 구조

## 라우트 (URL = 폴더 경로)

Next.js App Router 표준: **`app/경로/page.tsx`** → URL `/경로`

| 폴더                      | URL          | 설명      |
| ------------------------- | ------------ | --------- |
| `app/page.tsx`            | `/`          | 랜딩      |
| `app/history/page.tsx`    | `/history`   | 이력      |
| `app/games/page.tsx`      | `/games`     | 게임 목록 |
| `app/games/[id]/page.tsx` | `/games/:id` | 게임 상세 |
| `app/match/page.tsx`      | `/match`     | 매칭      |
| `app/stats/page.tsx`      | `/stats`     | 통계      |

## 권장 패턴

- **page.tsx**: 라우트 진입점만 두고 얇게 유지
- **실제 UI/로직**: `app/components/pages/해당페이지/` 에 Section 또는 조각 컴포넌트로 분리

예: `app/history/page.tsx` → PageHeader, PlayerListGrid, 졸업률/완료 게임, RecentPlaysList 등 직접 구성  
예: `app/stats/page.tsx` → `<StatsSection />`

## Route Group (선택)

URL을 바꾸지 않고 폴더만 묶고 싶다면 `(그룹명)` 사용:

- `app/(main)/history/page.tsx` → URL 그대로 `/history`
- 레이아웃을 그룹별로 나누고 싶을 때 유용
