# New Eden Archive Changelog

## V1.0.1 - 2026-06-03 3:13 AM CT - Curriculum Edit Wording Hotfix

### Summary
- Tightened the Curriculums page wording so the edit action reflects that it edits the selected curriculum record in this workspace.
- Added this changelog entry as the first post-baseline update following the V1.0.0 launch entry.

### Fixes
- Renamed the Curriculums page action from **Edit Program** to **Edit Curriculum**.
- Renamed modal labels from program-oriented wording to curriculum-oriented wording where appropriate.
- Changed **Department** in the curriculum overview card to **Program** to better describe the grouping/category the curriculum belongs to.
- Made the Description field in the edit modal populate with the same default description shown in the overview when no saved description exists yet.

### Process
- From this version forward, archive edits should receive versioned changelog entries in `changelog.md`.

## V1.0.0 - 2026-06-03 3:00 AM CT - Archive Foundation and Curriculum Workspace

### Summary
- Established the New Eden Archive as a Firebase-backed web app using Realtime Database as the editable source of truth.
- Migrated archive data out of Firestore and into Realtime Database.
- Reworked the Courses and Curriculums pages into cleaner working views for archive management.

### Firebase and Data
- Switched the app from Firestore runtime reads/writes to Realtime Database.
- Added a one-time Firestore to Realtime Database migration tool.
- Added Realtime Database paths for courses, programs, curriculum rows, version data, users, admins, and attachment metadata.
- Preserved Firebase Auth sign-in and admin role gating.

### Courses
- Added searchable Course Catalog controls.
- Added numeric-aware sorting for Course ID, Credit, and Course Name.
- Added course Add, Edit, and Delete actions.
- Replaced browser confirmation popups with themed New Eden confirmation dialogs.
- Removed the repeated hero/stat header from the Course Catalog page.

### Curriculums
- Moved curriculum/program details and required-course management into the Curriculums page.
- Removed duplicate curriculum dropdown controls.
- Simplified the required-course table to Course ID, Course Name, Credit, and Remove.
- Added requirement search and credit filtering.
- Kept Manage Requirements as the primary bulk add/remove workflow.

### Programs, Notes, and Attachments
- Program Notes now display saved note content instead of placeholder text.
- Program descriptions now use saved description content when available.
- Attachment uploads now support both browse upload and drag/drop.
- Attachment upload errors now show a visible status message instead of silently stalling.

### Version History
- Replaced placeholder Firebase version-history rows with a local markdown-driven changelog.
- Added accordion-style changelog display in the Version History tab.
- Established V1.0.0 as the starting version format for future archive updates.
