# 🗂️ Stage 1 — Project Organisation & Foundation
> Goal: Clean structure, fresh DB, design system, no messy files.
> Complete this entire stage before touching any features.

---

## 📁 1.1 Folder Structure — Backend

Reorganise your backend into this structure before writing any new code:

```
/backend
  /src
    /config         ← DB connection, env config
    /controllers    ← Handle request/response logic
    /services       ← Business logic (no DB calls here)
    /repositories   ← All DB queries live here
    /routes         ← Route definitions only
    /middleware     ← Auth, error handling, validation
    /models         ← Table schemas / type definitions
    /utils          ← Helpers, formatters, constants
  /scripts          ← Seed scripts, migrations
  .env
  .env.example
  server.js / app.js
```

- [ ] Create all folders above (even if empty)
- [ ] Move existing files into correct folders
- [ ] Update all import paths after moving
- [ ] Verify server still starts after reorganisation

---

## 📁 1.2 Folder Structure — Frontend

```
/frontend
  /src
    /assets         ← Fonts, images, icons
    /styles         ← Global CSS, CSS variables, reset
    /components     ← Reusable UI components
      /ui           ← Buttons, inputs, cards, badges
      /layout       ← Navbar, footer, sidebar
    /pages          ← One folder per page
    /hooks          ← Custom hooks (if React)
    /utils          ← Formatters, helpers
    /context        ← Auth context, cart context
    /api            ← All API call functions in one place
```

- [ ] Create all folders above
- [ ] Move existing files into correct folders
- [ ] Update all import paths
- [ ] Verify app still runs after reorganisation

---

## 🗄️ 1.3 Fresh PostgreSQL Setup (Drop SQLite)

> No data to migrate — start completely clean.

- [ ] Uninstall SQLite package (`better-sqlite3` / `sqlite3`)
- [ ] Install PostgreSQL driver (`pg` for Node / `psycopg2-binary` for Python)
- [ ] Create `.env` with:
  ```
  DATABASE_URL=postgresql://user:password@localhost:5432/grocery_db
  PORT=5000
  JWT_SECRET=your_secret_here
  NODE_ENV=development
  ```
- [ ] Add `.env` to `.gitignore`
- [ ] Create `.env.example` (same keys, no real values)
- [ ] Write DB connection file in `/src/config/database.js`
- [ ] Create all tables fresh in PostgreSQL:
  ```sql
  users        (id, name, email, password_hash, role, created_at)
  categories   (id, name, slug)
  products     (id, name, description, price, stock, category_id, image_url, created_at)
  orders       (id, user_id, status, total, created_at, updated_at)
  order_items  (id, order_id, product_id, quantity, unit_price)
  ```
- [ ] Add foreign key constraints between tables
- [ ] Write a seed script (`/scripts/seed.js`) with sample data
- [ ] Verify DB connection works end-to-end

---

## 🎨 1.4 Frontend Design System Setup

> Skill: frontend-design — CRITICAL: Define your entire design system BEFORE
> writing any page components. Every page must use these variables.

### Step 1 — Commit to an Aesthetic Direction
Before writing a single line of CSS, answer these:

- [ ] **Tone**: Choose ONE — organic/fresh, editorial/bold, warm/earthy, clean/minimal, modern dark. Write it down.
- [ ] **Unforgettable detail**: What's the ONE thing users will remember? (Unusual font? Bold hero layout? Colour palette?)
- [ ] **Light or dark** theme as default?
- [ ] **Layout personality**: symmetric grid? asymmetric? magazine-style diagonal flow?

### Step 2 — Create `/styles/variables.css`
- [ ] Define colour palette (dominant + sharp accent — NOT evenly distributed)
  ```css
  :root {
    --color-bg: ...;
    --color-surface: ...;
    --color-primary: ...;
    --color-accent: ...;      /* sharp, memorable accent */
    --color-text: ...;
    --color-text-muted: ...;
    --color-border: ...;
  }
  ```
- [ ] Define typography scale:
  ```css
  --font-display: ...;   /* distinctive display font — NOT Inter/Roboto/Arial */
  --font-body: ...;      /* refined body font */
  --text-xs / sm / md / lg / xl / 2xl / 3xl
  ```
- [ ] Define spacing scale (`--space-1` through `--space-16`)
- [ ] Define border radius, shadow levels, transition speeds

### Step 3 — Create `/styles/global.css`
- [ ] CSS reset / normalize
- [ ] Import Google Fonts or self-hosted fonts (distinctive pairing)
- [ ] Body defaults using variables
- [ ] Scrollbar styling
- [ ] Selection colour
- [ ] Background texture or subtle depth (gradient mesh, noise, pattern) — not flat solid

### Step 4 — Build Base UI Components (use variables only)
- [ ] `Button` — primary, secondary, ghost, danger variants + hover states
- [ ] `Input` / `Textarea` — with focus ring, error state
- [ ] `Card` — with subtle shadow/border, hover lift
- [ ] `Badge` — for status labels (pending, delivered, etc.)
- [ ] `Spinner` / loading state
- [ ] `Modal` / Dialog base

### Step 5 — Layout Components
- [ ] `Navbar` — logo, nav links, cart icon, auth state
- [ ] `Footer`
- [ ] `AdminSidebar` — navigation for admin panel
- [ ] `PageWrapper` — consistent page padding/max-width

---

## ⚙️ 1.5 Backend Base Setup

- [ ] Set up Express (or equivalent) with proper middleware order:
  1. `cors`
  2. `express.json()`
  3. `morgan` (request logger)
  4. Route handlers
  5. Global error handler (last)
- [ ] Create global error handler in `/middleware/errorHandler.js`
  - Always return `{ success: false, message, code }` JSON
  - Never expose stack traces in production
- [ ] Create `asyncHandler` wrapper to avoid try/catch everywhere
- [ ] Set up environment config in `/config/env.js` — validate required vars on startup
- [ ] Add `nodemon` for dev, proper `start` script for prod

---

## ✅ Stage 1 Done When:

- [ ] Server starts cleanly with no errors
- [ ] Frontend runs with no import errors
- [ ] PostgreSQL connection confirmed working
- [ ] Design system variables defined — NOT a single hardcoded colour or font in any component
- [ ] All folders exist and files are in the right place
- [ ] `.env.example` committed, `.env` gitignored

---

> ⚡ Antigravity prompt for this stage:
> *"Reorganise the project into proper frontend and backend folder structures,
> replace SQLite with PostgreSQL using a fresh schema, and set up a CSS design
> system with variables for typography, colour, spacing, and base components.
> No hardcoded styles anywhere."*
