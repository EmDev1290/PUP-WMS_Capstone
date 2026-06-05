/**
 * TIER 2: API ROUTING CONTROLLER INTERFACES
 * Maps user operations to data mutations and schema services.
 */

import { State, facultyRegistry, persistToStorage } from '../models/database_models.py';
import { evaluateLoadCapacity } from '../services/system_services.py';

export function handleProfileSubmission(formData) {
    if (!formData.name) return { success: false, error: "Missing identity token." };
    
    const id = `prof-${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const cleanProfile = {
        id,
        name: formData.name,
        baseDesignation: formData.designation || 'Instructor I',
        program: formData.program || State.activeProgram,
        employmentType: formData.employment || 'Regular',
        active: true,
        educationalAttainment: { baccalaureate: formData.bacc || '', masters: formData.master || '', doctorate: formData.doc || '', postBaccalaureate: '' },
        licenseNumber: formData.license || '',
        specialization: formData.specialization || '',
        nationalCertificate: formData.nc || '',
        courseHandle: { genEd: '', coreSubject: '', professionalSubject: '', technicalSubject: '' },
        research: { production: '0', presentation: '0', publication: '0', citation: '0' },
        extension: '', natureOfAppointment: 'Full-time', remarks: ''
    };
    
    facultyRegistry.push(cleanProfile);
    
    if (!State.db.programs[cleanProfile.program]) {
        State.db.programs[cleanProfile.program] = { profs: [], sections: [], subjects: {} };
    }
    State.db.programs[cleanProfile.program].profs.push(cleanProfile.name);
    
    persistToStorage();
    return { success: true, name: formData.name };
}

export function handleLoadAssignment(loadObject) {
    const check = evaluateLoadCapacity(loadObject.prof, loadObject.units, loadObject.loadType);
    if (!check.canAssign) {
        return { success: false, reason: "Global Max Unit Ceiling Limit Overload (45 hours maximum rule violated)." };
    }
    
    State.db.loads.push(loadObject);
    persistToStorage();
    return { success: true };
}