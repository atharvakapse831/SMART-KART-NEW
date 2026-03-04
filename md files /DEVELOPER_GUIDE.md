# Developer Guide - Django Backend Integration

## Overview

This guide explains the backend architecture implemented for the Shopping System, utilizing Django and PostgreSQL.

## Architecture Layers

### 1. Configuration Layer (`config.js`)
**Purpose**: Centralized environment configuration management.

```javascript
const ENV = {
    development: {
        API_BASE_URL: '/api', // Relative path since frontend is served by Django
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },
    // ...
};
```

### 2. API Service Layer (`api-service.js`)
**Purpose**: Abstraction layer for all backend communication.
- Handles retry logic, timeouts, and error parsing.
- Acts as the singleton interface for the frontend.

### 3. Backend Layer (Django)

**Purpose**: Robust web framework handling routing, business logic, and database interactions.

#### a) Models (`backend/api/models.py`)
Defines the database schema using Django's ORM:
- **Product**: `name`, `category`, `price`, `stock`, etc.
- **Order**: linked to `User` via ForeignKey.
- **OrderItem**: linked to `Order` and `Product`.

#### b) Serializers (`backend/api/serializers.py`)
Converts model instances to JSON for the API:
```python
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

#### c) Views (`backend/api/views.py`)
Handles HTTP requests and business logic:
- **@api_view(['GET'])**: Decorator to restrict HTTP methods.
- **Response()**: Returns JSON data.

```python
@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response({'message': 'success', 'data': serializer.data})
```

#### d) URLs (`backend/api/urls.py`)
Maps API endpoints to views:
```python
urlpatterns = [
    path('products', views.product_list, name='product_list'),
    # ...
]
```

## Best Practices Implemented

### 1. Separation of Concerns
- **Frontend**: API Service handles communication, Script handles UI.
- **Backend**: Models handle data, Views handle logic, Serializers handle representation.

### 2. Security
- **CORS**: Configured via `django-cors-headers` to allow specific origins.
- **SQL Injection Protection**: Built-in by Django ORM.
- **CSRF Protection**: Default enabled for non-safe methods (though API views often use token auth, basic session auth is used here for simplicity).

### 3. Database Usage
- **PostgreSQL**: Production-grade database.
- **Migrations**: Changes to models are tracked via `makemigrations` and applied with `migrate`.

## Testing the Implementation

### 1. Test Server Health
```bash
curl http://localhost:3000/health
```

### 2. Test API Endpoints
```bash
# Get products
curl http://localhost:3000/api/products
```

## Deployment Guide

### Production
1. **Database**: Provision a managed PostgreSQL instance (e.g., AWS RDS, Heroku Postgres).
2. **Environment Variables**: Store `SECRET_KEY`, `DB_PASSWORD`, etc., in environment variables.
3. **Static Files**: Run `python manage.py collectstatic` to gather static assets.
4. **WSGI Server**: Use `gunicorn` or `uwsgi` to serve the Django application.
   ```bash
   gunicorn mysite.wsgi:application
   ```

## Monitoring and Logging
Django logs server errors to the console by default. For production, configure `LOGGING` in `settings.py` to write to files or external services (e.g., Sentry).
