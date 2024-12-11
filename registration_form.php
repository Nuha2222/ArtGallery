<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$phonenum = $_POST['phonenum'];  // Optional, based on the table structure
$username = $_POST['username'];
$password = $_POST['password'];

if (!empty($fname) && !empty($lname) && !empty($email) && !empty($username) && !empty($password)) {

    // Combine first and last name into a single name field
    $name = $fname . ' ' . $lname;

    // Database credentials
    $host = "localhost";
    $dbname = "ProjectTest";
    $dbusername = "root";
    $dbpassword = "";

    // Create a new connection to the database
    $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

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
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert data into the 'users' table
        $sql_users = "INSERT INTO users (username, password, name, email, address) VALUES (?, ?, ?, ?, ?)";
        $stmt_users = $conn->prepare($sql_users);

        if ($stmt_users === false) {
            die("Error preparing the users SQL query: " . $conn->error);
        }

        // Assuming 'address' is empty for now, you can modify as needed
        $address = "";  // Set default address if not in the form
        if (!$stmt_users->bind_param("sssss", $username, $hashed_password, $name, $email, $address)) {
            die("Error binding parameters for users: " . $stmt_users->error);
        }

        // Insert data into the 'registration' table
        $sql_registration = "INSERT INTO registration (fname, lname, email, phonenum, username, password) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt_registration = $conn->prepare($sql_registration);

        if ($stmt_registration === false) {
            die("Error preparing the registration SQL query: " . $conn->error);
        }

        if (!$stmt_registration->bind_param("ssssss", $fname, $lname, $email, $phonenum, $username, $hashed_password)) {
            die("Error binding parameters for registration: " . $stmt_registration->error);
        }

        // Execute both insert queries
        $conn->begin_transaction();

        try {
            $stmt_users->execute();  // Insert into 'users' table
            $stmt_registration->execute();  // Insert into 'registration' table

            // Commit the transaction if both queries were successful
            $conn->commit();

            header("Location: login.html"); // Redirect to login page
            exit;
        } catch (Exception $e) {
            // Rollback the transaction if there is an error
            $conn->rollback();
            echo "Error: " . $e->getMessage();
        } finally {
            // Close prepared statements and connection
            $stmt_users->close();
            $stmt_registration->close();
            $conn->close();
        }
    }
} else {
    echo "All fields are required!";
    die();
}
?>
