# New Eden Archive Changelog

## V1.5.3 - 2026-06-05 10:00 AM CT - Dashboard Polish and Staff Progress

### Summary
- Polished dashboard layout, transcript/file/email/program button sizing, and added the first Staff Progress gamification panel.

### New Features
- Added a Staff Progress overview module powered by activity log XP, levels, titles, badges, rankings, and contribution streaks.
- Added Founder badge support for Darren, Bhumika, Donna, Larry, and Dr. Duda.
- Collapsed older version history entries into an Older Versions accordion so the Version History page stays compact without deleting changelog data.

### Fixes
- Rearranged Overview modules into the requested row layout and renamed archive-facing dashboard panel titles.
- Enlarged Transcript PDF import/save modals so their content no longer overflows.
- Standardized button icon spacing, button height, and text alignment across transcript actions, saved drafts, Email Dispatch, File Manager, and program/curriculum action tables.
- Updated the visible app version label to V1.5.3.

## V1.5.2 - 2026-06-05 8:55 AM CT - Transcript File Manager Save and Import

### Summary
- Connected the Transcript Generator to the centralized File Manager so transcript PDFs can be imported from stored files and saved back into the archive.

### New Features
- Added an Import Transcript PDF chooser with options for importing from the computer or from File Manager.
- Added File Manager transcript import support for stored PDF records.
- Added a Save Transcript PDF chooser with options to save to the computer, save to File Manager, or save to both.
- Added PDF generation for File Manager saves using the New Eden transcript logo, seal, signature, transcript rows, GPA, credits, and student details.
- Saved generated transcript PDFs into File Manager with category `Transcript` and linked course IDs from the transcript rows.

### Fixes
- Changed transcript saving from a single browser print action into a clearer destination-based workflow.
- Logged transcript PDF saves and imports in the activity log.
- Updated the visible app version label to V1.5.2.

## V1.5.1 - 2026-06-05 12:53 AM CT - Staff Status and File Metadata Editing

### Summary
- Cleaned up the Overview Staff Status panel and added metadata editing for existing File Manager records.

### New Features
- Added an Edit action for File Manager files so admins can change file category and linked course IDs without reuploading the file.
- Reused the File Builder in edit mode with a stored-file preview and metadata-only save behavior.

### Fixes
- Deduplicated Staff Status users so real profile/presence records replace matching fallback staff entries.
- Kept fallback staff visible only when no matching real profile has been loaded yet.
- Included the updated transcript print formatting and Firebase functions config changes in this release.
- Updated the visible app version label to V1.5.1.

## V1.5.0 - 2026-06-04 11:36 PM CT - Dashboard Users and Email Dispatch Templates

### Summary
- Expanded the Overview dashboard with staff status and contribution modules, then converted the student file email area into a themed Email Dispatch tool with reusable templates.

### New Features
- Added a Staff Status overview panel showing known users, online/offline state, last login when available, and profile pictures or initials.
- Added an Archive Contributors overview panel with creation, edit, deletion, and total contribution counts from the activity log.
- Renamed File Send Tool to Email Dispatch.
- Replaced separate subject/content controls with a single Email Templates builder for reusable dispatch templates.
- Added support for multiple email templates with a selected active template for sending.
- Added File Manager categories for CI, eBook, Transcript, and Other.

### Fixes
- Removed email subject/body preview text beside the Email Dispatch template controls.
- Added category display/search support in File Manager and Email Dispatch file selection.
- Updated the transcript action label from Print / Save PDF to Save PDF while keeping the existing local save/print behavior available.
- Updated the visible app version label to V1.5.0.

## V1.4.2 - 2026-06-04 6:21 PM CT - Shared Email Template Controls

### Summary
- Replaced the File Send inline subject and email body fields with shared template editors that save to Firebase Realtime Database.

### New Features
- Added an Edit Subject modal for the Student Email tool.
- Added an Edit Email Content modal with a markdown guide for staff who need formatting help.
- Added Realtime Database storage for the shared student file email subject and markdown body under `emailTemplates/studentFiles`.
- Added a live listener so saved email template changes update for all signed-in users.

