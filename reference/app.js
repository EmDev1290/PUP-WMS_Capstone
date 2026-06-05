/**
 * PUP-PQ Academic Management System Logic Engine
 */

// MASTER FACULTY REGISTRY DATA MODEL
const facultyRegistry = [
    {
        id: "prof-jefferson",
        name: "Sir Jefferson",
        baseDesignation: "Instructor I",
        program: "Information Technology",
        employmentType: "Regular",
        active: true,
        educationalAttainment: {
            baccalaureate: "BS Information Technology",
            masters: "MSc Computer Science",
            doctorate: "",
            postBaccalaureate: ""
        },
        licenseNumber: "LIC-9134",
        specialization: "Systems Analysis",
        nationalCertificate: "NC II",
        courseHandle: {
            genEd: "Math",
            coreSubject: "IT102",
            professionalSubject: "Software Engineering",
            technicalSubject: "Programming"
        },
        research: { production: "2", presentation: "3", publication: "1", citation: "8" },
        extension: "Community IT Training",
        natureOfAppointment: "Full-time",
        remarks: "In good standing"
    },
    {
        id: "prof-delacruz",
        name: "Dr. Maria Dela Cruz",
        baseDesignation: "Head of Academic Affairs",
        program: "Information Technology",
        employmentType: "Regular",
        active: true,
        educationalAttainment: {
            baccalaureate: "BS Computer Science",
            masters: "MEd Curriculum",
            doctorate: "PhD Educational Leadership",
            postBaccalaureate: ""
        },
        licenseNumber: "LIC-7201",
        specialization: "Database Systems",
        nationalCertificate: "NC III",
        courseHandle: {
            genEd: "English",
            coreSubject: "DB Systems",
            professionalSubject: "Database Design",
            technicalSubject: "SQL Programming"
        },
        research: { production: "4", presentation: "2", publication: "2", citation: "15" },
        extension: "Research mentorship",
        natureOfAppointment: "Full-time",
        remarks: "Academic leader"
    },
    {
        id: "prof-santos",
        name: "Prof. Ricardo Santos",
        baseDesignation: "Regular Lecturer",
        program: "Computer Engineering",
        employmentType: "Regular",
        active: true,
        educationalAttainment: {
            baccalaureate: "BSE Computer Engineering",
            masters: "MEng Electronics",
            doctorate: "",
            postBaccalaureate: ""
        },
        licenseNumber: "LIC-4485",
        specialization: "Microprocessors",
        nationalCertificate: "NC IV",
        courseHandle: {
            genEd: "Physics",
            coreSubject: "Microprocessor Systems",
            professionalSubject: "Embedded Systems",
            technicalSubject: "Circuit Design"
        },
        research: { production: "1", presentation: "1", publication: "0", citation: "2" },
        extension: "Technical workshops",
        natureOfAppointment: "Full-time",
        remarks: "Consistent instructor"
    }
];

// RE-ORGANIZED DESIGNATION RANK SELECTION STRATEGY
const designationOptions = [
    "None (Regular Faculty Line)",
    "Director / Head of Academic Operations",
    "Program Chairperson - Information Technology (IT)",
    "Program Chairperson - Hospitality Management (HM)",
    "Program Chairperson - Computer Engineering (COE)",
    "Laboratory Custodian Coordinator",
    "Area Sector Coordinator"
];

// INSTITUTIONAL GLOBAL UNIT LOADING CEILING DATABASE MAP
const workloadDatabase = [
    { facultyId: "prof-jefferson", program: "HM", courseCode: "PATHFIT 1", units: 3 },
    { facultyId: "prof-jefferson", program: "IT", courseCode: "PATHFIT 1", units: 3 },
    { facultyId: "prof-jefferson", program: "COE", courseCode: "PATHFIT 1", units: 3 },
    { facultyId: "prof-jefferson", program: "IT", courseCode: "CC102 (Computer Programming)", units: 3 },
    { facultyId: "prof-delacruz", program: "IT", courseCode: "IT311 (Database Systems)", units: 3 },
    { facultyId: "prof-santos", program: "COE", courseCode: "COE412 (Microprocessor Systems)", units: 4 }
];

const GLOBAL_MAX_LOAD_CAP = 45;

const State = {
    activeProgram: 'Information Technology',
    subjectSemesterFilter: 'All',
    facultyTypeFilter: 'All',
    facultyFilter: 'all', // State variable targeting 'all', 'active', 'inactive', 'part-time', 'regular', 'designee'
    db: {
        schoolYears: ['A.Y. 2024-2025', 'A.Y. 2025-2026', 'A.Y. 2026-2027'],
        rooms: ['Room A101', 'Room B202', 'Lab A', 'Lab B', 'Audio Visual Room'],
        buildings: ['Main Building', 'Old Building', 'Annex Building'],
        programs: {
            'Information Technology': {
                profs: ['Sir Jefferson', 'Dr. Maria Dela Cruz'],
                sections: ['BSIT 1-1', 'BSIT 2-1', 'BSIT 3-1'],
                // HIGHLY SCALABLE STRUCTURE: Separated by Year Level -> Semester Groupings (Includes optional Summer Terms)
                subjects: {
                    "1st Year": {
                        "1st Semester": [
                            { name: "IT101 - Introduction to Computing", units: 3 },
                            { name: "PATHFIT 1 - Movement Competency Training", units: 2 }
                        ],
                        "2nd Semester": [
                            { name: "IT102 - Computer Programming 1", units: 3 },
                            { name: "IT103 - Discrete Structures", units: 3 }
                        ]
                    },
                    "2nd Year": {
                        "1st Semester": [
                            { name: "IT201 - Data Structures and Algorithms", units: 3 },
                            { name: "IT202 - Object-Oriented Programming", units: 3 }
                        ],
                        "2nd Semester": [
                            { name: "IT203 - Web Systems and Technologies", units: 3 },
                            { name: "IT204 - Computer Architecture and Organization", units: 3 }
                        ],
                        "Summer Term": [
                            { name: "IT-INT1 - Industry Practicum 1", units: 2 }
                        ]
                    },
                    "3rd Year": {
                        "1st Semester": [
                            { name: "IT311 - Database Systems", units: 3 },
                            { name: "IT312 - Software Engineering 1", units: 3 }
                        ],
                        "2nd Semester": [
                            { name: "IT313 - Information Assurance and Security", units: 3 }
                        ]
                    }
                }
            },
            'Computer Engineering': {
                profs: ['Prof. Ricardo Santos'],
                sections: ['COE 3-1', 'COE 4-1'],
                subjects: {
                    "3rd Year": {
                        "1st Semester": [
                            { name: "COE311 - Digital Design", units: 4 }
                        ],
                        "2nd Semester": [
                            { name: "COE221 - Electronics I", units: 3 }
                        ]
                    },
                    "4th Year": {
                        "1st Semester": [
                            { name: "COE412 - Microprocessor Systems", units: 4 }
                        ]
                    }
                }
            },
            'Hospitality Management': {
                profs: ['Prof. Amelia Reyes'],
                sections: ['HM 1-1', 'HM 2-1'],
                subjects: {
                    "1st Year": {
                        "1st Semester": [
                            { name: "HM101 - Food Service Management", units: 3 },
                            { name: "PATHFIT 1 - Movement Competency Training", units: 2 }
                        ]
                    }
                }
            }
        },
        loads: [
            {
                id: 1,
                prof: 'Dr. Maria Dela Cruz',
                sub: 'IT311 - Database Systems',
                units: 3,
                loadType: 'Regular Load',
                sec: 'BSIT 2-1',
                room: 'Room A101',
                building: 'Main Building',
                day: 'Monday',
                time: '08:00 AM - 11:00 AM',
                sy: 'A.Y. 2024-2025',
                program: 'Information Technology'
            },
            {
                id: 2,
                prof: 'Prof. Ricardo Santos',
                sub: 'COE412 - Microprocessor Systems',
                units: 4,
                loadType: 'Regular Load',
                sec: 'COE 4-1',
                room: 'Room B202',
                building: 'Old Building',
                day: 'Wednesday',
                time: '10:00 AM - 02:00 PM',
                sy: 'A.Y. 2024-2025',
                program: 'Computer Engineering'
            }
        ],
        noClassDays: {}
    }
};

