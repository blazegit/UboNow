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

    // Procesar el formulario de registro si se envió
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Verificar si el correo electrónico pertenece al dominio permitido
        if (strpos($email, '@pregrado.ubo.cl') === false) {
            $response = array("success" => false, "message" => "Solo se permiten correos electrónicos del dominio @pregrado.ubo.cl");
            echo json_encode($response);
        } else {
            // Verificar si el correo electrónico ya existe en la base de datos
            $check_email_query = "SELECT * FROM usuarios WHERE CorreoElectronico = '$email'";
            $result = $conn->query($check_email_query);
            if ($result->num_rows > 0) {
                $response = array("success" => false, "message" => "El correo electrónico ya está registrado.");
                echo json_encode($response);
            } else {
                // Generar un token único
                $token = bin2hex(random_bytes(25));

                // Hash the password
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);

                // Consulta para insertar los datos en la base de datos junto con el token y la contraseña hasheada
                $sql = "INSERT INTO usuarios (CorreoElectronico, Contrasena, Token) VALUES ('$email', '$hashed_password', '$token')";

                if ($conn->query($sql) === TRUE) {
                    $response = array("success" => true);
                    echo json_encode($response);

                    // Enviar correo de verificación con el token en el enlace
                    $to = $email;
                    $subject = 'Verificación de correo electrónico';
                    $message = 'Gracias por registrarte. Por favor, haga clic en el siguiente enlace para verificar su correo electrónico: http://ubonow.cl/registro/verificar.php?token=' . $token;
                    $headers = 'From: ubonow.cl';

                    mail($to, $subject, $message, $headers);
                } else {
                    $response = array("success" => false, "message" => "Error al registrar el usuario.");
                    echo json_encode($response);
                }
            }
        }
    }

    // Cerrar la conexión a la base de datos
    $conn->close();
?>
