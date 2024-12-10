<?php
// Database credentials
$host = "127.0.0.1";
$dbname = "gallery_db";
$username = "root";
$password = "user123!";

// Get POST data
$user_id = $_POST['user_id'] ?? null;
$artwork_title = $_POST['artwork_title'] ?? null;
$artwork_price = $_POST['artwork_price'] ?? null;
$artwork_image = $_POST['artwork_image'] ?? null;
$action = $_POST['action'] ?? null;

$response = ['success' => false, 'message' => 'Unknown error'];

// Validate inputs and check if the action is 'add'
if ($user_id && $artwork_title && $artwork_price && $artwork_image && $action === 'add') {
    // Create a new connection to the database
    $conn = new mysqli($host, $username, $password, $dbname);

    // Check the connection
    if ($conn->connect_error) {
        $response['message'] = 'Connection failed: ' . $conn->connect_error;
    } else {
        // Sanitize input to prevent SQL injection
        $artwork_title = $conn->real_escape_string($artwork_title);
        $artwork_price = $conn->real_escape_string($artwork_price);
        $artwork_image = $conn->real_escape_string($artwork_image);

        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO cart (user_id, artwork_title, artwork_price, artwork_image) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $artwork_title, $artwork_price, $artwork_image);

        // Execute query
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Artwork added to the cart';
        } else {
            $response['message'] = 'Failed to add artwork to the cart';
        }

        // Close the statement and the connection
        $stmt->close();
        $conn->close();
    }
} else {
    // If validation fails, return an error message
    $response['message'] = 'Missing required data or invalid action.';
}

// Return the response as JSON
echo json_encode($response);
?>
