# New Eden Archive Feature Plan

This document captures the working feature plan for the New Eden Archive web app.

## Core Goal

Create a password-protected internal archive for New Eden School course, curriculum, program, notes, attachments, and future transcript workflows. Firestore is the editable source of truth; the Excel workbook was only used for the initial import.

## User Roles

### Admin Users

Admins can:

- Add, edit, and remove courses.
- Add, edit, and remove programs/curriculums.
- Add and remove course requirements inside a program.
- Add notes.
- Upload, organize, download, and remove attachments.
- Manage archive data.

### Standard Users

Standard users can:

- Sign in.
- View/search courses.
- View/search programs and curriculum requirements.
- View notes and attachments.
- Download allowed documents.

Standard users cannot:

- Edit archive records.
- Delete data.
- Upload or remove attachments.
- Manage users or roles.

## Initial Users

The initial employee accounts are expected to include:

- Darren
- Darren's wife
- Larry
- Donna
- Dr. Duda
- One additional employee

Firebase Auth requires email/password accounts by default. The app can still display short usernames such as `bergmand` or similar through a user profile document.

## Data Areas

### Courses

Courses can exist independently of any curriculum/program.

Course fields should include:

- Course ID
- Credit
- Course name
- Comment/description
- Status
- Notes
- Attachments
- Created/updated metadata

### Programs / Curriculums

Programs can be created, edited, and removed.

Program fields should include:

- Section/department
- Program name
- Program code
- Status
- Version
- Description
- Notes
- Attachments
- Created/updated metadata

### Program Requirements

Each program can have a list of required courses.

Requirement fields should include:

- Program reference
- Course reference
- Order
- Requirement type
- Credit
- Notes

### Attachments

The archive should support file uploads and downloads for documents such as:

- PDFs
- E-books
- Guides
- Course documents
- Program documents
- Other administrative files

Recommended Firebase services:

- Firebase Storage for files
- Firestore metadata records for attachment names, types, owners, linked course/program, and download URLs

### Notes

Notes should be attachable to:

- Courses
- Programs
- Requirements
- Attachments

Notes should include author and timestamp metadata.

## Real-Time Sync

The app should use Firestore real-time listeners so changes appear live for signed-in users without requiring refresh.

Expected live areas:

- Courses
- Programs
- Requirements
- Notes
- Attachment metadata

## Future Feature: Transcript Generator

The archive should eventually include a transcript generator ported from the existing Electron/executable tool.

Future planning questions:

- What inputs does the current generator use?
- What templates does it output?
- Does it generate PDF, Word, or another format?
- Does it need student records stored in Firebase?
- Who can generate transcripts?
- Should generated transcripts be archived as attachments?

## Recommended Build Order

1. Authentication and role-gated access.
2. Firestore data model cleanup for courses, programs, requirements, users, notes, and attachments.
3. Real-time sync for courses/programs/requirements.
4. Full admin CRUD for courses.
5. Full admin CRUD for programs/curriculums.
6. Requirement builder for adding/removing/reordering courses in a program.
7. Firebase Storage attachment uploads/downloads.
8. Notes system.
9. User management screen for admins.
10. Transcript generator port.
