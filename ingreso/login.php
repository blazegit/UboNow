<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";
// Create a new PDO instance
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare and execute the SQL query
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE CorreoElectronico = :username AND Verificado = 1");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // User found, fetch the row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $hashed_password = $row['Contrasena'];
        $user_id = $row['UserID']; 

        // Verify the password
        if (password_verify($password, $hashed_password)) {
            // User is authenticated, start the session and set session variables
            session_start();
            $_SESSION['loggedin'] = true;
            $_SESSION['user_id'] = $user_id; // Storing the user ID in the session
            $_SESSION['username'] = $username;

            // Set session expiration time to 10 minutes (600 seconds)
            $_SESSION['expire_time'] = time() + 600;

            // Return a JSON response indicating success
            $response = array("success" => true, "message" => "Login successful");
            echo json_encode($response);
        } else {
            // Invalid password
            $response = array("success" => false, "message" => "Contraseña inválida"); 
            echo json_encode($response);
        }
    } else {
        // User not found or unverified account
        $response = array("success" => false, "message" => "Usuario no encontrado o cuenta no verificada"); 
        echo json_encode($response);
    }
}

// Close the database connection
$conn = null;
?>
