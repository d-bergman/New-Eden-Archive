import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { cert, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getDatabase as getAdminDatabase } from "firebase-admin/database";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

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
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
const dryRun = process.env.DRY_RUN === "true";
const overwrite = process.env.OVERWRITE === "true";

function printUsageAndExit() {
  console.error("Missing migration credentials.");
  console.error("");
  console.error("Preferred PowerShell service account example:");
  console.error('$env:SERVICE_ACCOUNT_PATH="C:\\path\\to\\new-eden-service-account.json"');
  console.error("npm run migrate:firestore");
  console.error("");
  console.error("Email/password fallback example:");
  console.error('$env:FIREBASE_EMAIL="you@example.com"');
  console.error('$env:FIREBASE_PASSWORD="your-password"');
  console.error("npm run migrate:firestore");
  process.exit(1);
}

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

function rowsFromSnapshot(snapshot) {
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

function createClientMigrator() {
  if (!email || !password) printUsageAndExit();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const database = getDatabase(app);

  return {
    async signIn() {
      console.log("Signing in with Firebase Email/Password...");
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const uid = credential.user.uid;
      console.log(`Signed in as ${credential.user.email} (${uid})`);

      const adminSnap = await get(ref(database, `admins/${uid}`));
      if (!adminSnap.exists()) {
        throw new Error(`Realtime Database admin record missing. Create admins/${uid} before running the migration.`);
      }
      console.log("Realtime Database admin record found.");
    },
    async readCollection(name) {
      return rowsFromSnapshot(await getDocs(collection(firestore, name)));
    },
    async replacePath(path, value) {
      await set(ref(database, path), value);
    },
    async mergePayload(payload) {
      await update(ref(database), payload);
    },
  };
}

function createAdminMigrator() {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  const app = initializeAdminApp({
    credential: cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
  });
  const firestore = getAdminFirestore(app);
  const database = getAdminDatabase(app);

  return {
    async signIn() {
      console.log(`Using service account: ${serviceAccount.client_email}`);
    },
    async readCollection(name) {
      return rowsFromSnapshot(await firestore.collection(name).get());
    },
    async replacePath(path, value) {
      await database.ref(path).set(value);
    },
    async mergePayload(payload) {
      await database.ref().update(payload);
    },
  };
}

async function migrate() {
  const migrator = serviceAccountPath ? createAdminMigrator() : createClientMigrator();
  await migrator.signIn();

  const payload = {};
  for (const name of collections) {
    payload[name] = await migrator.readCollection(name);
    console.log(`${name}: ${Object.keys(payload[name]).length} record(s) read from Firestore`);
  }

  if (dryRun) {
    console.log("DRY_RUN=true, no Realtime Database writes were made.");
    return;
  }

  if (overwrite) {
    for (const [path, value] of Object.entries(payload)) {
      await migrator.replacePath(path, value);
      console.log(`${path}: replaced in Realtime Database`);
    }
  } else {
    await migrator.mergePayload(payload);
    console.log("Realtime Database paths merged. Existing extra records were not deleted.");
  }
}

migrate().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
