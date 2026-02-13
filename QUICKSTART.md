# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database
```bash
npm run init-db
```

### Step 3: Start Server
```bash
npm start
```

That's it! Open your browser to `http://localhost:3000`

---

## 📋 What Just Happened?

### 1. Dependencies Installed
- **express** - Web server framework
- **sqlite3** - Database
- **cors** - Cross-origin support
- **body-parser** - Request parsing

### 2. Database Created
- Products table with 12 sample products
- Categories (Fruits, Vegetables, Dairy, Meat, Bakery, Grains)
- Users table with a guest account
- Orders and order_items tables

### 3. Server Started
- Backend API running on port 3000
- All endpoints ready to use
- Database connected
- CORS enabled

---

## 🧪 Test Your Setup

### Test 1: Check Server Health
Open a new terminal and run:
```bash
curl http://localhost:3000/health
```

Expected output:
```json
{"status":"ok","timestamp":"2024-01-15T10:30:45.123Z"}
```

### Test 2: Get Products
```bash
curl http://localhost:3000/api/products
```

You should see a JSON array of products.

### Test 3: Open in Browser
Navigate to: `http://localhost:3000`

You should see the shopping system homepage with:
- ✅ Categories displayed
- ✅ Featured products shown
- ✅ Navigation working
- ✅ Cart and wishlist counters

---

## 🔐 Test Login

Use the default account:
- **Email**: `guest@example.com`
- **Password**: `password`

---

## 🎯 Next Steps

1. **Explore the Code**
   - `config.js` - Configuration settings
   - `api-service.js` - API communication layer
   - `script.js` - Application logic
   - `server.js` - Backend server

2. **Read the Documentation**
   - `README.md` - Project overview
   - `DEVELOPER_GUIDE.md` - Architecture details

3. **Customize**
   - Add more products in `init_db.js`
   - Modify styles in `styles.css`
   - Extend API in `server.js`

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Try again
npm start
```

### Database errors?
```bash
# Delete and recreate database
rm shopping.db
npm run init-db
npm start
```

### Can't see products?
1. Open browser console (F12)
2. Check for errors
3. Verify server is running
4. Check Network tab for failed requests

---

## 📞 Need Help?

Check the browser console for detailed error messages:
- 📡 Blue = API request
- ✅ Green = Success
- ❌ Red = Error
- 🔄 Yellow = Retry attempt

---

## 🎉 You're Ready!

Your professional shopping system is now running with:
- ✅ Professional backend architecture
- ✅ Automatic retry logic
- ✅ Error handling
- ✅ Connection monitoring
- ✅ Request logging
- ✅ Clean code structure

Happy coding! 🚀
