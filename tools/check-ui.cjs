const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("http://127.0.0.1:5173/?nofirebase=1", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.screenshot({ path: "app-preview-desktop.png", fullPage: true });

  const courseCount = await page.locator("#courseCount").textContent();
  const programCount = await page.locator("#programCount").textContent();
  const overviewEmptyState = await page.locator("#overviewCourses .empty-state").textContent();

  await page.click("#adminToggle");
  await page.fill("#adminPassword", "neweden");
  await page.click("#confirmAdmin");
  const adminState = await page.locator("#adminState").textContent();

  await page.click('button[data-view="courses"]');
  const coursesEmptyState = await page.locator("#courseRows .empty-state").textContent();

  await page.click('button[data-view="programs"]');
  const programsEmptyState = await page.locator("#programDirectory .empty-state").textContent();

  await page.click('button[data-view="history"]');
  const healthStats = await page.locator(".health-stat").count();
  const healthIssues = await page.locator(".health-issue").count();

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("http://127.0.0.1:5173/?nofirebase=1", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.screenshot({ path: "app-preview-mobile.png", fullPage: true });

  await browser.close();

  const result = {
    courseCount,
    programCount,
    overviewEmptyState,
    adminState,
    coursesEmptyState,
    programsEmptyState,
    healthStats,
    healthIssues,
    errors,
  };

  console.log(JSON.stringify(result, null, 2));

  if (errors.length) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
