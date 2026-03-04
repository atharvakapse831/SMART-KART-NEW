# 🏆 Stage 3 — Production Grade
> Goal: Analytics, exports, PDF invoices, emails, hardening, deployment.
> Only start this after Stage 2 is fully complete and tested.

---

## 📊 3.1 Analytics Dashboard

> Skill: frontend-design — Dashboard cards and charts must follow the
> design system. Use ONE chart library (Chart.js or Recharts) and be consistent.
> Charts should feel part of the app's aesthetic — not default library styles.

**API Endpoints:**
- [ ] `GET /api/admin/analytics/summary` — total revenue, total orders, total users, low stock count
- [ ] `GET /api/admin/analytics/revenue?period=monthly` — revenue over time
- [ ] `GET /api/admin/analytics/top-products` — top 10 best sellers
- [ ] `GET /api/admin/analytics/orders-by-status` — count per status
- [ ] `GET /api/admin/analytics/revenue-by-category`
- [ ] `GET /api/admin/analytics/new-users?period=monthly`

**Frontend Dashboard:**
- [ ] Summary cards row — revenue, orders, users, low stock (with trend arrows)
- [ ] Revenue over time — line chart (monthly/weekly toggle)
- [ ] Best-selling products — horizontal bar chart (top 10)
- [ ] Revenue by category — donut/pie chart
- [ ] Orders by status — stacked bar or donut
- [ ] Low stock alerts table — products below threshold (< 10 units), highlighted
- [ ] New user registrations — line chart
- [ ] Date range filter across all charts
- [ ] Charts styled with CSS variables — override chart library defaults

---

## 📊 3.2 Excel (XLSX) Exports

