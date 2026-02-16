/**
 * Professional API Service Layer
 * Handles all backend communication with proper error handling, retries, and logging
 */

class APIService {
    constructor() {
        this.baseURL = window.APP_CONFIG?.API_BASE_URL || '/api';
        this.timeout = window.APP_CONFIG?.TIMEOUT || 10000;
        this.retryAttempts = window.APP_CONFIG?.RETRY_ATTEMPTS || 3;
        this.retryDelay = window.APP_CONFIG?.RETRY_DELAY || 1000;
        this.isOnline = true;

        // Monitor connection status
        this.initConnectionMonitor();
    }

    /**
     * Initialize connection monitoring
     */
    initConnectionMonitor() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectionStatus('Back online', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectionStatus('No internet connection', 'error');
        });

        // Check server health on init
        this.checkServerHealth();
    }

    /**
     * Check if backend server is reachable
     */
    async checkServerHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${this.baseURL}/categories`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log('✅ Backend server is healthy');
                return true;
            } else {
                console.warn('⚠️ Backend server returned error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Backend server is not reachable:', error.message);
            this.showConnectionStatus('Cannot connect to server. Please ensure the backend is running.', 'error');
            return false;
        }
    }

    /**
     * Show connection status to user
     */
    showConnectionStatus(message, type) {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Generic HTTP request with retry logic
     */
    async request(endpoint, options = {}, attempt = 1) {
        // Check if online
        if (!this.isOnline) {
            throw new Error('No internet connection');
        }

        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            ...options
        };

        try {
            console.log(`📡 API Request [${options.method || 'GET'}]: ${endpoint}`);

            const response = await fetch(url, defaultOptions);
            clearTimeout(timeoutId);

            // Handle different status codes
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ API Success: ${endpoint}`, data);
                return data;
            } else if (response.status === 401) {
                throw new Error('Unauthorized. Please login again.');
            } else if (response.status === 404) {
                throw new Error('Resource not found');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Request failed');
            }
        } catch (error) {
            clearTimeout(timeoutId);

            // Handle abort/timeout
            if (error.name === 'AbortError') {
                console.error(`⏱️ Request timeout: ${endpoint}`);

                // Retry logic
                if (attempt < this.retryAttempts) {
                    console.log(`🔄 Retrying... (${attempt}/${this.retryAttempts})`);
                    await this.delay(this.retryDelay * attempt);
                    return this.request(endpoint, options, attempt + 1);
                }

                throw new Error('Request timeout. Please check your connection.');
            }

            // Network error - retry
            if (error.message === 'Failed to fetch' && attempt < this.retryAttempts) {
                console.log(`🔄 Network error, retrying... (${attempt}/${this.retryAttempts})`);
                await this.delay(this.retryDelay * attempt);
                return this.request(endpoint, options, attempt + 1);
            }

            console.error(`❌ API Error: ${endpoint}`, error);
            throw error;
        }
    }

    /**
     * Delay helper for retry logic
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== PRODUCTS ====================

    /**
     * Get all products or filter by category
     */
    async getProducts(category = null) {
        const endpoint = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
        return this.request(endpoint);
    }

    /**
     * Get single product by ID
     */
    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    // ==================== CATEGORIES ====================

    /**
     * Get all categories
     */
    async getCategories() {
        return this.request('/categories');
    }

    // ==================== AUTHENTICATION ====================

    /**
     * User login
     */
    async login(email, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    /**
     * User signup
     */
    async signup(userData) {
        return this.request('/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // ==================== ORDERS ====================

    /**
     * Create new order
     */
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    /**
     * Get user orders
     */
    async getUserOrders(userId) {
        return this.request(`/orders/${userId}`);
    }

    /**
     * Get specific order details
     */
    async getOrder(orderId) {
        return this.request(`/order/${orderId}`);
    }
}

// Create singleton instance
const apiService = new APIService();

// Export for use in other scripts
window.apiService = apiService;
