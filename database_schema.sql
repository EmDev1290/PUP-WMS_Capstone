USE pupwms2_db;

-- Create pupwms2_db database tables

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professors/Faculty table
CREATE TABLE IF NOT EXISTS professors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    faculty_type ENUM('Designee', 'Regular', 'Part-Time') DEFAULT 'Regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    capacity INT DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects/Courses table
CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    units INT DEFAULT 3,
    semester ENUM('First Semester', 'Second Semester', 'Summer Term') DEFAULT 'First Semester',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Faculty Loads/Assignments table
CREATE TABLE IF NOT EXISTS loads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    professor_id INT NOT NULL,
    subject_id INT NOT NULL,
    section VARCHAR(50) NOT NULL,
    schedule VARCHAR(200),
    units INT DEFAULT 3,
    room VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- School Years table
CREATE TABLE IF NOT EXISTS school_years (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- No Class Days table
CREATE TABLE IF NOT EXISTS no_class_days (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_year_id INT NOT NULL,
    date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_year_id) REFERENCES school_years(id) ON DELETE CASCADE
);

-- Insert sample data for programs
INSERT INTO programs (name) VALUES 
('Information Technology'),
('Hospitality Management'),
('Computer Engineering');

-- Insert sample data for buildings
INSERT INTO buildings (name) VALUES 
('New Building'),
('Old Building');

-- Insert sample data for rooms
INSERT INTO rooms (name, building, capacity) VALUES 
('Room 201', 'New Building', 40),
('Room 202', 'New Building', 40),
('Lab A', 'New Building', 30),
('Lab B', 'Old Building', 30),
('Audio Visual Room', 'New Building', 50);

-- Insert sample data for professors
INSERT INTO professors (name, faculty_type) VALUES 
('Dr. Evelyn Macaraig', 'Regular'),
('Ms. Nhicole', 'Regular'),
('Prof. Ricardo Dela Cruz', 'Designee'),
('Chef Marco Pierre', 'Regular'),
('Chef Linda Gomez', 'Part-Time'),
('Engr. Antonio Santos', 'Regular'),
('Engr. Sherwin Z.', 'Designee');

-- Insert sample data for subjects
INSERT INTO subjects (program_id, name, units, semester) VALUES 
(1, 'Cloud Computing', 3, 'First Semester'),
(1, 'Cybersecurity', 3, 'Second Semester'),
(1, 'Database Admin', 3, 'First Semester'),
(2, 'Kitchen Operations', 3, 'First Semester'),
(2, 'Front Office Mgmt', 3, 'Second Semester'),
(3, 'Logic Circuits', 3, 'First Semester'),
(3, 'Embedded Systems', 3, 'Second Semester');

-- Insert sample data for school years
INSERT INTO school_years (year, is_active) VALUES 
('A.Y. 2024-2025', FALSE),
('A.Y. 2025-2026', TRUE),
('A.Y. 2026-2027', FALSE);
