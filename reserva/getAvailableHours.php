<?php

date_default_timezone_set('America/Santiago');


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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $selectedRoom = $_POST["room"];
    $fechaReserva = $_POST['day'];

    // Create a DateTime object for the current date and time
    $currentDateTime = new DateTime();
    $currentDay = $currentDateTime->format('l'); // Get the current day as a string

    // Convert day string to a DateTime object
    $fechaReservaObject = new DateTime($fechaReserva);

    // Combine selected date with the current time for accurate comparison
    $combinedDateTime = new DateTime($fechaReservaObject->format('Y-m-d') . ' ' . $currentDateTime->format('H:i:s'));

    if ($fechaReservaObject->format('l') != $currentDay && $combinedDateTime < $currentDateTime) {
        // If the selected day is not today and has passed, add a week
        $fechaReservaObject->modify('next ' . $fechaReservaObject->format('l'));
    }

    // Format the DateTime object as "Y-m-d"
    $formattedFechaReserva = $fechaReservaObject->format('Y-m-d');

    // Fetch available hours from the database based on the adjusted date and room
    $sql = "SELECT HoraReserva FROM reservas WHERE FechaReserva = '$formattedFechaReserva' AND EspacioID = $selectedRoom";
    $result = $conn->query($sql);

    $hours = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($hours, $row["HoraReserva"]);
        }
    } else {
        // If no hours are available, return an empty array
        $hours = array();
    }

    // Output the JSON response
    header('Content-Type: application/json');
    echo json_encode($hours);
}

$conn->close();
?>
