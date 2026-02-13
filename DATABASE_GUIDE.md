# 📊 Database & Module Guide - Smart KART Shopping System

> **Complete guide to database operations, viewing records, and understanding how each module works**

---

## 📑 Table of Contents

1. [Database Overview](#database-overview)
2. [Database Commands](#database-commands)
3. [Viewing Database Tables & Records](#viewing-database-tables--records)
4. [Module Documentation](#module-documentation)
5. [API Endpoints](#api-endpoints)
6. [Troubleshooting](#troubleshooting)

---

## 🗄️ Database Overview

### Database Type
- **SQLite3** - Lightweight, file-based relational database
- **Database File**: `shopping.db`
- **Location**: Root directory of the project

### Database Schema

#### 1. **Products Table**
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price REAL,
    image TEXT,
    description TEXT,
    stock INTEGER,
    unit TEXT
);
```

#### 2. **Users Table**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    address TEXT
);
```

#### 3. **Orders Table**
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    date TEXT,
    status TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

#### 4. **Order Items Table**
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);
```

#### 5. **Categories Table**
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT
);
```

---

## 💻 Database Commands

### 1. **Access SQLite Database**

#### Open Database in Terminal
```bash
sqlite3 shopping.db
```

#### Exit SQLite Shell
```sql
.exit
```
or press `Ctrl+D`

---

### 2. **View All Tables**

```sql
.tables
```

**Expected Output:**
```
categories    order_items   orders        products      users
```

---

### 3. **View Table Structure**

#### Show Schema for Specific Table
```sql
.schema products
```

#### Show All Table Schemas
```sql
.schema
```

---

### 4. **View Records in Tables**

#### View All Products
```sql
SELECT * FROM products;
```

#### View Products with Formatting
```sql
.mode column
.headers on
SELECT * FROM products;
```

#### View Specific Columns
```sql
SELECT id, name, price, stock FROM products;
```

#### View Products by Category
```sql
SELECT * FROM products WHERE category = 'Fruits';
```

#### Count Products
```sql
SELECT COUNT(*) FROM products;
```

---

#### View All Users
```sql
SELECT * FROM users;
```

#### View User Without Password
```sql
SELECT id, name, email, address FROM users;
```

---

#### View All Categories
```sql
SELECT * FROM categories;
```

---

#### View All Orders
```sql
SELECT * FROM orders;
```

#### View Orders with User Information
```sql
SELECT o.id, u.name, u.email, o.total, o.date, o.status 
FROM orders o 
JOIN users u ON o.user_id = u.id;
```

---

#### View Order Items
```sql
SELECT * FROM order_items;
```

#### View Order Items with Product Details
```sql
SELECT oi.id, o.id as order_id, p.name as product_name, 
       oi.quantity, oi.price, (oi.quantity * oi.price) as subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id;
```

---

### 5. **Insert Data**

#### Insert a New Product
```sql
INSERT INTO products (name, category, price, image, description, stock, unit) 
VALUES ('Fresh Tomatoes', 'Vegetables', 2.99, 'image_url', 'Ripe red tomatoes', 100, 'lb');
```

#### Insert a New User
```sql
INSERT INTO users (name, email, password, address) 
VALUES ('John Doe', 'john@example.com', 'password123', '123 Main St');
```

#### Insert a New Category
```sql
INSERT INTO categories (name, icon) 
VALUES ('Beverages', 'fa-coffee');
```

---

### 6. **Update Data**

#### Update Product Stock
```sql
UPDATE products SET stock = 75 WHERE id = 1;
```

#### Update Product Price
```sql
UPDATE products SET price = 5.99 WHERE name = 'Organic Red Apples';
```

#### Update User Address
```sql
UPDATE users SET address = '456 New St' WHERE email = 'john@example.com';
```

#### Update Order Status
```sql
UPDATE orders SET status = 'Delivered' WHERE id = 1;
```

---

### 7. **Delete Data**

#### Delete a Product
```sql
DELETE FROM products WHERE id = 10;
```

#### Delete a User
```sql
DELETE FROM users WHERE email = 'john@example.com';
```

⚠️ **Warning**: Be careful with DELETE operations. They are permanent!

---

### 8. **Advanced Queries**

#### Search Products by Name
```sql
SELECT * FROM products WHERE name LIKE '%Apple%';
```

#### Get Products Under $5
```sql
SELECT name, price FROM products WHERE price < 5.00 ORDER BY price ASC;
```

#### Get Low Stock Products
```sql
SELECT name, stock FROM products WHERE stock < 30 ORDER BY stock ASC;
```

#### Get Total Revenue from Orders
```sql
SELECT SUM(total) as total_revenue FROM orders;
```

#### Get Orders Count by Status
```sql
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
```

#### Get User's Order History
```sql
SELECT o.id, o.date, o.total, o.status, 
       GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 1
GROUP BY o.id;
```

---

### 9. **Database Maintenance**

#### Backup Database
```bash
# Create a backup
cp shopping.db shopping_backup_$(date +%Y%m%d).db
```

#### Restore Database
```bash
# Restore from backup
cp shopping_backup_20260210.db shopping.db
```

#### Reset Database (Delete and Recreate)
```bash
# Delete existing database
rm shopping.db

# Reinitialize database
node init_db.js
```

#### Vacuum Database (Optimize)
```sql
VACUUM;
```

---

## 🔍 Viewing Database Tables & Records

### Method 1: SQLite Command Line (Recommended)

```bash
# 1. Open database
sqlite3 shopping.db

# 2. Enable better formatting
.mode column
.headers on
.width 5 30 15 10 10

# 3. View products
SELECT id, name, category, price, stock FROM products;

# 4. Exit
.exit
```

---

### Method 2: Using Node.js Script

Create a file `view_db.js`:

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('shopping.db');

// View all products
db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('\n📦 PRODUCTS:');
    console.table(rows);
});

// View all categories
db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('\n📁 CATEGORIES:');
    console.table(rows);
});

