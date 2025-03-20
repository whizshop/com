document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();

    // Add to cart functionality
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const image = this.dataset.image;

            // Check if the item already exists in the cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++; // Increase quantity if item exists
            } else {
                cart.push({ name, price, image, quantity: 1 }); // Add new item to cart
            }

            // Save the updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Update the cart count in the header
            updateCartCount();

            // Show a popup notification
            showPopup(`${name} added to cart!`);
        });
    });

    // Render cart items on the cart page
    if (document.getElementById("cart-items")) {
        renderCart();
    }

    // Clear cart
    document.getElementById("clear-cart")?.addEventListener("click", function () {
        localStorage.removeItem("cart"); // Clear the cart
        renderCart(); // Re-render the cart (it will be empty)
        updateCartCount(); // Update the cart count in the header
        showPopup("Cart cleared!"); // Show a popup notification
    });

    // Place order
    document.getElementById("place-order")?.addEventListener("click", function () {
        showOrderPopup(); // Show the order confirmation popup
        localStorage.removeItem("cart"); // Clear the cart
        renderCart(); // Re-render the cart (it will be empty)
        updateCartCount(); // Update the cart count in the header
    });
});

// Update cart count in the header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// Render cart items on the cart page
function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = ""; // Clear the cart container

    let totalPrice = 0;

    // Loop through each item in the cart and display it
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>Ksh ${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(itemDiv);

        // Calculate the total price
        totalPrice += item.price * item.quantity;
    });

    // Display the total price
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("total-price");
    totalDiv.innerHTML = `<p>Total: Ksh ${totalPrice.toFixed(2)}</p>`;
    cartContainer.appendChild(totalDiv);
}

// Update item quantity in the cart
function updateQuantity(name, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(item => item.name === name);

    if (item) {
        item.quantity += change; // Update the quantity
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name); // Remove the item if quantity is 0
        }
        localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
        renderCart(); // Re-render the cart
        updateCartCount(); // Update the cart count in the header
    }
}

// Show popup notification
function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    popupMessage.textContent = message; // Set the popup message
    popup.style.display = "block"; // Show the popup
    setTimeout(() => popup.style.display = "none", 2000); // Hide the popup after 2 seconds
}

// Show order confirmation popup
function showOrderPopup() {
    const orderPopup = document.getElementById("order-popup");
    orderPopup.style.display = "block"; // Show the order confirmation popup
}

// Close order popup
function closeOrderPopup() {
    const orderPopup = document.getElementById("order-popup");
    orderPopup.style.display = "none"; // Hide the order confirmation popup
}
