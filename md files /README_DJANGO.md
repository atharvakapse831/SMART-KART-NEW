# Django Backend Migration

The Express.js backend has been replaced with a Django backend.

## Structure
- `backend/`: Django project root
- `backend/api/`: API application (models, views, serializers)
- `backend/mysite/`: Project settings
- `backend/db.sqlite3`: SQLite database (migrated with seeded data)

## Setup
The backend has been initialized and dependencies installed in `backend/venv`.

## Running the Server
To start the server on port 3000 (replacing the old server):

```bash
cd backend
source venv/bin/activate
python manage.py runserver 3000
```

## API
The API endpoints match the previous Express.js implementation:
- `/api/products`
- `/api/categories`
- `/api/login`
- `/api/signup`
- `/api/orders`

The frontend files (`index.html`, etc.) are served from the root URL.