// View all users (without passwords)
db.all("SELECT id, name, email, address FROM users", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('\n👥 USERS:');
    console.table(rows);
    
    db.close();
});
```

Run it:
```bash
node view_db.js
```

---

### Method 3: Using DB Browser for SQLite (GUI)

1. Download **DB Browser for SQLite**: https://sqlitebrowser.org/
2. Open `shopping.db` file
3. Browse tables visually
4. Execute SQL queries in the GUI

---

## 📦 Module Documentation

### 1. **database.js** - Database Connection Module

**Purpose**: Establishes SQLite database connection and creates tables

**How It Works**:
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('shopping.db');
```

- Creates/opens `shopping.db` file
- Automatically creates all required tables if they don't exist
- Exports the `db` object for use in other modules

**Usage**:
```javascript
const db = require('./database');
```

**Key Functions**:
- `createTables()` - Creates all database tables on initialization

---

### 2. **init_db.js** - Database Seeding Module

**Purpose**: Populates database with initial sample data

**How It Works**:
- Imports the database connection
- Defines sample products, categories, and users
- Inserts data using prepared statements
- Waits 2 seconds for tables to be created before seeding

**Run It**:
```bash
node init_db.js
```

**What It Seeds**:
- ✅ 12 sample products (fruits, vegetables, dairy, meat, bakery, grains)
- ✅ 6 categories with Font Awesome icons
- ✅ 1 guest user (email: `guest@example.com`, password: `password`)

---

### 3. **config.js** - Configuration Module

**Purpose**: Manages environment-specific configuration

**How It Works**:
- Detects environment (development vs production)
- Sets API base URL, timeout, retry settings
- Exports configuration to `window.APP_CONFIG`

**Configuration Values**:

| Setting | Development | Production |
|---------|------------|------------|
| API_BASE_URL | `http://localhost:3000/api` | `/api` |
| TIMEOUT | 10000ms (10s) | 15000ms (15s) |
| RETRY_ATTEMPTS | 3 | 2 |
| RETRY_DELAY | 1000ms (1s) | 2000ms (2s) |