const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// STRICT 30-MINUTE INTERVAL GENERATOR RECONCILIATOR
function generateTimeStarts(start = '07:00 AM', end = '09:00 PM', slotMinutes = 30) {
    const slots = [];
    function toMinutes(t) {
        const [time, period] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    }
    let s = toMinutes(start);
    const e = toMinutes(end);
    for (let t = s; t <= e; t += slotMinutes) {
        const period = t >= 720 ? 'PM' : 'AM';
        let h = Math.floor(t / 60);
        const m = t % 60;
        if (h === 0) h = 12;
        if (h > 12) h -= 12;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`);
    }
    return slots;
}

const TimeStarts = generateTimeStarts('07:00 AM', '09:00 PM', 30);
let currentLoadEditId = null;

function parseTimeStr(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const period = minutes >= 720 ? 'PM' : 'AM';
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

// STRICT ALIGNED SYSTEM TITLE RESOLVER FOR CATEGORIZATION MAPS
function getTitleLabel(f) {
    if (!f) return 'PROFESSOR';
    const empType = (f.employmentType || '').toUpperCase();
    const designation = (f.baseDesignation || '').toUpperCase();
    
    // Condition 1: Rule for Part-Timers (Always output exactly "PROFESSOR")
    if (empType.includes('PART-TIME') || empType.includes('PARTTIME')) {
        return 'PROFESSOR';
    }
    
    // Condition 2: Regular & Designee parsing matrices matches
    if (designation.includes('UNIVERSITY PROFESSOR') || designation.includes('UNIV. PROF')) return 'UNIV. PROF';
    if (designation.includes('ASSOCIATE PROFESSOR') || designation.includes('ASSC. PROF')) return 'ASSC. PROF';
    if (designation.includes('ASSISTANT PROFESSOR') || designation.includes('ASST. PROF')) return 'ASST. PROF';
    if (designation.includes('PROFESSOR') || designation.includes('PROF')) return 'PROF';
    if (designation.includes('INSTRUCTOR')) return 'INSTRUCTOR';
    
    return 'INSTRUCTOR'; // System structural fallback default
}

function getTimeRange(start, units) {
    const startMinutes = parseTimeStr(start);
    const endMinutes = startMinutes + units * 60;
    return `${start} - ${formatTime(endMinutes)}`;
}

function parseTimeRange(range) {
    const [start, , end] = range.split(' ');
    return {
        start: parseTimeStr(`${range.split(' - ')[0]}`),
        end: parseTimeStr(`${range.split(' - ')[1]}`)
    };
}

function rangesOverlap(a, b) {
    return a.start < b.end && b.start < a.end;
}

function findConflict(day, target, prof, room, sec, ignoreLoadId = null) {
    if (!day || !target || !prof || !room || !sec) return null;
    return State.db.loads.find(l => {
        if (ignoreLoadId && l.id === ignoreLoadId) return false;
        if (l.day !== day) return false;
        const other = parseTimeRange(l.time);
        if (!rangesOverlap(target, other)) return false;
        if (l.prof === prof) return true;
        if (l.room === room) return true;
        if (l.sec === sec) return true;
        return false;
    }) || null;
}

function persistState() {
    localStorage.setItem('schedulerData', JSON.stringify(State.db));
    localStorage.setItem('activeProgram', State.activeProgram);
}

function loadSavedState() {
    const saved = localStorage.getItem('schedulerData');
    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            State.db.schoolYears = savedData.schoolYears || State.db.schoolYears;
            State.db.rooms = savedData.rooms || State.db.rooms;
            State.db.buildings = savedData.buildings || State.db.buildings;
            State.db.programs = savedData.programs || State.db.programs;
            State.db.loads = savedData.loads || State.db.loads;
            State.db.noClassDays = savedData.noClassDays || State.db.noClassDays;
        } catch (error) {
            console.warn('Unable to restore saved scheduler data', error);
        }
    }
    const savedProgram = localStorage.getItem('activeProgram');
    if (savedProgram && State.db.programs[savedProgram]) {
        State.activeProgram = savedProgram;
    }
}

function showBanner(message, type = 'info', timeout = 4000) {
    try {
        let existing = document.getElementById('app-banner');
        if (existing) existing.remove();
        const banner = document.createElement('div');
        banner.id = 'app-banner';
        const base = 'fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-[90%] rounded-2xl p-3 shadow-lg text-sm font-medium';
        const color = type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-slate-50 text-slate-800 border border-slate-200';
        banner.className = `${base} ${color}`;
        banner.innerText = message;
        document.body.appendChild(banner);
        setTimeout(() => { banner.classList.add('opacity-0'); setTimeout(()=>banner.remove(), 300); }, timeout);
    } catch (e) {}
}

function attemptLogin() {
    const user = document.getElementById('login-user')?.value.trim();
    const pass = document.getElementById('login-pass')?.value.trim();
    const errMsg = document.getElementById('login-error');
    if ((user === 'aide_pq' || user === 'head_pq') && pass === 'password123') {
        errMsg?.classList.add('hidden');
        window.location.href = 'dashboard.html';
    } else {
        errMsg?.classList.remove('hidden');
    }
}

function logout() {
    window.location.href = 'index.html';
}

function initializeSystemModules() {
    lucide.createIcons();
    populateFacultyDropdowns();
    populateFacultyProfileDropdown();
    applyQuerySelections();
    attachProgramButtonHandlers();
    renderSYDropdown();
    setSubjectSemesterFilter(State.subjectSemesterFilter);
    setFacultyTypeFilter(State.facultyTypeFilter);
    refreshManagementLists();
    renderLoadTable();
    updateSectionDropdowns();
    updateRoomDropdowns();
    updateFacultyWorkloadDropdown();
    renderRoomSchedulePreview();
    renderPageSections();
}

function setSubjectSemesterFilter(value) {
    State.subjectSemesterFilter = value;
    refreshManagementLists();
}

function setFacultyTypeFilter(value) {
    State.facultyTypeFilter = value;
    refreshManagementLists();
}

function refreshManagementLists() {
    const progLabel = document.getElementById('current-prog-label');
    if (progLabel) progLabel.innerText = State.activeProgram;
}

function calculateCumulativeLoadHours(facultyName) {
    // Cross-program total aggregation logic checks safely mapping hours natively against database structures
    return State.db.loads
        .filter(item => item.prof === facultyName)
        .reduce((total, item) => total + (item.units || 0), 0);
}

function renderWorkloadMatrix() {
    const tableBody = document.getElementById('workload-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    State.db.loads.forEach(loadItem => {
        const globalRunningTotalLoad = calculateCumulativeLoadHours(loadItem.prof);
        const tableRow = document.createElement('tr');
        tableRow.className = 'hover:bg-gray-50/70 transition-colors';
        tableRow.innerHTML = `
            <td class="p-4">
                <div class="font-semibold text-gray-950">${loadItem.prof}</div>
                <div class="text-[11px] text-gray-400">${loadItem.loadType || 'Regular Load'}</div>
            </td>
            <td class="p-4"><span class="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">${loadItem.program} Department</span></td>
            <td class="p-4 font-mono text-xs text-gray-700 font-semibold">${loadItem.sub}</td>
            <td class="p-4 text-center font-bold text-gray-900">${loadItem.units || 0} Units</td>
            <td class="p-4">
                <div class="flex flex-col space-y-1">
                    <div class="text-xs font-medium text-gray-600">Global Running Load: <span class="text-maroon font-bold">${globalRunningTotalLoad}</span> / ${GLOBAL_MAX_LOAD_CAP} Max Total Hours</div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5 max-w-[200px]"><div class="bg-red-800 h-1.5 rounded-full" style="width: ${(globalRunningTotalLoad / GLOBAL_MAX_LOAD_CAP) * 100}%"></div></div>
                </div>
            </td>
        `;
        tableBody.appendChild(tableRow);
    });
}

// PROGRAM WORKFLOW EXTENSION FILTER FUNCTION
function filterFacultyView(filterMode) {
    State.facultyFilter = filterMode;
    
    // UI Button state synchronizer loop logic maps
    const buttons = {
        'all': document.getElementById('btn-filter-all'),
        'active': document.getElementById('btn-filter-active'),
        'inactive': document.getElementById('btn-filter-inactive'),
        'part-time': document.getElementById('btn-filter-parttime'),
        'regular': document.getElementById('btn-filter-regular'),
        'designee': document.getElementById('btn-filter-designee')
    };

    Object.keys(buttons).forEach(key => {
        if (!buttons[key]) return;
        buttons[key].className = "px-3 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all";
    });

    if (buttons[filterMode]) {
        buttons[filterMode].className = "px-3 py-2 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all";
    } else {
        // Handle generic fallback tracking for default templates
        const fallbacks = ['all', 'active', 'inactive'];
        fallbacks.forEach(fKey => {
            const btn = document.querySelector(`button[onclick="filterFacultyView('${fKey}')"]`);
            if(btn) btn.className = fKey === 'all' ? "px-3 py-2 rounded-full text-xs font-semibold bg-blue-600 text-white" : "px-3 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-700";
        });
    }

    renderProgramResources();
}

// SYNCHRONIZED DASHBOARD RENDER MONITOR ENGINE
function renderDashboard() {
    const cardActiveFaculty = document.getElementById('card-active-faculty') || document.getElementById('dash-prof-count');
    const cardInactiveFaculty = document.getElementById('card-inactive-faculty');
    const cardPrograms = document.getElementById('card-active-programs') || document.getElementById('dash-prog-count');
    const cardLoads = document.getElementById('card-assigned-loads') || document.getElementById('dash-load-count');
    const cardConflicts = document.getElementById('card-conflicts-detected') || document.getElementById('dash-conflict-count');
    
    // Derive absolute values directly from master registry arrays maps
    const activeCount = facultyRegistry.filter(f => f.active !== false).length;
    const inactiveCount = facultyRegistry.filter(f => f.active === false).length;
    
    if (cardActiveFaculty) cardActiveFaculty.innerText = activeCount;
    if (cardInactiveFaculty) cardInactiveFaculty.innerText = inactiveCount;
    if (cardPrograms) cardPrograms.innerText = Object.keys(State.db.programs).length;
    if (cardLoads) cardLoads.innerText = State.db.loads.length;
    if (cardConflicts) cardConflicts.innerText = 0;
    const currentProgramEl = document.getElementById('dashboard-active-program');
    if (currentProgramEl) currentProgramEl.innerText = State.activeProgram;
}

function populateFacultyDropdowns() {
    const facultySelector = document.getElementById('faculty-selector');
    const designeeDropdown = document.getElementById('designee-dropdown');
    if (!facultySelector && !designeeDropdown) return;
    if (facultySelector) {
        facultySelector.innerHTML = '';
        facultyRegistry.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.name;
            facultySelector.appendChild(opt);
        });
    }
    if (designeeDropdown) {
        designeeDropdown.innerHTML = '';
        designationOptions.forEach(text => {
            const opt = document.createElement('option');
            opt.value = text;
            opt.textContent = text;
            designeeDropdown.appendChild(opt);
        });
        handleFacultySelectorChange();
    }
}

function selectFaculty(facultyId) {
    if (!facultyId) return;
    const faculty = facultyRegistry.find(f => f.id === facultyId);
    const profileSelect = document.getElementById('faculty-profile-select');
    if (profileSelect) {
        profileSelect.value = facultyId;
        displaySelectedFacultyProfile();
        showBanner(`Selected faculty profile: ${faculty ? faculty.name : facultyId}`, 'success');
        return;
    }
    window.location.href = `faculty-profile.html?faculty=${encodeURIComponent(facultyId)}`;
}

function applyQuerySelections() {
    const query = new URLSearchParams(window.location.search);
    const facultyId = query.get('faculty');
    if (!facultyId) return;
    const profileSelect = document.getElementById('faculty-profile-select');
    if (profileSelect) {
        profileSelect.value = facultyId;
        displaySelectedFacultyProfile();
    }
}

function ensureModalRoot() {
    if (document.getElementById('global-modal-root')) return;
    const root = document.createElement('div');
    root.id = 'global-modal-root';
    root.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/40 p-4';
    root.innerHTML = `<div id="global-modal-panel" class="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden"></div>`;
    document.body.appendChild(root);
}

function closeModal() {
    const root = document.getElementById('global-modal-root');
    if (!root) return;
    root.classList.add('hidden');
    const panel = document.getElementById('global-modal-panel');
    if (panel) panel.innerHTML = '';
    document.removeEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(event) {
    if (event.key === 'Escape') closeModal();
}

function openModal({ title, body, submitLabel = 'Save', onSubmit }) {
    ensureModalRoot();
    const root = document.getElementById('global-modal-root');
    const panel = document.getElementById('global-modal-panel');
    if (!root || !panel) return;
    panel.innerHTML = `
        <div class="border-b border-slate-200 p-5 flex items-center justify-between">
            <div>
                <h3 class="text-xl font-bold text-slate-900">${title}</h3>
            </div>
            <button id="global-modal-close" class="text-slate-400 hover:text-slate-900" type="button"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div class="p-6">${body}</div>
        <div class="flex items-center justify-end gap-3 border-t border-slate-200 p-5">
            <button id="global-modal-cancel" class="px-4 py-2 rounded-2xl border border-slate-300 text-sm text-slate-700 hover:bg-slate-100" type="button">Cancel</button>
            <button id="global-modal-submit" class="px-4 py-2 rounded-2xl bg-[#7f0000] text-white text-sm font-bold hover:bg-[#660000]" type="button">${submitLabel}</button>
        </div>
    `;
    root.classList.remove('hidden');
    document.getElementById('global-modal-close').onclick = closeModal;
    document.getElementById('global-modal-cancel').onclick = closeModal;
    document.getElementById('global-modal-submit').onclick = () => {
        onSubmit?.();
    };
    document.addEventListener('keydown', handleModalKeydown);
    lucide.createIcons();
}

function getProgramPalette(programName) {
    const key = String(programName || '').toUpperCase();
    if (key.includes('BSHM')) return { row: 'bg-red-100 text-red-900', pill: 'bg-red-50 text-red-700', card: 'border-red-200 bg-red-50 text-red-900' };
    if (key.includes('BSIT')) return { row: 'bg-sky-100 text-sky-900', pill: 'bg-sky-50 text-sky-700', card: 'border-sky-200 bg-sky-50 text-sky-900' };
    if (key.includes('BSOA')) return { row: 'bg-violet-100 text-violet-900', pill: 'bg-violet-50 text-violet-700', card: 'border-violet-200 bg-violet-50 text-violet-900' };
    if (key.includes('BSCPE')) return { row: 'bg-emerald-100 text-emerald-900', pill: 'bg-emerald-50 text-emerald-700', card: 'border-emerald-200 bg-emerald-50 text-emerald-900' };
    return null;
}

function openAddProgramModal() {
    openModal({
        title: 'Add Active Program',
        submitLabel: 'Add Program',
        body: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Program Name</label>
                    <input id="modal-program-name" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" placeholder="e.g. BSIT" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Program Code</label>
                    <input id="modal-program-code" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" placeholder="e.g. BSIT" />
                    <p class="text-xs text-slate-500 mt-2">Program code is used for schedule color coding.</p>
                </div>
            </div>
        `,
        onSubmit: () => {
            const name = document.getElementById('modal-program-name')?.value.trim();
            const code = document.getElementById('modal-program-code')?.value.trim();
            if (!name) {
                showBanner('Please enter the program name.', 'error');
                return;
            }
            const programKey = code || name;
            if (State.db.programs[programKey]) {
                showBanner('Program already exists.', 'error');
                return;
            }
            State.db.programs[programKey] = { profs: [], sections: [], subjects: {} };
            State.activeProgram = programKey;
            persistState();
            renderPageSections();
            closeModal();
            showBanner(`Program “${programKey}” was added and selected.`, 'success');
        }
    });
}

