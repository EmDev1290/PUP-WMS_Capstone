const State = {
    currentUser: null,
    activeProgram: localStorage.getItem('schedulerActiveProgram') || "Information Technology",
    db: {
        schoolYears: ["A.Y. 2024-2025", "A.Y. 2025-2026", "A.Y. 2026-2027"],
        rooms: ["Room 201", "Room 202", "Lab A", "Lab B", "Audio Visual Room"],
        buildings: ["New Building", "Old Building"],
        programs: {
            "Information Technology": {
                profs: ["Dr. Evelyn Macaraig", "Ms. Nhicole", "Prof. Ricardo Dela Cruz"],
                sections: ["BSIT 3-1", "BSIT 3-2", "BSIT 4-1"],
                subjects: [
                    { name: "Cloud Computing", units: 3 },
                    { name: "Cybersecurity", units: 3 },
                    { name: "Database Admin", units: 3 }
                ]
            },
            "Hospitality Management": {
                profs: ["Chef Marco Pierre", "Chef Linda Gomez"],
                sections: ["BSHM 1-1", "BSHM 2-2"],
                subjects: [
                    { name: "Kitchen Operations", units: 3 },
                    { name: "Front Office Mgmt", units: 3 }
                ]
            },
            "Computer Engineering": {
                profs: ["Engr. Antonio Santos", "Engr. Sherwin Z."],
                sections: ["BSCpE 1-1", "BSCpE 3-1"],
                subjects: [
                    { name: "Logic Circuits", units: 3 },
                    { name: "Embedded Systems", units: 3 }
                ]
            }
        },
        loads: [],
        noClassDays: {}
    }
};

const Users = { "aide_pq": "aide123", "head_pq": "head123" };
const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TimeStarts = [
    "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM"
];
const TimeEndLimit = "10:00 PM";
const loginBackgrounds = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'];
let currentLoginBackground = 0;

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

function getTimeRange(start, units) {
    const startMinutes = parseTimeStr(start);
    const endMinutes = startMinutes + units * 60;
    return `${start} - ${formatTime(endMinutes)}`;
}

function parseTimeRange(range) {
    const [start, end] = range.split(' - ');
    return { start: parseTimeStr(start), end: parseTimeStr(end) };
}

function rangesOverlap(a, b) {
    return a.start < b.end && b.start < a.end;
}

function syncStateFromStorage() {
    const savedData = localStorage.getItem('schedulerData');
    if (savedData) {
        let parsed = null;
        try {
            parsed = JSON.parse(savedData);
        } catch (e) {
            console.error('Failed to parse schedulerData from localStorage, ignoring. Error:', e);
        }
        if (parsed) State.db = parsed;
        State.db.schoolYears = State.db.schoolYears || ["A.Y. 2024-2025", "A.Y. 2025-2026", "A.Y. 2026-2027"];
        State.db.rooms = State.db.rooms || ["Room 201", "Room 202", "Lab A", "Lab B", "Audio Visual Room"];
        State.db.buildings = State.db.buildings || ["New Building", "Old Building"];
        State.db.programs = State.db.programs || {};
        State.db.loads = State.db.loads || [];
        State.db.noClassDays = State.db.noClassDays || {};
        for (const progName in State.db.programs) {
            const prog = State.db.programs[progName];
            prog.profs = prog.profs || [];
            prog.sections = prog.sections || [];
            prog.subjects = prog.subjects || [];
            if (prog.subjects.length > 0 && typeof prog.subjects[0] === 'string') {
                prog.subjects = prog.subjects.map(name => ({ name, units: 3 }));
            }
        }
    }
    State.activeProgram = localStorage.getItem('schedulerActiveProgram') || State.activeProgram;
}

// Subject semester filter state (All / First Semester / Second Semester / Summer Term)
State.subjectSemesterFilter = 'All';

