# New Eden Archive

Editable web app prototype for the New Eden School course and curriculum archive.

See [docs/FEATURE_PLAN.md](docs/FEATURE_PLAN.md) for the working feature roadmap.

## Current Status

- Uses `New Eden Archive v1.0.xlsx` as the source data.
- Runs as a static web app with no install step.
- Includes local prototype editing behind a preview admin password.
- Includes Firebase Hosting and Firestore rules placeholders for the real auth/database setup.

## Open Locally

Open `index.html` in a browser, or serve the folder with:

```powershell
npm run start
```

Then visit `http://localhost:5173`.

## UI Check

With the local server running:

```powershell
npm run check:ui
```

This writes `app-preview-desktop.png` and `app-preview-mobile.png`.

## Prototype Admin

The current prototype password is:

```text
neweden
```

This is only for local preview. The production version should use Firebase Auth and the included `firestore.rules` pattern.

## Data Source

Generated from:

```text
C:\Users\Darren\Documents\Life\Career\New Eden\Course Number Project\Updated\New Eden Archive v1.0.xlsx
```

Generated data lives in `new-eden-data.generated.js`.

## Firebase Plan

Suggested collections:

- `courses`
- `curriculumRows`
- `programs`
- `sections`
- `versionHistory`
- `admins`

The included Firestore rules allow public reads and admin-only writes, where admins are represented by documents in `admins/{uid}`.

## Firebase Admin Setup

1. In Firebase Console, enable **Authentication → Email/Password**.
2. Create your admin user under **Authentication → Users**.
3. Copy that user's UID.
4. In Firestore, create `admins/{uid}` using that exact UID as the document ID.
5. Add fields such as:

```json
{
  "role": "owner",
  "name": "Darren"
}
```

After that, sign in through the app. Use **Seed Firebase** once to upload the workbook-derived course, curriculum, and version-history data.
