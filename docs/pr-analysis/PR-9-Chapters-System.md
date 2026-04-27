# PR 9: feat: implement arena, chapters, and daily challenges

## Overview
This PR implements a new chapters/assessments feature, adding typed chapter metadata and assessment datasets, a question provider, a `ChaptersPage` UI with routing, and supporting curriculum documentation. It establishes the infrastructure for theoretical and terminal-based chapter assessments.

## CodeRabbit Bot Findings & Required Fixes

### Data & Content
- **`src/data/chaptersData.ts`**:
  - Pools arrays for chapters 6, 7, and 8 contain a single pool, meaning replay rotation always returns the same assessments. Must add additional pools or a `nonRotating` flag.
  - The explanation for `/etc` incorrectly claims it stands for "editable text configuration". Must replace with accurate description.
  - `moduleId` values for Chapters 5, 6, 7, and 8 are incorrect and map to wrong modules. Must be updated to 7, 9, 10, and 3 respectively.
  - Several assessments set `regexMatch: true` while `correctAnswer` strings are literal commands containing unescaped metacharacters. Must remove `regexMatch` or properly escape strings with anchors.
- **`docs/system/RHCSA_MAPPING.md`**:
  - Document is outdated and conflicts with the shipped 27-chapter structure. Must rewrite to describe the shipped tracks mapping to EX200 domains, or add a prominent supersede note.

### Components & UI
- **`src/components/layout/AshbornLayout.tsx`**:
  - The Chapters nav item reuses `Icons.Docs`. Must add a distinct icon (e.g., `Icons.Book`) to the `Icons` object and use it for the chapters navigation.
- **`src/pages/ChaptersPage.tsx`**:
  - Track 1 and Track 2 grids have duplicated JSX. Must extract into a reusable `<TrackSection>` component.
  - The chapter card `onClick` calls `handleStartChapter` even when locked. Must add an `if (!locked)` guard.
  - Missing default export in `src/pages/ChaptersPage.tsx`. Need to add `export default ChaptersPage` to simplify the `React.lazy` import in `src/App.tsx`.

### Logic & State Management
- **`src/pages/ChaptersPage.tsx`**:
  - `completedChapterIds` is in local component state, resetting on remount. Must persist completion to the app-level `gamificationStore`.
  - `handleStartChapter` awaits fetch without error handling. Must wrap in `try/catch` and gracefully handle fetch rejections.
  - `useEffect` reads `handleStepAdvance` without listing it in the dependency array. Must wrap in `useCallback` and add to deps.
  - RegExp constructor can throw on malformed patterns. Must wrap `new RegExp(...)` in a `try/catch`.
- **`src/features/lab-engine/providers/QuestionProvider.ts`**:
  - `generateSyntheticDrill` exposes answers and enables XP farming. Must remove bypass, add a `practiceOnly` flag, and prevent XP awards for synthetic sessions.
  - `staticQuestionBank` has zero authored questions for 22 out of 27 chapters. Must add explicit stubs/placeholders to surface gaps and render as "Coming Soon".