function openAddSectionModal() {
    if (!State.activeProgram) {
        showBanner('Select or add an active program first.', 'error');
        return;
    }
    openModal({
        title: 'Add Section',
        submitLabel: 'Add Section',
        body: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Section Name</label>
                    <input id="modal-section-name" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" placeholder="e.g. BSIT 1-1" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Program</label>
                    <select id="modal-section-program" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]">
                        ${Object.keys(State.db.programs || {}).sort().map(program => `<option value="${program}" ${program === State.activeProgram ? 'selected' : ''}>${program}</option>`).join('')}
                    </select>
                </div>
            </div>
        `,
        onSubmit: () => {
            const sectionName = document.getElementById('modal-section-name')?.value.trim();
            const programName = document.getElementById('modal-section-program')?.value;
            if (!sectionName) {
                showBanner('Please enter the new section name.', 'error');
                return;
            }
            const program = State.db.programs[programName];
            if (!program) {
                showBanner('Program not found.', 'error');
                return;
            }
            if (!program.sections) program.sections = [];
            if (program.sections.includes(sectionName)) {
                showBanner('Section already exists.', 'error');
                return;
            }
            program.sections.push(sectionName);
            persistState();
            renderPageSections();
            closeModal();
            showBanner(`Added section “${sectionName}”.`, 'success');
        }
    });
}

function openAddSubjectModal() {
    if (!State.activeProgram) {
        showBanner('Select or add an active program first.', 'error');
        return;
    }
    openModal({
        title: 'Add Subject',
        submitLabel: 'Add Subject',
        body: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Subject Title</label>
                    <input id="modal-subject-name" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" placeholder="e.g. Introduction to Programming" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Units</label>
                        <input id="modal-subject-units" type="number" min="1" value="3" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Year Level</label>
                        <input id="modal-subject-year" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" value="1st Year" />
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Semester</label>
                        <select id="modal-subject-semester" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]">
                            <option>1st Semester</option>
                            <option>2nd Semester</option>
                            <option>Summer Term</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Program</label>
                        <select id="modal-subject-program" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]">
                            ${Object.keys(State.db.programs || {}).sort().map(program => `<option value="${program}" ${program === State.activeProgram ? 'selected' : ''}>${program}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `,
        onSubmit: () => {
            const subjectName = document.getElementById('modal-subject-name')?.value.trim();
            const units = Math.max(1, Number(document.getElementById('modal-subject-units')?.value) || 3);
            const yearLevel = document.getElementById('modal-subject-year')?.value.trim() || '1st Year';
            const semester = document.getElementById('modal-subject-semester')?.value;
            const programName = document.getElementById('modal-subject-program')?.value;
            if (!subjectName) {
                showBanner('Please enter the new subject title.', 'error');
                return;
            }
            const program = State.db.programs[programName];
            if (!program) {
                showBanner('Program not found.', 'error');
                return;
            }
            if (!program.subjects) program.subjects = {};
            if (!program.subjects[yearLevel]) program.subjects[yearLevel] = {};
            if (!program.subjects[yearLevel][semester]) program.subjects[yearLevel][semester] = [];
            program.subjects[yearLevel][semester].push({ name: subjectName, units });
            persistState();
            renderProgramResources();
            closeModal();
            showBanner(`Added subject “${subjectName}” to ${programName}.`, 'success');
        }
    });
}

function openEditFacultyModal() {
    const selectedId = document.getElementById('faculty-profile-select')?.value;
    if (!selectedId) {
        showBanner('Select a faculty profile to edit first.', 'error');
        return;
    }
    const faculty = facultyRegistry.find(f => f.id === selectedId);
    if (!faculty) return;
    openModal({
        title: 'Edit Faculty',
        submitLabel: 'Save Changes',
        body: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Faculty Name</label>
                    <input id="faculty-update-name" value="${faculty.name}" readonly class="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Program</label>
                    <input value="${faculty.program}" readonly class="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select id="faculty-update-active" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]">
                            <option value="active" ${faculty.active !== false ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${faculty.active === false ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                        <input id="faculty-update-employment" value="${faculty.employmentType || ''}" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Designation / Title</label>
                    <input id="faculty-update-title" value="${faculty.baseDesignation || ''}" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7f0000]" />
                </div>
            </div>
        `,
        onSubmit: () => {
            const professor = facultyRegistry.find(f => f.id === selectedId);
            if (!professor) return;
            const activeValue = document.getElementById('faculty-update-active')?.value;
            const employmentValue = document.getElementById('faculty-update-employment')?.value;
            const titleValue = document.getElementById('faculty-update-title')?.value.trim();
            professor.active = activeValue === 'active';
            professor.employmentType = employmentValue || professor.employmentType;
            if (titleValue) professor.baseDesignation = titleValue;
            persistState();
            closeModal();
            showBanner(`Updated profile for ${professor.name}.`, 'success');
            renderProgramResources();
            renderDashboard();
            displaySelectedFacultyProfile();
        }
    });
}