function setSubjectSemesterFilter(val) {
    State.subjectSemesterFilter = val;
    ['All','First Semester','Second Semester','Summer Term'].forEach(v => {
        const id = v === 'All' ? 'sem-all' : (v === 'First Semester' ? 'sem-first' : (v === 'Second Semester' ? 'sem-second' : 'sem-summer'));
        const el = document.getElementById(id);
        if (el) {
            if (v === val) el.classList.add('bg-red-700','text-white');
            else el.classList.remove('bg-red-700','text-white');
        }
    });
    refreshManagementLists();
}

function setLoginBackground(index) {
    const overlay = document.getElementById('login-overlay');
    const pattern = document.getElementById('login-bg-pattern');
    if (!overlay || !pattern) return;
    const url = loginBackgrounds[index];
    overlay.style.backgroundImage = `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.85)), url('${url}')`;
    overlay.style.backgroundPosition = 'center';
    overlay.style.backgroundSize = 'cover';
    pattern.style.backgroundImage = `url('${url}')`;
    pattern.style.backgroundRepeat = 'no-repeat';
    pattern.style.backgroundPosition = 'center';
    pattern.style.backgroundSize = 'cover';
}

function cycleLoginBackground() {
    currentLoginBackground = (currentLoginBackground + 1) % loginBackgrounds.length;
    setLoginBackground(currentLoginBackground);
}

function initLoginBackgroundLoop() {
    setLoginBackground(currentLoginBackground);
    setInterval(cycleLoginBackground, 7000);
}

function showApp() {
    document.getElementById('login-overlay')?.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');
    document.getElementById('display-role')?.innerText = State.currentUser || 'Academic Team';
    initUI();
}

function showLogin() {
    document.getElementById('login-overlay')?.classList.remove('hidden');
    document.getElementById('app')?.classList.add('hidden');
}

function restoreSession() {
    syncStateFromStorage();
    const savedRole = localStorage.getItem('schedulerUserRole');
    if (localStorage.getItem('schedulerLoggedIn') === 'true' && savedRole) {
        State.currentUser = savedRole;
        showApp();
    } else {
        showLogin();
    }
}

function attemptLogin() {
    const u = document.getElementById('login-user')?.value;
    const p = document.getElementById('login-pass')?.value;
    const err = document.getElementById('login-error');
    if (Users[u] && Users[u] === p) {
        State.currentUser = u === 'head_pq' ? 'Academic Head' : 'Academic Aide';
        localStorage.setItem('schedulerLoggedIn', 'true');
        localStorage.setItem('schedulerUserRole', State.currentUser);
        showApp();
        return;
    }
    err?.classList.remove('hidden');
}

function handleLogout() {
    localStorage.removeItem('schedulerLoggedIn');
    localStorage.removeItem('schedulerUserRole');
    location.reload();
}

function initUI() {
    document.getElementById('current-date')?.innerText = new Date().toDateString();
    renderSidebarPrograms();
    document.getElementById('header-prog-display')?.innerText = State.activeProgram;
    renderSYDropdown();
    const page = document.body.dataset.page;
    if (page === 'dashboard') updateDashboardCards();
    if (page === 'management') refreshManagementLists();
    if (page === 'loading') renderLoadTable();
    if (page === 'sections') { updateSectionDropdowns(); renderTimetable(); }
}

function renderSidebarPrograms() {
    const progNav = document.getElementById('sidebar-programs');
    if (!progNav) return;
    progNav.innerHTML = Object.keys(State.db.programs).map(p => `
        <button onclick="setProgram('${p}')" class="w-full text-left p-3 rounded-lg text-xs hover:bg-white/10 transition-all ${p === State.activeProgram ? 'bg-yellow-500 text-red-900 font-bold' : 'text-gray-100'}">
            ${p}
        </button>
    `).join('');
    highlightActiveNav();
}

function highlightActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active-nav'));
    const active = document.querySelector(`.sidebar-item[data-page='${page}']`);
    active?.classList.add('active-nav');
}

function updateDashboardCards() {
    const prog = State.db.programs[State.activeProgram] || { profs: [], sections: [], subjects: [] };
    document.getElementById('dash-prof-count')?.innerText = prog.profs.length;
    document.getElementById('dash-prog-count')?.innerText = Object.keys(State.db.programs).length;
    document.getElementById('dash-load-count')?.innerText = State.db.loads.filter(l => l.program === State.activeProgram).length;
    document.getElementById('dash-conflict-count')?.innerText = State.db.loads.filter(l => l.program === State.activeProgram && l.conflict).length || 0;
}

