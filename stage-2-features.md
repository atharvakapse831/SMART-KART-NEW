# 🚀 Stage 2 — Core Features
> Goal: Auth, full customer experience, complete admin panel.
> Only start this after Stage 1 is fully complete.

---

## 🔐 2.1 Authentication & Role System

- [ ] Add `role` column to users table (`customer` | `admin`)
- [ ] `POST /api/auth/register` — hash password with bcrypt, return JWT
- [ ] `POST /api/auth/login` — verify password, return JWT
- [ ] `GET /api/auth/me` — return current user from token
- [ ] Create `/middleware/auth.js` — verify JWT, attach user to `req.user`
- [ ] Create `/middleware/requireAdmin.js` — 403 if role !== admin
- [ ] Protect all `/api/admin/*` routes with `requireAdmin`
- [ ] Frontend: store JWT in memory (not localStorage)
- [ ] Frontend: AuthContext — provide user state across app
- [ ] Frontend: `PrivateRoute` component — redirect to login if not authenticated
- [ ] Frontend: Login page (uses design system components — no new styles)
- [ ] Frontend: Register page
- [ ] Seed one admin user in `/scripts/seed.js`

---

## 🛒 2.2 Customer — Product Pages

> Skill: frontend-design — Pages must use the design system from Stage 1.
> No new hardcoded colours, fonts, or spacing — variables only.
> Each page needs intentional layout, motion, and atmosphere.

- [ ] `GET /api/products` — list with filters: `?category=&minPrice=&maxPrice=&inStock=&search=`
- [ ] `GET /api/products/:id` — single product detail
- [ ] `GET /api/categories` — all categories

**Frontend Pages:**
- [ ] **Home page**
  - Hero section (bold, memorable — asymmetric or diagonal layout preferred)
  - Featured categories strip
  - Featured products grid
  - Staggered load animation on page entry
- [ ] **Product listing page**
  - Filter sidebar (category, price range, in-stock toggle)
  - Product grid — hover states with lift + quick-add
  - Search bar with live filtering
  - Empty state design
- [ ] **Product detail page**
  - Image, name, price, description, stock badge
  - Add to cart button with quantity selector
  - Related products
- [ ] All pages use CSS variables — zero hardcoded values

---

## 🛍️ 2.3 Cart & Checkout

- [ ] Cart stored in Context/state (persisted to DB for logged-in users)
- [ ] `POST /api/cart` — save cart for logged-in user
- [ ] `GET /api/cart` — load user's cart
- [ ] **Cart page** — item list, quantities (+/-), remove, subtotal
- [ ] Cart icon in navbar shows item count badge
- [ ] **Checkout page** — delivery details form, order summary
- [ ] `POST /api/orders` — create order, deduct stock, clear cart
- [ ] **Order confirmation page** — thank you, order ID, summary

---

## 📦 2.4 Customer — Order History

- [ ] `GET /api/orders/my` — current user's orders (auth required)
- [ ] `GET /api/orders/my/:id` — order detail
- [ ] **Order history page** — list of past orders with status badges
- [ ] **Order detail page** — full breakdown of items, status, total

---

## 🛠️ 2.5 Admin Panel — Products

> Skill: frontend-design — Admin UI: utilitarian/editorial aesthetic.
> Dense, functional, but intentionally designed — not generic CRUD tables.

- [ ] `GET /api/admin/products` — all products (paginated, filterable)
- [ ] `POST /api/admin/products` — create product
- [ ] `PUT /api/admin/products/:id` — update product
- [ ] `DELETE /api/admin/products/:id` — delete product
- [ ] Image upload endpoint (`/api/admin/upload`) — local or Cloudinary

**Admin Frontend:**
- [ ] Admin layout with sidebar (Products / Categories / Orders / Users / Analytics)
- [ ] **Product list page** — table with search, filter, sort; edit & delete actions
- [ ] **Add/Edit product form** — name, description, price, stock, category, image upload
- [ ] Delete confirmation modal (uses base Modal component from Stage 1)
- [ ] Low stock highlighted in red on list

---

## 🏷️ 2.6 Admin Panel — Categories

- [ ] `GET /api/admin/categories`
- [ ] `POST /api/admin/categories`
- [ ] `PUT /api/admin/categories/:id`
- [ ] `DELETE /api/admin/categories/:id`
- [ ] Frontend: Categories management page (list, add, edit, delete inline)
- [ ] Auto-generate slug from name

---

## 📋 2.7 Admin Panel — Orders

- [ ] `GET /api/admin/orders` — all orders, filter by status + date
- [ ] `GET /api/admin/orders/:id` — order detail
- [ ] `PUT /api/admin/orders/:id/status` — update status
- [ ] Frontend: **Orders list page** — table with status badges, date, customer, total
- [ ] Frontend: **Order detail page** — full breakdown + status update dropdown
- [ ] Status options: `pending` → `processing` → `delivered` / `cancelled`

---

## 👥 2.8 Admin Panel — Users

- [ ] `GET /api/admin/users` — all users
- [ ] `PUT /api/admin/users/:id/ban` — ban/unban user
- [ ] Frontend: **Users list page** — table with role badge, join date, ban toggle
- [ ] Frontend: Click user → see their order history

---

## ✅ Stage 2 Done When:

- [ ] Customer can register, login, browse products, add to cart, checkout, view orders
- [ ] Admin can log in, manage products/categories, update order statuses, manage users
- [ ] All pages use design system — zero hardcoded CSS values
- [ ] All admin routes return 403 for non-admins
- [ ] All API endpoints return consistent `{ success, data, message }` format
- [ ] No console errors in browser

---

> ⚡ Antigravity prompts for this stage:
> - *"Build JWT auth with role-based middleware protecting all /admin routes"*
> - *"Build customer product browsing, cart, and checkout using the existing design system variables"*
> - *"Build the admin panel for product, category, order, and user management"*