function addProgram() {
    openAddProgramModal();
}

function addSection() {
    openAddSectionModal();
}

function addSubject() {
    openAddSubjectModal();
}

function setActiveProgram(programName) {
    if (!State.db.programs[programName]) {
        showBanner(`Program “${programName}” is not available.`, 'error');
        return;
    }
    State.activeProgram = programName;
    persistState();
    renderPageSections();
    showBanner(`Active program switched to ${programName}.`, 'success');
}

function attachProgramButtonHandlers() {
    renderActiveProgramButtons();
}

function renderActiveProgramButtons() {
    const container = document.getElementById('active-program-button-list');
    if (!container) return;

    const programNames = Object.keys(State.db.programs).sort((a, b) => a.localeCompare(b));
    container.innerHTML = '';

    programNames.forEach(program => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `w-full text-left px-4 py-2 rounded-lg text-xs transition-all ${program === State.activeProgram ? 'bg-[#ffd24d] text-[#3f1f00] font-semibold' : 'bg-transparent text-gray-100 hover:bg-white/10'}`;
        button.innerText = program;
        button.addEventListener('click', () => setActiveProgram(program));
        container.appendChild(button);
    });
}

function addProgram() {
    const name = prompt('Enter the new program name');
    if (!name) return;
    if (State.db.programs[name]) {
        showBanner('Program already exists.', 'error');
        return;
    }
    State.db.programs[name] = { profs: [], sections: [], subjects: {} };
    State.activeProgram = name;
    persistState();
    renderPageSections();
    showBanner(`Program “${name}” was added and selected.`, 'success');
}

function populateFacultyProfileDropdown() {
    const select = document.getElementById('faculty-profile-select');
    if (!select) return;
    select.innerHTML = '<option value="">Choose faculty</option>';
    const programs = [...new Set(facultyRegistry.map(f => f.program))].sort();
    programs.forEach(program => {
        const group = document.createElement('optgroup');
        group.label = program;
        facultyRegistry.filter(f => f.program === program).forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty.id;
            option.textContent = faculty.name;
            group.appendChild(option);
        });
        select.appendChild(group);
    });
}

function displaySelectedFacultyProfile() {
    const selectedId = document.getElementById('faculty-profile-select')?.value;
    const detailContainer = document.getElementById('faculty-profile-details');
    if (!detailContainer) return;
    if (!selectedId) {
        detailContainer.innerHTML = `<div class="rounded-3xl bg-slate-50 p-5 border border-slate-200"><p class="text-sm text-slate-500">No faculty selected.</p></div>`;
        return;
    }
    const faculty = facultyRegistry.find(f => f.id === selectedId);
    if (!faculty) return;
    const totalLoad = calculateCumulativeLoadHours(faculty.name);
    detailContainer.innerHTML = `
        <div class="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm space-y-6">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                    <h4 class="text-2xl font-bold text-gray-900">${faculty.name}</h4>
                    <p class="text-sm text-gray-500 mt-2">${getTitleLabel(faculty)} • ${faculty.baseDesignation}</p>
                    <p class="text-sm text-slate-600">${faculty.specialization}</p>
                </div>
                <div class="flex flex-col gap-2 text-right">
                    <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">${faculty.program}</span>
                    <span class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">${faculty.employmentType}</span>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p class="text-xs uppercase text-slate-400 font-semibold">License No.</p>
                    <p class="mt-2 font-bold text-gray-900">${faculty.licenseNumber || 'N/A'}</p>
                </div>
                <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p class="text-xs uppercase text-slate-400 font-semibold">National Certificate (NC)</p>
                    <p class="mt-2 font-bold text-gray-900">${faculty.nationalCertificate || 'N/A'}</p>
                </div>
                <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p class="text-xs uppercase text-slate-400 font-semibold">Nature of Appointment</p>
                    <p class="mt-2 font-bold text-gray-900">${faculty.natureOfAppointment || 'N/A'}</p>
                </div>
                <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p class="text-xs uppercase text-slate-400 font-semibold">Remarks</p>
                    <p class="mt-2 font-bold text-gray-900">${faculty.remarks || 'N/A'}</p>
                </div>
            </div>
            <div class="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <table class="min-w-full text-left text-sm text-slate-700">
                    <thead>
                        <tr>
                            <th class="py-3 px-4 uppercase tracking-[0.12em] text-xs font-semibold">Educational Attainment</th>
                            <th class="py-3 px-4 uppercase tracking-[0.12em] text-xs font-semibold">Course Handle</th>
                            <th class="py-3 px-4 uppercase tracking-[0.12em] text-xs font-semibold">Research</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t border-slate-200">
                            <td class="py-4 px-4 align-top">
                                <div class="space-y-2">
                                    <div><span class="font-semibold">Baccalaureate:</span> ${faculty.educationalAttainment.baccalaureate || 'N/A'}</div>
                                    <div><span class="font-semibold">Masters:</span> ${faculty.educationalAttainment.masters || 'N/A'}</div>
                                    <div><span class="font-semibold">Doctorate:</span> ${faculty.educationalAttainment.doctorate || 'N/A'}</div>
                                    <div><span class="font-semibold">Post-Baccalaureate:</span> ${faculty.educationalAttainment.postBaccalaureate || 'N/A'}</div>
                                </div>
                            </td>
                            <td class="py-4 px-4 align-top">
                                <div class="space-y-2">
                                    <div><span class="font-semibold">GEN-ED:</span> ${faculty.courseHandle.genEd || 'N/A'}</div>
                                    <div><span class="font-semibold">Core Subject:</span> ${faculty.courseHandle.coreSubject || 'N/A'}</div>
                                    <div><span class="font-semibold">Professional Subject:</span> ${faculty.courseHandle.professionalSubject || 'N/A'}</div>
                                    <div><span class="font-semibold">Technical Subject:</span> ${faculty.courseHandle.technicalSubject || 'N/A'}</div>
                                </div>
                            </td>
                            <td class="py-4 px-4 align-top">
                                <div class="space-y-2">
                                    <div><span class="font-semibold">Production:</span> ${faculty.research.production || '0'}</div>
                                    <div><span class="font-semibold">Presentation:</span> ${faculty.research.presentation || '0'}</div>
                                    <div><span class="font-semibold">Publication:</span> ${faculty.research.publication || '0'}</div>
                                    <div><span class="font-semibold">Citation:</span> ${faculty.research.citation || '0'}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p class="text-xs uppercase text-slate-400 font-semibold">Specialization</p>
                    <p class="font-bold text-gray-900 mt-2">${faculty.specialization || 'N/A'}</p>
                </div>
                <div class="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p class="text-xs uppercase text-slate-400 font-semibold">Extension</p>
                    <p class="font-bold text-gray-900 mt-2">${faculty.extension || 'N/A'}</p>
                </div>
            </div>
            <div class="rounded-3xl bg-slate-100 p-4 border border-slate-200">
                <p class="text-xs uppercase tracking-[0.16em] font-semibold text-slate-500">Total Assigned Load</p>
                <p class="text-lg font-bold text-gray-900 mt-2">${totalLoad} Units</p>
            </div>
        </div>
    `;
}

function handleFacultySelectorChange() {
    const facultyId = document.getElementById('faculty-selector')?.value;
    const designeeDropdown = document.getElementById('designee-dropdown');
    if (!designeeDropdown) return;
    const professor = facultyRegistry.find(f => f.id === facultyId);
    if (professor) {
        if (designationOptions.includes(professor.baseDesignation)) {
            designeeDropdown.value = professor.baseDesignation;
        } else {
            designeeDropdown.selectedIndex = 0;
        }
    }
}

function renderFacultyProfilesModule() {
    const listContainer = document.getElementById('faculty-directory-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    facultyRegistry.forEach(f => {
        const crossProgramLoadUnits = calculateCumulativeLoadHours(f.name);
        const card = document.createElement('div');
        card.className = 'p-3 bg-white border rounded-lg shadow-xs flex items-center justify-between';
        card.innerHTML = `
            <div>
                <div class="text-sm font-bold text-gray-900">${f.name}</div>
                <div class="text-xs text-maroon font-semibold flex items-center gap-1 mt-0.5">
                    <i data-lucide="award" class="w-3 h-3"></i> ${getTitleLabel(f)} • ${f.baseDesignation}
                </div>
            </div>
            <div class="text-right">
                <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Aggregated Total Load</div>
                <div class="text-xs text-gray-700 font-medium">${crossProgramLoadUnits} Units Assigned</div>
            </div>
        `;
        listContainer.appendChild(card);
    });
    lucide.createIcons();
}

function saveDesignation() {
    const facultyId = document.getElementById('faculty-selector')?.value;
    const targetDesignationValue = document.getElementById('designee-dropdown')?.value;
    const professor = facultyRegistry.find(f => f.id === facultyId);
    if (professor) {
        professor.baseDesignation = targetDesignationValue;
        persistState();
        showBanner(`Structural Profile Update: ${professor.name} is now ${targetDesignationValue}`, 'success');
        renderFacultyProfilesModule();
        renderWorkloadMatrix();
    }
}

