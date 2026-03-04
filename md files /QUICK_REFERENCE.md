# 🚀 Quick Reference - Smart KART Shopping System

> **Essential commands and operations at a glance**

---

## 📋 Quick Start Commands

### 1. **Initialize Database**
```bash
node init_db.js
```
Creates database and populates with sample data.

---

### 2. **Start Backend Server**
```bash
node server.js
```
Starts server on `http://localhost:3000`

---

### 3. **View Database**
```bash
node view_db.js
```
Shows all tables and records in a formatted view.

---

### 4. **Access Database Shell**
```bash
sqlite3 shopping.db
```
Opens SQLite interactive shell.

---

## 🗄️ Common Database Queries

### View All Products
```sql
.mode column
.headers on
SELECT id, name, category, price, stock FROM products;
```

### View Products by Category
```sql
SELECT * FROM products WHERE category = 'Fruits';
```

### View All Users
```sql
SELECT id, name, email, address FROM users;
```

### View All Orders
```sql
SELECT * FROM orders;
```

### View Categories
```sql
SELECT * FROM categories;
```

### Search Products
```sql
SELECT * FROM products WHERE name LIKE '%Apple%';
```

### Low Stock Alert
```sql
SELECT name, stock FROM products WHERE stock < 30;
```

### Products Under $5
```sql
SELECT name, price FROM products WHERE price < 5.00;
```

---

## 🔧 Database Maintenance

### Backup Database
```bash
cp shopping.db shopping_backup_$(date +%Y%m%d).db
```

### Reset Database
```bash
rm shopping.db && node init_db.js
```

### Optimize Database
```sql
VACUUM;
```

---

## 🌐 API Testing with curl

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl http://localhost:3000/api/products?category=Fruits
```

### Get Single Product
```bash
curl http://localhost:3000/api/products/1
```

### Get Categories
```bash
curl http://localhost:3000/api/categories
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guest@example.com","password":"password"}'
```

### Create User
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"pass123","address":"123 Main St"}'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [{"productId": 1, "quantity": 2, "price": 4.99}],
    "total": 9.98,
    "date": "2026-02-10",
    "status": "Processing"
  }'
```

### Get User Orders
```bash
curl http://localhost:3000/api/orders/1
```

---

## 📝 Quick SQL Operations

### Insert Product
```sql
INSERT INTO products (name, category, price, image, description, stock, unit) 
VALUES ('Fresh Tomatoes', 'Vegetables', 2.99, 'url', 'Ripe tomatoes', 100, 'lb');
```

### Update Product Price
```sql
UPDATE products SET price = 5.99 WHERE id = 1;
```

### Update Stock
```sql
UPDATE products SET stock = stock - 5 WHERE id = 1;
```

### Delete Product
```sql
DELETE FROM products WHERE id = 10;
```

### Count Products by Category
```sql
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category;
```

---

## 🔍 Useful Queries

### Total Revenue
```sql
SELECT SUM(total) as revenue FROM orders;
```

### Orders by Status
```sql
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;
```

### User Order History
```sql
SELECT o.id, o.date, o.total, o.status 
FROM orders o 
WHERE o.user_id = 1;
```

### Top 5 Most Expensive Products
```sql
SELECT name, price 
FROM products 
ORDER BY price DESC 
LIMIT 5;
```

### Products Out of Stock
```sql
SELECT name, stock 
FROM products 
WHERE stock = 0;
```

---

## 🛠️ Troubleshooting

### Server Won't Start (Port in Use)
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Locked
```bash
# Close all connections and restart
pkill -f "node server.js"
node server.js
```

### Reset Everything
```bash
rm shopping.db
node init_db.js
node server.js
```

---

## 📦 File Structure

```
shopping system/
├── database.js          # Database connection
├── init_db.js          # Database seeding
├── server.js           # Backend API server
├── config.js           # Configuration
├── api-service.js      # Frontend API client
├── script.js           # Frontend logic
├── view_db.js          # Database viewer script
├── shopping.db         # SQLite database file
├── *.html              # Frontend pages
└── styles.css          # Styles
```

---

## 🎯 Default Credentials

**Test User:**
- Email: `guest@example.com`
- Password: `password`

---

## 📚 Documentation Files

- `DATABASE_GUIDE.md` - Complete database & module documentation
- `QUICK_REFERENCE.md` - This file
- `README.md` - Project overview
- `ARCHITECTURE.md` - System architecture
- `DEVELOPER_GUIDE.md` - Development guide

---

## 🚦 Server Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get product by ID |
| `/api/categories` | GET | Get all categories |
| `/api/login` | POST | User login |
| `/api/signup` | POST | User registration |
| `/api/orders` | POST | Create order |
| `/api/orders/:userId` | GET | Get user orders |

---

## 💡 Tips

1. **Always backup** before making database changes
2. **Use transactions** for multiple related operations
3. **Check server logs** for debugging
4. **Test API endpoints** with curl before frontend integration
5. **Use view_db.js** for quick database inspection

---

**Last Updated**: February 10, 2026  
**Version**: 1.0.0