> Skill: xlsx — All exports must follow strict formatting rules:
> - Professional font (Arial or Times New Roman)
> - Blue text = hardcoded inputs / filter cells users change
> - Black text = ALL formula cells and calculations
> - Green text = cells linking from other sheets
> - Zero formula errors (#REF!, #DIV/0!, #VALUE! etc.)
> - Currency formatted as $#,##0 with units in headers
> - Negative numbers as parentheses (123) not -123
> - All zeros displayed as "-"

- [ ] Install `exceljs` on backend: `npm install exceljs`
- [ ] **Orders Export** (`GET /api/admin/export/orders.xlsx`):
  - Columns: Order ID, Date, Customer, Status, Items Count, Total ($)
  - Date filter cells in blue (user can change date range)
  - Total row with SUM formula in black
  - Status filter dropdown
- [ ] **Products / Inventory Export** (`GET /api/admin/export/inventory.xlsx`):
  - Columns: Product ID, Name, Category, Price ($), Stock Qty, Status
  - Low stock rows highlighted yellow background
  - Stock value column = Price × Qty (black formula)
  - Threshold input cell in blue
- [ ] **Revenue Summary Export** (`GET /api/admin/export/revenue.xlsx`):
  - Monthly revenue breakdown
  - Formulas for totals, averages, % change MoM
  - All formulas in black, all inputs in blue
  - Revenue in $#,##0 format with "Revenue ($)" header
  - Zero values shown as "-"
- [ ] Export buttons in admin analytics dashboard
- [ ] Validate all exports have zero formula errors before returning

---

## 📄 3.3 PDF Invoices & Reports

> Skill: pdf — Use `pdfkit` or `puppeteer` for proper PDF generation.
> NOT just HTML-to-print. Structured, professional, printable PDFs.

- [ ] Install PDF library: `npm install pdfkit` (or puppeteer)
- [ ] **Order Invoice PDF** (`GET /api/orders/:id/invoice.pdf`):
  - Header: store logo, invoice title, invoice number, date
  - Customer section: name, email, delivery address
  - Items table: product name, qty, unit price, line total
  - Subtotal, tax (if applicable), grand total
  - Footer: thank you message, support contact
  - Available on order confirmation page + order history
  - Admin can also download from order detail page
- [ ] **Monthly Sales Report PDF** (`GET /api/admin/reports/monthly.pdf`):
  - Cover page with month/year, store name
  - Summary: total orders, total revenue, new customers
  - Top 5 products table
  - Revenue by category breakdown
  - Page numbers in footer
- [ ] **Inventory Report PDF** (`GET /api/admin/reports/inventory.pdf`):
  - All products with current stock levels
  - Low stock items highlighted
  - Last updated timestamp
- [ ] Add "Download Invoice" button on customer order pages
- [ ] Add report download buttons in admin panel

---

## ✉️ 3.4 Transactional Emails

- [ ] Install email library: `npm install nodemailer` or use Resend API
- [ ] Configure email service in `.env`:
  ```
  EMAIL_HOST=...
  EMAIL_PORT=587
  EMAIL_USER=...
  EMAIL_PASS=...
  EMAIL_FROM=noreply@yourstore.com
  ```
- [ ] Create email templates (HTML) in `/src/templates/emails/`:
  - `order-confirmation.html` — order ID, items, total, delivery info
  - `order-status-update.html` — new status, order link
  - `welcome.html` — welcome message, login link
- [ ] Send order confirmation email on `POST /api/orders`
- [ ] Send status update email when admin changes order status
- [ ] Send welcome email on successful registration
- [ ] All emails are non-blocking (fire-and-forget or queue)
- [ ] Test all templates render correctly

---

## 🔒 3.5 Security Hardening

- [ ] Rate limiting on auth endpoints (`express-rate-limit`):
  - Login: max 10 attempts per 15 min per IP
  - Register: max 5 per hour per IP
- [ ] Helmet.js for HTTP security headers: `npm install helmet`
- [ ] Sanitize all user inputs — no raw user data in DB queries
- [ ] Use parameterized queries EVERYWHERE (no string concatenation in SQL)
- [ ] Validate all request bodies with Zod or Joi
- [ ] Hide stack traces in production error responses
- [ ] CORS configured to only allow your frontend domain in production
- [ ] All passwords hashed with bcrypt (min 12 rounds)
- [ ] JWT expires in 7 days, refresh token strategy (optional but good)

---

## 🧪 3.6 Code Quality

- [ ] Add input validation schemas for every API endpoint
- [ ] All async route handlers wrapped in `asyncHandler` (no unhandled rejections)
- [ ] Consistent API response format everywhere:
  ```json
  { "success": true, "data": {}, "message": "..." }
  { "success": false, "message": "...", "code": "VALIDATION_ERROR" }
  ```
- [ ] Remove all `console.log` debug statements
- [ ] Add structured logging (`winston` or `pino`)
- [ ] No unused packages in `package.json`
- [ ] All environment variables validated on startup (crash if missing)
- [ ] Write at least smoke tests for critical paths:
  - User can register + login
  - Product CRUD
  - Order creation
  - Admin auth guard

---

## 🚀 3.7 Deployment

- [ ] Choose hosting platform: Railway / Render / Fly.io
- [ ] Set up managed PostgreSQL: Neon / Supabase / Railway DB
- [ ] Set all environment variables in production dashboard
- [ ] Ensure `NODE_ENV=production` in prod
- [ ] Build frontend for production
- [ ] Serve frontend static files from backend OR deploy separately (Vercel/Netlify)
- [ ] Configure custom domain
- [ ] Enable HTTPS (usually automatic on above platforms)
- [ ] Test full user flow in production before announcing launch:
  - Register → Browse → Add to cart → Checkout → Receive email
  - Admin login → Manage products → Update order → Download invoice
- [ ] Set up basic uptime monitoring (UptimeRobot — free tier)
- [ ] Set up error tracking (Sentry — free tier): `npm install @sentry/node`

---

## ✅ Stage 3 Done = Production Ready When:

- [ ] Analytics dashboard shows real data with charts
- [ ] All 3 Excel exports download with correct formatting, zero formula errors
- [ ] Order invoices generate as proper PDFs with all order details
- [ ] Customers receive order confirmation emails
- [ ] Rate limiting active on auth endpoints
- [ ] All inputs validated, no SQL injection possible
- [ ] App is live on HTTPS with a real domain
- [ ] Full user flow tested in production

---

> ⚡ Antigravity prompts for this stage:
> - *"Build an analytics dashboard with Chart.js, styled with existing CSS variables, with date range filtering"*
> - *"Create XLSX export endpoints for orders, inventory, and revenue using exceljs with proper colour coding: blue for inputs, black for formulas, zero formula errors"*
> - *"Generate PDF invoices for orders using pdfkit with itemised table, totals, and store header"*
> - *"Add transactional emails with nodemailer for order confirmation, status updates, and welcome"*
> - *"Harden the API: rate limiting, helmet, Zod validation on all endpoints, structured error responses"*
> - *"Deploy to Railway with managed PostgreSQL, configure all env vars, test full flow"*
