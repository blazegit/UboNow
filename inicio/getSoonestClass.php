<?php
session_start();
$userID = $_SESSION['user_id'];

// Database connection details
$servername = "";
$username = "";
$password = "";
$dbname = "";

try {
    // Create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set the locale to Santiago, Chile
    setlocale(LC_TIME, 'es_CL.utf8');

    // Get the current day in Spanish and capitalize the first letter
    $currentDay = ucfirst(strftime('%A', strtotime('today')));

    // Get the current time in "HH:mm:ss" format
    $currentTime = date('H:i:s');

    // Query to get the soonest class for the user on the current day that hasn't started
    $query = "SELECT asignatura, HoraInicio FROM horarioestudiante WHERE UserID = ? AND DiaSemana = ? AND HoraInicio > ? ORDER BY HoraInicio ASC LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$userID, $currentDay, $currentTime]);

    // Fetch the result
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Output the result
    if ($result) {
        echo $result['asignatura'] . " - " . $result['HoraInicio'];
    } else {
        echo "-";
    }
} catch (PDOException $e) {
    // Handle database connection errors
    echo "Error: " . $e->getMessage();
}
?>
