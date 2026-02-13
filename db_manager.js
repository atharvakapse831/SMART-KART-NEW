#!/usr/bin/env node

/**
 * Database Management Script
 * Common database operations made easy
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('shopping.db');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n' + '='.repeat(80));
console.log('🛠️  SMART KART - DATABASE MANAGEMENT');
console.log('='.repeat(80) + '\n');

console.log('Available Operations:');
console.log('1. View all products');
console.log('2. View products by category');
console.log('3. Add new product');
console.log('4. Update product price');
console.log('5. Update product stock');
console.log('6. Delete product');
console.log('7. View all users');
console.log('8. View all orders');
console.log('9. Database statistics');
console.log('0. Exit');
console.log('\n' + '-'.repeat(80) + '\n');

function showMenu() {
    rl.question('Select operation (0-9): ', (choice) => {
        switch (choice) {
            case '1':
                viewAllProducts();
                break;
            case '2':
                viewProductsByCategory();
                break;
            case '3':
                addProduct();
                break;
            case '4':
                updatePrice();
                break;
            case '5':
                updateStock();
                break;
            case '6':
                deleteProduct();
                break;
            case '7':
                viewUsers();
                break;
            case '8':
                viewOrders();
                break;
            case '9':
                showStatistics();
                break;
            case '0':
                console.log('\n👋 Goodbye!\n');
                db.close();
                rl.close();
                return;
            default:
                console.log('❌ Invalid choice. Please try again.\n');
                showMenu();
        }
    });
}

function viewAllProducts() {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error('❌ Error:', err);
            showMenu();
            return;
        }
        console.log('\n📦 ALL PRODUCTS:\n');
        console.table(rows.map(p => ({
            ID: p.id,
            Name: p.name,
            Category: p.category,
            Price: '$' + p.price,
            Stock: p.stock,
            Unit: p.unit
        })));
        console.log('');
        showMenu();
    });
}

function viewProductsByCategory() {
    rl.question('Enter category (Fruits/Vegetables/Dairy/Meat/Bakery/Grains): ', (category) => {
        db.all("SELECT * FROM products WHERE category = ?", [category], (err, rows) => {
            if (err) {
                console.error('❌ Error:', err);
                showMenu();
                return;
            }
            console.log(`\n📦 PRODUCTS IN ${category.toUpperCase()}:\n`);
            if (rows.length > 0) {
                console.table(rows.map(p => ({
                    ID: p.id,
                    Name: p.name,
                    Price: '$' + p.price,
                    Stock: p.stock,
                    Unit: p.unit
                })));
            } else {
                console.log('No products found in this category.');
            }
            console.log('');
            showMenu();
        });
    });
}

function addProduct() {
    console.log('\n➕ ADD NEW PRODUCT\n');
    rl.question('Product name: ', (name) => {
        rl.question('Category: ', (category) => {
            rl.question('Price: ', (price) => {
                rl.question('Stock: ', (stock) => {
                    rl.question('Unit: ', (unit) => {
                        rl.question('Description: ', (description) => {
                            const sql = `INSERT INTO products (name, category, price, image, description, stock, unit) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                            db.run(sql, [name, category, parseFloat(price), '', description, parseInt(stock), unit], function (err) {
                                if (err) {
                                    console.error('❌ Error adding product:', err);
                                } else {
                                    console.log(`\n✅ Product added successfully! ID: ${this.lastID}\n`);
                                }
                                showMenu();
                            });
                        });
                    });
                });
            });
        });
    });
}

function updatePrice() {
    rl.question('Enter product ID: ', (id) => {
        rl.question('Enter new price: ', (price) => {
            db.run("UPDATE products SET price = ? WHERE id = ?", [parseFloat(price), parseInt(id)], function (err) {
                if (err) {
                    console.error('❌ Error updating price:', err);
                } else if (this.changes === 0) {
                    console.log('\n⚠️  Product not found.\n');
                } else {
                    console.log('\n✅ Price updated successfully!\n');
                }
                showMenu();
            });
        });
    });
}

function updateStock() {
    rl.question('Enter product ID: ', (id) => {
        rl.question('Enter new stock quantity: ', (stock) => {
            db.run("UPDATE products SET stock = ? WHERE id = ?", [parseInt(stock), parseInt(id)], function (err) {
                if (err) {
                    console.error('❌ Error updating stock:', err);
                } else if (this.changes === 0) {
                    console.log('\n⚠️  Product not found.\n');
                } else {
                    console.log('\n✅ Stock updated successfully!\n');
                }
                showMenu();
            });
        });
    });
}

function deleteProduct() {
    rl.question('Enter product ID to delete: ', (id) => {
        rl.question('Are you sure? (yes/no): ', (confirm) => {
            if (confirm.toLowerCase() === 'yes') {
                db.run("DELETE FROM products WHERE id = ?", [parseInt(id)], function (err) {
                    if (err) {
                        console.error('❌ Error deleting product:', err);
                    } else if (this.changes === 0) {
                        console.log('\n⚠️  Product not found.\n');
                    } else {
                        console.log('\n✅ Product deleted successfully!\n');
                    }
                    showMenu();
                });
            } else {
                console.log('\n❌ Deletion cancelled.\n');
                showMenu();
            }
        });
    });
}

function viewUsers() {
    db.all("SELECT id, name, email, address FROM users", [], (err, rows) => {
        if (err) {
            console.error('❌ Error:', err);
            showMenu();
            return;
        }
        console.log('\n👥 ALL USERS:\n');
        console.table(rows);
        console.log('');
        showMenu();
    });
}

function viewOrders() {
    db.all(`
        SELECT o.id, u.name as user_name, o.total, o.date, o.status 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id
    `, [], (err, rows) => {
        if (err) {
            console.error('❌ Error:', err);
            showMenu();
            return;
        }
        console.log('\n🛒 ALL ORDERS:\n');
        if (rows.length > 0) {
            console.table(rows.map(o => ({
                ID: o.id,
                User: o.user_name,
                Total: '$' + (o.total || 0).toFixed(2),
                Date: o.date,
                Status: o.status
            })));
        } else {
            console.log('No orders found.');
        }
        console.log('');
        showMenu();
    });
}

function showStatistics() {
    console.log('\n📊 DATABASE STATISTICS\n');
    console.log('-'.repeat(80));

    db.get("SELECT COUNT(*) as count FROM products", [], (err, row) => {
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
    });

    db.get("SELECT AVG(price) as avg_price FROM products", [], (err, row) => {
        console.log('Average Product Price:', row.avg_price ? '$' + row.avg_price.toFixed(2) : '$0.00');
    });

    db.all("SELECT category, COUNT(*) as count FROM products GROUP BY category", [], (err, rows) => {
        console.log('\nProducts by Category:');
        rows.forEach(r => {
            console.log(`  ${r.category}: ${r.count}`);
        });
        console.log('\n' + '-'.repeat(80) + '\n');
        showMenu();
    });
}

// Start the menu
showMenu();
