// Function to send the cart update to the server (via Fetch API)
function sendCartUpdateToServer(artwork) {
    const userId = 1; // You might want to replace this with the actual logged-in user ID

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('artwork_title', artwork.title);
    formData.append('artwork_price', artwork.price);
    formData.append('artwork_image', artwork.image);
    formData.append('action', 'add'); // Indicating we are adding this artwork

    // Send the data to a PHP script using Fetch API
    fetch('add_to_cart.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Artwork added to database');
            } else {
                console.error('Error adding artwork to database');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to handle adding artwork to the cart
function addToCart(artwork) {
    console.log('Adding to cart:', artwork);  // Debugging line

    // Save to localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the artwork is already in the cart
    const existingItem = cart.find(item => item.title === artwork.title);

    if (existingItem) {
        existingItem.quantity += 1;  // Increase quantity if item exists
    } else {
        cart.push({ ...artwork, quantity: 1 });  // Add new item with quantity 1
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Send the cart data to the server to update the database
    sendCartUpdateToServer(artwork);  // Send the artwork details to the server

    // Redirect to cart page
    console.log("Redirecting to shoppingCartPage.html");
    window.location.href = "shoppingCartPage.html";  // Redirect to cart page
}

// Event listener for the "Add to Cart" button
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();  // Prevent form submission if wrapped in a form

        const artwork = {
            title: this.dataset.title,
            price: this.dataset.price,
            image: this.dataset.image
        };
        addToCart(artwork);  // Add the selected artwork to the cart and send data to the server
    });
});