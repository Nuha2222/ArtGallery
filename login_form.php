<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Sanitize inputs
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Check if the username and password are not empty
if (!empty($username) && !empty($password)) {

    // Database credentials
    $host = "127.0.0.1";
    $dbname = "gallery_db";
    $dbusername = "root";
    $dbpassword = "user123!";

    // Create the connection
    $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

    // Check if the connection was successful
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Query to check if the user exists
    $query = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // If the user exists, check the password
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Start a session and redirect to the art gallery page
            session_start();
            $_SESSION['username'] = $username;  // Store the username in session
            header("Location: /art_gallery/art.html");
            exit;
        } else {
            echo "Incorrect password!";
        }
    } else {
        echo "Username not found!";
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo "Both fields are required!";
    die();
}
?>

