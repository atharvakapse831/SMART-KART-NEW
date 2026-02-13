#!/usr/bin/env node

/**
 * Database Viewer Script
 * Quick tool to view all database tables and records
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('shopping.db');

console.log('\n' + '='.repeat(80));
console.log('📊 SMART KART - DATABASE VIEWER');
console.log('='.repeat(80) + '\n');

// View all products
db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
        console.error('❌ Error fetching products:', err);
        return;
    }
    console.log('📦 PRODUCTS (' + rows.length + ' items)');
    console.log('-'.repeat(80));
    console.table(rows.map(p => ({
        ID: p.id,
        Name: p.name,
        Category: p.category,
        Price: '$' + p.price,
        Stock: p.stock,
        Unit: p.unit
    })));
});

// View all categories
db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
        console.error('❌ Error fetching categories:', err);
        return;
    }
    console.log('\n📁 CATEGORIES (' + rows.length + ' items)');
    console.log('-'.repeat(80));
    console.table(rows);
});

// View all users (without passwords)
db.all("SELECT id, name, email, address FROM users", [], (err, rows) => {
    if (err) {
        console.error('❌ Error fetching users:', err);
        return;
    }
    console.log('\n👥 USERS (' + rows.length + ' users)');
    console.log('-'.repeat(80));
    console.table(rows);
});

// View all orders
db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) {
        console.error('❌ Error fetching orders:', err);
        return;
    }
    console.log('\n🛒 ORDERS (' + rows.length + ' orders)');
    console.log('-'.repeat(80));
    if (rows.length > 0) {
        console.table(rows.map(o => ({
            ID: o.id,
            UserID: o.user_id,
            Total: '$' + o.total,
            Date: o.date,
            Status: o.status
        })));
    } else {
        console.log('No orders found.');
    }
});

// View order items with details
db.all(`
    SELECT 
        oi.id,
        oi.order_id,
        p.name as product_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) as subtotal
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
`, [], (err, rows) => {
    if (err) {
        console.error('❌ Error fetching order items:', err);
        return;
    }
    console.log('\n📋 ORDER ITEMS (' + rows.length + ' items)');
    console.log('-'.repeat(80));
    if (rows.length > 0) {
        console.table(rows.map(oi => ({
            ID: oi.id,
            OrderID: oi.order_id,
            Product: oi.product_name,
            Quantity: oi.quantity,
            Price: '$' + oi.price,
            Subtotal: '$' + oi.subtotal.toFixed(2)
        })));
    } else {
        console.log('No order items found.');
    }

    // Statistics
    db.get("SELECT COUNT(*) as count FROM products", [], (err, row) => {
        console.log('\n📊 DATABASE STATISTICS');
        console.log('-'.repeat(80));
        console.log('Total Products:', row.count);
    });

    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        console.log('Total Users:', row.count);
    });

    db.get("SELECT COUNT(*) as count FROM orders", [], (err, row) => {
        console.log('Total Orders:', row.count);
    });

    db.get("SELECT SUM(total) as revenue FROM orders", [], (err, row) => {
        console.log('Total Revenue:', row.revenue ? '$' + row.revenue.toFixed(2) : '$0.00');
    });

    db.get("SELECT SUM(stock) as total_stock FROM products", [], (err, row) => {
        console.log('Total Stock Items:', row.total_stock || 0);
        console.log('\n' + '='.repeat(80) + '\n');

        // Close database connection
        db.close();
    });
});
