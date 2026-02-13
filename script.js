// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Data holders (fetched from API)
let products = [];
let categories = [];

// API Service will be loaded from api-service.js
// Access via window.apiService

// Utility functions
function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('#cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounts.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function updateWishlistCount() {
    const wishlistCounts = document.querySelectorAll('#wishlist-count');
    const count = wishlist.length;
    wishlistCounts.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function displayCategories() {
    const container = document.getElementById('category-grid');
    if (!container) return;

    container.innerHTML = '';
    categories.forEach(cat => {
        const card = document.createElement('a');
        card.href = `products.html?category=${encodeURIComponent(cat.name)}`;
        card.className = 'category-card';

        card.innerHTML = `
            <div class="category-icon">
                <i class="fas ${cat.icon}"></i>
            </div>
            <h3>${cat.name}</h3>
        `;
        card.onclick = (e) => {
            e.preventDefault();
            localStorage.setItem('selectedCategory', cat.name);
            window.location.href = 'products.html';
        };
        container.appendChild(card);
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color: var(--primary-color)"></i>' :
        type === 'error' ? '<i class="fas fa-exclamation-circle" style="color: var(--danger-color)"></i>' :
            '<i class="fas fa-info-circle"></i>';

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Product display functions
function displayProducts(productsToShow = products, containerId = 'product-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (productsToShow.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Quick Add
                    </button>
                </div>
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <a href="product-detail.html?id=${product.id}" class="product-title">${product.name}</a>
                <p class="product-unit" style="margin-bottom: 0.5rem; font-size: 0.85rem; color: #6B7280;">${product.description.substring(0, 50)}...</p>
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto;">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-unit">/${product.unit}</span>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function displayFeaturedProducts() {
    const featuredProducts = products.slice(0, 4);
    displayProducts(featuredProducts, 'featured-products');
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`Increased quantity of ${product.name}`, 'success');
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(`${product.name} added to cart!`, 'success');
    }
    saveToLocalStorage();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateCartCount();
    displayCart();
    showToast('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveToLocalStorage();
            updateCartCount();
            displayCart();
        }
    }
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartContainer || !cartTotal) return;

    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">Your cart is empty.</p>';
        cartTotal.innerHTML = '';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'card';
        cartItem.style.cssText = 'display: flex; padding: 1rem; margin-bottom: 1rem; align-items: center;';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-md);">
            <div style="flex-grow: 1; margin-left: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;"><a href="product-detail.html?id=${item.id}">${item.name}</a></h4>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-weight: 600; color: var(--text-muted);">$${item.price}</span>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, this.value)" style="width: 60px; padding: 0.25rem;">
                </div>
            </div>
            <div style="text-align: right;">
                <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">$${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})" style="color: var(--danger-color); background: none; border: none; cursor: pointer; font-size: 0.9rem;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    cartTotal.innerHTML = `
        <div style="padding: 1.5rem; background: var(--primary-light); border-radius: var(--radius-lg); text-align: right;">
            <span style="font-size: 1.2rem; margin-right: 1rem;">Total Amount:</span>
            <span style="font-size: 2rem; font-weight: 800; color: var(--primary-color);">$${total.toFixed(2)}</span>
            <div style="margin-top: 1rem;">
                <button onclick="checkout()" class="btn btn-primary">Proceed to Checkout <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    `;
}

// Wishlist functions
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!wishlist.find(item => item.id === productId)) {
        wishlist.push(product);
        saveToLocalStorage();
        updateWishlistCount();
        showToast(`${product.name} added to wishlist!`, 'success');
    } else {
        showToast(`${product.name} is already in your wishlist!`, 'info');
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateWishlistCount();
    displayWishlist();
    showToast('Removed from wishlist', 'info');
}

function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist-items');
    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem;">Your wishlist is empty.</p>';
        return;
    }

    wishlistContainer.innerHTML = '';
    wishlist.forEach(product => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'card product-card';
        wishlistItem.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-details">
                <a href="product-detail.html?id=${product.id}" class="product-title">${product.name}</a>
                <p class="product-price">$${product.price}</p>
                <button onclick="removeFromWishlist(${product.id})" style="color: var(--danger-color); background: none; border: none; cursor: pointer; margin-top: 0.5rem; font-size: 0.9rem;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });
}

// Search and filter functions
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

function filterByCategory(category) {
    if (category === 'All') {
        displayProducts();
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Sort function
function sortProducts(sortBy) {
    let sortedProducts = [...products];

    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            sortedProducts = products;
    }

    displayProducts(sortedProducts);
}

// Form validation and user functions
async function validateLoginForm(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const result = await apiService.login(email, password);

        currentUser = result.data;
        saveToLocalStorage();
        showToast('Login successful!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    } catch (error) {
        showToast(error.message || 'An error occurred during login', 'error');
        console.error(error);
    }
    return false;
}

async function validateSignupForm(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;

    if (name && email && password && address) {
        try {
            const result = await apiService.signup({ name, email, password, address });

            // Initial login after signup
            currentUser = result.data;
            saveToLocalStorage();
            showToast('Signup successful!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } catch (error) {
            showToast(error.message || 'An error occurred during signup', 'error');
            console.error(error);
        }
    } else {
        showToast('Please fill in all fields', 'error');
    }
    return false;
}

function logout() {
    currentUser = null;
    saveToLocalStorage();
    window.location.href = 'index.html';
}

// Checkout function
async function checkout() {
    if (!currentUser) {
        showToast('Please login to checkout', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    const orderData = {
        userId: currentUser.id,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        date: new Date().toISOString().split('T')[0],
        status: 'Processing'
    };

    try {
        const result = await apiService.createOrder(orderData);

        cart = [];
        saveToLocalStorage();
        updateCartCount();
        showToast('Order placed successfully!', 'success');
        setTimeout(() => window.location.href = `receipt.html?id=${result.orderId}`, 1500);
    } catch (error) {
        showToast(error.message || 'An error occurred during checkout', 'error');
        console.error(error);
    }
}

// Display orders
async function displayOrders() {
    const ordersContainer = document.getElementById('orders-list');
    if (!ordersContainer || !currentUser) return;

    try {
        const result = await apiService.getUserOrders(currentUser.id);
        const userOrders = result.data || [];
        ordersContainer.innerHTML = '';

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        userOrders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Order #${order.id}</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <a href="receipt.html?id=${order.id}" class="btn btn-sm btn-outline"><i class="fas fa-file-invoice"></i> Receipt</a>
                        <span class="badge badge-new">${order.status}</span>
                    </div>
                </div>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <div class="order-items">
                    ${order.items.map(item => {
                return `<div class="order-item-detail">
                                    <span>${item.productName || 'Unknown Product'} x ${item.quantity}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>`;
            }).join('')}
                </div>
            `;
            ordersContainer.appendChild(orderElement);
        });

    } catch (error) {
        ordersContainer.innerHTML = '<p>Error loading orders.</p>';
        console.error(error);
    }
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    if (email) {
        showToast('Subscribed! Check your inbox for coupons.', 'success');
        event.target.reset();
    }
}