### Fixes
- Changed the File Send form to show compact preview buttons instead of editable inline template fields.
- Added Realtime Database rules for admin-only email template writes and authenticated reads.
- Added `.gitignore` protection for local Cloud Functions environment variables.
- Updated the visible app version label to V1.4.2.

## V1.4.1 - 2026-06-04 5:58 PM CT - File Send Backend Scaffold

### Summary
- Tightened the File Manager UI and added the first Firebase Cloud Function scaffold for automated student file emails.

### New Features
- Added a callable Cloud Function named `sendStudentFilesEmail` that verifies Firebase Auth, checks admin access in Realtime Database, loads File Manager metadata, attaches Cloud Storage files, renders markdown email bodies, sends through SMTP environment variables, and writes activity log entries.
- Connected the frontend Send button to the callable function when Firebase is live.
- Enabled editable markdown for the student email subject and body fields.
- Added multi-file upload support in the File Manager Add File builder.

### Fixes
- Reordered the sidebar to Overview, Courses, Curriculums, Programs, Transcripts, Log, File Manager, Version History, and Profile Settings.
- Hid the hero and metric cards from the File Manager page.
- Removed the permanent email backend warning from the page and only shows send status after action.
- Reduced File Send and File Manager action button sizing so Add File, Send, Download, and Delete align better.
- Updated the visible app version label to V1.4.1.

## V1.4.0 - 2026-06-04 5:26 PM CT - Central File Manager

### Summary
- Moved archive file handling toward a centralized File Manager so course files can be uploaded once and reused across every curriculum that contains the linked course.

### New Features
- Added a File Manager sidebar tab with search, pagination, download actions, and admin-only delete controls.
- Added an Add File builder that uploads to Firebase Cloud Storage and stores file metadata in Realtime Database under `files`.
- Added course association selection inside the File Builder so each stored file can link to one or more course IDs.
- Added a Student Email / File Send tool UI that can select existing File Manager records for a future secure Firebase Cloud Function email sender.
- Added a multi-select File Selector builder with file search and browse-by-curriculum lookup.

### Fixes
- Changed the Curriculum Attachments tab to read-only so it automatically displays files attached to the selected curriculum's required course IDs.
- Disabled direct curriculum attachment uploads to prevent duplicate files across curriculums.
- Added local RTDB and Storage rules for the new `files` metadata path and `courseFiles` Storage path.
- Updated the startup loader so it no longer blocks clicks after preview startup finishes.
- Updated the visible app version label to V1.4.0.

## V1.3.6 - 2026-06-04 1:50 PM CT - Compact Overview Dashboard

### Summary
- Tightened the Overview dashboard and added the app title to the top utility bar.

### Fixes
- Added `New Eden Dashboard` with `Archive & Realtime Database` subtext to the top bar.
- Compacted Overview modules into smaller dashboard cards with denser headings and list rows.
- Limited Latest Archive Changes to 5 visible items and added compact pagination.
- Updated light, dark, and responsive styling for the compact dashboard layout.
- Updated the visible app version label to V1.3.6.

## V1.3.5 - 2026-06-04 1:35 PM CT - Overview Dashboard and Staff Dedupe

### Summary
- Rebuilt the Overview tab into a working dashboard and cleaned up duplicated staff names in task assignee lists.

### Fixes
- Deduped the task assignee directory by normalized display name so fixed staff entries and live Firebase profile users do not show twice.
- Replaced the Overview placeholder with recent activity, needs-attention checks, assigned tasks, latest notices, archive health, recent transcript drafts, and monthly summary cards.
- Added responsive and dark-mode styling for the new Overview dashboard panels.
- Updated the visible app version label to V1.3.5.

## V1.3.4 - 2026-06-04 12:36 PM CT - Storage Upload Path Cleanup

### Summary
- Tightened file upload handling so file bytes stay in Cloud Storage and RTDB keeps metadata only.