**Usage in Browser**:
```javascript
console.log(window.APP_CONFIG.API_BASE_URL);
```

---

### 4. **api-service.js** - API Service Layer

**Purpose**: Handles all HTTP requests to the backend with error handling and retry logic

**How It Works**:

#### Class Structure
```javascript
class APIService {
    constructor() {
        // Initialize with config
        // Setup connection monitoring
    }
    
    async request(endpoint, options) {
        // Generic HTTP request with retry logic
    }
    
    // Product Methods
    async getProducts(category)
    async getProduct(id)
    
    // Category Methods
    async getCategories()
    
    // Auth Methods
    async login(email, password)
    async signup(userData)
    
    // Order Methods
    async createOrder(orderData)
    async getUserOrders(userId)
}
```

#### Features
- ✅ **Automatic Retry**: Retries failed requests up to 3 times
- ✅ **Timeout Handling**: Aborts requests after 10 seconds
- ✅ **Connection Monitoring**: Detects online/offline status
- ✅ **Error Handling**: Proper error messages for different status codes
- ✅ **Server Health Check**: Verifies backend is running on initialization

**Usage in Frontend**:
```javascript
// Get all products
const response = await apiService.getProducts();
console.log(response.data);

// Get products by category
const fruits = await apiService.getProducts('Fruits');

// Login
const result = await apiService.login('guest@example.com', 'password');
```

---

### 5. **server.js** - Express Backend Server

**Purpose**: RESTful API server that handles all backend operations

**How It Works**:

#### Server Setup
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));
```

#### Features
- ✅ CORS enabled for cross-origin requests
- ✅ JSON body parsing
- ✅ Static file serving
- ✅ Request logging middleware
- ✅ Error handling middleware
- ✅ Health check endpoint

**Start Server**:
```bash
node server.js
```

**Server Output**:
```
==================================================
🚀 Shopping System Backend Server
==================================================
📡 Server running on: http://localhost:3000
🗄️  Database: shopping.db
⏰ Started at: 2026-02-10T04:13:56.000Z
==================================================
```

---

### 6. **script.js** - Frontend Application Logic

**Purpose**: Main JavaScript file for frontend functionality

**How It Works**:

#### Key Features
1. **Cart Management** (localStorage)
   - Add to cart
   - Remove from cart
   - Update quantities
   - Calculate totals

2. **Wishlist Management** (localStorage)
   - Add to wishlist
   - Remove from wishlist
   - Toggle wishlist items

3. **User Authentication**
   - Login/Logout
   - Signup
   - Session management (localStorage)

4. **Product Display**
   - Load products from API
   - Filter by category
   - Search functionality
   - Sort products

5. **Order Management**
   - Create orders
   - View order history

#### Key Functions

```javascript
// Cart Functions
addToCart(productId)
removeFromCart(productId)
updateCartCount()
calculateCartTotal()

// Wishlist Functions
addToWishlist(productId)
removeFromWishlist(productId)

// Auth Functions
handleLogin(email, password)
handleSignup(userData)
logout()

// Product Functions
loadProducts()
filterByCategory(category)
searchProducts(query)
sortProducts(sortBy)

// Order Functions
placeOrder()
loadUserOrders()
```

---

## 🌐 API Endpoints

### Products

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/products` | Get all products | `?category=Fruits` (optional) |
| GET | `/api/products/:id` | Get single product | `id` in URL |

**Example Response**:
```json
{
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "Organic Red Apples",
            "category": "Fruits",
            "price": 4.99,
            "image": "...",
            "description": "...",
            "stock": 50,
            "unit": "lb"
        }
    ]
}
```

---

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |

**Example Response**:
```json
{
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "Fruits",
            "icon": "fa-apple-alt"
        }
    ]
}
```

