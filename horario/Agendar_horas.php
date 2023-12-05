<?php
session_start();

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

// Check if the request is an AJAX request
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    header('Content-Type: application/json');

    
function convertEventFormat($selectedEvent) {
    $daysOfWeek = array(
        "L" => "Lunes",
        "M" => "Martes",
        "X" => "Miercoles",
        "J" => "Jueves",
        "V" => "Viernes"
    );

    $times = array(
        "08:30 - 09:15",
        "09:15 - 10:00",
        "10:10 - 10:55",
        "10:55 - 11:40",
        "11:45 - 12:30",
        "12:30 - 13:15",
        "13:30 - 14:15",
        "14:15 - 15:00",
        "15:10 - 15:55",
        "15:55 - 16:40",
        "16:45 - 17:30",
        "17:30 - 18:15",
        "18:30 - 19:10",
        "19:10 - 19:50",
        "19:50 - 20:30",
        "20:30 - 21:10",
        "21:10 - 21:50",
        "21:50 - 22:30"
    );

     
    // Use regular expression to extract block number and day code
    preg_match('/^(\d+)([LMXJV])/', $selectedEvent, $matches);

    if (count($matches) == 3) {
        $block = (int)$matches[1];
        $dayCode = $matches[2];

        // Check if the day code is valid
        if (isset($daysOfWeek[$dayCode])) {
            $day = $daysOfWeek[$dayCode];
        } else {
            // Handle invalid day code
            $day = '';
        }

        // Check if the block number is within the valid range
        if ($block >= 1 && $block <= count($times)) {
            $time = $times[$block - 1];

            list($startTime, $endTime) = explode(" - ", $time);

            return array(
                "DiaSemana" => $day,
                "HoraInicio" => $startTime,
                "HoraFinalizacion" => $endTime
            );
        }
    }

    // Return default values or handle the error accordingly
    return array(
        "DiaSemana" => '',
        "HoraInicio" => '',
        "HoraFinalizacion" => ''
    );
}


    // Your existing code for form processing
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST['asignatura']) && isset($_POST['sala']) && isset($_POST['profesor']) && isset($_POST['selected-events'])) {
            $asignatura = $_POST['asignatura'];
            $sala = $_POST['sala'];
            $profesor = $_POST['profesor'];
            $selected_events = json_decode($_POST['selected-events']);

            $userID = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

            if (!is_array($selected_events)) {
                $response = array("status" => "error", "message" => "Selected events must be an array");
            } else {
                foreach ($selected_events as $event) {
                    $convertedEvent = convertEventFormat($event);
                    $diaSemana = $convertedEvent["DiaSemana"];
                    $horaInicio = $convertedEvent["HoraInicio"];
                    $horaFinalizacion = $convertedEvent["HoraFinalizacion"];

                    // Perform the database insertion
                    $stmt = $conn->prepare("INSERT INTO horarioestudiante (UserID, DiaSemana, HoraInicio, HoraFinalizacion, asignatura, sala, profesor) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("sssssss", $userID, $diaSemana, $horaInicio, $horaFinalizacion, $asignatura, $sala, $profesor);

                    if ($stmt->execute()) {
                        $response = array("status" => "success", "message" => "Data inserted successfully");
                    } else {
                        $response = array("status" => "error", "message" => "Error: " . $stmt->error);
                    }

                    $stmt->close();
                }
            }
        } else {
            $response = array("status" => "error", "message" => "Please fill all the required fields");
        }

        echo json_encode($response);
    }
} else {
    // This is not an AJAX request, handle it accordingly
    echo json_encode(array("status" => "error", "message" => "This page should only be accessed via AJAX."));
    exit();
}

// Close the connection
$conn->close();
?>
