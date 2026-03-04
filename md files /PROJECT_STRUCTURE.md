# Shopping System Project Structure

This document provides a comprehensive guide to the files and directories in the project, explaining the role and task of each key component in the new Django-based architecture.

## 📂 Backend (Django)

The backend logic resides in the `backend/` directory. This replaces the old `server.js`.

### `backend/` Root
- **`manage.py`**: The command-line utility for administrative tasks like running the server, making migrations, and creating superusers.
- **`db.sqlite3`**: The SQLite database file where all product, user, and order data is stored.
- **`seed.py`**: A python script used to populate the database with initial products and categories.

### `backend/mysite/` (Project Configuration)
- **`settings.py`**: The main configuration file for the Django project. Controls installed apps, middleware, database connections, and security settings (like CORS).
- **`urls.py`**: The main URL router. It directs incoming web requests to the appropriate app (`api`) or serves the frontend `index.html`.
- **`wsgi.py` / `asgi.py`**: Entry points for WSGI/ASGI web servers to serve your project in production.

### `backend/api/` (Application Logic)
This is where the core business logic lives.
- **`models.py`**: Defines the database structure (Schema). Contains Python classes for `Product`, `Category`, `User`, `Order`, and `OrderItem`.
- **`views.py`**: Contains the logic for handling HTTP requests. Functions here (like `product_list`, `login`, `create_order`) fetch data from the database and return JSON responses.
- **`serializers.py`**: Converts complex data sets (like querysets and model instances) into native Python datatypes that can then be easily rendered into JSON for the API.
- **`urls.py`**: Defines the specific API endpoints (e.g., `/api/products`, `/api/login`) and maps them to the views in `views.py`.
- **`admin.py`**: Configuration for the built-in Django admin interface (if you choose to use it).
- **`apps.py`**: Configuration for the `api` application itself.

---

## 💻 Frontend (Static Files)

The frontend files are served directly by the Django server from the project root.

### Core Files
- **`index.html`**: The main landing page of the shopping application.
- **`styles.css`**: Contains all the CSS styling for the application.
- **`script.js`**: The main JavaScript file handling UI interactions, cart management, and page navigation.
- **`api-service.js`**: The bridge between the frontend and backend. It contains functions to fetch products, login users, and place orders by calling the API endpoints.

### HTML Pages
- **`login.html` / `signup.html`**: User authentication pages.
- **`products.html`**: The main product listing page.
- **`product-detail.html`**: Shows detailed information for a single product.
- **`cart.html`**: Displays the user's shopping cart.
- **`checkout.html`**: The checkout process page.
- **`profile.html`**: User profile and order history page.
- **`orders.html`**: A view of user's past orders.
- **`receipt.html`**: Detailed receipt view for a specific order.

---

## 🛠️ Scripts & Documentation

- **`init_backend.sh`**: A shell script to initialize the backend environment, run migrations, and seed the database automatically.
- **`setup_backend.sh`**: A script to set up the Python virtual environment and install dependencies.
- **`README.md`**: General project documentation.
- **`README_DJANGO.md`**: Specific instructions on how to run and manage the new Django backend.
- **`server.js.bak`**: A backup of the old Express.js server file (no longer in use).
