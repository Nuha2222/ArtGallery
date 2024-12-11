<?php
session_start();

// Database connection parameters
$servername = "localhost";
$username = "root"; // Replace with your DB username
$password = ""; // Replace with your DB password
$dbname = "ProjectTest"; // Replace with your DB name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $full_name = $_POST['name'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $zip_code = $_POST['zip'];
    $name_on_card = $_POST['cardName'];
    $card_number = $_POST['cardNum'];
    $exp_month = $_POST['expMonth'];
    $exp_year = $_POST['expYear'];
    $cvv = $_POST['cvv'];

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO payment (full_name, email, address, city, state, zip_code, name_on_card, card_number, exp_month, exp_year, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssisi", $full_name, $email, $address, $city, $state, $zip_code, $name_on_card, $card_number, $exp_month, $exp_year, $cvv);

    // Execute the query
    if ($stmt->execute()) {
        echo "Payment successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
