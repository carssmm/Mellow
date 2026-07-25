# 0.3 Supabase Setup — Database Schema & Row Level Security

## Context

<context>
This step creates the Supabase database schema for the Mellow Café System. The schema supports all MVP features: product inventory, multi-mode sales logging, sales line items, and fixed expense tracking. Row Level Security (RLS) policies ensure that only the authenticated café owner can access their own data. This implements the data model from Section 4 of the project specification.
</context>

## Prerequisites

<prerequisites>
- Step 0.1 completed (Next.js project with `@supabase/supabase-js` and `@supabase/ssr` installed)
- A Supabase project created at https://supabase.com (free tier)
- The Supabase project URL and anon key available from the Supabase dashboard → Settings → API
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the `.env.local` file**
   - Create `.env.local` at the project root with the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>`
   - Add placeholder values that clearly indicate they need to be replaced
   - Ensure `.env.local` is already in `.gitignore` (Next.js default)

2. **Create `.env.example`**
   - Create `.env.example` at the project root with the same variable names but empty values
   - This serves as documentation for required environment variables

3. **Create the database migration SQL file**
   - Create `supabase/migrations/001_initial_schema.sql` with the full schema
   - The schema must include these tables:

   **`products` table:**
   - `id` — UUID, primary key, default `gen_random_uuid()`
   - `user_id` — UUID, NOT NULL, references `auth.users(id)` ON DELETE CASCADE
   - `name` — TEXT, NOT NULL
   - `category` — TEXT, NOT NULL, default `'Uncategorized'`
   - `selling_price` — DECIMAL(10,2), NOT NULL, CHECK >= 0
   - `unit_cost` — DECIMAL(10,2), NOT NULL, CHECK >= 0
   - `current_stock` — INTEGER, NOT NULL, default 0
   - `low_stock_threshold` — INTEGER, NOT NULL, default 5
   - `target_stock` — INTEGER, NOT NULL, default 20
   - `is_active` — BOOLEAN, NOT NULL, default TRUE
   - `created_at` — TIMESTAMPTZ, default NOW()
   - `updated_at` — TIMESTAMPTZ, default NOW()

   **`sales` table:**
   - `id` — UUID, primary key, default `gen_random_uuid()`
   - `user_id` — UUID, NOT NULL, references `auth.users(id)` ON DELETE CASCADE
   - `total_revenue` — DECIMAL(10,2), NOT NULL, default 0
   - `total_cogs` — DECIMAL(10,2), NOT NULL, default 0
   - `net_profit` — DECIMAL(10,2), NOT NULL, default 0
   - `starting_float` — DECIMAL(10,2), nullable (only for cash reconciliation mode)
   - `ending_cash` — DECIMAL(10,2), nullable
   - `cash_discrepancy` — DECIMAL(10,2), nullable
   - `entry_mode` — TEXT, NOT NULL, CHECK IN ('quick_tap', 'batch', 'reconciliation')
   - `payment_method` — TEXT, default 'cash', CHECK IN ('cash', 'gcash_maya')
   - `created_at` — TIMESTAMPTZ, default NOW()

   **`sales_items` table:**
   - `id` — UUID, primary key, default `gen_random_uuid()`
   - `sale_id` — UUID, NOT NULL, references `sales(id)` ON DELETE CASCADE
   - `product_id` — UUID, NOT NULL, references `products(id)` ON DELETE RESTRICT
   - `quantity` — INTEGER, NOT NULL, CHECK > 0
   - `unit_price` — DECIMAL(10,2), NOT NULL (selling price at time of sale)
   - `unit_cost` — DECIMAL(10,2), NOT NULL (COGS at time of sale)
   - `created_at` — TIMESTAMPTZ, default NOW()

   **`expenses` table:**
   - `id` — UUID, primary key, default `gen_random_uuid()`
   - `user_id` — UUID, NOT NULL, references `auth.users(id)` ON DELETE CASCADE
   - `name` — TEXT, NOT NULL
   - `amount` — DECIMAL(10,2), NOT NULL, CHECK >= 0
   - `frequency` — TEXT, NOT NULL, default 'monthly', CHECK IN ('daily', 'weekly', 'monthly', 'yearly')
   - `is_active` — BOOLEAN, NOT NULL, default TRUE
   - `created_at` — TIMESTAMPTZ, default NOW()
   - `updated_at` — TIMESTAMPTZ, default NOW()

4. **Create indexes**
   - `idx_products_user_id` on `products(user_id)`
   - `idx_sales_user_id` on `sales(user_id)`
   - `idx_sales_created_at` on `sales(created_at)`
   - `idx_sales_items_sale_id` on `sales_items(sale_id)`
   - `idx_sales_items_product_id` on `sales_items(product_id)`
   - `idx_expenses_user_id` on `expenses(user_id)`

5. **Create an `updated_at` trigger function**
   - Create a PostgreSQL function `update_updated_at_column()` that sets `updated_at = NOW()` on row update
   - Apply triggers to `products` and `expenses` tables

6. **Create Row Level Security (RLS) policies**
   - Enable RLS on ALL four tables
   - For each table, create policies:
     - **SELECT**: `auth.uid() = user_id` (users can only read their own data)
     - **INSERT**: `auth.uid() = user_id` (users can only insert for themselves)
     - **UPDATE**: `auth.uid() = user_id` (users can only update their own data)
     - **DELETE**: `auth.uid() = user_id` (users can only delete their own data)
   - For `sales_items`, the policy should check through the `sales` table join: the `sale_id` must reference a sale belonging to `auth.uid()`

7. **Create a seed data SQL file (optional but recommended)**
   - Create `supabase/seed.sql` with sample products for testing:
     - Spanish Latte — Coffee — ₱120.00 selling / ₱55.00 cost — stock: 18
     - Americano — Coffee — ₱100.00 selling / ₱35.00 cost — stock: 24
     - Matcha Latte — Non-Coffee — ₱140.00 selling / ₱65.00 cost — stock: 12
     - Butter Croissant — Pastries — ₱85.00 selling / ₱40.00 cost — stock: 8
     - Iced Caramel Macchiato — Coffee — ₱130.00 selling / ₱60.00 cost — stock: 30
     - Pour Over (Ethiopia) — Coffee — ₱150.00 selling / ₱45.00 cost — stock: 5
   - Note: `user_id` must be replaced with the actual authenticated user's UUID after they sign up
</instructions>

<requirements>
### Functional Requirements
- All tables support the data model from Section 4 of the project specification
- `sales_items` captures the price and cost at the time of sale (snapshot, not a live reference)
- `entry_mode` distinguishes between Quick Tap, Batch, and Cash Reconciliation sales
- `payment_method` supports Cash and GCash/Maya digital payments
- Stock levels are tracked as simple integers (no gram-level ingredient deductions per spec anti-features)
- All monetary values are DECIMAL(10,2) for Philippine Peso precision

### Technical Requirements
- All tables must have RLS enabled — no table should be accessible without authentication
- Foreign key relationships must use ON DELETE CASCADE for user data, ON DELETE RESTRICT for products referenced by sales_items
- The schema must be deployable via the Supabase SQL Editor or CLI migrations
- UUID primary keys on all tables

### File Naming Conventions
- SQL migration: `supabase/migrations/001_initial_schema.sql`
- Seed data: `supabase/seed.sql`
- Environment: `.env.local`, `.env.example`
</requirements>

<output_files>
Generate the following files:

1. `.env.local` — Supabase connection environment variables (with placeholder values)
2. `.env.example` — Template showing required variables
3. `supabase/migrations/001_initial_schema.sql` — Complete database schema with tables, indexes, triggers, and RLS policies
4. `supabase/seed.sql` — Sample product data for development
</output_files>

## Directory Structure

After completing this step, the project should have:

```
mellow-cafe/
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql     ← NEW
│   └── seed.sql                        ← NEW
├── .env.local                          ← NEW
├── .env.example                        ← NEW
└── ... (existing files unchanged)
```

## Verification

<verification>
After completing this step, confirm:

- [ ] `.env.local` exists with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables
- [ ] `.env.example` exists as a template (no actual keys)
- [ ] `supabase/migrations/001_initial_schema.sql` contains CREATE TABLE statements for all 4 tables
- [ ] Running the SQL in Supabase SQL Editor creates all tables without errors
- [ ] RLS is enabled on all tables (verify in Supabase Dashboard → Authentication → Policies)
- [ ] Indexes are created for foreign keys and commonly queried columns
- [ ] The `updated_at` trigger fires correctly (test by updating a product row)
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `auth.users` reference error | Running SQL before Supabase auth is set up | Supabase automatically creates `auth.users` — ensure you're in the correct project |
| RLS policy blocks all queries | No authenticated user when testing | Test via Supabase Dashboard with a signed-in user, or temporarily disable RLS for schema verification |
| `gen_random_uuid()` not found | PostgreSQL version < 13 | Supabase uses PG 15+, this should work. Use `uuid_generate_v4()` from `uuid-ossp` as fallback |
| DECIMAL precision issues | Using FLOAT instead of DECIMAL | Always use `DECIMAL(10,2)` for currency, never FLOAT |

---

**Previous**: [0.2 - Tailwind Design Tokens](./02_tailwind_design_tokens.md) | **Next**: [0.4 - Directory Structure](./04_directory_structure.md)
