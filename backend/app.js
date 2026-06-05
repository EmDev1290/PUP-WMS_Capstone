/**
 * CORE APPLICATION ENGINE (BOOTSTRAPPER)
 */
import { initializeDatabaseState } from './models/database_models.py';
import { generateSystemTimeSlots } from './services/system_services.py';

export function runApplicationBootstrapPipeline() {
    initializeDatabaseState();
    window.SystemTimeIntervals = generateSystemTimeSlots('07:00 AM', '09:00 PM', 30);
    
    // Dispatch event to inform the frontend HTML files that the backend datasets are initialized
    document.dispatchEvent(new CustomEvent('AppEngineCoreReady'));
}

// Bind initialization to execution lifecycle
document.addEventListener('DOMContentLoaded', runApplicationBootstrapPipeline);