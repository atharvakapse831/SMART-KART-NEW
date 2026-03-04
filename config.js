// Environment Configuration
const ENV = {
    development: {
        // Keep relative to current origin so Django and frontend stay in sync during dev
        API_BASE_URL: '/api',
        TIMEOUT: 10000, // 10 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000, // 1 second
    },
    production: {
        API_BASE_URL: '/api', // Relative URL for production
        TIMEOUT: 15000,
        RETRY_ATTEMPTS: 2,
        RETRY_DELAY: 2000,
    }
};

// Detect environment (default to development)
const currentEnv = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'development'
    : 'production';

const config = ENV[currentEnv];

// Export configuration
window.APP_CONFIG = {
    ...config,
    ENV: currentEnv,
    VERSION: '1.0.0'
};

console.log(`🚀 App running in ${currentEnv} mode`);
