# 📊 Database Guide - Django & PostgreSQL

> **Complete guide to database operations, models, and migrations**

---

## 📑 Table of Contents

1. [Database Overview](#database-overview)
2. [Models (Schema)](#models-schema)
3. [Database Commands (PostgreSQL)](#database-commands-postgresql)
4. [Using Django ORM](#using-django-orm)
5. [Migrations](#migrations)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

---

## 🗄️ Database Overview

### Database Type
- **PostgreSQL** - Advanced enterprise-class open source relational database.
- **Database Name**: `shopping_db`
- **Location**: Managed by PostgreSQL server (typically `/var/lib/postgresql/data` on Linux).

---

## 🏗️ Models (Schema)

The database schema is defined in `backend/api/models.py`.

#### 1. **Product**
- `name`: CharField(200)
- `category`: CharField(100)
- `price`: DecimalField(10, 2)
- `image`: URLField(500)
- `description`: TextField
- `stock`: IntegerField
- `unit`: CharField(20)

#### 2. **User**
- `name`: CharField(100)
- `email`: EmailField (unique)
- `password`: CharField(100)
- `address`: TextField

#### 3. **Order**
- `user`: ForeignKey(User)
- `total`: DecimalField(10, 2)
- `date`: CharField(100)
- `status`: CharField(50)

#### 4. **OrderItem**
- `order`: ForeignKey(Order)
- `product`: ForeignKey(Product)
- `quantity`: IntegerField
- `price`: DecimalField(10, 2)

#### 5. **Category**
- `name`: CharField(100)
- `icon`: CharField(50)

---

## 💻 Database Commands (PostgreSQL)

### 1. **Access PostgreSQL Database**

#### Open Database in Terminal
```bash
sudo -u postgres psql -d shopping_db
```

#### Exit SQL Shell
```sql
\q
```

---

### 2. **View Tables**

```sql
\dt
```

**Expected Output:**
```
Schema | Name                | Type  | Owner
-------+---------------------+-------+----------
public | api_category        | table | postgres
public | api_product         | table | postgres
public | api_order           | table | postgres
public | api_orderitem       | table | postgres
public | api_user            | table | postgres
...
```
*(Note: Django prefixes table names with the app name `api_`)*

---

### 3. **Common SQL Queries**

#### View All Products
```sql
SELECT * FROM api_product;
```

#### View Recent Orders
```sql
SELECT * FROM api_order ORDER BY date DESC LIMIT 5;
```

---

## 🐍 Using Django ORM

Instead of raw SQL, we recommend using Django's ORM shell.

### 1. Open Django Shell
```bash
cd backend
python manage.py shell
```

### 2. Query Data
```python
from api.models import Product, Order

# Get all products
Product.objects.all()

# Get specific product
p = Product.objects.get(id=1)
print(p.name)

# Filter by category
fruits = Product.objects.filter(category='Fruits')

# Create a new product
Product.objects.create(name='New Item', price=10.99, stock=100)
```

---

## 🔄 Migrations

Migrations handle changes to your models (e.g., adding a field).

### 1. **Make Migrations**
Run this after modifying `models.py`:
```bash
python manage.py makemigrations
```

### 2. **Apply Migrations**
Run this to apply changes to the database:
```bash
python manage.py migrate
```

---

## 📦 Data Seeding

To reset and repopulate the database with sample data:

```bash
cd backend
python seed.py
```

This script:
- Creates categories
- Creates sample products
- Creates default users

---

## 🔧 Troubleshooting

### Database connection failed?
Check `backend/mysite/settings.py` for correct `DATABASES` configuration:
- `ENGINE`: 'django.db.backends.postgresql'
- `NAME`: 'shopping_db'
- `USER`: 'postgres'
- `PASSWORD`: 'password'
- `HOST`: 'localhost'
- `PORT`: '5432'

Ensure PostgreSQL service is running:
```bash
sudo service postgresql status
```

### Migration integrity error?
If you have modified models significantly, you might need to reset migrations:
1. Delete migration files in `backend/api/migrations/` (keep `__init__.py`).
2. Drop the database and recreate it.
3. Run `makemigrations` and `migrate` again.
