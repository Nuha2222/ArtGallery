<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$phonenum = $_POST['phonenum'];
$username = $_POST['username'];
$password = $_POST['password'];

if (!empty($fname) && !empty($lname) && !empty($email) && !empty($phonenum) && !empty($username) && !empty($password)) {

    // Database credentials
    $host = "127.0.0.1";
    $dbname = "gallery_db";
    $dbusername = "root";
    $dbpassword = "user123!";

    $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Username already exists, please choose another.";
        exit;
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO registration (fname, lname, email, phonenum, username, password) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            die("Error preparing the SQL query: " . $conn->error);
        }

        if (!$stmt->bind_param("ssssss", $fname, $lname, $email, $phonenum, $username, $hashed_password)) {
            die("Error binding parameters: " . $stmt->error);
        }

        if ($stmt->execute()) {
            header("Location: login.html");
            exit;
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();
    }
} else {
    echo "All fields are required!";
    die();
}
?>

