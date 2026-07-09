<div align="center">

# VitaBoost+

### A production-grade herbal supplement storefront with a full admin CMS, custom-built end-to-end on TanStack Start.

![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.x-EF4444?logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_+_RLS-3ECF8E?logo=supabase&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-Report-FF6E40)
![Tests](https://img.shields.io/badge/tests-23%2F23_passing-brightgreen)

**Live preview →** https://id-preview--26cca4ef-2670-42c2-9a7b-13ec98b71851.lovable.app  
**Production →** https://vitaboostavijit.lovable.app

</div>

---

## 1. About the project

VitaBoost+ is a single-product Direct-to-Consumer (D2C) storefront for a herbal
immunity supplement. It is **not** a template or a no-code export &mdash; every
route, server function, RLS policy, component and test in this repository is
hand-authored.

The project demonstrates a complete, real-world SaaS slice:

- A conversion-focused public **landing page** (hero, benefits, ingredients, how-to-use, reviews, FAQ, order form, footer) driven entirely by database content.
- A **place-an-order** flow with server-side validation, stock check and price computation &mdash; no client-trusted totals.
- A **role-gated admin CMS** where store owners can manage the product, benefits, ingredients, FAQs, testimonials, orders and storefront settings.
- A **hardened backend** on Postgres with Row-Level Security, a `user_roles` table, a `has_role()` security-definer helper and column-level grants.
- A **custom Playwright + Allure test suite** covering 23 end-to-end scenarios across storefront, ordering, authentication, admin CRUD and SEO.

---

## 2. Feature tour (screenshots)

Every image below is captured directly by the automated Playwright suite &mdash;
if a feature regresses, the screenshot regenerates and the test fails.

### 2.1 Storefront

| Hero | Benefits | Ingredients |
|:---:|:---:|:---:|
| ![Hero](tests/e2e/screenshots/01_landing_hero.png) | ![Benefits](tests/e2e/screenshots/02_landing_benefits.png) | ![Ingredients](tests/e2e/screenshots/03_landing_ingredients.png) |

| Reviews | FAQ | Footer |
|:---:|:---:|:---:|
| ![Reviews](tests/e2e/screenshots/04_landing_reviews.png) | ![FAQ](tests/e2e/screenshots/05_landing_faq.png) | ![Footer](tests/e2e/screenshots/06_landing_footer.png) |

### 2.2 Responsive design

<img src="tests/e2e/screenshots/07_landing_mobile.png" width="360" alt="Mobile viewport" />

### 2.3 Order flow (Cash-on-Delivery + Online)

| Order form | COD confirmation | Online confirmation |
|:---:|:---:|:---:|
| ![Order form](tests/e2e/screenshots/08_order_form.png) | ![COD confirmed](tests/e2e/screenshots/09_order_confirmed.png) | ![Online confirmed](tests/e2e/screenshots/10_order_online_confirmed.png) |

### 2.4 Authentication

| Sign-in page | Invalid credentials toast | Successful redirect to /admin |
|:---:|:---:|:---:|
| ![Sign in](tests/e2e/screenshots/11_auth_signin.png) | ![Invalid](tests/e2e/screenshots/12_auth_invalid.png) | ![Redirect](tests/e2e/screenshots/13_auth_success_redirect.png) |

### 2.5 Admin CMS

| Dashboard | Orders | Product |
|:---:|:---:|:---:|
| ![Dashboard](tests/e2e/screenshots/14_admin_dashboard.png) | ![Orders](tests/e2e/screenshots/15_admin_orders.png) | ![Product](tests/e2e/screenshots/16_admin_product.png) |

| Benefits list | New-benefit dialog | After create |
|:---:|:---:|:---:|
| ![Benefits](tests/e2e/screenshots/17_admin_benefits.png) | ![Dialog](tests/e2e/screenshots/17b_admin_benefit_dialog.png) | ![Created](tests/e2e/screenshots/18_admin_benefits_created.png) |

| Ingredients | Testimonials | FAQ | Settings |
|:---:|:---:|:---:|:---:|
| ![Ingredients](tests/e2e/screenshots/19_admin_ingredients.png) | ![Testimonials](tests/e2e/screenshots/20_admin_testimonials.png) | ![FAQ](tests/e2e/screenshots/21_admin_faq.png) | ![Settings](tests/e2e/screenshots/22_admin_settings.png) |

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **TanStack Start v1** (Vite 7) | Full-stack React 19 with SSR, file-based routing, typed server functions. |
| Language | **TypeScript, strict mode** | Compile-time safety across client, server functions and DB types. |
| UI | **Tailwind CSS v4 + shadcn/ui + Radix primitives** | Design-token-driven, accessible components. |
| Data layer | **TanStack Query** | Suspense-based loaders, per-request cache, SSR-safe. |
| Backend | **Supabase (Postgres + Auth + PostgREST)** | Managed Postgres with Row-Level Security. |
| Server logic | **`createServerFn` from `@tanstack/react-start`** | Typed RPC for order placement and landing data. |
| Validation | **Zod** | Every server function validates input before hitting the DB. |
| Testing | **Playwright (Python) + pytest + Allure** | Real-browser E2E with rich HTML reporting. |
| Hosting | Cloudflare Workers (edge runtime) | Global low-latency SSR. |

---

## 4. Architecture

```mermaid
graph TB
    subgraph Client["Browser (SSR + CSR)"]
        UI[React 19 UI<br/>Tailwind v4 + shadcn/ui]
        Router[TanStack Router<br/>File-based routes]
        Query[TanStack Query<br/>Suspense cache]
    end

    subgraph Edge["Cloudflare Workers (Edge Runtime)"]
        SSR[TanStack Start SSR]
        SF[Server Functions<br/>createServerFn + Zod<br/>getLandingData / submitOrder]
        API[Public API Routes<br/>/api/public/*]
    end

    subgraph Backend["Supabase (Postgres)"]
        Auth[Auth<br/>JWT + Sessions]
        DB[(Postgres<br/>+ RLS Policies)]
        Roles[user_roles<br/>has_role SECURITY DEFINER]
    end

    UI --> Router
    Router --> Query
    Query -->|typed RPC| SF
    Router -->|SSR request| SSR
    SSR --> SF
    SF -->|supabase-js| DB
    SF --> Auth
    UI -->|sign in| Auth
    DB -.->|RLS check| Roles
    API --> DB
```


### 4.1 Route map

```
/                      → public landing (SSR, TanStack Query loader)
/auth                  → sign-in / sign-up (client-only)
/_authenticated        → route gate: redirects to /auth if signed out
  /admin               → admin shell (checks user_roles.role = 'admin')
    /admin             → dashboard KPIs
    /admin/orders      → orders table + status updates + CSV export
    /admin/product     → product editor (name, price, stock, media, usage)
    /admin/benefits    → CRUD
    /admin/ingredients → CRUD
    /admin/testimonials→ CRUD + approval toggle
    /admin/faq         → CRUD
    /admin/settings    → store name, contact, socials
```

### 4.2 Database schema

| Table | Purpose | Public read? |
|---|---|---|
| `product` | Single-product row (name, price, discount, stock, media, usage). | ✅ |
| `benefits` | Landing "why choose us" tiles. | ✅ |
| `ingredients` | Ingredient cards with imagery. | ✅ |
| `testimonials` | Customer reviews with `approved` flag. | ✅ (only `approved = true`) |
| `faq` | Landing FAQ accordion. | ✅ |
| `settings` | Store name, phone, email, socials. | ✅ (safe columns only) |
| `orders` | Customer orders (name, phone, address, qty, total, status). | ❌ (admin only) |
| `user_roles` | `(user_id, role)` with `app_role` enum. | ❌ |

---

## 5. Security model

- **RLS enabled on every table** in `public`. No default read/write.
- `user_roles` is a **separate table** &mdash; roles are never stored on a profile row (prevents privilege-escalation via profile updates).
- `public.has_role(uuid, app_role)` is `SECURITY DEFINER` with a locked `search_path`; RLS policies call it instead of subquerying `user_roles` directly (no recursion, no leaks).
- Admin content policies use `has_role(auth.uid(), 'admin')` for both `USING` and `WITH CHECK`.
- Anonymous order placement is allowed but constrained: `WITH CHECK` enforces `status = 'pending'`, payment method whitelist, and name length bounds.
- Public reads on `settings` are **column-level granted** so future columns don't auto-leak.
- `submitOrder` re-derives the total server-side from the DB price &mdash; the client-supplied total is never trusted.

---

## 6. End-to-end tests

The suite lives in [`tests/e2e/`](tests/e2e) and is a **custom Playwright /
pytest / Allure setup** (no scaffolder).

```
tests/e2e/
├── conftest.py           # Playwright fixtures + Allure attachments
├── pytest.ini
├── test_landing.py       # 7 tests  – hero, sections, FAQ, footer, mobile
├── test_order_flow.py    # 2 tests  – COD + Online order placement
├── test_auth.py          # 3 tests  – sign-in form, invalid creds, success
├── test_admin.py         # 8 tests  – every admin page + benefits CRUD
├── test_seo.py           # 3 tests  – title, meta, single H1, JSON-LD
├── capture_allure.py     # screenshots the rendered Allure report
└── run.sh                # one-shot: pytest → allure generate → screenshots
```

### 6.1 Testing architecture

```mermaid
graph LR
    subgraph Suite["tests/e2e/ — Playwright + pytest"]
        Landing[test_landing.py<br/>7 tests]
        Order[test_order_flow.py<br/>2 tests]
        AuthT[test_auth.py<br/>3 tests]
        Admin[test_admin.py<br/>8 tests]
        SEO[test_seo.py<br/>3 tests]
    end

    subgraph Runner["run.sh"]
        Pytest[pytest --alluredir]
        Gen[allure generate]
        Cap[capture_allure.py<br/>headless report screenshots]
    end

    subgraph App["App Under Test"]
        Local[localhost:8080<br/>or published URL]
    end

    subgraph Output["Artifacts"]
        Shots[screenshots/*.png<br/>feature evidence]
        Results[allure-results/<br/>JSON + attachments]
        Report[allure-report/<br/>interactive HTML]
        AShots[screenshots/allure/*.png<br/>report views]
        RM[README.md<br/>embeds both galleries]
    end

    Landing & Order & AuthT & Admin & SEO -->|drive Chromium| Local
    Landing & Order & AuthT & Admin & SEO -->|attach| Results
    Landing & Order & AuthT & Admin & SEO -->|save| Shots
    Pytest --> Results
    Results --> Gen
    Gen --> Report
    Report --> Cap
    Cap --> AShots
    Shots --> RM
    AShots --> RM
```

### 6.2 Run it



```bash
python -m pip install pytest pytest-playwright allure-pytest
python -m playwright install chromium

# App must be running on http://localhost:8080 (bun dev / vite dev)
bash tests/e2e/run.sh
```

Override targets:

```bash
E2E_BASE_URL=https://vitaboostavijit.lovable.app \
E2E_ADMIN_EMAIL=you@example.com \
E2E_ADMIN_PASSWORD=... \
python -m pytest tests/e2e
```

### 6.3 Allure report

```
23 tests · 5 suites · 2 features · 0 failures
```

| Overview | Suites | Behaviors |
|:---:|:---:|:---:|
| ![Overview](tests/e2e/screenshots/allure/allure_overview.png) | ![Suites](tests/e2e/screenshots/allure/allure_suites.png) | ![Behaviors](tests/e2e/screenshots/allure/allure_behaviors.png) |

| Graphs | Timeline | Packages |
|:---:|:---:|:---:|
| ![Graphs](tests/e2e/screenshots/allure/allure_graphs.png) | ![Timeline](tests/e2e/screenshots/allure/allure_timeline.png) | ![Packages](tests/e2e/screenshots/allure/allure_packages.png) |

Open the full interactive report locally with:

```bash
npx http-server tests/e2e/allure-report -p 8765
# or
allure open tests/e2e/allure-report
```

---

## 7. Local development

```bash
# Install
bun install                # or: npm install / pnpm install

# Env vars (auto-generated by the Lovable Cloud integration)
# .env – already contains:
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_PUBLISHABLE_KEY
#   VITE_SUPABASE_PROJECT_ID

# Dev server
bun dev                    # http://localhost:8080

# Type-check
bunx tsgo --noEmit

# Production build
bun run build
```

### Admin bootstrap

An admin account is seeded (email + password stored in the auth provider).
To promote another user, run:

```sql
insert into public.user_roles (user_id, role)
values ('<uuid-from-auth.users>', 'admin');
```

---

## 8. Project layout

```
src/
├── routes/                    # File-based TanStack routes
│   ├── __root.tsx             # HTML shell + head metadata
│   ├── index.tsx              # / landing page
│   ├── auth.tsx               # /auth
│   └── _authenticated/
│       ├── route.tsx          # Auth gate (redirect to /auth)
│       ├── admin.tsx          # Admin shell + role check
│       ├── admin.index.tsx
│       ├── admin.orders.tsx
│       ├── admin.product.tsx
│       ├── admin.benefits.tsx
│       ├── admin.ingredients.tsx
│       ├── admin.testimonials.tsx
│       ├── admin.faq.tsx
│       └── admin.settings.tsx
├── components/
│   ├── landing/               # Hero, Benefits, Ingredients, Reviews, …
│   ├── admin/                 # AdminSidebar, CrudPage (generic CMS)
│   └── ui/                    # shadcn primitives
├── lib/
│   ├── landing.functions.ts   # createServerFn: getLandingData, submitOrder
│   └── landing-assets.ts
├── integrations/supabase/     # Auto-generated client + types
└── styles.css                 # Tailwind v4 tokens + design system
supabase/migrations/           # SQL migrations (schema, RLS, policies, roles)
tests/e2e/                     # Playwright + Allure suite
```

---

## 9. What was custom-built (nothing was scaffolded)

- Custom **file-based route tree** for both public and admin surfaces.
- Custom **generic `CrudPage<T>`** component &mdash; drives every admin CMS page from a `fields[]` schema (no per-table duplication).
- Custom **`submitOrder` server function** with Zod validation, server-side pricing and stock check.
- Custom **Row-Level Security policies** written by hand in migrations, including the anonymous-insert guard on `orders`.
- Custom **Playwright + pytest + Allure** harness with per-test screenshots, Allure attachments, and a headless capture of the rendered HTML report.
- Custom **design system** in `src/styles.css` (leaf gradient, mint wash, honey accent, `Fraunces` display font paired with `Inter` body).

---

## 10. Credits

Built by **Avijit** as a portfolio project showcasing a full-stack TypeScript
storefront on the modern Vite/edge stack, with automation-grade test coverage.

License: MIT.