### Fixes
- Updated profile picture uploads to always convert selected JPG, PNG, or WebP images into `avatar.png`.
- Matched the profile picture Storage path to `profilePictures/{uid}/avatar.png`.
- Updated local Firebase Storage rules with the user-owned profile picture rule and an archive attachment Storage path.
- Confirmed archive attachments continue to upload to Cloud Storage while RTDB stores only attachment metadata.
- Updated the visible app version label to V1.3.4.

## V1.3.3 - 2026-06-04 11:55 AM CT - Profile Preferences Expansion

### Summary
- Expanded Profile Settings and improved transcript draft controls.

### New Features
- Added profile picture upload with top-bar avatar display and initials fallback.
- Added notification preferences for new notices and assigned task updates using the existing themed modal style.
- Added a default landing page preference after login.
- Added a My Assigned Tasks Only preference for the task board.
- Added account info readouts for last login, UID, and role.

### Fixes
- Matched the Saved Drafts Open and Delete buttons to the same compact size.
- Updated the visible app version label to V1.3.3.

## V1.3.2 - 2026-06-04 11:20 AM CT - Transcript PDF Import and Draft Controls

### Summary
- Added transcript PDF importing and draft deletion, then tightened small task board alignment issues.

### New Features
- Added an Import PDF action in Transcripts that reads a generated New Eden transcript PDF and rebuilds editable student fields and course rows.
- Added Delete controls for saved transcript drafts with a themed confirmation modal.
- Logged imported transcript PDFs and deleted transcript drafts to the Activity Log.

### Fixes
- Centered the Task Description field placeholder and height so it lines up with the task title, assignee, and Create Task button.
- Updated the visible app version label to V1.3.2.

## V1.3.1 - 2026-06-03 8:51 PM CT - Transcript Drafts and Overview Cleanup

### Summary
- Restored transcript branding assets, added saved transcript drafts, and simplified the Overview workspace for a future redesign.

### New Features
- Added transcript draft saving and reopening from the Transcripts tab using Realtime Database.
- Logged saved and updated transcript drafts to the Activity Log.
- Added the New Eden logo, seal, and signature images back into the transcript print/PDF layout.

### Fixes
- Cleared the Overview workspace down to a placeholder while keeping the course, program, and curriculum metric bar plus the footer.
- Added Realtime Database rules for the new `transcripts` path.
- Updated the visible app version label to V1.3.1.

## V1.3.0 - 2026-06-03 8:03 PM CT - Transcript Builder Foundation

### Summary
- Added the first usable web transcript builder and polished task/dark-mode issues.

### New Features
- Replaced the transcript placeholder with a transcript workspace that uses Firebase-backed archive courses and curriculums.
- Added student detail inputs, curriculum import, searchable manual course adding, editable percentage rows, calculated grades, GPA, and total credit hours.
- Added Print / Save PDF generation using a web version of the existing Electron transcript layout.
- Added a broader assignee directory that includes saved profiles, connected users, activity log users, task users, notice authors, and core staff names.

### Fixes
- Brightened dark-mode body, panel, table, task, and transcript text to match the Dark Reader reference more closely.
- Fixed Done/Edit/Delete task button alignment and centered button text.
- Kept completed tasks fully readable instead of fading the whole task card.
- Updated the visible app version label to V1.3.0.

## V1.2.2 - 2026-06-03 4:23 PM CT - Dark Reader Theme Match

### Summary
- Reworked dark mode to match the warmer Dark Reader reference styling.

### Fixes
- Changed dark mode to use olive-black page surfaces, near-black table rows, muted cream text, and gold hairline borders.
- Updated dark mode table headers and selected rows so they stay dark instead of switching to a bright header treatment.
- Matched dark mode form fields, search bars, modals, login, guide, loader, status badges, and notice surfaces to the same palette.
- Kept the New Eden green sidebar while making active navigation and highlight states closer to the provided screenshots.
- Updated the visible app version label to V1.2.2.

## V1.2.1 - 2026-06-03 4:13 PM CT - Log and Dark Mode Hotfix

### Summary
- Polished the new log workspace controls and made dark mode readable across the archive.

