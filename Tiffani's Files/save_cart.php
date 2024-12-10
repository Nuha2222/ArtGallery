<?php
session_start();

require 'cart.php';

// Get JSON input
$data = file_get_contents("php://input");
$cartItems = json_decode($data, true);

if ($cartItems) {
    foreach ($cartItems as $item) {
        $title = $item['title'];
        $price = $item['price'];

        $stmt = $pdo->prepare("INSERT INTO cart (title, price) VALUES (:title, :price)");
        $stmt->execute(['title' => $title, 'price' => $price]);
    }
    echo "Cart items saved successfully!";
} else {
    echo "No data received!";
}
?>
