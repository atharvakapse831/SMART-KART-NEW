# Shopping System - Professional Backend Integration

A modern e-commerce shopping system with professional backend architecture using Django (Python) and PostgreSQL.

## 🏗️ Architecture Overview

### Frontend
- **HTML5/CSS3/JavaScript** - Modern, responsive UI
- **API Service Layer** - Centralized backend communication
- **Environment Configuration** - Separate dev/prod settings
- **Error Handling** - Comprehensive error management with user feedback

### Backend
- **Django** - Robust Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **PostgreSQL** - Advanced open-source relational database
- **CORS** - Cross-origin resource sharing configuration

## 📁 Project Structure

```
shopping-system/
├── backend/               # Django backend project
│   ├── api/               # API Application (views, models, serializers)
│   ├── mysite/            # Project settings
│   ├── venv/              # Python virtual environment
│   └── manage.py          # Django command-line utility
├── *.html                 # Frontend pages
├── styles.css             # Styling
├── script.js              # Main application logic
├── api-service.js         # API service layer
├── config.js              # Environment configuration
├── setup_backend.sh       # Backend setup script
├── setup_postgres_db.sh   # Database setup script
└── init_backend.sh        # Initialization & migration script
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL
- pip (Python package manager)

### Installation

1. **Setup Backend & Virtual Environment**
   ```bash
   chmod +x setup_backend.sh
   ./setup_backend.sh
   ```

2. **Setup Database**
   ```bash
   chmod +x setup_postgres_db.sh
   ./setup_postgres_db.sh
   # Follow prompts/instructions to ensure database 'shopping_db' and user 'postgres' exist
   ```

3. **Initialize Database & Seed Data**
   ```bash
   chmod +x init_backend.sh
   ./init_backend.sh
   ```

4. **Start the Server**
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver 3000
   ```

5. **Open the Application**
   - Navigate to: `http://localhost:3000`

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Fruits` - Filter by category
- `GET /api/products/:id` - Get single product

### Categories
- `GET /api/categories` - Get all categories

### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:userId` - Get user orders

### Health Check
- `GET /health` - Server health status

## 🎯 Key Features

### Backend (Django)
- **ORM (Object-Relational Mapping)**: Secure and efficient database interactions.
- **Serializers**: Easy conversion of complex data types to JSON.
- **Admin Interface**: Built-in visual database management (at `/admin`).
- **Security**: Built-in protection against SQL injection, XSS, etc.

## 🔧 Configuration

### Development Environment (`config.js`)
```javascript
{
  API_BASE_URL: '/api', // Use relative path since Django serves both
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
}
```

## 📦 Python Dependencies
- `django`
- `djangorestframework`
- `django-cors-headers`
- `psycopg2-binary`

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
ISC
