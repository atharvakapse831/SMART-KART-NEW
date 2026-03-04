# 📚 Documentation Index - Smart KART Shopping System

> **Central hub for all documentation and guides**

---

## 📖 Available Documentation

### 1. **DATABASE_GUIDE.md** ⭐ (Main Documentation)
**Complete database and module reference**

- 🗄️ Database schema and structure
- 💻 All SQLite commands and queries
- 🔍 How to view tables and records
- 📦 Detailed module documentation
- 🌐 API endpoints reference
- 🔧 Troubleshooting guide

**Best for**: Understanding the entire system, database operations, and module architecture

---

### 2. **QUICK_REFERENCE.md** ⚡
**Essential commands at a glance**

- 🚀 Quick start commands
- 📋 Common database queries
- 🌐 API testing with curl
- 🛠️ Troubleshooting tips
- 💡 Useful tips and tricks

**Best for**: Quick lookups and common operations

---

### 3. **README.md**
**Project overview and setup**

- Project description
- Features list
- Installation instructions
- Basic usage

**Best for**: First-time setup and project overview

---

### 4. **ARCHITECTURE.md**
**System architecture documentation**

- System design
- Component relationships
- Technology stack
- Architecture diagrams

**Best for**: Understanding system design and architecture

---

### 5. **DEVELOPER_GUIDE.md**
**Development guidelines**

- Coding standards
- Development workflow
- Best practices
- Contribution guidelines

**Best for**: Developers working on the codebase

---

## 🛠️ Helper Scripts

### 1. **view_db.js** 👁️
**Quick database viewer**

```bash
node view_db.js
```

**What it does**:
- Shows all database tables
- Displays formatted records
- Shows database statistics
- No interaction needed - just view

**Best for**: Quick database inspection

---

### 2. **db_manager.js** 🎛️
**Interactive database management**

```bash
node db_manager.js
```

**What it does**:
- Interactive menu system
- Add/update/delete products
- View data by category
- Update prices and stock
- View statistics

**Best for**: Managing database through interactive menu

---

### 3. **init_db.js** 🌱
**Database initialization**

```bash
node init_db.js
```

**What it does**:
- Creates database tables
- Seeds sample data
- Sets up initial categories
- Creates test user

**Best for**: First-time setup or database reset

---

## 🎯 Quick Navigation Guide

### I want to...

#### **Learn about the database structure**
→ Read `DATABASE_GUIDE.md` - Section: "Database Overview"

#### **See what's in the database**
→ Run `node view_db.js`

#### **Add or modify products**
→ Run `node db_manager.js` (interactive)  
→ Or use SQL commands from `DATABASE_GUIDE.md`

#### **Understand how modules work**
→ Read `DATABASE_GUIDE.md` - Section: "Module Documentation"

#### **Test API endpoints**
→ Use curl commands from `QUICK_REFERENCE.md`  
→ Or read `DATABASE_GUIDE.md` - Section: "API Endpoints"

#### **Find a specific command**
→ Check `QUICK_REFERENCE.md`

#### **Troubleshoot an issue**
→ Read `DATABASE_GUIDE.md` - Section: "Troubleshooting"  
→ Or check `QUICK_REFERENCE.md` - Section: "Troubleshooting"

#### **Set up the project**
→ Read `README.md`

#### **Understand the architecture**
→ Read `ARCHITECTURE.md`

#### **Start developing**
→ Read `DEVELOPER_GUIDE.md`

---

## 📊 Database Quick Access

### View Database (Read-Only)
```bash
# Formatted view with statistics
node view_db.js

# SQLite shell
sqlite3 shopping.db
```

### Manage Database (Interactive)
```bash
# Interactive menu
node db_manager.js
```

### Reset Database
```bash
# Delete and recreate
rm shopping.db && node init_db.js
```

---

## 🌐 Server Quick Access

### Start Server
```bash
node server.js
```

### Test Server
```bash
# Health check
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products
```

---

## 📝 Common Tasks

### 1. View All Products
```bash
# Option 1: Using viewer script
node view_db.js

# Option 2: Using SQLite
sqlite3 shopping.db "SELECT * FROM products;"

# Option 3: Using API
curl http://localhost:3000/api/products
```

### 2. Add a Product
```bash
# Option 1: Interactive
node db_manager.js
# Then select option 3

# Option 2: Direct SQL
sqlite3 shopping.db "INSERT INTO products (name, category, price, stock, unit) VALUES ('New Product', 'Fruits', 3.99, 50, 'lb');"
```

### 3. Update Product Price
```bash
# Option 1: Interactive
node db_manager.js
# Then select option 4

# Option 2: Direct SQL
sqlite3 shopping.db "UPDATE products SET price = 5.99 WHERE id = 1;"
```

