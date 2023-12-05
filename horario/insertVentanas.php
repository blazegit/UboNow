<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start the session
session_start();
$userID = $_SESSION['user_id'];

// Receive the data from the AJAX request
$responseData = $_POST['responseData'];

// Translation array for days of the week
$daysOfWeek = array(
    "L" => "Lunes",
    "M" => "Martes",
    "X" => "Miercoles",
    "J" => "Jueves",
    "V" => "Viernes",
);

// Prepare and bind the SQL statement
$sql = $conn->prepare("INSERT INTO ventanaalmuerzo (UserID, DiaReserva, HoraInicio, HoraFinal) VALUES (?, ?, ?, ?) 
                      ON DUPLICATE KEY UPDATE HoraInicio = VALUES(HoraInicio), HoraFinal = VALUES(HoraFinal)");

// Bind parameters to the prepared statement
$sql->bind_param("isss", $userID, $translatedDay, $startTime, $finishTime);

// Execute the statement in a loop
foreach ($responseData as $key => $value) {
    // Extract the day, start time, and finish time from the value
    if (preg_match('/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/', $value, $matches)) {
        $startTime = $matches[1];
        $finishTime = $matches[2];

        
        $defaultDay = 'DefaultDay';
        
        // Set the translated day to the default day or use the specified translation
        $translatedDay = isset($daysOfWeek[$key]) ? $daysOfWeek[$key] : $defaultDay;

        // Execute the prepared statement
        $sql->execute();

        // Check for errors
        if ($sql->errno) {
            echo "Error: " . $sql->error;
        } else {
            echo "Data inserted/updated successfully";
        }
    } else {
        echo "Error: Invalid format for value";
    }
}

// Close the prepared statement
$sql->close();