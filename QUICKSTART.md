# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install & Configure
Run the setup script to install Python dependencies and create the backend environment.
```bash
./setup_backend.sh
```

### Step 2: Initialize Database
Set up PostgreSQL and seed the database with sample data.
```bash
./setup_postgres_db.sh  # May ask for sudo password
./init_backend.sh       # Runs migrations and seeds data
```

### Step 3: Start Server
```bash
cd backend
source venv/bin/activate
python manage.py runserver 3000
```

That's it! Open your browser to `http://localhost:3000`

---

## 📋 What Just Happened?

### 1. Dependencies Installed
- **Django** - Web framework
- **Django REST Framework** - API toolkit
- **Psycopg2** - PostgreSQL adapter
- **Corsheaders** - Cross-origin support

### 2. Database Created (PostgreSQL)
- Products table with sample products
- Categories (Fruits, Vegetables, Dairy, Meat, Bakery, Grains)
- Users table with a guest account
- Orders and OrderItems tables

### 3. Server Started
- Backend API running on port 3000
- Serving both frontend assets and API endpoints
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
{"status":"ok","timestamp":"..."}
```

### Test 2: Get Products
```bash
curl http://localhost:3000/api/products
```

### Test 3: Open in Browser
Navigate to: `http://localhost:3000`

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Try again
python manage.py runserver 3000
```

### Database errors?
Make sure PostgreSQL is running:
```bash
sudo service postgresql status
```
If connection fails, check `backend/mysite/settings.py` for database credentials.

### Can't see products?
1. Open browser console (F12)
2. Check for errors
3. Verify server is running
4. Check Network tab for failed requests

---

## 🎉 You're Ready!
Your professional shopping system is now running with:
- ✅ **Django + PostgreSQL Power**
- ✅ **RESTful API Architecture**
- ✅ **Secure Authentication**
- ✅ **Robust Error Handling**
