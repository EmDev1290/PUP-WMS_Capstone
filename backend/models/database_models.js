/**
 * TIER 4: DATA ACCESS & STORAGE CONFIGURATIONS
 * Manages collections, dataset states, and client mutations.
 */

export const facultyRegistry = [
    {
        id: "prof-jefferson",
        name: "Sir Jefferson",
        baseDesignation: "Instructor I",
        program: "Information Technology",
        employmentType: "Regular",
        active: true,
        educationalAttainment: { baccalaureate: "BS IT", masters: "MS CS", doctorate: "", postBaccalaureate: "" },
        licenseNumber: "LIC-9134",
        specialization: "Systems Analysis",
        nationalCertificate: "NC II",
        courseHandle: { genEd: "Math", coreSubject: "IT102", professionalSubject: "Software Eng", technicalSubject: "Programming" },
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
        educationalAttainment: { baccalaureate: "BS CS", masters: "MEd", doctorate: "PhD Educational Leadership", postBaccalaureate: "" },
        licenseNumber: "LIC-7201",
        specialization: "Database Systems",
        nationalCertificate: "NC III",
        courseHandle: { genEd: "English", coreSubject: "DB Systems", professionalSubject: "Database Design", technicalSubject: "SQL" },
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
        educationalAttainment: { baccalaureate: "BSE COE", masters: "MEng Electronics", doctorate: "", postBaccalaureate: "" },
        licenseNumber: "LIC-4485",
        specialization: "Microprocessors",
        nationalCertificate: "NC IV",
        courseHandle: { genEd: "Physics", coreSubject: "Microprocessors", professionalSubject: "Embedded Systems", technicalSubject: "Circuits" },
        research: { production: "1", presentation: "1", publication: "0", citation: "2" },
        extension: "Technical workshops",
        natureOfAppointment: "Full-time",
        remarks: "Consistent instructor"
    }
];

export const designationOptions = [
    "None (Regular Faculty Line)",
    "Director / Head of Academic Operations",
    "Program Chairperson - Information Technology (IT)",
    "Program Chairperson - Hospitality Management (HM)",
    "Program Chairperson - Computer Engineering (COE)",
    "Laboratory Custodian Coordinator",
    "Area Sector Coordinator"
];

export const State = {
    activeProgram: 'Information Technology',
    facultyFilter: 'all',
    db: {
        schoolYears: ['A.Y. 2024-2025', 'A.Y. 2025-2026', 'A.Y. 2026-2027'],
        rooms: ['Room A101', 'Room B202', 'Lab A', 'Lab B'],
        buildings: ['Main Building', 'Old Building', 'Annex Building'],
        programs: {
            'Information Technology': {
                profs: ['Sir Jefferson', 'Dr. Maria Dela Cruz'],
                sections: ['BSIT 1-1', 'BSIT 2-1', 'BSIT 3-1'],
                subjects: {
                    "1st Year": {
                        "1st Semester": [{ name: "IT101 - Introduction to Computing", units: 3 }],
                        "2nd Semester": [{ name: "IT102 - Computer Programming 1", units: 3 }]
                    },
                    "2nd Year": {
                        "1st Semester": [{ name: "IT201 - Data Structures", units: 3 }],
                        "Summer Term": [{ name: "IT-INT1 - Industry Practicum 1", units: 2 }]
                    }
                }
            },
            'Computer Engineering': {
                profs: ['Prof. Ricardo Santos'],
                sections: ['COE 3-1', 'COE 4-1'],
                subjects: {
                    "3rd Year": { "1st Semester": [{ name: "COE311 - Digital Design", units: 4 }] }
                }
            }
        },
        loads: [
            { id: 1, prof: 'Dr. Maria Dela Cruz', sub: 'IT311 - Database Systems', units: 3, loadType: 'Regular Load', sec: 'BSIT 2-1', room: 'Room A101', building: 'Main Building', day: 'Monday', time: '08:00 AM - 11:00 AM', sy: 'A.Y. 2024-2025', program: 'Information Technology' }
        ]
    }
};

export function persistToStorage() {
    localStorage.setItem('schedulerData', JSON.stringify(State.db));
}

export function initializeDatabaseState() {
    const data = localStorage.getItem('schedulerData');
    if (!data) return;
    try {
        const parsed = JSON.parse(data);
        State.db.loads = parsed.loads || State.db.loads;
        State.db.programs = parsed.programs || State.db.programs;
    } catch (e) {
        console.error("Database storage failed to reconcile initialization tokens.", e);
    }
}