function saveFacultyProfileUpdate() {
    const selectedId = document.getElementById('faculty-profile-select')?.value;
    if (!selectedId) return;
    const professor = facultyRegistry.find(f => f.id === selectedId);
    if (!professor) return;
    const activeValue = document.getElementById('faculty-update-active')?.value;
    const employmentValue = document.getElementById('faculty-update-employment')?.value;
    const titleValue = document.getElementById('faculty-update-title')?.value.trim();
    professor.active = activeValue === 'active';
    professor.employmentType = employmentValue || professor.employmentType;
    if (titleValue) professor.baseDesignation = titleValue;
    persistState();
    showBanner(`Updated profile for ${professor.name}.`, 'success');
    renderProgramResources();
    renderDashboard();
    displaySelectedFacultyProfile();
}

function saveNewFacultyProfile() {
    const name = document.getElementById('new-faculty-name')?.value.trim();
    if (!name) {
        alert('Please enter the faculty name.');
        return;
    }
    const program = document.getElementById('new-faculty-program')?.value || State.activeProgram;
    const id = `prof-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
    const facultyObject = {
        id, name,
        baseDesignation: document.getElementById('new-faculty-designation')?.value || '',
        program,
        employmentType: document.getElementById('new-faculty-employment')?.value || '',
        active: true,
        educationalAttainment: {
            baccalaureate: document.getElementById('new-faculty-bacc')?.value || '',
            masters: document.getElementById('new-faculty-master')?.value || '',
            doctorate: document.getElementById('new-faculty-doctorate')?.value || '',
            postBaccalaureate: document.getElementById('new-faculty-postbac')?.value || ''
        },
        licenseNumber: document.getElementById('new-faculty-license')?.value || '',
        specialization: document.getElementById('new-faculty-specialization')?.value || '',
        nationalCertificate: document.getElementById('new-faculty-nc')?.value || '',
        courseHandle: {
            genEd: document.getElementById('new-faculty-gened')?.value || '',
            coreSubject: document.getElementById('new-faculty-core')?.value || '',
            professionalSubject: document.getElementById('new-faculty-professional')?.value || '',
            technicalSubject: document.getElementById('new-faculty-technical')?.value || ''
        },
        research: {
            production: document.getElementById('new-faculty-production')?.value || '0',
            presentation: document.getElementById('new-faculty-presentation')?.value || '0',
            publication: document.getElementById('new-faculty-publication')?.value || '0',
            citation: document.getElementById('new-faculty-citation')?.value || '0'
        },
        extension: document.getElementById('new-faculty-extension')?.value || '',
        natureOfAppointment: document.getElementById('new-faculty-nature')?.value || '',
        remarks: document.getElementById('new-faculty-remarks')?.value || ''
    };
    facultyRegistry.push(facultyObject);
    if (!State.db.programs[program]) {
        State.db.programs[program] = { profs: [], sections: [], subjects: {} };
    }
    if (!State.db.programs[program].profs.includes(name)) {
        State.db.programs[program].profs.push(name);
    }
    persistState();
    populateFacultyDropdowns();
    populateFacultyProfileDropdown();
    renderProgramResources();
    document.getElementById('new-faculty-form')?.reset();
    showBanner(`Faculty profile for ${name} has been added successfully.`, 'success');
    
    try {
        if (window.location.pathname.endsWith('add-faculty-profile.html') || window.location.href.includes('add-faculty-profile.html')) {
            window.location.href = `program-resources.html?new=${encodeURIComponent(name)}`;
        }
    } catch (e) {}
}

function renderPageSections() {
    renderSYDropdown();
    populateFacultyDropdowns();
    populateFacultyProfileDropdown();
    renderProgramResources();
    if (document.getElementById('load-table')) {
        updateSectionDropdowns();
        updateRoomDropdowns();
        renderLoadTable();
    }
    if (document.getElementById('faculty-calendar-container')) {
        updateFacultyWorkloadDropdown();
    }
    if (document.getElementById('timetable-container')) {
        updateSectionDropdowns();
        renderTimetable();
    }
    if (document.getElementById('room-schedule-preview')) {
        updateRoomDropdowns();
        renderRoomSchedulePreview();
    }
    if (document.getElementById('resource-program-name')) {
        document.getElementById('resource-program-name').innerText = State.activeProgram;
    }
    renderActiveProgramButtons();
    renderDashboard();
    lucide.createIcons();
}

// PROGRAM RESOURCES RENDERING MODULE
function renderProgramResources() {
    const program = State.db.programs[State.activeProgram] || { profs: [], sections: [], subjects: {} };
    const facultyObjs = facultyRegistry.filter(f => f.program === State.activeProgram);
    const activeFac = facultyObjs.filter(f => f.active !== false);
    const inactiveFac = facultyObjs.filter(f => f.active === false);
    const facultyCountEl = document.getElementById('resource-faculty-count');
    const subjectCountEl = document.getElementById('resource-subject-count');
    const sectionCountEl = document.getElementById('resource-section-count');

    if (facultyCountEl) facultyCountEl.innerText = facultyObjs.length;
    if (sectionCountEl) sectionCountEl.innerText = program.sections ? program.sections.length : 0;
    if (subjectCountEl) {
        let totalCount = 0;
        if (program.subjects && typeof program.subjects === 'object' && !Array.isArray(program.subjects)) {
            Object.values(program.subjects).forEach(yearLvl => {
                Object.values(yearLvl).forEach(semArr => {
                    if (Array.isArray(semArr)) totalCount += semArr.length;
                });
            });
        }
        subjectCountEl.innerText = totalCount;
    }

    if (document.getElementById('resource-program-name')) {
        document.getElementById('resource-program-name').innerText = State.activeProgram;
    }
    renderActiveProgramButtons();

    const yearSelect = document.getElementById('resource-year-select');
    const semesterSelect = document.getElementById('resource-semester-select');
    const yearKeys = Object.keys(program.subjects || {});
    if (yearSelect) {
        yearSelect.innerHTML = `<option value="">All Years</option>` + yearKeys.map(yk => `<option value="${yk}">${yk}</option>`).join('');
        if (!yearKeys.includes(State.resourceYearLevel)) State.resourceYearLevel = '';
        yearSelect.value = State.resourceYearLevel || '';
    }
    const selectedYear = State.resourceYearLevel || yearKeys[0] || '';
    const semesterKeys = selectedYear && program.subjects[selectedYear] ? Object.keys(program.subjects[selectedYear]) : [];
    if (semesterSelect) {
        semesterSelect.innerHTML = `<option value="">All Semesters</option>` + semesterKeys.map(sk => `<option value="${sk}">${sk}</option>`).join('');
        if (!semesterKeys.includes(State.resourceSemester)) State.resourceSemester = '';
        semesterSelect.value = State.resourceSemester || '';
    }

    const facultyList = document.getElementById('resource-faculty-list');
    if (facultyList) {
        facultyList.innerHTML = '';
        let displayedStaff = [...facultyObjs];
        if (State.facultyFilter === 'active') displayedStaff = [...activeFac];
        if (State.facultyFilter === 'inactive') displayedStaff = [...inactiveFac];
        if (State.facultyFilter === 'part-time') displayedStaff = facultyObjs.filter(f => f.employmentType.toLowerCase().includes('part'));
        if (State.facultyFilter === 'regular') displayedStaff = facultyObjs.filter(f => f.employmentType === 'Regular' && (f.baseDesignation.includes('Instructor') || f.baseDesignation.includes('Lecturer') || f.baseDesignation.includes('Professor')));
        if (State.facultyFilter === 'designee') displayedStaff = facultyObjs.filter(f => f.employmentType === 'Regular' && !f.baseDesignation.includes('Instructor') && !f.baseDesignation.includes('Lecturer'));

        const createCard = (f) => {
            const card = document.createElement('div');
            const isProfInactive = f.active === false;
            card.className = `rounded-3xl bg-slate-50 p-4 border border-transparent transition-all ${isProfInactive ? 'opacity-60 border-dashed border-slate-300' : 'hover:border-slate-300 hover:bg-white cursor-pointer'}`;
            card.setAttribute('data-faculty', f.id);
            card.innerHTML = `
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <div class="font-semibold text-gray-900">${f.name}</div>
                        <div class="text-[11px] text-slate-500">${getTitleLabel(f)} • ${f.baseDesignation}</div>
                    </div>
                    <div class="text-[10px] px-2 py-0.5 rounded-full bg-white border text-slate-600 font-medium">${f.employmentType}</div>
                </div>
            `;
            card.addEventListener('click', () => selectFaculty(f.id));
            return card;
        };

        const activeSection = document.createElement('div');
        activeSection.innerHTML = `<div class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Active Faculty (${activeFac.length})</div>`;
        const inactiveSection = document.createElement('div');
        inactiveSection.innerHTML = `<div class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Inactive Faculty (${inactiveFac.length})</div>`;

        const activeList = document.createElement('div');
        const inactiveList = document.createElement('div');
        displayedStaff.filter(f => f.active !== false).forEach(f => activeList.appendChild(createCard(f)));
        displayedStaff.filter(f => f.active === false).forEach(f => inactiveList.appendChild(createCard(f)));

        if (activeList.children.length) { activeSection.appendChild(activeList); facultyList.appendChild(activeSection); }
        if (inactiveList.children.length) { inactiveSection.appendChild(inactiveList); facultyList.appendChild(inactiveSection); }
        if (!activeList.children.length && !inactiveList.children.length) {
            facultyList.innerHTML = '<div class="text-gray-400 italic text-xs p-4">No instructors match this category list filter.</div>';
        }
    }

    const subjectList = document.getElementById('resource-subject-list');
    if (subjectList) {
        subjectList.innerHTML = '';
        if (!program.subjects || Object.keys(program.subjects).length === 0) {
            subjectList.innerHTML = '<div class="text-gray-500 italic text-xs p-4">No curriculum items loaded for this program.</div>';
        } else {
            const yearsToRender = State.resourceYearLevel ? [State.resourceYearLevel] : Object.keys(program.subjects).sort();
            if (yearsToRender.length === 0) {
                subjectList.innerHTML = '<div class="text-gray-500 italic text-xs p-4">No curriculum items loaded for this program.</div>';
            } else {
                yearsToRender.forEach(yearKey => {
                    if (!program.subjects[yearKey]) return;
                    const yearSection = document.createElement('div');
                    yearSection.className = 'mb-4 space-y-2';
                    yearSection.innerHTML = `<h4 class="text-xs font-bold text-red-900 tracking-wider uppercase border-b pb-1 mb-2">${yearKey} Hierarchy</h4>`;
                    const semKeys = State.resourceSemester ? [State.resourceSemester] : Object.keys(program.subjects[yearKey] || {});
                    semKeys.forEach(semKey => {
                        if (!program.subjects[yearKey][semKey]) return;
                        const semContainer = document.createElement('div');
                        semContainer.className = 'pl-2 space-y-1.5';
                        semContainer.innerHTML = `<div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1">${semKey}</div>`;
                        program.subjects[yearKey][semKey].forEach(sub => {
                            const subRow = document.createElement('div');
                            subRow.className = 'rounded-2xl bg-slate-50 p-3 flex items-center justify-between text-xs hover:bg-slate-100 transition-all';
                            subRow.innerHTML = `
                                <span class="font-medium text-gray-800">${sub.name}</span>
                            `;
                            semContainer.appendChild(subRow);
                        });
                        yearSection.appendChild(semContainer);
                    });
                    subjectList.appendChild(yearSection);
                });
            }
        }
    }

    const sectionList = document.getElementById('resource-section-list');
    if (sectionList) {
        sectionList.innerHTML = (program.sections || []).map(section => `
            <div class="rounded-3xl bg-slate-50 p-4 flex items-center justify-between">
                <span class="text-xs font-medium text-slate-800">${section}</span>
                <button class="text-slate-400 hover:text-red-500"><i data-lucide="trash" class="w-4 h-4"></i></button>
            </div>
        `).join('') || '<div class="text-gray-500 italic text-xs p-4">No active sections mapped yet.</div>';
    }
}

