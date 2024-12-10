<?php
session_start();

// Database connection
$host = 'localhost';
$dbname = 'ProjectTest';
$username = 'root';
$password = '';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
    exit();
}

// Initialize the cart in the session if it's not already set
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Add item to the cart
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add') {
    $item = [
        'id' => $_POST['id'],
        'title' => $_POST['title'],
        'price' => $_POST['price'],
        'quantity' => $_POST['quantity']  // Quantity stored in session
    ];

    // Check if the item already exists in the session cart
    $found = false;
    foreach ($_SESSION['cart'] as &$cartItem) {
        if ($cartItem['id'] == $item['id']) {
            $cartItem['quantity'] += $item['quantity']; // Update quantity if item is already in cart
            $found = true;
            break;
        }
    }

    // If item is not found, add it to the session cart
    if (!$found) {
        $_SESSION['cart'][] = $item;
    }

    // Save the cart item to the database (you could skip this if you just need session storage)
    $stmt = $pdo->prepare("INSERT INTO cart (title, price) VALUES (?, ?)");
    $stmt->execute([$item['title'], $item['price']]);

    header('Location: cart.php');
    exit();
}

// Remove item from the cart
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'remove') {
    $itemId = $_POST['id'];

    // Remove the item from the session cart
    foreach ($_SESSION['cart'] as $key => $cartItem) {
        if ($cartItem['id'] == $itemId) {
            unset($_SESSION['cart'][$key]);
            break;
        }
    }

    // Re-index the array to prevent gaps in the keys
    $_SESSION['cart'] = array_values($_SESSION['cart']);

    // Remove the item from the database (optional)
    $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
    $stmt->execute([$itemId]);

    header('Location: cart.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Shopping Cart</title>
</head>
<body>

<h1>Your Cart</h1>

<?php if (empty($_SESSION['cart'])): ?>
    <p>Your cart is empty.</p>
<?php else: ?>
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $total = 0;
            foreach ($_SESSION['cart'] as $cartItem):
                $subtotal = $cartItem['price'] * $cartItem['quantity'];
                $total += $subtotal;
            ?>
            <tr>
                <td><?php echo $cartItem['title']; ?></td>
                <td>$<?php echo number_format($cartItem['price'], 2); ?></td>
                <td><?php echo $cartItem['quantity']; ?></td>
                <td>$<?php echo number_format($subtotal, 2); ?></td>
                <td>
                    <form method="POST" action="cart.php" style="display:inline;">
                        <input type="hidden" name="action" value="remove">
                        <input type="hidden" name="id" value="<?php echo $cartItem['id']; ?>">
                        <button type="submit">Remove</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <p><strong>Total: $<?php echo number_format($total, 2); ?></strong></p>

    <a href="checkout.php">Proceed to Checkout</a>

<?php endif; ?>

<!-- Example product form to add items to cart -->
<div class="product">
    <img src="images/paris_street.jpg" alt="Paris Street Artwork">
    <div class="product-title">Paris Street; Rainy Day</div>
    <div class="product-price">$1,000,000</div>
    <form method="POST" action="cart.php">
        <input type="hidden" name="action" value="add">
        <input type="hidden" name="id" value="1">
        <input type="hidden" name="title" value="Paris Street; Rainy Day">
        <input type="hidden" name="price" value="1000000">
        <input type="number" name="quantity" value="1" min="1">
        <button type="submit">Add to Cart</button>
    </form>
</div>

</body>
</html>
