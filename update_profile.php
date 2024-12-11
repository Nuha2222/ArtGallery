<?php
session_start();

// Assuming the user is already logged in
$username = $_SESSION['username'];  // Or use session variable for user ID

// Collect form data
$name = $_POST['name'];
$email = $_POST['email'];
$address = $_POST['address'];
$oldPassword = $_POST['oldPassword'];
$newPassword = $_POST['newPassword'];

// Database credentials
$host = "localhost";
$dbname = "ProjectTest";
$dbusername = "root";
$dbpassword = "";

$conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch current password from the database
$sql = "SELECT password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user_data = $result->fetch_assoc();
    $storedPassword = $user_data['password'];

    // Check if the old password is correct
    if (password_verify($oldPassword, $storedPassword)) {
        // Prepare the updated query
        $update_sql = "UPDATE users SET name = ?, email = ?, address = ?, password = ? WHERE username = ?";
        $stmt_update = $conn->prepare($update_sql);

        // Hash new password if provided
        $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        if ($stmt_update) {
            // Bind parameters and execute the update query
            $stmt_update->bind_param("sssss", $name, $email, $address, $hashedNewPassword, $username);
            if ($stmt_update->execute()) {
                echo "Profile updated successfully!";
                // Redirect to profile page or dashboard
            } else {
                echo "Error updating profile: " . $stmt_update->error;
            }
        }
    } else {
        echo "Old password is incorrect!";
    }
} else {
    echo "User not found!";
}

$stmt->close();
$conn->close();
?>
