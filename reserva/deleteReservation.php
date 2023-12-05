<?php

// Establish your database connection here
$servername = "";
$username = "";
$password = "";
$dbname = "";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the user is logged in
    if (isset($_SESSION['user_id'])) {
        // Get raw POST data
        $rawData = file_get_contents("php://input");

        // Check if data is empty
        if (empty($rawData)) {
            echo json_encode(['success' => false, 'error' => 'Empty request data']);
            exit;
        }

        // Decode JSON data
        $jsonData = json_decode($rawData, true);

        // Check if JSON decoding was successful
        if (json_last_error() != JSON_ERROR_NONE) {
            echo json_encode(['success' => false, 'error' => 'Failed to decode JSON data']);
            exit;
        }

        // Check if required keys are present
        if (!isset($jsonData['espacio']) || !isset($jsonData['time']) || !isset($jsonData['day'])) {
            echo json_encode(['success' => false, 'error' => 'Missing required keys in JSON data']);
            exit;
        }

        $espacioID = $jsonData['espacio'];
        $hour = $jsonData['time'];
        $day = $jsonData['day'];

        // Implement your logic to delete the reservation from the database
        $stmt = $conn->prepare("DELETE FROM reservas WHERE UserID = ? AND EspacioID = ? AND HoraReserva = ? AND FechaReserva = ?");
        $stmt->bind_param('iiss', $_SESSION['user_id'], $espacioID, $hour, $day);

        if ($stmt->execute()) {
            // Deletion successful
            echo json_encode(['success' => true]);
            exit;
        } else {
            // Deletion failed
            echo json_encode(['success' => false, 'error' => 'Failed to delete reservation']);
            exit;
        }
    } else {
        // User not logged in
        echo json_encode(['success' => false, 'error' => 'User not logged in']);
        exit;
    }
} else {
    // Invalid request method
    http_response_code(405);
    exit;
}
