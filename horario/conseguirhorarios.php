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


$sql = "SELECT DISTINCT UserID FROM horarioestudiante";
$result = $conn->query($sql);

$schedules = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $userID = $row["UserID"];

        // Query schedules for the current user
        $scheduleQuery = "SELECT DiaSemana, HoraInicio, HoraFinalizacion FROM horarioestudiante WHERE UserID = '$userID'";
        $scheduleResult = $conn->query($scheduleQuery);

        $schedule = array();

        if ($scheduleResult->num_rows > 0) {
            while ($scheduleRow = $scheduleResult->fetch_assoc()) {
                $convertedEvent = array(
                    "DiaSemana" => $scheduleRow["DiaSemana"],
                    "HoraInicio" => $scheduleRow["HoraInicio"],
                    "HoraFinalizacion" => $scheduleRow["HoraFinalizacion"]
                );
                $originalEvent = reverseConvertEventFormat($convertedEvent);

                $schedule[] = $originalEvent;
            }
        }

        $schedules[$userID] = $schedule;
    }
}

header('Content-Type: application/json');
echo json_encode($schedules);

// Close the connection
$conn->close();

function reverseConvertEventFormat($convertedEvent)
{
    $daysOfWeek = array(
        "Lunes" => "L",
        "Martes" => "M",
        "Miercoles" => "X",
        "Jueves" => "J",
        "Viernes" => "V",
        "Sabado" => "S",
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
?>