function setResourceYearLevel(value) {
    State.resourceYearLevel = value;
    if (!value) State.resourceSemester = '';
    renderProgramResources();
}

function setResourceSemester(value) {
    State.resourceSemester = value;
    renderProgramResources();
}

function renderSYDropdown() {
    const sel = document.getElementById('sy-selector');
    if (!sel) return;
    sel.innerHTML = State.db.schoolYears.map(sy => `<option value="${sy}">${sy}</option>`).join('');
    if (!sel.value) sel.value = State.db.schoolYears[0] || '';
}

function getProfessorLoadTotals(profName) {
    return State.db.loads.filter(l => l.prof === profName).reduce((acc, load) => {
        if (load.loadType === 'Regular Load') acc.regular += load.units || 0;
        if (load.loadType === 'Part-Time Load') acc.partTime += load.units || 0;
        if (load.loadType === 'Temporary Load') acc.temporary += load.units || 0;
        if (load.loadType === 'Substitute Load') acc.substitute += load.units || 0;
        acc.total += load.units || 0;
        return acc;
    }, { total: 0, regular: 0, partTime: 0, temporary: 0, substitute: 0 });
}

function canAssignLoad(profName, units, editId, category) {
    const totals = getProfessorLoadTotals(profName);
    const caps = { 'Regular Load': 18, 'Part-Time Load': 12, 'Temporary Load': 6, 'Substitute Load': 6 };
    const maxUnits = 45;
    const loadTypeKey = category === 'Regular Load' ? 'regular' : category === 'Part-Time Load' ? 'partTime' : category === 'Temporary Load' ? 'temporary' : 'substitute';
    const wouldExceedType = totals[loadTypeKey] + units > (caps[category] || 0);
    const wouldExceedProf = totals.total + units > maxUnits;
    return { canAssign: !wouldExceedType && !wouldExceedProf, totals, caps, wouldExceedType, wouldExceedProf, maxUnits };
}

function updateSectionDropdowns() {
    const sel = document.getElementById('view-section-select');
    if (!sel) return;
    const program = State.db.programs[State.activeProgram] || { sections: [] };
    sel.innerHTML = program.sections.map(s => `<option>${s}</option>`).join('') || '<option disabled>No Sections</option>';
}

function updateRoomDropdowns() {
    const sel = document.getElementById('view-room-select');
    if (!sel) return;
    sel.innerHTML = State.db.rooms.map(r => `<option>${r}</option>`).join('') || '<option disabled>No Rooms</option>';
    renderRoomSchedulePreview();
}

function renderLoadTable() {
    const table = document.getElementById('load-table');
    if (!table) return;
    const data = State.db.loads.filter(l => l.program === State.activeProgram);
    table.innerHTML = data.map(l => {
        const labelClass = l.loadType === 'Part-Time Load'
            ? 'text-blue-600 bg-blue-50 border border-blue-200'
            : l.loadType === 'Temporary Load'
                ? 'text-purple-600 bg-purple-50 border border-purple-200'
                : 'text-emerald-600 bg-emerald-50 border border-emerald-200';
        return `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-red-900">${l.prof}</td>
                <td class="p-4 text-xs font-semibold">
                    <div class="text-slate-900 text-sm font-semibold mb-1">${l.sub} (${l.units || 3}u)</div>
                    <span class="inline-block text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${labelClass}">${l.loadType || 'Regular Load'}</span>
                </td>
                <td class="p-4">
                    <div><span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-[10px] font-bold">${l.sec}</span></div>
                    <div class="mt-2 text-[10px] text-slate-600">Room ${l.room}</div>
                </td>
                <td class="p-4 text-[10px] font-medium text-gray-500">
                    ${l.day}<br>
                    <span class="text-gray-900 font-bold">${l.time}</span><br>
                    <span class="text-[10px] font-semibold text-gray-700">${l.building}</span>
                </td>
                <td class="p-4 text-right space-x-2">
                    <button onclick="editLoad(${l.id})" class="text-blue-500 hover:underline text-[10px] font-bold">EDIT</button>
                    <button onclick="deleteLoad(${l.id})" class="text-red-500 hover:underline text-[10px] font-bold">CANCEL</button>
                </td>
            </tr>
        `;
    }).join('') || `<tr><td colspan="5" class="p-10 text-center text-gray-300 italic">No assignments found for this program.</td></tr>`;
}

function openLoadModal(loadId = null) {
    const program = State.db.programs[State.activeProgram];
    if (!program) return alert('No active program selected!');
    const load = loadId ? State.db.loads.find(l => l.id === loadId) : null;
    currentLoadEditId = load?.id || null;

    if (!program.profs) program.profs = [];
    if (!program.sections) program.sections = [];
    if (!program.subjects) program.subjects = {};
    State.db.rooms = State.db.rooms || [];
    State.db.buildings = State.db.buildings || [];

    if (program.profs.length === 0 || program.sections.length === 0) return alert('Add faculty and sections first!');

    document.getElementById('modal-load-title').innerText = load ? 'EDIT ASSIGNMENT' : 'ASSIGN CLASS LOAD';
    document.getElementById('save-load-button').innerText = load ? 'Update Assignment' : 'Apply to Schedule';

    const allProfs = [...new Set(Object.values(State.db.programs).flatMap(pr => (pr.profs || []).map(x => (typeof x === 'string' ? x : x.name))))].sort((a, b) => a.localeCompare(b));
    document.getElementById('ld-prof').innerHTML = allProfs.length ? allProfs.map(pname => `<option>${pname}</option>`).join('') : '<option disabled>No professors available</option>';
    
    // Flatten nested structural subjects to display inside selectors perfectly
    let flattenedOptions = '';
    Object.keys(program.subjects).forEach(yKey => {
        Object.keys(program.subjects[yKey]).forEach(sKey => {
            program.subjects[yKey][sKey].forEach(sub => {
                flattenedOptions += `<option value="${sub.name}" data-units="${sub.units}">${sub.name} (${sub.units}u)</option>`;
            });
        });
    });
    document.getElementById('ld-sub').innerHTML = flattenedOptions || '<option disabled>No subjects loaded</option>';
    
    document.getElementById('ld-sec').innerHTML = program.sections.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-room').innerHTML = State.db.rooms.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-building').innerHTML = State.db.buildings.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-day').innerHTML = Days.map(x => `<option>${x}</option>`).join('');

    if (load) {
        document.getElementById('ld-prof').value = load.prof;
        document.getElementById('ld-sub').value = load.sub;
        document.getElementById('ld-sec').value = load.sec;
        document.getElementById('ld-room').value = load.room;
        document.getElementById('ld-building').value = load.building;
        document.getElementById('ld-day').value = load.day;
        document.getElementById('ld-units').value = load.units || 3;
        document.getElementById('ld-category').value = load.loadType || 'Regular Load';
    } else {
        document.getElementById('ld-category').value = 'Regular Load';
    }

    refreshTimeSlots();
    if (load) {
        document.getElementById('ld-time').value = load.time;
    }
    document.getElementById('modal-load').classList.remove('hidden');
    lucide.createIcons();
}