### Fixes
- Improved Task Board form sizing so the title, assignee, description, and Create Task button line up cleanly.
- Updated task action buttons so Edit no longer sits awkwardly between Reopen/Done and Delete.
- Added saved user profiles to the task assignee list so tasks can be assigned to employees who are not currently online.
- Limited active notices to 3 and added a themed warning modal when that limit is reached.
- Disabled the Add/Edit Course Save button after duplicate course-number validation until the Course ID field changes.
- Rebuilt dark mode contrast for tables, inputs, buttons, panels, badges, and helper text.
- Updated Realtime Database rules so signed-in users can read the profile directory used for offline task assignment.
- Updated the visible app version label to V1.2.1.

## V1.2.0 - 2026-06-03 3:43 PM CT - Log, Notices, Tasks, and Dark Mode

### Summary
- Added operational tracking and communication tools for admins and employees.

### New Features
- Added a Log tab with searchable activity history by user, action, record, and details.
- Added activity logging for course, curriculum, program, requirement, attachment, notice, and task changes.
- Added a realtime notice system where admins can send, edit, and delete one-way announcements.
- Added a task system with task title, description, assignee, status, edit/delete controls, and completion logging.
- Added a per-user dark mode toggle in Profile Settings.

### Fixes
- Added course number duplicate validation for Add Course and Edit Course.
- Added a course ID index path so course numbers use a consistent database key.
- Updated Realtime Database rules for activity logs, notices, tasks, and the course ID index.
- Updated the visible app version label to V1.2.0.

## V1.1.7 - 2026-06-03 2:27 PM CT - Protected Delete Confirmation

### Summary
- Added password-protected confirmation for permanent archive deletes while keeping normal list removals quick.

### New Features
- Added a Firebase password field to destructive confirmation modals for deleting courses, curriculums, and programs.
- Added a Remove Curriculum button to the Curriculums workspace beside Edit Curriculum.

### Fixes
- Updated course delete warning copy to explain that linked curriculum requirements stay in place until removed from their programs.
- Kept requirement-list removals as normal confirmations without password re-entry.
- Updated the visible app version label to V1.1.7.

## V1.1.6 - 2026-06-03 12:57 PM CT - Profile Settings Polish

### Summary
- Polished profile settings and simplified the sidebar mode controls.

### Fixes
- Widened the Profile Settings modal and rebuilt it into a cleaner two-column desktop layout.
- Removed the redundant sidebar Admin/Viewer mode button and replaced it with Profile Settings.
- Kept the top Admin button as the only Admin/Viewer mode toggle.
- Updated the local UI smoke check to use the top Admin mode button.
- Updated the visible app version label to V1.1.6.

## V1.1.5 - 2026-06-03 10:36 AM CT - Profile Settings and Admin Mode Hotfix

### Summary
- Added employee profile settings and made admin mode behave like a mode switch instead of a sign-out trigger.

### New Features
- Added a Profile Settings modal from the user chip with display name, password update, and interface settings.
- Saved display names to each signed-in user's profile so Connected Users can show chosen names instead of email prefixes.
- Added a profile setting to hide the top-bar realtime loaded summary.

### Fixes
- Changed the Admin button so eligible admins can toggle between Admin and Viewer mode without being sent back to login.
- Updated the visible app version label to V1.1.5.
- Updated Realtime Database rules so users can save their own profile settings while presence remains scoped to the signed-in user's UID.
- Updated the local UI smoke check to match the new Admin/Viewer mode toggle.

## V1.1.4 - 2026-06-03 10:21 AM CT - Presence and Curriculum Layout Hotfix

### Summary
- Improved live connected-user display and cleaned up workspace layout issues.

### New Features
- Added Realtime Database presence tracking so the footer can show all connected archive users by name.
- Added a Realtime Database `presence` rule so signed-in employees can publish their own online marker without admin write access.

### Fixes
- Updated the visible app version label to V1.1.4.
- Removed the unused hamburger navigation button from the top utility bar.
- Rebalanced the Curriculum workspace requirement table columns so Course Name has the main readable space and the action button stays visible.
- Improved user display-name fallback so profile names such as `name` or `displayName` can show instead of only email prefixes.

