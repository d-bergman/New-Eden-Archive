(function () {
  const source = window.NEW_EDEN_DATA || {};
  const firebaseConfig = window.NEW_EDEN_FIREBASE_CONFIG;
  const firebaseVersion = "12.13.0";
  const firebaseDisabled = new URLSearchParams(window.location.search).has("nofirebase");
  const snapshotKey = "new-eden-archive-local-snapshot";
  const adminKey = "new-eden-admin-preview";
  const saved = readSnapshot();
  const firebaseState = {
    ready: false,
    user: null,
    profile: null,
    modules: null,
    app: null,
    auth: null,
    db: null,
    unsubscribers: [],
  };

  const state = {
    courses: normalizeCourses(saved?.courses || structuredClone(source.courses || [])),
    curriculum: normalizeCurriculum(saved?.curriculum || structuredClone(source.curriculum || [])),
    programRecords: normalizePrograms(saved?.programRecords || buildProgramRecords(saved?.curriculum || source.curriculum || [])),
    versionHistory: saved?.versionHistory || structuredClone(source.versionHistory || []),
    search: "",
    view: "overview",
    selectedCredit: "all",
    selectedSection: "all",
    selectedProgram: "",
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
    saveSnapshot: document.querySelector("#saveSnapshot"),
    firebaseStatus: document.querySelector("#firebaseStatus"),
    syncFirebase: document.querySelector("#syncFirebase"),
    signOutButton: document.querySelector("#signOutButton"),
    userInitials: document.querySelector("#userInitials"),
    userName: document.querySelector("#userName"),
    userRole: document.querySelector("#userRole"),
    overviewCreditFilter: document.querySelector("#overviewCreditFilter"),
    overviewCourses: document.querySelector("#overviewCourses"),
    overviewCourseTotal: document.querySelector("#overviewCourseTotal"),
    featuredProgram: document.querySelector("#featuredProgram"),
    featuredProgramDetail: document.querySelector("#featuredProgramDetail"),
    courseCreditFilter: document.querySelector("#courseCreditFilter"),
    courseRows: document.querySelector("#courseRows"),
    addCourse: document.querySelector("#addCourse"),
    addCourseCatalog: document.querySelector("#addCourseCatalog"),
    addProgram: document.querySelector("#addProgram"),
    editProgramButton: document.querySelector("#editProgramButton"),
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

    els.syncFirebase.addEventListener("click", seedFirestore);

    els.saveSnapshot.addEventListener("click", () => {
      localStorage.setItem(snapshotKey, JSON.stringify({
        courses: state.courses,
        curriculum: state.curriculum,
        programRecords: state.programRecords,
        versionHistory: state.versionHistory,
      }));
      els.saveSnapshot.textContent = "Saved";
      setTimeout(() => { els.saveSnapshot.textContent = "Save Local Snapshot"; }, 1200);
    });

    els.addCourse.addEventListener("click", () => openCourseEditor());
    els.addCourseCatalog.addEventListener("click", () => openCourseEditor());
    els.addProgramCourse.addEventListener("click", () => openCurriculumEditor());
    els.addProgram.addEventListener("click", () => openProgramEditor());
    els.editProgramButton.addEventListener("click", () => openProgramEditor(state.selectedProgram));
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
    els.body.classList.toggle("auth-locked", !state.signedIn);
    els.body.classList.toggle("is-admin", state.admin);
    els.adminState.textContent = state.admin ? "Admin" : state.signedIn ? "Viewer" : "Sign In";
    els.adminToggle.querySelector("span").textContent = state.signedIn ? "Sign Out" : "Sign In";
    document.querySelector("#adminStatusButton i").className = state.admin ? "bi bi-unlock" : "bi bi-lock";
    els.syncFirebase.disabled = !firebaseState.ready || !firebaseState.user;
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

    openEditor(existing ? "Edit Program" : "Add Program", [
      field("section", "Section", program.section, "select", sections()),
      field("name", "Program Name", program.name),
      field("code", "Program Code", program.code || programCode(program.name, program.section)),
      field("status", "Status", program.status || "Active", "select", ["Active", "Inactive", "Archived"]),
      field("version", "Version", program.version || "v1.0"),
      field("description", "Description", program.description || "", "textarea"),
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
      setCloudStatus("Cloud disabled for test");
      render();
      return;
    }
    if (!firebaseConfig) {
      setCloudStatus("Cloud config missing");
      return;
    }

    try {
      setCloudStatus("Cloud connecting");
      const [appModule, authModule, firestoreModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-firestore.js`),
      ]);

      firebaseState.modules = { ...appModule, ...authModule, ...firestoreModule };
      firebaseState.app = appModule.initializeApp(firebaseConfig);
      firebaseState.auth = authModule.getAuth(firebaseState.app);
      firebaseState.db = firestoreModule.getFirestore(firebaseState.app);
      firebaseState.ready = true;
      setCloudStatus("Cloud ready");

      authModule.onAuthStateChanged(firebaseState.auth, async (user) => {
        firebaseState.user = user;
        firebaseState.profile = null;
        sessionStorage.removeItem(adminKey);
        if (!user) {
          stopFirestoreListeners();
          state.signedIn = false;
          state.admin = false;
          setCloudStatus("Cloud ready");
          render();
          return;
        }

        state.signedIn = true;
        state.admin = false;
        els.signInMessage.textContent = "Signed in.";
        render();

        try {
          const [adminSnap, profileSnap] = await Promise.all([
            firestoreModule.getDoc(firestoreModule.doc(firebaseState.db, "admins", user.uid)),
            firestoreModule.getDoc(firestoreModule.doc(firebaseState.db, "users", user.uid)),
          ]);
          firebaseState.profile = profileSnap.exists() ? profileSnap.data() : null;
          state.admin = adminSnap.exists() || firebaseState.profile?.role === "admin";
          setCloudStatus(state.admin ? `Cloud admin: ${user.email}` : `Cloud viewer: ${user.email}`);
          startFirestoreListeners();
        } catch (error) {
          console.warn("Signed in, but role/profile lookup failed.", error);
          setCloudStatus(`Signed in; Firestore setup needed`);
        }
        render();
      });
    } catch (error) {
      console.warn("Firebase unavailable; using local workbook data.", error);
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
    stopFirestoreListeners();
    if (!firebaseDisabled) state.signedIn = false;
    state.admin = false;
    firebaseState.user = null;
    firebaseState.profile = null;
    sessionStorage.removeItem(adminKey);
    render();
  }

  async function loadFirestoreData() {
    if (!firebaseState.ready) return;
    const { collection, getDocs, orderBy, query } = firebaseState.modules;
    const db = firebaseState.db;
    const [courseSnap, programSnap, curriculumSnap, versionSnap] = await Promise.all([
      getDocs(query(collection(db, "courses"), orderBy("name"))),
      getDocs(query(collection(db, "programs"), orderBy("name"))),
      getDocs(collection(db, "curriculumRows")),
      getDocs(collection(db, "versionHistory")),
    ]);

    if (courseSnap.size) {
      state.courses = normalizeCourses(courseSnap.docs.map((docSnap) => ({ _docId: docSnap.id, ...docSnap.data() })));
    }
    if (programSnap.size) {
      state.programRecords = normalizePrograms(programSnap.docs.map((docSnap) => ({ _docId: docSnap.id, ...docSnap.data() })));
    }
    if (curriculumSnap.size) {
      state.curriculum = normalizeCurriculum(curriculumSnap.docs.map((docSnap) => ({ _docId: docSnap.id, ...docSnap.data() })));
    }
    if (versionSnap.size) {
      state.versionHistory = versionSnap.docs.map((docSnap) => docSnap.data());
    }
  }

  function startFirestoreListeners() {
    if (!firebaseState.ready) return;
    stopFirestoreListeners();
    const { collection, onSnapshot, orderBy, query } = firebaseState.modules;
    const db = firebaseState.db;

    firebaseState.unsubscribers.push(onSnapshot(query(collection(db, "courses"), orderBy("name")), (snapshot) => {
      if (!snapshot.size) return;
      state.courses = normalizeCourses(snapshot.docs.map((docSnap) => ({ _docId: docSnap.id, ...docSnap.data() })));
      render();
    }));

    firebaseState.unsubscribers.push(onSnapshot(query(collection(db, "programs"), orderBy("name")), (snapshot) => {
      if (!snapshot.size) return;
      state.programRecords = normalizePrograms(snapshot.docs.map((docSnap) => ({ _docId: docSnap.id, ...docSnap.data() })));
      render();
    }));

    firebaseState.unsubscribers.push(onSnapshot(collection(db, "curriculumRows"), (snapshot) => {
      if (!snapshot.size) return;
      state.curriculum = normalizeCurriculum(snapshot.docs.map((docSnap) => ({ _docId: docSnap.id, ...docSnap.data() })));
      render();
    }));

    firebaseState.unsubscribers.push(onSnapshot(collection(db, "versionHistory"), (snapshot) => {
      if (!snapshot.size) return;
      state.versionHistory = snapshot.docs.map((docSnap) => docSnap.data());
      render();
    }));
  }

  function stopFirestoreListeners() {
    firebaseState.unsubscribers.forEach((unsubscribe) => unsubscribe());
    firebaseState.unsubscribers = [];
  }

  async function seedFirestore() {
    if (!firebaseState.ready || !firebaseState.user || !state.admin) return;
    if (!confirm("Upload the current workbook data to Firestore? This will overwrite matching course and curriculum documents.")) return;

    const { writeBatch, doc, serverTimestamp } = firebaseState.modules;
    const db = firebaseState.db;
    const batches = [];
    let batch = writeBatch(db);
    let writes = 0;

    const queueSet = (ref, data) => {
      batch.set(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      writes += 1;
      if (writes % 450 === 0) {
        batches.push(batch.commit());
        batch = writeBatch(db);
      }
    };

    state.courses.forEach((course) => queueSet(doc(db, "courses", course._docId), firestoreCourse(course)));
    programs().forEach((program) => queueSet(doc(db, "programs", program._docId), firestoreProgram(program)));
    state.curriculum.forEach((row) => queueSet(doc(db, "curriculumRows", row._docId), firestoreCurriculumRow(row)));
    state.versionHistory.forEach((item, index) => queueSet(doc(db, "versionHistory", slugify(`${item.version || "version"}-${index}`)), item));

    batches.push(batch.commit());
    setCloudStatus("Cloud seeding");
    await Promise.all(batches);
    setCloudStatus(`Cloud seeded ${writes} records`);
  }

  async function persistCourse(course) {
    if (!canWriteCloud()) return;
    const { doc, setDoc, serverTimestamp } = firebaseState.modules;
    await setDoc(doc(firebaseState.db, "courses", course._docId || course.id), {
      ...firestoreCourse(course),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async function persistProgram(program) {
    if (!canWriteCloud()) return;
    const { doc, setDoc, serverTimestamp } = firebaseState.modules;
    await setDoc(doc(firebaseState.db, "programs", program._docId || slugify(program.name)), {
      ...firestoreProgram(program),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async function persistCurriculumRow(row) {
    if (!canWriteCloud()) return;
    const { doc, setDoc, serverTimestamp } = firebaseState.modules;
    row._docId = row._docId || curriculumDocId(row, state.curriculum.indexOf(row));
    await setDoc(doc(firebaseState.db, "curriculumRows", row._docId), {
      ...firestoreCurriculumRow(row),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async function removeCurriculumRow(row) {
    if (!canWriteCloud() || !row?._docId) return;
    const { deleteDoc, doc } = firebaseState.modules;
    await deleteDoc(doc(firebaseState.db, "curriculumRows", row._docId));
  }

  async function removeProgram(programName) {
    if (!state.admin) return;
    const program = programs().find((item) => item.name === programName);
    if (!program) return;
    const count = state.curriculum.filter((row) => row.program === programName).length;
    if (!confirm(`Remove "${programName}" and ${count} requirement row(s)?`)) return;

    state.programRecords = state.programRecords.filter((item) => item.name !== programName);
    const removedRows = state.curriculum.filter((row) => row.program === programName);
    state.curriculum = state.curriculum.filter((row) => row.program !== programName);

    if (canWriteCloud()) {
      const { deleteDoc, doc } = firebaseState.modules;
      await deleteDoc(doc(firebaseState.db, "programs", program._docId));
      await Promise.all(removedRows.map((row) => row._docId ? deleteDoc(doc(firebaseState.db, "curriculumRows", row._docId)) : Promise.resolve()));
    }

    state.selectedProgram = programs()[0]?.name || "";
    render();
  }

  function canWriteCloud() {
    return firebaseState.ready && firebaseState.user && state.admin;
  }

  function setCloudStatus(message) {
    if (els.firebaseStatus) els.firebaseStatus.textContent = message;
  }

  function firebaseErrorMessage(error) {
    if (error?.code === "auth/invalid-credential") return "Firebase rejected that email/password.";
    if (error?.code === "permission-denied") return "Firestore denied that action. Check the admins UID document.";
    return error?.message || "Firebase sign-in failed.";
  }

  function firestoreCourse(course) {
    return {
      id: course.id || "",
      credit: course.credit || "",
      name: course.name || "",
      comment: course.comment || "",
      status: course.status || "Active",
    };
  }

  function firestoreCurriculumRow(row) {
    return {
      section: row.section || "",
      program: row.program || "",
      courseLabel: row.courseLabel || "",
      courseId: row.courseId || "",
      credit: row.credit || "",
      comment: row.comment || "",
      status: row.status || "Active",
    };
  }

  function firestoreProgram(program) {
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
