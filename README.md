# Shopping System - Professional Backend Integration

A modern e-commerce shopping system with professional backend architecture using Node.js, Express, and SQLite.

## 🏗️ Architecture Overview

### Frontend
- **HTML5/CSS3/JavaScript** - Modern, responsive UI
- **API Service Layer** - Centralized backend communication
- **Environment Configuration** - Separate dev/prod settings
- **Error Handling** - Comprehensive error management with user feedback

### Backend
- **Express.js** - RESTful API server
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **Request Logging** - Detailed request tracking
- **Error Handling** - Global error middleware

## 📁 Project Structure

```
shopping-system/
├── config.js              # Environment configuration
├── api-service.js         # API service layer with retry logic
├── script.js              # Main application logic
├── server.js              # Express backend server
├── database.js            # Database connection & schema
├── init_db.js             # Database seeding script
├── package.json           # Dependencies & scripts
├── shopping.db            # SQLite database file
├── *.html                 # Frontend pages
└── styles.css             # Styling
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database** (First time only)
   ```bash
   npm run init-db
   ```

3. **Start the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Open the Application**
   - Navigate to: `http://localhost:3000`
   - Or open `index.html` directly in your browser

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Fruits` - Filter by category
- `GET /api/products/:id` - Get single product

### Categories
- `GET /api/categories` - Get all categories

### Authentication
- `POST /api/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- `POST /api/signup` - User registration
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "address": "123 Main St"
  }
  ```

### Orders
- `POST /api/orders` - Create new order
  ```json
  {
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 4.99
      }
    ],
    "total": 9.98,
    "date": "2024-01-15",
    "status": "Processing"
  }
  ```
- `GET /api/orders/:userId` - Get user orders

### Health Check
- `GET /health` - Server health status

## 🎯 Key Features

### API Service Layer (`api-service.js`)
- ✅ **Automatic Retry Logic** - Retries failed requests up to 3 times
- ✅ **Timeout Management** - 10-second timeout with abort controller
- ✅ **Connection Monitoring** - Detects online/offline status
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **Request Logging** - Console logging for debugging
- ✅ **Server Health Check** - Validates backend connectivity on init

### Environment Configuration (`config.js`)
- ✅ **Environment Detection** - Auto-detects dev/prod
- ✅ **Configurable Settings** - Timeout, retry attempts, API URLs
- ✅ **Easy Deployment** - Simple environment switching

### Backend Server (`server.js`)
- ✅ **CORS Configuration** - Proper cross-origin handling
- ✅ **Request Logging** - Timestamp-based request logs
- ✅ **Error Middleware** - Global error handling
- ✅ **404 Handler** - Proper not-found responses
- ✅ **Health Endpoint** - Server status monitoring

## 🔧 Configuration

### Development Environment
```javascript
{
  API_BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}
```

### Production Environment
```javascript
{
  API_BASE_URL: '/api',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 2000
}
```

## 📝 Usage Examples

### Making API Calls

```javascript
// Get all products
const products = await apiService.getProducts();

// Get products by category
const fruits = await apiService.getProducts('Fruits');

// Login user
const result = await apiService.login('user@example.com', 'password');

// Create order
const order = await apiService.createOrder({
  userId: 1,
  items: [...],
  total: 99.99
});
```

### Error Handling

```javascript
try {
  const result = await apiService.login(email, password);
  // Handle success
} catch (error) {
  // Error is automatically handled and displayed to user
  console.error(error.message);
}
```

## 🐛 Debugging

### Check Server Status
```bash
curl http://localhost:3000/health
```

### View Server Logs
The server logs all requests with timestamps:
```
[2024-01-15T10:30:45.123Z] GET /api/products
[2024-01-15T10:30:46.456Z] POST /api/login
```

### Browser Console
Open browser DevTools (F12) to see:
- API request logs (📡)
- Success messages (✅)
- Error messages (❌)
- Retry attempts (🔄)

## 🔒 Security Notes

⚠️ **Important**: This is a development setup. For production:
- Use environment variables for sensitive data
- Implement proper password hashing (bcrypt)
- Add JWT authentication
- Use HTTPS
- Implement rate limiting
- Add input validation and sanitization

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "cors": "^2.8.6",
  "body-parser": "^2.2.2",
  "sqlite3": "^5.1.7"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 🆘 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

### Database errors
- Delete `shopping.db` and run `npm run init-db` again
- Check file permissions

### API connection errors
- Ensure server is running: `npm start`
- Check browser console for detailed error messages
- Verify CORS settings in `server.js`

### Frontend not loading data
- Open browser console (F12)
- Check for JavaScript errors
- Verify scripts are loaded in correct order:
  1. `config.js`
  2. `api-service.js`
  3. `script.js`

## 📞 Support

For issues or questions, please check:
1. Browser console for error messages
2. Server logs for backend issues
3. Network tab in DevTools for API calls

---

**Built with ❤️ using modern web development practices**
