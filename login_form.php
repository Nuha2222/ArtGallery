<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

if (!empty($username) && !empty($password)) {

    // Database credentials
    $host = "localhost";
    $dbname = "ProjectTest";
    $dbusername = "root";
    $dbpassword = "";

    $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "SELECT * FROM registration WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Start a session and redirect to the art gallery page
            session_start();
            $_SESSION['username'] = $username;  // Store the username in session
            header("Location: art.html");
            exit;
        } else {
            echo "Incorrect password!";
        }
    } else {
        echo "Username not found!";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Both fields are required!";
    die();
}
?>

