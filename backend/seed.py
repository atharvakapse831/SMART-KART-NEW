import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from api.models import ProductCategory, Product, Customer

categories = [
    {"name": "Fruits",     "icon": "fa-apple-alt",      "desc": "Fresh seasonal fruits"},
    {"name": "Vegetables", "icon": "fa-carrot",          "desc": "Farm-fresh vegetables"},
    {"name": "Dairy",      "icon": "fa-cheese",          "desc": "Milk, cheese, butter & more"},
    {"name": "Meat",       "icon": "fa-drumstick-bite",  "desc": "Fresh meats & seafood"},
    {"name": "Bakery",     "icon": "fa-bread-slice",     "desc": "Freshly baked breads & pastries"},
    {"name": "Grains",     "icon": "fa-seedling",        "desc": "Rice, oats, pulses & more"},
]

products = [
    {"name": "Organic Red Apples", "cat": "Fruits", "price": 4.99, "disc": 3.99, "stock": 50, "unit": "lb", "featured": True,
     "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
     "desc": "Fresh, crisp organic red apples from Washington. Perfect for snacking or baking."},
    {"name": "Fresh Whole Milk", "cat": "Dairy", "price": 3.49, "disc": None, "stock": 30, "unit": "gallon",
     "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
     "desc": "Farm-fresh whole milk, rich and creamy. Rich in calcium and Vitamin D."},
    {"name": "Artisan Sourdough Bread", "cat": "Bakery", "price": 5.50, "disc": None, "stock": 20, "unit": "loaf", "featured": True,
     "image": "https://images.unsplash.com/photo-1585478407159-3e466375534f?w=600&q=80",
     "desc": "Rustic sourdough with a crispy crust and soft interior. Baked fresh daily."},
    {"name": "Organic Bananas", "cat": "Fruits", "price": 1.29, "disc": None, "stock": 100, "unit": "lb",
     "image": "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80",
     "desc": "Sweet ripe organic bananas. A perfect energy-boosting snack."},
    {"name": "Free-Range Chicken Breast", "cat": "Meat", "price": 8.99, "disc": 7.49, "stock": 25, "unit": "lb", "featured": True,
     "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80",
     "desc": "Boneless skinless chicken breast from free-range chickens. High protein, low fat."},
    {"name": "Fresh Baby Spinach", "cat": "Vegetables", "price": 3.99, "disc": None, "stock": 40, "unit": "pack",
     "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
     "desc": "Tender baby spinach leaves, pre-washed and ready to eat."},
    {"name": "Aged Cheddar Cheese", "cat": "Dairy", "price": 6.49, "disc": 5.99, "stock": 15, "unit": "block",
     "image": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80",
     "desc": "Sharp and tangy aged cheddar. Pairs excellently with crackers and wine."},
    {"name": "Premium Basmati Rice", "cat": "Grains", "price": 12.99, "disc": None, "stock": 60, "unit": "5lb bag", "featured": True,
     "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
     "desc": "Aromatic long-grain basmati rice. Fluffy texture and delicate flavor."},
    {"name": "Fresh Avocados", "cat": "Vegetables", "price": 2.50, "disc": None, "stock": 45, "unit": "each",
     "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80",
     "desc": "Creamy ripe avocados. Essential for guacamole or avocado toast."},
    {"name": "Atlantic Salmon Fillet", "cat": "Meat", "price": 14.99, "disc": 12.99, "stock": 20, "unit": "lb", "featured": True,
     "image": "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80",
     "desc": "Fresh Atlantic salmon, rich in Omega-3 fatty acids. Sustainably sourced."},
    {"name": "Chocolate Chip Cookies", "cat": "Bakery", "price": 4.99, "disc": None, "stock": 35, "unit": "dozen",
     "image": "https://images.unsplash.com/photo-1499636138143-bd63e7318808?w=600&q=80",
     "desc": "Chewy homemade-style cookies baked with real butter and chocolate chunks."},
    {"name": "Rolled Oats", "cat": "Grains", "price": 3.49, "disc": None, "stock": 55, "unit": "box",
     "image": "https://images.unsplash.com/photo-1614961233913-a55541ae640e?w=600&q=80",
     "desc": "Old-fashioned rolled oats. A heart-healthy breakfast classic."},
]

users = [
    {"name": "Guest User",  "email": "guest@example.com",   "password": "password",  "role": "customer"},
    {"name": "Admin User",  "email": "admin@smartkart.com",  "password": "admin123",  "role": "admin"},
]

print("Seeding categories...")
cat_map = {}
for c in categories:
    obj, _ = ProductCategory.objects.get_or_create(
        category_name=c['name'],
        defaults={'category_description': c['desc'], 'category_icon': c['icon']}
    )
    cat_map[c['name']] = obj
print(f"  {len(cat_map)} categories ready")

print("Seeding products...")
created_count = 0
for p in products:
    if not Product.objects.filter(product_name=p['name']).exists():
        Product.objects.create(
            category=cat_map.get(p['cat']),
            product_name=p['name'],
            product_description=p['desc'],
            product_price=p['price'],
            discount_price=p.get('disc'),
            product_quantity=p['stock'],
            product_image=p['image'],
            unit=p['unit'],
            is_featured=p.get('featured', False),
        )
        created_count += 1
print(f"  {created_count} products created")

print("Seeding customers...")
for u in users:
    if not Customer.objects.filter(customer_email=u['email']).exists():
        c = Customer(customer_name=u['name'], customer_email=u['email'], role=u['role'])
        c.set_password(u['password'])
        c.save()
        print(f"  Created {u['role']}: {u['email']} / {u['password']}")
    else:
        print(f"  Exists: {u['email']}")

print("\nSeed complete!")
print("Login credentials:")
print("  Customer: guest@example.com / password")
print("  Admin:    admin@smartkart.com / admin123")
