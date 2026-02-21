# Specification - Debug Dashboard Sites Tab

## Goal
Identify and fix issues within the "Sites" tab of the Athena Management Dashboard (`factory/dashboard/athena.js` and `factory/dashboard/public/app.js`).

## Context
The "Sites" tab is the central hub for managing generated websites. Users have reported issues (vague, need to be identified) that prevent smooth operation, such as incorrect statuses, missing sites, or non-functional action buttons.

## Requirements
- All generated sites in the `sites/` directory must be listed correctly.
- Site status (Local/Live/Active) must be accurate.
- Action buttons (DEV, DOCK, MEDIA, STOP, GATEWAY, SHEET, BLOG, SEO, STIJL, INSTEL., DEPLOY) must function as intended.
- Real-time status updates (e.g., when a server starts or stops) must be reflected in the UI.

## Success Criteria
- [x] Sites tab correctly lists all sites from `sites/`.
- [x] Status indicators (dots, badges) accurately reflect the site's state.
- [x] Action buttons trigger the correct API endpoints and provide feedback.
- [x] No console errors when interacting with the Sites tab.
