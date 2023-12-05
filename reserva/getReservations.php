<?php
// Start the session
session_start();


// Get the UserID from the session
$userID = $_SESSION['user_id'];

// Database connection parameters
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

// SQL query to fetch reservations for the specific UserID
$sql = "SELECT * FROM reservas WHERE UserID = $userID AND FechaReserva >= CURDATE() AND FechaReserva < DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
    // Fetch rows as an associative array
    while ($row = $result->fetch_assoc()) {
        $reservations[] = array(
            "EspacioID" => $row["EspacioID"],
            "FechaReserva" => $row["FechaReserva"],
            "HoraReserva" => $row["HoraReserva"]
        );
    }

    // Convert the reservations array to JSON and echo it
    echo json_encode($reservations);
} else {
    // No reservations found for the user
    echo json_encode([]);
}

// Close the database connection
$conn->close();
?>
