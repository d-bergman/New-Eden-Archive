import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { get, getDatabase, ref, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCKgoV1cUmlvgDxb3CL9UNNiHhhwMk7bYs",
  authDomain: "new-eden-archive.firebaseapp.com",
  databaseURL: "https://new-eden-archive-default-rtdb.firebaseio.com",
  projectId: "new-eden-archive",
  storageBucket: "new-eden-archive.firebasestorage.app",
  messagingSenderId: "717052013385",
  appId: "1:717052013385:web:eb7fa648642d3701624898",
};

const collections = [
  "courses",
  "programs",
  "curriculumRows",
  "versionHistory",
  "attachments",
];

const email = process.env.FIREBASE_EMAIL;
const password = process.env.FIREBASE_PASSWORD;
const dryRun = process.env.DRY_RUN === "true";
const overwrite = process.env.OVERWRITE === "true";

if (!email || !password) {
  console.error("Missing FIREBASE_EMAIL or FIREBASE_PASSWORD.");
  console.error("PowerShell example:");
  console.error('$env:FIREBASE_EMAIL="you@example.com"');
  console.error('$env:FIREBASE_PASSWORD="your-password"');
  console.error("npm run migrate:firestore");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

function cleanForDatabase(value) {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value !== "object") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(cleanForDatabase);

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, cleanForDatabase(item)]),
  );
}

async function readCollection(name) {
  const snapshot = await getDocs(collection(firestore, name));
  const rows = {};

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    rows[docSnap.id] = cleanForDatabase({
      ...data,
      _docId: data._docId || docSnap.id,
    });
  });

  return rows;
}

async function assertRealtimeAdmin(uid) {
  const adminSnap = await get(ref(database, `admins/${uid}`));
  if (!adminSnap.exists()) {
    throw new Error(`Realtime Database admin record missing. Create admins/${uid} before running the migration.`);
  }
}

async function migrate() {
  console.log("Signing in...");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  console.log(`Signed in as ${credential.user.email} (${uid})`);

  await assertRealtimeAdmin(uid);
  console.log("Realtime Database admin record found.");

  const payload = {};
  for (const name of collections) {
    payload[name] = await readCollection(name);
    console.log(`${name}: ${Object.keys(payload[name]).length} record(s) read from Firestore`);
  }

  if (dryRun) {
    console.log("DRY_RUN=true, no Realtime Database writes were made.");
    return;
  }

  if (overwrite) {
    for (const [path, value] of Object.entries(payload)) {
      await set(ref(database, path), value);
      console.log(`${path}: replaced in Realtime Database`);
    }
  } else {
    await update(ref(database), payload);
    console.log("Realtime Database paths merged. Existing extra records were not deleted.");
  }
}

migrate().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
