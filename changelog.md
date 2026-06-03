# New Eden Archive Changelog

## V1.0.7 - 2026-06-03 4:34 AM CT - Program and Curriculum Action Split

### Summary
- Split Program editing from curriculum management so the Programs page actions now match the intended workflow.

### Fixes
- Changed **Edit Program** to open a category-only editor for Program Name, Status, and Notes.
- Kept **Manage Curriculums** as the full curriculum builder for adding/removing curriculums under a program category.
- Renamed the existing-program builder title to **Manage Curriculums** so it is not confused with Edit Program.
- Added an **Add Curriculum** button to the Curriculums tab header.
- Made Add Curriculum default to the currently selected program category when possible.
- After saving a new curriculum, the Curriculums tab selects that curriculum so requirements can be added immediately.

## V1.0.6 - 2026-06-03 4:25 AM CT - Overview Metrics Cleanup

### Summary
- Cleaned up the archive metrics so they match the current app workflow and only appear on the Overview tab.

### Fixes
- Reduced the Overview metric strip to Courses, Programs, and Curriculums.
- Changed Programs to count major program categories instead of curriculum records.
- Changed Curriculums to count curriculum records instead of imported requirement rows.
- Removed the outdated Curriculum Rows and Sections cards from the Overview metrics.
- Hid the shared hero and metric strip on the Programs page.
- Updated the realtime status summary to use Courses, Programs, and Curriculums terminology.

## V1.0.5 - 2026-06-03 4:16 AM CT - Program Builder Load Hotfix

### Summary
- Fixed a Realtime Database loading regression caused by the new program category path being treated as required data.

### Fixes
- Made `programCategories` an optional Realtime Database read so existing courses, curriculums, and program records still load if that new path is missing or not yet allowed by published rules.
- Added `programCategories` to the checked-in Realtime Database rules file.
- Fixed Program Builder X and Cancel buttons so they close the modal without triggering required-field validation.

### Notes
- The app can now derive program categories from existing curriculum/program data until the new `programCategories` path is available in Firebase.

## V1.0.4 - 2026-06-03 4:01 AM CT - Program Structure Builder

### Summary
- Reworked the Programs tab into the top-level structure workspace for major program categories and their curriculums.

### New Features
- Added a Program Builder modal for creating and editing major program categories such as Biblical Studies, Herbal Programs, and Traditional Naturopathy.
- Added a curriculum builder area inside the Program Builder so curriculums can be added under a selected program category.
- Added Realtime Database support for a new `programCategories` collection, while preserving existing curriculum records under the current `programs` path.

### Improvements
- Changed the Programs page heading to **Program Structure** with workflow-focused helper text.
- Updated Programs page cards so each card represents a major program category and lists its curriculums underneath.
- Changed the Add Program button so it no longer opens the curriculum editor.
- Updated destructive wording so row-level removal is described as removing a curriculum, not removing a whole program.

### Workflow
- Programs tab: create major program categories and organize their curriculums.
- Curriculums tab: edit curriculum details, notes, attachments, and required courses.
- Courses tab: add or edit standalone course records used by curriculums.

## V1.0.3 - 2026-06-03 3:30 AM CT - Required Course Sorting Hotfix

### Summary
- Added the missing ascending/descending sort controls to the Required Courses table in the Curriculums workspace.

### Fixes
- Made Course ID, Course Name, and Credit headers clickable with chevron indicators.
- Set Required Courses to default-sort by Course ID ascending.
- Added numeric-aware sorting for course IDs and credits so values sort in the expected order.
- Preserved the existing required-course search and credit filter behavior.

## V1.0.2 - 2026-06-03 3:21 AM CT - Attachment Upload Hotfix

### Summary
- Improved attachment uploads so the interface no longer remains stuck on an endless uploading status when Firebase Storage does not complete the request.

### Fixes
- Switched attachment uploads to Firebase resumable upload tasks.
- Added a 30-second upload timeout with a clear Firebase status message if Storage stalls.
- Added immediate local attachment list updates after metadata saves, so a completed upload appears under Attachments without waiting on the realtime listener.
- Preserved both drag/drop upload and browse-file upload behavior.

### Notes
- If uploads still fail after this hotfix, the visible status message should point to the next setup issue, such as Firebase Storage rules, bucket configuration, or network access.

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