---

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/login` | User login | `{ email, password }` |
| POST | `/api/signup` | User registration | `{ name, email, password, address }` |

**Login Request**:
```json
{
    "email": "guest@example.com",
    "password": "password"
}
```

**Login Response**:
```json
{
    "message": "success",
    "data": {
        "id": 1,
        "name": "Guest User",
        "email": "guest@example.com",
        "address": "123 Market St, Food City, FC 90210"
    }
}
```

---

### Orders

| Method | Endpoint | Description | Body/Params |
|--------|----------|-------------|-------------|
| POST | `/api/orders` | Create new order | `{ userId, items, total, date, status }` |
| GET | `/api/orders/:userId` | Get user's orders | `userId` in URL |

**Create Order Request**:
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
    "date": "2026-02-10",
    "status": "Processing"
}
```

**Get Orders Response**:
```json
{
    "message": "success",
    "data": [
        {
            "id": 1,
            "userId": 1,
            "total": 9.98,
            "date": "2026-02-10",
            "status": "Processing",
            "items": [
                {
                    "productId": 1,
                    "productName": "Organic Red Apples",
                    "quantity": 2,
                    "price": 4.99
                }
            ]
        }
    ]
}
```

---

## 🔧 Troubleshooting

### Database Issues

#### Problem: Database file not found
```bash
Error: SQLITE_CANTOPEN: unable to open database file
```

**Solution**:
```bash
# Initialize the database
node init_db.js
```

---

#### Problem: Table doesn't exist
```bash
Error: no such table: products
```

**Solution**:
```bash
# Delete and recreate database
rm shopping.db
node init_db.js
```

---

#### Problem: Database locked
```bash
Error: SQLITE_BUSY: database is locked
```

**Solution**:
- Close all connections to the database
- Restart the server
- Check if another process is using the database

---

### Server Issues

#### Problem: Port already in use
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 node server.js
```

---

#### Problem: apiService is not defined
```bash
ReferenceError: apiService is not defined
```

**Solution**:
Ensure scripts are loaded in correct order in HTML:
```html
<script src="config.js"></script>
<script src="api-service.js"></script>
<script src="script.js"></script>
```

---

### API Issues

#### Problem: CORS errors
```bash
Access to fetch at 'http://localhost:3000/api/products' has been blocked by CORS policy
```

**Solution**:
- Ensure server is running
- Check CORS configuration in `server.js`
- Access frontend through the same origin (http://localhost:3000)

---

#### Problem: Connection refused
```bash
Failed to fetch: net::ERR_CONNECTION_REFUSED
```

**Solution**:
```bash
# Make sure server is running
node server.js

# Check if server is listening
curl http://localhost:3000/health
```

---

## 📚 Quick Reference Commands

### Database Operations
```bash
# View all products
sqlite3 shopping.db "SELECT * FROM products;"

# View all users
sqlite3 shopping.db "SELECT id, name, email FROM users;"

# Count products by category
sqlite3 shopping.db "SELECT category, COUNT(*) FROM products GROUP BY category;"

# Backup database
cp shopping.db backup_$(date +%Y%m%d).db
```

### Server Operations
```bash
# Start server
node server.js

# Start server with custom port
PORT=3001 node server.js

# Check server health
curl http://localhost:3000/health
```

### Testing API Endpoints
```bash
# Get all products
curl http://localhost:3000/api/products

# Get products by category
curl http://localhost:3000/api/products?category=Fruits

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@example.com","password":"password"}'
```

---

## 📝 Notes

- **Default User**: Email: `guest@example.com`, Password: `password`
- **Database File**: `shopping.db` (SQLite)
- **Server Port**: `3000` (configurable via PORT environment variable)
- **Frontend**: Static HTML files served from root directory
- **Data Storage**: Cart and wishlist stored in browser's localStorage

---

## 🎯 Next Steps

1. **Explore the Database**: Use SQLite commands to view and modify data
2. **Test API Endpoints**: Use curl or Postman to test backend APIs
3. **Customize Products**: Add your own products using SQL INSERT commands
4. **Monitor Logs**: Check server console for request logs and errors
5. **Backup Regularly**: Create database backups before making changes

---

**Last Updated**: February 10, 2026  
**Version**: 1.0.0
