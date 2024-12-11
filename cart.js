// Function to add artwork to the cart
function addToCart(artwork) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(item => item.title === artwork.title);

    if (existingItemIndex !== -1) {
        // Item already exists, increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // New item, set quantity to 1
        artwork.quantity = 1;
        cart.push(artwork);
    }

    localStorage.setItem("cart", JSON.stringify(cart));  // Save to localStorage
    updateCartDisplay();  // Update cart display including the count
}


// Add more function
function addMore(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart[index];

    if (item) {
        item.quantity += 1; // Increase the quantity
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        sendCartUpdateToServer(item, "add");
    }
}

// Remove function
function remove(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart[index];

    if (item) {
        if (item.quantity === 1) {
            cart.splice(index, 1); // Remove item if quantity is 1
        } else {
            item.quantity -= 1; // Decrease quantity
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        sendCartUpdateToServer(item, "remove");
    }
}


// Function to send the cart update to the server (via AJAX)
function sendCartUpdateToServer(item, action) {
    const userId = 1;

    // Create a form data object
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('artwork_title', item.title);
    formData.append('quantity', item.quantity);
    formData.append('action', action);


}


function formatPrice(price) {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Function to update the cart display and calculate total price
function updateCartDisplay() {
    // Get the cart from localStorage (if it exists)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cartItems");
    const totalAmountContainer = document.getElementById("totalAmount");
    const cartCount = document.getElementById("cartCount");  // Cart count element

    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);  // Sum quantities

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        totalAmountContainer.innerHTML = "<p><strong>Total: $0.00</strong></p>";
    } else {
        cartItems.innerHTML = "";  // Clear the cart items display
        let totalPrice = 0;

        // Loop through cart items and display each one
        cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price);
            const itemTotalPrice = itemPrice * item.quantity;
            totalPrice += itemTotalPrice;

            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");

            itemElement.innerHTML = `
                <div class="cart-item-content">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <p><strong>${item.title}</strong></p>
                        <p>Quantity: ${item.quantity}</p>
                        <p><strong>Price: ${formatPrice(itemPrice)}</strong></p> 
                        <p><strong>Total Price: ${formatPrice(itemTotalPrice)}</strong></p> 
                        <div class="cart-item-actions">
                            <button onclick="addMore(${index})" class="btn add-more-btn">Add More</button>
                            <button onclick="remove(${index})" class="btn remove-btn">Remove</button>
                        </div>
                    </div>
                </div>
            `;

            cartItems.appendChild(itemElement);  // Add item to the cart display
        });

        totalAmountContainer.innerHTML = `<p><strong>Total: ${formatPrice(totalPrice)}</strong></p>`;  // Update total price
    }
}


document.addEventListener("DOMContentLoaded", updateCartDisplay);

