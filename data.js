// Product Data for Smart KART
// Images sourced from Unsplash (free to use)

const products = [
    {
        id: 1,
        name: "Organic Red Apples",
        category: "Fruits",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Fresh, crisp organic red apples imported from Washington. Perfect for snacking or baking pies.",
        stock: 50,
        unit: "lb"
    },
    {
        id: 2,
        name: "Fresh Whole Milk",
        category: "Dairy",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Farm-fresh whole milk, rich and creamy. Source of calcium and Vitamin D.",
        stock: 30,
        unit: "gallon"
    },
    {
        id: 3,
        name: "Artisan Sourdough Bread",
        category: "Bakery",
        price: 5.50,
        image: "https://images.unsplash.com/photo-1585478407159-3e466375534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Rustic sourdough bread with a crispy crust and soft, airy interior. Baked fresh daily.",
        stock: 20,
        unit: "loaf"
    },
    {
        id: 4,
        name: "Organic Bananas",
        category: "Fruits",
        price: 1.29,
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Sweet and ripe organic bananas. A perfect energy-boosting snack or addition to smoothies.",
        stock: 100,
        unit: "lb"
    },
    {
        id: 5,
        name: "Free-Range Chicken Breast",
        category: "Meat",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Boneless, skinless chicken breast from free-range chickens. High protein and low fat.",
        stock: 25,
        unit: "lb"
    },
    {
        id: 6,
        name: "Fresh Baby Spinach",
        category: "Vegetables",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Tender baby spinach leaves, pre-washed and ready to eat. Excellent for salads or cooking.",
        stock: 40,
        unit: "pack"
    },
    {
        id: 7,
        name: "Aged Cheddar Cheese",
        category: "Dairy",
        price: 6.49,
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Sharp and tangy aged cheddar cheese. Distinctive flavor that pairs well with crackers.",
        stock: 15,
        unit: "block"
    },
    {
        id: 8,
        name: "Premium Basmati Rice",
        category: "Grains",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Aromatic long-grain basmati rice. Fluffy texture and delicate flavor.",
        stock: 60,
        unit: "5lb bag"
    },
    {
        id: 9,
        name: "Fresh Avocados",
        category: "Vegetables",
        price: 2.50,
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Creamy ripe avocados. Essential for guacamole or avocado toast.",
        stock: 45,
        unit: "each"
    },
    {
        id: 10,
        name: "Salmon Fillet",
        category: "Meat",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Atlantic salmon fillet, rich in Omega-3 fatty acids. Sustainable and fresh.",
        stock: 20,
        unit: "lb"
    },
    {
        id: 11,
        name: "Chocolate Chip Cookies",
        category: "Bakery",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1499636138143-bd63e7318808?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Chewy homemade-style chocolate chip cookies. Baked with real butter and chocolate chunks.",
        stock: 35,
        unit: "dozen"
    },
    {
        id: 12,
        name: "Rolled Oats",
        category: "Grains",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1614961233913-a55541ae640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Old-fashioned rolled oats. A heart-healthy breakfast option.",
        stock: 55,
        unit: "box"
    }
];

// Mock Users
const users = [
    {
        id: 1,
        name: "Guest User",
        email: "guest@example.com",
        password: "password",
        address: "123 Market St, Food City, FC 90210"
    }
];

// Mock Orders
const orders = [];

// Categories with Icons (for potential future UI use)
const categories = [
    { name: "Fruits", icon: "fa-apple-alt" },
    { name: "Vegetables", icon: "fa-carrot" },
    { name: "Dairy", icon: "fa-cheese" },
    { name: "Meat", icon: "fa-drumstick-bite" },
    { name: "Bakery", icon: "fa-bread-slice" },
    { name: "Grains", icon: "fa-wheat" }
];
