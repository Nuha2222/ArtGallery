<?php
session_start();  // Start the session to access session data

// Unset all session variables
session_unset();

// Destroy the session
session_destroy();

// Optionally, you can redirect the user to the login page or homepage
header("Location: index.html");  // Redirect to login page
exit();  // Make sure to stop further script execution
?>