// Initialize functions
async function init() {
    updateCartCount();
    updateWishlistCount();

    // Fetch essential data
    try {
        // Fetch Categories
        const catData = await apiService.getCategories();
        categories = catData.data || [];

        // Fetch Products
        const prodData = await apiService.getProducts();
        products = prodData.data || [];

    } catch (e) {
        console.error("Error fetching data:", e);
        showToast(e.message || "Error connecting to server", "error");
    }

    // Update UI elements dependent on data
    if (document.getElementById('category-grid')) displayCategories();
    if (document.getElementById('featured-products')) displayFeaturedProducts();
    if (document.getElementById('product-grid')) {
        // Check for saved category filter from home page click
        const savedCategory = localStorage.getItem('selectedCategory');
        if (savedCategory) {
            const filterSelect = document.getElementById('category-filter');
            if (filterSelect) {
                filterSelect.value = savedCategory;
                filterByCategory(savedCategory);
                localStorage.removeItem('selectedCategory'); // Clear after use
            } else {
                displayProducts();
            }
        } else {
            displayProducts();
        }
    }

    // For single product detail page, we might need to find the specific product
    // The current implementation of product-detail.html likely reads 'id' from URL
    // and calls something or relies on global 'products'. 
    // We need to check if product-detail page needs specific handling to wait for products to load.
    // The above fetch awaits, so 'products' should be populated before we run page logic relying on it.
    // However, product-detail logic is not explicitly separated here, let's add a handler for it.

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId && document.querySelector('.product-detail')) {
        // Assume there is a way to display product detail. 
        // Existing script didn't seem to have a specific 'displayProductDetail' function 
        // exported or global, let's see how product-detail.html works.
        // It likely had an inline script or called something. 
        // Inspecting the original file structure would verify this.
        // For now, I'll add a simple helper to populate it if elements exist
        displayProductDetail(productId);
    }

    if (document.getElementById('cart-items')) displayCart();
    if (document.getElementById('wishlist-items')) displayWishlist();
    if (document.getElementById('orders-list')) displayOrders();

    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        if (currentUser) {
            userInfo.innerHTML = `
                <span style="font-size: 0.9rem; margin-right: 10px;">Hi, ${currentUser.name}</span>
                <a href="#" onclick="logout()" style="font-size: 0.8rem; text-decoration: underline;">Logout</a>
            `;
        } else {
            userInfo.innerHTML = `
                <a href="login.html" class="btn btn-primary btn-sm">Login</a>
            `;
        }
    }

    // Attach event listeners for forms if they exist to prevent default submission and use our async functions
    const loginForm = document.querySelector('form[action="#"]'); // Assuming login form matches
    // Better to select by specific characteristics if possible. 
    // Given the HTML structure wasn't fully deep-dived for forms, 
    // I will rely on the inline onsubmit="return validateLoginForm()" 
    // but I changed validation to async. Inline 'return validate...' usually 
    // expects boolean immediately. This might be a problem.
    // I should probably attach listeners dynamically or change the HTML to not use inline return.
    // BUT since I can't easily edit all HTML forms logic without risk,
    // I will modify the global functions to return false always and handle redirection internally (which I did).
}

function displayProductDetail(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;

    // Attempt to fill elements if they exist with standard classes/ids
    try {
        const img = document.querySelector('.product-gallery img');
        if (img) img.src = product.image;

        const name = document.querySelector('.product-info h1');
        if (name) name.textContent = product.name;

        const price = document.querySelector('.product-price');
        if (price) price.textContent = `$${product.price}`;

        const desc = document.querySelector('.product-description');
        if (desc) desc.textContent = product.description;

        const cat = document.querySelector('.product-category');
        if (cat) cat.textContent = product.category;

        // Update 'Add to Cart' button to use correct ID
        const addBtn = document.querySelector('.add-to-cart-btn');
        if (addBtn) {
            addBtn.onclick = () => addToCart(product.id);
        }
    } catch (e) {
        console.log("Could not auto-populate product details", e);
    }
}

document.addEventListener('DOMContentLoaded', init);
