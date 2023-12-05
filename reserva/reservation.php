<?php
date_default_timezone_set('America/Santiago');

error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    $fechaReserva = $_POST['day'];
    $room = $_POST['room'];
    $horaReserva = $_POST['hour'];

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

    // Logic for converting the hour string to actual time
    $hourFormatted = date('H:i:s', strtotime($horaReserva));

    session_start();
    $userID = $_SESSION['user_id'];

    // Check if the user has made 3 or fewer reservations in the next 7 days
    $sql_countSala = "SELECT COUNT(*) as count FROM reservas WHERE UserID = $userID AND FechaReserva <= CURDATE() + INTERVAL 7 DAY AND (EspacioID = 6 OR EspacioID = 7 OR EspacioID = 8 OR EspacioID = 9)";
    
    $sql_countGYM  = "SELECT COUNT(*) as count FROM reservas WHERE UserID = $userID AND FechaReserva <= CURDATE() + INTERVAL 7 DAY AND (EspacioID = 4 OR EspacioID = 5)";



    $result_countSala = $conn->query($sql_countSala);
     $result_countGYM = $conn->query($sql_countGYM);

    if ($result_countSala->num_rows > 0 && $room>=6 && $room<=9  ) {
        $row = $result_countSala->fetch_assoc();
        $reservationCount = $row['count'];

        if ($reservationCount < 3) {
            // Inserting the separated date and time into the database
            $sql = "INSERT INTO reservas (UserID, EspacioID, FechaReserva, HoraReserva) VALUES ($userID, $room, '$formattedFechaReserva', '$hourFormatted')";

            if ($conn->query($sql) === TRUE) {
                $response = array(
                    'success' => true,
                    'message' => 'New record created successfully',
                    'fechaReserva' => $formattedFechaReserva,
                    'currentDateTime' => $currentDateTime->format('Y-m-d H:i:s')
                );
            } else {
                $response = array(
                    'success' => false,
                    'message' => 'Error: ' . $sql . '<br>' . $conn->error
                );
            }
        } else {
            $response = array(
                'success' => false,
                'message' => 'Error: Usted ya excedió el límite de 3 reservas para esta semana.'
            );
        }
    }
    
     if ($result_countGYM->num_rows > 0 && $room>=4 && $room<=5  ) {
        $row = $result_countGYM->fetch_assoc();
        $reservationCount = $row['count'];

        if ($reservationCount < 3) {
            // Inserting the separated date and time into the database
            $sql = "INSERT INTO reservas (UserID, EspacioID, FechaReserva, HoraReserva) VALUES ($userID, $room, '$formattedFechaReserva', '$hourFormatted')";

            if ($conn->query($sql) === TRUE) {
                $response = array(
                    'success' => true,
                    'message' => 'New record created successfully',
                    'fechaReserva' => $formattedFechaReserva,
                    'currentDateTime' => $currentDateTime->format('Y-m-d H:i:s')
                );
            } else {
                $response = array(
                    'success' => false,
                    'message' => 'Error: ' . $sql . '<br>' . $conn->error
                );
            }
        } else {
            $response = array(
                'success' => false,
                'message' => 'Error: Usted ya excedió el límite de 3 reservas para esta semana.'
            );
        }
    }
    
    
    
}

header('Content-Type: application/json');
// Return the response as JSON
echo json_encode($response);

$conn->close();
?>
