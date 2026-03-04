/**
 * Smart KART — API Service
 * Centralized API client with JWT auth, error handling
 */

// Resolve API base once, preferring APP_CONFIG (config.js) but defaulting to current origin.
// This removes hard-coded hosts so the frontend and Django API always talk to the same server.
const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL)
    ? window.APP_CONFIG.API_BASE_URL.replace(/\/$/, '')
    : `${window.location.origin}/api`;

// ─── Token Management ──────────────────────────────────────────────────────

const Auth = {
    getToken() { return localStorage.getItem('sk_access'); },
    getRefresh() { return localStorage.getItem('sk_refresh'); },
    getUser() { try { return JSON.parse(localStorage.getItem('sk_user') || 'null'); } catch { return null; } },
    isLoggedIn() { return !!this.getToken(); },
    isAdmin() { const u = this.getUser(); return u && (u.role === 'admin' || u.role === 'superadmin'); },

    save(data) {
        localStorage.setItem('sk_access', data.access_token);
        localStorage.setItem('sk_refresh', data.refresh_token);
        localStorage.setItem('sk_user', JSON.stringify(data.data));
        window.dispatchEvent(new Event('auth-changed'));
    },

    clear() {
        localStorage.removeItem('sk_access');
        localStorage.removeItem('sk_refresh');
        localStorage.removeItem('sk_user');
        window.dispatchEvent(new Event('auth-changed'));
    }
};

// ─── Core HTTP Client ──────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    // Attempt token refresh on 401
    if (res.status === 401 && Auth.getRefresh() && !options._retry) {
        try {
            const rr = await fetch(`${API_BASE}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: Auth.getRefresh() })
            });
            if (rr.ok) {
                const rd = await rr.json();
                localStorage.setItem('sk_access', rd.access_token);
                localStorage.setItem('sk_refresh', rd.refresh_token);
                return apiFetch(path, { ...options, _retry: true });
            }
        } catch { }
        Auth.clear();
        throw new Error('Session expired. Please log in again.');
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// Convenience wrappers
const api = {
    get: (p) => apiFetch(p),
    post: (p, d) => apiFetch(p, { method: 'POST', body: JSON.stringify(d) }),
    put: (p, d) => apiFetch(p, { method: 'PUT', body: JSON.stringify(d) }),
    delete: (p) => apiFetch(p, { method: 'DELETE' }),
};

// ─── Domain API Helpers ────────────────────────────────────────────────────

// Auth
const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    signup: (d) => api.post('/auth/signup', d),
    me: () => api.get('/auth/me'),
    update: (d) => api.put('/auth/profile', d),
    refresh: (rt) => api.post('/auth/refresh', { refresh_token: rt }),
};

// Products
const productsAPI = {
    list: (params = {}) => apiFetch('/products?' + new URLSearchParams(params)),
    get: (id) => api.get(`/products/${id}`),
    cats: () => api.get('/categories'),
};

// Cart
const cartAPI = {
    get: () => api.get('/cart'),
    add: (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity }),
    update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/${id}`),
    clear: () => api.delete('/cart/clear'),
};

// Orders
const ordersAPI = {
    create: (d) => api.post('/orders', d),
    mine: () => api.get('/orders/my'),
    get: (id) => api.get(`/orders/${id}`),
    coupon: (code, total) => api.post('/validate-coupon', { code, total }),
};

// Admin
const adminAPI = {
    dashboard: () => api.get('/admin/dashboard'),
    // Products
    products: () => api.get('/admin/products'),
    createProduct: (d) => api.post('/admin/products', d),
    updateProduct: (id, d) => api.put(`/admin/products/${id}`, d),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    // Categories
    categories: () => api.get('/admin/categories'),
    createCategory: (d) => api.post('/admin/categories', d),
    updateCategory: (id, d) => api.put(`/admin/categories/${id}`, d),
    deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
    // Orders
    orders: (params = {}) => apiFetch('/admin/orders?' + new URLSearchParams(params)),
    updateOrder: (id, d) => api.put(`/admin/orders/${id}`, d),
    // Users
    customers: () => api.get('/admin/customers'),
    updateCustomer: (id, d) => api.put(`/admin/customers/${id}`, d),
    createCustomer: (d) => api.post('/admin/customers', d),
    deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),
    // Coupons
    coupons: () => api.get('/admin/coupons'),
    createCoupon: (d) => api.post('/admin/coupons', d),
    updateCoupon: (id, d) => api.put(`/admin/coupons/${id}`, d),
    deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
    // Analytics (aggregated)
    categories: () => api.get('/admin/categories'),
};

// ─── UI Helpers ──────────────────────────────────────────────────────────────

function showToast(msg, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

function renderStars(rating, max = 5) {
    let html = '';
    for (let i = 1; i <= max; i++) {
        if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) html += '<i class="fas fa-star-half-alt"></i>';
        else html += '<i class="far fa-star"></i>';
    }
    return html;
}

function formatPrice(n) {
    return '₹' + parseFloat(n || 0).toFixed(2);
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Update nav auth state
function updateNavAuth() {
    const user = Auth.getUser();
    const loginLink = document.getElementById('nav-login');
    const userMenu = document.getElementById('nav-user');
    const userNameEl = document.getElementById('nav-username');
    const adminLink = document.getElementById('nav-admin-link');

    if (loginLink) loginLink.style.display = user ? 'none' : '';
    if (userMenu) userMenu.style.display = user ? 'flex' : 'none';
    if (userNameEl && user) userNameEl.textContent = user.customer_name?.split(' ')[0] || 'Me';
    if (adminLink) adminLink.style.display = Auth.isAdmin() ? '' : 'none';
}

function logout() {
    Auth.clear();
    showToast('Logged out successfully', 'info');
    // Works from any subdirectory (root or admin/)
    const base = window.location.pathname.includes('/admin/') ? '../login.html' : 'login.html';
    setTimeout(() => { window.location.href = base; }, 800);
}

// Cart count badge updater
async function refreshCartCount() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    if (!Auth.isLoggedIn()) {
        // localStorage fallback
        const local = JSON.parse(localStorage.getItem('sk_cart') || '[]');
        badge.textContent = local.length;
        badge.style.display = local.length ? '' : 'none';
        return;
    }
    try {
        const r = await cartAPI.get();
        const count = (r.data || []).length;
        badge.textContent = count;
        badge.style.display = count ? '' : 'none';
    } catch { }
}

// Skeleton loader helper
function skeletonCards(n = 4) {
    return Array(n).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>').join('');
}

// Init on every page
document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();
    refreshCartCount();

    // Dark mode
    const saved = localStorage.getItem('sk_theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('sk_theme', isDark ? 'light' : 'dark');
        });
    }

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // Navbar scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    window.addEventListener('auth-changed', () => {
        updateNavAuth();
        refreshCartCount();
    });
});

// Expose globally
window.Auth = Auth;
window.api = api;
window.apiFetch = apiFetch;
window.authAPI = authAPI;
window.productsAPI = productsAPI;
window.cartAPI = cartAPI;
window.ordersAPI = ordersAPI;
window.adminAPI = adminAPI;
window.showToast = showToast;
window.renderStars = renderStars;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.logout = logout;
window.refreshCartCount = refreshCartCount;
window.skeletonCards = skeletonCards;
