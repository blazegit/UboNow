<?php
// Start the session
session_start();


$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve UserID from the session
$userID = $_SESSION['user_id'];

$sql = "SELECT HoraInicio, HoraFinal, DiaReserva FROM ventanaalmuerzo WHERE UserID = ?";

// Use a prepared statement to prevent SQL injection
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userID);

// Execute the statement
$stmt->execute();

// Get the result set
$result = $stmt->get_result();

// Check if the query was successful
if ($result) {
    // Create an array to store all the rows
    $responseData = array();

    // Fetch all the rows from the result set
    while ($row = $result->fetch_assoc()) {
        $responseData[] = array(
            'startTime' => $row['HoraInicio'],
            'finishTime' => $row['HoraFinal'],
            'day' => $row['DiaReserva']
        );
    }

    // Encode the array as JSON and send it as the response
    echo json_encode($responseData);
} else {
    // Handle the case where the query failed
    echo json_encode(array('error' => 'Failed to retrieve data'));
}

// Close the prepared statement and the MySQL connection
$stmt->close();
$conn->close();
?>
