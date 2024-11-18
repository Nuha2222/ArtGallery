<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Sanitize inputs
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$phonenum = $_POST['phonenum'];
$username = $_POST['username'];
$password = $_POST['password'];

// Check if the username and password are not empty
if (!empty($fname) && !empty($lname) && !empty($email) && !empty($phonenum) && !empty($username) && !empty($password)) {

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

    // Check if the username already exists
    $query = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Username already exists, please choose another.";
        exit;
    } else {
        // Hash the password before storing it
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert into the users table
        $sql = "INSERT INTO users (fname, lname, email, phonenum, username, password) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            die("Error preparing the SQL query: " . $conn->error);
        }

        // Bind the parameters to the query
        if (!$stmt->bind_param("ssssss", $fname, $lname, $email, $phonenum, $username, $hashed_password)) {
            die("Error binding parameters: " . $stmt->error);
        }

        // Execute the query
        if ($stmt->execute()) {
            echo "Registration successful! Please <a href='login.php'>login</a>.";
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

