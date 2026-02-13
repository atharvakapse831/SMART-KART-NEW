const sqlite3 = require('sqlite3').verbose();
const dbName = 'shopping.db';

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    const productTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            price REAL,
            image TEXT,
            description TEXT,
            stock INTEGER,
            unit TEXT
        );
    `;

    const userTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            address TEXT
        );
    `;

    const ordersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total REAL,
            date TEXT,
            status TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
    `;

    const orderItemsTable = `
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        );
    `;

    const categoriesTable = `
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT
        );
    `;

    db.run(productTable, (err) => {
        if (err) console.error("Error creating products table:", err.message);
    });
    db.run(userTable, (err) => {
        if (err) console.error("Error creating users table:", err.message);
    });
    db.run(ordersTable, (err) => {
        if (err) console.error("Error creating orders table:", err.message);
    });
    db.run(orderItemsTable, (err) => {
        if (err) console.error("Error creating order_items table:", err.message);
    });
    db.run(categoriesTable, (err) => {
        if (err) console.error("Error creating categories table:", err.message);
    });
}

module.exports = db;
