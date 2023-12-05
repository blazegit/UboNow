<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si el token está presente en la URL
if(isset($_GET['token'])) {
    $token = $_GET['token'];

    // Consulta para verificar el token en la base de datos
    $sql = "SELECT * FROM usuarios WHERE Token = '$token'";

    $result = $conn->query($sql);

    // Si se encuentra un resultado, marcar la cuenta como verificada
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id = $row['UserID']; // Suponiendo que tienes una columna 'ID' en tu tabla de usuarios

        // Actualizar el registro del usuario para marcarlo como verificado
        $update_sql = "UPDATE usuarios SET Verificado = 1 WHERE UserID = $id";
        if ($conn->query($update_sql) === TRUE) {
            echo "¡Cuenta verificada con éxito!";
        } else {
            echo "Error al verificar la cuenta: " . $conn->error;
        }
    } else {
        echo "Token no válido o cuenta ya verificada";
    }
} else {
    echo "Token no encontrado en la URL";
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
