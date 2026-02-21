# Implementation Plan - Debug Dashboard Sites Tab

## Phase 1: Research & Diagnosis
- [x] Reproduce current issues (check console, logs, and UI behavior).
- [x] Audit `SiteController.list()` for potential edge cases (e.g., empty directories, missing config files).
- [x] Audit `app.js:loadSites()` for rendering bugs or race conditions.
- [x] Verify API endpoints for all action buttons on the site card.

## Phase 2: Backend Fixes
- [x] Address issues in `SiteController.js` related to site discovery or status calculation.
- [x] Ensure `athena.js` correctly routes all site-related requests.
- [x] Improve error handling and logging for site-related operations.

## Phase 3: Frontend Fixes
- [x] Fix rendering issues in `app.js:loadSites()`.
- [x] Ensure UI feedback for all actions (loading spinners, success/error messages).
- [x] Improve real-time status polling if necessary.

## Phase 4: Verification
- [x] Test all action buttons for multiple sites.
- [x] Verify status transitions (Offline -> Online -> Offline).
- [x] Check for regressions in other tabs.