function refreshTimeSlots() {
    const day = document.getElementById('ld-day')?.value;
    const prof = document.getElementById('ld-prof')?.value;
    const sec = document.getElementById('ld-sec')?.value;
    const room = document.getElementById('ld-room')?.value;
    const sub = document.getElementById('ld-sub');
    const category = document.getElementById('ld-category')?.value;
    const unitsInput = document.getElementById('ld-units');
    const timeSelect = document.getElementById('ld-time');
    if (!timeSelect) return;
    const subjectUnits = Number(sub?.selectedOptions[0]?.dataset?.units || 3);
    let units = Math.max(1, Number(unitsInput?.value || subjectUnits));
    if (category === 'Regular Load') {
        units = Math.min(6, subjectUnits);
    } else if (category === 'Part-Time Load') {
        units = Math.min(12, subjectUnits);
    } else {
        units = Math.min(6, subjectUnits);
    }
    if (unitsInput) unitsInput.value = units;
    timeSelect.innerHTML = TimeStarts.map(start => {
        const range = getTimeRange(start, units);
        const target = parseTimeRange(range);
        const conflictLoad = day && prof && room && sec ? findConflict(day, target, prof, room, sec, currentLoadEditId) : null;
        const disabled = conflictLoad ? 'disabled' : '';
        const label = conflictLoad ? ' • conflict' : '';
        return `<option value="${range}" ${disabled}>${range}${label}</option>`;
    }).join('');
}

function saveLoad() {
    const time = document.getElementById('ld-time')?.value;
    const sub = document.getElementById('ld-sub')?.value;
    const day = document.getElementById('ld-day')?.value;
    const loadCategory = document.getElementById('ld-category')?.value;
    const prof = document.getElementById('ld-prof')?.value;
    const units = Math.max(1, Math.floor(Number(document.getElementById('ld-units')?.value || 3)));
    const sec = document.getElementById('ld-sec')?.value;
    const room = document.getElementById('ld-room')?.value;
    const building = document.getElementById('ld-building')?.value || 'Main Building';
    const sy = document.getElementById('sy-selector')?.value || State.db.schoolYears[0];
    if (!time || !sub || !day || !prof || !sec || !room) {
        alert('Please complete all assignment fields.');
        return;
    }
    const capacityCheck = canAssignLoad(prof, units, currentLoadEditId, loadCategory);
    if (!capacityCheck.canAssign) {
        let warning = `⚠️ LOAD LIMIT REACHED for ${prof}!\n\n`;
        if (capacityCheck.wouldExceedType) {
            warning += `- ${loadCategory} limit exceeded (${capacityCheck.totals[loadCategory === 'Regular Load' ? 'regular' : 'partTime'] + units}/${capacityCheck.caps[loadCategory]}u).\n`;
        }
        if (capacityCheck.wouldExceedProf) {
            warning += `- This professor would exceed total allowable units (${capacityCheck.totals.total + units}/${capacityCheck.maxUnits}u).\n`;
        }
        alert(warning + '\nAssignment cancelled.');
        return;
    }
    const load = {
        id: currentLoadEditId || Date.now(),
        prof, sub, units, loadType: loadCategory, sec, room, building, day, time, sy,
        program: State.activeProgram
    };
    const parsedTarget = parseTimeRange(load.time);
    const conflict = State.db.loads.find(l => {
        if (l.id === load.id) return false;
        if (l.day !== load.day) return false;
        if (!rangesOverlap(parsedTarget, parseTimeRange(l.time))) return false;
        if (l.prof === load.prof) return true;
        if (l.room === load.room) return true;
        if (l.sec === load.sec) return true;
        return false;
    });
    if (conflict) {
        alert(`Time conflict found with:\nProfessor: ${conflict.prof}\nRoom: ${conflict.room}\nSection: ${conflict.sec}\nTime: ${conflict.time}`);
        return;
    }
    if (currentLoadEditId) {
        const existing = State.db.loads.find(l => l.id === currentLoadEditId);
        if (existing) Object.assign(existing, load);
    } else {
        State.db.loads.push(load);
    }
    currentLoadEditId = null;
    persistState();
    document.getElementById('modal-load').classList.add('hidden');
    renderPageSections();
}

function editLoad(id) { openLoadModal(id); }
function deleteLoad(id) {
    State.db.loads = State.db.loads.filter(l => l.id !== id);
    persistState();
    renderPageSections();
}

function renderRoomSchedulePreview() {
    const preview = document.getElementById('room-schedule-preview');
    if (!preview) return;
    const room = document.getElementById('view-room-select')?.value;
    const sy = document.getElementById('sy-selector')?.value || State.db.schoolYears[0];
    if (!room) {
        preview.innerHTML = '<div class="text-gray-500 italic text-xs">Select a room to preview schedules.</div>';
        return;
    }
    const loads = State.db.loads
        .filter(l => l.room === room && l.sy === sy)
        .sort((a, b) => {
            if (a.day !== b.day) return Days.indexOf(a.day) - Days.indexOf(b.day);
            return parseTimeRange(a.time).start - parseTimeRange(b.time).start;
        });
    if (loads.length === 0) {
        preview.innerHTML = `<div class="text-gray-500 italic text-xs">No scheduled classes found for ${room}.</div>`;
        return;
    }
    const scheduleMap = {}; const skipCell = {};
    Days.forEach(day => { scheduleMap[day] = {}; skipCell[day] = {}; });
    loads.forEach(load => {
        const start = load.time.split(' - ')[0];
        const startIndex = TimeStarts.indexOf(start);
        if (startIndex === -1) return;
        const span = (load.units || 3) * 2;
        scheduleMap[load.day][start] = { load, span };
        for (let offset = 1; offset < span; offset++) {
            const slot = TimeStarts[startIndex + offset];
            if (slot) skipCell[load.day][slot] = true;
        }
    });
    let html = `<div class="overflow-x-auto"><table class="min-w-full border-collapse text-[11px]"><thead><tr><th class="border bg-slate-100 px-3 py-2 text-left uppercase text-slate-500">TIME </th>${Days.map(day => `<th class="border bg-slate-100 px-3 py-2 text-left uppercase text-slate-500">${day}</th>`).join('')}</tr></thead><tbody>`;
    TimeStarts.forEach(start => {
        html += `<tr class="odd:bg-white even:bg-slate-50/50"><td class="border px-3 py-1.5 font-semibold text-slate-500">${start}</td>`;
        Days.forEach(day => {
            if (skipCell[day][start]) return;
            const entry = scheduleMap[day][start];
            if (entry) {
                const palette = getProgramPalette(entry.load.program);
                const cellClasses = palette ? `${palette.row} text-slate-900` : 'bg-amber-100 text-slate-900';
                html += `<td rowspan="${entry.span}" class="border p-2 align-top ${cellClasses} font-medium">
                    <div class="font-bold text-[11px]">${entry.load.sub}</div>
                    <div class="text-[10px] text-slate-700">${entry.load.prof}</div>
                    <div class="text-[9px] text-slate-500">${entry.load.sec} · ${entry.load.building}</div>
                </td>`;
            } else {
                html += `<td class="border bg-white"></td>`;
            }
        });
        html += `</tr>`;
    });
    preview.innerHTML = html + `</tbody></table></div>`;
}

function updateFacultyWorkloadDropdown() {
    const sel = document.getElementById('view-faculty-select');
    const programFilter = document.getElementById('workload-program-filter');
    const container = document.getElementById('faculty-calendar-container');
    if (!sel || !container || !programFilter) return;

    const profs = [...new Set(Object.values(State.db.programs).flatMap(prog => (prog.profs || [])))].sort((a, b) => a.localeCompare(b));
    sel.innerHTML = profs.length ? profs.map(p => `<option value="${p}">${p}</option>`).join('') : '<option disabled>No professors available</option>';

    const programs = Object.keys(State.db.programs || {}).sort((a, b) => a.localeCompare(b));
    programFilter.innerHTML = ['<option value="All">All Programs</option>', ...programs.map(p => `<option value="${p}">${p}</option>`)].join('');

    if (profs.length) renderFacultyCalendar();
}

function renderFacultyCalendar() {
    const container = document.getElementById('faculty-calendar-container');
    const headerStats = document.getElementById('workload-header-stats');
    const loadTypesSummary = document.getElementById('workload-type-summary');
    const subtitle = document.getElementById('workload-page-subtitle');
    const prof = document.getElementById('view-faculty-select')?.value;
    if (!container || !headerStats || !loadTypesSummary || !subtitle) return;
    if (!prof) {
        subtitle.innerText = 'Program: Information Technology';
        headerStats.innerHTML = '';
        loadTypesSummary.innerHTML = '';
        container.innerHTML = '<div class="text-gray-500 italic text-xs">Select a professor.</div>';
        return;
    }
    const programFilter = document.getElementById('workload-program-filter')?.value || 'All';
    const sy = document.getElementById('sy-selector')?.value || State.db.schoolYears[0];
    const loads = State.db.loads.filter(l => l.prof === prof && (programFilter === 'All' ? true : l.program === programFilter));
    const programName = displayProfessorProgram(prof) || State.activeProgram;
    const palette = getProgramPalette(programName);
    subtitle.innerHTML = `Professor: ${prof} · <span class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${palette ? palette.pill : 'bg-slate-100 text-slate-700'}">${programName}</span>`;
    headerStats.innerHTML = renderWorkloadHeaderStats(loads, prof, sy, programName);
    loadTypesSummary.innerHTML = renderWorkloadTypeSummary(loads);

    const scheduleMap = {}; const skipCell = {};
    Days.forEach(day => { scheduleMap[day] = {}; skipCell[day] = {}; });
    loads.forEach(load => {
        const start = load.time.split(' - ')[0];
        const startIndex = TimeStarts.indexOf(start);
        if (startIndex === -1) return;
        const span = Math.max(1, (load.units || 3) * 2);
        scheduleMap[load.day][start] = { load, span };
        for (let offset = 1; offset < span; offset++) {
            const slot = TimeStarts[startIndex + offset];
            if (slot) skipCell[load.day][slot] = true;
        }
    });
    let html = `<div class="overflow-x-auto"><table class="min-w-full border-collapse text-[11px]"><thead><tr><th class="border bg-slate-100 px-3 py-2 text-left text-slate-500 uppercase">TIME</th>${Days.map(day => `<th class="border bg-slate-100 px-3 py-2 text-left text-slate-500 uppercase">${day}</th>`).join('')}</tr></thead><tbody>`;
    TimeStarts.forEach(start => {
        html += `<tr class="odd:bg-white even:bg-slate-50/50"><td class="border px-3 py-1.5 font-semibold text-slate-500">${start}</td>`;
        Days.forEach(day => {
            if (skipCell[day][start]) return;
            const entry = scheduleMap[day][start];
            if (entry) {
                const palette = getProgramPalette(entry.load.program);
                const cellClasses = palette ? `${palette.row} text-slate-900` : 'bg-slate-100 text-slate-900';
                html += `<td rowspan="${entry.span}" class="border p-2 align-top ${cellClasses}">
                    <div class="font-bold text-[11px]">${entry.load.sub}</div>
                    <div class="text-[10px] text-slate-700">${entry.load.sec}</div>
                    <div class="text-[9px] text-slate-500">${entry.load.room}</div>
                </td>`;
            } else {
                html += `<td class="border bg-white"></td>`;
            }
        });
        html += `</tr>`;
    });
    container.innerHTML = html + `</tbody></table></div>`;
}

