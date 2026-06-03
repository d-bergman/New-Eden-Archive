(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCKgoV1cUmlvgDxb3CL9UNNiHhhwMk7bYs",
    authDomain: "new-eden-archive.firebaseapp.com",
    databaseURL: "https://new-eden-archive-default-rtdb.firebaseio.com",
    projectId: "new-eden-archive",
    storageBucket: "new-eden-archive.firebasestorage.app",
    messagingSenderId: "717052013385",
    appId: "1:717052013385:web:eb7fa648642d3701624898",
  };
  const firebaseVersion = "12.13.0";
  const firebaseDisabled = new URLSearchParams(window.location.search).has("nofirebase");
  const adminKey = "new-eden-admin-preview";
  const firebaseState = {
    ready: false,
    user: null,
    profile: null,
    modules: null,
    app: null,
    auth: null,
    db: null,
    storage: null,
    unsubscribers: [],
    hasCloudArchive: false,
  };
  const attachmentState = {
    records: [],
    activeProgram: "",
  };
  const requirementBuilder = {
    programName: "",
    rows: [],
    search: "",
  };

  const state = {
    courses: [],
    curriculum: [],
    programRecords: [],
    versionHistory: [],
    search: "",
    view: "overview",
    selectedCredit: "all",
    selectedSection: "all",
    selectedOverviewSection: "all",
    selectedStatus: "all",
    selectedProgram: "",
    courseSearch: "",
    courseSortKey: "id",
    courseSortDirection: "asc",
    requirementSearch: "",
    requirementCredit: "all",
    requirementSortKey: "courseId",
    requirementSortDirection: "asc",
    changelogEntries: [],
    signedIn: firebaseDisabled,
    admin: sessionStorage.getItem(adminKey) === "true",
  };

  const els = {
    body: document.body,
    authGate: document.querySelector("#authGate"),
    signInForm: document.querySelector("#signInForm"),
    signInEmail: document.querySelector("#signInEmail"),
    signInPassword: document.querySelector("#signInPassword"),
    signInMessage: document.querySelector("#signInMessage"),
    navItems: document.querySelectorAll("[data-view]"),
    views: document.querySelectorAll(".view"),
    globalSearch: document.querySelector("#globalSearch"),
    adminState: document.querySelector("#adminState"),
    adminToggle: document.querySelector("#adminToggle"),
    adminDialog: document.querySelector("#adminDialog"),
    adminEmail: document.querySelector("#adminEmail"),
    adminPassword: document.querySelector("#adminPassword"),
    confirmAdmin: document.querySelector("#confirmAdmin"),
    firebaseStatus: document.querySelector("#firebaseStatus"),
    signOutButton: document.querySelector("#signOutButton"),
    userInitials: document.querySelector("#userInitials"),
    userName: document.querySelector("#userName"),
    userRole: document.querySelector("#userRole"),
    overviewSectionFilter: document.querySelector("#overviewSectionFilter"),
    overviewCreditFilter: document.querySelector("#overviewCreditFilter"),
    statusFilter: document.querySelector("#statusFilter"),
    overviewCourses: document.querySelector("#overviewCourses"),
    overviewCourseTotal: document.querySelector("#overviewCourseTotal"),
    featuredProgramDetail: document.querySelector("#featuredProgramDetail"),
    courseCreditFilter: document.querySelector("#courseCreditFilter"),
    courseCatalogSearch: document.querySelector("#courseCatalogSearch"),
    courseCatalogSummary: document.querySelector("#courseCatalogSummary"),
    courseRows: document.querySelector("#courseRows"),
    addCourse: document.querySelector("#addCourse"),
    addCourseCatalog: document.querySelector("#addCourseCatalog"),
    addProgram: document.querySelector("#addProgram"),
    editProgramButton: document.querySelector("#editProgramButton"),
    removeBlankCourses: document.querySelector("#removeBlankCourses"),
    sectionFilter: document.querySelector("#sectionFilter"),
    programFilter: document.querySelector("#programFilter"),
    programSummary: document.querySelector("#programSummary"),
    curriculumRows: document.querySelector("#curriculumRows"),
    addProgramCourse: document.querySelector("#addProgramCourse"),
    requirementTableSearch: document.querySelector("#requirementTableSearch"),
    requirementTableCreditFilter: document.querySelector("#requirementTableCreditFilter"),
    programTitle: document.querySelector("#programTitle"),
    programCode: document.querySelector("#programCode"),
    requiredCount: document.querySelector("#requiredCount"),
    programDirectory: document.querySelector("#programDirectory"),
    versionTimeline: document.querySelector("#versionTimeline"),
    dataHealth: document.querySelector("#dataHealth"),
    programTabs: document.querySelectorAll("[data-program-tab]"),
    attachmentUpload: document.querySelector("#attachmentUpload"),
    attachmentDropZone: document.querySelector("#attachmentDropZone"),
    attachmentList: document.querySelector("#attachmentList"),
    editDialog: document.querySelector("#editDialog"),
    editForm: document.querySelector("#editForm"),
    editTitle: document.querySelector("#editTitle"),
    editFields: document.querySelector("#editFields"),
    requirementsDialog: document.querySelector("#requirementsDialog"),
    requirementsForm: document.querySelector("#requirementsForm"),
    requirementsTitle: document.querySelector("#requirementsTitle"),
    requirementCourseSearch: document.querySelector("#requirementCourseSearch"),
    requirementCoursePicker: document.querySelector("#requirementCoursePicker"),
    selectedRequirements: document.querySelector("#selectedRequirements"),
    requirementSelectedCount: document.querySelector("#requirementSelectedCount"),
    saveRequirements: document.querySelector("#saveRequirements"),
    confirmDialog: document.querySelector("#confirmDialog"),
    confirmEyebrow: document.querySelector("#confirmEyebrow"),
    confirmTitle: document.querySelector("#confirmTitle"),
    confirmMessage: document.querySelector("#confirmMessage"),
    confirmCancel: document.querySelector("#confirmCancel"),
    confirmAccept: document.querySelector("#confirmAccept"),
  };

  init();

  function init() {
    hydrateSelectors();
    bindEvents();
    if (!state.selectedProgram) {
      const initialProgram = programs().find((program) => program.section === "Traditional Naturopathy") || programs()[0];
      state.selectedProgram = initialProgram?.name || "";
      state.selectedSection = initialProgram?.section || state.selectedSection;
    }
    render();
    loadChangelog();
    initFirebase();
  }

  function bindEvents() {
    els.signInForm.addEventListener("submit", (event) => {
      event.preventDefault();
      signInUser(els.signInEmail.value.trim(), els.signInPassword.value);
    });

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

    els.overviewSectionFilter.addEventListener("change", (event) => {
      state.selectedOverviewSection = event.target.value;
      render();
    });

    els.overviewCreditFilter.addEventListener("change", (event) => {
      state.selectedCredit = event.target.value;
      els.courseCreditFilter.value = event.target.value;
      render();
    });

    els.statusFilter.addEventListener("change", (event) => {
      state.selectedStatus = event.target.value;
      render();
    });

    els.courseCreditFilter.addEventListener("change", (event) => {
      state.selectedCredit = event.target.value;
      els.overviewCreditFilter.value = event.target.value;
      render();
    });

    els.courseCatalogSearch.addEventListener("input", (event) => {
      state.courseSearch = event.target.value.trim().toLowerCase();
      renderCourses();
    });

    document.querySelectorAll("[data-course-sort]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.courseSort;
        if (state.courseSortKey === key) {
          state.courseSortDirection = state.courseSortDirection === "asc" ? "desc" : "asc";
        } else {
          state.courseSortKey = key;
          state.courseSortDirection = "asc";
        }
        renderCourses();
      });
    });

    document.querySelectorAll("[data-requirement-sort]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.requirementSort;
        if (state.requirementSortKey === key) {
          state.requirementSortDirection = state.requirementSortDirection === "asc" ? "desc" : "asc";
        } else {
          state.requirementSortKey = key;
          state.requirementSortDirection = "asc";
        }
        renderCurriculum();
      });
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

    const toggleAdmin = async () => {
      if (state.signedIn && !state.admin && !firebaseDisabled) {
        setCloudStatus(`Checking admin access for UID: ${firebaseState.user?.uid || "unknown"}`);
        try {
          await refreshRoleStatus();
        } catch (error) {
          console.warn("Admin role refresh failed.", error);
          setCloudStatus(`Role setup needed. UID: ${firebaseState.user?.uid || "unknown"}`);
        }
        return;
      }
      if (state.signedIn && (!firebaseDisabled || state.admin)) {
        lockAdmin();
        return;
      }
      els.adminEmail.value = firebaseState.user?.email || "";
      els.adminPassword.value = "";
      els.adminDialog.showModal();
      setTimeout(() => els.adminPassword.focus(), 0);
    };

    els.adminToggle.addEventListener("click", toggleAdmin);
    document.querySelector("#adminStatusButton")?.addEventListener("click", toggleAdmin);
    els.signOutButton.addEventListener("click", lockAdmin);

    els.confirmAdmin.addEventListener("click", (event) => {
      event.preventDefault();
      signInUser(els.adminEmail.value.trim(), els.adminPassword.value);
    });

    els.addCourse.addEventListener("click", () => openCourseEditor());
    els.addCourseCatalog.addEventListener("click", () => openCourseEditor());
    els.addProgramCourse.addEventListener("click", () => openRequirementBuilder());
    els.addProgram.addEventListener("click", () => openProgramEditor());
    els.editProgramButton.addEventListener("click", () => openProgramEditor(state.selectedProgram));
    els.removeBlankCourses.addEventListener("click", removeBlankCourses);
    els.attachmentUpload.addEventListener("change", uploadProgramAttachments);

    els.programTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        els.programTabs.forEach((item) => item.classList.toggle("active", item === tab));
        renderProgramPanel(tab.dataset.programTab);
      });
    });

    els.requirementCourseSearch.addEventListener("input", (event) => {
      requirementBuilder.search = event.target.value.trim().toLowerCase();
      renderRequirementBuilder();
    });

    els.requirementTableSearch.addEventListener("input", (event) => {
      state.requirementSearch = event.target.value.trim().toLowerCase();
      renderCurriculum();
    });

    els.requirementTableCreditFilter.addEventListener("change", (event) => {
      state.requirementCredit = event.target.value;
      renderCurriculum();
    });

    els.saveRequirements.addEventListener("click", (event) => {
      event.preventDefault();
      saveRequirementBuilder();
    });

    els.attachmentDropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      els.attachmentDropZone.classList.add("is-dragover");
    });

    els.attachmentDropZone.addEventListener("dragleave", () => {
      els.attachmentDropZone.classList.remove("is-dragover");
    });

    els.attachmentDropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      els.attachmentDropZone.classList.remove("is-dragover");
      handleProgramAttachmentFiles(Array.from(event.dataTransfer?.files || []));
    });
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
    renderDataHealth();
  }

  function renderChrome() {
    els.body.classList.toggle("auth-locked", !state.signedIn);
    els.body.classList.toggle("is-admin", state.admin);
    els.body.dataset.activeView = state.view;
    els.adminState.textContent = state.admin ? "Admin" : state.signedIn ? "Viewer" : "Sign In";
    els.adminToggle.querySelector("span").textContent = state.signedIn ? "Sign Out" : "Sign In";
    document.querySelector("#adminStatusButton i").className = state.admin ? "bi bi-unlock" : "bi bi-lock";
    renderUserChip();

    els.navItems.forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
    els.views.forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
  }

  function renderUserChip() {
    const profile = firebaseState.profile;
    const emailName = firebaseState.user?.email?.split("@")[0] || "Employee";
    const displayName = profile?.displayName || firebaseState.user?.displayName || emailName;
    const role = state.admin ? "Administrator" : state.signedIn ? "Standard User" : "Not signed in";
    els.userName.textContent = displayName;
    els.userRole.textContent = role;
    els.userInitials.textContent = initials(displayName);
  }

  function renderStats() {
    document.querySelector("#courseCount").textContent = state.courses.length;
    document.querySelector("#programCount").textContent = programs().length;
    document.querySelector("#curriculumCount").textContent = state.curriculum.length;
    document.querySelector("#sectionCount").textContent = sections().length;
  }

  function renderOverview() {
    const allRows = filteredCourses({ section: state.selectedOverviewSection, status: state.selectedStatus });
    const rows = allRows.slice(0, 10);
    const shownEnd = allRows.length ? Math.min(rows.length, allRows.length) : 0;

    els.overviewCourseTotal.textContent = `Showing ${allRows.length ? 1 : 0} to ${shownEnd} of ${allRows.length} courses`;

    els.overviewCourses.innerHTML = rows.map((course, index) => {
      const courseIndex = state.courses.indexOf(course);
      const status = course.status || "Active";

      return `
        <tr class="${index === 0 ? "is-selected" : ""}">
          <td><input class="form-check-input" type="checkbox" ${index === 0 ? "checked" : ""} aria-label="Select ${escapeAttr(course.name)}" /></td>
          <td>${escapeHtml(course.id)}</td>
          <td>${escapeHtml(course.credit)}</td>
          <td>${highlight(course.name)}</td>
          <td>${escapeHtml(course.comment || "Course archive record.")}</td>
          <td><span class="status-badge">${escapeHtml(status)}</span></td>
          <td class="text-end">
            <div class="action-menu-wrap">
              <button class="table-action" data-toggle-course-menu="${courseIndex}" type="button" aria-label="Course actions">
                <i class="bi bi-three-dots"></i>
              </button>
              <div class="action-menu" hidden>
                <button type="button" data-edit-course="${courseIndex}">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button type="button" class="danger" data-delete-course="${courseIndex}">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join("") || emptyRow(7, "No courses match the current filters.");

    bindCourseActionMenus(els.overviewCourses);

  }

  function bindCourseActionMenus(container) {
    container.querySelectorAll("[data-toggle-course-menu]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        container.querySelectorAll(".action-menu").forEach((menu) => {
          if (menu !== button.nextElementSibling) menu.hidden = true;
        });

        const menu = button.nextElementSibling;
        menu.hidden = !menu.hidden;
      });
    });

    container.querySelectorAll("[data-edit-course]").forEach((button) => {
      button.addEventListener("click", () => {
        openCourseEditor(Number(button.dataset.editCourse));
      });
    });

    container.querySelectorAll("[data-delete-course]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteCourse(Number(button.dataset.deleteCourse));
      });
    });
  }

  async function deleteCourse(index) {
    if (!state.admin) return;

    const course = state.courses[index];
    if (!course) return;

    const references = curriculumRowsForCourse(course);
    const referenceMessage = references.length
      ? ` This course is used in ${references.length} curriculum row(s); those requirements will stay in place until removed from their programs.`
      : "";
    const confirmed = await confirmAction({
      eyebrow: "Course Archive",
      title: "Delete Course",
      message: `Delete course "${course.name || course.id || "Untitled Course"}"?${referenceMessage}`,
      confirmText: "Delete",
    });
    if (!confirmed) return;

    state.courses.splice(index, 1);

    if (canWriteCloud() && course._docId) {
      const { dbRef, remove } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `courses/${course._docId}`));
    }

    render();
  }

  async function removeBlankCourses() {
    if (!state.admin) return;
    const blankCourses = archiveHealthReport().blankCourses;
    if (!blankCourses.length) return;
    const confirmed = await confirmAction({
      eyebrow: "Archive Health",
      title: "Remove Blank Courses",
      message: `Remove ${blankCourses.length} blank course record(s)?`,
      confirmText: "Remove",
    });
    if (!confirmed) return;

    state.courses = state.courses.filter((course) => !isBlankCourse(course));

    if (canWriteCloud()) {
      const { dbRef, remove } = firebaseState.modules;
      await Promise.all(blankCourses
        .filter((course) => course._docId)
        .map((course) => remove(dbRef(firebaseState.db, `courses/${course._docId}`))));
    }

    setCloudStatus(`Removed ${blankCourses.length} blank course record(s)`);
    render();
  }

  function renderProgramPanel(tab = "overview") {
    const selected = state.selectedProgram || programs()[0]?.name || "";
    const rowsForProgram = curriculumForProgram(selected);
    const totalCredits = rowsForProgram.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    const program = programs().find((item) => item.name === selected);
    const section = rowsForProgram[0]?.section || program?.section || "Program";
    const description = programDescription(program, section);
    const attachments = attachmentsForProgram(selected);

    if (tab === "attachments") {
      els.featuredProgramDetail.style.display = "none";
      document.querySelector("#programAttachments").style.display = "block";
      els.attachmentList.innerHTML = attachments.map((attachment) => `
        <article class="attachment-item">
          <i class="bi bi-file-earmark-text"></i>
          <div>
            <strong>${escapeHtml(attachment.name)}</strong>
            <span>${escapeHtml(formatBytes(attachment.size))} ${attachment.contentType ? `&bull; ${escapeHtml(attachment.contentType)}` : ""}</span>
          </div>
          <a class="btn btn-sm btn-outline-eden" href="${escapeAttr(attachment.downloadURL || "#")}" target="_blank" rel="noopener" ${attachment.downloadURL ? "" : "aria-disabled=\"true\""}>
            <i class="bi bi-download"></i>
            Download
          </a>
          <button class="btn btn-sm btn-outline-danger admin-only" type="button" data-remove-attachment="${escapeAttr(attachment._docId)}">
            Remove
          </button>
        </article>
      `).join("") || `<div class="empty-state">No attachments have been added for this program yet.</div>`;

      els.attachmentList.querySelectorAll("[data-remove-attachment]").forEach((button) => {
        button.addEventListener("click", () => removeAttachment(button.dataset.removeAttachment));
      });
      return;
    }

    document.querySelector("#programAttachments").style.display = "none";
    els.featuredProgramDetail.style.display = "block";
    if (tab === "notes") {
      const notes = String(program?.notes || "").trim();
      els.featuredProgramDetail.innerHTML = `
        <p class="mb-3"><strong>Notes</strong><br />
          ${notes ? escapeHtml(notes).replace(/\n/g, "<br />") : "No notes have been added for this program yet."}
        </p>
      `;
      return;
    }

    els.featuredProgramDetail.innerHTML = `
      <p class="mb-3"><strong>Description</strong><br />
        ${escapeHtml(description).replace(/\n/g, "<br />")}
      </p>
      <p class="mb-3"><strong>Program</strong><br />${escapeHtml(section)}</p>
      <dl>
        <div><dt>Total Credits</dt><dd>${totalCredits}</dd></div>
        <div><dt>Total Required Courses</dt><dd>${rowsForProgram.length}</dd></div>
        <div><dt>Last Updated</dt><dd>Synced from Firebase</dd></div>
        <div><dt>Attachments</dt><dd>${attachments.length}</dd></div>
      </dl>
    `;
  }

  function renderCourses() {
    const query = courseCatalogQuery();
    const rows = filteredCourses({
      search: query,
      sortKey: state.courseSortKey,
      sortDirection: state.courseSortDirection,
    });
    const totalCourses = state.courses.length;
    els.courseCatalogSearch.value = state.courseSearch;
    els.courseCatalogSummary.textContent = rows.length === totalCourses
      ? `${totalCourses} courses in catalog`
      : `Showing ${rows.length} of ${totalCourses} courses`;
    renderCourseSortHeaders();

    els.courseRows.innerHTML = rows.map((course, index) => {
      const realIndex = state.courses.indexOf(course);
      return `
        <tr>
          <td>${escapeHtml(course.id)}</td>
          <td>${escapeHtml(course.credit)}</td>
          <td>${highlight(course.name, query)}</td>
          <td>${escapeHtml(course.comment || "")}</td>
          <td class="admin-col text-end">
            <div class="course-row-actions">
              <button class="btn btn-sm btn-outline-eden" type="button" data-edit-course="${realIndex}">Edit</button>
              <button class="btn btn-sm btn-outline-danger" type="button" data-delete-course="${realIndex}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("") || emptyRow(5, "No courses match the current filters.");

    bindCourseActionMenus(els.courseRows);
  }

  function renderCurriculum() {
    const currentPrograms = filteredPrograms();
    if (!currentPrograms.some((program) => program.name === state.selectedProgram)) {
      state.selectedProgram = currentPrograms[0]?.name || "";
    }
    els.programFilter.value = state.selectedProgram;

    const allRows = curriculumForProgram(state.selectedProgram);
    const rows = filteredRequirementRows(allRows);
    const totalCredits = allRows.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    const program = programs().find((item) => item.name === state.selectedProgram);
    const section = rows[0]?.section || program?.section || state.selectedSection || "Curriculum";
    els.programSummary.textContent = state.selectedProgram
      ? `${section} - ${rows.length} required course rows totaling ${totalCredits} credits.`
      : "Choose a section and curriculum to manage required courses.";
    els.programTitle.textContent = programShortName(state.selectedProgram);
    els.programCode.textContent = program?.code || programCode(state.selectedProgram, section);
    els.requiredCount.textContent = rows.length;
    els.requirementTableSearch.value = state.requirementSearch;
    hydrateRequirementCreditFilter(allRows);
    renderRequirementSortHeaders();
    renderProgramPanel(activeProgramTab());

    els.curriculumRows.innerHTML = rows.map((row) => {
      const realIndex = state.curriculum.indexOf(row);
      return `
        <tr>
          <td>${escapeHtml(row.courseId)}</td>
          <td>${highlight(stripCredit(row.courseLabel))}</td>
          <td>${escapeHtml(row.credit)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger admin-only" data-remove-curriculum="${realIndex}" type="button">Remove</button>
          </td>
        </tr>
      `;
    }).join("") || emptyRow(4, "No curriculum rows match the current filters.");

    els.curriculumRows.querySelectorAll("[data-remove-curriculum]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!state.admin) return;
        const row = state.curriculum[Number(button.dataset.removeCurriculum)];
        const confirmed = await confirmAction({
          eyebrow: "Curriculum",
          title: "Remove Requirement",
          message: `Remove "${stripCredit(row?.courseLabel) || row?.courseId || "this course"}" from ${row?.program || "this program"}?`,
          confirmText: "Remove",
        });
        if (!confirmed) return;
        const removed = state.curriculum.splice(Number(button.dataset.removeCurriculum), 1)[0];
        removeCurriculumRow(removed);
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
          <div class="program-row">
            <button class="program-link" data-program="${escapeAttr(program.name)}">
              ${highlight(program.name)}
            </button>
            <div class="program-actions admin-only">
              <button class="btn btn-sm btn-outline-eden" data-edit-program="${escapeAttr(program.name)}">Edit</button>
              <button class="btn btn-sm btn-outline-danger" data-remove-program="${escapeAttr(program.name)}">Remove</button>
            </div>
          </div>
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

    els.programDirectory.querySelectorAll("[data-edit-program]").forEach((button) => {
      button.addEventListener("click", () => openProgramEditor(button.dataset.editProgram));
    });

    els.programDirectory.querySelectorAll("[data-remove-program]").forEach((button) => {
      button.addEventListener("click", () => removeProgram(button.dataset.removeProgram));
    });
  }

  function renderCourseSortHeaders() {
    document.querySelectorAll("[data-course-sort]").forEach((button) => {
      const active = button.dataset.courseSort === state.courseSortKey;
      button.classList.toggle("active", active);
      const icon = button.querySelector("i");
      if (icon) {
        icon.className = active && state.courseSortDirection === "asc"
          ? "bi bi-chevron-up"
          : active
            ? "bi bi-chevron-down"
            : "bi bi-chevron-expand";
      }
    });
  }

  function renderRequirementSortHeaders() {
    document.querySelectorAll("[data-requirement-sort]").forEach((button) => {
      const active = button.dataset.requirementSort === state.requirementSortKey;
      button.classList.toggle("active", active);
      const icon = button.querySelector("i");
      if (icon) {
        icon.className = active && state.requirementSortDirection === "asc"
          ? "bi bi-chevron-up"
          : active
            ? "bi bi-chevron-down"
            : "bi bi-chevron-expand";
      }
    });
  }

  function renderHistory() {
    els.versionTimeline.innerHTML = state.changelogEntries.map((entry, index) => `
      <details class="changelog-entry" ${index === 0 ? "open" : ""}>
        <summary>
          <time>${escapeHtml(entry.date)}</time>
          <span>
            <strong>${escapeHtml(entry.version)}</strong>
            <em>${escapeHtml(entry.title)}</em>
          </span>
          <i class="bi bi-chevron-down"></i>
        </summary>
        <div class="changelog-body">
          ${markdownToHtml(entry.body)}
        </div>
      </details>
    `).join("") || `<div class="empty-state">No changelog entries found.</div>`;
  }

  async function loadChangelog() {
    try {
      const response = await fetch("changelog.md", { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load changelog.md (${response.status})`);
      state.changelogEntries = parseChangelog(await response.text());
    } catch (error) {
      console.warn("Changelog load failed.", error);
      state.changelogEntries = [];
    }
    renderHistory();
  }

  function parseChangelog(markdown) {
    const entries = [];
    let current = null;

    markdown.split(/\r?\n/).forEach((line) => {
      const heading = line.match(/^##\s+(V[\d.]+)\s+-\s+(.+?)\s+-\s+(.+)$/i);
      if (heading) {
        if (current) entries.push(current);
        current = {
          version: heading[1],
          date: heading[2],
          title: heading[3],
          body: "",
        };
        return;
      }
      if (current) current.body += `${line}\n`;
    });

    if (current) entries.push(current);
    return entries;
  }

  function markdownToHtml(markdown) {
    const lines = markdown.trim().split(/\r?\n/);
    let inList = false;
    const html = [];

    lines.forEach((line) => {
      if (!line.trim()) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        return;
      }

      if (/^###\s+/.test(line)) {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push(`<h4>${escapeHtml(line.replace(/^###\s+/, ""))}</h4>`);
        return;
      }

      if (/^-\s+/.test(line)) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push(`<li>${escapeInlineMarkdown(line.replace(/^-\s+/, ""))}</li>`);
        return;
      }

      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<p>${escapeInlineMarkdown(line)}</p>`);
    });

    if (inList) html.push("</ul>");
    return html.join("");
  }

  function escapeInlineMarkdown(value) {
    return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function renderDataHealth() {
    const report = archiveHealthReport();
    els.removeBlankCourses.disabled = !state.admin || !report.blankCourses.length;

    const issues = [
      {
        title: "Blank course records",
        count: report.blankCourses.length,
        detail: report.blankCourses.length
          ? report.blankCourses.map((course) => course._docId || "unknown-doc").join(", ")
          : "No blank course records found.",
      },
      {
        title: "Duplicate course IDs",
        count: report.duplicateCourseIds.length,
        detail: report.duplicateCourseIds.length
          ? report.duplicateCourseIds.map((item) => `${item.id} (${item.count})`).join(", ")
          : "No duplicate course IDs found.",
      },
      {
        title: "Curriculum rows without a matching course",
        count: report.orphanCurriculumRows.length,
        detail: report.orphanCurriculumRows.length
          ? report.orphanCurriculumRows.slice(0, 8).map((row) => row.courseId || stripCredit(row.courseLabel) || row._docId).join(", ")
          : "Every curriculum row points to a known course.",
      },
    ];

    els.dataHealth.innerHTML = `
      <div class="health-grid" aria-label="Archive counts">
        ${[
          ["Courses", state.courses.length],
          ["Programs", programs().length],
          ["Curriculum Rows", state.curriculum.length],
          ["Sections", sections().length],
          ["Attachments", attachmentState.records.length],
        ].map(([label, value]) => `
          <div class="health-stat">
            <strong>${escapeHtml(value)}</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `).join("")}
      </div>
      <div class="health-issues">
        ${issues.map((issue) => `
          <article class="health-issue ${issue.count ? "has-warning" : ""}">
            <div>
              <strong>${escapeHtml(issue.count)}</strong>
              <span>${escapeHtml(issue.title)}</span>
            </div>
            <p>${escapeHtml(issue.detail)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function filteredRequirementRows(rows) {
    return rows
      .filter((row) => state.requirementCredit === "all" || String(row.credit || "") === state.requirementCredit)
      .filter((row) => !state.requirementSearch || matchesText(row, state.requirementSearch) || matchesText({ name: stripCredit(row.courseLabel) }, state.requirementSearch))
      .sort((a, b) => compareRequirementRows(a, b, state.requirementSortKey, state.requirementSortDirection));
  }

  function compareRequirementRows(a, b, key, direction = "asc") {
    const multiplier = direction === "desc" ? -1 : 1;
    const compare = (() => {
      if (key === "credit") {
        const creditCompare = Number(a.credit || 0) - Number(b.credit || 0);
        return creditCompare || naturalCompare(a.courseId, b.courseId) || naturalCompare(stripCredit(a.courseLabel), stripCredit(b.courseLabel));
      }
      if (key === "courseName") {
        return naturalCompare(stripCredit(a.courseLabel), stripCredit(b.courseLabel)) || naturalCompare(a.courseId, b.courseId);
      }
      return naturalCompare(a.courseId, b.courseId) || naturalCompare(stripCredit(a.courseLabel), stripCredit(b.courseLabel));
    })();
    return compare * multiplier;
  }

  function hydrateRequirementCreditFilter(rows) {
    const creditsForRows = Array.from(new Set(rows.map((row) => row.credit).filter(Boolean)))
      .sort((a, b) => Number(a) - Number(b));
    els.requirementTableCreditFilter.innerHTML = [`<option value="all">All Credits</option>`]
      .concat(creditsForRows.map((credit) => `<option value="${escapeAttr(credit)}">Credit ${escapeHtml(credit)}</option>`))
      .join("");
    if (state.requirementCredit !== "all" && !creditsForRows.includes(state.requirementCredit)) {
      state.requirementCredit = "all";
    }
    els.requirementTableCreditFilter.value = state.requirementCredit;
  }

  function hydrateSelectors() {
    const creditOptions = [`<option value="all">All Credits</option>`]
      .concat(credits().map((credit) => `<option value="${escapeAttr(credit)}">Credit ${escapeHtml(credit)}</option>`))
      .join("");
    const sectionOptions = [`<option value="all">All Sections</option>`]
      .concat(sections().map((section) => `<option value="${escapeAttr(section)}">${escapeHtml(section)}</option>`))
      .join("");
    const statusOptions = [`<option value="all">All Statuses</option>`]
      .concat(statuses().map((status) => `<option value="${escapeAttr(status)}">${escapeHtml(status)}</option>`))
      .join("");

    els.overviewSectionFilter.innerHTML = sectionOptions;
    els.overviewSectionFilter.value = state.selectedOverviewSection;
    els.overviewCreditFilter.innerHTML = creditOptions;
    els.courseCreditFilter.innerHTML = creditOptions;
    els.statusFilter.innerHTML = statusOptions;
    els.overviewCreditFilter.value = state.selectedCredit;
    els.courseCreditFilter.value = state.selectedCredit;
    els.statusFilter.value = state.selectedStatus;

    els.sectionFilter.innerHTML = sectionOptions;
    els.sectionFilter.value = state.selectedSection;

    const programOptions = filteredPrograms().map((program) => `<option value="${escapeAttr(program.name)}">${escapeHtml(program.name)}</option>`).join("");
    els.programFilter.innerHTML = programOptions;
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
      values._docId = course._docId || values.id || slugify(values.name);
      if (index == null) state.courses.push(values);
      else state.courses[index] = values;
      persistCourse(values);
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
      values._docId = row._docId || curriculumDocId(values, index ?? state.curriculum.length);
      const matchingCourse = state.courses.find((course) => courseLabel(course) === values.courseLabel || course.id === values.courseId);
      if (matchingCourse) {
        values.courseId = matchingCourse.id;
        values.credit = matchingCourse.credit;
        values.courseLabel = courseLabel(matchingCourse);
      }
      if (index == null) state.curriculum.push(values);
      else state.curriculum[index] = values;
      state.selectedProgram = values.program;
      persistCurriculumRow(values);
      render();
    });
  }

  function openRequirementBuilder() {
    if (!state.admin || !state.selectedProgram) return;
    requirementBuilder.programName = state.selectedProgram;
    requirementBuilder.search = "";
    requirementBuilder.rows = curriculumForProgram(state.selectedProgram).map((row, index) => ({
      ...row,
      order: Number(row.order || index + 1),
    }));
    els.requirementsTitle.textContent = programShortName(state.selectedProgram);
    els.requirementCourseSearch.value = "";
    renderRequirementBuilder();
    els.requirementsDialog.showModal();
    setTimeout(() => els.requirementCourseSearch.focus(), 0);
  }

  function renderRequirementBuilder() {
    const selectedIds = new Set(requirementBuilder.rows.map((row) => row.courseId));
    const courseMatches = state.courses
      .filter((course) => !selectedIds.has(course.id))
      .filter((course) => !requirementBuilder.search || matchesText(course, requirementBuilder.search))
      .slice(0, 18);

    els.requirementCoursePicker.innerHTML = courseMatches.map((course) => `
      <button class="course-picker-row" type="button" data-add-requirement="${escapeAttr(course.id)}">
        <span>
          <strong>${escapeHtml(course.name)}</strong>
          <small>${escapeHtml(course.id)} &bull; Credit ${escapeHtml(course.credit)}</small>
        </span>
        <i class="bi bi-plus-circle"></i>
      </button>
    `).join("") || `<div class="empty-state">No available courses match the search.</div>`;

    sortRequirementRows();
    els.selectedRequirements.innerHTML = requirementBuilder.rows.map((row, index) => `
        <div class="selected-requirement-row">
          <span class="requirement-order">${index + 1}</span>
          <span>
            <strong>${escapeHtml(stripCredit(row.courseLabel))}</strong>
            <small>${escapeHtml(row.courseId)} &bull; Credit ${escapeHtml(row.credit)}</small>
          </span>
          <span class="requirement-row-actions">
            <button class="table-action" type="button" data-move-requirement="${escapeAttr(row.courseId)}" data-direction="up" ${index === 0 ? "disabled" : ""} aria-label="Move requirement up">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button class="table-action" type="button" data-move-requirement="${escapeAttr(row.courseId)}" data-direction="down" ${index === requirementBuilder.rows.length - 1 ? "disabled" : ""} aria-label="Move requirement down">
              <i class="bi bi-arrow-down"></i>
            </button>
            <button class="table-action" type="button" data-remove-requirement="${escapeAttr(row.courseId)}" aria-label="Remove requirement">
              <i class="bi bi-x-lg"></i>
            </button>
          </span>
        </div>
      `).join("") || `<div class="empty-state">No courses selected yet.</div>`;

    els.requirementSelectedCount.textContent = requirementBuilder.rows.length;

    els.requirementCoursePicker.querySelectorAll("[data-add-requirement]").forEach((button) => {
      button.addEventListener("click", () => {
        const course = state.courses.find((item) => item.id === button.dataset.addRequirement);
        if (!course) return;
        const program = programs().find((item) => item.name === requirementBuilder.programName);
        requirementBuilder.rows.push({
          _docId: curriculumDocId({ program: requirementBuilder.programName, courseId: course.id }, requirementBuilder.rows.length),
          section: program?.section || "",
          program: requirementBuilder.programName,
          courseLabel: courseLabel(course),
          courseId: course.id,
          credit: course.credit,
          comment: "",
          status: "Active",
          type: "Required",
          order: requirementBuilder.rows.length + 1,
        });
        renderRequirementBuilder();
      });
    });

    els.selectedRequirements.querySelectorAll("[data-remove-requirement]").forEach((button) => {
      button.addEventListener("click", () => {
        requirementBuilder.rows = requirementBuilder.rows.filter((row) => row.courseId !== button.dataset.removeRequirement);
        requirementBuilder.rows.forEach((row, index) => { row.order = index + 1; });
        renderRequirementBuilder();
      });
    });

    els.selectedRequirements.querySelectorAll("[data-move-requirement]").forEach((button) => {
      button.addEventListener("click", () => {
        moveRequirement(button.dataset.moveRequirement, button.dataset.direction);
      });
    });
  }

  function sortRequirementRows() {
    requirementBuilder.rows.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    requirementBuilder.rows.forEach((row, index) => { row.order = index + 1; });
  }

  function moveRequirement(courseId, direction) {
    sortRequirementRows();
    const index = requirementBuilder.rows.findIndex((row) => row.courseId === courseId);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= requirementBuilder.rows.length) return;
    const [row] = requirementBuilder.rows.splice(index, 1);
    requirementBuilder.rows.splice(targetIndex, 0, row);
    requirementBuilder.rows.forEach((item, itemIndex) => { item.order = itemIndex + 1; });
    renderRequirementBuilder();
  }

  async function saveRequirementBuilder() {
    if (!state.admin) return;
    const previousRows = curriculumForProgram(requirementBuilder.programName);
    const nextIds = new Set(requirementBuilder.rows.map((row) => row.courseId));
    const removedRows = previousRows.filter((row) => !nextIds.has(row.courseId));
    const program = programs().find((item) => item.name === requirementBuilder.programName);

    state.curriculum = state.curriculum.filter((row) => row.program !== requirementBuilder.programName);
    const rowsToSave = requirementBuilder.rows.map((row, index) => ({
      ...row,
      section: program?.section || row.section || "",
      program: requirementBuilder.programName,
      order: index + 1,
      type: row.type || "Required",
      _docId: row._docId || curriculumDocId(row, index),
    }));
    state.curriculum.push(...rowsToSave);

    if (canWriteCloud()) {
      await Promise.all([
        ...removedRows.map((row) => removeCurriculumRow(row)),
        ...rowsToSave.map((row) => persistCurriculumRow(row)),
      ]);
    }

    els.requirementsDialog.close();
    render();
  }

  function openProgramEditor(programName) {
    if (!state.admin) return;
    const existing = programName
      ? programs().find((program) => program.name === programName)
      : null;
    const program = existing || {
      section: sections()[0] || "",
      name: "",
      code: "",
      status: "Active",
      version: "v1.0",
      description: "",
      notes: "",
    };

    openEditor(existing ? "Edit Curriculum" : "Add Curriculum", [
      field("section", "Program", program.section, "select", sections()),
      field("name", "Curriculum Name", program.name),
      field("code", "Curriculum Code", program.code || programCode(program.name, program.section)),
      field("status", "Status", program.status || "Active", "select", ["Active", "Inactive", "Archived"]),
      field("version", "Version", program.version || "v1.0"),
      field("description", "Description", programDescription(program, program.section), "textarea"),
      field("notes", "Notes", program.notes || "", "textarea"),
    ], (values) => {
      const record = normalizePrograms([{ ...program, ...values }])[0];
      const oldName = program.name;
      const index = state.programRecords.findIndex((item) => item._docId === record._docId || item.name === oldName);
      if (index >= 0) state.programRecords[index] = record;
      else state.programRecords.push(record);

      if (oldName && oldName !== record.name) {
        state.curriculum.forEach((row) => {
          if (row.program === oldName) {
            row.program = record.name;
            row.section = record.section;
            persistCurriculumRow(row);
          }
        });
      }

      state.selectedProgram = record.name;
      persistProgram(record);
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
    document.querySelector("#cancelEdit")?.addEventListener("click", () => {
      els.editForm.onsubmit = null;
      els.editDialog.close("cancel");
    }, { once: true });

    els.editForm.onsubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(els.editForm);
      await onSave(Object.fromEntries(formData.entries()));
      els.editDialog.close();
    };
  }

  function field(name, label, value, type = "text", options = []) {
    return { name, label, value, type, options };
  }

  async function initFirebase() {
    if (firebaseDisabled) {
      state.signedIn = true;
      setCloudStatus("Realtime Database disabled for test");
      render();
      return;
    }

    try {
      setCloudStatus("Realtime Database connecting");
      const [appModule, authModule, databaseModule, storageModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-database.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-storage.js`),
      ]);

      firebaseState.modules = {
        ...appModule,
        ...authModule,
        getDatabase: databaseModule.getDatabase,
        dbRef: databaseModule.ref,
        get: databaseModule.get,
        onValue: databaseModule.onValue,
        set: databaseModule.set,
        update: databaseModule.update,
        remove: databaseModule.remove,
        serverTimestamp: databaseModule.serverTimestamp,
        getStorage: storageModule.getStorage,
        storageRef: storageModule.ref,
        uploadBytes: storageModule.uploadBytes,
        uploadBytesResumable: storageModule.uploadBytesResumable,
        getDownloadURL: storageModule.getDownloadURL,
        deleteObject: storageModule.deleteObject,
      };
      firebaseState.app = appModule.initializeApp(firebaseConfig);
      firebaseState.auth = authModule.getAuth(firebaseState.app);
      firebaseState.db = databaseModule.getDatabase(firebaseState.app);
      firebaseState.storage = storageModule.getStorage(firebaseState.app);
      firebaseState.ready = true;
      setCloudStatus("Realtime Database ready");

      authModule.onAuthStateChanged(firebaseState.auth, async (user) => {
        firebaseState.user = user;
        firebaseState.profile = null;
        sessionStorage.removeItem(adminKey);
        if (!user) {
          stopRealtimeListeners();
          state.signedIn = false;
          state.admin = false;
          setCloudStatus("Realtime Database ready");
          render();
          return;
        }

        state.signedIn = true;
        state.admin = false;
        els.signInMessage.textContent = "Signed in.";
        setCloudStatus("Loading realtime data");
        try {
          await refreshRoleStatus();
          const sizes = await loadRealtimeData();
          startRealtimeListeners();
          setCloudStatus(cloudLoadedMessage(sizes));
        } catch (error) {
          console.warn("Signed in, but realtime data lookup failed.", error);
          setCloudStatus(`Realtime data failed. UID: ${user.uid}`);
        }
        render();
      });
    } catch (error) {
      console.warn("Firebase unavailable.", error);
      setCloudStatus("Cloud offline");
    }
  }

  async function signInUser(email, password) {
    if (firebaseState.ready && email) {
      try {
        await firebaseState.modules.signInWithEmailAndPassword(firebaseState.auth, email, password);
        els.signInPassword.value = "";
        els.signInMessage.textContent = "Signed in.";
        els.adminDialog.close();
        return;
      } catch (error) {
        const message = firebaseErrorMessage(error);
        els.signInMessage.textContent = message;
        els.adminPassword.setCustomValidity(message);
        if (document.activeElement === els.adminPassword || els.adminDialog.open) {
          els.adminPassword.reportValidity();
          els.adminPassword.setCustomValidity("");
        }
        return;
      }
    }

    if (firebaseDisabled && password === "neweden") {
      state.signedIn = true;
      state.admin = true;
      sessionStorage.setItem(adminKey, "true");
      els.adminDialog.close();
      render();
      return;
    }

    els.signInMessage.textContent = "Enter a Firebase email/password.";
  }

  async function lockAdmin() {
    if (firebaseState.user && firebaseState.ready) {
      await firebaseState.modules.signOut(firebaseState.auth);
    }
    stopRealtimeListeners();
    if (!firebaseDisabled) state.signedIn = false;
    state.admin = false;
    firebaseState.user = null;
    firebaseState.profile = null;
    sessionStorage.removeItem(adminKey);
    render();
  }

  async function refreshRoleStatus() {
    if (!firebaseState.ready || !firebaseState.user) return;
    const { dbRef, get } = firebaseState.modules;
    const [adminSnap, profileSnap] = await Promise.all([
      get(dbRef(firebaseState.db, `admins/${firebaseState.user.uid}`)),
      get(dbRef(firebaseState.db, `users/${firebaseState.user.uid}`)),
    ]);
    firebaseState.profile = profileSnap.exists() ? profileSnap.val() : null;
    state.admin = adminSnap.exists();
    if (state.admin) {
      setCloudStatus(`Realtime admin: ${firebaseState.user.email}`);
    } else {
      setCloudStatus(`Viewer. Add admins/${firebaseState.user.uid} for admin access.`);
    }
    render();
  }

  async function loadRealtimeData() {
    if (!firebaseState.ready) return;
    const { dbRef, get } = firebaseState.modules;
    const [courseSnap, programSnap, curriculumSnap, versionSnap, attachmentSnap] = await Promise.all([
      get(dbRef(firebaseState.db, "courses")),
      get(dbRef(firebaseState.db, "programs")),
      get(dbRef(firebaseState.db, "curriculumRows")),
      get(dbRef(firebaseState.db, "versionHistory")),
      get(dbRef(firebaseState.db, "attachments")),
    ]);

    const sizes = {
      courses: rtdbList(courseSnap.val()).length,
      programs: rtdbList(programSnap.val()).length,
      curriculumRows: rtdbList(curriculumSnap.val()).length,
      versionHistory: rtdbList(versionSnap.val()).length,
      attachments: rtdbList(attachmentSnap.val()).length,
    };
    firebaseState.hasCloudArchive = Boolean(sizes.courses || sizes.programs || sizes.curriculumRows);

    if (!firebaseState.hasCloudArchive) {
      attachmentState.records = normalizeAttachments(rtdbList(attachmentSnap.val()));
      return sizes;
    }

    state.courses = normalizeCourses(rtdbList(courseSnap.val()));
    state.programRecords = normalizePrograms(rtdbList(programSnap.val()));
    state.curriculum = normalizeCurriculum(rtdbList(curriculumSnap.val()));
    state.versionHistory = rtdbList(versionSnap.val());
    attachmentState.records = normalizeAttachments(rtdbList(attachmentSnap.val()));

    return sizes;
  }

  function cloudLoadedMessage(sizes = {}) {
    if (!firebaseState.hasCloudArchive) {
      return "Realtime Database empty; add or import records";
    }
    const warnings = [];
    if (!sizes.courses) warnings.push("0 courses");
    if (!sizes.programs) warnings.push("0 programs");
    if (!sizes.curriculumRows) warnings.push("0 curriculum rows");
    const summary = `Realtime loaded: ${sizes.courses || 0} courses, ${sizes.programs || 0} programs, ${sizes.curriculumRows || 0} curriculum rows`;
    return warnings.length ? `${summary}. Check ${warnings.join(", ")}.` : summary;
  }

  function rtdbList(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.filter(Boolean).map((item, index) => ({ _docId: item._docId || String(index), ...item }));
    }
    return Object.entries(value).map(([key, item]) => ({ _docId: item?._docId || key, ...(item || {}) }));
  }

  function startRealtimeListeners() {
    if (!firebaseState.ready) return;
    stopRealtimeListeners();
    const { dbRef, onValue } = firebaseState.modules;
    const handleSnapshotError = (error) => {
      console.warn("Realtime Database listener failed.", error);
      setCloudStatus(firebaseErrorMessage(error));
    };

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "courses"), (snapshot) => {
      if (!snapshot.exists() && !firebaseState.hasCloudArchive) return;
      state.courses = normalizeCourses(rtdbList(snapshot.val()));
      render();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "programs"), (snapshot) => {
      if (!snapshot.exists() && !firebaseState.hasCloudArchive) return;
      state.programRecords = normalizePrograms(rtdbList(snapshot.val()));
      render();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "curriculumRows"), (snapshot) => {
      if (!snapshot.exists() && !firebaseState.hasCloudArchive) return;
      state.curriculum = normalizeCurriculum(rtdbList(snapshot.val()));
      render();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "versionHistory"), (snapshot) => {
      if (!snapshot.exists() && !firebaseState.hasCloudArchive) return;
      state.versionHistory = rtdbList(snapshot.val());
      render();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "attachments"), (snapshot) => {
      attachmentState.records = normalizeAttachments(rtdbList(snapshot.val()));
      render();
    }, handleSnapshotError));
  }

  function stopRealtimeListeners() {
    firebaseState.unsubscribers.forEach((unsubscribe) => unsubscribe());
    firebaseState.unsubscribers = [];
  }

  async function persistCourse(course) {
    if (!canWriteCloud()) return;
    const { dbRef, set, serverTimestamp } = firebaseState.modules;
    course._docId = course._docId || course.id || slugify(course.name);
    await set(dbRef(firebaseState.db, `courses/${course._docId}`), {
      ...archiveCourse(course),
      _docId: course._docId,
      updatedAt: serverTimestamp(),
    });
  }

  async function persistProgram(program) {
    if (!canWriteCloud()) return;
    const { dbRef, set, serverTimestamp } = firebaseState.modules;
    program._docId = program._docId || slugify(program.name);
    await set(dbRef(firebaseState.db, `programs/${program._docId}`), {
      ...archiveProgram(program),
      _docId: program._docId,
      updatedAt: serverTimestamp(),
    });
  }

  async function persistCurriculumRow(row) {
    if (!canWriteCloud()) return;
    const { dbRef, set, serverTimestamp } = firebaseState.modules;
    row._docId = row._docId || curriculumDocId(row, state.curriculum.indexOf(row));
    await set(dbRef(firebaseState.db, `curriculumRows/${row._docId}`), {
      ...archiveCurriculumRow(row),
      _docId: row._docId,
      updatedAt: serverTimestamp(),
    });
  }

  async function removeCurriculumRow(row) {
    if (!canWriteCloud() || !row?._docId) return;
    const { dbRef, remove } = firebaseState.modules;
    await remove(dbRef(firebaseState.db, `curriculumRows/${row._docId}`));
  }

  async function removeProgram(programName) {
    if (!state.admin) return;
    const program = programs().find((item) => item.name === programName);
    if (!program) return;
    const count = state.curriculum.filter((row) => row.program === programName).length;
    const confirmed = await confirmAction({
      eyebrow: "Programs",
      title: "Remove Program",
      message: `Remove "${programName}" and ${count} requirement row(s)?`,
      confirmText: "Remove",
    });
    if (!confirmed) return;

    state.programRecords = state.programRecords.filter((item) => item.name !== programName);
    const removedRows = state.curriculum.filter((row) => row.program === programName);
    state.curriculum = state.curriculum.filter((row) => row.program !== programName);

    if (canWriteCloud()) {
      const { dbRef, remove } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `programs/${program._docId}`));
      await Promise.all(removedRows.map((row) => row._docId ? remove(dbRef(firebaseState.db, `curriculumRows/${row._docId}`)) : Promise.resolve()));
    }

    state.selectedProgram = programs()[0]?.name || "";
    render();
  }

  async function uploadProgramAttachments(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    handleProgramAttachmentFiles(files);
  }

  async function handleProgramAttachmentFiles(files) {
    if (!files.length || !state.admin || !state.selectedProgram) return;

    setCloudStatus(`Uploading ${files.length} file(s)`);
    try {
      if (!canWriteCloud() || !firebaseState.storage) {
        files.forEach((file) => {
          attachmentState.records.push(normalizeAttachments([{
            _docId: slugify(`${state.selectedProgram}-${file.name}-${Date.now()}`),
            ownerType: "program",
            ownerName: state.selectedProgram,
            name: file.name,
            size: file.size,
            contentType: file.type,
            downloadURL: "",
            storagePath: "",
            uploadedBy: "local-preview",
          }])[0]);
        });
        setCloudStatus("Attachment preview added locally");
        renderProgramPanel("attachments");
        return;
      }

      const { dbRef, set, serverTimestamp, storageRef, uploadBytesResumable, getDownloadURL } = firebaseState.modules;
      const uploadedAttachments = await Promise.all(files.map(async (file) => {
        const docId = slugify(`${state.selectedProgram}-${file.name}-${Date.now()}`);
        const storagePath = `attachments/programs/${slugify(state.selectedProgram)}/${docId}-${file.name}`;
        const fileRef = storageRef(firebaseState.storage, storagePath);
        await uploadTaskWithTimeout(uploadBytesResumable(fileRef, file), 30000);
        const downloadURL = await getDownloadURL(fileRef);
        const attachment = {
          _docId: docId,
          ownerType: "program",
          ownerName: state.selectedProgram,
          name: file.name,
          size: file.size,
          contentType: file.type,
          storagePath,
          downloadURL,
          uploadedBy: firebaseState.user?.uid || "",
        };
        await set(dbRef(firebaseState.db, `attachments/${docId}`), {
          ...archiveAttachment(attachment),
          _docId: docId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return attachment;
      }));
      attachmentState.records = normalizeAttachments([
        ...attachmentState.records.filter((item) => !uploadedAttachments.some((attachment) => attachment._docId === item._docId)),
        ...uploadedAttachments,
      ]);
      setCloudStatus(`Uploaded ${files.length} file(s)`);
      renderProgramPanel("attachments");
    } catch (error) {
      console.warn("Attachment upload failed.", error);
      setCloudStatus(`Upload failed: ${firebaseErrorMessage(error)}`);
    }
  }

  function uploadTaskWithTimeout(uploadTask, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error("Upload timed out. Check Firebase Storage setup, rules, or network connection."));
      }, timeoutMs);

      uploadTask.on("state_changed", null, (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }, () => {
        clearTimeout(timeoutId);
        resolve(uploadTask.snapshot);
      });
    });
  }

  async function removeAttachment(docId) {
    if (!state.admin || !docId) return;
    const attachment = attachmentState.records.find((item) => item._docId === docId);
    if (!attachment) return;
    const confirmed = await confirmAction({
      eyebrow: "Attachments",
      title: "Remove Attachment",
      message: `Remove attachment "${attachment.name}"?`,
      confirmText: "Remove",
    });
    if (!confirmed) return;
    attachmentState.records = attachmentState.records.filter((item) => item._docId !== docId);

    if (canWriteCloud()) {
      const { dbRef, remove, deleteObject, storageRef } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `attachments/${docId}`));
      if (attachment.storagePath && firebaseState.storage) {
        await deleteObject(storageRef(firebaseState.storage, attachment.storagePath)).catch(() => {});
      }
    }
    renderProgramPanel("attachments");
  }

  function canWriteCloud() {
    return firebaseState.ready && firebaseState.user && state.admin;
  }

  function confirmAction({ eyebrow = "Confirm", title = "Confirm Action", message = "", confirmText = "Confirm" } = {}) {
    return new Promise((resolve) => {
      els.confirmEyebrow.textContent = eyebrow;
      els.confirmTitle.textContent = title;
      els.confirmMessage.textContent = message;
      els.confirmAccept.textContent = confirmText;

      const cleanup = (result) => {
        els.confirmCancel.removeEventListener("click", onCancel);
        els.confirmAccept.removeEventListener("click", onAccept);
        els.confirmDialog.removeEventListener("cancel", onNativeCancel);
        els.confirmDialog.removeEventListener("close", onClose);
        resolve(result);
      };
      const closeWith = (result) => {
        els.confirmDialog.returnValue = result ? "confirm" : "cancel";
        els.confirmDialog.close();
      };
      const onCancel = () => closeWith(false);
      const onAccept = () => closeWith(true);
      const onNativeCancel = (event) => {
        event.preventDefault();
        closeWith(false);
      };
      const onClose = () => cleanup(els.confirmDialog.returnValue === "confirm");

      els.confirmCancel.addEventListener("click", onCancel);
      els.confirmAccept.addEventListener("click", onAccept);
      els.confirmDialog.addEventListener("cancel", onNativeCancel);
      els.confirmDialog.addEventListener("close", onClose, { once: true });
      els.confirmDialog.showModal();
      setTimeout(() => els.confirmCancel.focus(), 0);
    });
  }

  function setCloudStatus(message) {
    if (els.firebaseStatus) els.firebaseStatus.textContent = message;
  }

  function firebaseErrorMessage(error) {
    if (error?.code === "auth/invalid-credential") return "Firebase rejected that email/password.";
    if (error?.code === "permission-denied" || error?.code === "PERMISSION_DENIED") return "Realtime Database denied that action. Check the admins UID record.";
    return error?.message || "Firebase sign-in failed.";
  }

  function archiveCourse(course) {
    return {
      id: course.id || "",
      credit: course.credit || "",
      name: course.name || "",
      comment: course.comment || "",
      status: course.status || "Active",
    };
  }

  function archiveCurriculumRow(row) {
    return {
      section: row.section || "",
      program: row.program || "",
      courseLabel: row.courseLabel || "",
      courseId: row.courseId || "",
      credit: row.credit || "",
      comment: row.comment || "",
      status: row.status || "Active",
      type: row.type || "Required",
      order: Number(row.order || 0),
    };
  }

  function archiveProgram(program) {
    return {
      section: program.section || "",
      name: program.name || "",
      code: program.code || programCode(program.name, program.section),
      status: program.status || "Active",
      version: program.version || "v1.0",
      description: program.description || "",
      notes: program.notes || "",
    };
  }

  function archiveAttachment(attachment) {
    return {
      ownerType: attachment.ownerType || "program",
      ownerName: attachment.ownerName || "",
      name: attachment.name || "",
      size: Number(attachment.size || 0),
      contentType: attachment.contentType || "",
      storagePath: attachment.storagePath || "",
      downloadURL: attachment.downloadURL || "",
      uploadedBy: attachment.uploadedBy || "",
    };
  }

  function filteredCourses(filters = {}) {
    const section = filters.section || "all";
    const status = filters.status || "all";
    const search = filters.search ?? state.search;
    const sortKey = filters.sortKey || "name";
    const sortDirection = filters.sortDirection || "asc";
    return state.courses
      .filter((course) => state.selectedCredit === "all" || course.credit === state.selectedCredit)
      .filter((course) => status === "all" || (course.status || "Active") === status)
      .filter((course) => section === "all" || courseSections(course).includes(section))
      .filter((course) => !search || matchesText(course, search))
      .sort((a, b) => compareCourses(a, b, sortKey, sortDirection));
  }

  function compareCourses(a, b, key, direction = "asc") {
    const multiplier = direction === "desc" ? -1 : 1;
    const compare = (() => {
      if (key === "credit") {
        const creditCompare = Number(a.credit || 0) - Number(b.credit || 0);
        return creditCompare || naturalCompare(a.id, b.id) || naturalCompare(a.name, b.name);
      }
      if (key === "id") {
        return naturalCompare(a.id, b.id) || naturalCompare(a.name, b.name);
      }
      return naturalCompare(a.name, b.name) || naturalCompare(a.id, b.id);
    })();
    return compare * multiplier;
  }

  function naturalCompare(a, b) {
    return String(a || "").localeCompare(String(b || ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  function courseCatalogQuery() {
    return state.courseSearch || state.search;
  }

  function filteredPrograms() {
    return programs().filter((program) => state.selectedSection === "all" || program.section === state.selectedSection);
  }

  function curriculumForProgram(programName) {
    return state.curriculum.filter((row) => row.program === programName);
  }

  function curriculumRowsForCourse(course) {
    return state.curriculum.filter((row) => (
      (course.id && row.courseId === course.id)
      || (course.name && stripCredit(row.courseLabel) === course.name)
    ));
  }

  function credits() {
    return Array.from(new Set(state.courses.map((course) => course.credit).filter(Boolean)))
      .sort((a, b) => Number(a) - Number(b));
  }

  function statuses() {
    return Array.from(new Set(state.courses.map((course) => course.status || "Active").filter(Boolean))).sort();
  }

  function courseSections(course) {
    return Array.from(new Set(curriculumRowsForCourse(course).map((row) => row.section).filter(Boolean)));
  }

  function archiveHealthReport() {
    const courseIds = new Map();
    const courseNames = new Set();

    state.courses.forEach((course) => {
      const id = String(course.id || "").trim();
      const name = String(course.name || "").trim();
      if (id) courseIds.set(id, (courseIds.get(id) || 0) + 1);
      if (name) courseNames.add(name);
    });

    const duplicateCourseIds = Array.from(courseIds.entries())
      .filter(([, count]) => count > 1)
      .map(([id, count]) => ({ id, count }));

    const orphanCurriculumRows = state.curriculum.filter((row) => {
      const id = String(row.courseId || "").trim();
      const name = stripCredit(row.courseLabel).trim();
      return (id || name) && !courseIds.has(id) && !courseNames.has(name);
    });

    return {
      blankCourses: state.courses.filter(isBlankCourse),
      duplicateCourseIds,
      orphanCurriculumRows,
    };
  }

  function isBlankCourse(course) {
    return !String(course.id || "").trim()
      && !String(course.name || "").trim()
      && !String(course.comment || "").trim();
  }

  function sections() {
    return Array.from(new Set([
      ...state.curriculum.map((row) => row.section),
      ...state.programRecords.map((program) => program.section),
    ].filter(Boolean))).sort();
  }

  function programs() {
    const seen = new Set();
    const list = state.programRecords.reduce((items, program) => {
      if (program.name && !seen.has(program.name)) {
        seen.add(program.name);
        items.push(program);
      }
      return items;
    }, []);
    return state.curriculum.reduce((items, row) => {
      if (row.program && !seen.has(row.program)) {
        seen.add(row.program);
        items.push(normalizePrograms([{ name: row.program, section: row.section }])[0]);
      }
      return items;
    }, list).sort((a, b) => a.name.localeCompare(b.name));
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

  function programDescription(program, section) {
    const saved = String(program?.description || "").trim();
    if (saved) return saved;
    const programSection = section || program?.section || "natural health";
    return `A comprehensive curriculum in ${programSection.toLowerCase()} principles and practices, with course requirements maintained from the live New Eden archive.`;
  }

  function normalizeCourses(courses) {
    return courses.map((course) => ({
      _docId: course._docId || course.id || slugify(course.name),
      id: course.id || "",
      credit: course.credit || "",
      name: course.name || "",
      comment: course.comment || "",
      status: course.status || "Active",
    }));
  }

  function normalizeCurriculum(rows) {
    return rows.map((row, index) => ({
      _docId: row._docId || curriculumDocId(row, index),
      section: row.section || "",
      program: row.program || "",
      courseLabel: row.courseLabel || "",
      courseId: row.courseId || "",
      credit: row.credit || "",
      comment: row.comment || "",
      status: row.status || "Active",
      type: row.type || "Required",
      order: Number(row.order || index + 1),
    }));
  }

  function buildProgramRecords(rows) {
    const seen = new Set();
    return (rows || []).reduce((items, row) => {
      if (row.program && !seen.has(row.program)) {
        seen.add(row.program);
        items.push({ section: row.section || "", name: row.program });
      }
      return items;
    }, []);
  }

  function normalizePrograms(programs) {
    return (programs || []).map((program) => ({
      _docId: program._docId || slugify(program.name),
      section: program.section || "",
      name: program.name || "",
      code: program.code || programCode(program.name, program.section),
      status: program.status || "Active",
      version: program.version || "v1.0",
      description: program.description || "",
      notes: program.notes || "",
    })).filter((program) => program.name);
  }

  function normalizeAttachments(attachments) {
    return (attachments || []).map((attachment) => ({
      _docId: attachment._docId || slugify(`${attachment.ownerName || "attachment"}-${attachment.name || Date.now()}`),
      ownerType: attachment.ownerType || "program",
      ownerName: attachment.ownerName || "",
      name: attachment.name || "",
      size: Number(attachment.size || 0),
      contentType: attachment.contentType || "",
      storagePath: attachment.storagePath || "",
      downloadURL: attachment.downloadURL || "",
      uploadedBy: attachment.uploadedBy || "",
    })).filter((attachment) => attachment.name);
  }

  function attachmentsForProgram(programName) {
    return attachmentState.records.filter((attachment) => attachment.ownerType === "program" && attachment.ownerName === programName);
  }

  function activeProgramTab() {
    return Array.from(els.programTabs).find((tab) => tab.classList.contains("active"))?.dataset.programTab || "overview";
  }

  function formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (!value) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
    return `${(value / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  }

  function curriculumDocId(row, index) {
    return slugify(`${row.section || "section"}-${row.program || "program"}-${row.courseId || row.courseLabel || "course"}-${index}`);
  }

  function slugify(value) {
    return String(value || "record")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "record";
  }

  function initials(name) {
    return String(name || "NE")
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NE";
  }

  function matchesSearch(item) {
    if (!state.search) return true;
    return matchesText(item, state.search);
  }

  function matchesText(item, query) {
    return Object.values(item).some((value) => String(value || "").toLowerCase().includes(query));
  }

  function highlight(value, query = state.search) {
    const text = escapeHtml(value || "");
    if (!query) return text;
    const escapedSearch = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
})();
