# New Eden Archive

Editable web app for the New Eden School course and curriculum archive.

See [docs/FEATURE_PLAN.md](docs/FEATURE_PLAN.md) for the working feature roadmap.

## Current Status

- Uses Firebase Auth, Realtime Database, and Storage as the live data system.
- Keeps the main app in `index.html`, `app.js`, and `main.css`.
- Runs as a static web app with no build step.
- Includes a local empty preview mode behind a preview admin password.
- Uses Realtime Database `admins/{uid}` records for admin write access.

## Open Locally

Serve the folder with:

```powershell
npm run start
```

Then visit `http://localhost:5173`.

For empty local UI preview without Firebase, visit:

```text
http://localhost:5173/?nofirebase=1
```

## UI Check

With the local server running:

```powershell
npm run check:ui
```

This writes `app-preview-desktop.png` and `app-preview-mobile.png`.

## Local Preview Admin

The local preview password is:

```text
neweden
```

This only works with `?nofirebase=1`. Production uses Firebase Auth and Realtime Database admin records.

## Data Source

Realtime Database is the source of truth. The original Excel workbook was used only for the first import and is no longer loaded by the app. New edits are saved to Firebase.

## Realtime Database Paths

- `courses`
- `curriculumRows`
- `programs`
- `versionHistory`
- `attachments`
- `admins`
- `users`

The included Realtime Database rules require sign-in for reads and admin-only writes, where admins are represented by records in `admins/{uid}`.

## Firebase Admin Setup

1. In Firebase Console, enable **Authentication -> Email/Password**.
2. Create your admin user under **Authentication -> Users**.
3. Copy that user's UID.
4. In Realtime Database, create `admins/{uid}` using that exact UID as the key.
5. Add fields such as:

```json
{
  "role": "owner",
  "name": "Darren"
}
```

6. Optionally create `users/{uid}` with display information:

```json
{
  "displayName": "Darren Bergman",
  "username": "bergmand",
  "role": "admin"
}
```

After that, sign in through the app. Admin edits write directly to Realtime Database.

## Attachments

Program attachments use:

- Firebase Storage for the file bytes
- Realtime Database `attachments` records for metadata and download URLs

Signed-in users can download attachments. Signed-in users can upload through Storage under the current `storage.rules`; the app UI still only exposes upload/remove controls to admins.
