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
  const appVersion = "1.7.4";
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
    functions: null,
    presenceRef: null,
    unsubscribers: [],
    hasCloudArchive: false,
  };
  const attachmentState = {
    records: [],
    activeProgram: "",
  };
  const fileManagerState = {
    records: [],
    selectedFiles: [],
    selectedCourseIds: [],
    editingFileId: "",
    courseSearch: "",
    search: "",
    page: 1,
    rowsPerPage: 10,
    emailSelectedFileIds: [],
    emailPickerSelectedIds: [],
    emailSearch: "",
    emailCurriculum: "",
  };
  const defaultStudentEmailTemplate = {
    _docId: "course-materials",
    name: "Course Materials",
    subject: "Requested New Eden Course Materials",
    bodyMarkdown: `Hello,

Your requested New Eden course material files are attached.

Please contact the school office if you need anything else.`,
  };
  const defaultAppSettings = {
    transcriptFilenameFormat: "LastName_FirstName_Transcript_YYYY-MM-DD.pdf",
    backupDestination: "OneDrive integration pending",
  };
  const storageCorsOrigins = [
    "localhost",
    "127.0.0.1",
    "new-eden-archive.web.app",
    "new-eden-archive.firebaseapp.com",
    "d-bergman.github.io",
  ];
  const emailTemplateState = {
    templates: [{ ...defaultStudentEmailTemplate }],
    activeTemplateId: "course-materials",
    editorTemplateId: "course-materials",
  };
  const requirementBuilder = {
    programName: "",
    rows: [],
    search: "",
  };
  const curriculumBuilder = {
    rows: [],
    search: "",
  };
  const programBuilder = {
    originalName: "",
    name: "",
    status: "Active",
    description: "",
    notes: "",
    curriculums: [],
    search: "",
  };
  const staffDirectory = [
    { uid: "staff:darren", name: "Darren" },
    { uid: "staff:bhumika", name: "Bhumika" },
    { uid: "staff:donna", name: "Donna" },
    { uid: "staff:larry", name: "Larry" },
    { uid: "staff:dr-duda", name: "Dr. Duda" },
  ];
  const contributionRanks = [
  { level: 1, title: "New Member", xp: 0, color: "#6B7280" },
  { level: 2, title: "Contributor", xp: 100, color: "#2E7D32" },
  { level: 3, title: "Regular Contributor", xp: 250, color: "#1B8A4B" },
  { level: 4, title: "Active Contributor", xp: 500, color: "#006B4F" },

  { level: 5, title: "Editor", xp: 1000, color: "#4F46E5" },
  { level: 6, title: "Senior Editor", xp: 1750, color: "#4338CA" },
  { level: 7, title: "Content Curator", xp: 2750, color: "#7C3AED" },
  { level: 8, title: "Senior Curator", xp: 4000, color: "#9333EA" },

  { level: 9, title: "Archivist", xp: 5750, color: "#A97142" },
  { level: 10, title: "Senior Archivist", xp: 8000, color: "#B87333" },
  { level: 11, title: "Knowledge Steward", xp: 11000, color: "#C98910" },
  { level: 12, title: "Documentation Specialist", xp: 15000, color: "#D4A017" },

  { level: 13, title: "Knowledge Manager", xp: 20000, color: "#C96C8A" },
  { level: 14, title: "Archive Manager", xp: 26000, color: "#B04E78" },
  { level: 15, title: "Archive Authority", xp: 33000, color: "#9A4DCC" },
  { level: 16, title: "Senior Authority", xp: 42000, color: "#8B5CF6" },

  { level: 17, title: "Knowledge Authority", xp: 53000, color: "#007A5E" },
  { level: 18, title: "Archive Sage", xp: 67000, color: "#2563EB" },
  { level: 19, title: "Master Curator", xp: 84000, color: "#B8860B" },
  { level: 20, title: "Archive Legend", xp: 105000, color: "#D4AF37" },
  ];

  const state = {
    courses: [],
    curriculum: [],
    programCategories: [],
    programRecords: [],
    versionHistory: [],
    activityLog: [],
    notices: [],
    tasks: [],
    transcriptDrafts: [],
    backupHistory: [],
    emailDeliveries: [],
    appSettings: { ...defaultAppSettings },
    directoryUsers: [],
    transcriptRows: [],
    transcriptCourseSearch: "",
    transcriptSelectedProgram: "",
    activeTranscriptDraftId: "",
    search: "",
    activityLogSearch: "",
    view: "overview",
    selectedCredit: "all",
    selectedSection: "all",
    selectedOverviewSection: "all",
    selectedStatus: "all",
    selectedProgram: "",
    selectedProgramCategory: "",
    courseSearch: "",
    courseSortKey: "id",
    courseSortDirection: "asc",
    overviewPage: 1,
    overviewActivityPage: 1,
    overviewRowsPerPage: 10,
    historyPage: 1,
    historyRowsPerPage: 6,
    achievementPages: {
      unlocked: 1,
      locked: 1,
    },
    emailFileCategory: "all",
    guideTopic: "overview",
    maintenanceCheck: "",
    toastId: 0,
    coursePage: 1,
    courseRowsPerPage: 10,
    requirementSearch: "",
    requirementCredit: "all",
    requirementSortKey: "courseId",
    requirementSortDirection: "asc",
    changelogEntries: [],
    connectedUsers: [],
    knownNoticeIds: new Set(),
    knownTaskStates: new Map(),
    notificationsReady: false,
    knownContributionLevels: new Map(),
    knownAchievements: new Map(),
    contributionNotificationsReady: false,
    signedIn: firebaseDisabled,
    authChecking: true,
    admin: sessionStorage.getItem(adminKey) === "true",
    adminEligible: sessionStorage.getItem(adminKey) === "true",
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
    profileSettingsNav: document.querySelector("#profileSettingsNav"),
    sidebarRankCard: document.querySelector("#sidebarRankCard"),
    adminDialog: document.querySelector("#adminDialog"),
    adminEmail: document.querySelector("#adminEmail"),
    adminPassword: document.querySelector("#adminPassword"),
    confirmAdmin: document.querySelector("#confirmAdmin"),
    firebaseStatus: document.querySelector("#firebaseStatus"),
    liveSyncStatus: document.querySelector("#liveSyncStatus"),
    connectedUsers: document.querySelector("#connectedUsers"),
    appVersion: document.querySelector("#appVersion"),
    appLoader: document.querySelector("#appLoader"),
    userChip: document.querySelector("#userChip"),
    signOutButton: document.querySelector("#signOutButton"),
    userInitials: document.querySelector("#userInitials"),
    userAvatarImage: document.querySelector("#userAvatarImage"),
    userName: document.querySelector("#userName"),
    userRole: document.querySelector("#userRole"),
    overviewSectionFilter: document.querySelector("#overviewSectionFilter"),
    overviewCreditFilter: document.querySelector("#overviewCreditFilter"),
    statusFilter: document.querySelector("#statusFilter"),
    overviewCourses: document.querySelector("#overviewCourses"),
    overviewCourseTotal: document.querySelector("#overviewCourseTotal"),
    overviewPagination: document.querySelector("#overviewPagination"),
    overviewRowsPerPage: document.querySelector("#overviewRowsPerPage"),
    overviewActivityList: document.querySelector("#overviewActivityList"),
    overviewActivityPagination: document.querySelector("#overviewActivityPagination"),
    overviewAttentionList: document.querySelector("#overviewAttentionList"),
    overviewTasksList: document.querySelector("#overviewTasksList"),
    overviewNoticesList: document.querySelector("#overviewNoticesList"),
    overviewHealthList: document.querySelector("#overviewHealthList"),
    overviewDraftList: document.querySelector("#overviewDraftList"),
    overviewTrendCards: document.querySelector("#overviewTrendCards"),
    overviewUserStatusList: document.querySelector("#overviewUserStatusList"),
    overviewContributionList: document.querySelector("#overviewContributionList"),
    overviewGamificationList: document.querySelector("#overviewGamificationList"),
    progressInfoButton: document.querySelector("#progressInfoButton"),
    progressInfoDialog: document.querySelector("#progressInfoDialog"),
    progressInfoContent: document.querySelector("#progressInfoContent"),
    featuredProgramDetail: document.querySelector("#featuredProgramDetail"),
    courseCreditFilter: document.querySelector("#courseCreditFilter"),
    courseCatalogSearch: document.querySelector("#courseCatalogSearch"),
    courseCatalogSummary: document.querySelector("#courseCatalogSummary"),
    courseCatalogPageSummary: document.querySelector("#courseCatalogPageSummary"),
    courseCatalogPagination: document.querySelector("#courseCatalogPagination"),
    courseCatalogRowsPerPage: document.querySelector("#courseCatalogRowsPerPage"),
    courseRows: document.querySelector("#courseRows"),
    addCourse: document.querySelector("#addCourse"),
    addCourseCatalog: document.querySelector("#addCourseCatalog"),
    addCurriculum: document.querySelector("#addCurriculum"),
    addProgram: document.querySelector("#addProgram"),
    helpButton: document.querySelector("#helpButton"),
    helpDialog: document.querySelector("#helpDialog"),
    guideTopicGrid: document.querySelector("#guideTopicGrid"),
    guideContent: document.querySelector("#guideContent"),
    toastStack: document.querySelector("#toastStack"),
    noticeBanner: document.querySelector("#noticeBanner"),
    activityLogSearch: document.querySelector("#activityLogSearch"),
    activityLogRows: document.querySelector("#activityLogRows"),
    noticeForm: document.querySelector("#noticeForm"),
    noticeMessage: document.querySelector("#noticeMessage"),
    noticeList: document.querySelector("#noticeList"),
    taskForm: document.querySelector("#taskForm"),
    taskTitle: document.querySelector("#taskTitle"),
    taskAssignee: document.querySelector("#taskAssignee"),
    taskDescription: document.querySelector("#taskDescription"),
    taskList: document.querySelector("#taskList"),
    backupLastDatabase: document.querySelector("#backupLastDatabase"),
    backupLastFiles: document.querySelector("#backupLastFiles"),
    backupLastFull: document.querySelector("#backupLastFull"),
    backupStatus: document.querySelector("#backupStatus"),
    backupDestination: document.querySelector("#backupDestination"),
    runDatabaseBackup: document.querySelector("#runDatabaseBackup"),
    runFileBackup: document.querySelector("#runFileBackup"),
    runFullBackup: document.querySelector("#runFullBackup"),
    backupHistoryRows: document.querySelector("#backupHistoryRows"),
    systemHealthGrid: document.querySelector("#systemHealthGrid"),
    healthLastCheck: document.querySelector("#healthLastCheck"),
    healthEnvironment: document.querySelector("#healthEnvironment"),
    corsOriginList: document.querySelector("#corsOriginList"),
    emailDispatchSummary: document.querySelector("#emailDispatchSummary"),
    recentDeliveryList: document.querySelector("#recentDeliveryList"),
    failedDeliveryList: document.querySelector("#failedDeliveryList"),
    testEmailForm: document.querySelector("#testEmailForm"),
    testEmailAddress: document.querySelector("#testEmailAddress"),
    testEmailError: document.querySelector("#testEmailError"),
    sendTestEmailButton: document.querySelector("#sendTestEmailButton"),
    maintenanceResults: document.querySelector("#maintenanceResults"),
    appSettingsForm: document.querySelector("#appSettingsForm"),
    transcriptFilenameFormat: document.querySelector("#transcriptFilenameFormat"),
    addManagedFile: document.querySelector("#addManagedFile"),
    fileManagerSearch: document.querySelector("#fileManagerSearch"),
    fileManagerRows: document.querySelector("#fileManagerRows"),
    fileManagerPageSummary: document.querySelector("#fileManagerPageSummary"),
    fileManagerPagination: document.querySelector("#fileManagerPagination"),
    fileSendForm: document.querySelector("#fileSendForm"),
    studentEmail: document.querySelector("#studentEmail"),
    studentEmailError: document.querySelector("#studentEmailError"),
    editEmailTemplates: document.querySelector("#editEmailTemplates"),
    emailTemplateSelect: document.querySelector("#emailTemplateSelect"),
    emailTemplateEditorSelect: document.querySelector("#emailTemplateEditorSelect"),
    addEmailTemplate: document.querySelector("#addEmailTemplate"),
    deleteEmailTemplate: document.querySelector("#deleteEmailTemplate"),
    emailTemplateNameInput: document.querySelector("#emailTemplateNameInput"),
    emailSubjectInput: document.querySelector("#emailSubjectInput"),
    emailContentDialog: document.querySelector("#emailContentDialog"),
    emailContentForm: document.querySelector("#emailContentForm"),
    emailContentInput: document.querySelector("#emailContentInput"),
    saveEmailContent: document.querySelector("#saveEmailContent"),
    openFileSelector: document.querySelector("#openFileSelector"),
    selectedEmailFiles: document.querySelector("#selectedEmailFiles"),
    fileSendMessage: document.querySelector("#fileSendMessage"),
    transcriptProgram: document.querySelector("#transcriptProgram"),
    importTranscriptProgram: document.querySelector("#importTranscriptProgram"),
    transcriptCourseSearch: document.querySelector("#transcriptCourseSearch"),
    transcriptCoursePicker: document.querySelector("#transcriptCoursePicker"),
    transcriptCourseRows: document.querySelector("#transcriptCourseRows"),
    transcriptEmpty: document.querySelector("#transcriptEmpty"),
    transcriptTotalCredits: document.querySelector("#transcriptTotalCredits"),
    transcriptGpa: document.querySelector("#transcriptGpa"),
    transcriptStudentName: document.querySelector("#transcriptStudentName"),
    transcriptStudentId: document.querySelector("#transcriptStudentId"),
    transcriptDob: document.querySelector("#transcriptDob"),
    transcriptDobError: document.querySelector("#transcriptDobError"),
    transcriptFrom: document.querySelector("#transcriptFrom"),
    transcriptFromError: document.querySelector("#transcriptFromError"),
    transcriptTo: document.querySelector("#transcriptTo"),
    transcriptToError: document.querySelector("#transcriptToError"),
    transcriptCurriculumName: document.querySelector("#transcriptCurriculumName"),
    transcriptGraduated: document.querySelector("#transcriptGraduated"),
    printTranscript: document.querySelector("#printTranscript"),
    importTranscriptPdf: document.querySelector("#importTranscriptPdf"),
    transcriptPdfFile: document.querySelector("#transcriptPdfFile"),
    transcriptImportDialog: document.querySelector("#transcriptImportDialog"),
    importTranscriptFromComputer: document.querySelector("#importTranscriptFromComputer"),
    transcriptManagedImportList: document.querySelector("#transcriptManagedImportList"),
    transcriptSaveDialog: document.querySelector("#transcriptSaveDialog"),
    saveTranscriptToComputer: document.querySelector("#saveTranscriptToComputer"),
    saveTranscriptToFileManager: document.querySelector("#saveTranscriptToFileManager"),
    saveTranscriptBoth: document.querySelector("#saveTranscriptBoth"),
    saveTranscriptDraft: document.querySelector("#saveTranscriptDraft"),
    transcriptDraftList: document.querySelector("#transcriptDraftList"),
    clearTranscript: document.querySelector("#clearTranscript"),
    programCategoryFilter: document.querySelector("#programCategoryFilter"),
    editProgramButton: document.querySelector("#editProgramButton"),
    removeCurriculumButton: document.querySelector("#removeCurriculumButton"),
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
    programVersion: document.querySelector("#programVersion"),
    requiredCount: document.querySelector("#requiredCount"),
    programDirectory: document.querySelector("#programDirectory"),
    versionTimeline: document.querySelector("#versionTimeline"),
    versionPagination: document.querySelector("#versionPagination"),
    dataHealth: document.querySelector("#dataHealth"),
    programTabs: document.querySelectorAll("[data-program-tab]"),
    attachmentUpload: document.querySelector("#attachmentUpload"),
    attachmentDropZone: document.querySelector("#attachmentDropZone"),
    attachmentList: document.querySelector("#attachmentList"),
    editDialog: document.querySelector("#editDialog"),
    editForm: document.querySelector("#editForm"),
    editTitle: document.querySelector("#editTitle"),
    editFields: document.querySelector("#editFields"),
    editMessage: document.querySelector("#editMessage"),
    confirmEdit: document.querySelector("#confirmEdit"),
    curriculumBuilderDialog: document.querySelector("#curriculumBuilderDialog"),
    curriculumBuilderProgram: document.querySelector("#curriculumBuilderProgram"),
    curriculumBuilderName: document.querySelector("#curriculumBuilderName"),
    curriculumBuilderCode: document.querySelector("#curriculumBuilderCode"),
    curriculumBuilderStatus: document.querySelector("#curriculumBuilderStatus"),
    curriculumBuilderVersion: document.querySelector("#curriculumBuilderVersion"),
    curriculumBuilderDescription: document.querySelector("#curriculumBuilderDescription"),
    curriculumBuilderNotes: document.querySelector("#curriculumBuilderNotes"),
    curriculumBuilderCourseSearch: document.querySelector("#curriculumBuilderCourseSearch"),
    curriculumBuilderCoursePicker: document.querySelector("#curriculumBuilderCoursePicker"),
    curriculumBuilderSelectedRequirements: document.querySelector("#curriculumBuilderSelectedRequirements"),
    curriculumBuilderSelectedCount: document.querySelector("#curriculumBuilderSelectedCount"),
    saveCurriculumBuilder: document.querySelector("#saveCurriculumBuilder"),
    requirementsDialog: document.querySelector("#requirementsDialog"),
    requirementsForm: document.querySelector("#requirementsForm"),
    requirementsTitle: document.querySelector("#requirementsTitle"),
    requirementCourseSearch: document.querySelector("#requirementCourseSearch"),
    requirementCoursePicker: document.querySelector("#requirementCoursePicker"),
    selectedRequirements: document.querySelector("#selectedRequirements"),
    requirementSelectedCount: document.querySelector("#requirementSelectedCount"),
    saveRequirements: document.querySelector("#saveRequirements"),
    fileBuilderDialog: document.querySelector("#fileBuilderDialog"),
    fileBuilderForm: document.querySelector("#fileBuilderForm"),
    fileBuilderTitle: document.querySelector("#fileBuilderTitle"),
    managedFileInput: document.querySelector("#managedFileInput"),
    managedFilePreview: document.querySelector("#managedFilePreview"),
    managedFileCategory: document.querySelector("#managedFileCategory"),
    fileCourseSearch: document.querySelector("#fileCourseSearch"),
    fileCoursePicker: document.querySelector("#fileCoursePicker"),
    fileCourseSelectedCount: document.querySelector("#fileCourseSelectedCount"),
    fileSelectedCourses: document.querySelector("#fileSelectedCourses"),
    saveManagedFile: document.querySelector("#saveManagedFile"),
    fileSelectorDialog: document.querySelector("#fileSelectorDialog"),
    fileSelectorForm: document.querySelector("#fileSelectorForm"),
    emailFileSearch: document.querySelector("#emailFileSearch"),
    emailFileTypeFilter: document.querySelector("#emailFileTypeFilter"),
    emailFilePicker: document.querySelector("#emailFilePicker"),
    emailCurriculumFilter: document.querySelector("#emailCurriculumFilter"),
    emailCurriculumFiles: document.querySelector("#emailCurriculumFiles"),
    emailSelectedFileCount: document.querySelector("#emailSelectedFileCount"),
    emailSelectedFiles: document.querySelector("#emailSelectedFiles"),
    attachSelectedFiles: document.querySelector("#attachSelectedFiles"),
    programBuilderDialog: document.querySelector("#programBuilderDialog"),
    programBuilderForm: document.querySelector("#programBuilderForm"),
    programBuilderTitle: document.querySelector("#programBuilderTitle"),
    programBuilderName: document.querySelector("#programBuilderName"),
    programBuilderStatus: document.querySelector("#programBuilderStatus"),
    programBuilderDescription: document.querySelector("#programBuilderDescription"),
    programBuilderNotes: document.querySelector("#programBuilderNotes"),
    programBuilderCurriculumSearch: document.querySelector("#programBuilderCurriculumSearch"),
    programBuilderCurriculumPicker: document.querySelector("#programBuilderCurriculumPicker"),
    programBuilderCurriculumList: document.querySelector("#programBuilderCurriculumList"),
    programBuilderCurriculumCount: document.querySelector("#programBuilderCurriculumCount"),
    saveProgramBuilder: document.querySelector("#saveProgramBuilder"),
    confirmDialog: document.querySelector("#confirmDialog"),
    confirmEyebrow: document.querySelector("#confirmEyebrow"),
    confirmTitle: document.querySelector("#confirmTitle"),
    confirmMessage: document.querySelector("#confirmMessage"),
    confirmPasswordGroup: document.querySelector("#confirmPasswordGroup"),
    confirmPassword: document.querySelector("#confirmPassword"),
    confirmPasswordMessage: document.querySelector("#confirmPasswordMessage"),
    confirmCancel: document.querySelector("#confirmCancel"),
    confirmAccept: document.querySelector("#confirmAccept"),
    profileDialog: document.querySelector("#profileDialog"),
    profileForm: document.querySelector("#profileForm"),
    profileDisplayName: document.querySelector("#profileDisplayName"),
    profileEmail: document.querySelector("#profileEmail"),
    profilePhotoInput: document.querySelector("#profilePhotoInput"),
    profilePhotoButton: document.querySelector("#profilePhotoButton"),
    profileAvatarImage: document.querySelector("#profileAvatarImage"),
    profileAvatarInitials: document.querySelector("#profileAvatarInitials"),
    profileDarkMode: document.querySelector("#profileDarkMode"),
    profileShowRealtimeLoaded: document.querySelector("#profileShowRealtimeLoaded"),
    profileLandingPage: document.querySelector("#profileLandingPage"),
    profileMyTasksOnly: document.querySelector("#profileMyTasksOnly"),
    profileNotifyNotices: document.querySelector("#profileNotifyNotices"),
    profileNotifyTasks: document.querySelector("#profileNotifyTasks"),
    profileNotifyAchievements: document.querySelector("#profileNotifyAchievements"),
    profileNotifyLevelUps: document.querySelector("#profileNotifyLevelUps"),
    profileLastLogin: document.querySelector("#profileLastLogin"),
    profileUid: document.querySelector("#profileUid"),
    profileAccountRole: document.querySelector("#profileAccountRole"),
    profileNewPassword: document.querySelector("#profileNewPassword"),
    profileConfirmPassword: document.querySelector("#profileConfirmPassword"),
    profileMessage: document.querySelector("#profileMessage"),
    saveProfileSettings: document.querySelector("#saveProfileSettings"),
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
    els.versionPagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-history-page]");
      if (!button) return;
      state.historyPage = Number(button.dataset.historyPage || 1);
      renderHistory();
    });

    els.globalSearch?.addEventListener("input", (event) => {
      state.search = event.target.value.trim().toLowerCase();
      resetCoursePagination();
      render();
    });

    els.overviewSectionFilter?.addEventListener("change", (event) => {
      state.selectedOverviewSection = event.target.value;
      state.overviewPage = 1;
      render();
    });

    els.overviewCreditFilter?.addEventListener("change", (event) => {
      state.selectedCredit = event.target.value;
      if (els.courseCreditFilter) els.courseCreditFilter.value = event.target.value;
      resetCoursePagination();
      render();
    });

    els.statusFilter?.addEventListener("change", (event) => {
      state.selectedStatus = event.target.value;
      state.overviewPage = 1;
      render();
    });

    els.courseCreditFilter.addEventListener("change", (event) => {
      state.selectedCredit = event.target.value;
      if (els.overviewCreditFilter) els.overviewCreditFilter.value = event.target.value;
      resetCoursePagination();
      render();
    });

    els.courseCatalogSearch.addEventListener("input", (event) => {
      state.courseSearch = event.target.value;
      state.coursePage = 1;
      renderCourses();
    });

    els.activityLogSearch?.addEventListener("input", (event) => {
      state.activityLogSearch = event.target.value.trim().toLowerCase();
      renderActivityLog();
    });

    els.overviewRowsPerPage?.addEventListener("change", (event) => {
      state.overviewRowsPerPage = Number(event.target.value) || 10;
      state.overviewPage = 1;
      renderOverview();
    });

    els.courseCatalogRowsPerPage.addEventListener("change", (event) => {
      state.courseRowsPerPage = Number(event.target.value) || 10;
      state.coursePage = 1;
      renderCourses();
    });

    els.overviewPagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-overview-page]");
      if (!button) return;
      state.overviewPage = Number(button.dataset.overviewPage);
      renderOverview();
    });

    els.overviewActivityPagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-overview-activity-page]");
      if (!button) return;
      state.overviewActivityPage = Number(button.dataset.overviewActivityPage);
      renderOverviewActivity();
    });

    els.courseCatalogPagination.addEventListener("click", (event) => {
      const button = event.target.closest("[data-course-page]");
      if (!button) return;
      state.coursePage = Number(button.dataset.coursePage);
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
        state.coursePage = 1;
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

    els.programCategoryFilter.addEventListener("change", (event) => {
      state.selectedProgramCategory = event.target.value;
      renderPrograms();
    });

    const toggleAdmin = async () => {
      if (state.signedIn && firebaseDisabled) {
        state.admin = !state.admin;
        state.adminEligible = true;
        sessionStorage.setItem(adminKey, String(state.admin));
        render();
        return;
      }
      if (state.signedIn && state.adminEligible) {
        state.admin = !state.admin;
        sessionStorage.setItem(adminKey, String(state.admin));
        await startUserPresence();
        render();
        return;
      }
      if (state.signedIn && !state.adminEligible && !firebaseDisabled) {
        setCloudStatus(`Checking admin access for UID: ${firebaseState.user?.uid || "unknown"}`);
        try {
          await refreshRoleStatus();
          if (state.adminEligible) {
            state.admin = true;
            sessionStorage.setItem(adminKey, "true");
            await startUserPresence();
            render();
          }
        } catch (error) {
          console.warn("Admin role refresh failed.", error);
          setCloudStatus(`Role setup needed. UID: ${firebaseState.user?.uid || "unknown"}`);
        }
        return;
      }
      els.adminEmail.value = firebaseState.user?.email || "";
      els.adminPassword.value = "";
      els.adminDialog.showModal();
      setTimeout(() => els.adminPassword.focus(), 0);
    };

    els.profileSettingsNav.addEventListener("click", openProfileSettings);
    document.querySelector("#adminStatusButton")?.addEventListener("click", toggleAdmin);
    els.signOutButton.addEventListener("click", lockAdmin);
    els.userChip.addEventListener("click", (event) => {
      if (event.target.closest("#signOutButton")) return;
      openProfileSettings();
    });
    els.userChip.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openProfileSettings();
    });
    els.profilePhotoButton?.addEventListener("click", () => els.profilePhotoInput?.click());
    els.profilePhotoInput?.addEventListener("change", renderProfilePhotoPreview);
    els.profileDisplayName?.addEventListener("input", renderProfilePhotoPreview);
    els.saveProfileSettings.addEventListener("click", (event) => {
      event.preventDefault();
      saveProfileSettings();
    });

    els.noticeForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      createNotice();
    });

    els.taskForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      createTask();
    });

    els.runDatabaseBackup?.addEventListener("click", () => runBackup("Database"));
    els.runFileBackup?.addEventListener("click", () => runBackup("File"));
    els.runFullBackup?.addEventListener("click", () => runBackup("Full"));
    els.testEmailForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      sendTestEmail();
    });
    document.querySelectorAll("[data-maintenance-check]").forEach((button) => {
      button.addEventListener("click", () => runMaintenanceCheck(button.dataset.maintenanceCheck));
    });
    els.appSettingsForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveAppSettings();
    });

    els.addManagedFile?.addEventListener("click", openFileBuilder);
    els.fileManagerSearch?.addEventListener("input", (event) => {
      fileManagerState.search = event.target.value.trim().toLowerCase();
      fileManagerState.page = 1;
      renderFileManager();
    });
    els.fileManagerPagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-file-page]");
      if (!button) return;
      fileManagerState.page = Number(button.dataset.filePage);
      renderFileManager();
    });
    els.managedFileInput?.addEventListener("change", (event) => {
      fileManagerState.selectedFiles = Array.from(event.target.files || []);
      renderFileBuilder();
    });
    els.fileCourseSearch?.addEventListener("input", (event) => {
      fileManagerState.courseSearch = event.target.value.trim().toLowerCase();
      renderFileBuilder();
    });
    els.saveManagedFile?.addEventListener("click", (event) => {
      event.preventDefault();
      saveManagedFile();
    });
    document.querySelectorAll("[data-close-file-builder]").forEach((button) => {
      button.addEventListener("click", () => els.fileBuilderDialog?.close("cancel"));
    });
    els.openFileSelector?.addEventListener("click", openEmailFileSelector);
    els.emailFileSearch?.addEventListener("input", (event) => {
      fileManagerState.emailSearch = event.target.value.trim().toLowerCase();
      renderEmailFileSelector();
    });
    els.emailFileTypeFilter?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-email-file-category]");
      if (!button) return;
      state.emailFileCategory = button.dataset.emailFileCategory || "all";
      renderEmailFileSelector();
    });
    els.emailCurriculumFilter?.addEventListener("change", (event) => {
      fileManagerState.emailCurriculum = event.target.value;
      renderEmailFileSelector();
    });
    els.attachSelectedFiles?.addEventListener("click", attachEmailFiles);
    document.querySelectorAll("[data-close-file-selector]").forEach((button) => {
      button.addEventListener("click", () => els.fileSelectorDialog?.close("cancel"));
    });
    els.editEmailTemplates?.addEventListener("click", openEmailTemplateEditor);
    els.emailTemplateSelect?.addEventListener("change", (event) => {
      emailTemplateState.activeTemplateId = event.target.value;
      renderEmailTemplateControls();
    });
    els.emailTemplateEditorSelect?.addEventListener("change", (event) => {
      emailTemplateState.editorTemplateId = event.target.value;
      renderEmailTemplateEditorFields();
    });
    els.addEmailTemplate?.addEventListener("click", addEmailTemplateDraft);
    els.deleteEmailTemplate?.addEventListener("click", deleteEmailTemplate);
    els.saveEmailContent?.addEventListener("click", (event) => {
      event.preventDefault();
      saveEmailTemplate();
    });
    document.querySelectorAll("[data-close-email-content]").forEach((button) => {
      button.addEventListener("click", () => els.emailContentDialog?.close("cancel"));
    });
    els.fileSendForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      prepareStudentFileEmail();
    });
    els.studentEmail?.addEventListener("input", validateAdministrationEmailControls);
    els.testEmailAddress?.addEventListener("input", validateAdministrationEmailControls);
    els.progressInfoButton?.addEventListener("click", openProgressInfoDialog);
    els.progressInfoContent?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-achievement-page]");
      if (!button) return;
      const [kind, page] = String(button.dataset.achievementPage || "").split(":");
      if (!kind || !Object.hasOwn(state.achievementPages, kind)) return;
      state.achievementPages[kind] = Number(page || 1);
      renderProgressInfoContent();
    });
    els.overviewGamificationList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-open-progress-info]");
      if (!button) return;
      openProgressInfoDialog();
    });

    els.transcriptProgram?.addEventListener("change", (event) => {
      state.transcriptSelectedProgram = event.target.value;
      renderTranscripts();
    });

    els.importTranscriptProgram?.addEventListener("click", importTranscriptCurriculum);

    els.transcriptCourseSearch?.addEventListener("input", (event) => {
      state.transcriptCourseSearch = event.target.value.trim().toLowerCase();
      renderTranscriptCoursePicker();
    });

    els.transcriptCoursePicker?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-transcript-course]");
      if (!button) return;
      addTranscriptCourse(button.dataset.addTranscriptCourse);
    });

    els.transcriptCourseRows?.addEventListener("input", (event) => {
      const input = event.target.closest("[data-transcript-percent]");
      if (!input) return;
      const row = state.transcriptRows.find((item) => item.key === input.dataset.transcriptPercent);
      if (row) row.percent = input.value;
      renderTranscriptTotals();
      validateTranscriptControls();
    });

    els.transcriptCourseRows?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-transcript-course]");
      if (!button) return;
      state.transcriptRows = state.transcriptRows.filter((row) => row.key !== button.dataset.removeTranscriptCourse);
      renderTranscriptRows();
    });

    els.clearTranscript?.addEventListener("click", () => {
      state.transcriptRows = [];
      state.activeTranscriptDraftId = "";
      renderTranscriptRows();
    });

    els.importTranscriptPdf?.addEventListener("click", openTranscriptImportDialog);
    els.importTranscriptFromComputer?.addEventListener("click", () => {
      els.transcriptImportDialog?.close("computer");
      if (els.transcriptPdfFile) els.transcriptPdfFile.value = "";
      els.transcriptPdfFile?.click();
    });

    els.transcriptPdfFile?.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) importTranscriptPdf(file);
    });

    [
      els.transcriptStudentName,
      els.transcriptStudentId,
      els.transcriptDob,
      els.transcriptFrom,
      els.transcriptTo,
      els.transcriptCurriculumName,
    ].forEach((input) => {
      input?.addEventListener("input", validateTranscriptControls);
      input?.addEventListener("change", validateTranscriptControls);
    });

    els.saveTranscriptDraft?.addEventListener("click", saveTranscriptDraft);

    els.printTranscript?.addEventListener("click", openTranscriptSaveDialog);
    els.saveTranscriptToComputer?.addEventListener("click", () => saveTranscriptPdf("computer"));
    els.saveTranscriptToFileManager?.addEventListener("click", () => saveTranscriptPdf("file-manager"));
    els.saveTranscriptBoth?.addEventListener("click", () => saveTranscriptPdf("both"));

    els.confirmAdmin.addEventListener("click", (event) => {
      event.preventDefault();
      signInUser(els.adminEmail.value.trim(), els.adminPassword.value);
    });

    els.addCourse?.addEventListener("click", () => openCourseEditor());
    els.addCourseCatalog?.addEventListener("click", () => openCourseEditor());
    els.addCurriculum.addEventListener("click", () => openCurriculumBuilder());
    els.addProgramCourse.addEventListener("click", () => openRequirementBuilder());
    els.addProgram?.addEventListener("click", () => openProgramBuilder());
    els.editProgramButton.addEventListener("click", () => openProgramEditor(state.selectedProgram));
    els.removeCurriculumButton?.addEventListener("click", () => removeProgram(state.selectedProgram));
    els.removeBlankCourses.addEventListener("click", removeBlankCourses);
    els.attachmentUpload.addEventListener("change", () => {
      setCloudStatus("Upload course files from File Manager.");
      els.attachmentUpload.value = "";
    });
    els.helpButton.addEventListener("click", () => {
      renderGuide();
      els.helpDialog.showModal();
    });
    els.guideTopicGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-guide-topic]");
      if (!button) return;
      state.guideTopic = button.dataset.guideTopic || "overview";
      renderGuide();
    });
    document.querySelectorAll(".modal-native").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close("cancel");
      });
    });

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

    els.curriculumBuilderCourseSearch.addEventListener("input", (event) => {
      curriculumBuilder.search = event.target.value.trim().toLowerCase();
      renderCurriculumBuilder();
    });
    [els.curriculumBuilderProgram, els.curriculumBuilderName].forEach((input) => {
      input?.addEventListener("input", validateCurriculumBuilder);
      input?.addEventListener("change", validateCurriculumBuilder);
    });

    els.saveCurriculumBuilder.addEventListener("click", (event) => {
      event.preventDefault();
      saveCurriculumBuilder();
    });

    document.querySelectorAll("[data-close-curriculum-builder]").forEach((button) => {
      button.addEventListener("click", () => els.curriculumBuilderDialog.close("cancel"));
    });

    els.programBuilderCurriculumSearch?.addEventListener("input", (event) => {
    programBuilder.search = event.target.value.trim().toLowerCase();
    renderProgramBuilder();
    });
    els.programBuilderName?.addEventListener("input", validateProgramBuilder);
    els.programBuilderName?.addEventListener("change", validateProgramBuilder);
    
    els.saveProgramBuilder.addEventListener("click", (event) => {
      event.preventDefault();
      saveProgramBuilder();
    });
    document.querySelectorAll("[data-close-program-builder]").forEach((button) => {
      button.addEventListener("click", () => els.programBuilderDialog.close("cancel"));
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
      setCloudStatus("Upload course files from File Manager.");
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
    renderActivityLog();
    renderNotices();
    renderTasks();
    renderTranscripts();
    renderFileManager();
    renderEmailTemplateControls();
    renderSelectedEmailFiles();
    renderAdministration();
    renderDataHealth();
  }

  function renderChrome() {
    els.body.classList.toggle("auth-locked", !state.signedIn && !state.authChecking);
    els.body.classList.toggle("auth-checking", state.authChecking);
    els.body.classList.toggle("is-admin", state.admin);
    els.body.classList.toggle("theme-dark", isDarkMode());
    els.body.dataset.activeView = state.view;
    els.adminState.textContent = state.admin ? "Admin" : state.signedIn ? "Viewer" : "Sign In";
    document.querySelector("#adminStatusButton i").className = state.admin ? "bi bi-unlock" : "bi bi-lock";
    renderUserChip();
    renderSidebarRankCard();

    els.navItems.forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
    els.views.forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
    if (els.appVersion) els.appVersion.textContent = appVersion;
    renderConnectionMeta();
  }

  function renderUserChip() {
    const displayName = currentUserDisplayName() || "Employee";
    const role = state.admin ? "Administrator" : state.signedIn ? "Standard User" : "Not signed in";
    const photoURL = firebaseState.profile?.photoURL || firebaseState.user?.photoURL || "";
    els.userName.textContent = displayName;
    els.userRole.textContent = role;
    els.userInitials.textContent = initials(displayName);
    if (els.userAvatarImage) {
      els.userAvatarImage.src = photoURL;
      els.userAvatarImage.hidden = !photoURL;
      els.userInitials.hidden = Boolean(photoURL);
    }
  }

  function renderSidebarRankCard() {
    if (!els.sidebarRankCard) return;
    const current = currentContributorStats();
    if (!state.signedIn || !current) {
      els.sidebarRankCard.hidden = true;
      els.sidebarRankCard.innerHTML = "";
      return;
    }
    const xpRemaining = Math.max(0, current.nextXp - current.xp);
    const rankGradient = metallicRankGradient(current.rankColor);
    els.sidebarRankCard.hidden = false;
    els.sidebarRankCard.innerHTML = `
      <div class="sidebar-rank-head">
        <span class="sidebar-rank-icon"><i class="bi bi-award"></i></span>
        <span>
          <strong>Level ${current.level}</strong>
          <small class="rank-metallic-text" style="--rank-gradient:${escapeAttr(rankGradient)}">${escapeHtml(current.title)}</small>
        </span>
      </div>
      <div class="sidebar-rank-bar" aria-label="Contributor level progress">
        <span style="width:${Number(current.progress || 0).toFixed(1)}%"></span>
      </div>
      <small>${current.xp} XP &bull; ${xpRemaining} XP to next level</small>
    `;
  }

  const guideTopics = [
    { id: "overview", icon: "bi-speedometer2", title: "Overview" },
    { id: "courses", icon: "bi-book", title: "Courses" },
    { id: "curriculums", icon: "bi-clipboard2-data", title: "Curriculums" },
    { id: "programs", icon: "bi-mortarboard", title: "Programs" },
    { id: "transcripts", icon: "bi-file-earmark-text", title: "Transcripts" },
    { id: "administration", icon: "bi-shield-lock", title: "Administration" },
    { id: "files", icon: "bi-folder2-open", title: "File Manager" },
    { id: "log", icon: "bi-journal-text", title: "Activity Log" },
    { id: "profile", icon: "bi-person-gear", title: "Profile & Admin" },
  ];

  const guideDetails = {
    overview: {
      title: "Overview Dashboard",
      subtitle: "Use Overview as the compact health check for the dashboard.",
      visual: ["Latest Dashboard Changes", "Assigned to Me", "Staff Status", "Dashboard Progress"],
      steps: [
        "Review Latest Dashboard Changes for recent edits, uploads, transcript work, and deletions.",
        "Use Assigned to Me to see open tasks assigned to your account.",
        "Check Staff Status for online/offline state and the last recorded login time.",
        "Open Dashboard Progress for contribution totals, rank progress, achievements, and dashboard-wide totals.",
      ],
    },
    courses: {
      title: "Courses Tab",
      subtitle: "Courses are the master catalog used everywhere else.",
      visual: ["Add Course", "Search", "Credit Filter", "Sortable Columns", "Edit/Delete"],
      steps: [
        "Click Add Course to create a new course record. Course IDs are validated so duplicate course numbers cannot be saved.",
        "Use the search box to find records by ID, course name, credit, comment, or status.",
        "Use the credit/status filters and column sort buttons to narrow or order the course table.",
        "Admins can edit or delete courses from the Actions menu. Deleting a course is password protected.",
        "Create courses here before attaching them to curriculums or transcript rows.",
      ],
    },
    curriculums: {
      title: "Curriculums Tab",
      subtitle: "Build each curriculum and maintain its required course list.",
      visual: ["Program Filter", "Curriculum Filter", "Add Curriculum", "Manage Requirements", "Attachments"],
      steps: [
        "Choose a program and curriculum from the top filters.",
        "Click Add Curriculum to create a new curriculum and add initial course requirements in one builder.",
        "Use Edit Curriculum to change curriculum name, code, status, version, description, notes, or program.",
        "Use Manage Requirements to add, remove, or reorder course requirements later.",
        "The Attachments tab is read-only. It automatically shows File Manager files linked to courses in that curriculum.",
      ],
    },
    programs: {
      title: "Programs Tab",
      subtitle: "Programs are the main school categories that hold curriculums.",
      visual: ["Program Selector", "Program Overview", "Add Program", "Manage Curriculums"],
      steps: [
        "Select a program from the dropdown to review its details.",
        "Click Add Program to create a new main category.",
        "Use Edit Program for program description, notes, and status.",
        "Use Manage Curriculums to choose which curriculums belong under that program.",
        "Course requirements are edited from the Curriculums tab, not the Programs tab.",
      ],
    },
    transcripts: {
      title: "Transcripts Tab",
      subtitle: "Build transcripts from Firebase course and curriculum data.",
      visual: ["Student Details", "Import Curriculum", "Add Courses", "Import PDF", "Save PDF"],
      steps: [
        "Fill in student details before creating the transcript.",
        "Import a curriculum to bring its course rows into the transcript, then edit rows as needed.",
        "Search and add individual courses manually when a custom transcript is needed.",
        "Import PDF can rebuild a transcript from your computer or a transcript PDF stored in File Manager.",
        "Save PDF can save to your computer, File Manager, or both. Transcript files are standalone and do not link to course attachments.",
      ],
    },
    administration: {
      title: "Administration Tab",
      subtitle: "Use the operational control center for backups, health, email, notices, tasks, maintenance, and shared settings.",
      visual: ["Backup Center", "System Health", "Email Dispatch", "Announcements", "Task Board", "Maintenance"],
      steps: [
        "Use Backup Center to record database, file, or full backup attempts. OneDrive automation will plug into this area later.",
        "Review System Health for Realtime Database, Storage, Cloud Functions, Email Service, and Authentication status.",
        "Use Email Dispatch to select existing File Manager files and prepare student emails.",
        "Email Templates are shared templates stored in Realtime Database. Admins can add, save, or delete templates.",
        "Post Announcements to broadcast one-way notices to all signed-in users.",
        "Create tasks with a title, description, assignee, and status.",
        "Run Maintenance Tools to find duplicate IDs, duplicate files, unlinked files, empty curriculums, transcript issues, and failed email records.",
        "Edit App Settings when a shared dashboard setting, such as transcript file naming, needs to change.",
      ],
    },
    files: {
      title: "File Manager",
      subtitle: "Upload files once, link them to courses, and reuse them across curriculums.",
      visual: ["Add File", "Category", "Linked Courses", "Search", "Download"],
      steps: [
        "Use Add File to upload one or more files to Cloud Storage.",
        "Choose a category such as eBook, CI, Transcript, or Other.",
        "Link course files to one or more course IDs so curriculums can display the correct attachments automatically.",
        "Transcript files stay standalone and should not be linked to course IDs.",
        "Use search to find files by file name, linked course, category, or course ID.",
        "Use Download from File Manager or from a curriculum's read-only Attachments tab.",
      ],
    },
    log: {
      title: "Activity Log",
      subtitle: "Track dashboard activity and search staff changes.",
      visual: ["Activity Log", "Search", "User", "Action", "Details"],
      steps: [
        "The Activity Log records important add, edit, delete, upload, task, notice, and transcript actions.",
        "Search the log by user, action, record, or details.",
        "Use the log to audit who changed courses, curriculums, programs, files, notices, tasks, transcripts, and templates.",
        "Activity entries also power Dashboard Progress, XP, ranks, and contribution stats.",
      ],
    },
    profile: {
      title: "Profile, Notifications, and Admin Mode",
      subtitle: "Control your account preferences and dashboard access.",
      visual: ["Display Name", "Profile Picture", "Dark Mode", "Notifications", "Admin Toggle"],
      steps: [
        "Use Profile Settings to change display name, profile picture, password, dark mode, notification preferences, landing page, and task defaults.",
        "Your display name and profile picture appear in Connected Users, Staff Status, tasks, and contribution progress.",
        "Notification toggles control notice, task, achievement, and level-up toasts.",
        "The Admin button in the top bar toggles admin/viewer mode when your account has admin permission.",
        "Viewer mode can read and search. Admin mode can add, edit, remove, upload, and save to Firebase.",
      ],
    },
  };

  function renderGuide() {
    if (!els.guideTopicGrid || !els.guideContent) return;
    const active = guideDetails[state.guideTopic] ? state.guideTopic : "overview";
    state.guideTopic = active;
    els.guideTopicGrid.innerHTML = guideTopics.map((topic) => `
      <button class="guide-topic-button ${topic.id === active ? "active" : ""}" type="button" data-guide-topic="${escapeAttr(topic.id)}">
        <i class="bi ${escapeAttr(topic.icon)}"></i>
        <span>${escapeHtml(topic.title)}</span>
      </button>
    `).join("");
    const guide = guideDetails[active];
    els.guideContent.innerHTML = `
      <section class="guide-snapshot" aria-label="${escapeAttr(guide.title)} visual guide">
        ${guide.visual.map((item, index) => `
          <span style="--guide-index:${index + 1}">
            <b>${index + 1}</b>${escapeHtml(item)}
          </span>
        `).join("")}
      </section>
      <section class="guide-walkthrough">
        <div>
          <p class="eyebrow">${escapeHtml(guide.title)}</p>
          <h3>${escapeHtml(guide.subtitle)}</h3>
        </div>
        <ol>
          ${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  function currentUserDisplayName() {
    const profile = firebaseState.profile || {};
    const emailName = firebaseState.user?.email?.split("@")[0] || "";
    return profile.displayName
      || profile.name
      || profile.fullName
      || firebaseState.user?.displayName
      || emailName;
  }

  function updateFirebaseStatusVisibility() {
    if (!els.firebaseStatus) return;
    const show = showRealtimeLoadedSummary();

    els.firebaseStatus.hidden = !show;
    els.firebaseStatus.classList.toggle("d-md-inline", show);
    els.firebaseStatus.classList.toggle("d-none", !show);
  }

  function renderConnectionMeta() {
    const statusText = firebaseDisabled
      ? "Live Sync: Preview Mode"
      : firebaseState.ready && firebaseState.user
        ? "Live Sync: Connected"
        : firebaseState.ready
          ? "Live Sync: Sign In Required"
          : "Live Sync: Connecting...";
    const statusKind = firebaseDisabled
      ? "preview"
      : firebaseState.ready && firebaseState.user
        ? "connected"
        : "pending";

    updateFirebaseStatusVisibility();

    if (els.liveSyncStatus) {
      els.liveSyncStatus.dataset.status = statusKind;
      els.liveSyncStatus.querySelector("span:last-child").textContent = statusText;
    }

    if (els.connectedUsers) {
      if (!state.signedIn) {
        els.connectedUsers.textContent = "Connected Users: --";
        return;
      }
      const names = state.connectedUsers.map((user) => user.name).filter(Boolean);
      const uniqueNames = [...new Set(names)];
      const displayNames = uniqueNames.length ? uniqueNames : [currentUserDisplayName() || "Local Preview"];
      const nameSeparator = ` ${String.fromCharCode(8226)} `;
      els.connectedUsers.textContent = `Connected Users: ${displayNames.length} - ${displayNames.join(nameSeparator)}`;
    }
  }

  function showRealtimeLoadedSummary() {
    return firebaseState.profile?.settings?.showRealtimeLoaded !== false;
  }

  function isDarkMode() {
    return firebaseState.profile?.settings?.darkMode === true;
  }

  function userSettings() {
    return firebaseState.profile?.settings || {};
  }

  function noticeModalsEnabled() {
    return userSettings().notifyNotices !== false;
  }

  function taskModalsEnabled() {
    return userSettings().notifyTasks !== false;
  }

  function achievementModalsEnabled() {
    return userSettings().notifyAchievements !== false;
  }

  function levelUpModalsEnabled() {
    return userSettings().notifyLevelUps !== false;
  }

  function myTasksOnlyEnabled() {
    return userSettings().myTasksOnly === true;
  }

  function hideAppLoader() {
    if (!els.appLoader) return;
    els.appLoader.classList.add("is-hidden");
    setTimeout(() => els.appLoader?.remove(), 500);
  }

  function renderStats() {
    document.querySelector("#courseCount").textContent = state.courses.length;
    document.querySelector("#programCount").textContent = programCategories().length;
    document.querySelector("#curriculumCount").textContent = programs().length;
  }

  function renderNotices() {
    const activeNotices = state.notices
      .filter((notice) => notice.status !== "deleted")
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));
    const latest = activeNotices[0];
    if (els.noticeBanner) {
      els.noticeBanner.hidden = !latest;
      els.noticeBanner.innerHTML = latest ? `
        <div>
          <strong><i class="bi bi-megaphone"></i> Notice</strong>
          <span>${escapeHtml(latest.message)}</span>
        </div>
        <small>${escapeHtml(latest.authorName || "Admin")} - ${formatTimestamp(latest.createdAtMs)}</small>
      ` : "";
    }
    if (!els.noticeList) return;
    els.noticeList.innerHTML = activeNotices.map((notice) => `
      <article class="notice-item">
        <div>
          <strong>${escapeHtml(notice.message)}</strong>
          <small>${escapeHtml(notice.authorName || "Admin")} - ${formatTimestamp(notice.createdAtMs)}</small>
        </div>
        <div class="item-actions admin-only">
          <button class="btn btn-sm btn-outline-eden" type="button" data-edit-notice="${escapeAttr(notice._docId)}">Edit</button>
          <button class="btn btn-sm btn-outline-danger" type="button" data-delete-notice="${escapeAttr(notice._docId)}">Delete</button>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No notices have been posted.</div>`;

    els.noticeList.querySelectorAll("[data-edit-notice]").forEach((button) => {
      button.addEventListener("click", () => editNotice(button.dataset.editNotice));
    });
    els.noticeList.querySelectorAll("[data-delete-notice]").forEach((button) => {
      button.addEventListener("click", () => deleteNotice(button.dataset.deleteNotice));
    });
  }

  function renderTasks() {
    if (els.taskAssignee) {
      const users = taskAssignees();
      els.taskAssignee.innerHTML = users.map((user) => `
        <option value="${escapeAttr(user.uid)}">${escapeHtml(user.name)}</option>
      `).join("");
    }
    if (!els.taskList) return;
    const displayName = currentUserDisplayName();
    const myTasksOnly = myTasksOnlyEnabled();
    const visibleTasks = state.tasks
      .filter((task) => {
        const assignedToMe = task.assigneeUid === firebaseState.user?.uid
          || (displayName && task.assigneeName === displayName);
        return myTasksOnly ? assignedToMe : state.admin || assignedToMe;
      })
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));
    els.taskList.innerHTML = visibleTasks.map((task) => `
      <article class="task-item ${task.status === "done" ? "is-done" : ""}">
        <div>
          <div class="task-title-row">
            <strong>${escapeHtml(task.title)}</strong>
            <span class="status-badge">${escapeHtml(task.status === "done" ? "Done" : "Open")}</span>
          </div>
          <p>${escapeHtml(task.description || "No description added.")}</p>
          <small>Assigned to ${escapeHtml(task.assigneeName || "Unassigned")} - Created by ${escapeHtml(task.createdByName || "Admin")} - ${formatTimestamp(task.createdAtMs)}</small>
        </div>
        <div class="item-actions">
          <button class="btn btn-sm btn-outline-eden" type="button" data-toggle-task="${escapeAttr(task._docId)}">${task.status === "done" ? "Reopen" : "Done"}</button>
          <button class="btn btn-sm btn-outline-eden admin-only" type="button" data-edit-task="${escapeAttr(task._docId)}">Edit</button>
          <button class="btn btn-sm btn-outline-danger admin-only" type="button" data-delete-task="${escapeAttr(task._docId)}">Delete</button>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No tasks match your account yet.</div>`;

    els.taskList.querySelectorAll("[data-toggle-task]").forEach((button) => {
      button.addEventListener("click", () => toggleTaskStatus(button.dataset.toggleTask));
    });
    els.taskList.querySelectorAll("[data-edit-task]").forEach((button) => {
      button.addEventListener("click", () => editTask(button.dataset.editTask));
    });
    els.taskList.querySelectorAll("[data-delete-task]").forEach((button) => {
      button.addEventListener("click", () => deleteTask(button.dataset.deleteTask));
    });
  }

  function renderFileManager() {
    if (!els.fileManagerRows) return;
    const allFiles = filteredManagedFiles();
    const page = normalizePage(fileManagerState.page, allFiles.length, fileManagerState.rowsPerPage);
    fileManagerState.page = page;
    const start = (page - 1) * fileManagerState.rowsPerPage;
    const rows = allFiles.slice(start, start + fileManagerState.rowsPerPage);
    const shownStart = allFiles.length ? start + 1 : 0;
    const shownEnd = allFiles.length ? Math.min(start + rows.length, allFiles.length) : 0;

    els.fileManagerRows.innerHTML = rows.map((file) => `
      <tr>
        <td>
          <div class="file-cell">
            <i class="bi bi-file-earmark-text"></i>
            <div>
              <strong>${escapeHtml(file.name)}</strong>
              <small>${escapeHtml(file.contentType || "Stored file")}</small>
            </div>
          </div>
        </td>
        <td><span class="linked-course-badge">${escapeHtml(file.category || "Other")}</span></td>
        <td>${linkedCourseBadges(file).join("") || `<span class="text-muted">No linked courses</span>`}</td>
        <td>${escapeHtml(formatBytes(file.size))}</td>
        <td>${escapeHtml(formatTimestamp(file.createdAtMs || file.updatedAtMs))}</td>
        <td class="text-end">
          <div class="item-actions file-manager-actions justify-content-end">
            <a class="btn btn-sm btn-outline-eden" href="${escapeAttr(file.downloadURL || "#")}" target="_blank" rel="noopener" ${file.downloadURL ? "" : "aria-disabled=\"true\""}>
              Download
            </a>
            <button class="btn btn-sm btn-outline-eden admin-only" type="button" data-edit-managed-file="${escapeAttr(file._docId)}">Edit</button>
            <button class="btn btn-sm btn-outline-danger admin-only" type="button" data-delete-managed-file="${escapeAttr(file._docId)}">Delete</button>
          </div>
        </td>
      </tr>
    `).join("") || emptyRow(6, "No files match the current search.");

    if (els.fileManagerPageSummary) {
      els.fileManagerPageSummary.textContent = `Showing ${shownStart} to ${shownEnd} of ${allFiles.length} files`;
    }
    if (els.fileManagerPagination) {
      renderPagination(els.fileManagerPagination, page, totalPages(allFiles.length, fileManagerState.rowsPerPage), "files");
    }
    els.fileManagerRows.querySelectorAll("[data-edit-managed-file]").forEach((button) => {
      button.addEventListener("click", () => openFileBuilder(button.dataset.editManagedFile));
    });
    els.fileManagerRows.querySelectorAll("[data-delete-managed-file]").forEach((button) => {
      button.addEventListener("click", () => deleteManagedFile(button.dataset.deleteManagedFile));
    });
    renderSelectedEmailFiles();
  }

  function filteredManagedFiles() {
    const query = fileManagerState.search;
    return fileManagerState.records
      .filter((file) => !query || fileSearchText(file).includes(query))
      .sort((a, b) => Number(b.createdAtMs || b.updatedAtMs || 0) - Number(a.createdAtMs || a.updatedAtMs || 0));
  }

  function fileSearchText(file) {
    return [
      file.name,
      file.contentType,
      file.category,
      ...(file.courseIds || []),
      ...(file.courseLabels || []),
    ].join(" ").toLowerCase();
  }

  function linkedCourseBadges(file) {
    return (file.courseIds || []).slice(0, 4).map((courseId) => {
      const course = courseById(courseId);
      const label = course ? `${course.id} ${course.name}` : courseId;
      return `<span class="linked-course-badge">${escapeHtml(label)}</span>`;
    }).concat((file.courseIds || []).length > 4 ? [`<span class="linked-course-badge">+${file.courseIds.length - 4} more</span>`] : []);
  }

  function openFileBuilder(docId = "") {
    if (!state.admin) return;
    const requestedDocId = typeof docId === "string" ? docId : "";
    const existingFile = requestedDocId ? fileManagerState.records.find((file) => file._docId === requestedDocId) : null;
    fileManagerState.editingFileId = existingFile?._docId || "";
    fileManagerState.selectedFiles = [];
    fileManagerState.selectedCourseIds = existingFile ? [...(existingFile.courseIds || [])] : [];
    fileManagerState.courseSearch = "";
    if (els.managedFileInput) els.managedFileInput.value = "";
    if (els.fileCourseSearch) els.fileCourseSearch.value = "";
    if (els.fileBuilderTitle) els.fileBuilderTitle.textContent = existingFile ? "Edit Course File" : "Add Course File";
    if (els.saveManagedFile) els.saveManagedFile.textContent = existingFile ? "Save Changes" : "Save File";
    if (els.managedFileCategory) els.managedFileCategory.value = existingFile?.category || "CI";
    renderFileBuilder();
    els.fileBuilderDialog?.showModal();
  }

  function renderFileBuilder() {
    if (!els.managedFilePreview) return;
    const files = fileManagerState.selectedFiles || [];
    const existingFile = fileManagerState.editingFileId
      ? fileManagerState.records.find((file) => file._docId === fileManagerState.editingFileId)
      : null;
    els.managedFilePreview.innerHTML = files.length ? files.map((file) => `
      <article class="managed-file-card managed-file-card-compact">
        <i class="bi bi-file-earmark-check"></i>
        <div>
          <strong>${escapeHtml(file.name)}</strong>
          <span>${escapeHtml(file.type || "Unknown type")} - ${escapeHtml(formatBytes(file.size))}</span>
        </div>
      </article>
    `).join("") : existingFile ? `
      <article class="managed-file-card managed-file-card-compact">
        <i class="bi bi-file-earmark-text"></i>
        <div>
          <strong>${escapeHtml(existingFile.name)}</strong>
          <span>${escapeHtml(existingFile.contentType || "Stored file")} - ${escapeHtml(formatBytes(existingFile.size))}</span>
        </div>
      </article>
      <p class="form-note">Editing metadata only. The stored file in Cloud Storage will stay unchanged.</p>
    ` : `<div class="empty-state">No files selected yet.</div>`;

    const selectedIds = new Set(fileManagerState.selectedCourseIds);
    const query = fileManagerState.courseSearch;
    const matches = state.courses
      .filter((course) => !selectedIds.has(course.id))
      .filter((course) => !query || matchesText(course, query))
      .sort((a, b) => naturalCompare(a.id, b.id))
      .slice(0, 20);
    els.fileCoursePicker.innerHTML = matches.map((course) => `
      <button class="course-picker-row" type="button" data-add-file-course="${escapeAttr(course.id)}">
        <span><strong>${escapeHtml(course.name)}</strong><small>${escapeHtml(course.id)} - Credit ${escapeHtml(course.credit)}</small></span>
        <i class="bi bi-plus-circle"></i>
      </button>
    `).join("") || `<div class="empty-state">No courses match that search.</div>`;
    els.fileCoursePicker.querySelectorAll("[data-add-file-course]").forEach((button) => {
      button.addEventListener("click", () => {
        fileManagerState.selectedCourseIds.push(button.dataset.addFileCourse);
        renderFileBuilder();
      });
    });

    els.fileCourseSelectedCount.textContent = String(fileManagerState.selectedCourseIds.length);
    els.fileSelectedCourses.innerHTML = fileManagerState.selectedCourseIds.map((courseId) => {
      const course = courseById(courseId);
      return `
        <article class="selected-requirement-row">
          <span class="requirement-order"><i class="bi bi-link-45deg"></i></span>
          <span><strong>${escapeHtml(course?.name || courseId)}</strong><small>${escapeHtml(courseId)}${course?.credit ? ` - Credit ${escapeHtml(course.credit)}` : ""}</small></span>
          <button class="button" type="button" data-remove-file-course="${escapeAttr(courseId)}"><i class="bi bi-x-lg"></i></button>
        </article>
      `;
    }).join("") || `<div class="empty-state">Select at least one course for this file.</div>`;
    els.fileSelectedCourses.querySelectorAll("[data-remove-file-course]").forEach((button) => {
      button.addEventListener("click", () => {
        fileManagerState.selectedCourseIds = fileManagerState.selectedCourseIds.filter((id) => id !== button.dataset.removeFileCourse);
        renderFileBuilder();
      });
    });
  }

  async function saveManagedFile() {
    if (!state.admin) return;
    const files = fileManagerState.selectedFiles || [];
    const editingFile = fileManagerState.editingFileId
      ? fileManagerState.records.find((file) => file._docId === fileManagerState.editingFileId)
      : null;
    if (!editingFile && !files.length) {
      setCloudStatus("Choose at least one file before saving.");
      return;
    }
    if (!fileManagerState.selectedCourseIds.length) {
      setCloudStatus("Link the file to at least one course.");
      return;
    }
    const courseIds = uniqueValues(fileManagerState.selectedCourseIds);
    const category = els.managedFileCategory?.value || "Other";
    const courseLabels = courseIds.map((id) => {
      const course = courseById(id);
      return course ? `${course.id} ${course.name} Credit ${course.credit}` : id;
    });

    if (editingFile) {
      const updatedAtMs = Date.now();
      const updatedFile = normalizeFiles([{
        ...editingFile,
        category,
        courseIds,
        courseLabels,
        updatedAtMs,
      }])[0];
      fileManagerState.records = normalizeFiles(fileManagerState.records.map((item) => (
        item._docId === editingFile._docId ? updatedFile : item
      )));
      if (canWriteCloud()) {
        const { dbRef, update, serverTimestamp } = firebaseState.modules;
        await update(dbRef(firebaseState.db, `files/${editingFile._docId}`), {
          category,
          courseIds,
          courseLabels,
          updatedAt: serverTimestamp(),
        });
      }
      await writeActivity("Edited File", "File", editingFile.name, `Category: ${category}. Linked course(s): ${courseIds.join(", ")}`);
      fileManagerState.editingFileId = "";
      els.fileBuilderDialog?.close("saved");
      render();
      return;
    }

    if (firebaseDisabled || !firebaseState.ready || !firebaseState.user) {
      const createdAtMs = Date.now();
      const records = files.map((file, index) => normalizeFiles([{
        _docId: slugify(`${createdAtMs}-${index}-${file.name}`),
        name: file.name,
        size: file.size,
        contentType: file.type,
        category,
        courseIds,
        courseLabels,
        downloadURL: "",
        storagePath: "",
        uploadedBy: "local-preview",
        createdAtMs,
        updatedAtMs: createdAtMs,
      }])[0]);
      fileManagerState.records.unshift(...records);
      await writeActivity("Uploaded Files", "File", `${records.length} file(s)`, `${courseIds.length} linked course(s).`);
      els.fileBuilderDialog?.close("saved");
      render();
      return;
    }

    try {
      const { dbRef, set, serverTimestamp, storageRef, uploadBytesResumable, getDownloadURL } = firebaseState.modules;
      const now = Date.now();
      const uploadedRecords = [];
      for (const [index, file] of files.entries()) {
        const docId = slugify(`${now}-${index}-${file.name}`);
        const storagePath = `courseFiles/${docId}-${file.name}`;
        const fileRef = storageRef(firebaseState.storage, storagePath);
        await uploadTaskWithTimeout(uploadBytesResumable(fileRef, file), 45000);
        const downloadURL = await getDownloadURL(fileRef);
        const record = {
          name: file.name,
          size: file.size,
          contentType: file.type || "",
          category,
          storagePath,
          downloadURL,
          courseIds,
          courseLabels,
          uploadedBy: firebaseState.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await set(dbRef(firebaseState.db, `files/${docId}`), record);
        uploadedRecords.push({ _docId: docId, ...record, createdAtMs: now, updatedAtMs: now });
      }
      fileManagerState.records = normalizeFiles([
        ...fileManagerState.records.filter((item) => !uploadedRecords.some((record) => record._docId === item._docId)),
        ...uploadedRecords,
      ]);
      await writeActivity("Uploaded Files", "File", `${uploadedRecords.length} file(s)`, `${courseIds.length} linked course(s): ${courseIds.join(", ")}`);
      els.fileBuilderDialog?.close("saved");
      render();
    } catch (error) {
      console.warn("Managed file upload failed.", error);
      setCloudStatus(`File upload failed: ${error.message}`);
    }
  }

  async function deleteManagedFile(docId) {
    if (!state.admin) return;
    const file = fileManagerState.records.find((item) => item._docId === docId);
    if (!file) return;
    const confirmed = await confirmAction({
      eyebrow: "File Manager",
      title: "Delete File",
      message: `Delete "${file.name}" from the File Manager? This removes the stored file and its course associations.`,
      confirmText: "Delete File",
      requirePassword: true,
    });
    if (!confirmed) return;

    fileManagerState.records = fileManagerState.records.filter((item) => item._docId !== docId);
    fileManagerState.emailSelectedFileIds = fileManagerState.emailSelectedFileIds.filter((id) => id !== docId);
    if (canWriteCloud()) {
      const { dbRef, remove, storageRef, deleteObject } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `files/${docId}`));
      if (file.storagePath && firebaseState.storage) {
        await deleteObject(storageRef(firebaseState.storage, file.storagePath)).catch(() => {});
      }
    }
    await writeActivity("Deleted File", "File", file.name, `${file.courseIds.length} linked course association(s) removed.`);
    render();
  }

  function openEmailFileSelector() {
    fileManagerState.emailPickerSelectedIds = [...fileManagerState.emailSelectedFileIds];
    fileManagerState.emailSearch = "";
    if (els.emailFileSearch) els.emailFileSearch.value = "";
    const curriculumOptions = programs();
    if (!fileManagerState.emailCurriculum) fileManagerState.emailCurriculum = state.selectedProgram || curriculumOptions[0]?.name || "";
    renderEmailFileSelector();
    els.fileSelectorDialog?.showModal();
  }

  function renderEmailFileSelector() {
    if (!els.emailFilePicker) return;
    const selected = new Set(fileManagerState.emailPickerSelectedIds);
    const query = fileManagerState.emailSearch;
    const categoryOptions = [
      ["all", "All"],
      ["Transcript", "Transcripts"],
      ["eBook", "eBooks"],
      ["CI", "Course Instructions"],
      ["Other", "Other"],
    ];
    if (els.emailFileTypeFilter) {
      els.emailFileTypeFilter.innerHTML = categoryOptions.map(([value, label]) => `
        <button class="${state.emailFileCategory === value ? "active" : ""}" type="button" data-email-file-category="${escapeAttr(value)}">${escapeHtml(label)}</button>
      `).join("");
    }
    const allMatches = fileManagerState.records
      .filter((file) => !query || fileSearchText(file).includes(query))
      .filter((file) => state.emailFileCategory === "all" || (file.category || "Other") === state.emailFileCategory)
      .sort((a, b) => naturalCompare(a.name, b.name))
      .slice(0, 30);
    els.emailFilePicker.innerHTML = allMatches.map((file) => fileSelectorRow(file, selected.has(file._docId))).join("")
      || `<div class="empty-state">No files match that search.</div>`;

    const curriculumOptions = programs();
    els.emailCurriculumFilter.innerHTML = curriculumOptions.map((program) => `
      <option value="${escapeAttr(program.name)}">${escapeHtml(program.name)}</option>
    `).join("");
    if (!curriculumOptions.some((program) => program.name === fileManagerState.emailCurriculum)) {
      fileManagerState.emailCurriculum = curriculumOptions[0]?.name || "";
    }
    els.emailCurriculumFilter.value = fileManagerState.emailCurriculum;
    const curriculumFiles = filesForProgram(fileManagerState.emailCurriculum);
    els.emailCurriculumFiles.innerHTML = curriculumFiles.map((file) => fileSelectorRow(file, selected.has(file._docId))).join("")
      || `<div class="empty-state">No files are linked to this curriculum's courses yet.</div>`;
    els.emailSelectedFileCount.textContent = String(selected.size);
    els.emailSelectedFiles.innerHTML = [...selected].map((docId) => {
      const file = fileManagerState.records.find((item) => item._docId === docId);
      if (!file) return "";
      return `
        <article class="selected-requirement-row">
          <span class="requirement-order"><i class="bi bi-paperclip"></i></span>
          <span><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(formatBytes(file.size))}</small></span>
          <button class="button" type="button" data-toggle-email-file="${escapeAttr(file._docId)}"><i class="bi bi-x-lg"></i></button>
        </article>
      `;
    }).join("") || `<div class="empty-state">No files selected yet.</div>`;

    els.fileSelectorDialog.querySelectorAll("[data-toggle-email-file]").forEach((button) => {
      button.addEventListener("click", () => toggleEmailPickerFile(button.dataset.toggleEmailFile));
    });
  }

  function fileSelectorRow(file, selected) {
    return `
      <button class="course-picker-row ${selected ? "is-selected" : ""}" type="button" data-toggle-email-file="${escapeAttr(file._docId)}">
        <span><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(file.category || "Other")} - ${escapeHtml(formatBytes(file.size))} - ${escapeHtml((file.courseIds || []).join(", ") || "No linked course")}</small></span>
        <i class="bi ${selected ? "bi-check-circle-fill" : "bi-plus-circle"}"></i>
      </button>
    `;
  }

  function toggleEmailPickerFile(docId) {
    const selected = new Set(fileManagerState.emailPickerSelectedIds);
    if (selected.has(docId)) selected.delete(docId);
    else selected.add(docId);
    fileManagerState.emailPickerSelectedIds = [...selected];
    renderEmailFileSelector();
  }

  function attachEmailFiles() {
    fileManagerState.emailSelectedFileIds = [...new Set(fileManagerState.emailPickerSelectedIds)];
    els.fileSelectorDialog?.close("attached");
    renderSelectedEmailFiles();
  }

  function renderSelectedEmailFiles() {
    if (!els.selectedEmailFiles) return;
    const files = fileManagerState.emailSelectedFileIds
      .map((docId) => fileManagerState.records.find((file) => file._docId === docId))
      .filter(Boolean);
    els.selectedEmailFiles.innerHTML = files.map((file) => `
      <article class="attachment-item">
        <i class="bi bi-paperclip"></i>
        <div>
          <strong>${escapeHtml(file.name)}</strong>
          <span>${escapeHtml(formatBytes(file.size))} ${file.courseIds.length ? `&bull; ${escapeHtml(file.courseIds.join(", "))}` : ""}</span>
        </div>
        <button class="btn btn-sm btn-outline-danger" type="button" data-remove-email-file="${escapeAttr(file._docId)}">Remove</button>
      </article>
    `).join("") || `<div class="empty-state">No files selected for email.</div>`;
    els.selectedEmailFiles.querySelectorAll("[data-remove-email-file]").forEach((button) => {
      button.addEventListener("click", () => {
        fileManagerState.emailSelectedFileIds = fileManagerState.emailSelectedFileIds.filter((docId) => docId !== button.dataset.removeEmailFile);
        renderSelectedEmailFiles();
      });
    });
  }

  async function prepareStudentFileEmail() {
    const email = els.studentEmail?.value.trim() || "";
    validateAdministrationEmailControls();
    const template = activeEmailTemplate();
    const subject = template.subject || defaultStudentEmailTemplate.subject;
    const bodyMarkdown = template.bodyMarkdown || defaultStudentEmailTemplate.bodyMarkdown;
    const selectedFiles = fileManagerState.emailSelectedFileIds
      .map((docId) => fileManagerState.records.find((file) => file._docId === docId))
      .filter(Boolean);
    if (!email || !isValidEmail(email) || !selectedFiles.length) {
      if (els.fileSendMessage) els.fileSendMessage.textContent = "Enter a valid student email and select at least one file.";
      return;
    }
    if (!subject || !bodyMarkdown) {
      if (els.fileSendMessage) els.fileSendMessage.textContent = "Add a subject and email body before sending.";
      return;
    }
    if (firebaseDisabled || !firebaseState.ready || !firebaseState.functions) {
      if (els.fileSendMessage) {
        els.fileSendMessage.textContent = "Email backend is not connected in local preview. Deploy the Firebase Cloud Function before sending live email.";
      }
      state.emailDeliveries.unshift({
        _docId: `local-${Date.now()}`,
        recipient: email,
        templateId: template._docId,
        templateName: template.name,
        fileCount: selectedFiles.length,
        status: "prepared",
        createdByName: currentUserDisplayName() || "Local Preview",
        createdAtMs: Date.now(),
      });
      await writeActivity("Prepared File Email", "Student Email", email, `${selectedFiles.length} file(s) selected: ${selectedFiles.map((file) => file.name).join(", ")}`);
      renderAdministration();
      return;
    }
    try {
      if (els.fileSendMessage) els.fileSendMessage.textContent = "Sending email...";
      const sendStudentFilesEmail = firebaseState.modules.httpsCallable(firebaseState.functions, "sendStudentFilesEmail");
      const result = await sendStudentFilesEmail({
        recipientEmail: email,
        selectedFileIds: selectedFiles.map((file) => file._docId),
        subject,
        bodyMarkdown,
      });
      const message = result?.data?.message || `Email sent to ${email}.`;
      if (els.fileSendMessage) els.fileSendMessage.textContent = message;
      await recordStudentFileDelivery({
        recipient: email,
        templateId: template._docId,
        templateName: template.name,
        fileCount: selectedFiles.length,
        status: "success",
        error: "",
      });
      fileManagerState.emailSelectedFileIds = [];
      renderSelectedEmailFiles();
    } catch (error) {
      console.warn("Student file email failed.", error);
      if (els.fileSendMessage) els.fileSendMessage.textContent = firebaseErrorMessage(error);
      await recordStudentFileDelivery({
        recipient: email,
        templateId: template._docId,
        templateName: template.name,
        fileCount: selectedFiles.length,
        status: "failed",
        error: firebaseErrorMessage(error),
      });
    }
    renderAdministration();
  }

  async function recordStudentFileDelivery(delivery) {
    const record = {
      ...delivery,
      createdByUid: firebaseState.user?.uid || "preview",
      createdByName: currentUserDisplayName() || "Local Preview",
      createdAtMs: Date.now(),
    };
    state.emailDeliveries.unshift({ _docId: `local-${record.createdAtMs}`, ...record });
    if (canWriteCloud()) {
      const { dbRef, push, set, serverTimestamp } = firebaseState.modules;
      const deliveryRef = push(dbRef(firebaseState.db, "emailDeliveries"));
      await set(deliveryRef, {
        ...record,
        _docId: deliveryRef.key,
        createdAt: serverTimestamp(),
      });
    }
  }

  function renderEmailTemplateControls() {
    const templates = normalizedEmailTemplates();
    if (!templates.some((template) => template._docId === emailTemplateState.activeTemplateId)) {
      emailTemplateState.activeTemplateId = templates[0]?._docId || defaultStudentEmailTemplate._docId;
    }
    if (els.emailTemplateSelect) {
      els.emailTemplateSelect.innerHTML = templates.map((template) => `
        <option value="${escapeAttr(template._docId)}">${escapeHtml(template.name)}</option>
      `).join("");
      els.emailTemplateSelect.value = emailTemplateState.activeTemplateId;
    }
  }

  function openEmailTemplateEditor() {
    if (!state.admin) return;
    emailTemplateState.editorTemplateId = emailTemplateState.activeTemplateId || normalizedEmailTemplates()[0]?._docId || defaultStudentEmailTemplate._docId;
    renderEmailTemplateEditor();
    els.emailContentDialog?.showModal();
  }

  function renderEmailTemplateEditor() {
    const templates = normalizedEmailTemplates();
    if (!templates.some((template) => template._docId === emailTemplateState.editorTemplateId)) {
      emailTemplateState.editorTemplateId = templates[0]?._docId || defaultStudentEmailTemplate._docId;
    }
    if (els.emailTemplateEditorSelect) {
      els.emailTemplateEditorSelect.innerHTML = templates.map((template) => `
        <option value="${escapeAttr(template._docId)}">${escapeHtml(template.name)}</option>
      `).join("");
      els.emailTemplateEditorSelect.value = emailTemplateState.editorTemplateId;
    }
    renderEmailTemplateEditorFields();
  }

  function renderEmailTemplateEditorFields() {
    const template = activeEmailTemplate(emailTemplateState.editorTemplateId);
    if (els.emailTemplateNameInput) els.emailTemplateNameInput.value = template.name || "";
    if (els.emailSubjectInput) els.emailSubjectInput.value = template.subject || "";
    if (els.emailContentInput) els.emailContentInput.value = template.bodyMarkdown || "";
  }

  function addEmailTemplateDraft() {
    const docId = slugify(`email-template-${Date.now()}`);
    const draft = {
      ...defaultStudentEmailTemplate,
      _docId: docId,
      name: "New Email Template",
      subject: "New Eden Course Materials",
      bodyMarkdown: "Hello,\n\nYour requested New Eden files are attached.",
      createdAtMs: Date.now(),
      updatedAtMs: Date.now(),
    };
    emailTemplateState.templates = [...normalizedEmailTemplates(), draft];
    emailTemplateState.editorTemplateId = docId;
    emailTemplateState.activeTemplateId = docId;
    renderEmailTemplateControls();
    renderEmailTemplateEditor();
  }

  async function saveEmailTemplate() {
    const templateId = emailTemplateState.editorTemplateId || defaultStudentEmailTemplate._docId;
    const name = els.emailTemplateNameInput?.value.trim() || "";
    const subject = els.emailSubjectInput?.value.trim() || "";
    const bodyMarkdown = els.emailContentInput?.value.trim() || "";
    if (!name) {
      setCloudStatus("Email template name cannot be blank.");
      return;
    }
    if (!subject) {
      setCloudStatus("Email subject cannot be blank.");
      return;
    }
    if (!bodyMarkdown) {
      setCloudStatus("Email content cannot be blank.");
      return;
    }
    const templates = normalizedEmailTemplates();
    const nextTemplate = normalizeEmailTemplate({
      ...(templates.find((template) => template._docId === templateId) || {}),
      _docId: templateId,
      name,
      subject,
      bodyMarkdown,
      updatedAtMs: Date.now(),
    });
    emailTemplateState.templates = templates.map((template) => (
      template._docId === templateId ? nextTemplate : template
    ));
    if (!emailTemplateState.templates.some((template) => template._docId === templateId)) {
      emailTemplateState.templates.push(nextTemplate);
    }
    emailTemplateState.activeTemplateId = templateId;
    await saveStudentEmailTemplates();
    els.emailContentDialog?.close("saved");
  }

  async function saveStudentEmailTemplates(action = "Updated Email Template", details = "Updated shared email subject/content template.") {
    if (!state.admin) return;
    renderEmailTemplateControls();

    if (canWriteCloud()) {
      const { dbRef, update, serverTimestamp } = firebaseState.modules;
      await update(dbRef(firebaseState.db, "emailTemplates/studentFiles"), {
        templates: Object.fromEntries(normalizedEmailTemplates().map((template) => [template._docId, template])),
        activeTemplateId: emailTemplateState.activeTemplateId,
        updatedBy: firebaseState.user?.uid || "",
        updatedAt: serverTimestamp(),
      });
    }

    await writeActivity(action, "Email Dispatch Template", activeEmailTemplate().name, details);
    setCloudStatus("Saved email dispatch template");
    render();
  }

  async function deleteEmailTemplate() {
    if (!state.admin) return;
    const templates = normalizedEmailTemplates();
    const templateId = emailTemplateState.editorTemplateId || emailTemplateState.activeTemplateId;
    const template = templates.find((item) => item._docId === templateId);
    if (!template) return;
    if (templates.length <= 1) {
      await alertAction({
        eyebrow: "Email Dispatch",
        title: "Template Required",
        message: "At least one email template must remain available for Email Dispatch.",
        confirmText: "OK",
      });
      return;
    }
    const confirmed = await confirmAction({
      eyebrow: "Email Dispatch",
      title: "Delete Email Template",
      message: `Delete "${template.name}"? This removes the shared template for everyone.`,
      confirmText: "Delete Template",
    });
    if (!confirmed) return;

    emailTemplateState.templates = templates.filter((item) => item._docId !== templateId);
    emailTemplateState.activeTemplateId = emailTemplateState.templates[0]?._docId || defaultStudentEmailTemplate._docId;
    emailTemplateState.editorTemplateId = emailTemplateState.activeTemplateId;
    await saveStudentEmailTemplates("Deleted Email Template", `Deleted template "${template.name}".`);
    renderEmailTemplateEditor();
  }

  function renderTranscripts() {
    if (!els.transcriptProgram) return;
    const curriculumOptions = programs();
    if (!state.transcriptSelectedProgram) {
      state.transcriptSelectedProgram = state.selectedProgram || curriculumOptions[0]?.name || "";
    }
    els.transcriptProgram.innerHTML = curriculumOptions.map((program) => `
      <option value="${escapeAttr(program.name)}">${escapeHtml(program.name)}</option>
    `).join("");
    els.transcriptProgram.value = state.transcriptSelectedProgram;
    renderTranscriptCoursePicker();
    renderTranscriptRows();
    renderTranscriptDrafts();
    validateTranscriptControls();
  }

  function renderTranscriptCoursePicker() {
    if (!els.transcriptCoursePicker) return;
    const selectedIds = new Set(state.transcriptRows.map((row) => row.courseId));
    const query = state.transcriptCourseSearch;
    const matches = state.courses
      .filter((course) => !selectedIds.has(course.id))
      .filter((course) => !query || matchesText(course, query))
      .slice(0, 8);

    els.transcriptCoursePicker.innerHTML = matches.map((course) => `
      <button class="course-picker-row" type="button" data-add-transcript-course="${escapeAttr(course.id)}">
        <span>
          <strong>${escapeHtml(course.name)}</strong>
          <small>${escapeHtml(course.id)} &bull; Credit ${escapeHtml(course.credit)}</small>
        </span>
        <i class="bi bi-plus-circle"></i>
      </button>
    `).join("") || `<div class="empty-state">Search the course catalog by name or course number.</div>`;
  }

  function renderTranscriptRows() {
    if (!els.transcriptCourseRows) return;
    if (els.transcriptEmpty) els.transcriptEmpty.hidden = Boolean(state.transcriptRows.length);
    els.transcriptCourseRows.innerHTML = state.transcriptRows.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(row.courseId)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.credit)}</td>
        <td>
          <input class="form-control form-control-sm transcript-percent-input" data-transcript-percent="${escapeAttr(row.key)}" value="${escapeAttr(row.percent || "")}" placeholder="96.5 or PASS" />
        </td>
        <td>${escapeHtml(transcriptGrade(row.percent))}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" type="button" data-remove-transcript-course="${escapeAttr(row.key)}">Remove</button>
        </td>
      </tr>
    `).join("");
    renderTranscriptTotals();
    renderTranscriptCoursePicker();
  }

  function renderTranscriptDrafts() {
    if (!els.transcriptDraftList) return;
    const drafts = state.transcriptDrafts
      .slice()
      .sort((a, b) => Number(b.updatedAtMs || b.createdAtMs || 0) - Number(a.updatedAtMs || a.createdAtMs || 0))
      .slice(0, 8);
    els.transcriptDraftList.innerHTML = drafts.map((draft) => `
      <article class="transcript-draft-item">
        <div>
          <strong>${escapeHtml(draft.studentName || "Unnamed Student")}</strong>
          <small>${escapeHtml(draft.program || "No curriculum selected")} &bull; ${escapeHtml(formatTimestamp(draft.updatedAtMs || draft.createdAtMs))}</small>
        </div>
        <div class="transcript-draft-actions">
          <button class="btn btn-sm btn-outline-eden" type="button" data-load-transcript-draft="${escapeAttr(draft._docId)}">Open</button>
          <button class="btn btn-sm btn-outline-danger admin-only" type="button" data-delete-transcript-draft="${escapeAttr(draft._docId)}">Delete</button>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No transcript drafts have been saved yet.</div>`;

    els.transcriptDraftList.querySelectorAll("[data-load-transcript-draft]").forEach((button) => {
      button.addEventListener("click", () => loadTranscriptDraft(button.dataset.loadTranscriptDraft));
    });
    els.transcriptDraftList.querySelectorAll("[data-delete-transcript-draft]").forEach((button) => {
      button.addEventListener("click", () => deleteTranscriptDraft(button.dataset.deleteTranscriptDraft));
    });
  }

  function renderTranscriptTotals() {
    const totalCredits = state.transcriptRows.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    if (els.transcriptTotalCredits) els.transcriptTotalCredits.textContent = String(totalCredits);
    if (els.transcriptGpa) els.transcriptGpa.textContent = transcriptGpa(state.transcriptRows);
    validateTranscriptControls();
  }

  function validateTranscriptControls() {
    const nameOk = Boolean(els.transcriptStudentName?.value.trim());
    const idOk = Boolean(els.transcriptStudentId?.value.trim());
    const dob = els.transcriptDob?.value || "";
    const from = els.transcriptFrom?.value || "";
    const to = els.transcriptTo?.value || "";
    const dobOk = Boolean(dob);
    const fromOk = Boolean(from);
    const toOk = Boolean(to);
    const dobBeforeFrom = !dob || !from || dob <= from;
    const fromBeforeTo = !from || !to || from <= to;
    const rowsOk = Boolean(state.transcriptRows.length);
    const percentsOk = state.transcriptRows.every((row) => String(row.percent || "").trim());

    setFieldError(els.transcriptDob, els.transcriptDobError, dobBeforeFrom ? "" : "Date of birth must be before or on Attended From.");
    setFieldError(els.transcriptFrom, els.transcriptFromError, dobBeforeFrom ? "" : "Attended From must be after Date of Birth.");
    setFieldError(els.transcriptTo, els.transcriptToError, fromBeforeTo ? "" : "Attended To must be after or on Attended From.");

    const canSave = nameOk && idOk && dobOk && fromOk && toOk && dobBeforeFrom && fromBeforeTo && rowsOk && percentsOk;
    [
      els.printTranscript,
      els.saveTranscriptToComputer,
      els.saveTranscriptToFileManager,
      els.saveTranscriptBoth,
    ].forEach((button) => {
      if (button) button.disabled = !canSave;
    });
    if (els.saveTranscriptDraft) {
      els.saveTranscriptDraft.disabled = !(nameOk && idOk && rowsOk);
    }
    return canSave;
  }

  function setFieldError(input, errorEl, message) {
    if (input) input.classList.toggle("is-invalid", Boolean(message));
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
  }

  function isValidEmail(value) {
    const email = String(value || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateAdministrationEmailControls() {
    const studentEmail = els.studentEmail?.value.trim() || "";
    const testEmail = els.testEmailAddress?.value.trim() || "";
    const studentMessage = !studentEmail ? "" : isValidEmail(studentEmail) ? "" : "Enter a valid student email address.";
    const testMessage = !testEmail ? "" : isValidEmail(testEmail) ? "" : "Enter a valid test email address.";
    setFieldError(els.studentEmail, els.studentEmailError, studentMessage);
    setFieldError(els.testEmailAddress, els.testEmailError, testMessage);
    const sendButton = els.fileSendForm?.querySelector('button[type="submit"]');
    if (sendButton) sendButton.disabled = !studentEmail || Boolean(studentMessage);
    if (els.sendTestEmailButton) els.sendTestEmailButton.disabled = !testEmail || Boolean(testMessage);
  }

  function validateCurriculumBuilder() {
    const ok = Boolean(els.curriculumBuilderProgram?.value.trim()) && Boolean(els.curriculumBuilderName?.value.trim());
    if (els.saveCurriculumBuilder) els.saveCurriculumBuilder.disabled = !ok;
    return ok;
  }

  function validateProgramBuilder() {
    const ok = Boolean(els.programBuilderName?.value.trim());
    if (els.saveProgramBuilder) els.saveProgramBuilder.disabled = !ok;
    return ok;
  }

  async function saveTranscriptDraft() {
    if (!state.transcriptRows.length) {
      await alertAction({
        eyebrow: "Transcripts",
        title: "No Courses Added",
        message: "Add courses manually or import a curriculum before saving a transcript draft.",
        confirmText: "OK",
      });
      return;
    }
    const draft = currentTranscriptDraft();
    const existing = state.transcriptDrafts.find((item) => item._docId === state.activeTranscriptDraftId)
      || state.transcriptDrafts.find((item) => (
        item.studentId
        && draft.studentId
        && item.studentId.toLowerCase() === draft.studentId.toLowerCase()
        && item.program === draft.program
      ));
    draft._docId = existing?._docId || slugify(`${draft.studentId || draft.studentName || "transcript"}-${draft.program || "program"}`);
    draft.createdAtMs = existing?.createdAtMs || Date.now();
    draft.updatedAtMs = Date.now();
    state.activeTranscriptDraftId = draft._docId;

    const index = state.transcriptDrafts.findIndex((item) => item._docId === draft._docId);
    if (index >= 0) state.transcriptDrafts[index] = draft;
    else state.transcriptDrafts.push(draft);

    if (canWriteCloud()) {
      const { dbRef, set, serverTimestamp } = firebaseState.modules;
      await set(dbRef(firebaseState.db, `transcripts/${draft._docId}`), {
        ...draft,
        updatedAt: serverTimestamp(),
      });
    }

    await writeActivity(existing ? "Updated Transcript Draft" : "Saved Transcript Draft", "Transcript", draft.studentName || draft.studentId || "Unnamed Student", `${draft.rows.length} course row(s) for ${draft.program || "No curriculum"}`);
    renderTranscriptDrafts();
  }

  function currentTranscriptDraft() {
    const manualProgram = els.transcriptCurriculumName?.value.trim() || "";
    return {
      studentName: els.transcriptStudentName?.value.trim() || "",
      studentId: els.transcriptStudentId?.value.trim() || "",
      dob: els.transcriptDob?.value || "",
      attendedFrom: els.transcriptFrom?.value || "",
      attendedTo: els.transcriptTo?.value || "",
      graduated: Boolean(els.transcriptGraduated?.checked),
      program: manualProgram || state.transcriptSelectedProgram || "",
      importedProgram: state.transcriptSelectedProgram || "",
      rows: state.transcriptRows.map((row) => ({ ...row })),
      totalCredits: Number(els.transcriptTotalCredits?.textContent || 0),
      gpa: els.transcriptGpa?.textContent || "0.0",
      savedByUid: firebaseState.user?.uid || "preview",
      savedByName: currentUserDisplayName() || "Local Preview",
    };
  }

  function loadTranscriptDraft(docId) {
    const draft = state.transcriptDrafts.find((item) => item._docId === docId);
    if (!draft) return;
    if (els.transcriptStudentName) els.transcriptStudentName.value = draft.studentName || "";
    if (els.transcriptStudentId) els.transcriptStudentId.value = draft.studentId || "";
    if (els.transcriptDob) els.transcriptDob.value = draft.dob || "";
    if (els.transcriptFrom) els.transcriptFrom.value = draft.attendedFrom || "";
    if (els.transcriptTo) els.transcriptTo.value = draft.attendedTo || "";
    if (els.transcriptGraduated) els.transcriptGraduated.checked = draft.graduated !== false;
    if (els.transcriptCurriculumName) els.transcriptCurriculumName.value = draft.program || "";
    state.transcriptSelectedProgram = draft.importedProgram || draft.program || state.transcriptSelectedProgram;
    state.activeTranscriptDraftId = draft._docId;
    state.transcriptRows = (draft.rows || []).map((row) => ({
      ...row,
      key: row.key || slugify(`${row.courseId || row.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`),
    }));
    renderTranscripts();
  }

  async function deleteTranscriptDraft(docId) {
    if (!state.admin) return;
    const draft = state.transcriptDrafts.find((item) => item._docId === docId);
    if (!draft) return;
    const confirmed = await confirmAction({
      eyebrow: "Transcripts",
      title: "Delete Transcript Draft?",
      message: `Delete the saved transcript draft for "${draft.studentName || "Unnamed Student"}"? This will not remove generated PDF files you already downloaded.`,
      confirmText: "Delete Draft",
    });
    if (!confirmed) return;
    state.transcriptDrafts = state.transcriptDrafts.filter((item) => item._docId !== docId);
    if (state.activeTranscriptDraftId === docId) state.activeTranscriptDraftId = "";
    renderTranscriptDrafts();
    if (canWriteCloud()) {
      const { dbRef, remove } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `transcripts/${docId}`));
    }
    await writeActivity("Deleted Transcript Draft", "Transcript", draft.studentName || draft.studentId || "Unnamed Student", `${draft.rows?.length || 0} course row(s) removed from saved drafts.`);
  }

  function openTranscriptImportDialog() {
    renderTranscriptManagedImportList();
    els.transcriptImportDialog?.showModal();
  }

  function renderTranscriptManagedImportList() {
    if (!els.transcriptManagedImportList) return;
    const files = fileManagerState.records
      .filter((file) => (
        file.category === "Transcript"
        || file.contentType === "application/pdf"
        || file.name.toLowerCase().endsWith(".pdf")
      ))
      .sort((a, b) => Number(b.createdAtMs || b.updatedAtMs || 0) - Number(a.createdAtMs || a.updatedAtMs || 0))
      .slice(0, 20);
    els.transcriptManagedImportList.innerHTML = files.map((file) => `
      <button class="transcript-managed-file-row" type="button" data-import-managed-transcript="${escapeAttr(file._docId)}">
        <span>
          <strong>${escapeHtml(file.name)}</strong>
          <small>${escapeHtml([file.category || "File", formatBytes(file.size), formatTimestamp(file.createdAtMs || file.updatedAtMs)].filter(Boolean).join(" - "))}</small>
        </span>
        <i class="bi bi-box-arrow-in-down"></i>
      </button>
    `).join("") || `<div class="empty-state">No transcript PDFs are currently saved in File Manager.</div>`;
    els.transcriptManagedImportList.querySelectorAll("[data-import-managed-transcript]").forEach((button) => {
      button.addEventListener("click", () => importManagedTranscriptPdf(button.dataset.importManagedTranscript));
    });
  }

  async function importManagedTranscriptPdf(docId) {
    const file = fileManagerState.records.find((item) => item._docId === docId);
    if (!file?.downloadURL && !file?.storagePath) {
      await alertAction({
        eyebrow: "Transcripts",
        title: "File Missing",
        message: "That File Manager record does not have a downloadable PDF URL or Storage path yet.",
        confirmText: "OK",
      });
      return;
    }
    try {
      els.transcriptImportDialog?.close("file-manager");
      setCloudStatus(`Importing transcript from File Manager: ${file.name}`);
      const blob = await downloadManagedFileBlob(file);
      const importedFile = new File([blob], file.name, { type: file.contentType || "application/pdf" });
      await importTranscriptPdf(importedFile);
    } catch (error) {
      console.warn("File Manager transcript import failed.", error);
      const message = storageCorsMessage(error);
      await alertAction({
        eyebrow: "Transcripts",
        title: "Could Not Import File",
        message,
        confirmText: "OK",
      });
      setCloudStatus("File Manager transcript import failed.");
    }
  }

  async function downloadManagedFileBlob(file) {
    const errors = [];
    if (file?.downloadURL) {
      try {
        const response = await fetch(`${file.downloadURL}${file.downloadURL.includes("?") ? "&" : "?"}cacheBust=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
        return response.blob();
      } catch (error) {
        errors.push(error);
      }
    }
    if (file?.storagePath && firebaseState.storage && firebaseState.modules?.getBlob) {
      try {
        const { storageRef, getBlob } = firebaseState.modules;
        return await getBlob(storageRef(firebaseState.storage, file.storagePath));
      } catch (error) {
        errors.push(error);
      }
    }
    if (!file?.downloadURL && !file?.storagePath) throw new Error("No downloadable file URL or Storage path is available.");
    throw errors[0] || new Error("The file could not be downloaded from Firebase Storage.");
  }

  function storageCorsMessage(error) {
    const message = error?.message || "The selected File Manager transcript could not be downloaded or parsed.";
    if (/cors|access-control-allow-origin|retry-limit|max retry|failed to fetch|net::err_failed/i.test(message)) {
      return "Firebase Storage blocked the browser from downloading this PDF for import. Publish the Storage CORS settings in storage-cors.json, then try importing from File Manager again.";
    }
    return message;
  }

  function openTranscriptSaveDialog() {
    if (!validateTranscriptControls()) {
      alertAction({
        eyebrow: "Transcripts",
        title: "Transcript Not Ready",
        message: "Complete student information, correct date order, add courses, and fill every Percent field before saving the transcript PDF.",
        confirmText: "OK",
      });
      return;
    }
    els.transcriptSaveDialog?.showModal();
  }

  async function saveTranscriptPdf(destination) {
    if (!validateTranscriptControls()) {
      await alertAction({
        eyebrow: "Transcripts",
        title: "Transcript Not Ready",
        message: "Complete student information, correct date order, add courses, and fill every Percent field before saving the transcript PDF.",
        confirmText: "OK",
      });
      return;
    }
    try {
      els.transcriptSaveDialog?.close(destination);
      setCloudStatus("Generating transcript PDF");
      const blob = await generateTranscriptPdfBlob();
      const filename = transcriptPdfFilename();
      if (destination === "computer" || destination === "both") {
        downloadBlob(blob, filename);
      }
      if (destination === "file-manager" || destination === "both") {
        await saveTranscriptPdfToFileManager(blob, filename);
      } else {
        await writeActivity("Saved Transcript PDF", "Transcript", els.transcriptStudentName?.value || filename, "Downloaded transcript PDF to computer.");
      }
      setCloudStatus(destination === "file-manager" ? "Transcript PDF saved to File Manager." : "Transcript PDF ready.");
    } catch (error) {
      console.warn("Transcript PDF generation failed.", error);
      await alertAction({
        eyebrow: "Transcripts",
        title: "Could Not Save PDF",
        message: error?.message || "The transcript PDF could not be generated.",
        confirmText: "OK",
      });
      setCloudStatus("Transcript PDF save failed.");
    }
  }

  async function saveTranscriptPdfToFileManager(blob, filename) {
    const now = Date.now();
    const docId = slugify(`${now}-${filename}`);
    const recordBase = {
      _docId: docId,
      name: filename,
      size: blob.size,
      contentType: "application/pdf",
      category: "Transcript",
      courseIds: [],
      courseLabels: [],
      uploadedByUid: firebaseState.user?.uid || "preview",
      uploadedByName: currentUserDisplayName() || "Local Preview",
      createdAtMs: now,
      updatedAtMs: now,
    };

    if (!canWriteCloud()) {
      const localRecord = normalizeFiles([{
        ...recordBase,
        downloadURL: URL.createObjectURL(blob),
        storagePath: "",
      }])[0];
      fileManagerState.records.unshift(localRecord);
      await writeActivity("Saved Transcript PDF", "Transcript", filename, "Saved transcript PDF to local preview File Manager.");
      render();
      return localRecord;
    }

    const { dbRef, set, serverTimestamp, storageRef, uploadBytesResumable, getDownloadURL } = firebaseState.modules;
    const storagePath = `courseFiles/transcripts/${docId}-${filename}`;
    const fileRef = storageRef(firebaseState.storage, storagePath);
    await uploadTaskWithTimeout(uploadBytesResumable(fileRef, blob, { contentType: "application/pdf" }), 45000);
    const downloadURL = await getDownloadURL(fileRef);
    const record = {
      name: filename,
      size: blob.size,
      contentType: "application/pdf",
      category: "Transcript",
      storagePath,
      downloadURL,
      courseIds: [],
      courseLabels: [],
      uploadedByUid: firebaseState.user?.uid || "",
      uploadedByName: currentUserDisplayName(),
      transcriptDraftId: state.activeTranscriptDraftId || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await set(dbRef(firebaseState.db, `files/${docId}`), record);
    fileManagerState.records = normalizeFiles([{ _docId: docId, ...record, createdAtMs: now, updatedAtMs: now }, ...fileManagerState.records]);
    await writeActivity("Saved Transcript PDF", "Transcript", filename, "Saved to File Manager as a standalone transcript file.");
    render();
    return record;
  }

  async function importTranscriptPdf(file) {
    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      await alertAction({
        eyebrow: "Transcripts",
        title: "PDF Required",
        message: "Choose a transcript PDF file to import.",
        confirmText: "OK",
      });
      return;
    }
    try {
      setCloudStatus(`Importing transcript PDF: ${file.name}`);
      const parsed = parseTranscriptPdfText(await extractPdfText(file));
      applyImportedTranscript(parsed);
      await writeActivity("Imported Transcript PDF", "Transcript", parsed.studentName || parsed.studentId || file.name, `${parsed.rows.length} course row(s) reconstructed.`);
      setCloudStatus("Transcript PDF imported for editing.");
    } catch (error) {
      console.warn("Transcript PDF import failed.", error);
      await alertAction({
        eyebrow: "Transcripts",
        title: "Could Not Import PDF",
        message: error?.message || "The PDF could not be read. Image-only scans need OCR before the archive can rebuild editable rows.",
        confirmText: "OK",
      });
      setCloudStatus("PDF import failed.");
    }
  }

  async function extractPdfText(file) {
    const pdfjs = await loadPdfJs();
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const lines = [];
    const textParts = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      textParts.push(...content.items.map((item) => item.str).filter(Boolean));
      const grouped = new Map();
      content.items.forEach((item) => {
        const y = Math.round(item.transform?.[5] || 0);
        const bucket = Array.from(grouped.keys()).find((key) => Math.abs(key - y) <= 2) ?? y;
        const row = grouped.get(bucket) || [];
        row.push({ x: item.transform?.[4] || 0, text: item.str || "" });
        grouped.set(bucket, row);
      });
      Array.from(grouped.entries())
        .sort((a, b) => b[0] - a[0])
        .forEach(([, row]) => {
          const line = row
            .sort((a, b) => a.x - b.x)
            .map((item) => item.text.trim())
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          if (line) lines.push(line);
        });
    }
    if (!lines.length && !textParts.length) {
      throw new Error("No readable transcript text was found in that PDF.");
    }
    return { lines, text: textParts.join(" ").replace(/\s+/g, " ").trim() };
  }

  async function loadPdfJs() {
    if (window.pdfjsLib) return window.pdfjsLib;
    const pdfjs = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";
    window.pdfjsLib = pdfjs;
    return pdfjs;
  }

  function parseTranscriptPdfText({ lines, text }) {
    const fullText = text || lines.join(" ");
    const studentName = matchTranscriptField(fullText, /Name:\s*(.*?)(?=\s+Student ID:|$)/i);
    const studentId = matchTranscriptField(fullText, /Student ID:\s*(.*?)(?=\s+Date of Birth:|$)/i);
    const dob = normalizeTranscriptInputDate(matchTranscriptField(fullText, /Date of Birth:\s*(.*?)(?=\s+Date Created:|$)/i));
    const program = matchTranscriptField(fullText, /Program\s+(.*?)(?=\s+Attended From\/To|$)/i);
    const attended = matchTranscriptField(fullText, /Attended From\/To\s+([^\s]+(?:\s*\/\s*[^\s]+)?)/i);
    const [attendedFrom, attendedTo] = attended.split("/").map((part) => normalizeTranscriptInputDate(part));
    const rows = parseTranscriptCourseRows(lines, fullText);
    if (!studentName && !studentId && !program && !rows.length) {
      throw new Error("No New Eden transcript fields were found in that PDF.");
    }
    return {
      studentName,
      studentId,
      dob,
      attendedFrom: attendedFrom || "",
      attendedTo: attendedTo || "",
      graduated: !/\bnot graduated\b/i.test(fullText),
      program: normalizeImportedProgram(program),
      rows,
    };
  }

  function parseTranscriptCourseRows(lines, fullText) {
    const rows = [];
    const consume = (courseId, title, credit, percent) => {
      const course = state.courses.find((item) => String(item.id) === String(courseId));
      rows.push({
        key: slugify(`${courseId || title}-${Date.now()}-${Math.random().toString(16).slice(2)}`),
        courseId: course?.id || courseId || "",
        name: course?.name || title || "Course",
        credit: course?.credit || credit || "",
        percent: String(percent || "").replace("%", ""),
      });
    };
    lines.forEach((line) => {
      const match = line.match(/^NES\s+([A-Za-z0-9.-]+)\s+(.+?)\s+(\d+(?:\.\d+)?)\s+([0-9.]+%?|PASS)?\s*(A|B|C|D|PASS)?$/i);
      if (match) consume(match[1], match[2], match[3], match[4]);
    });
    if (!rows.length) {
      const rowPattern = /NES\s+([A-Za-z0-9.-]+)\s+(.+?)\s+(\d+(?:\.\d+)?)\s+([0-9.]+%?|PASS)\s+(A|B|C|D|PASS)/gi;
      let match = rowPattern.exec(fullText);
      while (match) {
        consume(match[1], match[2], match[3], match[4]);
        match = rowPattern.exec(fullText);
      }
    }
    return dedupeTranscriptRows(rows);
  }

  function applyImportedTranscript(parsed) {
    if (els.transcriptStudentName) els.transcriptStudentName.value = parsed.studentName || "";
    if (els.transcriptStudentId) els.transcriptStudentId.value = parsed.studentId || "";
    if (els.transcriptDob) els.transcriptDob.value = parsed.dob || "";
    if (els.transcriptFrom) els.transcriptFrom.value = parsed.attendedFrom || "";
    if (els.transcriptTo) els.transcriptTo.value = parsed.attendedTo || "";
    if (els.transcriptGraduated) els.transcriptGraduated.checked = parsed.graduated !== false;
    if (parsed.program) state.transcriptSelectedProgram = parsed.program;
    state.transcriptRows = parsed.rows;
    state.activeTranscriptDraftId = "";
    renderTranscripts();
  }

  function importTranscriptCurriculum() {
    const rows = curriculumForProgram(state.transcriptSelectedProgram)
      .map((row) => transcriptRowFromCourse(findCourseForCurriculumRow(row), row))
      .filter(Boolean);
    state.transcriptRows = dedupeTranscriptRows([...state.transcriptRows, ...rows]);
    renderTranscriptRows();
  }

  function addTranscriptCourse(courseId) {
    const course = state.courses.find((item) => item.id === courseId);
    const row = transcriptRowFromCourse(course);
    if (!row) return;
    state.transcriptRows = dedupeTranscriptRows([...state.transcriptRows, row]);
    if (els.transcriptCourseSearch) els.transcriptCourseSearch.value = "";
    state.transcriptCourseSearch = "";
    renderTranscriptRows();
  }

  function findCourseForCurriculumRow(row) {
    return state.courses.find((course) => (
      String(course.id) === String(row.courseId)
      || stripCredit(row.courseLabel).toLowerCase() === String(course.name || "").toLowerCase()
    ));
  }

  function transcriptRowFromCourse(course, row = {}) {
    if (!course && !row.courseId && !row.courseLabel) return null;
    const courseId = course?.id || row.courseId || "";
    const name = course?.name || stripCredit(row.courseLabel) || "Course";
    return {
      key: slugify(`${courseId || name}-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      courseId,
      name,
      credit: course?.credit || row.credit || "",
      percent: row.percent || "",
    };
  }

  function dedupeTranscriptRows(rows) {
    const seen = new Set();
    return rows.filter((row) => {
      const key = String(row.courseId || row.name).toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function transcriptGrade(percent) {
    const value = String(percent || "").trim();
    if (!value) return "";
    if (/^p(ass)?$/i.test(value)) return "PASS";
    const score = Number(value);
    if (Number.isNaN(score)) return "PASS";
    if (score >= 90 && score <= 100) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 65) return "D";
    return "PASS";
  }

  function transcriptGpa(rows) {
    const scores = rows
      .map((row) => Number(String(row.percent || "").replace("%", "")))
      .filter((score) => !Number.isNaN(score) && score <= 100);
    if (!scores.length) return "0.0";
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (average >= 93) return "4.0";
    if (average >= 90) return "3.7";
    if (average >= 87) return "3.3";
    if (average >= 83) return "3.0";
    if (average >= 80) return "2.7";
    if (average >= 77) return "2.3";
    if (average >= 73) return "2.0";
    if (average >= 70) return "1.7";
    if (average >= 67) return "1.3";
    if (average >= 65) return "1.0";
    return "0.0";
  }

  async function generateTranscriptPdfBlob() {
    const { jsPDF } = await loadJsPdf();
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const innerLeft = 38;
    const innerRight = pageWidth - 38;
    const totalPagesToken = "{total_pages_count_string}";
    const logoUrl = new URL("assets/transcript/logo-no-tagline-mark.png", window.location.href).href;
    const sealUrl = new URL("assets/transcript/seal1.png", window.location.href).href;
    const signatureUrl = new URL("assets/transcript/signature.png", window.location.href).href;
    const [logoData, sealData, signatureData] = await Promise.all([
      imageToDataUrl(logoUrl),
      imageToDataUrl(sealUrl),
      imageToDataUrl(signatureUrl),
    ]);
    const text = (value) => String(value || "");
    const darkGreen = "#0f3f27";
    const softGreen = "#f0f4eb";
    const gold = "#b79a4a";
    const paleGold = "#d9c98f";
    const gray = "#30352f";
    const programName = transcriptDisplayProgram();
    const today = new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
    const attended = `${dateIsoForTranscript(els.transcriptFrom?.value) || "NA"} to ${dateIsoForTranscript(els.transcriptTo?.value) || "NA"}`;

    const drawFrame = () => {
      const sheetX = 16;
      const sheetY = 16;
      const sheetW = pageWidth - 32;
      const sheetH = pageHeight - 32;
      const borderX = 28;
      const borderY = 28;
      const borderW = pageWidth - 56;
      const borderH = pageHeight - 56;
      doc.setFillColor(darkGreen);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setFillColor("#fffefb");
      doc.rect(sheetX, sheetY, sheetW, sheetH, "F");
      doc.setFillColor(darkGreen);
      const notch = 18;
      doc.circle(sheetX, sheetY, notch, "F");
      doc.circle(sheetX + sheetW, sheetY, notch, "F");
      doc.circle(sheetX, sheetY + sheetH, notch, "F");
      doc.circle(sheetX + sheetW, sheetY + sheetH, notch, "F");
      doc.setDrawColor(darkGreen);
      doc.setLineWidth(3.1);
      doc.rect(21, 21, pageWidth - 42, pageHeight - 42);
      doc.setLineWidth(1);
      doc.rect(borderX, borderY, borderW, borderH);
      doc.setDrawColor(gold);
      doc.setLineWidth(0.6);
      doc.line(37, 33, pageWidth - 37, 33);
      doc.line(37, pageHeight - 33, pageWidth - 37, pageHeight - 33);

      const corner = (x, y, flipX, flipY) => {
        const h = 22 * flipX;
        const v = 22 * flipY;
        doc.setDrawColor(darkGreen);
        doc.setLineWidth(1.2);
        doc.line(x, y + v * 0.42, x, y + v);
        doc.line(x + h * 0.42, y, x + h, y);
        doc.setDrawColor("#d8cd9a");
        doc.setLineWidth(0.55);
        doc.line(x + h * 0.62, y + v * 0.12, x + h * 0.96, y + v * 0.12);
        doc.line(x + h * 0.12, y + v * 0.62, x + h * 0.12, y + v * 0.96);
      };
      corner(30, 30, 1, 1);
      corner(pageWidth - 30, 30, -1, 1);
      corner(30, pageHeight - 30, 1, -1);
      corner(pageWidth - 30, pageHeight - 30, -1, -1);
    };

    const centerText = (value, y, size = 8, style = "normal", color = gray) => {
      doc.setFont("times", style);
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.text(text(value), pageWidth / 2, y, { align: "center" });
    };

    const dashedLine = (y) => {
      doc.setDrawColor("#263b2d");
      doc.setLineDashPattern([3, 3], 0);
      doc.line(innerLeft, y, innerRight, y);
      doc.setLineDashPattern([], 0);
    };

    const horizontalRule = (x1, x2, y) => {
      doc.setDrawColor(paleGold);
      doc.setLineWidth(0.7);
      doc.line(x1, y, x2, y);
    };

    const leafMark = (x, y, size = 9, direction = 1, color = gold) => {
      const point = x + size * 0.78 * direction;
      const base = x - size * 0.36 * direction;
      doc.setFillColor(color);
      doc.ellipse(x, y, size * 0.44, size * 0.28, "F");
      doc.triangle(base, y - size * 0.27, point, y, base, y + size * 0.27, "F");
      doc.setDrawColor(color === gold ? "#fffdf6" : "#dfe8d7");
      doc.setLineWidth(0.55);
      doc.line(base, y + size * 0.2, point, y);
      doc.setDrawColor(color);
      doc.line(base - size * 0.28 * direction, y + size * 0.42, base + size * 0.04 * direction, y + size * 0.18);
    };

    const drawFaintBranch = (x, y, flip = 1) => {
      doc.setDrawColor("#eff1ea");
      doc.setLineWidth(1);
      doc.line(x, y + 44, x + 30 * flip, y + 12);
      doc.line(x + 8 * flip, y + 35, x + 27 * flip, y + 34);
      doc.line(x + 15 * flip, y + 26, x + 32 * flip, y + 21);
      doc.line(x + 22 * flip, y + 18, x + 38 * flip, y + 11);
      doc.setDrawColor("#f2f3ec");
      for (const [lx, ly] of [[10, 36], [18, 28], [26, 20], [33, 13]]) {
        doc.ellipse(x + lx * flip, y + ly, 4.5, 8.5);
      }
    };

    const circleIcon = (x, y, icon, radius = 16) => {
      doc.setFillColor(darkGreen);
      doc.circle(x, y, radius, "F");
      doc.setDrawColor("#ffffff");
      doc.setLineWidth(1.4);
      if (icon === "cap") {
        doc.line(x - 8, y - 2, x, y - 7);
        doc.line(x, y - 7, x + 8, y - 2);
        doc.line(x - 8, y - 2, x, y + 3);
        doc.line(x + 8, y - 2, x, y + 3);
        doc.line(x - 5, y + 5, x + 5, y + 5);
      } else if (icon === "chart") {
        doc.line(x - 8, y + 8, x + 8, y + 8);
        doc.line(x - 8, y + 8, x - 8, y - 6);
        doc.line(x - 5, y + 4, x - 1, y + 1);
        doc.line(x - 1, y + 1, x + 3, y + 3);
        doc.line(x + 3, y + 3, x + 8, y - 5);
        doc.line(x + 4, y - 5, x + 8, y - 5);
        doc.line(x + 8, y - 5, x + 8, y - 1);
      }
    };

    const drawHeader = (pageNumber, totalPages = 1) => {
      drawFrame();
      const titleCenter = innerLeft + 224;
      doc.addImage(logoData, "PNG", innerLeft + 30, 43, 74, 50);
      doc.setFont("times", "normal");
      doc.setFontSize(32);
      doc.setTextColor(darkGreen);
      doc.text("NEW EDEN", titleCenter, 59, { align: "center" });
      horizontalRule(titleCenter - 104, titleCenter - 38, 72);
      horizontalRule(titleCenter + 38, titleCenter + 104, 72);
      doc.setFontSize(10.5);
      doc.setTextColor(gold);
      doc.text("SCHOOL OF", titleCenter, 76, { align: "center" });
      doc.setFontSize(12.4);
      doc.setTextColor(darkGreen);
      doc.text("NATURAL HEALTH & HERBAL STUDIES", titleCenter, 94, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.2);
      doc.setTextColor("#1e2c22");
      doc.text([
        "9783 E 116th St PMB 1104",
        "Fishers, IN 46037",
        "www.newedenschoolofnaturalhealth.org",
        "Info@newedenschool.com",
        "(219) 230-6102",
      ], innerRight - 6, 45, { align: "right", lineHeightFactor: 1.32 });

      horizontalRule(innerLeft + 68, pageWidth / 2 - 114, 142);
      horizontalRule(pageWidth / 2 + 114, innerRight - 68, 142);
      leafMark(pageWidth / 2 - 98, 142, 8, 1, gold);
      leafMark(pageWidth / 2 + 98, 142, 8, 1, gold);
      centerText("OFFICIAL TRANSCRIPT", 148, 22, "bold", darkGreen);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#222");
      doc.text([
        `Name: ${els.transcriptStudentName?.value || ""}`,
        `Student ID: ${els.transcriptStudentId?.value || ""}`,
        `Date of Birth: ${dateLongForTranscript(els.transcriptDob?.value)}`,
      ], innerLeft + 5, 173, { lineHeightFactor: 1.55 });
      doc.text([`Date Created: ${today}`, `Page: ${pageNumber} of ${totalPages}`], innerRight - 5, 173, { align: "right", lineHeightFactor: 1.55 });

      dashedLine(214);
      doc.setFillColor(darkGreen);
      doc.roundedRect(196, 202, 204, 22, 8, 8, "F");
      centerText("TRANSCRIPT BEGINS", 217, 10, "bold", "#ffffff");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(darkGreen);
      leafMark(innerLeft + 8, 246, 8, 1, "#6e963c");
      doc.text("PROGRAM", innerLeft + 22, 248);
      doc.text("ATTENDED FROM/TO", innerRight - 4, 248, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.3);
      doc.setTextColor("#111");
      doc.text(doc.splitTextToSize(programName, 370), innerLeft + 22, 263);
      doc.text(attended, innerRight - 4, 263, { align: "right" });
      doc.setDrawColor(paleGold);
      doc.setLineWidth(0.5);
      doc.line(innerLeft, 278, innerRight, 278);
    };

    const tableHeader = (y) => {
      doc.setFillColor(darkGreen);
      doc.rect(innerLeft, y - 13, innerRight - innerLeft, 20, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.4);
      doc.setTextColor("#ffffff");
      doc.text("SUBJ", innerLeft + 12, y);
      doc.text("NUM", innerLeft + 64, y);
      doc.text("TITLE", innerLeft + 114, y);
      doc.text("CR", innerRight - 138, y, { align: "center" });
      doc.text("PER", innerRight - 86, y, { align: "center" });
      doc.text("GRADE", innerRight - 28, y, { align: "center" });
      doc.setTextColor("#111");
    };

    drawHeader(1, totalPagesToken);
    let y = 300;
    let tableBoxTop = y - 13;
    const drawTableBox = (bottomY) => {
      doc.setDrawColor("#d6d0c0");
      doc.setLineWidth(0.55);
      doc.rect(innerLeft, tableBoxTop, innerRight - innerLeft, bottomY - tableBoxTop);
      doc.setDrawColor("#e8e3d8");
      doc.setLineWidth(0.35);
      doc.line(innerLeft + 50, tableBoxTop + 20, innerLeft + 50, bottomY);
      doc.line(innerLeft + 104, tableBoxTop + 20, innerLeft + 104, bottomY);
      doc.line(innerRight - 164, tableBoxTop + 20, innerRight - 164, bottomY);
      doc.line(innerRight - 112, tableBoxTop + 20, innerRight - 112, bottomY);
      doc.line(innerRight - 58, tableBoxTop + 20, innerRight - 58, bottomY);
    };
    tableHeader(y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.1);
    doc.setTextColor("#111");
    state.transcriptRows.forEach((row) => {
      if (y > pageHeight - 218) {
        drawTableBox(y + 7);
        doc.addPage();
        drawHeader(doc.getNumberOfPages(), totalPagesToken);
        y = 300;
        tableBoxTop = y - 13;
        tableHeader(y);
        y += 18;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.1);
      }
      const titleLines = doc.splitTextToSize(text(row.name), 318);
      const rowHeight = Math.max(14, titleLines.length * 9.5 + 4);
      doc.setDrawColor("#ddd7ca");
      doc.setLineWidth(0.35);
      doc.line(innerLeft, y + 6, innerRight, y + 6);
      doc.text("NES", innerLeft + 12, y);
      doc.text(text(row.courseId), innerLeft + 64, y);
      doc.text(titleLines, innerLeft + 114, y);
      doc.text(text(row.credit), innerRight - 138, y, { align: "center" });
      doc.text(formatTranscriptPercent(row.percent), innerRight - 86, y, { align: "center" });
      doc.text(transcriptGrade(row.percent), innerRight - 28, y, { align: "center" });
      y += rowHeight;
    });
    drawTableBox(y + 7);

    if (y > pageHeight - 222) {
      doc.addPage();
      drawHeader(doc.getNumberOfPages(), doc.getNumberOfPages());
      y = 322;
    }

    y += 18;
    doc.setFillColor(softGreen);
    doc.rect(innerLeft, y, innerRight - innerLeft, 52, "F");
    doc.setDrawColor(paleGold);
    doc.setLineWidth(0.7);
    doc.rect(innerLeft, y, innerRight - innerLeft, 52);
    doc.line(pageWidth / 2, y + 9, pageWidth / 2, y + 43);
    circleIcon(innerLeft + 28, y + 26, "cap", 15);
    circleIcon(pageWidth / 2 + 30, y + 26, "chart", 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    doc.setTextColor(gray);
    doc.text("TOTAL CREDIT HOURS", innerLeft + 58, y + 20);
    doc.text("GRADE POINT AVERAGE (GPA)", pageWidth / 2 + 58, y + 20);
    doc.setFont("times", "bold");
    doc.setFontSize(16.5);
    doc.setTextColor(darkGreen);
    doc.text(text(els.transcriptTotalCredits?.textContent || "0"), innerLeft + 58, y + 40);
    doc.text(text(els.transcriptGpa?.textContent || "0.0"), pageWidth / 2 + 58, y + 40);

    y += 64;
    dashedLine(y);
    leafMark(pageWidth / 2 - 62, y + 9, 6, 1, gold);
    leafMark(pageWidth / 2 + 62, y + 9, 6, 1, gold);
    centerText(els.transcriptGraduated?.checked ? "GRADUATED" : "NOT GRADUATED", y + 12, 15, "bold", darkGreen);
    doc.setFillColor(darkGreen);
    doc.roundedRect(224, y + 25, 148, 16, 4, 4, "F");
    centerText("END OF TRANSCRIPT", y + 37, 8.5, "bold", "#ffffff");

    y += 52;
    doc.addImage(sealData, "PNG", innerLeft + 36, y + 2, 92, 92);
    doc.setFillColor("#fbfbf7");
    doc.setDrawColor("#e2ddcd");
    doc.roundedRect(pageWidth / 2 - 112, y + 4, 224, 78, 5, 5, "FD");
    drawFaintBranch(pageWidth / 2 - 100, y + 12, 1);
    drawFaintBranch(pageWidth / 2 + 100, y + 12, -1);
    doc.setDrawColor("#d7d2bf");
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 80, y + 15, pageWidth / 2 - 8, y + 15);
    doc.line(pageWidth / 2 + 8, y + 15, pageWidth / 2 + 80, y + 15);
    doc.line(pageWidth / 2 - 80, y + 73, pageWidth / 2 - 8, y + 73);
    doc.line(pageWidth / 2 + 8, y + 73, pageWidth / 2 + 80, y + 73);
    doc.setTextColor("#1b5a37");
    leafMark(pageWidth / 2, y + 15, 6, 1, "#6e963c");
    centerText("Empowering individuals", y + 33, 8.4, "italic", darkGreen);
    centerText("to achieve optimal health", y + 45, 8.4, "italic", darkGreen);
    centerText("through natural wisdom,", y + 57, 8.4, "italic", darkGreen);
    centerText("education, and purpose.", y + 69, 8.4, "italic", darkGreen);
    leafMark(pageWidth / 2, y + 81, 6, 1, "#6e963c");
    doc.addImage(signatureData, "PNG", innerRight - 150, y + 20, 136, 28);
    doc.setDrawColor("#222");
    doc.setLineWidth(0.6);
    doc.line(innerRight - 152, y + 54, innerRight - 12, y + 54);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(gray);
    doc.text(["Donna DeSantis", "Administration and Records"], innerRight - 82, y + 70, { align: "center", lineHeightFactor: 1.25 });
    centerText("This transcript is official when bearing the seal and signature of the Administrator and Records.", pageHeight - 38, 7, "italic", "#555");
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesToken);
    }
    return doc.output("blob");
  }

  async function loadJsPdf() {
    const module = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm");
    return module.default?.jsPDF ? module.default : module;
  }

  async function imageToDataUrl(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load transcript image: ${url}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function transcriptPdfFilename() {
    const rawName = String(els.transcriptStudentName?.value || "").trim();
    const parts = rawName.split(/\s+/).filter(Boolean);
    const firstName = safeFilenamePart(parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] || "Student");
    const lastName = safeFilenamePart(parts.length > 1 ? parts.at(-1) : els.transcriptStudentId?.value || "NewEden");
    const today = new Date().toISOString().slice(0, 10);
    const format = state.appSettings.transcriptFilenameFormat || defaultAppSettings.transcriptFilenameFormat;
    return format
      .replaceAll("LastName", lastName)
      .replaceAll("FirstName", firstName)
      .replaceAll("YYYY-MM-DD", today)
      .replaceAll("StudentID", safeFilenamePart(els.transcriptStudentId?.value || ""))
      .replace(/\.pdf$/i, "")
      .concat(".pdf");
  }

  function safeFilenamePart(value) {
    return String(value || "")
      .trim()
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "") || "Unknown";
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function printTranscript() {
    if (!state.transcriptRows.length) {
      alertAction({
        eyebrow: "Transcripts",
        title: "No Courses Added",
        message: "Add courses manually or import a curriculum before generating the transcript.",
        confirmText: "OK",
      });
      return;
    }
    const transcriptWindow = window.open("", "_blank", "width=900,height=1100");
    if (!transcriptWindow) return;
    const logoUrl = new URL("assets/transcript/logo-no-tagline-mark.png", window.location.href).href;
    const sealUrl = new URL("assets/transcript/seal1.png", window.location.href).href;
    const signatureUrl = new URL("assets/transcript/signature.png", window.location.href).href;
    const rows = state.transcriptRows.map((row) => `
      <tr>
        <td class="center">NES</td>
        <td class="center">${escapeHtml(row.courseId)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td class="center">${escapeHtml(row.credit)}</td>
        <td class="center">${escapeHtml(formatTranscriptPercent(row.percent))}</td>
        <td class="center">${escapeHtml(transcriptGrade(row.percent))}</td>
      </tr>
    `).join("");
    const today = new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
    const attended = `${dateIsoForTranscript(els.transcriptFrom?.value) || "NA"} to ${dateIsoForTranscript(els.transcriptTo?.value) || "NA"}`;
    const html = `<!doctype html>
      <html>
        <head>
          <title>New Eden Transcript</title>
          <style>
            @page { size: A4; margin: 0.4in; }
            body { font-family: "Open Sans", Arial, sans-serif; color: #111; font-size: 12px; }
            .row { display: flex; justify-content: space-between; gap: 24px; }
            .right { text-align: right; }
            .center { text-align: center; }
            .logo { width: 98px; max-height: 72px; object-fit: contain; object-position: left top; }
            .divider { margin: 14px 0; padding: 7px 0; border-top: 1.5px dashed #111; border-bottom: 1.5px dashed #111; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { padding: 2px 4px; vertical-align: top; }
            th { font-weight: 700; border-bottom: 1px solid #222; }
            .title { width: 62%; }
            .footer { margin-top: 28px; display: flex; justify-content: space-between; align-items: end; }
            .seal-img { width: 150px; height: auto; object-fit: contain; }
            .signature { text-align: right; }
            .signature-img { display: block; width: 190px; height: auto; margin: 0 0 4px auto; object-fit: contain; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="row">
            <img class="logo" src="${escapeAttr(logoUrl)}" alt="New Eden School" />
            <div class="right">
              9783 E 116th St PMB 1104<br />
              Fishers, IN 46037<br />
              www.newedenschoolofnaturalhealth.org<br />
              Info@newedenschool.com<br />
              (219) 230-6102
            </div>
          </div>
          <br />
          <div class="row">
            <div>
              Name: ${escapeHtml(els.transcriptStudentName?.value || "")}<br />
              Student ID: ${escapeHtml(els.transcriptStudentId?.value || "")}<br />
              Date of Birth: ${escapeHtml(dateLongForTranscript(els.transcriptDob?.value))}
            </div>
            <div class="right">Date Created: ${escapeHtml(today)}</div>
          </div>
          <p class="center">****************************************TRANSCRIPT BEGINS***************************************</p>
          <div class="row divider">
            <div><strong>Program</strong><br />${escapeHtml(transcriptDisplayProgram())}</div>
            <div class="right"><strong>Attended From/To</strong><br />${escapeHtml(attended)}</div>
          </div>
          <table>
            <thead>
              <tr><th>Subj</th><th>Num</th><th class="title">Title</th><th>Cr</th><th>Per</th><th>Grade</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="row divider">
            <div><strong>Total Credit Hours</strong><br />${escapeHtml(els.transcriptTotalCredits?.textContent || "0")}</div>
            <div class="right"><strong>GPA</strong><br />${escapeHtml(els.transcriptGpa?.textContent || "0.0")}</div>
          </div>
          <p class="center"><strong>${els.transcriptGraduated?.checked ? "Graduated" : "Not Graduated"}</strong></p>
          <p class="center">********************************************************END OF PAGE********************************************************</p>
          <div class="footer">
            <img class="seal-img" src="${escapeAttr(sealUrl)}" alt="New Eden seal" />
            <div class="signature">
              <img class="signature-img" src="${escapeAttr(signatureUrl)}" alt="Donna DeSantis signature" />
              Donna DeSantis<br />Administration and Records
            </div>
          </div>
          <script>window.addEventListener("load", () => setTimeout(() => window.print(), 150));<\/script>
        </body>
      </html>`;
    transcriptWindow.document.write(html);
    transcriptWindow.document.close();
  }

  function formatTranscriptPercent(percent) {
    const value = String(percent || "").trim();
    if (!value) return "";
    if (/^p(ass)?$/i.test(value)) return "PASS";
    if (value.includes("%")) return value;
    if (value.includes(".")) return `${value}%`;
    return value === "100" ? "100%" : `${value}.0%`;
  }

  function dateForTranscript(value) {
    return String(value || "").replaceAll("/", ".");
  }

  function dateIsoForTranscript(value) {
    return value ? String(value).slice(0, 10) : "";
  }

  function dateLongForTranscript(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
  }

  function transcriptDisplayProgram() {
    return els.transcriptCurriculumName?.value.trim() || state.transcriptSelectedProgram || "";
  }

  function matchTranscriptField(text, pattern) {
    return String(text || "").match(pattern)?.[1]?.replace(/\s+/g, " ").trim() || "";
  }

  function normalizeTranscriptInputDate(value) {
    const raw = String(value || "").trim();
    if (!raw || /^na$/i.test(raw)) return "";
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return raw;
    const dotted = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (dotted) {
      const year = dotted[3].length === 2 ? `20${dotted[3]}` : dotted[3];
      return `${year}-${dotted[1].padStart(2, "0")}-${dotted[2].padStart(2, "0")}`;
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return "";
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function normalizeImportedProgram(programName) {
    const imported = String(programName || "").trim();
    if (!imported) return "";
    const lowered = imported.toLowerCase();
    return programs().find((program) => program.name.toLowerCase() === lowered)?.name
      || programs().find((program) => (
        program.name.toLowerCase().includes(lowered)
        || lowered.includes(program.name.toLowerCase())
      ))?.name
      || imported;
  }

  function renderActivityLog() {
    if (!els.activityLogRows) return;
    const query = state.activityLogSearch;
    const rows = state.activityLog
      .filter((entry) => {
        if (!query) return true;
        return [entry.userName, entry.action, entry.entityType, entry.entityName, entry.details]
          .some((value) => String(value || "").toLowerCase().includes(query));
      })
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))
      .slice(0, 250);

    els.activityLogRows.innerHTML = rows.map((entry) => `
      <tr>
        <td>${escapeHtml(formatTimestamp(entry.createdAtMs))}</td>
        <td>${escapeHtml(entry.userName || "Unknown")}</td>
        <td>${escapeHtml(entry.action || "Activity")}</td>
        <td>${escapeHtml([entry.entityType, entry.entityName].filter(Boolean).join(": "))}</td>
        <td>${escapeHtml(entry.details || "")}</td>
      </tr>
    `).join("") || emptyRow(5, "No log entries match the current search.");
  }

  function renderAdministration() {
    renderBackupCenter();
    renderSystemHealth();
    renderEmailDispatchCenter();
    renderMaintenanceResults();
    renderAppSettings();
    validateAdministrationEmailControls();
  }

  function renderBackupCenter() {
    const history = state.backupHistory
      .slice()
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));
    const latestByType = (type) => history.find((item) => String(item.type || "").toLowerCase() === type.toLowerCase());
    if (els.backupLastDatabase) els.backupLastDatabase.textContent = formatTimestamp(latestByType("Database")?.createdAtMs) || "Not recorded";
    if (els.backupLastFiles) els.backupLastFiles.textContent = formatTimestamp(latestByType("File")?.createdAtMs) || "Not recorded";
    if (els.backupLastFull) els.backupLastFull.textContent = formatTimestamp(latestByType("Full")?.createdAtMs) || "Not recorded";
    if (els.backupStatus) els.backupStatus.textContent = history[0]?.status || "Ready";
    if (els.backupDestination) els.backupDestination.textContent = state.appSettings.backupDestination || defaultAppSettings.backupDestination;
    if (els.backupHistoryRows) {
      els.backupHistoryRows.innerHTML = history.slice(0, 8).map((entry) => `
        <tr>
          <td>${escapeHtml(formatTimestamp(entry.createdAtMs))}</td>
          <td>${escapeHtml(entry.type || "Backup")}</td>
          <td><span class="status-badge ${entry.status === "Completed" ? "" : "status-warning"}">${escapeHtml(entry.status || "Recorded")}</span></td>
          <td>${escapeHtml(entry.startedByName || "Unknown")}</td>
          <td>${escapeHtml(entry.duration || "Framework only")}</td>
        </tr>
      `).join("") || emptyRow(5, "No backup history has been recorded yet.");
    }
  }

  function renderSystemHealth() {
    if (els.systemHealthGrid) {
      const functionReady = Boolean(firebaseState.functions);
      const emailReady = functionReady && state.emailDeliveries.some((entry) => entry.status === "success");
      const services = [
        ["Realtime Database", firebaseState.ready && Boolean(firebaseState.db)],
        ["Firebase Storage", firebaseState.ready && Boolean(firebaseState.storage)],
        ["Cloud Functions", functionReady],
        ["Email Service", emailReady],
        ["Authentication", firebaseState.ready && Boolean(firebaseState.auth)],
      ];
      els.systemHealthGrid.innerHTML = services.map(([label, connected]) => `
        <article class="system-health-card ${connected ? "is-connected" : "is-disconnected"}">
          <span><i></i>${connected ? "Connected" : "Disconnected"}</span>
          <strong>${escapeHtml(label)}</strong>
        </article>
      `).join("");
    }
    if (els.healthLastCheck) els.healthLastCheck.textContent = formatTimestamp(Date.now());
    if (els.healthEnvironment) {
      els.healthEnvironment.textContent = firebaseDisabled
        ? "Local preview without Firebase"
        : `${location.hostname || "Browser"}${location.hostname.includes("github.io") ? " / GitHub Pages" : ""}`;
    }
    if (els.corsOriginList) {
      els.corsOriginList.innerHTML = storageCorsOrigins.map((origin) => `<li>${escapeHtml(origin)}</li>`).join("");
    }
  }

  function renderEmailDispatchCenter() {
    const deliveries = emailDeliveryRecords();
    const sent = deliveries.filter((entry) => entry.status === "success").length;
    const failed = deliveries.filter((entry) => entry.status === "failed").length;
    if (els.emailDispatchSummary) {
      els.emailDispatchSummary.innerHTML = [
        ["Total Emails Sent", deliveries.length],
        ["Successful Deliveries", sent],
        ["Failed Deliveries", failed],
      ].map(([label, value]) => `
        <div class="overview-trend-card">
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </div>
      `).join("");
    }
    if (els.recentDeliveryList) {
      els.recentDeliveryList.innerHTML = deliveries.slice(0, 5).map((entry) => adminMiniItem({
        title: entry.recipient || entry.entityName || "Student email",
        meta: [formatTimestamp(entry.createdAtMs), entry.templateName || "Template"].filter(Boolean).join(" - "),
        detail: `${entry.fileCount || 0} file(s) - ${entry.status || "recorded"}`,
      })).join("") || overviewEmptyState("No email deliveries have been recorded yet.");
    }
    if (els.failedDeliveryList) {
      const failedDeliveries = deliveries.filter((entry) => entry.status === "failed");
      els.failedDeliveryList.innerHTML = failedDeliveries.slice(0, 5).map((entry) => adminMiniItem({
        title: entry.recipient || entry.entityName || "Failed email",
        meta: formatTimestamp(entry.createdAtMs),
        detail: entry.error || entry.details || "No error message recorded.",
        warning: true,
      })).join("") || overviewEmptyState("No failed deliveries have been recorded.");
    }
  }

  function renderMaintenanceResults() {
    if (!els.maintenanceResults) return;
    if (!state.maintenanceCheck) {
      els.maintenanceResults.innerHTML = overviewEmptyState("Choose a maintenance check to see findings.");
      return;
    }
    const report = maintenanceReport(state.maintenanceCheck);
    els.maintenanceResults.innerHTML = `
      <div class="maintenance-result-head">
        <strong>${escapeHtml(report.title)}</strong>
        <span>${escapeHtml(report.items.length)} finding(s)</span>
      </div>
      <div class="admin-mini-list">
        ${report.items.map((item) => adminMiniItem(item)).join("") || overviewEmptyState(report.empty)}
      </div>
    `;
  }

  function renderAppSettings() {
    if (els.transcriptFilenameFormat) {
      els.transcriptFilenameFormat.value = state.appSettings.transcriptFilenameFormat || defaultAppSettings.transcriptFilenameFormat;
    }
  }

  function adminMiniItem({ title, meta = "", detail = "", warning = false }) {
    return `
      <article class="admin-mini-item ${warning ? "has-warning" : ""}">
        <strong>${escapeHtml(title || "Item")}</strong>
        ${meta ? `<small>${escapeHtml(meta)}</small>` : ""}
        ${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
      </article>
    `;
  }

  function renderOverview() {
    renderOverviewActivity();
    renderOverviewAttention();
    renderOverviewTasks();
    renderOverviewNotices();
    renderOverviewHealth();
    renderOverviewDrafts();
    renderOverviewTrends();
    renderOverviewUsers();
    renderOverviewContributions();
    renderOverviewGamification();
  }

  function renderOverviewActivity() {
    if (!els.overviewActivityList) return;
    const pageSize = 5;
    const entries = state.activityLog
      .slice()
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));
    const pageCount = totalPages(entries.length, pageSize);
    state.overviewActivityPage = Math.min(Math.max(1, Number(state.overviewActivityPage || 1)), pageCount);
    const start = (state.overviewActivityPage - 1) * pageSize;
    const pageEntries = entries.slice(start, start + pageSize);

    els.overviewActivityList.innerHTML = pageEntries.map((entry) => overviewListItem({
      icon: "bi-clock-history",
      title: entry.action || "Activity",
      meta: [entry.userName || "Unknown", formatTimestamp(entry.createdAtMs)].filter(Boolean).join(" - "),
      detail: [entry.entityType, entry.entityName].filter(Boolean).join(": ") || entry.details || "Archive activity",
    })).join("") || overviewEmptyState("No recent activity has been logged yet.");

    if (els.overviewActivityPagination) {
      els.overviewActivityPagination.innerHTML = entries.length > pageSize ? `
        <button class="btn btn-sm btn-outline-eden" type="button" data-overview-activity-page="${state.overviewActivityPage - 1}" ${state.overviewActivityPage <= 1 ? "disabled" : ""}>
          <i class="bi bi-chevron-left"></i>
        </button>
        <span>Page ${state.overviewActivityPage} of ${pageCount}</span>
        <button class="btn btn-sm btn-outline-eden" type="button" data-overview-activity-page="${state.overviewActivityPage + 1}" ${state.overviewActivityPage >= pageCount ? "disabled" : ""}>
          <i class="bi bi-chevron-right"></i>
        </button>
      ` : "";
    }
  }

  function renderOverviewAttention() {
    if (!els.overviewAttentionList) return;
    const report = archiveHealthReport();
    const zeroRequirementPrograms = programs().filter((program) => curriculumForProgram(program.name).length === 0);
    const inactiveCourses = state.courses.filter((course) => (course.status || "Active") !== "Active");
    const inactivePrograms = programs().filter((program) => (program.status || "Active") !== "Active");
    const items = [
      {
        icon: "bi-exclamation-triangle",
        title: "Duplicate course IDs",
        count: report.duplicateCourseIds.length,
        detail: report.duplicateCourseIds.length
          ? report.duplicateCourseIds.map((item) => `${item.id} (${item.count})`).join(", ")
          : "No duplicate course IDs found.",
      },
      {
        icon: "bi-file-earmark-x",
        title: "Blank course records",
        count: report.blankCourses.length,
        detail: report.blankCourses.length
          ? report.blankCourses.map((course) => course._docId || "unknown-doc").join(", ")
          : "No blank course records found.",
      },
      {
        icon: "bi-clipboard-x",
        title: "Curriculums with zero requirements",
        count: zeroRequirementPrograms.length,
        detail: zeroRequirementPrograms.length
          ? zeroRequirementPrograms.slice(0, 5).map((program) => program.name).join(", ")
          : "Every listed curriculum has at least one requirement.",
      },
      {
        icon: "bi-pause-circle",
        title: "Inactive items",
        count: inactiveCourses.length + inactivePrograms.length,
        detail: `${inactiveCourses.length} inactive courses and ${inactivePrograms.length} inactive curriculums.`,
      },
    ];

    els.overviewAttentionList.innerHTML = items.map((item) => overviewListItem({
      icon: item.icon,
      title: item.title,
      meta: `${item.count} found`,
      detail: item.detail,
      warning: item.count > 0,
    })).join("");
  }

  function renderOverviewTasks() {
    if (!els.overviewTasksList) return;
    const displayName = currentUserDisplayName();
    const tasks = state.tasks
      .filter((task) => task.status !== "done")
      .filter((task) => task.assigneeUid === firebaseState.user?.uid || (displayName && task.assigneeName === displayName))
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))
      .slice(0, 5);

    els.overviewTasksList.innerHTML = tasks.map((task) => overviewListItem({
      icon: "bi-list-task",
      title: task.title,
      meta: `Assigned by ${task.createdByName || "Admin"} - ${formatTimestamp(task.createdAtMs)}`,
      detail: task.description || "No description added.",
    })).join("") || overviewEmptyState("No open tasks are assigned to you.");
  }

  function renderOverviewNotices() {
    if (!els.overviewNoticesList) return;
    const notices = state.notices
      .filter((notice) => notice.status !== "deleted")
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))
      .slice(0, 3);

    els.overviewNoticesList.innerHTML = notices.map((notice) => overviewListItem({
      icon: "bi-megaphone",
      title: notice.message,
      meta: `${notice.authorName || "Admin"} - ${formatTimestamp(notice.createdAtMs)}`,
      detail: "Active notice",
    })).join("") || overviewEmptyState("No active notices have been posted.");
  }

  function renderOverviewHealth() {
    if (!els.overviewHealthList) return;
    const courseIdsInCurriculum = new Set(state.curriculum.map((row) => String(row.courseId || "").trim()).filter(Boolean));
    const coursesWithoutUse = state.courses.filter((course) => course.id && !courseIdsInCurriculum.has(String(course.id)));
    const programsWithoutCurriculums = programCategories().filter((category) => !programs().some((program) => program.section === category.name));
    const curriculumsMissingNotes = programs().filter((program) => !String(program.notes || "").trim());
    const curriculumsMissingAttachments = programs().filter((program) => attachmentsForProgram(program.name).length === 0);
    const items = [
      {
        icon: "bi-bookmark-x",
        title: "Courses without curriculum use",
        count: coursesWithoutUse.length,
        detail: coursesWithoutUse.length ? coursesWithoutUse.slice(0, 5).map((course) => course.name || course.id).join(", ") : "Every course is used by at least one curriculum.",
      },
      {
        icon: "bi-mortarboard",
        title: "Programs without curriculums",
        count: programsWithoutCurriculums.length,
        detail: programsWithoutCurriculums.length ? programsWithoutCurriculums.slice(0, 5).map((program) => program.name).join(", ") : "Every program contains at least one curriculum.",
      },
      {
        icon: "bi-journal-text",
        title: "Curriculums missing notes",
        count: curriculumsMissingNotes.length,
        detail: curriculumsMissingNotes.length ? `${curriculumsMissingNotes.length} curriculums do not have notes yet.` : "All curriculums have notes.",
      },
      {
        icon: "bi-paperclip",
        title: "Curriculums missing attachments",
        count: curriculumsMissingAttachments.length,
        detail: curriculumsMissingAttachments.length ? `${curriculumsMissingAttachments.length} curriculums do not have attachments yet.` : "All curriculums have attachments.",
      },
    ];

    els.overviewHealthList.innerHTML = items.map((item) => overviewListItem({
      icon: item.icon,
      title: item.title,
      meta: `${item.count} found`,
      detail: item.detail,
      warning: item.count > 0,
    })).join("");
  }

  function renderOverviewDrafts() {
    if (!els.overviewDraftList) return;
    const drafts = state.transcriptDrafts
      .slice()
      .sort((a, b) => Number(b.updatedAtMs || b.createdAtMs || 0) - Number(a.updatedAtMs || a.createdAtMs || 0))
      .slice(0, 5);

    els.overviewDraftList.innerHTML = drafts.map((draft) => overviewListItem({
      icon: "bi-file-earmark-text",
      title: draft.studentName || "Unnamed Student",
      meta: [draft.program || "No program selected", formatTimestamp(draft.updatedAtMs || draft.createdAtMs)].filter(Boolean).join(" - "),
      detail: `${draft.rows?.length || 0} transcript rows`,
    })).join("") || overviewEmptyState("No transcript drafts have been saved yet.");
  }

  function renderOverviewTrends() {
    if (!els.overviewTrendCards) return;
    const communityXp = contributorStats().reduce((sum, item) => sum + Number(item.xp || 0), 0);
    const completedTasks = state.tasks.filter((task) => task.status === "done").length
      || state.activityLog.filter((entry) => /completed task/i.test(entry.action || "")).length;
    const cards = [
      ["Courses Created", state.courses.length],
      ["Programs Created", programCategories().length],
      ["Curriculums Created", programs().length],
      ["Files Uploaded", fileManagerState.records.length],
      ["Transcripts Created", transcriptFileRecords().length + state.transcriptDrafts.length],
      ["Tasks Completed", completedTasks],
      ["Community XP", communityXp.toLocaleString()],
    ];

    els.overviewTrendCards.innerHTML = cards.map(([label, value]) => `
      <div class="overview-trend-card">
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    `).join("");
  }

  function renderOverviewUsers() {
    if (!els.overviewUserStatusList) return;
    const users = archiveUsers()
      .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name))
      .slice(0, 8);
    els.overviewUserStatusList.innerHTML = users.map((user) => `
      <article class="overview-user-row">
        ${userAvatarMarkup(user)}
        <div>
          <strong>${escapeHtml(user.name)}</strong>
        </div>
        <span class="presence-pill ${user.online ? "is-online" : "is-offline"}">
          <i></i>${user.online ? "Online" : "Offline"}
        </span>
        <small class="text-end">${escapeHtml(user.lastLoginAtMs ? formatTimestamp(user.lastLoginAtMs) : "No login recorded")}</small>
      </article>
    `).join("") || overviewEmptyState("No users have been loaded yet.");
  }

  function renderOverviewContributions() {
    if (!els.overviewContributionList) return;
    const stats = contributorStats().slice(0, 8);
    els.overviewContributionList.innerHTML = stats.map((item, index) => `
      <article class="overview-contribution-row">
        <span class="contribution-rank">${index + 1}</span>
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${item.created} created &bull; ${item.edited} edited &bull; ${item.deleted} deleted</small>
        </div>
        <b>${item.total}</b>
      </article>
    `).join("") || overviewEmptyState("No contributions have been logged yet.");
  }

  function renderOverviewGamification() {
    if (!els.overviewGamificationList) return;
    const stats = contributorStats();
    if (!stats.length) {
      els.overviewGamificationList.innerHTML = overviewEmptyState("No contribution progress has been recorded yet.");
      return;
    }
    const currentKey = firebaseState.user?.uid || normalizePersonName(currentUserDisplayName());
    const selected = stats.find((item) => item.uid === currentKey || item.key === currentKey)
      || stats.find((item) => normalizePersonName(item.name) === normalizePersonName(currentUserDisplayName()))
      || stats[0];
    const rank = stats.findIndex((item) => item.key === selected.key) + 1;
    const topStaff = stats.slice(0, 4);
    const profile = archiveUsers().find((user) => (
      user.uid === selected.uid
      || normalizePersonName(user.name) === normalizePersonName(selected.name)
    )) || selected;
    const xpRemaining = Math.max(0, selected.nextXp - selected.xp);
    const rankColor = selected.rankColor || contributionRankColor(selected.level);
    const rankGradient = metallicRankGradient(rankColor);

    els.overviewGamificationList.innerHTML = `
      <article class="overview-level-card">
        ${userAvatarMarkup(profile)}
        <div class="overview-level-main">
          <div class="overview-level-title">
            <strong>${escapeHtml(selected.name)}</strong>
            <div class="overview-level-actions">
              <span class="rank-title rank-metallic-text" style="--rank-gradient:${escapeAttr(rankGradient)}">Level ${selected.level} ${escapeHtml(selected.title)}</span>
            </div>
          </div>
          <div class="overview-xp-bar" aria-label="Level progress">
            <span style="width: ${selected.progress.toFixed(1)}%"></span>
          </div>
          <small>${selected.xp} XP &bull; ${xpRemaining} XP to next level &bull; Rank #${rank}</small>
        </div>
      </article>
      <div class="overview-badge-row">
        <span><strong>${selected.total}</strong>Total Actions</span>
        <span><strong>${selected.currentStreak}</strong>Day Streak</span>
        <span><strong>${selected.achievements.length}</strong>Badges</span>
      </div>
      <div class="overview-leaderboard">
        ${topStaff.map((item, index) => `
          <div>
            <span class="contribution-rank">${index + 1}</span>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${item.level} &bull; ${escapeHtml(item.title)} &bull; ${item.xp} XP</small>
          </div>
        `).join("")}
      </div>
    `;
  }

  function currentContributorStats() {
    const stats = contributorStats();
    const currentKey = firebaseState.user?.uid || normalizePersonName(currentUserDisplayName());
    return stats.find((item) => item.uid === currentKey || item.key === currentKey)
      || stats.find((item) => normalizePersonName(item.name) === normalizePersonName(currentUserDisplayName()))
      || null;
  }

  function openProgressInfoDialog() {
    if (!els.progressInfoDialog || !els.progressInfoContent) return;
    const selected = currentContributorStats()
      || contributorStats()[0]
      || {
        name: currentUserDisplayName() || "Archive User",
        xp: 0,
        level: 1,
        title: "New Member",
        rankColor: contributionRankColor(1),
        counts: {},
        currentStreak: 0,
        longestStreak: 0,
        isFounder: isFounderContributor(currentUserDisplayName()),
      };
    renderProgressInfoContent(selected);
    els.progressInfoDialog.showModal();
  }

  function renderProgressInfoContent(selectedUser = null) {
    if (!els.progressInfoContent) return;
    const selected = selectedUser || currentContributorStats() || contributorStats()[0] || {
      name: currentUserDisplayName() || "Archive User",
      xp: 0,
      level: 1,
      title: "New Member",
      rankColor: contributionRankColor(1),
      counts: {},
      currentStreak: 0,
      longestStreak: 0,
      isFounder: isFounderContributor(currentUserDisplayName()),
    };
    const achievements = contributionAchievementCatalog(selected);
    const achieved = achievements.filter((item) => item.achieved);
    const locked = achievements.filter((item) => !item.achieved);
    const levels = contributionRanks;
    const rankColumns = [levels.slice(0, 10), levels.slice(10)];
    const pageSize = 10;
    const unlockedPage = normalizeSimplePage(state.achievementPages.unlocked, achieved.length, pageSize);
    const lockedPage = normalizeSimplePage(state.achievementPages.locked, locked.length, pageSize);
    state.achievementPages.unlocked = unlockedPage;
    state.achievementPages.locked = lockedPage;
    const unlockedItems = pageSlice(achieved, unlockedPage, pageSize);
    const lockedItems = pageSlice(locked, lockedPage, pageSize);

    els.progressInfoContent.innerHTML = `
      <section class="progress-info-section progress-info-summary">
        <h3>${escapeHtml(selected.name)}</h3>
        <div class="overview-xp-bar" aria-label="Current level progress">
          <span style="width: ${Number(selected.progress || 0).toFixed(1)}%"></span>
        </div>
        <p><strong>${selected.xp || 0} XP</strong> &bull; Level ${selected.level || 1} &bull; <span class="rank-metallic-text" style="--rank-gradient:${escapeAttr(metallicRankGradient(selected.rankColor || contributionRankColor(selected.level || 1)))}">${escapeHtml(selected.title || "New Member")}</span></p>
      </section>
      <section class="progress-info-section">
        <h3>Unlocked Achievements</h3>
        <div class="achievement-grid">
          ${unlockedItems.map((item) => achievementCardMarkup(item)).join("") || `<p class="empty-state">No achievements unlocked yet.</p>`}
        </div>
        ${achievementPagerMarkup("unlocked", unlockedPage, achieved.length, pageSize)}
      </section>
      <section class="progress-info-section">
        <h3>Locked Achievements</h3>
        <div class="achievement-grid">
          ${lockedItems.map((item) => achievementCardMarkup(item)).join("") || `<p class="empty-state">No locked achievements remain.</p>`}
        </div>
        ${achievementPagerMarkup("locked", lockedPage, locked.length, pageSize)}
      </section>
      <section class="progress-info-section progress-ranks-section">
        <h3>XP Ranks</h3>
        <div class="rank-grid">
          ${rankColumns.map((column) => `
            <div class="rank-column">
              ${column.map((item) => {
                const gradient = metallicRankGradient(item.color);
                return `
                  <article class="rank-card ${selected.level >= item.level ? "is-unlocked" : "is-locked"}" style="--rank-color:${escapeAttr(item.color)};--rank-gradient:${escapeAttr(gradient)}">
                    <strong>Level ${item.level}</strong>
                    <span class="rank-metallic-text">${escapeHtml(item.title)}</span>
                    <small>${item.xp.toLocaleString()} XP required</small>
                  </article>
                `;
              }).join("")}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function normalizeSimplePage(page, totalRows, rowsPerPage) {
    const pages = Math.max(1, Math.ceil(Number(totalRows || 0) / Number(rowsPerPage || 1)));
    return Math.min(Math.max(1, Number(page || 1)), pages);
  }

  function pageSlice(items, page, rowsPerPage) {
    const start = (normalizeSimplePage(page, items.length, rowsPerPage) - 1) * rowsPerPage;
    return items.slice(start, start + rowsPerPage);
  }

  function achievementPagerMarkup(kind, currentPage, totalRows, rowsPerPage) {
    const pages = Math.ceil(Number(totalRows || 0) / Number(rowsPerPage || 1));
    if (pages <= 1) return "";
    const buttons = Array.from({ length: pages }, (_, index) => index + 1).map((page) => `
      <button class="${page === currentPage ? "active" : ""}" type="button" data-achievement-page="${escapeAttr(kind)}:${page}" aria-label="${escapeAttr(kind)} achievements page ${page}">${page}</button>
    `).join("");
    return `<nav class="achievement-pager" aria-label="${escapeAttr(kind)} achievements pagination">${buttons}</nav>`;
  }

  function achievementCardMarkup(item) {
    return `
      <article class="achievement-card ${item.achieved ? "is-achieved" : "is-locked"}">
        <i class="bi ${item.achieved ? "bi-trophy-fill" : "bi-lock"}"></i>
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.requirement)}</small>
        </div>
      </article>
    `;
  }

  function archiveUsers() {
    const connectedByUid = new Map(state.connectedUsers.map((user) => [user.uid, user]));
    const connectedByEmail = new Map(state.connectedUsers.filter((user) => user.email).map((user) => [String(user.email).toLowerCase(), user]));
    const connectedByName = new Map(state.connectedUsers.filter((user) => user.name).map((user) => [normalizePersonName(user.name), user]));
    const users = new Map();
    const userKey = (user = {}) => {
      const email = String(user.email || "").trim().toLowerCase();
      if (email) return `email:${email}`;
      const name = normalizePersonName(user.displayName || user.name || "");
      if (name) return `name:${name}`;
      return `uid:${user.uid || user._docId || slugify("employee")}`;
    };
    const addMergedUser = (user = {}) => {
      const uid = user.uid || user._docId || `staff:${slugify(user.name || user.email || "employee")}`;
      const emailKey = String(user.email || "").toLowerCase();
      const nameKey = normalizePersonName(user.displayName || user.name || "");
      const connected = connectedByUid.get(uid) || connectedByEmail.get(emailKey) || connectedByName.get(nameKey) || {};
      const merged = { ...user, ...connected, uid };
      const key = userKey(merged);
      const existing = users.get(key) || {};
      const existingIsFallback = String(existing.uid || "").startsWith("staff:");
      const mergedIsFallback = String(uid || "").startsWith("staff:");
      users.set(key, {
        ...existing,
        ...merged,
        uid: existing.uid && !existingIsFallback && mergedIsFallback ? existing.uid : uid,
        name: connected.name || merged.displayName || merged.name || existing.name || merged.email?.split("@")[0] || "Employee",
        email: merged.email || existing.email || connected.email || "",
        photoURL: connected.photoURL || merged.photoURL || existing.photoURL || "",
        online: Boolean(existing.online || connectedByUid.has(uid) || connectedByEmail.has(emailKey) || connectedByName.has(nameKey)),
        lastLoginAtMs: Number(merged.lastLoginAtMs || existing.lastLoginAtMs || connected.connectedAtMs || 0),
      });
    };
    const addUser = (user = {}) => {
      addMergedUser(user);
    };
    state.directoryUsers.forEach(addUser);
    state.connectedUsers.forEach(addUser);
    if (firebaseState.user) {
      addUser({
        uid: firebaseState.user.uid,
        name: currentUserDisplayName(),
        email: firebaseState.user.email || "",
        photoURL: firebaseState.profile?.photoURL || firebaseState.user.photoURL || "",
        lastLoginAtMs: firebaseState.profile?.lastLoginAtMs || Date.parse(firebaseState.user.metadata?.lastSignInTime || ""),
      });
    }
    staffDirectory.forEach((staff) => {
      const staffName = normalizePersonName(staff.name);
      const alreadyLoaded = Array.from(users.values()).some((user) => normalizePersonName(user.name) === staffName);
      if (!alreadyLoaded) addUser(staff);
    });
    return Array.from(users.values());
  }

  function contributorStats() {
    const stats = new Map();
    const bucketFor = (entry) => {
      const key = entry.userUid || normalizePersonName(entry.userName) || "unknown";
      const current = stats.get(key) || {
        key,
        uid: entry.userUid || "",
        name: entry.userName || "Unknown",
        created: 0,
        edited: 0,
        deleted: 0,
        other: 0,
        total: 0,
        xp: 0,
        days: new Set(),
        weekendDays: new Set(),
        nightActions: 0,
        earlyActions: 0,
        counts: {},
      };
      const action = String(entry.action || "").toLowerCase();
      if (/add|create|upload|opened task|saved transcript|imported/.test(action)) current.created += 1;
      else if (/edit|update|save|complete|reopen|requirements/.test(action)) current.edited += 1;
      else if (/delete|remove/.test(action)) current.deleted += 1;
      else current.other += 1;
      current.total += 1;
      current.name = entry.userName || current.name;
      current.uid = entry.userUid || current.uid;
      current.xp += contributionXp(entry);
      const countKey = contributionCountKey(entry);
      current.counts[countKey] = (current.counts[countKey] || 0) + 1;
      const day = contributionDayKey(entry.createdAtMs);
      if (day) current.days.add(day);
      const entryDate = entry.createdAtMs ? new Date(Number(entry.createdAtMs)) : null;
      if (entryDate && !Number.isNaN(entryDate.getTime())) {
        const hour = entryDate.getHours();
        if (hour < 6) current.earlyActions += 1;
        if (hour >= 0 && hour < 4) current.nightActions += 1;
        if (entryDate.getDay() === 0 || entryDate.getDay() === 6) {
          current.weekendDays.add(day || entryDate.toDateString());
        }
      }
      stats.set(key, current);
    };
    state.activityLog.forEach(bucketFor);
    return Array.from(stats.values()).map((item) => {
      const level = contributionLevel(item.xp);
      const nextXp = contributionNextLevelXp(level);
      const previousXp = contributionLevelXp(level);
      const progress = nextXp > previousXp
        ? Math.min(100, Math.max(0, ((item.xp - previousXp) / (nextXp - previousXp)) * 100))
        : 100;
      const streak = contributionStreaks(Array.from(item.days));
      const isFounder = isFounderContributor(item.name);
      const preparedItem = { ...item, isFounder };
      return {
        ...preparedItem,
        days: Array.from(item.days),
        weekendDays: Array.from(item.weekendDays),
        level,
        title: contributionTitle(level),
        rankColor: contributionRankColor(level),
        nextXp,
        previousXp,
        progress,
        currentStreak: streak.current,
        longestStreak: streak.longest,
        achievements: contributionAchievements(preparedItem, streak),
      };
    }).sort((a, b) => b.xp - a.xp || b.total - a.total || a.name.localeCompare(b.name));
  }

  function contributionXp(entry) {
    const action = String(entry.action || "").toLowerCase();
    const entity = `${entry.entityType || ""} ${entry.entityName || ""} ${entry.details || ""}`.toLowerCase();
    const haystack = `${action} ${entity}`;
    if (/course/.test(haystack)) {
      if (/add|create/.test(action)) return 25;
      if (/delete|remove/.test(action)) return 10;
      if (/edit|update|save/.test(action)) return 5;
    }
    if (/curriculum/.test(haystack)) {
      if (/add|create/.test(action)) return 30;
      if (/delete|remove/.test(action)) return 15;
      if (/edit|update|requirement|save/.test(action)) return 5;
    }
    if (/program/.test(haystack)) {
      if (/add|create/.test(action)) return 30;
      if (/delete|remove/.test(action)) return 15;
      if (/edit|update|save/.test(action)) return 5;
    }
    if (/file|attachment|pdf|transcript/.test(haystack)) {
      if (/send/.test(action)) return /multiple|files/.test(haystack) ? 20 : 15;
      if (/upload|save|import/.test(action)) return 10;
      if (/associate|edit|update/.test(action)) return 5;
      if (/delete|remove/.test(action)) return 5;
    }
    if (/task/.test(haystack)) {
      if (/complete|done/.test(action)) return 20;
      if (/open|create|add/.test(action)) return 10;
      if (/close|delete|remove/.test(action)) return 10;
      if (/edit|update|reopen/.test(action)) return 5;
    }
    if (/notice|announcement/.test(haystack)) {
      if (/create|send|add/.test(action)) return 10;
      if (/delete|archive|remove/.test(action)) return 5;
      if (/edit|update/.test(action)) return 5;
    }
    if (/add|create|upload|import|saved/.test(action)) return 10;
    if (/edit|update|save|complete|reopen/.test(action)) return 5;
    if (/delete|remove/.test(action)) return 5;
    return 2;
  }

  function contributionCountKey(entry) {
    const action = String(entry.action || "").toLowerCase();
    const entity = `${entry.entityType || ""} ${entry.entityName || ""} ${entry.details || ""}`.toLowerCase();
    const prefix = /delete|remove/.test(action) ? "deleted"
      : /edit|update|save|requirement/.test(action) ? "edited"
        : /complete|done/.test(action) ? "completed"
          : "created";
    if (/send/.test(action) && /file|email|student|material/.test(`${action} ${entity}`)) return "sentMaterials";
    if (/transcript/.test(`${action} ${entity}`)) return `${prefix}Transcript`;
    if (/course/.test(`${action} ${entity}`)) return `${prefix}Course`;
    if (/curriculum/.test(`${action} ${entity}`)) return `${prefix}Curriculum`;
    if (/program/.test(`${action} ${entity}`)) return `${prefix}Program`;
    if (/file|attachment|pdf/.test(`${action} ${entity}`)) return `${prefix}File`;
    if (/task/.test(`${action} ${entity}`)) return `${prefix}Task`;
    if (/notice|announcement/.test(`${action} ${entity}`)) return `${prefix}Notice`;
    return prefix;
  }

  function contributionLevel(xp) {
    const value = Number(xp || 0);
    return contributionRanks.reduce((level, rank) => (value >= rank.xp ? rank.level : level), 1);
  }

  function contributionLevelXp(level) {
    return contributionRanks.find((rank) => rank.level === level)?.xp ?? contributionRanks.at(-1).xp;
  }

  function contributionNextLevelXp(level) {
    const next = contributionRanks.find((rank) => rank.level === level + 1);
    return next ? next.xp : contributionLevelXp(level);
  }

  function contributionTitle(level) {
    return contributionRanks.find((rank) => rank.level === level)?.title || contributionRanks[0].title;
  }

  function contributionRankColor(level) {
    return contributionRanks.find((rank) => rank.level === level)?.color || contributionRanks[0].color;
  }

  function metallicRankGradient(color) {
    const base = sanitizeHexColor(color) || "#4CAF50";
    return `linear-gradient(90deg, ${mixHex(base, "#050505", 0.16)} 0%, ${base} 24%, ${mixHex(base, "#ffffff", 0.62)} 46%, ${mixHex(base, "#fff6c9", 0.34)} 54%, ${base} 74%, ${mixHex(base, "#050505", 0.24)} 100%)`;
  }

  function sanitizeHexColor(color) {
    const value = String(color || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(value)) return value;
    if (/^#[0-9a-f]{3}$/i.test(value)) {
      return `#${value.slice(1).split("").map((char) => char + char).join("")}`;
    }
    return "";
  }

  function mixHex(color, target, amount) {
    const from = hexToRgb(sanitizeHexColor(color) || "#4CAF50");
    const to = hexToRgb(sanitizeHexColor(target) || "#ffffff");
    const mix = Math.min(1, Math.max(0, Number(amount || 0)));
    const channel = (a, b) => Math.round(a + (b - a) * mix).toString(16).padStart(2, "0");
    return `#${channel(from.r, to.r)}${channel(from.g, to.g)}${channel(from.b, to.b)}`;
  }

  function hexToRgb(color) {
    const value = sanitizeHexColor(color).slice(1);
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }

  function contributionAchievements(item, streak) {
    return contributionAchievementCatalog({ ...item, currentStreak: streak.current, longestStreak: streak.longest })
      .filter((achievement) => achievement.achieved)
      .map((achievement) => achievement.name);
  }

  function contributionAchievementCatalog(item) {
    const counts = item.counts || {};
    const fileCount = (counts.createdFile || 0) + (counts.editedFile || 0);
    const transcriptCount = (counts.createdTranscript || 0) + (counts.editedTranscript || 0);
    const categoriesUnlocked = [
      (counts.createdCourse || 0) >= 1,
      (counts.createdProgram || 0) >= 1,
      (counts.createdCurriculum || 0) >= 1,
      fileCount >= 1,
      transcriptCount >= 1,
      (counts.createdNotice || 0) >= 1,
      (counts.createdTask || 0) >= 1,
      (counts.sentMaterials || 0) >= 1,
    ].filter(Boolean).length;
    const allTrades = ["createdCourse", "createdProgram", "createdCurriculum", "createdFile", "createdNotice", "createdTask"]
      .every((key) => (counts[key] || 0) >= 1);
    const weekendCount = Array.isArray(item.weekendDays) ? item.weekendDays.length : 0;
    const entries = [
      ["Courses", "First Course", "Create your first course.", (counts.createdCourse || 0) >= 1],
      ["Curriculums", "Curriculum Creator", "Create your first curriculum.", (counts.createdCurriculum || 0) >= 1],
      ["Programs", "Program Creator", "Create your first program.", (counts.createdProgram || 0) >= 1],
      ["Transcripts", "Transcript Starter", "Create or import your first transcript.", transcriptCount >= 1],
      ["Transcripts", "Transcript Clerk", "Create or import 25 transcripts.", transcriptCount >= 25],
      ["Transcripts", "Transcript Specialist", "Create or import 100 transcripts.", transcriptCount >= 100],
      ["Transcripts", "Transcript Archivist", "Create or import 250 transcripts.", transcriptCount >= 250],
      ["Transcripts", "Transcript Master", "Create or import 500 transcripts.", transcriptCount >= 500],
      ["Files", "First Upload", "Upload your first file.", fileCount >= 1],
      ["Files", "Librarian", "Upload or edit 25 files.", fileCount >= 25],
      ["Files", "Master Librarian", "Upload or edit 100 files.", fileCount >= 100],
      ["Files", "Archive Keeper", "Upload or edit 250 files.", fileCount >= 250],
      ["Files", "Archive Vault", "Upload or edit 500 files.", fileCount >= 500],
      ["Email", "Messenger", "Send student materials once.", (counts.sentMaterials || 0) >= 1],
      ["Email", "Courier", "Send 25 deliveries.", (counts.sentMaterials || 0) >= 25],
      ["Email", "Dispatcher", "Send 100 deliveries.", (counts.sentMaterials || 0) >= 100],
      ["Email", "Master Dispatcher", "Send 500 deliveries.", (counts.sentMaterials || 0) >= 500],
      ["Tasks", "Task Starter", "Create your first task.", (counts.createdTask || 0) >= 1],
      ["Tasks", "Task Slayer", "Complete 10 tasks.", (counts.completedTask || 0) >= 10],
      ["Tasks", "Task Master", "Complete 50 tasks.", (counts.completedTask || 0) >= 50],
      ["Tasks", "Task Champion", "Complete 100 tasks.", (counts.completedTask || 0) >= 100],
      ["Tasks", "Task Legend", "Complete 250 tasks.", (counts.completedTask || 0) >= 250],
      ["Notices", "Voice of the Archive", "Create your first notice.", (counts.createdNotice || 0) >= 1],
      ["Notices", "Town Crier", "Create 10 notices.", (counts.createdNotice || 0) >= 10],
      ["Notices", "Herald", "Create 50 notices.", (counts.createdNotice || 0) >= 50],
      ["Notices", "Grand Herald", "Create 100 notices.", (counts.createdNotice || 0) >= 100],
      ["Activity", "First Steps", "Perform 10 total actions.", (item.total || 0) >= 10],
      ["Activity", "Getting Started", "Perform 50 total actions.", (item.total || 0) >= 50],
      ["Activity", "Dedicated Contributor", "Perform 250 total actions.", (item.total || 0) >= 250],
      ["Activity", "Power Contributor", "Perform 1,000 total actions.", (item.total || 0) >= 1000],
      ["Activity", "Archive Veteran", "Perform 5,000 total actions.", (item.total || 0) >= 5000],
      ["Activity", "Activity Legend", "Perform 10,000 total actions.", (item.total || 0) >= 10000],
      ["Streaks", "Weekly Streak", "Contribute 7 consecutive days.", (item.longestStreak || 0) >= 7],
      ["Streaks", "Dedicated Week", "Contribute 14 consecutive days.", (item.longestStreak || 0) >= 14],
      ["Streaks", "Monthly Momentum", "Contribute 30 consecutive days.", (item.longestStreak || 0) >= 30],
      ["Streaks", "Relentless", "Contribute 60 consecutive days.", (item.longestStreak || 0) >= 60],
      ["Streaks", "Archive Devotion", "Contribute 100 consecutive days.", (item.longestStreak || 0) >= 100],
      ["Exploration", "Jack of All Trades", "Create at least one course, program, curriculum, file, notice, and task.", allTrades],
      ["Exploration", "Multitasker", "Earn achievements in 5 different achievement categories.", categoriesUnlocked >= 5],
      ["Exploration", "Completionist", "Unlock 25 achievements.", false],
      ["Exploration", "Master Completionist", "Unlock 50 achievements.", false],
      ["Exploration", "Achievement Hunter", "Unlock 75 achievements.", false],
      ["Exploration", "Legendary Completionist", "Unlock every achievement.", false],
      ["Special", "Founder", "Be one of the original New Eden Dashboard staff.", Boolean(item.isFounder)],
      ["Special", "Night Owl", "Make contributions after midnight.", (item.nightActions || 0) >= 1],
      ["Special", "Early Bird", "Make contributions before 6 AM.", (item.earlyActions || 0) >= 1],
      ["Special", "Weekend Warrior", "Contribute on 10 weekends.", weekendCount >= 10],
      ["Special", "Century Club", "Reach Level 10.", (item.level || 1) >= 10],
      ["Special", "Elite Contributor", "Reach Level 15.", (item.level || 1) >= 15],
      ["Special", "Rank Legend", "Reach Level 20.", (item.level || 1) >= 20],
    ];
    const mapped = entries.map(([category, name, requirement, achieved]) => ({ category, name, requirement, achieved }));
    const unlockedCount = mapped.filter((achievement) => achievement.achieved).length;
    return mapped.map((achievement) => {
      if (achievement.name === "Completionist") return { ...achievement, achieved: unlockedCount >= 25 };
      if (achievement.name === "Master Completionist") return { ...achievement, achieved: unlockedCount >= 50 };
      if (achievement.name === "Achievement Hunter") return { ...achievement, achieved: unlockedCount >= 75 };
      if (achievement.name === "Legendary Completionist") return { ...achievement, achieved: unlockedCount >= mapped.length };
      return achievement;
    });
  }

  function contributionRankClass(title) {
    const normalized = normalizePersonName(title).replace(/\s+/g, "-");
    if (/apprentice/.test(normalized)) return "rank-apprentice";
    if (/contributor/.test(normalized)) return "rank-contributor";
    if (/archivist/.test(normalized)) return "rank-archivist";
    if (/curator/.test(normalized)) return "rank-curator";
    if (/steward/.test(normalized)) return "rank-steward";
    if (/master/.test(normalized)) return "rank-master";
    if (/elder/.test(normalized)) return "rank-elder";
    if (/keeper|guardian|legacy|pillar/.test(normalized)) return "rank-legend";
    return "rank-apprentice";
  }

  function contributionDayKey(value) {
    const date = value ? new Date(Number(value)) : null;
    if (!date || Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function contributionStreaks(dayKeys) {
    const days = Array.from(new Set(dayKeys)).sort();
    if (!days.length) return { current: 0, longest: 0 };
    const dayMs = 24 * 60 * 60 * 1000;
    let longest = 1;
    let run = 1;
    for (let index = 1; index < days.length; index += 1) {
      const previous = Date.parse(`${days[index - 1]}T00:00:00Z`);
      const current = Date.parse(`${days[index]}T00:00:00Z`);
      if (current - previous === dayMs) run += 1;
      else run = 1;
      longest = Math.max(longest, run);
    }
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const yesterdayKey = new Date(today.getTime() - dayMs).toISOString().slice(0, 10);
    let currentStreak = 0;
    if (days.includes(todayKey) || days.includes(yesterdayKey)) {
      currentStreak = 1;
      for (let index = days.length - 1; index > 0; index -= 1) {
        const current = Date.parse(`${days[index]}T00:00:00Z`);
        const previous = Date.parse(`${days[index - 1]}T00:00:00Z`);
        if (current - previous === dayMs) currentStreak += 1;
        else break;
      }
    }
    return { current: currentStreak, longest };
  }

  function isFounderContributor(name) {
    const normalized = normalizePersonName(name).replace(/\./g, "");
    return ["darren", "donna", "larry", "bhumika", "dr duda", "drduda"].includes(normalized);
  }

  function userAvatarMarkup(user) {
    const label = initials(user.name);
    if (user.photoURL) {
      return `<span class="overview-user-avatar"><img src="${escapeAttr(user.photoURL)}" alt="" /></span>`;
    }
    return `<span class="overview-user-avatar">${escapeHtml(label)}</span>`;
  }

  function overviewListItem({ icon, title, meta, detail, warning = false }) {
    return `
      <article class="overview-list-item ${warning ? "has-warning" : ""}">
        <div class="overview-item-icon"><i class="bi ${escapeAttr(icon || "bi-dot")}"></i></div>
        <div>
          <strong>${escapeHtml(title || "Untitled")}</strong>
          <small>${escapeHtml(meta || "")}</small>
          <p>${escapeHtml(detail || "")}</p>
        </div>
      </article>
    `;
  }

  function overviewEmptyState(message) {
    return `<div class="empty-state overview-empty">${escapeHtml(message)}</div>`;
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

  function resetCoursePagination() {
    state.overviewPage = 1;
    state.coursePage = 1;
  }

  function totalPages(totalRows, rowsPerPage) {
    return Math.max(1, Math.ceil(Number(totalRows || 0) / Number(rowsPerPage || 1)));
  }

  function normalizePage(page, totalRows, rowsPerPage) {
    return Math.min(Math.max(1, Number(page || 1)), totalPages(totalRows, rowsPerPage));
  }

  function renderPagination(container, currentPage, pageCount, mode) {
    if (!container) return;
    const attr = mode === "overview" ? "data-overview-page" : mode === "files" ? "data-file-page" : "data-course-page";
    const pages = pageNumbers(currentPage, pageCount);
    const item = (page, label, disabled = false, active = false) => `
      <li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
        <button class="page-link" type="button" ${attr}="${page}" ${disabled ? "disabled" : ""}>${label}</button>
      </li>
    `;

    container.innerHTML = [
      item(Math.max(1, currentPage - 1), `<i class="bi bi-chevron-left"></i>`, currentPage === 1),
      ...pages.map((page) => item(page, page, false, page === currentPage)),
      item(Math.min(pageCount, currentPage + 1), `<i class="bi bi-chevron-right"></i>`, currentPage === pageCount),
    ].join("");
  }

  function pageNumbers(currentPage, pageCount) {
    const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= pageCount)
      .sort((a, b) => a - b);
  }

  async function deleteCourse(index) {
    if (!state.admin) return;

    const course = state.courses[index];
    if (!course) return;

    const references = curriculumRowsForCourse(course);
    const curriculumCount = new Set(references.map((row) => row.program).filter(Boolean)).size || references.length;
    const referenceMessage = references.length
      ? ` This course is being used in ${curriculumCount} curriculum${curriculumCount === 1 ? "" : "s"}. Those requirements will stay in place until they are removed from their programs.`
      : "";
    const confirmed = await confirmAction({
      eyebrow: "Course Archive",
      title: "Delete Course",
      message: `Delete course "${course.name || course.id || "Untitled Course"}"?${referenceMessage}`,
      confirmText: "Delete Course",
      requirePassword: true,
    });
    if (!confirmed) return;

    state.courses.splice(index, 1);

    if (canWriteCloud() && course._docId) {
      const { dbRef, remove } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `courses/${course._docId}`));
      if (course.id) await remove(dbRef(firebaseState.db, `courseIds/${courseDocId(course)}`)).catch(() => {});
    }

    await writeActivity("Deleted Course", "Course", `${course.id} ${course.name}`.trim(), `${references.length} linked requirement row(s) retained.`);
    render();
  }

  async function removeBlankCourses() {
    if (!state.admin) return;
    const blankCourses = archiveHealthReport().blankCourses;
    if (!blankCourses.length) return;
    const confirmed = await confirmAction({
      eyebrow: "Dashboard Health",
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
    await writeActivity("Removed Blank Courses", "Course", "Blank course cleanup", `${blankCourses.length} blank record(s) removed.`);
    render();
  }

  function renderProgramPanel(tab = "overview") {
    const selected = state.selectedProgram || programs()[0]?.name || "";
    const rowsForProgram = curriculumForProgram(selected);
    const totalCredits = rowsForProgram.reduce((sum, row) => sum + Number(row.credit || 0), 0);
    const program = programs().find((item) => item.name === selected);
    const section = rowsForProgram[0]?.section || program?.section || "Program";
    const description = programDescription(program, section);
    const attachments = filesForProgram(selected);

    if (tab === "attachments") {
      els.featuredProgramDetail.style.display = "none";
      document.querySelector("#programAttachments").style.display = "block";
      els.attachmentList.innerHTML = attachments.map((attachment) => `
        <article class="attachment-item">
          <i class="bi bi-file-earmark-text"></i>
          <div>
            <strong>${escapeHtml(attachment.name)}</strong>
            <span>${escapeHtml(formatBytes(attachment.size))} ${attachment.contentType ? `&bull; ${escapeHtml(attachment.contentType)}` : ""}${attachment.matchedCourseIds?.length ? ` &bull; Course ${escapeHtml(attachment.matchedCourseIds.join(", "))}` : ""}</span>
          </div>
          <a class="btn btn-sm btn-outline-eden" href="${escapeAttr(attachment.downloadURL || "#")}" target="_blank" rel="noopener" ${attachment.downloadURL ? "" : "aria-disabled=\"true\""}>
            <i class="bi bi-download"></i>
            Download
          </a>
        </article>
      `).join("") || `<div class="empty-state">No course-linked files have been added for this curriculum yet. Add them from File Manager.</div>`;
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
    const page = normalizePage(state.coursePage, rows.length, state.courseRowsPerPage);
    state.coursePage = page;
    const start = (page - 1) * state.courseRowsPerPage;
    const pageRows = rows.slice(start, start + state.courseRowsPerPage);
    const shownStart = rows.length ? start + 1 : 0;
    const shownEnd = rows.length ? Math.min(start + pageRows.length, rows.length) : 0;

    els.courseCatalogRowsPerPage.value = String(state.courseRowsPerPage);
    els.courseCatalogSummary.textContent = rows.length === totalCourses
      ? `${totalCourses} courses in catalog`
      : `Showing ${rows.length} of ${totalCourses} courses`;
    els.courseCatalogPageSummary.textContent = `Showing ${shownStart} to ${shownEnd} of ${rows.length} courses`;
    renderPagination(els.courseCatalogPagination, page, totalPages(rows.length, state.courseRowsPerPage), "course");
    renderCourseSortHeaders();

    els.courseRows.innerHTML = pageRows.map((course) => {
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
      ? `${programShortName(state.selectedProgram)} - ${allRows.length} required courses totaling ${totalCredits} credits.`
      : "Choose a curriculum to review its required courses and credits.";
    els.programTitle.textContent = programShortName(state.selectedProgram);
    els.programCode.textContent = program?.code || programCode(state.selectedProgram, section);
    const statusContainer = els.programCode?.closest(".program-meta")?.querySelector("span:nth-child(2)");
    if (statusContainer) {
      statusContainer.innerHTML = `<small>Status</small>${statusBadge(program?.status || "Active", "status-pill")}`;
    }
    if (els.programVersion) els.programVersion.textContent = program?.version || "v1.0";
    els.requiredCount.textContent = rows.length;
    if (els.removeCurriculumButton) els.removeCurriculumButton.disabled = !state.selectedProgram || !state.admin;
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
        await removeCurriculumRow(removed);
        await writeActivity("Removed Requirement", "Curriculum Requirement", row?.program || "Curriculum", stripCredit(row?.courseLabel) || row?.courseId || "");
        render();
      });
    });
  }

  function renderPrograms() {
    const categories = programCategories();
    if (!categories.some((category) => category.name === state.selectedProgramCategory)) {
      state.selectedProgramCategory = categories[0]?.name || "";
    }
    els.programCategoryFilter.innerHTML = categories.map((category) => `
      <option value="${escapeAttr(category.name)}">${escapeHtml(category.name)}</option>
    `).join("");
    els.programCategoryFilter.value = state.selectedProgramCategory;

    const category = programCategories().find((item) => item.name === state.selectedProgramCategory);
    if (!category) {
      els.programDirectory.innerHTML = `
        <article class="archive-panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Programs</p>
              <h2>No Program Selected</h2>
            </div>
            <button class="btn btn-eden admin-only" data-add-program type="button">
              <i class="bi bi-plus-circle"></i>
              Add Program
            </button>
          </div>
          <div class="empty-state">No programs match the current search.</div>
        </article>
      `;
      bindProgramWorkspaceActions();
      return;
    }

    const curriculums = programs().filter((program) => program.section === category.name);
    const curriculumRows = state.curriculum.filter((row) => row.section === category.name);
    const totalCredits = curriculumRows.reduce((sum, row) => sum + Number(row.credit || 0), 0);

    els.programDirectory.innerHTML = `
      <div class="programs-workspace">
        <article class="archive-panel program-panel">
          <div class="program-heading">
            <div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <h2>${escapeHtml(category.name)}</h2>
                <span class="badge rounded-pill text-bg-sage">Program</span>
              </div>
              <div class="program-meta">
                <span><small>Status</small>${statusBadge(category.status || "Active", "status-pill")}</span>
                <span><small>Curriculums</small><strong>${curriculums.length}</strong></span>
                <span><small>Total Credits</small><strong>${totalCredits}</strong></span>
              </div>
            </div>
            <button class="btn btn-eden admin-only" data-add-program type="button">
              <i class="bi bi-plus-circle"></i>
              Add Program
            </button>
          </div>

          <div class="program-overview">
            <h3>Overview</h3>
            <p class="mb-3"><strong>Description</strong><br />
              ${escapeHtml(category.description || `${category.name} contains ${curriculums.length} curriculum${curriculums.length === 1 ? "" : "s"} maintained in the New Eden archive.`).replace(/\n/g, "<br />")}
            </p>
            <h3>Notes</h3>
            <p class="mb-3"><strong>Notes</strong><br />
              ${category.notes ? escapeHtml(category.notes).replace(/\n/g, "<br />") : "No notes have been added for this program yet."}
            </p>
            <dl>
              <div><dt>Total Curriculums</dt><dd>${curriculums.length}</dd></div>
              <div><dt>Total Required Courses</dt><dd>${curriculumRows.length}</dd></div>
              <div><dt>Total Credits</dt><dd>${totalCredits}</dd></div>
            </dl>
          </div>

          <div class="program-panel-actions admin-only">
            <button class="btn btn-outline-eden" data-edit-program-category="${escapeAttr(category.name)}" type="button">
              <i class="bi bi-pencil"></i>
              Edit Program
            </button>
            <button class="btn btn-outline-danger" data-remove-program-category="${escapeAttr(category.name)}" type="button">
              Remove Program
            </button>
          </div>
        </article>

        <article class="archive-panel">
          <div class="required-header">
            <div>
              <h3>Curriculums <span class="badge rounded-pill text-bg-sage">${curriculums.length}</span></h3>
            </div>
            <button class="btn btn-outline-eden admin-only" data-manage-program="${escapeAttr(category.name)}" type="button">
              <i class="bi bi-diagram-3"></i>
              Manage Curriculums
            </button>
          </div>
          <div class="table-responsive">
            <table class="table required-table program-structure-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Curriculum</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${curriculums.map((program) => `
                  <tr>
                    <td>${escapeHtml(programShortName(program.name))}</td>
                    <td>${escapeHtml(program.code || programCode(program.name, program.section))}</td>
                    <td>${statusBadge(program.status || "Active")}</td>
                    <td class="text-end">
                      <div class="course-row-actions">
                        <button class="btn btn-sm btn-outline-eden" data-program="${escapeAttr(program.name)}" type="button">Requirements</button>
                        <button class="btn btn-sm btn-outline-danger admin-only" data-remove-program="${escapeAttr(program.name)}" type="button">Remove</button>
                      </div>
                    </td>
                  </tr>
                `).join("") || emptyRow(4, "No curriculums have been added to this program yet.")}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    `;

    bindProgramWorkspaceActions();
  }

  function bindProgramWorkspaceActions() {
    els.programDirectory.querySelectorAll("[data-add-program]").forEach((button) => {
      button.addEventListener("click", () => openProgramBuilder());
    });

    els.programDirectory.querySelectorAll("[data-program]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedProgram = button.dataset.program;
        state.selectedSection = state.selectedProgramCategory || "all";
        state.view = "curriculums";
        render();
      });
    });

    els.programDirectory.querySelectorAll("[data-manage-program]").forEach((button) => {
      button.addEventListener("click", () => openProgramBuilder(button.dataset.manageProgram));
    });

    els.programDirectory.querySelectorAll("[data-edit-program-category]").forEach((button) => {
      button.addEventListener("click", () => openProgramCategoryEditor(button.dataset.editProgramCategory));
    });

    els.programDirectory.querySelectorAll("[data-remove-program-category]").forEach((button) => {
      button.addEventListener("click", () => removeProgramCategory(button.dataset.removeProgramCategory));
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
    const totalPages = Math.max(1, Math.ceil(state.changelogEntries.length / state.historyRowsPerPage));
    state.historyPage = Math.min(Math.max(1, state.historyPage), totalPages);
    const start = (state.historyPage - 1) * state.historyRowsPerPage;
    const visibleEntries = state.changelogEntries.slice(start, start + state.historyRowsPerPage);
    const entryMarkup = (entry, index) => `
      <details class="changelog-entry" ${state.historyPage === 1 && index === 0 ? "open" : ""}>
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
    `;
    els.versionTimeline.innerHTML = visibleEntries.map((entry, index) => entryMarkup(entry, index)).join("")
      || `<div class="empty-state">No changelog entries found.</div>`;
    if (els.versionPagination) {
      const pageButtons = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return `
          <button class="btn btn-sm ${page === state.historyPage ? "btn-eden" : "btn-outline-eden"}" type="button" data-history-page="${page}" ${page === state.historyPage ? "aria-current=\"page\"" : ""}>
            ${page}
          </button>
        `;
      }).join("");
      els.versionPagination.innerHTML = state.changelogEntries.length > state.historyRowsPerPage ? `
        <button class="btn btn-sm btn-outline-eden" type="button" data-history-page="${Math.max(1, state.historyPage - 1)}" ${state.historyPage === 1 ? "disabled" : ""} aria-label="Previous version history page">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="version-page-buttons">${pageButtons}</div>
        <button class="btn btn-sm btn-outline-eden" type="button" data-history-page="${Math.min(totalPages, state.historyPage + 1)}" ${state.historyPage === totalPages ? "disabled" : ""} aria-label="Next version history page">
          <i class="bi bi-chevron-right"></i>
        </button>
      ` : "";
    }
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

    if (els.overviewSectionFilter) {
      els.overviewSectionFilter.innerHTML = sectionOptions;
      els.overviewSectionFilter.value = state.selectedOverviewSection;
    }
    if (els.overviewCreditFilter) {
      els.overviewCreditFilter.innerHTML = creditOptions;
      els.overviewCreditFilter.value = state.selectedCredit;
    }
    if (els.courseCreditFilter) {
      els.courseCreditFilter.innerHTML = creditOptions;
      els.courseCreditFilter.value = state.selectedCredit;
    }
    if (els.statusFilter) {
      els.statusFilter.innerHTML = statusOptions;
      els.statusFilter.value = state.selectedStatus;
    }

    els.sectionFilter.innerHTML = sectionOptions;
    els.sectionFilter.value = state.selectedSection;

    const programOptions = filteredPrograms().map((program) => `<option value="${escapeAttr(program.name)}">${escapeHtml(program.name)}</option>`).join("");
    els.programFilter.innerHTML = programOptions;
  }

function openCourseEditor(index) {
  if (!state.admin) return;
  const course = index == null ? { id: "", credit: credits()[0] || "1", name: "", comment: "" } : state.courses[index];

  openEditor(index == null ? "Add Course" : "Edit Course", [
    field("id", "Course ID", course.id, "text", [], true),
    field("credit", "Credit", course.credit, "select", credits(), true),
    field("name", "Course Name", course.name, "text", [], true),
    field("comment", "Comment", course.comment, "textarea"),
  ], async (values) => {
    const creditPrefix = String(values.credit || "").trim();
    const courseId = String(values.id || "").trim();

    if (!/^\d{4}$/.test(courseId)) {
      return {
        ok: false,
        field: "id",
        message: "Course ID must be exactly 4 numeric digits.",
        disableUntilChange: true,
      };
    }

    if (!String(values.name || "").trim()) {
      return {
        ok: false,
        field: "name",
        message: "Course Name is required.",
      };
    }

    if (creditPrefix && courseId && !courseId.startsWith(creditPrefix)) {
      return {
        ok: false,
        field: "id",
        message: `Course ID must start with ${creditPrefix} when Credit ${creditPrefix} is selected.`,
        disableUntilChange: true,
      };
    }

    const duplicate = findDuplicateCourseId(values.id, index);
    if (duplicate) {
      return {
        ok: false,
        field: "id",
        message: "This course number is already in use. Please enter a unique course number.",
        disableUntilChange: true,
      };
    }

    values._docId = courseDocId(values);
    const previousDocId = course._docId;
    const previousCourseId = course.id;

    if (index == null) state.courses.push(values);
    else state.courses[index] = values;

    await persistCourse(values, previousDocId, previousCourseId);

    if (index != null) {
      await syncCurriculumRowsForCourse(values, previousCourseId);
    }

    await writeActivity(index == null ? "Added Course" : "Edited Course", "Course", `${values.id} ${values.name}`.trim(), values.comment || "");
    render();
    return { ok: true };
  });

  attachCourseIdSuggestionHelper();
}

function numericCourseIdValue(courseId) {
  const match = String(courseId || "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function courseIdSuggestionForCredit(credit) {
  const ids = state.courses
    .filter((course) => String(course.credit) === String(credit))
    .map((course) => numericCourseIdValue(course.id))
    .filter((id) => Number.isFinite(id))
    .sort((a, b) => a - b);

  if (!ids.length) {
    return {
      lastId: "",
      nextId: "",
      message: `No existing Course ID found for Credit ${credit}.`,
    };
  }

  const highestId = ids[ids.length - 1];

  const sequences = [];
  let currentSequence = [ids[0]];

  for (let i = 1; i < ids.length; i += 1) {
    const previous = ids[i - 1];
    const current = ids[i];

    if (current - previous <= 10) {
      currentSequence.push(current);
    } else {
      sequences.push(currentSequence);
      currentSequence = [current];
    }
  }

  sequences.push(currentSequence);

  const mainSequence = sequences.reduce((best, sequence) => {
    if (sequence.length > best.length) return sequence;
    return best;
  }, []);

  const lastSequenceId = mainSequence[mainSequence.length - 1];
  const suggestedNext = lastSequenceId + 1;

  if (highestId !== lastSequenceId) {
    return {
      lastId: lastSequenceId,
      nextId: suggestedNext,
      message: `Credit ${credit} sequence ends at ${lastSequenceId} · Suggested: ${suggestedNext} · Highest outlier: ${highestId}`,
    };
  }

  return {
    lastId: lastSequenceId,
    nextId: suggestedNext,
    message: `Credit ${credit} last ID: ${lastSequenceId} · Next suggested: ${suggestedNext}`,
  };
}

function attachCourseIdSuggestionHelper() {
  const idField = els.editForm?.querySelector('[name="id"]');
  const creditField = els.editForm?.querySelector('[name="credit"]');

  if (!idField || !creditField) return;
  idField.inputMode = "numeric";
  idField.pattern = "\\d{4}";
  idField.maxLength = 4;

  let helper = els.editForm.querySelector("#courseIdSuggestionHelper");

  if (!helper) {
    helper = document.createElement("small");
    helper.id = "courseIdSuggestionHelper";
    helper.className = "form-note course-id-suggestion-helper";
    idField.insertAdjacentElement("afterend", helper);
  }

  const updateHelper = () => {
    const suggestion = courseIdSuggestionForCredit(creditField.value);
    helper.textContent = suggestion.message;
  };

  creditField.addEventListener("change", updateHelper);
  updateHelper();
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
    ], async (values) => {
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
      await persistCurriculumRow(values);
      await writeActivity(index == null ? "Added Requirement" : "Edited Requirement", "Curriculum Requirement", values.program, stripCredit(values.courseLabel) || values.courseId || "");
      render();
      return { ok: true };
    });
  }

  function openCurriculumBuilder() {
    if (!state.admin) return;
    const categoryNames = programCategories().map((category) => category.name);
    const selectedCategory = state.selectedSection !== "all" && categoryNames.includes(state.selectedSection)
      ? state.selectedSection
      : categoryNames[0] || "";

    els.curriculumBuilderProgram.innerHTML = categoryNames.map((name) => `
      <option value="${escapeAttr(name)}">${escapeHtml(name)}</option>
    `).join("");
    els.curriculumBuilderProgram.value = selectedCategory;
    els.curriculumBuilderName.value = "";
    els.curriculumBuilderCode.value = "";
    els.curriculumBuilderStatus.value = "Active";
    els.curriculumBuilderVersion.value = "";
    els.curriculumBuilderDescription.value = "";
    els.curriculumBuilderNotes.value = "";
    els.curriculumBuilderCourseSearch.value = "";
    curriculumBuilder.search = "";
    curriculumBuilder.rows = [];
    renderCurriculumBuilder();
    validateCurriculumBuilder();
    els.curriculumBuilderDialog.showModal();
    setTimeout(() => els.curriculumBuilderName.focus(), 0);
  }

  function renderCurriculumBuilder() {
    const selectedIds = new Set(curriculumBuilder.rows.map((row) => row.courseId));
    const courseMatches = state.courses
      .filter((course) => !selectedIds.has(course.id))
      .filter((course) => !curriculumBuilder.search || matchesText(course, curriculumBuilder.search))
      .slice(0, 16);

    els.curriculumBuilderCoursePicker.innerHTML = courseMatches.map((course) => `
      <button class="course-picker-row" type="button" data-add-curriculum-requirement="${escapeAttr(course.id)}">
        <span>
          <strong>${escapeHtml(course.name)}</strong>
          <small>${escapeHtml(course.id)} &bull; Credit ${escapeHtml(course.credit)}</small>
        </span>
        <i class="bi bi-plus-circle"></i>
      </button>
    `).join("") || `<div class="empty-state">No available courses match the search.</div>`;

    sortCurriculumBuilderRows();
    els.curriculumBuilderSelectedRequirements.innerHTML = curriculumBuilder.rows.map((row, index) => `
      <div class="selected-requirement-row">
        <span class="requirement-order">${index + 1}</span>
        <span>
          <strong>${escapeHtml(stripCredit(row.courseLabel))}</strong>
          <small>${escapeHtml(row.courseId)} &bull; Credit ${escapeHtml(row.credit)}</small>
        </span>
        <span class="requirement-row-actions">
          <button class="table-action" type="button" data-move-curriculum-requirement="${escapeAttr(row.courseId)}" data-direction="up" ${index === 0 ? "disabled" : ""} aria-label="Move requirement up">
            <i class="bi bi-arrow-up"></i>
          </button>
          <button class="table-action" type="button" data-move-curriculum-requirement="${escapeAttr(row.courseId)}" data-direction="down" ${index === curriculumBuilder.rows.length - 1 ? "disabled" : ""} aria-label="Move requirement down">
            <i class="bi bi-arrow-down"></i>
          </button>
          <button class="table-action" type="button" data-remove-curriculum-requirement="${escapeAttr(row.courseId)}" aria-label="Remove requirement">
            <i class="bi bi-x-lg"></i>
          </button>
        </span>
      </div>
    `).join("") || `<div class="empty-state">No course requirements selected yet.</div>`;

    els.curriculumBuilderSelectedCount.textContent = curriculumBuilder.rows.length;
    validateCurriculumBuilder();

    els.curriculumBuilderCoursePicker.querySelectorAll("[data-add-curriculum-requirement]").forEach((button) => {
      button.addEventListener("click", () => {
        const course = state.courses.find((item) => item.id === button.dataset.addCurriculumRequirement);
        if (!course) return;
        curriculumBuilder.rows.push({
          courseLabel: courseLabel(course),
          courseId: course.id,
          credit: course.credit,
          comment: "",
          status: "Active",
          type: "Required",
          order: curriculumBuilder.rows.length + 1,
        });
        renderCurriculumBuilder();
      });
    });

    els.curriculumBuilderSelectedRequirements.querySelectorAll("[data-remove-curriculum-requirement]").forEach((button) => {
      button.addEventListener("click", () => {
        curriculumBuilder.rows = curriculumBuilder.rows.filter((row) => row.courseId !== button.dataset.removeCurriculumRequirement);
        curriculumBuilder.rows.forEach((row, index) => { row.order = index + 1; });
        renderCurriculumBuilder();
      });
    });

    els.curriculumBuilderSelectedRequirements.querySelectorAll("[data-move-curriculum-requirement]").forEach((button) => {
      button.addEventListener("click", () => {
        moveCurriculumBuilderRequirement(button.dataset.moveCurriculumRequirement, button.dataset.direction);
      });
    });
  }

  function sortCurriculumBuilderRows() {
    curriculumBuilder.rows.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    curriculumBuilder.rows.forEach((row, index) => { row.order = index + 1; });
  }

  function moveCurriculumBuilderRequirement(courseId, direction) {
    sortCurriculumBuilderRows();
    const index = curriculumBuilder.rows.findIndex((row) => row.courseId === courseId);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= curriculumBuilder.rows.length) return;
    const [row] = curriculumBuilder.rows.splice(index, 1);
    curriculumBuilder.rows.splice(targetIndex, 0, row);
    curriculumBuilder.rows.forEach((item, itemIndex) => { item.order = itemIndex + 1; });
    renderCurriculumBuilder();
  }

  async function saveCurriculumBuilder() {
    if (!state.admin) return;
    if (!validateCurriculumBuilder()) return;
    const section = els.curriculumBuilderProgram.value.trim();
    const shortName = els.curriculumBuilderName.value.trim();
    if (!section) {
      els.curriculumBuilderProgram.reportValidity();
      return;
    }
    if (!shortName) {
      els.curriculumBuilderName.reportValidity();
      return;
    }

    const fullName = curriculumFullName(section, shortName);
    const existing = programs().find((program) => program.name.toLowerCase() === fullName.toLowerCase());
    if (existing) {
      setCloudStatus(`Curriculum already exists: ${fullName}`);
      return;
    }

    const record = normalizePrograms([{
      section,
      name: fullName,
      code: els.curriculumBuilderCode.value.trim(),
      status: els.curriculumBuilderStatus.value,
      version: els.curriculumBuilderVersion.value.trim() || "v1.0",
      description: els.curriculumBuilderDescription.value.trim(),
      notes: els.curriculumBuilderNotes.value.trim(),
    }])[0];
    if (!record) return;

    sortCurriculumBuilderRows();
    const rowsToSave = curriculumBuilder.rows.map((row, index) => ({
      ...row,
      section,
      program: record.name,
      order: index + 1,
      type: row.type || "Required",
      _docId: curriculumDocId({ ...row, section, program: record.name }, index),
    }));

    state.programRecords.push(record);
    state.curriculum.push(...rowsToSave);

    if (canWriteCloud()) {
      try {
        await persistProgram(record);
        await Promise.all(rowsToSave.map((row) => persistCurriculumRow(row)));
        setCloudStatus(`Saved curriculum: ${record.name}`);
      } catch (error) {
        console.warn("Curriculum save failed.", error);
        setCloudStatus(`Curriculum saved locally; Firebase save failed: ${firebaseErrorMessage(error)}`);
      }
    }

    state.selectedSection = section;
    state.selectedProgram = record.name;
    state.requirementSearch = "";
    state.requirementCredit = "all";
    els.curriculumBuilderDialog.close();
    await writeActivity("Added Curriculum", "Curriculum", record.name, `${rowsToSave.length} requirement(s) added.`);
    render();
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
    await writeActivity("Updated Requirements", "Curriculum", requirementBuilder.programName, `${rowsToSave.length} requirement(s), ${removedRows.length} removed.`);
    render();
  }

  function openProgramCategoryEditor(programName) {
    if (!state.admin) return;
    const existing = programCategories().find((category) => category.name === programName);
    if (!existing) return;
    openEditor("Edit Program", [
      field("name", "Program Name", existing.name, "text", [], true),
      field("status", "Status", existing.status || "Active", "select", ["Active", "Inactive", "Archived"]),
      field("description", "Description", existing.description || "", "textarea"),
      field("notes", "Notes", existing.notes || "", "textarea"),
    ], async (values) => {
      if (!String(values.name || "").trim()) {
        return {
          ok: false,
          field: "name",
          message: "Program Name is required.",
        };
      }
      const oldName = existing.name;
      const nextCategory = normalizeProgramCategories([{
        ...existing,
        name: values.name.trim(),
        status: values.status,
        description: values.description,
        notes: values.notes,
      }])[0];
      if (!nextCategory) return;

      state.programCategories = [
        ...state.programCategories.filter((category) => category.name !== oldName && category.name !== nextCategory.name),
        nextCategory,
      ];

      const changedPrograms = [];
      const changedRows = [];
      if (oldName !== nextCategory.name) {
        state.programRecords.forEach((program) => {
          if (program.section === oldName) {
            program.section = nextCategory.name;
            changedPrograms.push(program);
          }
        });
        state.curriculum.forEach((row) => {
          if (row.section === oldName) {
            row.section = nextCategory.name;
            changedRows.push(row);
          }
        });
        if (state.selectedSection === oldName) state.selectedSection = nextCategory.name;
      }

      if (canWriteCloud()) {
        await persistProgramCategory(nextCategory);
        if (oldName !== nextCategory.name) {
          await removeProgramCategoryRecord(existing._docId || slugify(oldName));
          await Promise.all([
            ...changedPrograms.map((program) => persistProgram(program)),
            ...changedRows.map((row) => persistCurriculumRow(row)),
          ]);
        }
      }
      await writeActivity("Edited Program", "Program", nextCategory.name, oldName !== nextCategory.name ? `Renamed from ${oldName}` : "Updated program details.");
      render();
      return { ok: true };
    });
  }

  function openProgramBuilder(programName = "") {
    if (!state.admin) return;
    const existing = programName
      ? programCategories().find((category) => category.name === programName)
      : null;
    const category = existing || {
      name: "",
      status: "Active",
      description: "",
      notes: "",
    };

    programBuilder.originalName = existing?.name || "";
    programBuilder.name = category.name;
    programBuilder.status = category.status || "Active";
    programBuilder.description = category.description || "";
    programBuilder.notes = category.notes || "";
    programBuilder.curriculums = existing
      ? programs().filter((program) => program.section === existing.name).map((program) => ({ ...program }))
      : [];

    els.programBuilderTitle.textContent = existing ? "Manage Curriculums" : "Add Program";
    els.programBuilderName.value = programBuilder.name;
    els.programBuilderStatus.value = programBuilder.status;
    els.programBuilderDescription.value = programBuilder.description;
    els.programBuilderNotes.value = programBuilder.notes;
    programBuilder.search = "";
    if (els.programBuilderCurriculumSearch) els.programBuilderCurriculumSearch.value = "";
    renderProgramBuilder();
    els.programBuilderDialog.showModal();
    setTimeout(() => els.programBuilderName.focus(), 0);
  }

function renderProgramBuilder() {
  const programName = els.programBuilderName.value.trim() || programBuilder.name || "Program";
  const selectedNames = new Set(programBuilder.curriculums.map((item) => item.name));

  const availableCurriculums = programs()
    .filter((curriculum) => !selectedNames.has(curriculum.name))
    .filter((curriculum) => {
      if (!programBuilder.search) return true;
      const haystack = [
        curriculum.name,
        programShortName(curriculum.name),
        curriculum.code,
        curriculum.section,
        curriculum.status,
      ].join(" ").toLowerCase();
      return haystack.includes(programBuilder.search);
    })
    .sort((a, b) => naturalCompare(programShortName(a.name), programShortName(b.name)))
    .slice(0, 18);

  if (els.programBuilderCurriculumPicker) {
    els.programBuilderCurriculumPicker.innerHTML = availableCurriculums.map((curriculum) => `
      <button class="course-picker-row" type="button" data-add-builder-curriculum="${escapeAttr(curriculum.name)}">
        <span>
          <strong>${escapeHtml(programShortName(curriculum.name))}</strong>
          <small>${escapeHtml(curriculum.code || programCode(curriculum.name, curriculum.section))} &bull; ${escapeHtml(curriculum.section || "No program")} &bull; ${escapeHtml(curriculum.status || "Active")}</small>
        </span>
        <i class="bi bi-plus-circle"></i>
      </button>
    `).join("") || `<div class="empty-state">No available curriculums match the search.</div>`;

    els.programBuilderCurriculumPicker.querySelectorAll("[data-add-builder-curriculum]").forEach((button) => {
      button.addEventListener("click", () => {
        addProgramBuilderCurriculum(button.dataset.addBuilderCurriculum);
      });
    });
  }

  programBuilder.curriculums.sort((a, b) => naturalCompare(programShortName(a.name), programShortName(b.name)));
  els.programBuilderCurriculumCount.textContent = programBuilder.curriculums.length;

  els.programBuilderCurriculumList.innerHTML = programBuilder.curriculums.map((curriculum, index) => `
    <div class="selected-requirement-row">
      <span class="requirement-order">${index + 1}</span>
      <span>
        <strong>${escapeHtml(programShortName(curriculum.name))}</strong>
        <small>${escapeHtml(curriculum.code || programCode(curriculum.name, programName))} &bull; ${escapeHtml(curriculum.status || "Active")}</small>
      </span>
      <span class="requirement-row-actions">
        <button class="table-action" type="button" data-edit-builder-curriculum="${escapeAttr(curriculum.name)}" aria-label="Edit curriculum">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="table-action" type="button" data-remove-builder-curriculum="${escapeAttr(curriculum.name)}" aria-label="Remove curriculum">
          <i class="bi bi-x-lg"></i>
        </button>
      </span>
    </div>
  `).join("") || `<div class="empty-state">Select existing curriculums that belong under ${escapeHtml(programName)}.</div>`;

  els.programBuilderCurriculumList.querySelectorAll("[data-edit-builder-curriculum]").forEach((button) => {
    button.addEventListener("click", () => {
      const curriculum = programBuilder.curriculums.find((item) => item.name === button.dataset.editBuilderCurriculum);
      if (!curriculum) return;
      els.programBuilderDialog.close();
      openProgramEditor(curriculum.name);
    });
  });

  els.programBuilderCurriculumList.querySelectorAll("[data-remove-builder-curriculum]").forEach((button) => {
    button.addEventListener("click", async () => {
      const curriculum = programBuilder.curriculums.find((item) => item.name === button.dataset.removeBuilderCurriculum);
      if (!curriculum) return;
      els.programBuilderDialog.close();
      const confirmed = await confirmAction({
        eyebrow: "Programs",
        title: "Remove Curriculum",
        message: `Remove "${programShortName(curriculum.name)}" from this program builder? Requirement rows will be removed when you save.`,
        confirmText: "Remove",
      });
      if (confirmed) {
        programBuilder.curriculums = programBuilder.curriculums.filter((item) => item.name !== curriculum.name);
      }
      renderProgramBuilder();
      els.programBuilderDialog.showModal();
    });
  });

  validateProgramBuilder();
}

function addProgramBuilderCurriculum(curriculumName) {
  const curriculum = programs().find((item) => item.name === curriculumName);
  if (!curriculum) return;

  if (programBuilder.curriculums.some((item) => item.name === curriculum.name)) return;

  programBuilder.curriculums.push({ ...curriculum });
  renderProgramBuilder();
}

  async function saveProgramBuilder() {
    if (!state.admin) return;
    if (!validateProgramBuilder()) return;
    if (!els.programBuilderName.value.trim()) {
      els.programBuilderName.reportValidity();
      return;
    }
    const previousCategory = programBuilder.originalName
      ? state.programCategories.find((category) => category.name === programBuilder.originalName)
      : null;
    const nextCategory = normalizeProgramCategories([{
      _docId: programBuilder.originalName
        ? previousCategory?._docId || slugify(programBuilder.originalName)
        : undefined,
      name: els.programBuilderName.value.trim(),
      status: els.programBuilderStatus.value,
      description: els.programBuilderDescription.value.trim(),
      notes: els.programBuilderNotes.value.trim(),
    }])[0];
    if (!nextCategory) return;

    const oldName = programBuilder.originalName;
    const oldCurriculums = oldName ? programs().filter((program) => program.section === oldName) : [];
    const nextCurriculums = programBuilder.curriculums.map((curriculum) => normalizePrograms([{
      ...curriculum,
      section: nextCategory.name,
      name: curriculumFullName(nextCategory.name, programShortName(curriculum.name)),
      code: curriculum.code || programCode(programShortName(curriculum.name), nextCategory.name),
    }])[0]);
    const curriculumNameMap = new Map(programBuilder.curriculums.map((curriculum) => {
      const shortName = programShortName(curriculum.name);
      return [curriculum.name, curriculumFullName(nextCategory.name, shortName)];
    }));
    const nextNames = new Set(nextCurriculums.map((curriculum) => curriculum.name));
    const removedCurriculums = oldCurriculums.filter((curriculum) => {
      const expectedNextName = curriculumFullName(nextCategory.name, programShortName(curriculum.name));
      return !nextNames.has(expectedNextName);
    });
    const movedRows = [];

    if (oldName && oldName !== nextCategory.name) {
      state.programRecords.forEach((program) => {
        if (program.section === oldName) program.section = nextCategory.name;
      });
      state.curriculum.forEach((row) => {
        if (row.section === oldName) {
          row.section = nextCategory.name;
          if (curriculumNameMap.has(row.program)) row.program = curriculumNameMap.get(row.program);
          movedRows.push(row);
        }
      });
      const oldIndex = state.programCategories.findIndex((category) => category.name === oldName);
      if (oldIndex >= 0) state.programCategories.splice(oldIndex, 1);
    }

    state.programCategories = [
      ...state.programCategories.filter((category) => category.name !== oldName && category.name !== nextCategory.name),
      nextCategory,
    ];
    state.programRecords = [
      ...state.programRecords.filter((program) => program.section !== nextCategory.name && !removedCurriculums.some((removed) => removed.name === program.name)),
      ...nextCurriculums,
    ];

    const removedRows = state.curriculum.filter((row) => removedCurriculums.some((program) => program.name === row.program));
    state.curriculum = state.curriculum.filter((row) => !removedCurriculums.some((program) => program.name === row.program));

    if (canWriteCloud()) {
      try {
        await persistProgramCategory(nextCategory);
        if (oldName && oldName !== nextCategory.name) {
          await removeProgramCategoryRecord(previousCategory?._docId || slugify(oldName));
        }
        await Promise.all([
          ...nextCurriculums.map((curriculum) => persistProgram(curriculum)),
          ...movedRows.map((row) => persistCurriculumRow(row)),
          ...removedCurriculums.map((curriculum) => removeProgramRecord(curriculum)),
          ...removedRows.map((row) => removeCurriculumRow(row)),
        ]);
        setCloudStatus(`Saved program: ${nextCategory.name}`);
      } catch (error) {
        console.warn("Program save failed.", error);
        setCloudStatus(`Program saved locally; Firebase save failed: ${firebaseErrorMessage(error)}`);
      }
    }

    state.selectedProgramCategory = nextCategory.name;
    state.selectedSection = nextCategory.name;
    state.selectedProgram = nextCurriculums[0]?.name || state.selectedProgram;
    els.programBuilderDialog.close();
    await writeActivity(oldName ? "Edited Program" : "Added Program", "Program", nextCategory.name, `${nextCurriculums.length} curriculum record(s).`);
    render();
  }

  function openProgramEditor(programName) {
    if (!state.admin) return;
    const existing = programName
      ? programs().find((program) => program.name === programName)
      : null;
    const defaultSection = state.selectedSection !== "all"
      ? state.selectedSection
      : programCategories()[0]?.name || sections()[0] || "";
    const program = existing || {
      section: defaultSection,
      name: "",
      code: "",
      status: "Active",
      version: "v1.0",
      description: "",
      notes: "",
    };
    const programOptions = programCategories().map((category) => category.name);

    openEditor(existing ? "Edit Curriculum" : "Add Curriculum", [
      field("section", "Program", program.section, "select", programOptions.length ? programOptions : sections(), true),
      field("name", "Curriculum Name", program.name, "text", [], true),
      field("code", "Curriculum Code", program.code || programCode(program.name, program.section)),
      field("status", "Status", program.status || "Active", "select", ["Active", "Inactive", "Archived"]),
      field("version", "Version", program.version || "v1.0"),
      field("description", "Description", programDescription(program, program.section), "textarea"),
      field("notes", "Notes", program.notes || "", "textarea"),
    ], async (values) => {
      if (!String(values.name || "").trim()) {
        return {
          ok: false,
          field: "name",
          message: "Curriculum Name is required.",
        };
      }
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
      state.selectedSection = record.section || state.selectedSection;
      await persistProgram(record);
      await writeActivity(existing ? "Edited Curriculum" : "Added Curriculum", "Curriculum", record.name, record.description || "");
      render();
      return { ok: true };
    });
  }

  function openEditor(title, fields, onSave) {
    els.editTitle.textContent = title;
    if (els.confirmEdit) els.confirmEdit.disabled = false;
    if (els.editMessage) {
      els.editMessage.hidden = true;
      els.editMessage.textContent = "";
    }
    els.editFields.innerHTML = fields.map((item) => {
      const labelText = `<span class="field-label-text">${escapeHtml(item.label)}${item.required ? ' <span class="required-mark">*</span>' : ""}</span>`;
      if (item.type === "select") {
        return `
          <label class="form-label">${labelText}
            <select name="${escapeAttr(item.name)}" ${item.required ? "required" : ""}>
              ${item.options.map((option) => {
                const value = typeof option === "object" ? option.value : option;
                const label = typeof option === "object" ? option.label : option;
                return `<option value="${escapeAttr(value)}" ${value === item.value ? "selected" : ""}>${escapeHtml(label)}</option>`;
              }).join("")}
            </select>
          </label>
        `;
      }
      if (item.type === "textarea") {
        return `<label class="form-label">${labelText}<textarea name="${escapeAttr(item.name)}" rows="3" ${item.required ? "required" : ""}>${escapeHtml(item.value || "")}</textarea></label>`;
      }
      return `<label class="form-label">${labelText}<input name="${escapeAttr(item.name)}" value="${escapeAttr(item.value || "")}" ${item.required ? "required" : ""} /></label>`;
    }).join("");
    els.editDialog.showModal();
    const updateEditSaveState = () => {
      const requiredFields = Array.from(els.editForm.querySelectorAll("[required]"));
      const requiredOk = requiredFields.every((fieldEl) => String(fieldEl.value || "").trim());
      if (els.confirmEdit) els.confirmEdit.disabled = !requiredOk;
    };
    els.editForm.querySelectorAll("input, select, textarea").forEach((fieldEl) => {
      fieldEl.addEventListener("input", updateEditSaveState);
      fieldEl.addEventListener("change", updateEditSaveState);
    });
    updateEditSaveState();
    document.querySelector("#cancelEdit")?.addEventListener("click", () => {
      els.editForm.onsubmit = null;
      els.editDialog.close("cancel");
    }, { once: true });

    els.editForm.onsubmit = async (event) => {
      event.preventDefault();
      els.editFields.querySelectorAll(".is-invalid").forEach((fieldEl) => fieldEl.classList.remove("is-invalid"));
      const formData = new FormData(els.editForm);
      const result = await onSave(Object.fromEntries(formData.entries()));
      if (result?.ok === false) {
        if (els.editMessage) {
          els.editMessage.hidden = false;
          els.editMessage.textContent = result.message || "Please fix the highlighted field.";
        }
        if (result.disableUntilChange && els.confirmEdit) {
          els.confirmEdit.disabled = true;
        }
        if (result.field) {
          const fieldEl = els.editForm.querySelector(`[name="${CSS.escape(result.field)}"]`);
          fieldEl?.classList.add("is-invalid");
          fieldEl?.focus();
          const clearInvalidState = () => {
            fieldEl.classList.remove("is-invalid");
            if (els.editMessage) {
              els.editMessage.hidden = true;
              els.editMessage.textContent = "";
            }
            if (els.confirmEdit) els.confirmEdit.disabled = false;
            fieldEl.removeEventListener("input", clearInvalidState);
            fieldEl.removeEventListener("change", clearInvalidState);
          };
          fieldEl?.addEventListener("input", clearInvalidState);
          fieldEl?.addEventListener("change", clearInvalidState);
        }
        return;
      }
      els.editDialog.close();
    };
  }

  function field(name, label, value, type = "text", options = [], required = false) {
    return { name, label, value, type, options, required };
  }

  async function initFirebase() {
    if (firebaseDisabled) {
      state.signedIn = true;
      state.authChecking = false;
      setCloudStatus("Realtime Database disabled for test");
      render();
      hideAppLoader();
      return;
    }

    try {
      setCloudStatus("Realtime Database connecting");
      const [appModule, authModule, databaseModule, storageModule, functionsModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-database.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-storage.js`),
        import(`https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-functions.js`),
      ]);

      firebaseState.modules = {
        ...appModule,
        ...authModule,
        getDatabase: databaseModule.getDatabase,
        dbRef: databaseModule.ref,
        get: databaseModule.get,
        onValue: databaseModule.onValue,
        set: databaseModule.set,
        push: databaseModule.push,
        update: databaseModule.update,
        remove: databaseModule.remove,
        onDisconnect: databaseModule.onDisconnect,
        serverTimestamp: databaseModule.serverTimestamp,
        getStorage: storageModule.getStorage,
        storageRef: storageModule.ref,
        uploadBytes: storageModule.uploadBytes,
        uploadBytesResumable: storageModule.uploadBytesResumable,
        getDownloadURL: storageModule.getDownloadURL,
        getBlob: storageModule.getBlob,
        deleteObject: storageModule.deleteObject,
        getFunctions: functionsModule.getFunctions,
        httpsCallable: functionsModule.httpsCallable,
      };
      firebaseState.app = appModule.initializeApp(firebaseConfig);
      firebaseState.auth = authModule.getAuth(firebaseState.app);
      firebaseState.db = databaseModule.getDatabase(firebaseState.app);
      firebaseState.storage = storageModule.getStorage(firebaseState.app);
      firebaseState.functions = functionsModule.getFunctions(firebaseState.app);
      firebaseState.ready = true;
      setCloudStatus("Realtime Database ready");

      authModule.onAuthStateChanged(firebaseState.auth, async (user) => {
        firebaseState.user = user;
        firebaseState.profile = null;
        if (!user) {
          stopRealtimeListeners();
          state.signedIn = false;
          state.admin = false;
          state.adminEligible = false;
          state.authChecking = false;
          sessionStorage.removeItem(adminKey);
          setCloudStatus("Realtime Database ready");
          render();
          hideAppLoader();
          return;
        }

        state.signedIn = true;
        state.admin = false;
        state.adminEligible = false;
        state.authChecking = false;
        els.signInMessage.textContent = "Signed in.";
        setCloudStatus("Loading realtime data");
        try {
          await refreshRoleStatus();
          await recordLastLogin();
          applyDefaultLandingPage();
          const sizes = await loadRealtimeData();
          startRealtimeListeners();
          await startUserPresence();
          setCloudStatus(cloudLoadedMessage(sizes));
        } catch (error) {
          console.warn("Signed in, but realtime data lookup failed.", error);
          setCloudStatus(`Realtime data failed. UID: ${user.uid}`);
        }
        render();
        hideAppLoader();
      });
    } catch (error) {
      console.warn("Firebase unavailable.", error);
      state.authChecking = false;
      setCloudStatus("Cloud offline");
      render();
      hideAppLoader();
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
      state.adminEligible = true;
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
    state.adminEligible = false;
    firebaseState.user = null;
    firebaseState.profile = null;
    sessionStorage.removeItem(adminKey);
    render();
  }

  function openProfileSettings() {
    if (!state.signedIn) {
      els.adminEmail.value = "";
      els.adminPassword.value = "";
      els.adminDialog.showModal();
      return;
    }
    els.profileDisplayName.value = currentUserDisplayName() || "";
    els.profileEmail.value = firebaseState.user?.email || "";
    els.profileDarkMode.checked = isDarkMode();
    els.profileShowRealtimeLoaded.checked = showRealtimeLoadedSummary();
    els.profileLandingPage.value = userSettings().landingPage || "overview";
    els.profileMyTasksOnly.checked = myTasksOnlyEnabled();
    els.profileNotifyNotices.checked = noticeModalsEnabled();
    els.profileNotifyTasks.checked = taskModalsEnabled();
    if (els.profileNotifyAchievements) els.profileNotifyAchievements.checked = achievementModalsEnabled();
    if (els.profileNotifyLevelUps) els.profileNotifyLevelUps.checked = levelUpModalsEnabled();
    if (els.profileLastLogin) els.profileLastLogin.textContent = formatTimestamp(firebaseState.profile?.lastLoginAtMs || Date.parse(firebaseState.user?.metadata?.lastSignInTime || ""));
    if (els.profileUid) els.profileUid.textContent = firebaseState.user?.uid || "Preview";
    if (els.profileAccountRole) els.profileAccountRole.textContent = state.admin ? "Administrator" : "Standard User";
    if (els.profilePhotoInput) els.profilePhotoInput.value = "";
    els.profileNewPassword.value = "";
    els.profileConfirmPassword.value = "";
    els.profileMessage.textContent = "Profile names appear in Connected Users.";
    renderProfilePhotoPreview();
    els.profileDialog.showModal();
    setTimeout(() => els.profileDisplayName.focus(), 0);
  }

  async function saveProfileSettings() {
    if (!state.signedIn) return;
    const displayName = els.profileDisplayName.value.trim();
    const newPassword = els.profileNewPassword.value;
    const confirmPassword = els.profileConfirmPassword.value;
    const darkMode = els.profileDarkMode.checked;
    const showRealtimeLoaded = els.profileShowRealtimeLoaded.checked;
    const landingPage = els.profileLandingPage?.value || "overview";
    const myTasksOnly = Boolean(els.profileMyTasksOnly?.checked);
    const notifyNotices = Boolean(els.profileNotifyNotices?.checked);
    const notifyTasks = Boolean(els.profileNotifyTasks?.checked);
    const notifyAchievements = Boolean(els.profileNotifyAchievements?.checked);
    const notifyLevelUps = Boolean(els.profileNotifyLevelUps?.checked);
    if (!displayName) {
      els.profileMessage.textContent = "Display name is required.";
      els.profileDisplayName.focus();
      return;
    }
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        els.profileMessage.textContent = "Password must be at least 6 characters.";
        els.profileNewPassword.focus();
        return;
      }
      if (newPassword !== confirmPassword) {
        els.profileMessage.textContent = "Password fields do not match.";
        els.profileConfirmPassword.focus();
        return;
      }
    }

    els.profileMessage.textContent = "Saving profile...";
    try {
      const photoURL = await saveProfilePhotoIfNeeded();
      const profile = {
        ...(firebaseState.profile || {}),
        displayName,
        name: displayName,
        email: firebaseState.user?.email || "",
        photoURL: photoURL || firebaseState.profile?.photoURL || "",
        settings: {
          ...(firebaseState.profile?.settings || {}),
          darkMode,
          showRealtimeLoaded,
          landingPage,
          myTasksOnly,
          notifyNotices,
          notifyTasks,
          notifyAchievements,
          notifyLevelUps,
        },
      };
      if (firebaseState.ready && firebaseState.user) {
        const { dbRef, set, updateProfile, updatePassword, serverTimestamp } = firebaseState.modules;
        await Promise.all([
          updateProfile(firebaseState.user, { displayName, photoURL: profile.photoURL || null }).catch(() => {}),
          set(dbRef(firebaseState.db, `users/${firebaseState.user.uid}`), {
            ...profile,
            updatedAt: serverTimestamp(),
          }),
        ]);
        if (newPassword) {
          await updatePassword(firebaseState.user, newPassword);
        }
      }
      firebaseState.profile = profile;
      updateFirebaseStatusVisibility();
      if (els.firebaseStatus) {
        els.firebaseStatus.hidden = !showRealtimeLoaded;
      }
      await startUserPresence();
      render();
      els.profileDialog.close("saved");
    } catch (error) {
      console.warn("Profile save failed.", error);
      els.profileMessage.textContent = profileErrorMessage(error);
    }
  }

  function profileErrorMessage(error) {
    if (error?.code === "auth/requires-recent-login") return "Please sign out and sign back in before changing your password.";
    if (error?.code === "auth/weak-password") return "Password must be at least 6 characters.";
    if (error?.code === "permission-denied" || error?.code === "PERMISSION_DENIED") return "Realtime Database denied profile saving. Publish the updated rules.";
    return error?.message || "Profile save failed.";
  }

  async function recordLastLogin() {
    if (!firebaseState.ready || !firebaseState.user) return;
    const previousLogin = firebaseState.profile?.lastLoginAtMs || Date.parse(firebaseState.user.metadata?.lastSignInTime || "");
    const profile = {
      ...(firebaseState.profile || {}),
      displayName: currentUserDisplayName(),
      name: currentUserDisplayName(),
      email: firebaseState.user.email || "",
      lastLoginAtMs: Date.now(),
      previousLoginAtMs: Number(previousLogin || 0),
      settings: {
        ...(firebaseState.profile?.settings || {}),
      },
    };
    firebaseState.profile = profile;
    try {
      const { dbRef, set, serverTimestamp } = firebaseState.modules;
      await set(dbRef(firebaseState.db, `users/${firebaseState.user.uid}`), {
        ...profile,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn("Last login save failed.", error);
    }
  }

  function applyDefaultLandingPage() {
    const landingPage = userSettings().landingPage || "overview";
    if ([...els.navItems].some((button) => button.dataset.view === landingPage)) {
      state.view = landingPage;
    }
  }

  function renderProfilePhotoPreview() {
    const file = els.profilePhotoInput?.files?.[0];
    const photoURL = file ? URL.createObjectURL(file) : firebaseState.profile?.photoURL || firebaseState.user?.photoURL || "";
    const displayName = els.profileDisplayName?.value.trim() || currentUserDisplayName() || "Employee";
    if (els.profileAvatarImage) {
      els.profileAvatarImage.src = photoURL;
      els.profileAvatarImage.hidden = !photoURL;
    }
    if (els.profileAvatarInitials) {
      els.profileAvatarInitials.textContent = initials(displayName);
      els.profileAvatarInitials.hidden = Boolean(photoURL);
    }
  }

  async function saveProfilePhotoIfNeeded() {
    const file = els.profilePhotoInput?.files?.[0];
    if (!file) return "";
    if (!firebaseState.ready || !firebaseState.user || !firebaseState.storage) {
      throw new Error("Firebase Storage is not ready for profile picture uploads.");
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      throw new Error("Profile picture must be a PNG, JPG, or WebP image.");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Profile picture must be under 2 MB.");
    }
    const pngBlob = await imageFileToPngBlob(file);
    const { storageRef, uploadBytes, getDownloadURL } = firebaseState.modules;
    const avatarRef = storageRef(firebaseState.storage, `profilePictures/${firebaseState.user.uid}/avatar.png`);
    await uploadBytes(avatarRef, pngBlob, { contentType: "image/png" });
    return getDownloadURL(avatarRef);
  }

  function imageFileToPngBlob(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const size = 320;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Could not prepare the profile picture."));
          return;
        }
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;
        context.clearRect(0, 0, size, size);
        context.drawImage(image, x, y, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not convert the profile picture to PNG."));
        }, "image/png", 0.92);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not read the selected profile picture."));
      };
      image.src = objectUrl;
    });
  }

  async function refreshRoleStatus() {
    if (!firebaseState.ready || !firebaseState.user) return;
    const { dbRef, get } = firebaseState.modules;
    const [adminSnap, profileSnap] = await Promise.all([
      get(dbRef(firebaseState.db, `admins/${firebaseState.user.uid}`)),
      get(dbRef(firebaseState.db, `users/${firebaseState.user.uid}`)),
    ]);
    firebaseState.profile = profileSnap.exists() ? profileSnap.val() : null;
    state.adminEligible = adminSnap.exists();
    state.admin = state.adminEligible && sessionStorage.getItem(adminKey) !== "false";
    if (state.adminEligible) {
      setCloudStatus(`Realtime admin: ${firebaseState.user.email}`);
    } else {
      state.admin = false;
      setCloudStatus(`Viewer. Add admins/${firebaseState.user.uid} for admin access.`);
    }
    render();
  }

  async function loadRealtimeData() {
    if (!firebaseState.ready) return;
    const { dbRef, get } = firebaseState.modules;
    const readOptionalPath = (path) => get(dbRef(firebaseState.db, path)).catch((error) => {
      console.warn(`Optional Realtime Database path failed: ${path}`, error);
      return null;
    });
    const [courseSnap, programCategorySnap, programSnap, curriculumSnap, versionSnap, attachmentSnap, fileSnap, emailTemplateSnap, activitySnap, noticeSnap, taskSnap, usersSnap, transcriptSnap, backupSnap, emailDeliverySnap, appSettingsSnap] = await Promise.all([
      get(dbRef(firebaseState.db, "courses")),
      readOptionalPath("programCategories"),
      get(dbRef(firebaseState.db, "programs")),
      get(dbRef(firebaseState.db, "curriculumRows")),
      get(dbRef(firebaseState.db, "versionHistory")),
      get(dbRef(firebaseState.db, "attachments")),
      readOptionalPath("files"),
      readOptionalPath("emailTemplates/studentFiles"),
      readOptionalPath("activityLog"),
      readOptionalPath("notices"),
      readOptionalPath("tasks"),
      readOptionalPath("users"),
      readOptionalPath("transcripts"),
      readOptionalPath("backupHistory"),
      readOptionalPath("emailDeliveries"),
      readOptionalPath("appSettings"),
    ]);

    const sizes = {
      courses: rtdbList(courseSnap.val()).length,
      programCategories: rtdbList(programCategorySnap?.val()).length,
      programs: rtdbList(programSnap.val()).length,
      curriculumRows: rtdbList(curriculumSnap.val()).length,
      versionHistory: rtdbList(versionSnap.val()).length,
      attachments: rtdbList(attachmentSnap.val()).length,
      files: rtdbList(fileSnap?.val()).length,
      emailTemplates: emailTemplateSnap?.exists?.() ? 1 : 0,
      activityLog: rtdbList(activitySnap?.val()).length,
      notices: rtdbList(noticeSnap?.val()).length,
      tasks: rtdbList(taskSnap?.val()).length,
      users: rtdbList(usersSnap?.val()).length,
      transcripts: rtdbList(transcriptSnap?.val()).length,
      backupHistory: rtdbList(backupSnap?.val()).length,
      emailDeliveries: rtdbList(emailDeliverySnap?.val()).length,
    };
    firebaseState.hasCloudArchive = Boolean(sizes.courses || sizes.programCategories || sizes.programs || sizes.curriculumRows);

    if (!firebaseState.hasCloudArchive) {
      attachmentState.records = normalizeAttachments(rtdbList(attachmentSnap.val()));
      fileManagerState.records = normalizeFiles(rtdbList(fileSnap?.val()));
      normalizeStudentEmailTemplate(emailTemplateSnap?.val());
      state.backupHistory = normalizeBackupHistory(rtdbList(backupSnap?.val()));
      state.emailDeliveries = normalizeEmailDeliveries(rtdbList(emailDeliverySnap?.val()));
      state.appSettings = normalizeAppSettings(appSettingsSnap?.val());
      return sizes;
    }

    state.courses = normalizeCourses(rtdbList(courseSnap.val()));
    state.programCategories = normalizeProgramCategories(rtdbList(programCategorySnap?.val()));
    state.programRecords = normalizePrograms(rtdbList(programSnap.val()));
    state.curriculum = normalizeCurriculum(rtdbList(curriculumSnap.val()));
    state.versionHistory = rtdbList(versionSnap.val());
    attachmentState.records = normalizeAttachments(rtdbList(attachmentSnap.val()));
    fileManagerState.records = normalizeFiles(rtdbList(fileSnap?.val()));
    normalizeStudentEmailTemplate(emailTemplateSnap?.val());
    state.activityLog = normalizeActivityLog(rtdbList(activitySnap?.val()));
    state.notices = normalizeNotices(rtdbList(noticeSnap?.val()));
    state.tasks = normalizeTasks(rtdbList(taskSnap?.val()));
    primeNotificationBaselines();
    state.directoryUsers = normalizeDirectoryUsers(rtdbList(usersSnap?.val()));
    state.transcriptDrafts = normalizeTranscriptDrafts(rtdbList(transcriptSnap?.val()));
    state.backupHistory = normalizeBackupHistory(rtdbList(backupSnap?.val()));
    state.emailDeliveries = normalizeEmailDeliveries(rtdbList(emailDeliverySnap?.val()));
    state.appSettings = normalizeAppSettings(appSettingsSnap?.val());

    return sizes;
  }

  function cloudLoadedMessage(sizes = {}) {
    if (!firebaseState.hasCloudArchive) {
      return "Realtime Database empty; add or import records";
    }
    const programCount = programCategories().length;
    const curriculumCount = programs().length;
    const warnings = [];
    if (!sizes.courses) warnings.push("0 courses");
    if (!programCount) warnings.push("0 programs");
    if (!curriculumCount) warnings.push("0 curriculums");
    const summary = `Realtime loaded: ${sizes.courses || 0} courses, ${programCount} programs, ${curriculumCount} curriculums`;
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
    stopRealtimeListeners({ resetNotifications: false });
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

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "programCategories"), (snapshot) => {
      if (!snapshot.exists() && !firebaseState.hasCloudArchive) return;
      state.programCategories = normalizeProgramCategories(rtdbList(snapshot.val()));
      render();
    }, (error) => {
      console.warn("Optional programCategories listener failed.", error);
    }));

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

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "files"), (snapshot) => {
      fileManagerState.records = normalizeFiles(rtdbList(snapshot.val()));
      renderFileManager();
      renderSelectedEmailFiles();
      renderProgramPanel(activeProgramTab());
      renderOverview();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "emailTemplates/studentFiles"), (snapshot) => {
      normalizeStudentEmailTemplate(snapshot.val());
      renderEmailTemplateControls();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "activityLog"), (snapshot) => {
      state.activityLog = normalizeActivityLog(rtdbList(snapshot.val()));
      handleContributionNotifications();
      renderActivityLog();
      renderSidebarRankCard();
      renderOverview();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "notices"), (snapshot) => {
      const notices = normalizeNotices(rtdbList(snapshot.val()));
      handleNoticeNotifications(notices);
      state.notices = notices;
      renderNotices();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "tasks"), (snapshot) => {
      const tasks = normalizeTasks(rtdbList(snapshot.val()));
      handleTaskNotifications(tasks);
      state.tasks = tasks;
      renderTasks();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "transcripts"), (snapshot) => {
      state.transcriptDrafts = normalizeTranscriptDrafts(rtdbList(snapshot.val()));
      renderTranscriptDrafts();
      renderAdministration();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "backupHistory"), (snapshot) => {
      state.backupHistory = normalizeBackupHistory(rtdbList(snapshot.val()));
      renderBackupCenter();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "emailDeliveries"), (snapshot) => {
      state.emailDeliveries = normalizeEmailDeliveries(rtdbList(snapshot.val()));
      renderEmailDispatchCenter();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "appSettings"), (snapshot) => {
      state.appSettings = normalizeAppSettings(snapshot.val());
      renderAdministration();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "users"), (snapshot) => {
      state.directoryUsers = normalizeDirectoryUsers(rtdbList(snapshot.val()));
      renderTasks();
      renderUserChip();
      renderOverview();
    }, handleSnapshotError));

    firebaseState.unsubscribers.push(onValue(dbRef(firebaseState.db, "presence"), (snapshot) => {
      state.connectedUsers = normalizePresence(snapshot.val());
      renderConnectionMeta();
      renderOverview();
    }, (error) => {
      console.warn("Presence listener failed.", error);
    }));
  }

  function stopRealtimeListeners(options = {}) {
    const { resetNotifications = true } = options;

    firebaseState.unsubscribers.forEach((unsubscribe) => unsubscribe());
    firebaseState.unsubscribers = [];
    stopUserPresence();
    state.connectedUsers = [];

    if (resetNotifications) {
      state.notificationsReady = false;
      state.contributionNotificationsReady = false;
      state.knownContributionLevels = new Map();
      state.knownAchievements = new Map();
    }
  }

  function primeNotificationBaselines() {
    state.knownNoticeIds = new Set(state.notices.map((notice) => notice._docId));
    state.knownTaskStates = new Map(state.tasks.map((task) => [task._docId, taskNotificationSignature(task)]));
    const current = currentContributorStats();
    state.knownContributionLevels = new Map(current ? [[current.key, current.level]] : []);
    state.knownAchievements = new Map(current ? [[current.key, new Set(current.achievements)]] : []);
    state.contributionNotificationsReady = true;
    state.notificationsReady = true;
  }

  function handleNoticeNotifications(notices) {
    if (!state.notificationsReady) {
      state.knownNoticeIds = new Set(notices.map((notice) => notice._docId));
      return;
    }
    const activeNotices = notices.filter((notice) => notice.status !== "deleted");
    const newNotice = activeNotices
      .filter((notice) => !state.knownNoticeIds.has(notice._docId))
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))[0];
    state.knownNoticeIds = new Set(notices.map((notice) => notice._docId));
    if (!newNotice || !noticeModalsEnabled()) return;
    showThemedNotification({
      eyebrow: "Notice",
      title: "New Notice",
      message: newNotice.message,
      confirmText: "OK",
    });
  }

  function handleTaskNotifications(tasks) {
    if (!state.notificationsReady) {
      state.knownTaskStates = new Map(tasks.map((task) => [task._docId, taskNotificationSignature(task)]));
      return;
    }
    const previous = state.knownTaskStates;
    const displayName = currentUserDisplayName();
    const changedTask = tasks
      .filter((task) => task.assigneeUid === firebaseState.user?.uid || (displayName && task.assigneeName === displayName))
      .find((task) => previous.has(task._docId) && previous.get(task._docId) !== taskNotificationSignature(task));
    const newTask = tasks
      .filter((task) => task.assigneeUid === firebaseState.user?.uid || (displayName && task.assigneeName === displayName))
      .find((task) => !previous.has(task._docId));
    state.knownTaskStates = new Map(tasks.map((task) => [task._docId, taskNotificationSignature(task)]));
    if (!taskModalsEnabled()) return;
    const task = newTask || changedTask;
    if (!task) return;
    showThemedNotification({
      eyebrow: "Task",
      title: newTask ? "New Task Assigned" : "Task Updated",
      message: `${task.title} - ${task.status === "done" ? "Done" : "Open"}`,
      confirmText: "OK",
    });
  }

  function taskNotificationSignature(task) {
    return [
      task.status || "open",
      task.assigneeUid || "",
      task.assigneeName || "",
      task.updatedAtMs || task.createdAtMs || "",
    ].join("|");
  }

  function showThemedNotification(options) {
    if (!els.toastStack) {
      void alertAction(options);
      return;
    }
    const toast = document.createElement("article");
    const icon = toastIcon(options.eyebrow || options.title);
    toast.className = "dashboard-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <span class="toast-icon"><i class="bi ${escapeAttr(icon)}"></i></span>
      <div>
        <small>${escapeHtml(options.eyebrow || "Dashboard")}</small>
        <strong>${escapeHtml(options.title || "New Update")}</strong>
        <p>${escapeHtml(options.message || "")}</p>
      </div>
      <button type="button" aria-label="Dismiss notification" data-dismiss-toast><i class="bi bi-x-lg"></i></button>
    `;
    els.toastStack.appendChild(toast);
    const timer = window.setTimeout(() => dismissToast(toast), 5200);
    toast.querySelector("[data-dismiss-toast]")?.addEventListener("click", () => {
      window.clearTimeout(timer);
      dismissToast(toast);
    });
  }

  function toastIcon(label) {
    const value = String(label || "").toLowerCase();
    if (/achievement/.test(value)) return "bi-trophy-fill";
    if (/level/.test(value)) return "bi-star-fill";
    if (/notice|announcement/.test(value)) return "bi-megaphone";
    if (/task/.test(value)) return "bi-check2-square";
    return "bi-bell";
  }

  function dismissToast(toast) {
    if (!toast || toast.classList.contains("is-leaving")) return;
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 190);
  }

  function handleContributionNotifications() {
    const current = currentContributorStats();
    if (!current) return;
    if (!state.contributionNotificationsReady) {
      state.knownContributionLevels.set(current.key, current.level);
      state.knownAchievements.set(current.key, new Set(current.achievements));
      return;
    }
    const previousLevel = state.knownContributionLevels.get(current.key) || current.level;
    const previousAchievements = state.knownAchievements.get(current.key) || new Set(current.achievements);
    const newAchievement = current.achievements.find((achievement) => !previousAchievements.has(achievement));
    state.knownContributionLevels.set(current.key, current.level);
    state.knownAchievements.set(current.key, new Set(current.achievements));
    if (current.level > previousLevel && levelUpModalsEnabled()) {
      showThemedNotification({
        eyebrow: "Level Up",
        title: current.title,
        message: `You reached Level ${current.level}.`,
        confirmText: "Nice",
      });
      return;
    }
    if (newAchievement && achievementModalsEnabled()) {
      const achievement = contributionAchievementCatalog(current).find((item) => item.name === newAchievement);
      showThemedNotification({
        eyebrow: "Achievement Unlocked",
        title: newAchievement,
        message: achievement?.requirement || "New contributor achievement earned.",
        confirmText: "Nice",
      });
    }
  }

  async function startUserPresence() {
    if (!firebaseState.ready || !firebaseState.user) return;
    try {
      const { dbRef, set, remove, onDisconnect, serverTimestamp } = firebaseState.modules;
      if (firebaseState.presenceRef) {
        await remove(firebaseState.presenceRef).catch(() => {});
      }
      const user = firebaseState.user;
      const displayName = currentUserDisplayName() || user.email?.split("@")[0] || "Employee";
      firebaseState.presenceRef = dbRef(firebaseState.db, `presence/${user.uid}`);
      await set(firebaseState.presenceRef, {
        uid: user.uid,
        name: displayName,
        email: user.email || "",
        photoURL: firebaseState.profile?.photoURL || user.photoURL || "",
        role: state.admin ? "admin" : "viewer",
        connectedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });
      onDisconnect(firebaseState.presenceRef).remove();
    } catch (error) {
      console.warn("Presence registration failed.", error);
    }
  }

  function stopUserPresence() {
    if (!firebaseState.presenceRef || !firebaseState.modules?.remove) return;
    firebaseState.modules.remove(firebaseState.presenceRef).catch(() => {});
    firebaseState.presenceRef = null;
  }

  function normalizePresence(value) {
    return rtdbList(value)
      .filter((record) => record.name || record.email)
      .map((record) => ({
        uid: record.uid || record._docId,
        name: record.name || record.email?.split("@")[0] || "Employee",
        email: record.email || "",
        photoURL: record.photoURL || "",
        connectedAtMs: Number(record.connectedAt || record.connectedAtMs || 0),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async function persistCourse(course, previousDocId = "", previousCourseId = "") {
    if (!canWriteCloud()) return;
    const { dbRef, set, remove, serverTimestamp } = firebaseState.modules;
    course._docId = courseDocId(course);
    if (previousDocId && previousDocId !== course._docId) {
      await remove(dbRef(firebaseState.db, `courses/${previousDocId}`)).catch(() => {});
    }
    if (previousCourseId && previousCourseId !== course.id) {
      await remove(dbRef(firebaseState.db, `courseIds/${courseDocId({ id: previousCourseId })}`)).catch(() => {});
    }
    await set(dbRef(firebaseState.db, `courses/${course._docId}`), {
      ...archiveCourse(course),
      _docId: course._docId,
      updatedAt: serverTimestamp(),
    });
    if (course.id) {
      await set(dbRef(firebaseState.db, `courseIds/${course._docId}`), course._docId);
    }
  }

async function syncCurriculumRowsForCourse(course, previousCourseId = "") {
  const normalizeCourseName = (value) => stripCredit(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const currentId = String(course.id || "");
  const oldId = String(previousCourseId || "");
  const courseName = normalizeCourseName(course.name);

  const changedRows = [];

  state.curriculum = state.curriculum.map((row) => {
    const rowCourseId = String(row.courseId || "");
    const rowCourseName = normalizeCourseName(row.courseLabel || row.name || "");

    const matchesCourse =
      rowCourseId === currentId ||
      rowCourseId === oldId ||
      rowCourseName === courseName;

    if (!matchesCourse) return row;

    const updatedRow = {
      ...row,
      courseId: course.id,
      credit: course.credit,
      courseLabel: courseLabel(course),
    };

    changedRows.push(updatedRow);
    return updatedRow;
  });

  if (canWriteCloud() && changedRows.length) {
    await Promise.all(changedRows.map((row) => persistCurriculumRow(row)));
  }
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

  async function persistProgramCategory(category) {
    if (!canWriteCloud()) return;
    const { dbRef, set, serverTimestamp } = firebaseState.modules;
    category._docId = category._docId || slugify(category.name);
    await set(dbRef(firebaseState.db, `programCategories/${category._docId}`), {
      ...archiveProgramCategory(category),
      _docId: category._docId,
      updatedAt: serverTimestamp(),
    });
  }

  async function removeProgramRecord(program) {
    if (!canWriteCloud() || !program?._docId) return;
    const { dbRef, remove } = firebaseState.modules;
    await remove(dbRef(firebaseState.db, `programs/${program._docId}`));
  }

  async function removeProgramCategoryRecord(docId) {
    if (!canWriteCloud() || !docId) return;
    const { dbRef, remove } = firebaseState.modules;
    await remove(dbRef(firebaseState.db, `programCategories/${docId}`));
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
      title: "Delete Curriculum",
      message: `Delete curriculum "${programName}" and ${count} requirement row(s)? This permanently removes the curriculum from the archive.`,
      confirmText: "Delete Curriculum",
      requirePassword: true,
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
    await writeActivity("Deleted Curriculum", "Curriculum", programName, `${removedRows.length} requirement row(s) deleted.`);
    render();
  }

  async function removeProgramCategory(programName) {
    if (!state.admin || !programName) return;
    const category = programCategories().find((item) => item.name === programName);
    const curriculums = programs().filter((program) => program.section === programName);
    const rows = state.curriculum.filter((row) => row.section === programName);
    const confirmed = await confirmAction({
      eyebrow: "Programs",
      title: "Delete Program",
      message: `Delete program "${programName}" plus ${curriculums.length} curriculum record(s) and ${rows.length} requirement row(s)? This permanently removes the program from the archive.`,
      confirmText: "Delete Program",
      requirePassword: true,
    });
    if (!confirmed) return;

    state.programCategories = state.programCategories.filter((item) => item.name !== programName);
    state.programRecords = state.programRecords.filter((program) => program.section !== programName);
    state.curriculum = state.curriculum.filter((row) => row.section !== programName);

    if (canWriteCloud()) {
      await Promise.all([
        removeProgramCategoryRecord(category?._docId || slugify(programName)),
        ...curriculums.map((program) => removeProgramRecord(program)),
        ...rows.map((row) => removeCurriculumRow(row)),
      ]);
    }

    if (state.selectedSection === programName) state.selectedSection = "all";
    if (curriculums.some((program) => program.name === state.selectedProgram)) {
      state.selectedProgram = programs()[0]?.name || "";
    }
    await writeActivity("Deleted Program", "Program", programName, `${curriculums.length} curriculum record(s), ${rows.length} requirement row(s) deleted.`);
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
      await writeActivity("Uploaded Attachment", "Attachment", state.selectedProgram, `${files.length} local preview file(s) added.`);
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
      await writeActivity("Uploaded Attachment", "Attachment", state.selectedProgram, uploadedAttachments.map((attachment) => attachment.name).join(", "));
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
    await writeActivity("Removed Attachment", "Attachment", attachment.ownerName || "Curriculum", attachment.name);
    renderProgramPanel("attachments");
  }

  function canWriteCloud() {
    return firebaseState.ready && firebaseState.user && state.admin;
  }

  async function runBackup(type) {
    if (!state.admin) return;
    const started = Date.now();
    const entry = {
      type,
      status: "Completed",
      startedByUid: firebaseState.user?.uid || "preview",
      startedByName: currentUserDisplayName() || "Local Preview",
      duration: "Framework only",
      destination: state.appSettings.backupDestination || defaultAppSettings.backupDestination,
      createdAtMs: started,
    };
    state.backupHistory.unshift({ _docId: `local-${started}`, ...entry });
    renderBackupCenter();
    if (canWriteCloud()) {
      const { dbRef, push, set, serverTimestamp } = firebaseState.modules;
      const backupRef = push(dbRef(firebaseState.db, "backupHistory"));
      await set(backupRef, {
        ...entry,
        _docId: backupRef.key,
        createdAt: serverTimestamp(),
      });
    }
    await writeActivity(`Ran ${type} Backup`, "Backup", `${type} Backup`, `${entry.status}; ${entry.destination}`);
    setCloudStatus(`${type} backup recorded. OneDrive file transfer integration is pending.`);
  }

  async function sendTestEmail() {
    if (!state.admin) return;
    const email = els.testEmailAddress?.value.trim() || "";
    validateAdministrationEmailControls();
    if (!email || !isValidEmail(email)) {
      els.testEmailAddress?.focus();
      return;
    }
    const template = activeEmailTemplate();
    const deliveryBase = {
      recipient: email,
      templateId: template._docId,
      templateName: template.name || "Email Dispatch",
      fileCount: 0,
      createdByUid: firebaseState.user?.uid || "preview",
      createdByName: currentUserDisplayName() || "Local Preview",
      createdAtMs: Date.now(),
    };
    try {
      if (!firebaseState.ready || !firebaseState.functions) {
        throw new Error("Cloud Functions are not connected in this preview.");
      }
      const sendStudentFilesEmail = firebaseState.modules.httpsCallable(firebaseState.functions, "sendStudentFilesEmail");
      await sendStudentFilesEmail({
        recipientEmail: email,
        selectedFileIds: [],
        subject: `New Eden Dashboard test email`,
        bodyMarkdown: "This is a New Eden Dashboard email service test.",
        test: true,
      });
      await recordEmailDelivery({ ...deliveryBase, status: "success", error: "" });
      setCloudStatus(`Test email sent to ${email}.`);
    } catch (error) {
      await recordEmailDelivery({ ...deliveryBase, status: "failed", error: firebaseErrorMessage(error) });
      setCloudStatus(`Test email failed: ${firebaseErrorMessage(error)}`);
    }
    els.testEmailAddress.value = "";
    renderAdministration();
  }

  async function recordEmailDelivery(delivery) {
    const record = { _docId: delivery._docId || `local-${Date.now()}`, ...delivery };
    state.emailDeliveries.unshift(record);
    if (canWriteCloud()) {
      const { dbRef, push, set, serverTimestamp } = firebaseState.modules;
      const deliveryRef = push(dbRef(firebaseState.db, "emailDeliveries"));
      await set(deliveryRef, {
        ...delivery,
        _docId: deliveryRef.key,
        createdAt: serverTimestamp(),
      });
    }
    await writeActivity(
      delivery.status === "success" ? "Sent Test Email" : "Failed Test Email",
      "Student Email",
      delivery.recipient,
      delivery.error || `Template: ${delivery.templateName || "Email Dispatch"}`
    );
  }

  async function saveAppSettings() {
    if (!state.admin) return;
    const transcriptFilenameFormat = els.transcriptFilenameFormat?.value.trim()
      || defaultAppSettings.transcriptFilenameFormat;
    state.appSettings = {
      ...state.appSettings,
      transcriptFilenameFormat,
    };
    if (canWriteCloud()) {
      const { dbRef, update, serverTimestamp } = firebaseState.modules;
      await update(dbRef(firebaseState.db, "appSettings"), {
        ...state.appSettings,
        updatedAt: serverTimestamp(),
        updatedAtMs: Date.now(),
      });
    }
    await writeActivity("Updated App Settings", "App Settings", "Transcript filename format", transcriptFilenameFormat);
    setCloudStatus("Saved app settings.");
    renderAdministration();
  }

  function runMaintenanceCheck(check) {
    state.maintenanceCheck = check || "";
    renderMaintenanceResults();
    if (check) {
      const report = maintenanceReport(check);
      setCloudStatus(`${report.title}: ${report.items.length} finding(s).`);
    }
  }

  function maintenanceReport(check) {
    const report = archiveHealthReport();
    const fileNameCounts = countBy(fileManagerState.records, (file) => String(file.name || "").trim().toLowerCase());
    const filePathCounts = countBy(fileManagerState.records, (file) => String(file.storagePath || "").trim().toLowerCase());
    const transcriptFiles = transcriptFileRecords();
    const failedEmails = emailDeliveryRecords().filter((entry) => entry.status === "failed");
    const courseIdIssues = [
      ...report.duplicateCourseIds.map((item) => ({
        title: `Duplicate course ID ${item.id}`,
        meta: `${item.count} records`,
        detail: item.names,
        warning: true,
      })),
      ...state.courses.filter((course) => !String(course.id || "").trim()).map((course) => ({
        title: course.name || "Course without ID",
        detail: "Missing course ID.",
        warning: true,
      })),
      ...state.courses.filter((course) => String(course.id || "").trim() && !/^[A-Za-z0-9-]+$/.test(String(course.id || "").trim())).map((course) => ({
        title: `${course.id} ${course.name}`.trim(),
        detail: "Course ID contains unusual formatting.",
        warning: true,
      })),
    ];
    const duplicateFiles = [
      ...Object.entries(fileNameCounts).filter(([, count]) => count > 1).map(([name, count]) => ({
        title: name || "Unnamed file",
        meta: `${count} files share this name`,
        detail: "Review duplicate file names in File Manager.",
        warning: true,
      })),
      ...Object.entries(filePathCounts).filter(([path, count]) => path && count > 1).map(([path, count]) => ({
        title: path,
        meta: `${count} records share this storage path`,
        detail: "Review duplicate storage references.",
        warning: true,
      })),
    ];
    const emptyCurriculums = programs().filter((program) => curriculumForProgram(program.name).length === 0);
    const transcriptIssues = transcriptFiles
      .filter((file) => !file.downloadURL || !file.storagePath || !file.size)
      .map((file) => ({
        title: file.name || "Transcript file",
        meta: file.category || "Transcript",
        detail: [
          !file.downloadURL ? "missing download URL" : "",
          !file.storagePath ? "missing storage path" : "",
          !file.size ? "missing file size" : "",
        ].filter(Boolean).join(", "),
        warning: true,
      }));
    const reports = {
      courseIds: {
        title: "Course ID Validation",
        empty: "No duplicate, missing, or unusual course IDs found.",
        items: courseIdIssues,
      },
      duplicateFiles: {
        title: "Duplicate Files",
        empty: "No duplicate file names or storage references found.",
        items: duplicateFiles,
      },
      unlinkedFiles: {
        title: "Unlinked Files",
        empty: "No unlinked non-transcript files found.",
        items: fileManagerState.records
          .filter((file) => file.category !== "Transcript" && !file.courseIds.length)
          .map((file) => ({
            title: file.name,
            meta: file.category || "Other",
            detail: "This file is not linked to any course.",
            warning: true,
          })),
      },
      emptyCurriculums: {
        title: "Empty Curriculums",
        empty: "No empty curriculums found.",
        items: emptyCurriculums.map((program) => ({
          title: programShortName(program.name),
          meta: program.section || "Program",
          detail: "No required courses are attached.",
          warning: true,
        })),
      },
      transcripts: {
        title: "Transcript Validation",
        empty: "No transcript file metadata issues found.",
        items: transcriptIssues,
      },
      failedEmails: {
        title: "Failed Email Diagnostics",
        empty: "No failed email records found.",
        items: failedEmails.map((entry) => ({
          title: entry.recipient || entry.entityName || "Failed email",
          meta: formatTimestamp(entry.createdAtMs),
          detail: entry.error || entry.details || "No error message recorded.",
          warning: true,
        })),
      },
    };
    return reports[check] || { title: "Maintenance", empty: "Choose a check.", items: [] };
  }

  function countBy(items, picker) {
    return items.reduce((acc, item) => {
      const key = picker(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  async function writeActivity(action, entityType, entityName, details = "") {
    const entry = {
      action,
      entityType,
      entityName,
      details,
      userUid: firebaseState.user?.uid || "preview",
      userName: currentUserDisplayName() || "Local Preview",
      userEmail: firebaseState.user?.email || "",
      createdAtMs: Date.now(),
    };
    state.activityLog.push({ _docId: `local-${Date.now()}`, ...entry });
    renderActivityLog();
    if (!firebaseState.ready || !firebaseState.user) return;
    const { dbRef, push, set, serverTimestamp } = firebaseState.modules;
    const logRef = push(dbRef(firebaseState.db, "activityLog"));
    await set(logRef, {
      ...entry,
      _docId: logRef.key,
      createdAt: serverTimestamp(),
    });
  }

  async function createNotice() {
    if (!state.admin) return;
    const message = els.noticeMessage.value.trim();
    if (!message) {
      els.noticeMessage.focus();
      return;
    }
    const activeNoticeCount = state.notices.filter((notice) => notice.status !== "deleted").length;
    if (activeNoticeCount >= 3) {
      await alertAction({
        eyebrow: "Notices",
        title: "Notice Limit Reached",
        message: "The archive can show up to 3 active notices. Delete a previous notice before adding another.",
        confirmText: "OK",
      });
      return;
    }
    const notice = {
      message,
      status: "active",
      authorUid: firebaseState.user?.uid || "preview",
      authorName: currentUserDisplayName() || "Admin",
      createdAtMs: Date.now(),
      updatedAtMs: Date.now(),
    };
    els.noticeMessage.value = "";
    if (canWriteCloud()) {
      const { dbRef, push, set, serverTimestamp } = firebaseState.modules;
      const noticeRef = push(dbRef(firebaseState.db, "notices"));
      notice._docId = noticeRef.key;
      await set(noticeRef, {
        ...notice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      notice._docId = `local-${Date.now()}`;
      state.notices.push(notice);
      renderNotices();
    }
    await writeActivity("Created Notice", "Notice", "Announcement", message);
  }

  async function editNotice(docId) {
    if (!state.admin) return;
    const notice = state.notices.find((item) => item._docId === docId);
    if (!notice) return;
    openEditor("Edit Notice", [
      field("message", "Notice Message", notice.message, "textarea"),
    ], async (values) => {
      const message = values.message.trim();
      if (!message) return;
      notice.message = message;
      notice.updatedAtMs = Date.now();
      if (canWriteCloud()) {
        const { dbRef, update, serverTimestamp } = firebaseState.modules;
        await update(dbRef(firebaseState.db, `notices/${notice._docId}`), {
          message,
          updatedAtMs: notice.updatedAtMs,
          updatedAt: serverTimestamp(),
        });
      }
      await writeActivity("Edited Notice", "Notice", "Announcement", message);
      renderNotices();
    });
  }

  async function deleteNotice(docId) {
    if (!state.admin) return;
    const notice = state.notices.find((item) => item._docId === docId);
    if (!notice) return;
    const confirmed = await confirmAction({
      eyebrow: "Notices",
      title: "Delete Notice",
      message: `Delete this notice: "${notice.message}"?`,
      confirmText: "Delete Notice",
    });
    if (!confirmed) return;
    state.notices = state.notices.filter((item) => item._docId !== docId);
    if (canWriteCloud()) {
      const { dbRef, remove } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `notices/${docId}`));
    }
    await writeActivity("Deleted Notice", "Notice", "Announcement", notice.message);
    renderNotices();
  }

  async function createTask() {
    if (!state.admin) return;
    const title = els.taskTitle.value.trim();
    if (!title) {
      els.taskTitle.focus();
      return;
    }
    const assignee = taskAssignees().find((user) => user.uid === els.taskAssignee.value) || taskAssignees()[0];
    const task = {
      title,
      description: els.taskDescription.value.trim(),
      assigneeUid: assignee?.uid || "",
      assigneeName: assignee?.name || "Unassigned",
      status: "open",
      createdByUid: firebaseState.user?.uid || "preview",
      createdByName: currentUserDisplayName() || "Admin",
      createdAtMs: Date.now(),
      updatedAtMs: Date.now(),
    };
    els.taskTitle.value = "";
    els.taskDescription.value = "";
    if (canWriteCloud()) {
      const { dbRef, push, set, serverTimestamp } = firebaseState.modules;
      const taskRef = push(dbRef(firebaseState.db, "tasks"));
      task._docId = taskRef.key;
      await set(taskRef, {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      task._docId = `local-${Date.now()}`;
      state.tasks.push(task);
      renderTasks();
    }
    await writeActivity("Opened Task", "Task", title, `Assigned to ${task.assigneeName}`);
  }

  async function editTask(docId) {
    if (!state.admin) return;
    const task = state.tasks.find((item) => item._docId === docId);
    if (!task) return;
    const users = taskAssignees();
    openEditor("Edit Task", [
      field("title", "Task Title", task.title),
      field("description", "Description", task.description || "", "textarea"),
      field("assigneeUid", "Assignee", task.assigneeUid, "select", users.map((user) => ({ value: user.uid, label: user.name }))),
      field("status", "Status", task.status || "open", "select", ["open", "done"]),
    ], async (values) => {
      const assignee = users.find((user) => user.uid === values.assigneeUid) || users[0];
      Object.assign(task, {
        title: values.title.trim(),
        description: values.description.trim(),
        assigneeUid: assignee?.uid || "",
        assigneeName: assignee?.name || "Unassigned",
        status: values.status,
        updatedAtMs: Date.now(),
      });
      if (canWriteCloud()) {
        const { dbRef, update, serverTimestamp } = firebaseState.modules;
        await update(dbRef(firebaseState.db, `tasks/${docId}`), {
          title: task.title,
          description: task.description,
          assigneeUid: task.assigneeUid,
          assigneeName: task.assigneeName,
          status: task.status,
          updatedAtMs: task.updatedAtMs,
          updatedAt: serverTimestamp(),
        });
      }
      await writeActivity("Edited Task", "Task", task.title, `Assigned to ${task.assigneeName}; status ${task.status}`);
      renderTasks();
    });
  }

  async function toggleTaskStatus(docId) {
    const task = state.tasks.find((item) => item._docId === docId);
    if (!task) return;
    if (!state.admin && task.assigneeUid !== firebaseState.user?.uid) return;
    const nextStatus = task.status === "done" ? "open" : "done";
    task.status = nextStatus;
    task.updatedAtMs = Date.now();
    if (firebaseState.ready && firebaseState.user) {
      const { dbRef, update, serverTimestamp } = firebaseState.modules;
      await update(dbRef(firebaseState.db, `tasks/${docId}`), {
        status: nextStatus,
        updatedAtMs: task.updatedAtMs,
        updatedAt: serverTimestamp(),
      });
    }
    await writeActivity(nextStatus === "done" ? "Completed Task" : "Reopened Task", "Task", task.title, `Status changed to ${nextStatus}`);
    renderTasks();
  }

  async function deleteTask(docId) {
    if (!state.admin) return;
    const task = state.tasks.find((item) => item._docId === docId);
    if (!task) return;
    const confirmed = await confirmAction({
      eyebrow: "Tasks",
      title: "Delete Task",
      message: `Delete task "${task.title}"?`,
      confirmText: "Delete Task",
    });
    if (!confirmed) return;
    state.tasks = state.tasks.filter((item) => item._docId !== docId);
    if (canWriteCloud()) {
      const { dbRef, remove } = firebaseState.modules;
      await remove(dbRef(firebaseState.db, `tasks/${docId}`));
    }
    await writeActivity("Deleted Task", "Task", task.title, `Assigned to ${task.assigneeName || "Unassigned"}`);
    renderTasks();
  }

  async function verifyCurrentFirebasePassword(password) {
    if (!password) throw new Error("Enter your Firebase password to continue.");
    if (firebaseDisabled) return true;
    const {
      EmailAuthProvider,
      reauthenticateWithCredential,
    } = firebaseState.modules || {};
    if (!firebaseState.user?.email || !EmailAuthProvider || !reauthenticateWithCredential) {
      throw new Error("Firebase authentication is not ready. Sign in again and retry.");
    }
    const credential = EmailAuthProvider.credential(firebaseState.user.email, password);
    await reauthenticateWithCredential(firebaseState.user, credential);
    return true;
  }

  function confirmAction({
    eyebrow = "Confirm",
    title = "Confirm Action",
    message = "",
    confirmText = "Confirm",
    requirePassword = false,
    passwordMessage = "Enter your Firebase password to permanently delete this archive record.",
    hideCancel = false,
  } = {}) {
    return new Promise((resolve) => {
      els.confirmEyebrow.textContent = eyebrow;
      els.confirmTitle.textContent = title;
      els.confirmMessage.textContent = message;
      els.confirmAccept.textContent = confirmText;
      els.confirmAccept.disabled = false;
      els.confirmCancel.hidden = hideCancel;
      if (els.confirmPasswordGroup) els.confirmPasswordGroup.hidden = !requirePassword;
      if (els.confirmPassword) els.confirmPassword.value = "";
      if (els.confirmPasswordMessage) els.confirmPasswordMessage.textContent = passwordMessage;

      const cleanup = (result) => {
        els.confirmCancel.removeEventListener("click", onCancel);
        els.confirmAccept.removeEventListener("click", onAccept);
        els.confirmDialog.removeEventListener("cancel", onNativeCancel);
        els.confirmDialog.removeEventListener("close", onClose);
        els.confirmAccept.disabled = false;
        els.confirmCancel.hidden = false;
        if (els.confirmPasswordGroup) els.confirmPasswordGroup.hidden = true;
        if (els.confirmPassword) els.confirmPassword.value = "";
        resolve(result);
      };
      const closeWith = (result) => {
        els.confirmDialog.returnValue = result ? "confirm" : "cancel";
        els.confirmDialog.close();
      };
      const onCancel = () => closeWith(false);
      const onAccept = async () => {
        if (!requirePassword) {
          closeWith(true);
          return;
        }
        try {
          els.confirmAccept.disabled = true;
          if (els.confirmPasswordMessage) els.confirmPasswordMessage.textContent = "Checking password...";
          await verifyCurrentFirebasePassword(els.confirmPassword?.value || "");
          closeWith(true);
        } catch (error) {
          els.confirmAccept.disabled = false;
          if (els.confirmPasswordMessage) {
            els.confirmPasswordMessage.textContent = firebaseAuthErrorMessage(error);
          }
          els.confirmPassword?.focus();
        }
      };
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
      setTimeout(() => (requirePassword ? els.confirmPassword : hideCancel ? els.confirmAccept : els.confirmCancel)?.focus(), 0);
    });
  }

  function alertAction(options = {}) {
    return confirmAction({ ...options, hideCancel: true });
  }

  function firebaseAuthErrorMessage(error) {
    if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password") {
      return "That Firebase password did not match this signed-in user.";
    }
    if (error?.code === "auth/too-many-requests") {
      return "Firebase temporarily blocked password checks after too many attempts. Try again shortly.";
    }
    return error?.message || "Password confirmation failed. Try again.";
  }

  function setCloudStatus(message) {
    if (!els.firebaseStatus) return;
    els.firebaseStatus.textContent = message;
    updateFirebaseStatusVisibility();
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

  function archiveProgramCategory(category) {
    return {
      name: category.name || "",
      status: category.status || "Active",
      description: category.description || "",
      notes: category.notes || "",
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

  function normalizeTranscriptDrafts(drafts) {
    return drafts.map((draft) => ({
      _docId: draft._docId || slugify(`${draft.studentId || draft.studentName || "transcript"}-${draft.program || "program"}`),
      studentName: draft.studentName || "",
      studentId: draft.studentId || "",
      dob: draft.dob || "",
      attendedFrom: draft.attendedFrom || "",
      attendedTo: draft.attendedTo || "",
      graduated: draft.graduated !== false,
      program: draft.program || "",
      rows: Array.isArray(draft.rows) ? draft.rows.map((row) => ({
        key: row.key || slugify(`${row.courseId || row.name}-${Math.random().toString(16).slice(2)}`),
        courseId: row.courseId || "",
        name: row.name || "",
        credit: row.credit || "",
        percent: row.percent || "",
      })) : [],
      totalCredits: Number(draft.totalCredits || 0),
      gpa: draft.gpa || "0.0",
      savedByUid: draft.savedByUid || "",
      savedByName: draft.savedByName || "",
      createdAtMs: Number(draft.createdAtMs || draft.updatedAtMs || 0),
      updatedAtMs: Number(draft.updatedAtMs || draft.createdAtMs || 0),
    }));
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
  return String(state.courseSearch || state.search || "").trim().toLowerCase();
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

  function courseDocId(course) {
    return slugify(course.id || course.name);
  }

  function findDuplicateCourseId(courseId, currentIndex = null) {
    const normalized = String(courseId || "").trim().toLowerCase();
    if (!normalized) return null;
    return state.courses.find((course, index) => {
      if (currentIndex != null && index === currentIndex) return false;
      return String(course.id || "").trim().toLowerCase() === normalized;
    }) || null;
  }

  function credits() {
    return Array.from(new Set([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      ...state.courses.map((course) => course.credit).filter(Boolean),
    ]))
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
      ...state.programCategories.map((category) => category.name),
      ...state.curriculum.map((row) => row.section),
      ...state.programRecords.map((program) => program.section),
    ].filter(Boolean))).sort();
  }

  function programCategories() {
    const seen = new Set();
    const categories = state.programCategories.reduce((items, category) => {
      if (category.name && !seen.has(category.name)) {
        seen.add(category.name);
        items.push(category);
      }
      return items;
    }, []);

    sections().forEach((section) => {
      if (!seen.has(section)) {
        seen.add(section);
        categories.push(normalizeProgramCategories([{ name: section }])[0]);
      }
    });

    return categories.sort((a, b) => naturalCompare(a.name, b.name));
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

  function curriculumFullName(programName, curriculumName) {
    const cleanProgram = String(programName || "").trim();
    const cleanName = String(curriculumName || "").trim();
    if (!cleanProgram || !cleanName) return cleanName;
    if (cleanName.toLowerCase().startsWith(`${cleanProgram.toLowerCase()} - `)) return cleanName;
    return `${cleanProgram} - ${programShortName(cleanName)}`;
  }

  function programCode(programName, section) {
    const sourceText = programShortName(programName) || section || "Program";
    const letters = sourceText.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean);
    return letters.slice(0, 3).map((word) => word[0]).join("").toUpperCase() || "NEA";
  }

  function statusBadge(status = "Active", baseClass = "status-badge") {
    const normalized = String(status || "Active").trim() || "Active";
    const className = normalized.toLowerCase() === "inactive"
      ? "status-inactive"
      : normalized.toLowerCase() === "archived"
        ? "status-archived"
        : "";
    return `<strong class="${baseClass}${className ? ` ${className}` : ""}">${escapeHtml(normalized)}</strong>`;
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

  function normalizeProgramCategories(categories) {
    return (categories || []).map((category) => ({
      _docId: category._docId || slugify(category.name),
      name: category.name || "",
      status: category.status || "Active",
      description: category.description || "",
      notes: category.notes || "",
    })).filter((category) => category.name);
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

  function normalizeFiles(files) {
    return (files || []).map((file) => {
      const courseIds = Array.isArray(file.courseIds)
        ? file.courseIds
        : Object.keys(file.courseIds || {});
      const category = file.category || inferFileCategory(file);
      const isTranscript = category === "Transcript";
      return {
        _docId: file._docId || slugify(`${file.name || "file"}-${file.createdAtMs || Date.now()}`),
        name: file.name || "",
        category,
        size: Number(file.size || 0),
        contentType: file.contentType || "",
        storagePath: file.storagePath || "",
        downloadURL: file.downloadURL || "",
        courseIds: isTranscript ? [] : uniqueValues(courseIds.map((id) => String(id).trim()).filter(Boolean)),
        courseLabels: isTranscript ? [] : Array.isArray(file.courseLabels) ? file.courseLabels : Object.values(file.courseLabels || {}),
        uploadedByUid: file.uploadedByUid || "",
        uploadedByName: file.uploadedByName || file.uploadedBy || "",
        createdAtMs: Number(file.createdAtMs || file.createdAt || 0),
        updatedAtMs: Number(file.updatedAtMs || file.updatedAt || file.createdAtMs || file.createdAt || 0),
      };
    }).filter((file) => file.name);
  }

  function normalizeBackupHistory(items) {
    return (items || []).map((item) => ({
      _docId: item._docId || slugify(`${item.type || "backup"}-${item.createdAtMs || Date.now()}`),
      type: item.type || "Backup",
      status: item.status || "Recorded",
      startedByUid: item.startedByUid || item.userUid || "",
      startedByName: item.startedByName || item.userName || "Unknown",
      duration: item.duration || "Framework only",
      destination: item.destination || defaultAppSettings.backupDestination,
      createdAtMs: Number(item.createdAtMs || item.createdAt || 0),
    })).filter((item) => item.type);
  }

  function normalizeEmailDeliveries(items) {
    return (items || []).map((item) => ({
      _docId: item._docId || slugify(`${item.recipient || "email"}-${item.createdAtMs || Date.now()}`),
      recipient: item.recipient || item.entityName || "",
      templateId: item.templateId || "",
      templateName: item.templateName || item.template || "Email Dispatch",
      fileCount: Number(item.fileCount || 0),
      status: item.status || (/failed/i.test(item.action || "") ? "failed" : /sent/i.test(item.action || "") ? "success" : "recorded"),
      error: item.error || "",
      createdByUid: item.createdByUid || item.userUid || "",
      createdByName: item.createdByName || item.userName || "Unknown",
      createdAtMs: Number(item.createdAtMs || item.createdAt || 0),
    })).filter((item) => item.recipient || item.status);
  }

  function normalizeAppSettings(settings) {
    return {
      ...defaultAppSettings,
      ...(settings || {}),
      transcriptFilenameFormat: settings?.transcriptFilenameFormat || defaultAppSettings.transcriptFilenameFormat,
      backupDestination: settings?.backupDestination || defaultAppSettings.backupDestination,
    };
  }

  function normalizeStudentEmailTemplate(template) {
    const value = template || {};
    const rawTemplates = value.templates
      ? rtdbList(value.templates)
      : [{
        _docId: value._docId || defaultStudentEmailTemplate._docId,
        name: value.name || defaultStudentEmailTemplate.name,
        subject: value.subject,
        bodyMarkdown: value.bodyMarkdown,
        updatedBy: value.updatedBy,
        updatedAtMs: value.updatedAtMs || value.updatedAt,
      }];
    const templates = rawTemplates.map(normalizeEmailTemplate).filter((item) => item.name && item.subject && item.bodyMarkdown);
    emailTemplateState.templates = templates.length ? templates : [{ ...defaultStudentEmailTemplate }];
    emailTemplateState.activeTemplateId = value.activeTemplateId && emailTemplateState.templates.some((item) => item._docId === value.activeTemplateId)
      ? value.activeTemplateId
      : emailTemplateState.templates[0]._docId;
    emailTemplateState.editorTemplateId = emailTemplateState.activeTemplateId;
    return {
      templates: emailTemplateState.templates,
      activeTemplateId: emailTemplateState.activeTemplateId,
      updatedBy: value.updatedBy || "",
      updatedAtMs: Number(value.updatedAtMs || value.updatedAt || 0),
    };
  }

  function normalizeEmailTemplate(template) {
    const value = template || {};
    return {
      _docId: value._docId || slugify(value.name || value.subject || defaultStudentEmailTemplate._docId),
      name: String(value.name || defaultStudentEmailTemplate.name).trim(),
      subject: String(value.subject || defaultStudentEmailTemplate.subject).trim(),
      bodyMarkdown: String(value.bodyMarkdown || defaultStudentEmailTemplate.bodyMarkdown).trim(),
      updatedBy: value.updatedBy || "",
      createdAtMs: Number(value.createdAtMs || value.createdAt || 0),
      updatedAtMs: Number(value.updatedAtMs || value.updatedAt || 0),
    };
  }

  function normalizedEmailTemplates() {
    const templates = (emailTemplateState.templates || []).map(normalizeEmailTemplate).filter((template) => template.name);
    return templates.length ? templates : [{ ...defaultStudentEmailTemplate }];
  }

  function activeEmailTemplate(templateId = emailTemplateState.activeTemplateId) {
    const templates = normalizedEmailTemplates();
    return templates.find((template) => template._docId === templateId) || templates[0] || defaultStudentEmailTemplate;
  }

  function inferFileCategory(file) {
    const text = `${file.name || ""} ${file.contentType || ""}`.toLowerCase();
    if (text.includes("transcript")) return "Transcript";
    if (text.includes("ebook") || text.includes("e-book") || text.includes("book")) return "eBook";
    if (text.includes("instruction") || text.includes("course")) return "CI";
    return "Other";
  }

  function normalizeActivityLog(entries) {
    return (entries || []).map((entry) => ({
      _docId: entry._docId || slugify(`${entry.action || "log"}-${entry.createdAtMs || Date.now()}`),
      action: entry.action || "Activity",
      entityType: entry.entityType || "",
      entityName: entry.entityName || "",
      details: entry.details || "",
      userUid: entry.userUid || "",
      userName: entry.userName || entry.userEmail?.split("@")[0] || "Unknown",
      userEmail: entry.userEmail || "",
      createdAtMs: Number(entry.createdAtMs || entry.createdAt || 0),
    }));
  }

  function normalizeNotices(notices) {
    return (notices || []).map((notice) => ({
      _docId: notice._docId || slugify(`notice-${notice.createdAtMs || notice.message}`),
      message: notice.message || "",
      status: notice.status || "active",
      authorUid: notice.authorUid || "",
      authorName: notice.authorName || "Admin",
      createdAtMs: Number(notice.createdAtMs || notice.createdAt || 0),
      updatedAtMs: Number(notice.updatedAtMs || notice.updatedAt || 0),
    })).filter((notice) => notice.message);
  }

  function normalizeTasks(tasks) {
    return (tasks || []).map((task) => ({
      _docId: task._docId || slugify(`task-${task.createdAtMs || task.title}`),
      title: task.title || "",
      description: task.description || "",
      assigneeUid: task.assigneeUid || "",
      assigneeName: task.assigneeName || "Unassigned",
      status: task.status || "open",
      createdByUid: task.createdByUid || "",
      createdByName: task.createdByName || "Admin",
      createdAtMs: Number(task.createdAtMs || task.createdAt || 0),
      updatedAtMs: Number(task.updatedAtMs || task.updatedAt || 0),
    })).filter((task) => task.title);
  }

  function normalizeDirectoryUsers(users) {
    return (users || []).map((user) => {
      const emailName = user.email ? String(user.email).split("@")[0] : "";
      return {
        uid: user.uid || user._docId || "",
        name: user.displayName || user.name || user.fullName || emailName || "Employee",
        email: user.email || "",
        photoURL: user.photoURL || "",
        lastLoginAtMs: Number(user.lastLoginAtMs || user.lastLoginAt || 0),
      };
    }).filter((user) => user.uid && user.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function attachmentsForProgram(programName) {
    return filesForProgram(programName);
  }

  function filesForProgram(programName) {
    const requiredCourseIds = new Set(curriculumForProgram(programName).map((row) => String(row.courseId)));
    if (!requiredCourseIds.size) return [];
    return fileManagerState.records
      .filter((file) => file.category !== "Transcript" && file.courseIds.some((courseId) => requiredCourseIds.has(String(courseId))))
      .map((file) => ({
        ...file,
        matchedCourseIds: file.courseIds.filter((courseId) => requiredCourseIds.has(String(courseId))),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function transcriptFileRecords() {
    return fileManagerState.records.filter((file) => file.category === "Transcript");
  }

  function emailDeliveryRecords() {
    const stored = normalizeEmailDeliveries(state.emailDeliveries);
    const fromLog = state.activityLog
      .filter((entry) => /file email|student email|test email/i.test(`${entry.action || ""} ${entry.entityType || ""}`))
      .map((entry) => normalizeEmailDeliveries([{
        _docId: entry._docId,
        recipient: entry.entityName,
        templateName: "Activity Log",
        fileCount: Number(String(entry.details || "").match(/(\d+)\s+file/i)?.[1] || 0),
        status: /failed/i.test(entry.action || "") ? "failed" : /sent/i.test(entry.action || "") ? "success" : "recorded",
        error: /failed/i.test(entry.action || "") ? entry.details : "",
        createdByUid: entry.userUid,
        createdByName: entry.userName,
        createdAtMs: entry.createdAtMs,
      }])[0])
      .filter(Boolean);
    const seen = new Set();
    return [...stored, ...fromLog]
      .filter((entry) => {
        const key = entry._docId || `${entry.recipient}-${entry.createdAtMs}-${entry.status}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));
  }

  function courseById(courseId) {
    return state.courses.find((course) => String(course.id) === String(courseId));
  }

  function uniqueValues(values) {
    return Array.from(new Set((values || []).map((value) => String(value).trim()).filter(Boolean)));
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

  function formatTimestamp(value) {
    const date = value ? new Date(Number(value)) : new Date();
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function taskAssignees() {
    const users = new Map();
    const nameKeys = new Map();
    const addUser = (user) => {
      const name = user?.name || user?.displayName || user?.fullName || user?.email?.split("@")[0] || "";
      if (!name) return;
      const uid = user?.uid || user?._docId || `staff:${slugify(name)}`;
      const normalizedName = normalizePersonName(name);
      const existingKey = nameKeys.get(normalizedName);
      const key = existingKey || uid;
      const existing = users.get(key) || {};
      users.set(key, {
        uid: existing.uid && !String(existing.uid).startsWith("staff:") ? existing.uid : uid,
        name,
        email: user?.email || existing.email || "",
      });
      nameKeys.set(normalizedName, key);
    };
    staffDirectory.forEach(addUser);
    state.directoryUsers.forEach((user) => {
      addUser(user);
    });
    if (firebaseState.user) {
      addUser({
        uid: firebaseState.user.uid,
        name: currentUserDisplayName() || firebaseState.user.email?.split("@")[0] || "Me",
        email: firebaseState.user.email || "",
      });
    }
    state.connectedUsers.forEach((user) => {
      addUser(user);
    });
    state.tasks.forEach((task) => {
      addUser({ uid: task.assigneeUid, name: task.assigneeName });
      addUser({ uid: task.createdByUid, name: task.createdByName });
    });
    state.activityLog.forEach((entry) => {
      addUser({ uid: entry.userUid, name: entry.userName, email: entry.userEmail });
    });
    state.notices.forEach((notice) => {
      addUser({ uid: notice.authorUid, name: notice.authorName });
    });
    return Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  function normalizePersonName(name) {
    return String(name || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
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
