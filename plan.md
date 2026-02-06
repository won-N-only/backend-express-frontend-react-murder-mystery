## 변경사항 요약 보고서: 조합 추천 페이지에서 플레이 가능한 게임 목록 API 호출 지연

### 목표
"조합 추천" 페이지에서 "플레이 가능한 게임 목록 보기" 버튼을 클릭하기 전까지는 관련 API(`api/match/playable-games`) 호출을 지연시켜 불필요한 네트워크 요청을 줄이고 성능을 최적화하는 것이 목표였습니다.

### 구현 상세

#### 1. 프론트엔드 구현: 조합 추천 페이지 (`app/match/page.tsx`)

*   **새로운 상태 추가**:
    *   `fetchPlayableGames`라는 새로운 boolean 상태 변수를 추가하고 초기값을 `false`로 설정했습니다. 이 상태는 플레이 가능한 게임 API 호출을 조건부로 트리거하는 데 사용됩니다.
*   **`useSWR` 호출 조건 수정**:
    *   플레이 가능한 게임을 가져오는 `useSWR` 훅의 키 조건부를 `selectedPlayers.length > 0`에서 `fetchPlayableGames && selectedPlayers.length > 0`로 변경했습니다. 이로써 `useSWR`는 `fetchPlayableGames`가 `true`일 때만 API를 호출하게 됩니다.
*   **버튼 `onClick` 핸들러 수정**:
    *   "플레이 가능한 게임 목록 보기" 버튼의 `onClick` 핸들러를 수정하여, 모달을 여는 `setShowPlayableGamesModal(true)`와 함께 `setFetchPlayableGames(true)`를 호출하도록 했습니다. 이는 사용자가 버튼을 클릭했을 때 비로소 API 호출이 시작되도록 합니다.
    *   버튼의 `disabled` 상태 로직도 `isLoadingPlayableGames || playableGames.length === 0`에서 `selectedPlayers.length === 0`으로 변경했습니다. 이는 플레이어가 선택되지 않았을 때만 버튼이 비활성화되도록 하여, API 호출 전에 버튼의 로딩 상태에 의존하지 않게 합니다.
    *   버튼 텍스트의 로딩 상태 표시도 `isLoadingPlayableGames && fetchPlayableGames` 조건부로 변경하여, `fetchPlayableGames` 상태가 `true`일 때만 로딩 메시지가 표시되도록 했습니다.
*   **`GameListModal` `onClose` 핸들러 수정**:
    *   `GameListModal`의 `onClose` 핸들러에 `setFetchPlayableGames(false)`를 추가했습니다. 모달이 닫히면 `fetchPlayableGames` 상태를 초기화하여, 다음 번 버튼 클릭 시에 새로운 API 호출이 이루어지도록 준비합니다.

### 결론
이번 변경을 통해 "조합 추천" 페이지는 플레이 가능한 게임 목록을 가져오는 API 호출을 사용자의 명시적인 요청(버튼 클릭) 시점으로 지연시킴으로써 애플리케이션의 반응성과 효율성을 향상시켰습니다. 불필요한 데이터 페칭을 줄이고, 자원 사용을 최적화하여 더 나은 사용자 경험을 제공할 것입니다.