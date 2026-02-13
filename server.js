const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from root

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Endpoints

// Get all products or filter by category
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    let sql = "SELECT * FROM products";
    const params = [];

    if (category) {
        sql += " WHERE category = ?";
        params.push(category);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Get specific product
app.get('/api/products/:id', (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

// Get categories
app.get('/api/categories', (req, res) => {
    const sql = "SELECT * FROM categories";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (row) {
            res.json({
                "message": "success",
                "data": row
            });
        } else {
            res.status(401).json({ "message": "Invalid email or password" });
        }
    });
});

// Signup
app.post('/api/signup', (req, res) => {
    const { name, email, password, address } = req.body;
    const sql = "INSERT INTO users (name, email, password, address) VALUES (?,?,?,?)";
    const params = [name, email, password, address];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, name, email, address }
        });
    });
});

// Create Order
app.post('/api/orders', (req, res) => {
    const { userId, items, total, date, status } = req.body;
    const sqlOrder = "INSERT INTO orders (user_id, total, date, status) VALUES (?,?,?,?)";
    db.run(sqlOrder, [userId, total, date, status || 'Processing'], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const orderId = this.lastID;
        const sqlItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)";

        // Insert items
        // Note: Simple loop for now, ideal would be transaction
        items.forEach(item => {
            db.run(sqlItem, [orderId, item.productId, item.quantity, item.price]);
        });

        res.json({
            "message": "success",
            "orderId": orderId
        });
    });
});

// Get User Orders
app.get('/api/orders/:userId', (req, res) => {
    const sql = `
        SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name 
        FROM orders o 
        LEFT JOIN order_items oi ON o.id = oi.order_id 
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
    `;
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        // Group by order because of join
        const orders = {};
        rows.forEach(row => {
            if (!orders[row.id]) {
                orders[row.id] = {
                    id: row.id,
                    userId: row.user_id,
                    total: row.total,
                    date: row.date,
                    status: row.status,
                    items: []
                };
            }
            if (row.product_id) {
                orders[row.id].items.push({
                    productId: row.product_id,
                    productName: row.product_name,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        res.json({
            "message": "success",
            "data": Object.values(orders)
        });
    });
});

// Get Single Order (For Receipt)
app.get('/api/order/:id', (req, res) => {
    const orderId = req.params.id;

    // First get order and user details
    const sqlOrder = `
        SELECT o.id, o.user_id, o.total, o.date, o.status, 
               u.name as user_name, u.email, u.address
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
    `;

    db.get(sqlOrder, [orderId], (err, order) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!order) {
            res.status(404).json({ "error": "Order not found" });
            return;
        }

        // Get order items
        const sqlItems = `
            SELECT oi.id, oi.quantity, oi.price, p.name as product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;

        db.all(sqlItems, [orderId], (err, items) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }

            // Combine data
            order.items = items;

            res.json({
                "message": "success",
                "data": order
            });
        });
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Shopping System Backend Server');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🗄️  Database: shopping.db`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
    console.log('Available endpoints:');
    console.log('  GET  /health');
    console.log('  GET  /api/products');
    console.log('  GET  /api/products/:id');
    console.log('  GET  /api/categories');
    console.log('  POST /api/login');
    console.log('  POST /api/signup');
    console.log('  POST /api/orders');
    console.log('  GET  /api/orders/:userId');
    console.log('='.repeat(50));
});
