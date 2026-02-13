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
│  │ • Timeouts   │  │ • Timeout    │  │ • Events     │            │
│  │ • API URLs   │  │ • Errors     │  │ • Storage    │            │
│  └──────────────┘  │ • Logging    │  └──────────────┘            │
│                    │ • Monitor    │                               │
│                    └──────┬───────┘                               │
│                           │                                       │
│                           │ HTTP/REST API                         │
│                           │ (JSON)                                │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Express Middleware                       │  │
│  │                                                              │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────────┐     │  │
│  │  │  CORS  │─▶│ Logger │─▶│ Parser │─▶│ Error Handler│     │  │
│  │  └────────┘  └────────┘  └────────┘  └──────────────┘     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      API Endpoints                           │  │
│  │                                                              │  │
│  │  GET  /health                    Server health check        │  │
│  │  GET  /api/products              Get all products           │  │
│  │  GET  /api/products/:id          Get single product         │  │
│  │  GET  /api/categories            Get categories             │  │
│  │  POST /api/login                 User authentication        │  │
│  │  POST /api/signup                User registration          │  │
│  │  POST /api/orders                Create order               │  │
│  │  GET  /api/orders/:userId        Get user orders            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    database.js                               │  │
│  │                                                              │  │
│  │  • Connection Management                                    │  │
│  │  • Schema Creation                                          │  │
│  │  • Query Execution                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   products   │  │    users     │  │   orders     │            │
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
│  │ categories   │  │ order_items  │                               │
│  │              │  │              │                               │
│  │ • id         │  │ • id         │                               │
│  │ • name       │  │ • order_id   │                               │
│  │ • icon       │  │ • product_id │                               │
│  └──────────────┘  │ • quantity   │                               │
│                    │ • price      │                               │
│                    └──────────────┘                               │
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
│       │   ├─▶ server.js: Login endpoint
│       │   │   │
│       │   │   ├─▶ database.js: Query users table
│       │   │   │   │
│       │   │   │   └─▶ SQLite: SELECT * FROM users WHERE email=? AND password=?
│       │   │   │       │
│       │   │   │       └─▶ Return user data
│       │   │   │
│       │   │   └─▶ Return JSON response
│       │   │
│       │   └─▶ apiService receives response
│       │       │
│       │       ├─▶ Check status code
│       │       ├─▶ Handle errors (retry if needed)
│       │       └─▶ Return data to script.js
│       │
│       └─▶ script.js: Update UI
│           │
│           ├─▶ Save user to localStorage
│           ├─▶ Show success toast
│           └─▶ Redirect to home page


═══════════════════════════════════════════════════════════════════════
                         ERROR HANDLING FLOW
═══════════════════════════════════════════════════════════════════════

Request Initiated
│
├─▶ Timeout Check (10 seconds)
│   │
│   ├─▶ Timeout? ──Yes──▶ Retry (Attempt 1/3)
│   │                     │
│   │                     ├─▶ Wait 1 second
│   │                     └─▶ Retry request
│   │
│   └─▶ No ──▶ Continue
│
├─▶ Network Error?
│   │
│   ├─▶ Yes ──▶ Retry (Attempt 2/3)
│   │           │
│   │           ├─▶ Wait 2 seconds
│   │           └─▶ Retry request
│   │
│   └─▶ No ──▶ Continue
│
├─▶ HTTP Status Check
│   │
│   ├─▶ 401 ──▶ "Unauthorized. Please login again."
│   ├─▶ 404 ──▶ "Resource not found"
│   ├─▶ 500+ ─▶ "Server error. Please try again later."
│   └─▶ 200 ──▶ Success!
│
└─▶ Show user-friendly message


═══════════════════════════════════════════════════════════════════════
                      KEY ARCHITECTURAL BENEFITS
═══════════════════════════════════════════════════════════════════════

✅ Separation of Concerns
   • Config layer handles environment settings
   • API layer handles communication
   • App layer handles business logic
   • Server layer handles endpoints
   • Database layer handles data

✅ Error Resilience
   • Automatic retry on failure
   • Timeout protection
   • User-friendly error messages
   • Connection monitoring

✅ Maintainability
   • Single source of truth for API calls
   • Centralized configuration
   • Consistent error handling
   • Easy to test and debug

✅ Scalability
   • Easy to add new endpoints
   • Simple to extend functionality
   • Clean code structure
   • Modular design

✅ Developer Experience
   • Clear logging
   • Easy debugging
   • Comprehensive documentation
   • Best practices followed
```