function renderSYDropdown() {
    const sel = document.getElementById('sy-selector');
    if (!sel) return;
    const currentVal = sel.value || "A.Y. 2025-2026";
    sel.innerHTML = State.db.schoolYears.map(sy => `
        <option ${sy === currentVal ? 'selected' : ''}>${sy}</option>
    `).join('');
}

function openSYModal() {
    const container = document.getElementById('sy-list-container');
    if (!container) return;
    container.innerHTML = State.db.schoolYears.map(sy => `
        <div class="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-xs font-bold text-gray-600">
            <span>${sy}</span>
            <i data-lucide="check-circle-2" class="w-3 h-3 text-emerald-500"></i>
        </div>
    `).join('');
    document.getElementById('modal-sy')?.classList.remove('hidden');
    lucide.createIcons();
}

function addSY() {
    const input = document.getElementById('new-sy-input');
    const newVal = input?.value.trim();
    if (newVal && !State.db.schoolYears.includes(newVal)) {
        State.db.schoolYears.push(newVal);
        State.db.schoolYears.sort();
        input.value = "";
        renderSYDropdown();
        openSYModal();
        localStorage.setItem('schedulerData', JSON.stringify(State.db));
    } else {
        alert("Please enter a unique academic year.");
    }
}

function setProgram(p) {
    State.activeProgram = p;
    localStorage.setItem('schedulerActiveProgram', p);
    initUI();
}

function refreshTimeSlots() {
    const day = document.getElementById('ld-day')?.value;
    const prof = document.getElementById('ld-prof')?.value;
    const sec = document.getElementById('ld-sec')?.value;
    const room = document.getElementById('ld-room')?.value;
    const sub = document.getElementById('ld-sub');
    const units = Number(sub?.selectedOptions[0]?.dataset?.units || 3);
    const select = document.getElementById('ld-time');
    if (!select || !day) return;
    select.innerHTML = TimeStarts.map(start => {
        const range = getTimeRange(start, units);
        const target = parseTimeRange(range);
        const conflict = State.db.loads.some(l => {
            if (l.day !== day) return false;
            if (l.room === room) return rangesOverlap(target, parseTimeRange(l.time));
            if (l.prof === prof || l.sec === sec) return rangesOverlap(target, parseTimeRange(l.time));
            return false;
        });
        return `<option value="${range}" class="${conflict ? 'strikethrough-slot' : ''}" ${conflict ? 'disabled' : ''}>${range} ${conflict ? '(CONFLICT)' : ''}</option>`;
    }).join('');
}

let currentResType = "";
function openResourceModal(type) {
    currentResType = type;
    document.getElementById('res-modal-title')?.innerText = `Add New ${type}`;
    // show subject-specific extra fields when adding a Subject
    if (type === 'Subject') {
        const extra = document.getElementById('res-subject-extra');
        if (extra) extra.style.display = 'block';
    } else {
        const extra = document.getElementById('res-subject-extra');
        if (extra) extra.style.display = 'none';
    }
    document.getElementById('modal-resource')?.classList.remove('hidden');
}

function saveResource() {
    const val = document.getElementById('res-input')?.value.trim();
    if (!val) return;
    const units = Number(document.getElementById('res-units')?.value || 3);
    if (currentResType === 'Program') {
        State.db.programs[val] = { profs: [], sections: [], subjects: [] };
    } else if (currentResType === 'Room') {
        State.db.rooms.push(val);
    } else {
        const prog = State.db.programs[State.activeProgram];
        if (!prog) return;
        if (currentResType === 'Professor') prog.profs.push(val);
        if (currentResType === 'Subject') {
            const sem = document.getElementById('res-semester')?.value || 'First Semester';
            prog.subjects.push({ name: val, units: units || 3, semester: sem });
        }
        if (currentResType === 'Section') prog.sections.push(val);
    }
    document.getElementById('res-input').value = "";
    document.getElementById('res-units').value = "3";
    closeModal('modal-resource');
    localStorage.setItem('schedulerData', JSON.stringify(State.db));
    initUI();
}

