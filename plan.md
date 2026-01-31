# Codebase Optimization and Refactoring Plan

## 1. Completed Task Summary

*   Successfully moved `app/avoid-bald` and `app/brick-breaker` directories into `app/mini-games/`.
*   Updated `href` paths in `app/mini-games/page.tsx` to reflect the new directory structure (e.g., `/brick-breaker` to `/mini-games/brick-breaker`).
*   Resolved a `TypeError: Cannot find name 'PLAYER_SPEED'` in `app/mini-games/gamdok-runner/components/GamdokRunner.tsx` by adding `PLAYER_SPEED` to its import statement from `../constants`.
*   The project now builds successfully without errors.

## 2. Identified Refactoring and Optimization Points

Based on the recent changes and build output, here are some areas for potential improvement:

### 2.1. Image Optimization

*   **Issue:** The build process flagged warnings in `app/mini-games/avoid-bald/page.tsx` regarding the use of `<img>` tags, suggesting it could lead to slower LCP and higher bandwidth consumption.
*   **Recommendation:** Replace native `<img>` tags with Next.js's `<Image />` component for automatic image optimization (lazy loading, responsive images, format optimization). This will improve performance and user experience.

### 2.2. React Hook Dependencies

*   **Issue:** A warning was identified in `app/mini-games/gamdok-runner/components/GamdokRunner.tsx` indicating that the `useCallback` hook has unnecessary dependencies (`items` and `resetGame`).
*   **Recommendation:** Review the dependencies of `useCallback` and other React hooks (`useEffect`, `useMemo`) to ensure they are correctly specified. Incorrect dependencies can lead to stale closures or unnecessary re-renders. Exclude `items` and `resetGame` if they are not truly dependencies that change across renders or if `resetGame` is itself a `useCallback` with stable dependencies.

### 2.3. Next.js MetadataBase Configuration

*   **Issue:** Multiple warnings appeared during the build: `metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000"`.
*   **Recommendation:** Configure the `metadataBase` property in the `metadata` export of your root `layout.tsx` or `page.tsx` files. This ensures that social sharing images (Open Graph, Twitter Cards) use the correct absolute URLs when deployed, improving SEO and social media presence.

### 2.4. Centralized Game Configuration and Structure

*   **Observation:** Each mini-game (`avoid-bald`, `brick-breaker`, `gamdok-runner`) currently has its own dedicated folders for `constants`, `hooks`, `types`, and `utils` directly within its game directory.
*   **Recommendation:** As the number of mini-games grows, consider establishing a more centralized or standardized structure for common game-related assets and logic.
    *   **Shared Game Utilities/Hooks:** Identify common patterns or functionalities across games (e.g., game loop mechanisms, input handling, physics calculations) and extract them into shared hooks or utility functions in a `app/mini-games/shared` or `app/hooks` directory.
    *   **Consistent `constants` and `types`:** While game-specific constants are fine, some global game configurations or fundamental types could be moved to a shared `mini-games/types` or `mini-games/constants` if applicable, reducing redundancy.

### 2.5. API Routes Organization (Current good practice, future consideration)

*   **Observation:** The `app/api/_handlers` and `app/api/_mappers` structure demonstrates a clear separation of concerns, which is good.
*   **Future Consideration:** As the API grows, you might explore further organizational patterns like grouping related handlers/mappers within domain-specific sub-folders (e.g., `_handlers/games`, `_handlers/comments`) if the current flat structure becomes unwieldy.

### 2.6. Domain-Driven Design (DDD) Structure in `src`

*   **Observation:** The `src` directory shows a well-structured approach using DDD principles (`comment`, `completion`, `game`, `match`, `player`, `shared`, `stats` with `application`, `domain`, `infrastructure`). This is an excellent foundation for maintainable and scalable code.
*   **Recommendation:** Continue to strictly adhere to this pattern. Ensure that `domain` layers remain pure (business logic, entities, value objects, interfaces) and are not polluted with infrastructure details. `application` layers should orchestrate domain logic, and `infrastructure` should handle external concerns (databases, external services).

## 3. Future Considerations

*   **Common Game Components:** If visual components (e.g., buttons, score displays, modal overlays) are consistently used across mini-games, consider extracting them into `app/components/common` to promote reusability and maintain a consistent UI/UX.
*   **Test Coverage:** Implement unit and integration tests for game logic, hooks, and API handlers to ensure long-term stability and easier refactoring.
