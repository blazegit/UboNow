<?php
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

// Start the session
session_start();

// Check if UserID is set in the session
if (isset($_SESSION['user_id'])) {
    $userID = $_SESSION['user_id'];

function reverseConvertEventFormat($convertedEvent)
{
    $daysOfWeek = array(
        "Lunes" => "L",
        "Martes" => "M",
        "Miercoles" => "X",
        "Jueves" => "J",
        "Viernes" => "V",
        "Sábado" => "S",
        "Domingo" => "D"
    );

    $timeToNumber = array(
        "08:30:00" => 1,
        "09:15:00" => 2,
        "10:10:00" => 3,
        "10:55:00" => 4,
        "11:45:00" => 5,
        "12:30:00" => 6,
        "13:30:00" => 7,
        "14:15:00" => 8,
        "15:10:00" => 9,
        "15:55:00" => 10,
        "16:45:00" => 11,
        "17:30:00" => 12,
        "18:30:00" => 13,
        "19:10:00" => 14,
        "19:50:00" => 15,
        "20:30:00" => 16,
        "21:10:00" => 17,
        "21:50:00" => 18
    );

    $day = $convertedEvent["DiaSemana"];
    $startTime = date('H:i:s', strtotime($convertedEvent["HoraInicio"]));
    $endTime = date('H:i:s', strtotime($convertedEvent["HoraFinalizacion"]));

    // Finding the block index
    $block = $timeToNumber["$startTime"];

    // Finding the day abbreviation
    $abbreviatedDay = $daysOfWeek[$day];

    return $block . $abbreviatedDay;
}




    // Your database query logic goes here
    $sql = "SELECT * FROM horarioestudiante WHERE UserID = '$userID'";
    $result = $conn->query($sql);

    $schedule = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $convertedEvent = array(
                "DiaSemana" => $row["DiaSemana"],
                "HoraInicio" => $row["HoraInicio"],
                "HoraFinalizacion" => $row["HoraFinalizacion"]
            );
            $originalEvent = reverseConvertEventFormat($convertedEvent);

            $schedule[] = array(
                "Horas" => $originalEvent,
                "Asignatura" => $row["asignatura"],
                "Sala" => $row["sala"],
                "Profesor" => $row["profesor"]
            );
        }
    }

    header('Content-Type: application/json');
    echo json_encode(array("selectedEvents" => $schedule));

    // Close the connection
    $conn->close();
} else {
    echo "User ID not found in the session.";
}
?>