### 4. Check Database Statistics
```bash
# Option 1: Using viewer
node view_db.js

# Option 2: Using manager
node db_manager.js
# Then select option 9
```

---

## 🔍 Search & Filter

### Find Products by Name
```sql
sqlite3 shopping.db "SELECT * FROM products WHERE name LIKE '%Apple%';"
```

### Get Products by Category
```sql
sqlite3 shopping.db "SELECT * FROM products WHERE category = 'Fruits';"
```

### Low Stock Alert
```sql
sqlite3 shopping.db "SELECT name, stock FROM products WHERE stock < 30;"
```

---

## 💾 Backup & Restore

### Create Backup
```bash
cp shopping.db shopping_backup_$(date +%Y%m%d).db
```

### Restore Backup
```bash
cp shopping_backup_20260210.db shopping.db
```

---

## 🎓 Learning Path

### For Beginners:
1. Start with `README.md` - Understand what the project is
2. Read `QUICK_REFERENCE.md` - Learn basic commands
3. Run `node view_db.js` - See the database
4. Try `node db_manager.js` - Practice database operations

### For Developers:
1. Read `ARCHITECTURE.md` - Understand the system design
2. Read `DATABASE_GUIDE.md` - Deep dive into modules
3. Read `DEVELOPER_GUIDE.md` - Follow development practices
4. Experiment with API endpoints using curl

### For Database Management:
1. Read `DATABASE_GUIDE.md` - Complete database reference
2. Use `view_db.js` - Regular database inspection
3. Use `db_manager.js` - Day-to-day operations
4. Refer to `QUICK_REFERENCE.md` - Quick command lookups

---

## 📞 Getting Help

### Error Messages
1. Check `DATABASE_GUIDE.md` - Troubleshooting section
2. Check `QUICK_REFERENCE.md` - Troubleshooting section
3. Check server logs in terminal

### Understanding Modules
1. Read `DATABASE_GUIDE.md` - Module Documentation section
2. Read the actual source code with comments

### API Issues
1. Check `DATABASE_GUIDE.md` - API Endpoints section
2. Test with curl commands from `QUICK_REFERENCE.md`
3. Check server is running: `curl http://localhost:3000/health`

---

## 📦 File Organization

```
shopping system/
├── 📚 Documentation/
│   ├── DATABASE_GUIDE.md       ⭐ Main documentation
│   ├── QUICK_REFERENCE.md      ⚡ Quick commands
│   ├── DOCUMENTATION_INDEX.md  📖 This file
│   ├── README.md               📄 Project overview
│   ├── ARCHITECTURE.md         🏗️  Architecture
│   └── DEVELOPER_GUIDE.md      👨‍💻 Development guide
│
├── 🛠️ Helper Scripts/
│   ├── view_db.js              👁️  Database viewer
│   ├── db_manager.js           🎛️  Database manager
│   └── init_db.js              🌱 Database seeder
│
├── 🔧 Backend/
│   ├── server.js               🚀 API server
│   ├── database.js             🗄️  DB connection
│   └── config.js               ⚙️  Configuration
│
├── 🎨 Frontend/
│   ├── api-service.js          📡 API client
│   ├── script.js               💻 Main logic
│   ├── *.html                  📄 Pages
│   └── styles.css              🎨 Styles
│
└── 💾 Data/
    └── shopping.db             🗄️  SQLite database
```

---

## 🚀 Quick Start Checklist

- [ ] Read `README.md` for project overview
- [ ] Run `node init_db.js` to set up database
- [ ] Run `node view_db.js` to verify database
- [ ] Run `node server.js` to start backend
- [ ] Open `index.html` in browser
- [ ] Bookmark `QUICK_REFERENCE.md` for commands
- [ ] Keep `DATABASE_GUIDE.md` handy for reference

---

## 💡 Pro Tips

1. **Use `view_db.js` regularly** - Quick way to check database state
2. **Backup before experiments** - Always create backups before major changes
3. **Keep server running** - Backend must be running for frontend to work
4. **Check logs** - Server console shows all API requests and errors
5. **Use db_manager.js for quick edits** - Faster than writing SQL

---

## 🔗 Related Resources

- **SQLite Documentation**: https://www.sqlite.org/docs.html
- **Express.js Guide**: https://expressjs.com/
- **Node.js Documentation**: https://nodejs.org/docs/

---

**Last Updated**: February 10, 2026  
**Version**: 1.0.0

---

## 📬 Need More Help?

If you can't find what you're looking for:

1. Check the **Troubleshooting** sections in the guides
2. Review the **source code** - it's well-commented
3. Run the **helper scripts** to inspect the system
4. Check the **server logs** for error messages

**Remember**: The `DATABASE_GUIDE.md` is your most comprehensive resource! 📚
