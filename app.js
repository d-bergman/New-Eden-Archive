(function () {
  const source = window.NEW_EDEN_DATA || {};
  const snapshotKey = "new-eden-archive-local-snapshot";
  const adminKey = "new-eden-admin-preview";
  const saved = readSnapshot();

  const state = {
    courses: saved?.courses || structuredClone(source.courses || []),
    curriculum: saved?.curriculum || structuredClone(source.curriculum || []),
    versionHistory: saved?.versionHistory || structuredClone(source.versionHistory || []),
    search: "",
    view: "overview",
    selectedCredit: "all",
    selectedSection: "all",
    selectedProgram: "",
    admin: sessionStorage.getItem(adminKey) === "true",
  };

  const els = {
    body: document.body,
    navItems: document.querySelectorAll("[data-view]"),
    views: document.querySelectorAll(".view"),
    globalSearch: document.querySelector("#globalSearch"),
    adminState: document.querySelector("#adminState"),
    adminToggle: document.querySelector("#adminToggle"),
    adminDialog: document.querySelector("#adminDialog"),
    adminPassword: document.querySelector("#adminPassword"),
    confirmAdmin: document.querySelector("#confirmAdmin"),
    saveSnapshot: document.querySelector("#saveSnapshot"),
    overviewCreditFilter: document.querySelector("#overviewCreditFilter"),
    overviewCourses: document.querySelector("#overviewCourses"),
    overviewCourseTotal: document.querySelector("#overviewCourseTotal"),
    featuredProgram: document.querySelector("#featuredProgram"),
    featuredProgramDetail: document.querySelector("#featuredProgramDetail"),
    courseCreditFilter: document.querySelector("#courseCreditFilter"),
    courseRows: document.querySelector("#courseRows"),
    addCourse: document.querySelector("#addCourse"),
    sectionFilter: document.querySelector("#sectionFilter"),
    programFilter: document.querySelector("#programFilter"),
    programSummary: document.querySelector("#programSummary"),
    curriculumRows: document.querySelector("#curriculumRows"),
    addProgramCourse: document.querySelector("#addProgramCourse"),
    programTitle: document.querySelector("#programTitle"),
    programCode: document.querySelector("#programCode"),
    requiredCount: document.querySelector("#requiredCount"),
    programDirectory: document.querySelector("#programDirectory"),
    versionTimeline: document.querySelector("#versionTimeline"),
    editDialog: document.querySelector("#editDialog"),
    editForm: document.querySelector("#editForm"),
    editTitle: document.querySelector("#editTitle"),
    editFields: document.querySelector("#editFields"),
  };

  init();

  function init() {
    hydrateSelectors();
    bindEvents();
    if (!state.selectedProgram) {
      state.selectedProgram = programs().find((program) => program.section === "Traditional Naturopathy")?.name || programs()[0]?.name || "";
    }
    render();
  }

  function bindEvents() {
    els.navItems.forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view;
        render();
      });
    });

    els.globalSearch.addEventListener("input", (event) => {
      state.search = event.target.value.trim().toLowerCase();
      render();
    });

    els.overviewCreditFilter.addEventListener("change", (event) => {
      state.selectedCredit = event.target.value;
      els.courseCreditFilter.value = event.target.value;
      render();
    });

    els.courseCreditFilter.addEventListener("change", (event) => {
      state.selectedCredit = event.target.value;
      els.overviewCreditFilter.value = event.target.value;
      render();
    });

    els.sectionFilter.addEventListener("change", (event) => {
      state.selectedSection = event.target.value;
      const nextProgram = filteredPrograms()[0]?.name || "";
      state.selectedProgram = nextProgram;
      render();
    });

    els.programFilter.addEventListener("change", (event) => {
      state.selectedProgram = event.target.value;
      render();
    });

    els.featuredProgram.addEventListener("change", (event) => {
      state.selectedProgram = event.target.value;
      state.view = "curriculums";
      render();
    });

    const toggleAdmin = () => {
      if (state.admin) {
        state.admin = false;
        sessionStorage.removeItem(adminKey);
        render();
        return;
      }
      els.adminPassword.value = "";
      els.adminDialog.showModal();
      setTimeout(() => els.adminPassword.focus(), 0);
    };

    els.adminToggle.addEventListener("click", toggleAdmin);
    document.querySelector("#adminStatusButton")?.addEventListener("click", toggleAdmin);

    els.confirmAdmin.addEventListener("click", (event) => {
      event.preventDefault();
      if (els.adminPassword.value === "neweden") {
        state.admin = true;
        sessionStorage.setItem(adminKey, "true");
        els.adminDialog.close();
        render();
      } else {
        els.adminPassword.setCustomValidity("Incorrect preview password.");
        els.adminPassword.reportValidity();
        els.adminPassword.setCustomValidity("");
      }
    });

    els.saveSnapshot.addEventListener("click", () => {
      localStorage.setItem(snapshotKey, JSON.stringify({
        courses: state.courses,
        curriculum: state.curriculum,
        versionHistory: state.versionHistory,
      }));
      els.saveSnapshot.textContent = "Saved";
      setTimeout(() => { els.saveSnapshot.textContent = "Save Local Snapshot"; }, 1200);
    });

    els.addCourse.addEventListener("click", () => openCourseEditor());
    els.addProgramCourse.addEventListener("click", () => openCurriculumEditor());
  }

  function render() {
    hydrateSelectors();
    renderChrome();
    renderStats();
    renderOverview();
    renderCourses();
    renderCurriculum();
    renderPrograms();
    renderHistory();
  }

  function renderChrome() {
    els.body.classList.toggle("is-admin", state.admin);
    els.adminState.textContent = state.admin ? "Admin Unlocked" : "Admin Locked";
    els.adminToggle.querySelector("span").textContent = state.admin ? "Lock Admin" : "Admin";
    document.querySelector("#adminStatusButton i").className = state.admin ? "bi bi-unlock" : "bi bi-lock";

    els.navItems.forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
    els.views.forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
  }

  function renderStats() {
    document.querySelector("#courseCount").textContent = state.courses.length;
    document.querySelector("#programCount").textContent = programs().length;
    document.querySelector("#curriculumCount").textContent = state.curriculum.length;
    document.querySelector("#sectionCount").textContent = sections().length;
  }

  function renderOverview() {
    const allRows = filteredCourses();
    const rows = allRows.slice(0, 10);
    els.overviewCourseTotal.textContent = `Showing 1 to ${Math.min(rows.length, allRows.length)} of ${allRows.length} courses`;
    els.overviewCourses.innerHTML = rows.map((course, index) => `
      <tr class="${index === 0 ? "is-selected" : ""}">
        <td><input class="form-check-input" type="checkbox" ${index === 0 ? "checked" : ""} aria-label="Select ${escapeAttr(course.name)}" /></td>
        <td>${escapeHtml(course.id)}</td>
        <td>${escapeHtml(course.credit)}</td>
        <td>${highlight(course.name)}</td>
        <td>${escapeHtml(course.comment || "Course archive record.")}</td>
        <td><span class="status-badge">Active</span></td>
        <td class="text-end"><button class="table-action" type="button" aria-label="Course actions"><i class="bi bi-three-dots"></i></button></td>
      </tr>
    `).join("") || emptyRow(7, "No courses match the current filters.");

    const selected = state.selectedProgram || programs()[0]?.name || "";
    els.featuredProgram.value = selected;
    const rowsForProgram = curriculumForProgram(selected);
    const totalCredits = rowsForProgram.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    const section = rowsForProgram[0]?.section || "Program";
    els.programTitle.textContent = programShortName(selected);
    els.programCode.textContent = programCode(selected, section);
    els.requiredCount.textContent = rowsForProgram.length;
    els.featuredProgramDetail.innerHTML = `
      <p class="mb-3"><strong>Description</strong><br />
        A comprehensive program in ${escapeHtml(section.toLowerCase())} principles and practices,
        with course requirements maintained from the New Eden archive workbook.
      </p>
      <p class="mb-3"><strong>Department</strong><br />${escapeHtml(section)}</p>
      <dl>
        <div><dt>Total Credits</dt><dd>${totalCredits}</dd></div>
        <div><dt>Total Required Courses</dt><dd>${rowsForProgram.length}</dd></div>
        <div><dt>Last Updated</dt><dd>Imported from v1.0 workbook</dd></div>
      </dl>
    `;
  }

  function renderCourses() {
    const rows = filteredCourses();
    els.courseRows.innerHTML = rows.map((course, index) => {
      const realIndex = state.courses.indexOf(course);
      return `
        <tr>
          <td>${escapeHtml(course.id)}</td>
          <td>${escapeHtml(course.credit)}</td>
          <td>${highlight(course.name)}</td>
          <td>${escapeHtml(course.comment || "")}</td>
          <td class="admin-col text-end">
            <button class="btn btn-sm btn-outline-eden" data-edit-course="${realIndex}">Edit</button>
          </td>
        </tr>
      `;
    }).join("") || emptyRow(5, "No courses match the current filters.");

    els.courseRows.querySelectorAll("[data-edit-course]").forEach((button) => {
      button.addEventListener("click", () => openCourseEditor(Number(button.dataset.editCourse)));
    });
  }

  function renderCurriculum() {
    const currentPrograms = filteredPrograms();
    if (!currentPrograms.some((program) => program.name === state.selectedProgram)) {
      state.selectedProgram = currentPrograms[0]?.name || "";
    }
    els.programFilter.value = state.selectedProgram;

    const rows = curriculumForProgram(state.selectedProgram).filter(matchesSearch);
    const totalCredits = rows.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    els.programSummary.innerHTML = `
      <p class="eyebrow">${escapeHtml(rows[0]?.section || "Curriculum")}</p>
      <h3>${escapeHtml(state.selectedProgram || "No program selected")}</h3>
      <div class="row g-3 mt-1">
        <div class="col-sm-4"><strong>${rows.length}</strong><span>Required Courses</span></div>
        <div class="col-sm-4"><strong>${totalCredits}</strong><span>Total Credits</span></div>
        <div class="col-sm-4"><strong>${state.admin ? "Editing enabled" : "Read-only"}</strong><span>Admin Status</span></div>
      </div>
    `;

    els.curriculumRows.innerHTML = rows.slice(0, 5).map((row, index) => {
      const realIndex = state.curriculum.indexOf(row);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(row.courseId)}</td>
          <td>${highlight(stripCredit(row.courseLabel))}</td>
          <td>${escapeHtml(row.credit)}</td>
          <td>Required</td>
          <td class="text-end">
            <button class="table-action" data-edit-curriculum="${realIndex}" type="button" aria-label="Edit requirement"><i class="bi bi-three-dots"></i></button>
            <button class="button danger admin-only" data-remove-curriculum="${realIndex}" type="button">Remove</button>
          </td>
        </tr>
      `;
    }).join("") || emptyRow(6, "No curriculum rows match the current filters.");

    els.curriculumRows.querySelectorAll("[data-edit-curriculum]").forEach((button) => {
      button.addEventListener("click", () => openCurriculumEditor(Number(button.dataset.editCurriculum)));
    });

    els.curriculumRows.querySelectorAll("[data-remove-curriculum]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!state.admin) return;
        state.curriculum.splice(Number(button.dataset.removeCurriculum), 1);
        render();
      });
    });
  }

  function renderPrograms() {
    const grouped = sections().map((section) => ({
      section,
      programs: programs().filter((program) => program.section === section && matchesSearch(program)),
    })).filter((group) => group.programs.length);

    els.programDirectory.innerHTML = grouped.map((group) => `
      <article class="directory-section">
        <h4>${escapeHtml(group.section)}</h4>
        ${group.programs.map((program) => `
          <button class="program-link" data-program="${escapeAttr(program.name)}">
            ${highlight(program.name)}
          </button>
        `).join("")}
      </article>
    `).join("") || `<div class="empty-state">No programs match the current search.</div>`;

    els.programDirectory.querySelectorAll("[data-program]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedProgram = button.dataset.program;
        state.selectedSection = "all";
        state.view = "curriculums";
        render();
      });
    });
  }

  function renderHistory() {
    els.versionTimeline.innerHTML = state.versionHistory.map((item) => `
      <article class="timeline-item">
        <time>${escapeHtml(item.date)}</time>
        <div>
          <h4>${escapeHtml(item.version)} - ${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.comment)}</p>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No version history found.</div>`;
  }

  function hydrateSelectors() {
    const creditOptions = [`<option value="all">All Credits</option>`]
      .concat(credits().map((credit) => `<option value="${escapeAttr(credit)}">Credit ${escapeHtml(credit)}</option>`))
      .join("");
    els.overviewCreditFilter.innerHTML = creditOptions;
    els.courseCreditFilter.innerHTML = creditOptions;
    els.overviewCreditFilter.value = state.selectedCredit;
    els.courseCreditFilter.value = state.selectedCredit;

    els.sectionFilter.innerHTML = [`<option value="all">All Sections</option>`]
      .concat(sections().map((section) => `<option value="${escapeAttr(section)}">${escapeHtml(section)}</option>`))
      .join("");
    els.sectionFilter.value = state.selectedSection;

    const programOptions = filteredPrograms().map((program) => `<option value="${escapeAttr(program.name)}">${escapeHtml(program.name)}</option>`).join("");
    els.programFilter.innerHTML = programOptions;
    els.featuredProgram.innerHTML = programs().map((program) => `<option value="${escapeAttr(program.name)}">${escapeHtml(program.name)}</option>`).join("");
  }

  function openCourseEditor(index) {
    if (!state.admin) return;
    const course = index == null ? { id: "", credit: credits()[0] || "1", name: "", comment: "" } : state.courses[index];
    openEditor(index == null ? "Add Course" : "Edit Course", [
      field("id", "Course ID", course.id),
      field("credit", "Credit", course.credit, "select", credits()),
      field("name", "Course Name", course.name),
      field("comment", "Comment", course.comment, "textarea"),
    ], (values) => {
      if (index == null) state.courses.push(values);
      else state.courses[index] = values;
      render();
    });
  }

  function openCurriculumEditor(index) {
    if (!state.admin) return;
    const firstCourse = state.courses[0] || {};
    const row = index == null
      ? { section: sections()[0] || "", program: state.selectedProgram, courseLabel: courseLabel(firstCourse), courseId: firstCourse.id || "", credit: firstCourse.credit || "", comment: "" }
      : state.curriculum[index];

    openEditor(index == null ? "Add Program Course" : "Edit Program Course", [
      field("section", "Section", row.section, "select", sections()),
      field("program", "Program", row.program),
      field("courseId", "Course ID", row.courseId),
      field("credit", "Credit", row.credit, "select", credits()),
      field("courseLabel", "Course", row.courseLabel, "select", state.courses.map(courseLabel)),
      field("comment", "Comment", row.comment, "textarea"),
    ], (values) => {
      const matchingCourse = state.courses.find((course) => courseLabel(course) === values.courseLabel || course.id === values.courseId);
      if (matchingCourse) {
        values.courseId = matchingCourse.id;
        values.credit = matchingCourse.credit;
        values.courseLabel = courseLabel(matchingCourse);
      }
      if (index == null) state.curriculum.push(values);
      else state.curriculum[index] = values;
      state.selectedProgram = values.program;
      render();
    });
  }

  function openEditor(title, fields, onSave) {
    els.editTitle.textContent = title;
    els.editFields.innerHTML = fields.map((item) => {
      if (item.type === "select") {
        return `
          <label>${escapeHtml(item.label)}
            <select name="${escapeAttr(item.name)}">
              ${item.options.map((option) => `<option value="${escapeAttr(option)}" ${option === item.value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        `;
      }
      if (item.type === "textarea") {
        return `<label>${escapeHtml(item.label)}<textarea name="${escapeAttr(item.name)}" rows="3">${escapeHtml(item.value || "")}</textarea></label>`;
      }
      return `<label>${escapeHtml(item.label)}<input name="${escapeAttr(item.name)}" value="${escapeAttr(item.value || "")}" /></label>`;
    }).join("");
    els.editDialog.showModal();

    els.editForm.onsubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(els.editForm);
      onSave(Object.fromEntries(formData.entries()));
      els.editDialog.close();
    };
  }

  function field(name, label, value, type = "text", options = []) {
    return { name, label, value, type, options };
  }

  function filteredCourses() {
    return state.courses
      .filter((course) => state.selectedCredit === "all" || course.credit === state.selectedCredit)
      .filter(matchesSearch)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function filteredPrograms() {
    return programs().filter((program) => state.selectedSection === "all" || program.section === state.selectedSection);
  }

  function curriculumForProgram(programName) {
    return state.curriculum.filter((row) => row.program === programName);
  }

  function credits() {
    return Array.from(new Set(state.courses.map((course) => course.credit).filter(Boolean)))
      .sort((a, b) => Number(a) - Number(b));
  }

  function sections() {
    return Array.from(new Set(state.curriculum.map((row) => row.section).filter(Boolean))).sort();
  }

  function programs() {
    const seen = new Set();
    return state.curriculum.reduce((list, row) => {
      if (row.program && !seen.has(row.program)) {
        seen.add(row.program);
        list.push({ name: row.program, section: row.section });
      }
      return list;
    }, []).sort((a, b) => a.name.localeCompare(b.name));
  }

  function courseLabel(course) {
    return `${course.name} Credit ${course.credit}`;
  }

  function stripCredit(label) {
    return String(label || "").replace(/\s+Credit\s+\d+$/i, "");
  }

  function programShortName(programName) {
    const parts = String(programName || "").split(" - ");
    return parts[1] || parts[0] || "Program";
  }

  function programCode(programName, section) {
    const sourceText = programShortName(programName) || section || "Program";
    const letters = sourceText.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean);
    return letters.slice(0, 3).map((word) => word[0]).join("").toUpperCase() || "NEA";
  }

  function matchesSearch(item) {
    if (!state.search) return true;
    return Object.values(item).some((value) => String(value || "").toLowerCase().includes(state.search));
  }

  function highlight(value) {
    const text = escapeHtml(value || "");
    if (!state.search) return text;
    const escapedSearch = state.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${escapedSearch})`, "ig"), "<mark>$1</mark>");
  }

  function emptyRow(cols, message) {
    return `<tr><td colspan="${cols}" class="empty-state">${escapeHtml(message)}</td></tr>`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function readSnapshot() {
    try {
      return JSON.parse(localStorage.getItem(snapshotKey));
    } catch {
      return null;
    }
  }
})();
