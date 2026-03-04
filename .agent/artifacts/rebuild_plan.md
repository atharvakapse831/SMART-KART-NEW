# Smart KART — Full Rebuild Implementation Plan

## Audit Summary (Issues Found)
- ❌ Plain-text passwords — critical security bug
- ❌ No JWT — all routes unprotected
- ❌ No admin panel
- ❌ No persisted cart (only localStorage)
- ❌ No Payment or Delivery tracking
- ❌ No dark mode or mobile hamburger menu
- ❌ `description.substring()` crash when description is null
- ❌ SQLite → needs PostgreSQL
- ❌ DB schema is under-normalized (category stored as string, no Cart/Payment/Delivery tables)
- ❌ No coupon system, no search/filter API, no pagination

---

## Phase 1 — PostgreSQL + Normalized Database Schema

Switch `settings.py` to PostgreSQL. Rebuild all 8 models to match the normalized schema below:

| Table            | Key Fields |
|-----------------|------------|
| `ProductCategory` | id, name, description, status, created_date |
| `Product`        | id, **category (FK)**, name, description, price, discount_price, quantity/stock, image, status, expiry_date, is_featured, rating, tags, unit, weight |
| `Customer`       | id, name, email, phone, address, password (bcrypt), status, role, created_date |
| `Cart`           | id, **customer (FK)**, **product (FK)**, quantity, added_date, status |
| `Order`          | id, **customer (FK)**, date, total_amount, status |
| `OrderItems`     | id, **order (FK)**, **product (FK)**, quantity, unit_price |
| `Payment`        | id, **order (FK)**, date, amount, invoice_no, method, status |
| `Delivery`       | id, **order (FK)**, name, quantity, address, date, status |

FK Flow: `Product → ProductCategory`, `Cart → Customer + Product`, `Order → Customer`, `OrderItems → Order + Product`, `Payment → Order`, `Delivery → Order`

---

## Phase 2 — Django Backend (API Layer)

### Auth
- `POST /api/auth/login` — bcrypt check, returns JWT access + refresh tokens
- `POST /api/auth/signup` — bcrypt hash on creation
- `POST /api/auth/refresh` — new access token from refresh token
- `GET  /api/auth/me` — protected, returns current user profile
- `PUT  /api/auth/profile` — update name, address, password

### Products
- `GET /api/products` — search, filter (category, price range, featured), sort, paginate
- `GET /api/products/:id` — with reviews embedded
- `GET /api/categories`

### Cart (Server-side for logged-in users)
- `GET  /api/cart` — get user's cart
- `POST /api/cart` — add item
- `PUT  /api/cart/:id` — update quantity
- `DELETE /api/cart/:id` — remove item
- `DELETE /api/cart` — clear cart

### Orders
- `POST /api/orders` — creates Order + OrderItems + Payment record
- `GET  /api/orders` — user's order history
- `GET  /api/orders/:id` — order detail

### Coupon
- `POST /api/validate-coupon` — validates code, returns discount

### Admin (role-protected)
- `GET  /api/admin/dashboard` — KPIs
- `GET/POST /api/admin/products` — product CRUD
- `PUT/DELETE /api/admin/products/:id`
- `GET/POST /api/admin/categories`
- `PUT/DELETE /api/admin/categories/:id`
- `GET /api/admin/orders` — all orders with filter
- `PUT /api/admin/orders/:id` — update status
- `GET /api/admin/users`
- `PUT /api/admin/users/:id` — ban/unban, change role
- `GET/POST /api/admin/coupons`
- `PUT/DELETE /api/admin/coupons/:id`
- `GET /api/admin/delivery` — delivery records
- `PUT /api/admin/delivery/:id` — update delivery status

---

## Phase 3 — Frontend Redesign

### Design System (styles.css overhaul)
- Theme: Fresh green `#22C55E`, Inter font, rounded cards, dark mode CSS variables
- Mobile-first responsive grid
- Hamburger menu + mobile bottom nav bar

### Pages to Rebuild
| Page | Key Features |
|------|-------------|
| `index.html` | Hero, category grid, featured products, deals, newsletter |
| `login.html` | Split layout, animated SVG panel, tab switch sign-in/up, strength meter |
| `products.html` | Sidebar filters, search, sort, pagination, skeleton loaders |
| `product-detail.html` | Image gallery, quantity selector, reviews, related products |
| `cart.html` | Server-synced cart, coupon input, price breakdown |
| `checkout.html` | Multi-step: Cart → Address → Payment → Confirm |
| `orders.html` | Order history with status timeline |
| `profile.html` | Edit info, address book, notification prefs |
| `wishlist.html` | Saved products |

### New Pages
| Page | Purpose |
|------|---------|
| `admin/index.html` | Admin dashboard with charts |
| `admin/products.html` | Product CRUD table |
| `admin/orders.html` | Order management |
| `admin/users.html` | User management |
| `admin/coupons.html` | Coupon management |
| `404.html` | Custom error page |

---

## Phase 4 — Auth Page Redesign

- Split layout: animated grocery SVG left panel + form right
- Smooth Sign In / Sign Up tab transition
- Password strength indicator
- Show/hide password toggle
- Remember me + Forgot password
- Loading spinner + success checkmark animation
- Shake animation on error

---

## Phase 5 — Admin Panel

- Separate layout: collapsible sidebar + breadcrumbs
- Dashboard: KPI cards + Revenue chart (Chart.js) + Recent orders table
- Product management: table with search, inline edit, image preview
- Order management: filter by status, update with timestamp
- User management: ban/role controls
- Coupon management: CRUD interface
- Delivery tracking: status updates
- Dark/light mode toggle

---

## Phase 6 — Performance

- Lazy image loading everywhere (`loading="lazy"`)
- Skeleton loaders on all data-heavy sections
- Debounced search
- API pagination
- Custom 404 page

---

## Execution Order

1. ✅ Phase 1: Update PostgreSQL settings + rebuild models
2. ✅ Phase 2: Rebuild views + URLs
3. ⬜ Phase 3: Run migrations + seed data
4. ⬜ Phase 4: Rebuild `styles.css` (design system)
5. ⬜ Phase 5: Rebuild `index.html`, `products.html`, `cart.html`
6. ⬜ Phase 6: Rebuild `login.html`/`signup.html` (auth pages)
7. ⬜ Phase 7: Build admin panel (`admin/` folder)
