
// Add more function
function addMore(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart[index];

    if (item) {
        item.quantity += 1;
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
            cart.splice(index, 1);
        } else {
            item.quantity -= 1;
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
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cartItems");
    const totalAmountContainer = document.getElementById("totalAmount");

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        totalAmountContainer.innerHTML = "<p><strong>Total: $0.00</strong></p>";
    } else {
        cartItems.innerHTML = "";
        let totalPrice = 0;

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

            cartItems.appendChild(itemElement);
        });

        totalAmountContainer.innerHTML = `<p><strong>Total: ${formatPrice(totalPrice)}</strong></p>`;
    }
}

document.addEventListener("DOMContentLoaded", updateCartDisplay);

