/**
 * TIER 3: BUSINESS SERVICES LAYER
 * Implements institution constraints, unit thresholds, and structural text filters.
 */

import { State, facultyRegistry } from '../models/database_models.py';

export const GLOBAL_MAX_LOAD_CAP = 45;
export const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Strict 30-Minute Scheduler Interval Generator Engine
export function generateSystemTimeSlots(start = '07:00 AM', end = '09:00 PM', intervalMinutes = 30) {
    const slots = [];
    const convertToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    };
    
    let current = convertToMinutes(start);
    const stopTime = convertToMinutes(end);
    
    for (let t = current; t <= stopTime; t += intervalMinutes) {
        const period = t >= 720 ? 'PM' : 'AM';
        let h = Math.floor(t / 60);
        const m = t % 60;
        if (h === 0) h = 12;
        if (h > 12) h -= 12;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`);
    }
    return slots;
}

// Aligned Title Logic Handler
export function resolveFacultyTitleLabel(faculty) {
    if (!faculty) return 'PROFESSOR';
    const type = (faculty.employmentType || '').toUpperCase();
    const rank = (faculty.baseDesignation || '').toUpperCase();
    
    if (type.includes('PART-TIME') || type.includes('PARTTIME')) {
        return 'PROFESSOR';
    }
    
    if (rank.includes('UNIVERSITY PROFESSOR') || rank.includes('UNIV. PROF')) return 'UNIV. PROF';
    if (rank.includes('ASSOCIATE PROFESSOR') || rank.includes('ASSC. PROF')) return 'ASSC. PROF';
    if (rank.includes('ASSISTANT PROFESSOR') || rank.includes('ASST. PROF')) return 'ASST. PROF';
    if (rank.includes('PROFESSOR') || rank.includes('PROF')) return 'PROF';
    
    return 'INSTRUCTOR';
}

export function getCumulativeWorkloadHours(profName) {
    return State.db.loads
        .filter(item => item.prof === profName)
        .reduce((sum, item) => sum + (item.units || 0), 0);
}

export function evaluateLoadCapacity(profName, targetUnits, loadCategory) {
    const currentTotal = State.db.loads.filter(l => l.prof === profName).reduce((acc, curr) => acc + curr.units, 0);
    const wouldExceedProf = currentTotal + targetUnits > GLOBAL_MAX_LOAD_CAP;
    
    return {
        canAssign: !wouldExceedProf,
        wouldExceedProf,
        maxUnits: GLOBAL_MAX_LOAD_CAP
    };
}