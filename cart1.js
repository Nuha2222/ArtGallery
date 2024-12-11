// Check if cart data exists in localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update the cart display
function updateCartDisplay() {
    const cartCount = document.getElementById("cartCount");
    cartCount.textContent = cart.length; // Display the number of items in the cart
}

// Function to add artwork to the cart
function addToCart(artwork) {
    cart.push(artwork); // Add the selected artwork to the cart array
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the cart to localStorage
    updateCartDisplay(); // Update the cart count
}

// Event listener for the "Add to Cart" button
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function() {
        const artwork = {
            title: this.dataset.title,
            price: this.dataset.price,
            image: this.dataset.image
        };
        addToCart(artwork);
    });
});

// Initialize the cart count display when the page loads
document.addEventListener("DOMContentLoaded", updateCartDisplay);
