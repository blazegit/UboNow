<?php
    session_start();

    $response = array();

    if(isset($_SESSION['loggedin']) && !empty($_SESSION['loggedin'])) {
        if(time() < $_SESSION['expire_time']) {
            // User is logged in
            $response['loggedin'] = true;
            $response['user_id'] = $_SESSION['user_id'];
            $response['username'] = $_SESSION['username'];
        } else {
            // Session has expired, user is not logged in
            $response['loggedin'] = false;
        }
    } else {
        // User is not logged in
        $response['loggedin'] = false;
    }

    echo json_encode($response);
?>
