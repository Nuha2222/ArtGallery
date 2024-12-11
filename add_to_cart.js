// Form data
const formData = new FormData();
formData.append('user_id', userId);
formData.append('artwork_title', artwork.title);
formData.append('artwork_price', artwork.price);
formData.append('artwork_image', artwork.image);
formData.append('action', 'add');

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


// addToCart function
function addToCart(artwork) {
    console.log('Adding to cart:', artwork);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const itemExists = cart.find(item => item.title === artwork.title);

    if (itemExists) {
        itemExists.quantity += 1;
    } else {
        cart.push({ ...artwork, quantity: 1 });
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Log the cart data for debugging
    console.log('Updated Cart:', JSON.parse(localStorage.getItem("cart")));

    // Send the cart data to the server to update the database
    sendCartUpdateToServer(artwork);

    // Redirect to cart page
    console.log("Redirecting to shoppingCartPage.html");
    window.location.href = "shoppingCartPage.html";
}

// Event listener for the "Add to Cart" button
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();

        const artwork = {
            title: this.dataset.title,
            price: this.dataset.price,
            image: this.dataset.image
        };
        addToCart(artwork);
    });
});