function renderWorkloadHeaderStats(loads, professor, sy, programName) {
    const totalLoads = loads.length;
    const totalHours = loads.reduce((sum, load) => sum + (load.units || 0), 0);
    const palette = getProgramPalette(programName);
    const programCard = palette ? `border ${palette.card}` : 'border border-slate-200 bg-white';
    return `
        <div class="rounded-[2rem] ${palette ? palette.card : 'border border-slate-200 bg-white'} px-5 py-6 shadow-sm min-h-[11rem] flex flex-col justify-between">
            <div class="text-[9px] uppercase tracking-[0.35em] ${palette ? palette.text : 'text-slate-400'}">Total Loads</div>
            <div class="mt-4 text-4xl font-black ${palette ? palette.text : 'text-slate-900'}">${totalLoads}</div>
        </div>
        <div class="rounded-[2rem] border border-slate-200 bg-white px-5 py-6 shadow-sm min-h-[11rem] flex flex-col justify-between">
            <div class="text-[9px] uppercase tracking-[0.35em] text-slate-400">Total Hours</div>
            <div class="mt-4 text-4xl font-black text-slate-900">${totalHours}h</div>
        </div>
        <div class="rounded-[2rem] border border-slate-200 bg-white px-5 py-6 shadow-sm min-h-[11rem] flex flex-col justify-between">
            <div class="text-[9px] uppercase tracking-[0.35em] text-slate-400">Academic Year</div>
            <div class="mt-4 text-3xl font-black text-slate-900 leading-tight">${sy}</div>
        </div>
        <div class="rounded-[2rem] ${programCard} px-5 py-6 shadow-sm min-h-[11rem] flex flex-col justify-between">
            <div class="text-[9px] uppercase tracking-[0.35em] ${palette ? palette.text : 'text-slate-400'}">Professor</div>
            <div class="mt-4 text-3xl font-black ${palette ? palette.text : 'text-slate-900'} leading-tight break-words">${professor}</div>
        </div>
    `;
}

function renderWorkloadTypeSummary(loads) {
    const counts = loads.reduce((acc, load) => {
        const type = load.loadType || 'Regular Load';
        if (!acc[type]) acc[type] = 0;
        acc[type] += 1;
        return acc;
    }, { 'Regular Load': 0, 'Part-Time Load': 0, 'Temporary Load': 0, 'Substitute Load': 0 });

    const items = [
        { label: 'Regular Load', count: counts['Regular Load'], bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        { label: 'Part-Time Load', count: counts['Part-Time Load'], bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
        { label: 'Temporary Load', count: counts['Temporary Load'], bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
        { label: 'Substitute Load', count: counts['Substitute Load'], bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
    ];

    return items.map(item => `
        <div class="rounded-[2rem] border ${item.border} ${item.bg} p-6 shadow-sm min-h-[11rem] flex flex-col justify-between">
            <div class="text-xs uppercase tracking-[0.35em] ${item.text}">${item.label}</div>
            <div class="mt-4 text-5xl font-black ${item.text}">${item.count}</div>
        </div>
    `).join('');
}

function displayProfessorProgram(professorName) {
    const faculty = facultyRegistry.find(f => f.name === professorName);
    return faculty?.program || null;
}

function toggleCalendarFullscreen(target = null) {
    document.body.classList.toggle('calendar-fullscreen');
    if (target === 'sections') renderTimetable();
    if (target === 'rooms') renderRoomSchedulePreview();
    if (target === 'workloads') renderFacultyCalendar();
    lucide.createIcons();
}

function exportSectionTimetable() {
    const sec = document.getElementById('view-section-select')?.value;
    if (!sec) return alert('Please select a section.');
    const data = State.db.loads.filter(l => l.sec === sec);
    let html = `<html><body><h2>Section Timetable: ${sec}</h2><table border="1"><tr><th>Day</th><th>Time</th><th>Subject</th><th>Professor</th><th>Room</th></tr>`;
    data.forEach(l => { html += `<tr><td>${l.day}</td><td>${l.time}</td><td>${l.sub}</td><td>${l.prof}</td><td>${l.room}</td></tr>`; });
    const blob = new Blob([html + '</table></body></html>'], { type: 'text/html' });
    const a = document.createElement('a'); a.href = window.URL.createObjectURL(blob); a.download = `Timetable_${sec}.html`; a.click();
}

function exportRoomSchedule() {
    const room = document.getElementById('view-room-select')?.value;
    if (!room) return alert('Select room.');
    const data = State.db.loads.filter(l => l.room === room);
    let html = `<html><body><h2>Room Schedule: ${room}</h2><table border="1"><tr><th>Day</th><th>Time</th><th>Course</th><th>Section</th></tr>`;
    data.forEach(l => { html += `<tr><td>${l.day}</td><td>${l.time}</td><td>${l.sub}</td><td>${l.sec}</td></tr>`; });
    const blob = new Blob([html + '</table></body></html>'], { type: 'text/html' });
    const a = document.createElement('a'); a.href = window.URL.createObjectURL(blob); a.download = `Room_${room}.html`; a.click();
}

function renderTimetable() {
    const sec = document.getElementById('view-section-select')?.value;
    const container = document.getElementById('timetable-container');
    if (!container) return;
    if (!sec) {
        container.innerHTML = '<div class="text-gray-500 italic text-xs">Select a section.</div>';
        return;
    }
    const sy = document.getElementById('sy-selector')?.value || State.db.schoolYears[0];
    const loads = State.db.loads.filter(l => l.sec === sec && l.sy === sy);
    const scheduleMap = {}; const skipCell = {};
    Days.forEach(day => { scheduleMap[day] = {}; skipCell[day] = {}; });
    loads.forEach(load => {
        const start = load.time.split(' - ')[0];
        const startIndex = TimeStarts.indexOf(start);
        if (startIndex === -1) return;
        const span = (load.units || 3) * 2;
        scheduleMap[load.day][start] = { load, span };
        for (let offset = 1; offset < span; offset++) {
            const slot = TimeStarts[startIndex + offset];
            if (slot) skipCell[load.day][slot] = true;
        }
    });
    let html = `<div class="overflow-x-auto"><table class="min-w-full border-collapse text-[11px]"><thead><tr><th class="border bg-slate-100 px-3 py-2 text-left uppercase text-slate-500">TIME</th>${Days.map(day => `<th class="border bg-slate-100 px-3 py-2 text-left uppercase text-slate-500">${day}</th>`).join('')}</tr></thead><tbody>`;
    TimeStarts.forEach(start => {
        html += `<tr class="odd:bg-white even:bg-slate-50/50"><td class="border px-3 py-1.5 font-semibold text-slate-500">${start}</td>`;
        Days.forEach(day => {
            if (skipCell[day][start]) return;
            const entry = scheduleMap[day][start];
            if (entry) {
                html += `<td rowspan="${entry.span}" class="border p-2 align-top bg-blue-50 text-slate-900 font-medium">
                    <div class="font-bold">${entry.load.sub}</div>
                    <div class="text-[10px] text-slate-700">${entry.load.prof}</div>
                    <div class="text-[9px] text-slate-500">${entry.load.room}</div>
                </td>`;
            } else {
                html += `<td class="border bg-white"></td>`;
            }
        });
        html += `</tr>`;
    });
    container.innerHTML = html + `</tbody></table></div>`;
}

function downloadWorkload() {
    const prof = document.getElementById('view-faculty-select')?.value;
    if (prof) exportFacultyWorkload(prof);
}

function exportFacultyWorkload(profName) {
    const data = State.db.loads.filter(l => l.prof === profName);
    let html = `<html><body><h2>Workload: ${profName}</h2><table border="1"><tr><th>Subject</th><th>Section</th><th>Schedule</th></tr>`;
    data.forEach(l => { html += `<tr><td>${l.sub}</td><td>${l.sec}</td><td>${l.day} (${l.time})</td></tr>`; });
    const blob = new Blob([html + '</table></body></html>'], { type: 'text/html' });
    const a = document.createElement('a'); a.href = window.URL.createObjectURL(blob); a.download = `Workload_${profName}.html`; a.click();
}

function initApp() {
    loadSavedState();
    initializeSystemModules();
}

document.addEventListener('DOMContentLoaded', initApp);