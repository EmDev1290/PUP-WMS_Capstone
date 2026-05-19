<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle different API actions
switch ($action) {
    case 'login':
        handleLogin($conn, $method);
        break;
    
    case 'getPrograms':
        getPrograms($conn, $method);
        break;
    
    case 'getProfessors':
        getProfessors($conn, $method);
        break;
    
    case 'getSubjects':
        getSubjects($conn, $method);
        break;
    
    case 'getSections':
        getSections($conn, $method);
        break;
    
    case 'getRooms':
        getRooms($conn, $method);
        break;
    
    case 'getLoads':
        getLoads($conn, $method);
        break;
    
    case 'saveLoad':
        saveLoad($conn, $method);
        break;
    
    case 'deleteLoad':
        deleteLoad($conn, $method);
        break;
    
    case 'addResource':
        addResource($conn, $method);
        break;
    
    default:
        echo json_encode(['error' => 'Unknown action']);
        break;
}

// --- AUTHENTICATION ---
function handleLogin($conn, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    // Hardcoded users for now - replace with database query if needed
    $validUsers = [
        'aide_pq' => 'aide123',
        'head_pq' => 'head123'
    ];
    
    if (isset($validUsers[$username]) && $validUsers[$username] === $password) {
        $role = $username === 'head_pq' ? 'Academic Head' : 'Academic Aide';
        echo json_encode([
            'success' => true,
            'role' => $role,
            'username' => $username
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}

// --- PROGRAMS ---
function getPrograms($conn, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $result = $conn->query("SELECT * FROM programs");
    $programs = [];
    
    while ($row = $result->fetch_assoc()) {
        $programId = $row['id'];
        $programs[$row['name']] = [
            'id' => $programId,
            'profs' => getProgramProfessors($conn, $programId),
            'subjects' => getProgramSubjects($conn, $programId),
            'sections' => getProgramSections($conn, $programId)
        ];
    }
    
    echo json_encode($programs);
}

function getProgramProfessors($conn, $programId) {
    $result = $conn->query("SELECT DISTINCT p.* FROM professors p 
                           JOIN loads l ON p.id = l.professor_id 
                           WHERE l.program_id = $programId");
    $profs = [];
    while ($row = $result->fetch_assoc()) {
        $profs[] = [
            'name' => $row['name'],
            'type' => $row['faculty_type']
        ];
    }
    return $profs;
}

function getProgramSubjects($conn, $programId) {
    $result = $conn->query("SELECT * FROM subjects WHERE program_id = $programId");
    $subjects = [];
    while ($row = $result->fetch_assoc()) {
        $subjects[] = [
            'name' => $row['name'],
            'units' => $row['units'],
            'semester' => $row['semester']
        ];
    }
    return $subjects;
}

function getProgramSections($conn, $programId) {
    $result = $conn->query("SELECT DISTINCT section FROM loads WHERE program_id = $programId");
    $sections = [];
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row['section'];
    }
    return $sections;
}

// --- PROFESSORS ---
function getProfessors($conn, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $result = $conn->query("SELECT * FROM professors");
    $profs = [];
    
    while ($row = $result->fetch_assoc()) {
        $profs[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'type' => $row['faculty_type']
        ];
    }
    
    echo json_encode($profs);
}

// --- SUBJECTS ---
function getSubjects($conn, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $programId = $_GET['program_id'] ?? '';
    $query = "SELECT * FROM subjects";
    if ($programId) {
        $query .= " WHERE program_id = $programId";
    }
    
    $result = $conn->query($query);
    $subjects = [];
    
    while ($row = $result->fetch_assoc()) {
        $subjects[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'units' => $row['units'],
            'semester' => $row['semester'],
            'program_id' => $row['program_id']
        ];
    }
    
    echo json_encode($subjects);
}

// --- SECTIONS ---
function getSections($conn, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $result = $conn->query("SELECT DISTINCT section FROM loads ORDER BY section");
    $sections = [];
    
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row['section'];
    }
    
    echo json_encode($sections);
}

// --- ROOMS ---
function getRooms($conn, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $result = $conn->query("SELECT * FROM rooms");
    $rooms = [];
    
    while ($row = $result->fetch_assoc()) {
        $rooms[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'building' => $row['building']
        ];
    }
    
    echo json_encode($rooms);
}

// --- LOADS (Faculty Assignments) ---
function getLoads($conn, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $programId = $_GET['program_id'] ?? '';
    $query = "SELECT l.*, p.name as professor_name, s.name as subject_name FROM loads l 
              JOIN professors p ON l.professor_id = p.id 
              JOIN subjects s ON l.subject_id = s.id";
    
    if ($programId) {
        $query .= " WHERE l.program_id = $programId";
    }
    
    $result = $conn->query($query);
    $loads = [];
    
    while ($row = $result->fetch_assoc()) {
        $loads[] = [
            'id' => $row['id'],
            'program_id' => $row['program_id'],
            'professor_id' => $row['professor_id'],
            'professor_name' => $row['professor_name'],
            'subject_id' => $row['subject_id'],
            'subject_name' => $row['subject_name'],
            'section' => $row['section'],
            'schedule' => $row['schedule'],
            'units' => $row['units'],
            'room' => $row['room']
        ];
    }
    
    echo json_encode($loads);
}

function saveLoad($conn, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $programId = $input['program_id'] ?? '';
    $professorId = $input['professor_id'] ?? '';
    $subjectId = $input['subject_id'] ?? '';
    $section = $input['section'] ?? '';
    $schedule = $input['schedule'] ?? '';
    $units = $input['units'] ?? 3;
    $room = $input['room'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO loads (program_id, professor_id, subject_id, section, schedule, units, room) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiissii", $programId, $professorId, $subjectId, $section, $schedule, $units, $room);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => $stmt->error]);
    }
}

function deleteLoad($conn, $method) {
    if ($method !== 'DELETE') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $loadId = $_GET['id'] ?? '';
    
    $stmt = $conn->prepare("DELETE FROM loads WHERE id = ?");
    $stmt->bind_param("i", $loadId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => $stmt->error]);
    }
}

// --- RESOURCES ---
function addResource($conn, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $resourceType = $input['type'] ?? '';
    $name = $input['name'] ?? '';
    $units = $input['units'] ?? null;
    $semester = $input['semester'] ?? null;
    $facultyType = $input['faculty_type'] ?? null;
    $programId = $input['program_id'] ?? '';
    
    if ($resourceType === 'Subject') {
        $stmt = $conn->prepare("INSERT INTO subjects (program_id, name, units, semester) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isii", $programId, $name, $units, $semester);
    } elseif ($resourceType === 'Program') {
        $stmt = $conn->prepare("INSERT INTO programs (name) VALUES (?)");
        $stmt->bind_param("s", $name);
    } elseif ($resourceType === 'Professor') {
        $stmt = $conn->prepare("INSERT INTO professors (name, faculty_type) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $facultyType);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Unknown resource type']);
        return;
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => $stmt->error]);
    }
}

?>
