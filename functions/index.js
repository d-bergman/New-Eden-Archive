const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

exports.sendStudentFilesEmail = onCall({ region: "us-central1" }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Sign in before sending files.");
  }

  const adminSnap = await admin.database().ref(`admins/${uid}`).get();
  if (!adminSnap.exists()) {
    throw new HttpsError("permission-denied", "Only admins can send course files.");
  }

  const data = request.data || {};
  const recipientEmail = String(data.recipientEmail || "").trim();
  const selectedFileIds = Array.isArray(data.selectedFileIds) ? data.selectedFileIds.map(String).filter(Boolean) : [];
  const subject = String(data.subject || "Requested New Eden Course Materials").trim();
  const bodyMarkdown = String(data.bodyMarkdown || "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    throw new HttpsError("invalid-argument", "Enter a valid student email address.");
  }
  if (!selectedFileIds.length) {
    throw new HttpsError("invalid-argument", "Select at least one file.");
  }
  if (!subject || !bodyMarkdown) {
    throw new HttpsError("invalid-argument", "Subject and email body are required.");
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const mailFrom = process.env.MAIL_FROM || smtpUser;
  if (!smtpHost || !smtpUser || !smtpPass || !mailFrom) {
    await writeEmailLog(uid, "Failed File Email", recipientEmail, selectedFileIds, "SMTP environment variables are not configured.");
    throw new HttpsError("failed-precondition", "Email backend is not configured yet. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and MAIL_FROM.");
  }

  const files = await loadFiles(selectedFileIds);
  if (!files.length) {
    throw new HttpsError("not-found", "The selected files were not found in File Manager.");
  }

  try {
    const attachments = await storageAttachments(files);
    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transport.sendMail({
      from: mailFrom,
      to: recipientEmail,
      subject,
      text: markdownToText(bodyMarkdown),
      html: markdownToHtml(bodyMarkdown),
      attachments,
    });

    await writeEmailLog(uid, "Sent File Email", recipientEmail, files.map((file) => file._docId), files.map((file) => file.name).join(", "));
    return {
      ok: true,
      message: `Email sent to ${recipientEmail} with ${files.length} file(s).`,
      fileCount: files.length,
    };
  } catch (error) {
    await writeEmailLog(uid, "Failed File Email", recipientEmail, files.map((file) => file._docId), error.message || "Unknown email error");
    throw new HttpsError("internal", `Email failed: ${error.message || "Unknown error"}`);
  }
});

async function loadFiles(fileIds) {
  const snapshots = await Promise.all(fileIds.map((id) => admin.database().ref(`files/${id}`).get()));
  return snapshots
    .map((snapshot, index) => snapshot.exists() ? { _docId: fileIds[index], ...snapshot.val() } : null)
    .filter((file) => file && file.name && file.storagePath);
}

async function storageAttachments(files) {
  const bucket = admin.storage().bucket();
  return Promise.all(files.map(async (file) => {
    const [content] = await bucket.file(file.storagePath).download();
    return {
      filename: file.name,
      content,
      contentType: file.contentType || "application/octet-stream",
    };
  }));
}

async function writeEmailLog(uid, action, recipientEmail, fileIds, details) {
  const userSnap = await admin.database().ref(`users/${uid}`).get();
  const user = userSnap.exists() ? userSnap.val() : {};
  await admin.database().ref("activityLog").push({
    action,
    entityType: "Student Email",
    entityName: recipientEmail,
    details: `${details || ""} Files: ${(fileIds || []).join(", ")}`.trim(),
    userUid: uid,
    userName: user.displayName || user.name || user.email || "Admin",
    userEmail: user.email || "",
    createdAt: admin.database.ServerValue.TIMESTAMP,
  });
}

function markdownToHtml(markdown) {
  const paragraphs = String(markdown)
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => `<p>${inlineMarkdown(escapeHtml(block).replace(/\n/g, "<br />"))}</p>`);
  return `<!doctype html><html><body>${paragraphs.join("\n")}</body></html>`;
}

function markdownToText(markdown) {
  return String(markdown)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)");
}

function inlineMarkdown(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}
