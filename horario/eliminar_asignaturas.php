<?php
// Inicia la sesión
session_start();


// Obtén el user_id de la sesión
$userID = $_SESSION['user_id'];


$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("La conexión falló: " . $conn->connect_error);
}

// Consulta para eliminar los horarios del usuario
$sql = "DELETE FROM horarioestudiante WHERE UserID = $userID";

if ($conn->query($sql) === TRUE) {
    // Éxito al eliminar los horarios
    echo "Horarios eliminados correctamente.";
} else {
    // Error al ejecutar la consulta
    echo "Error al eliminar horarios: " . $conn->error;
}

// Cierra la conexión
$conn->close();
?>