function refreshManagementLists() {
    const p = State.db.programs[State.activeProgram] || { profs: [], subjects: [], sections: [] };
    document.getElementById('current-prog-label')?.innerText = State.activeProgram;
    const getLabel = item => typeof item === 'string' ? item : item.name;
    const renderItem = (item, type) => {
        const label = getLabel(item);
        return `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white transition-all group">
                <span class="text-[11px] font-bold text-gray-700">${label}</span>
                <button onclick="deleteResource('${label}', '${type}')" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    };
    document.getElementById('list-profs')?.innerHTML = p.profs.map(x => renderItem(x, 'Professor')).join('') || empty();
    // Filter subjects by selected semester
    const subjFilter = State.subjectSemesterFilter || 'All';
    const subjectsToShow = (p.subjects || []).filter(s => {
        const sem = (typeof s === 'string') ? 'First Semester' : (s.semester || 'First Semester');
        return subjFilter === 'All' ? true : sem === subjFilter;
    });
    document.getElementById('list-subjects')?.innerHTML = subjectsToShow.map(x => renderItem(x, 'Subject')).join('') || empty();
    document.getElementById('list-sections')?.innerHTML = p.sections.map(x => renderItem(x, 'Section')).join('') || empty();
    lucide.createIcons();
}

function deleteResource(name, type) {
    if (!confirm(`Remove ${name}?`)) return;
    const prog = State.db.programs[State.activeProgram];
    if (!prog) return;
    if (type === 'Professor') prog.profs = prog.profs.filter(x => x !== name);
    if (type === 'Subject') prog.subjects = prog.subjects.filter(x => (typeof x === 'string' ? x : x.name) !== name);
    if (type === 'Section') prog.sections = prog.sections.filter(x => x !== name);
    localStorage.setItem('schedulerData', JSON.stringify(State.db));
    initUI();
}

function empty() {
    return `<div class="text-center py-8 text-gray-300 text-[10px] font-bold italic">LIST EMPTY</div>`;
}

function openLoadModal() {
    const p = State.db.programs[State.activeProgram];
    if (!p) return alert("No active program selected!");
    if (!p.profs.length || !p.sections.length) return alert("Add faculty and sections first!");
    document.getElementById('ld-prof')?.insertAdjacentHTML('afterbegin', p.profs.map(x => `<option>${x}</option>`).join(''));
    const profSelect = document.getElementById('ld-prof');
    if (profSelect) profSelect.innerHTML = p.profs.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-sub')?.innerHTML = p.subjects.map(s => `<option value="${s.name}" data-units="${s.units}">${s.name} (${s.units}u)</option>`).join('');
    document.getElementById('ld-sec')?.innerHTML = p.sections.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-room')?.innerHTML = State.db.rooms.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-building')?.innerHTML = State.db.buildings.map(x => `<option>${x}</option>`).join('');
    document.getElementById('ld-day')?.innerHTML = Days.map(x => `<option>${x}</option>`).join('');
    refreshTimeSlots();
    document.getElementById('modal-load')?.classList.remove('hidden');
    lucide.createIcons();
}

function saveLoad() {
    const time = document.getElementById('ld-time')?.value;
    const sub = document.getElementById('ld-sub')?.value;
    const units = Number(document.getElementById('ld-sub')?.selectedOptions[0]?.dataset?.units || 3);
    const day = document.getElementById('ld-day')?.value;
    if (!time || !sub || !day) return alert("Please ensure all fields (including Subject, Time, and Day) are filled.");
    const load = {
        id: Date.now(),
        prof: document.getElementById('ld-prof')?.value,
        sub: sub,
        units: units,
        sec: document.getElementById('ld-sec')?.value,
        room: document.getElementById('ld-room')?.value,
        building: document.getElementById('ld-building')?.value || "Main Building",
        day: day,
        time: time,
        sy: document.getElementById('sy-selector')?.value,
        program: State.activeProgram
    };
    State.db.loads.push(load);
    localStorage.setItem('schedulerData', JSON.stringify(State.db));
    closeModal('modal-load');
    renderLoadTable();
}

function deleteLoad(id) {
    State.db.loads = State.db.loads.filter(l => l.id !== id);
    localStorage.setItem('schedulerData', JSON.stringify(State.db));
    renderLoadTable();
}

function renderLoadTable() {
    const table = document.getElementById('load-table');
    if (!table) return;
    const data = State.db.loads.filter(l => l.program === State.activeProgram);
    table.innerHTML = data.map(l => `
        <tr class="border-b hover:bg-gray-50 transition-colors">
            <td class="p-4 font-bold text-red-900">${l.prof}</td>
            <td class="p-4 text-xs font-semibold">${l.sub} (${l.units || 3}u)</td>
            <td class="p-4"><span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-[10px] font-bold">${l.sec}</span></td>
            <td class="p-4 text-[10px] font-medium text-gray-500">${l.day}<br><span class="text-gray-900 font-bold">${l.time}</span><br><span class="text-[10px] font-semibold text-gray-700">${l.building}</span></td>
            <td class="p-4 text-right"><button onclick="deleteLoad(${l.id})" class="text-red-500 hover:underline text-[10px] font-bold">CANCEL</button></td>
        </tr>
    `).join('') || `<tr><td colspan="5" class="p-10 text-center text-gray-300 italic">No assignments found for this program.</td></tr>`;
}

function updateSectionDropdowns() {
    const sel = document.getElementById('view-section-select');
    if (!sel) return;
    const p = State.db.programs[State.activeProgram] || { sections: [] };
    sel.innerHTML = p.sections.map(s => `<option>${s}</option>`).join('') || '<option disabled>No Sections</option>';
}

function toggleNoClass(day) {
    const sec = document.getElementById('view-section-select')?.value;
    if (!sec) return;
    if (!State.db.noClassDays[sec]) State.db.noClassDays[sec] = [];
    const idx = State.db.noClassDays[sec].indexOf(day);
    if (idx > -1) State.db.noClassDays[sec].splice(idx, 1);
    else State.db.noClassDays[sec].push(day);
    renderTimetable();
}

function renderTimetable() {
    const sec = document.getElementById('view-section-select')?.value;
    const container = document.getElementById('timetable-container');
    if (!container) return;
    if (!sec) return container.innerHTML = "";
    container.innerHTML = Days.map(day => {
        const dayLoads = State.db.loads
            .filter(l => l.sec === sec && l.day === day)
            .sort((a, b) => parseTimeRange(a.time).start - parseTimeRange(b.time).start);
        const isNoClass = State.db.noClassDays[sec]?.includes(day);
        let dayHtml = `
            <div class="space-y-3">
                <div class="pup-maroon text-white p-2 rounded-xl text-[10px] font-bold text-center uppercase tracking-tighter">${day}</div>
                <button onclick="toggleNoClass('${day}')" class="w-full p-2 border border-dashed rounded-lg text-[8px] text-gray-400 hover:bg-white transition uppercase font-bold">${isNoClass ? 'Restore Day' : 'Mark Vacant'}</button>`;
        if (isNoClass) {
            dayHtml += `<div class="h-64 flex items-center justify-center text-red-200 font-bold text-[10px] bg-red-50 rounded-2xl border border-red-100 uppercase tracking-widest" style="writing-mode: vertical-rl">No Classes Scheduled</div>`;
        } else if (dayLoads.length === 0) {
            dayHtml += `<div class="h-32 flex items-center justify-center text-gray-300 text-[9px] font-bold italic bg-white rounded-2xl border border-dashed border-gray-200">VACANT</div>`;
        } else {
            dayLoads.forEach((load, idx) => {
                dayHtml += `
                    <div class="bg-white p-3 rounded-xl shadow-sm border-l-4 border-yellow-500 animate-in zoom-in-95 duration-300">
                        <p class="text-[8px] font-bold text-red-800 leading-tight mb-1">${load.time}</p>
                        <p class="text-[10px] font-bold text-gray-900 leading-tight mb-1">${load.sub} (${load.units || 3}u)</p>
                        <p class="text-[9px] text-gray-400 italic">${load.prof} (${load.room} - ${load.building})</p>
                    </div>`;
                const nextLoad = dayLoads[idx + 1];
                if (nextLoad) {
                    const currentEnd = parseTimeRange(load.time).end;
                    const nextStart = parseTimeRange(nextLoad.time).start;
                    if (nextStart > currentEnd) {
                        dayHtml += `<div class="p-2 rounded-xl text-center text-[8px] font-bold text-gray-400 border border-gray-100 uppercase bg-gray-50/50">${formatTime(currentEnd)} - ${formatTime(nextStart)}<br>Gap</div>`;
                    }
                }
            });
        }
        dayHtml += `</div>`;
        return dayHtml;
    }).join('');
    lucide.createIcons();
}

function closeModal(id) {
    document.getElementById(id)?.classList.add('hidden');
    // ensure subject extra hidden when modal closed
    const extra = document.getElementById('res-subject-extra');
    if (extra) extra.style.display = 'none';
}

function downloadWorkload() {
    const data = State.db.loads.filter(l => l.program === State.activeProgram);
    if (data.length === 0) return alert("No assignments to export.");
    let html = `<html><head><meta charset="UTF-8"><title>Workload - ${State.activeProgram}</title><style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #333; padding: 10px; text-align: left; }
        th { background-color: #800000; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        h2 { color: #800000; }
    </style></head><body>
    <h2>Faculty Workload: ${State.activeProgram}</h2>
    <table><tr><th>Professor</th><th>Subject</th><th>Section</th><th>Day</th><th>Time</th><th>Room</th><th>Building</th><th>School Year</th></tr>`;
    data.sort((a, b) => {
        if (a.day !== b.day) return Days.indexOf(a.day) - Days.indexOf(b.day);
        return parseTimeRange(a.time).start - parseTimeRange(b.time).start;
    }).forEach(load => {
        html += `<tr><td>${load.prof}</td><td>${load.sub} (${load.units || 3}u)</td><td>${load.sec}</td><td>${load.day}</td><td>${load.time}</td><td>${load.room}</td><td>${load.building}</td><td>${load.sy}</td></tr>`;
    });
    html += `</table></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Workload_${State.activeProgram}_${new Date().getTime()}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function exportSectionTimetable() {
    const sec = document.getElementById('view-section-select')?.value;
    if (!sec) return alert("Please select a section.");
    const data = State.db.loads.filter(l => l.sec === sec);
    if (data.length === 0) return alert("No classes scheduled for this section.");
    let html = `<html><head><meta charset="UTF-8"><title>Timetable - ${sec}</title><style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #333; padding: 10px; text-align: left; }
        th { background-color: #800000; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
    </style></head><body>
    <h2>Section Timetable: ${sec}</h2>
    <table><tr><th>Day</th><th>Time</th><th>Subject</th><th>Professor</th><th>Room</th><th>Building</th></tr>`;
    Days.forEach(day => {
        const dayLoads = data.filter(l => l.day === day).sort((a, b) => parseTimeRange(a.time).start - parseTimeRange(b.time).start);
        dayLoads.forEach(load => {
            html += `<tr><td>${load.day}</td><td>${load.time}</td><td>${load.sub} (${load.units || 3}u)</td><td>${load.prof}</td><td>${load.room}</td><td>${load.building}</td></tr>`;
        });
    });
    html += `</table></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timetable_${sec}_${new Date().getTime()}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function markSelectedNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active-nav'));
    const active = document.querySelector(`.sidebar-item[data-page="${page}"]`);
    if (active) active.classList.add('active-nav');
}

function registerPageInteractions() {
    document.querySelectorAll('.sidebar-item').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active-nav'));
            button.classList.add('active-nav');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoginBackgroundLoop();
    restoreSession();
    document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.closeModal)));
    markSelectedNav();
    registerPageInteractions();
    // initialize subject semester filter UI
    if (typeof setSubjectSemesterFilter === 'function') setSubjectSemesterFilter(State.subjectSemesterFilter || 'All');
});
