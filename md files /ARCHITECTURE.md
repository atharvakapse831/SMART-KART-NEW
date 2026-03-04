# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Browser)                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  config.js   │  │ api-service  │  │  script.js   │            │
│  │              │  │     .js      │  │              │            │
│  │ Environment  │  │              │  │  Business    │            │
│  │   Config     │─▶│  API Layer   │◀─│   Logic      │            │
│  │              │  │              │  │              │            │
│  │ • Dev/Prod   │  │ • Retry      │  │ • UI Updates │            │
│  │ • Timeouts   │  │ • Errors     │  │ • Events     │            │
│  │ • API URLs   │  │ • Monitor    │  │ • Storage    │            │
│  └──────────────┘  └──────┬───────┘  └──────────────┘            │
│                           │                                       │
│                           │ HTTP/REST API                         │
│                           │ (JSON)                                │
│                           │                                       │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Django/Python)                        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Django Middleware                        │  │
│  │                                                              │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────────┐     │  │
│  │  │  CORS  │─▶│  Auth  │─▶│Session │─▶│   Common     │     │  │
│  │  └────────┘  └────────┘  └────────┘  └──────────────┘     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      API Views (REST Framework)              │  │
│  │                                                              │  │
│  │  GET  /health                   Server health check         │  │
│  │  GET  /api/products             Get all products            │  │
│  │  GET  /api/products/:id         Get single product          │  │
│  │  GET  /api/categories           Get categories              │  │
│  │  POST /api/login                User authentication         │  │
│  │  POST /api/signup               User registration           │  │
│  │  POST /api/orders               Create order                │  │
│  │  GET  /api/orders/:userId       Get user orders             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Django ORM & Models                       │  │
│  │                                                              │  │
│  │  • QuerySet API                                            │  │
│  │  • Migration System                                        │  │
│  │  • Model Validation                                        │  │
│  │  • Database Transactions                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Psycopg2 Adapter                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ api_product  │  │   api_user   │  │  api_order   │            │
│  │              │  │              │  │              │            │
│  │ • id         │  │ • id         │  │ • id         │            │
│  │ • name       │  │ • name       │  │ • user_id    │            │
│  │ • category   │  │ • email      │  │ • total      │            │
│  │ • price      │  │ • password   │  │ • date       │            │
│  │ • image      │  │ • address    │  │ • status     │            │
│  │ • stock      │  └──────────────┘  └──────────────┘            │
│  └──────────────┘                                                  │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐                               │
│  │ api_category │  │ api_orderitem│                               │
│  │              │  │              │                               │
│  │ • id         │  │ • id         │                               │
│  │ • name       │  │ • order_id   │                               │
│  │ • icon       │  │ • product_id │                               │
│  └──────────────┘  │ • quantity   │                               │
│                    │ • price      │                               │
│                    └──────────────┘                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                         DATA FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════

User Action: Click "Login" Button
│
├─▶ script.js: validateLoginForm()
│   │
│   ├─▶ apiService.login(email, password)
│       │
│       ├─▶ HTTP POST to /api/login
│       │   │
│       │   ├─▶ Django URL Resolver: /api/login ➔ views.login
│       │   │   │
│       │   │   ├─▶ views.py: Authenticate User
│       │   │   │   │
│       │   │   │   ├─▶ models.User.objects.get(email=...)
│       │   │   │   │   │
│       │   │   │   │   └─▶ Psycopg2: SELECT * FROM api_user WHERE email=...
│       │   │   │   │       │
│       │   │   │   │       └─▶ Return User instance
│       │   │   │   │
│       │   │   │   └─▶ Serializer: UserSerializer(user).data
│       │   │   │
│       │   │   └─▶ Return JSON Response
│       │   │
│       │   └─▶ apiService receives response
│       │       │
│       │       ├─▶ Check status code
│       │       └─▶ Return data to script.js
│       │
│       └─▶ script.js: Update UI
│           │
│           ├─▶ Save user to localStorage
│           ├─▶ Show success toast
│           └─▶ Redirect to home page


═══════════════════════════════════════════════════════════════════════
                      KEY ARCHITECTURAL BENEFITS
═══════════════════════════════════════════════════════════════════════

✅ Robust Foundation (Django)
   • Secure by default (XSS, CSRF, SQLi protection)
   • Built-in Admin Interface
   • Powerful ORM
   • Scalable architecture (MVT - Model View Template)

✅ Professional Database (PostgreSQL)
   • ACID compliance
   • Concurrent connections
   • Rich data types (JSONB, Arrays)
   • Reliability and performance

✅ RESTful API Design (DRF)
   • Standardized responses
   • Automated serialization
   • Browsable API interface
   • Authentication & Permissions support

✅ Maintainability
   • Clean separation of concerns
   • Clear project structure (backend/frontend split)
   • Easy to extend with new Django apps
```
