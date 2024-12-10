// Function to update the cart display
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cartItems");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItemsContainer.innerHTML = ""; // Clear any existing items

        cart.forEach((item, index) => {
            // Convert price to a number for calculation
            const itemPrice = parseFloat(item.price.replace('$', '').replace(',', ''));
            const itemTotalPrice = itemPrice * item.quantity; // Calculate the total price for this item

            // Create a new div for the cart item
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");

            // Display item details: image, title, price per item, quantity, and total price
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" width="100" height="100">
                <div>
                    <p><strong>${item.title}</strong></p>
                    <p>Price per Item: ${item.price}</p> <!-- Price per item based on data-price -->
                    <p>Quantity: ${item.quantity}</p>
                    <p><strong>Total Price for This Item: $${itemTotalPrice.toFixed(2)}</strong></p>
                    <button onclick="addMoreOfItem(${index})">Add More</button>
                    <button onclick="removeItemFromCart(${index})">Remove</button>
                </div>
            `;

            // Append the item to the cart container
            cartItemsContainer.appendChild(itemElement);
        });
    }
}

// Function to add more of the same item in the cart
function addMoreOfItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart[index];

    if (item) {
        item.quantity += 1; // Increase quantity by 1
        localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart to localStorage
        updateCartDisplay(); // Update the cart display
    }
}

// Function to remove (completely delete) an item from the cart (by index)
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart[index];

    if (item) {
        // If the item has 1 quantity, completely remove it from the cart
        if (item.quantity === 1) {
            cart.splice(index, 1); // Remove the item from the cart array
        } else {
            // Otherwise, just decrease the quantity by 1
            item.quantity -= 1;
        }

        // Save the updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update the cart display
        updateCartDisplay();
    }
}

// Function to add item to the cart and send to the server
function addToCart(artwork) {
    console.log('Adding to cart:', artwork);  // Debugging line

    // Save to localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.title === artwork.title);

    if (existingItem) {
        existingItem.quantity += 1;  // Increase quantity if item exists
    } else {
        cart.push({ ...artwork, quantity: 1 });  // Add new item with quantity 1
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart to localStorage
    updateCartDisplay(); // Update the cart display

    // Send the data to the PHP script via AJAX
    fetch('cart_update.php', {
        method: 'POST',
        body: new URLSearchParams({
            user_id: 1, // Replace with actual user ID if needed (can be from session or localStorage)
            artwork_title: artwork.title,
            artwork_price: artwork.price,
            artwork_image: artwork.image,
            action: 'add'
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message); // Successfully added to cart
                // Optionally, redirect to the shopping cart page or update UI
                window.location.href = "shoppingCartPage.html";  // Redirect to cart page
            } else {
                console.error('Failed to add to cart:', data.message); // Show error message
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error); // Handle fetch errors
        });
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

// Initialize the cart count display when the page loads
document.addEventListener("DOMContentLoaded", updateCartDisplay);