## V1.1.3 - 2026-06-03 9:54 AM CT - Program Table Layout Hotfix

### Summary
- Fixed the Programs workspace curriculum table layout and corrected the recent changelog timestamps to Central time.

### Fixes
- Reduced the wasted blank space in the Programs tab curriculum list so the Requirements and Remove actions stay visible inside the right pane.
- Adjusted the Programs workspace column sizing so the curriculum pane has more practical room on desktop screens.
- Added a dedicated Programs curriculum table class so its columns no longer inherit the generic requirement-table widths.
- Updated the visible app version label to V1.1.3.
- Corrected the V1.1.1 and V1.1.2 changelog times after confirming the local Windows clock was reporting Central time.

## V1.1.2 - 2026-06-03 9:54 AM CT - Startup Auth Flicker Hotfix

### Summary
- Fixed the login gate briefly flashing during page refresh.

### Fixes
- Added an auth-checking startup state so the loader remains the only visible startup surface while Firebase restores the signed-in session.
- Delayed hiding the loader until preview mode, signed-in Firebase state, signed-out Firebase state, or Firebase offline state is actually resolved.

## V1.1.1 - 2026-06-03 9:54 AM CT - Dashboard Status and Pagination Polish

### Summary
- Adapted several Testing Center Dashboard usability patterns into the New Eden Archive theme.

### New Features
- Added a New Eden themed startup loader inspired by the Testing Center loader.
- Added a live sync status badge in the top utility bar.
- Added a footer with connected-user status, app credit, archive label, and version number.
- Added working pagination and row-count controls to the Overview course table and Course Catalog table.

### Fixes
- All native modals can now be dismissed by clicking outside the modal content.
- Tightened the Programs workspace table layout so actions have room and the middle of the table no longer wastes excessive blank space.

## V1.1.0 - 2026-06-03 5:28 AM CT - Guided Workflow Expansion

### Summary
- Added in-app guidance, a transcript placeholder workspace, and a fuller curriculum creation flow.

### New Features
- Connected the top-bar help button to a themed guide modal with visual workflow cards and written directions for Courses, Curriculums, Programs, and Admin access.
- Added a Transcripts tab with placeholder content for the future transcript generator merge.
- Replaced the Add Curriculum shortcut with a full Curriculum Builder modal.
- Added course requirement selection, ordering, removal, and save behavior inside the initial Add Curriculum flow.

### Fixes
- New curriculum creation now starts with blank optional code, version, and description fields using placeholder text instead of prefilled generated values.
- Saved new curriculum requirements together with the curriculum record so setup can happen in one place.
- Added default credit options so the first course can be created even when the archive is empty in local preview.

## V1.0.9 - 2026-06-03 4:58 AM CT - Programs Workspace Redesign

### Summary
- Rebuilt the Programs tab to match the Curriculums workspace layout and clarified the parent-child workflow.

### New Features
- Added a program selector above the Programs workspace.
- Replaced the program card grid with a two-pane layout.
- Added a left Program Overview pane with program details, overview text, notes, and Add Program access.
- Added a right Curriculums pane that lists curriculums attached to the selected program.
- Kept Manage Curriculums as the primary tool for adding/removing curriculums under the selected program.
- Added a separate Program Description field so overview text and notes are no longer mixed together.

### Fixes
- Made Save Program a non-submit action button so it no longer fights dialog form behavior.
- Added explicit Program Name validation for the Save Program button.
- Added save failure feedback when Firebase rejects the program category path, while still updating the local view.
- Kept the program selector stable instead of narrowing it with unrelated global search text.

## V1.0.8 - 2026-06-03 4:43 AM CT - Curriculum Header Wording Hotfix

### Summary
- Updated the Curriculums tab header to better describe the selected curriculum workspace.

### Fixes
- Renamed the header from **Program Course Requirements** to **Curriculum Course Overview**.
- Changed the subtitle to show the selected curriculum name, required-course count, and total credits.
- Made the subtitle count use the full selected curriculum, not the currently filtered table rows.

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
