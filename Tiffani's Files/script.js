
// Sample products
const products = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 599.99 },
    { id: 3, name: 'Headphones', price: 199.99 }
];

// Initial cart (can be empty or pre-filled)
let cart = [];

// Function to update the cart table and total
function updateCart() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    cartTableBody.innerHTML = '';

    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price * item.quantity;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button onclick="removeItem(${item.id})">Remove</button></td>
      `;
        cartTableBody.appendChild(row);
    });

    // Update total amount
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

// Function to add item to the cart
function addItemToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }
}

// Function to update item quantity in cart
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        updateCart();
    }
}

// Function to remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Initial display of products with Add to Cart buttons
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const productList = document.createElement('div');
    productList.classList.add('product-list');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="addItemToCart(${product.id})">Add to Cart</button>
      `;
        productList.appendChild(productDiv);
    });

    container.appendChild(productList);
});
