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

  await page.fill("#globalSearch", "Herbal");
  const filteredOverviewRows = await page.locator("#overviewCourses tr").count();
  await page.fill("#globalSearch", "");

  await page.click('button[data-view="courses"]');
  const courseRows = await page.locator("#courseRows tr").count();

  await page.click("#adminToggle");
  await page.fill("#adminPassword", "neweden");
  await page.click("#confirmAdmin");
  const adminState = await page.locator("#adminState").textContent();

  await page.click('button[data-view="curriculums"]');
  const curriculumRows = await page.locator("#curriculumRows tr").count();

  await page.click('button[data-view="programs"]');
  const programSections = await page.locator(".directory-section").count();

  await page.click('button[data-view="overview"]');
  const requirementCountBefore = Number(await page.locator("#requiredCount").textContent());
  await page.click("#addProgramCourse");
  await page.fill("#requirementCourseSearch", "Apocalyptic");
  await page.locator("[data-add-requirement]").first().click();
  const builderSelectedCount = Number(await page.locator("#requirementSelectedCount").textContent());
  const addedCourseId = "1001";
  const orderBeforeMove = await page.locator(`[data-remove-requirement="${addedCourseId}"]`).locator("xpath=ancestor::div[contains(@class,'selected-requirement-row')]").locator(".requirement-order").textContent();
  await page.locator(`[data-move-requirement="${addedCourseId}"][data-direction="up"]`).click();
  const orderAfterMove = await page.locator(`[data-remove-requirement="${addedCourseId}"]`).locator("xpath=ancestor::div[contains(@class,'selected-requirement-row')]").locator(".requirement-order").textContent();
  await page.click("#saveRequirements");
  const requirementCountAfter = Number(await page.locator("#requiredCount").textContent());
  await page.click('[data-program-tab="attachments"]');
  const attachmentEmptyState = await page.locator("#attachmentList .empty-state").textContent();

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
    courseRows,
    filteredOverviewRows,
    adminState,
    curriculumRows,
    programSections,
    requirementCountBefore,
    builderSelectedCount,
    requirementCountAfter,
    orderBeforeMove,
    orderAfterMove,
    attachmentEmptyState,
    errors,
  };

  console.log(JSON.stringify(result, null, 2));

  if (
    errors.length
    || requirementCountAfter <= requirementCountBefore
    || builderSelectedCount <= requirementCountBefore
    || Number(orderAfterMove) >= Number(orderBeforeMove)
  ) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
