# Cloudflare Production Deployment Guide
## Multi-Subdomain Landing Page Builder

This guide provides end-to-end instructions to deploy the Multi-Subdomain Landing Page Builder to Cloudflare. This architecture is designed to run 100% within the **Cloudflare Free Plan** limits using **Workers**, **D1 (SQL Database)**, and **KV (Edge Cache)**.

---

### Active Deployment Details (New Cloudflare Account)

- **Account**: `krishabro8@gmail.com`
- **Account ID**: `027badc9d2004b790b64d328f099e589`
- **D1 Database**: `landing-page-db` (`c03ea068-cf97-4e11-9b0e-90dd7d2ecd09`)
- **KV Namespace**: `PAGE_CACHE` (`9202ad6040c34fa19e24a38a46dfe381`)
- **Live Worker URL**: [https://multi-subdomain-landing-page-builder.krishabro8.workers.dev](https://multi-subdomain-landing-page-builder.krishabro8.workers.dev)
- **Admin Dashboard**: [https://multi-subdomain-landing-page-builder.krishabro8.workers.dev/admin](https://multi-subdomain-landing-page-builder.krishabro8.workers.dev/admin)

---

### Step 1: Prerequisites

1. A Cloudflare account with your primary domain added (e.g., `mydomain.com`).
2. Node.js (v18+) and npm installed locally.
3. Authenticate Wrangler CLI with your Cloudflare account:
   ```bash
   npx wrangler login
   ```

---

### Step 2: Wildcard DNS Configuration (*.mydomain.com)

To automatically support unlimited dynamic subdomains without manually creating DNS records for each campaign:

1. In the Cloudflare Dashboard, navigate to **Websites** > Select your domain (`mydomain.com`) > **DNS** > **Records**.
2. Click **Add record**:
   - **Type**: `CNAME` (or `A` if using dummy IP `192.0.2.1`)
   - **Name**: `*` (wildcard)
   - **Target**: `@` (or your domain `mydomain.com`)
   - **Proxy status**: **Proxied (Orange Cloud ON)** *(Crucial: Traffic must pass through Cloudflare's edge proxy)*
   - **TTL**: `Auto`
3. Click **Save**.

Now any request to `anything.mydomain.com` will route through Cloudflare Edge.

---

### Step 3: Cloudflare D1 Database Setup (Safe & Non-Destructive)

Create a serverless D1 SQLite database:

```bash
npx wrangler d1 create landing-page-db
```

This output will provide your database binding info:
```toml
[[d1_databases]]
binding = "DB"
database_name = "landing-page-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

1. Copy the `database_id` and paste it into [wrangler.toml](file:///d:/landin-page-genartor/wrangler.toml).
2. Execute the database schema:
   - **Local test database**:
     ```bash
     npm run db:init
     ```
   - **Production remote database**:
     ```bash
     npm run db:init:remote
     ```

> **Data Preservation Guarantee**: [schema.sql](file:///d:/landin-page-genartor/schema.sql) uses `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`. Re-running migrations will **never** drop, erase, or alter existing campaign landing pages or analytics data.

---

### Step 4: Cloudflare KV Namespace Setup (Edge Caching)

Create the KV namespace used to cache published landing pages at Cloudflare's edge for sub-millisecond page loads:

```bash
npx wrangler kv:namespace create PAGE_CACHE
```

Output:
```toml
[[kv_namespaces]]
binding = "PAGE_CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Copy the KV `id` into [wrangler.toml](file:///d:/landin-page-genartor/wrangler.toml).

---

### Step 5: Configure `wrangler.toml`

Open [wrangler.toml](file:///d:/landin-page-genartor/wrangler.toml) and update the configuration:

```toml
name = "multi-subdomain-landing-page-builder"
main = "src/index.js"
compatibility_date = "2024-04-01"

[[d1_databases]]
binding = "DB"
database_name = "landing-page-db"
database_id = "YOUR_ACTUAL_D1_ID"

[[kv_namespaces]]
binding = "PAGE_CACHE"
id = "YOUR_ACTUAL_KV_ID"

[vars]
ROOT_DOMAIN = "mydomain.com"        # Your apex domain
ADMIN_DEFAULT_USER = "admin"

# Production Worker Routes
routes = [
  { pattern = "*.mydomain.com/*", zone_name = "mydomain.com" },
  { pattern = "mydomain.com/*", zone_name = "mydomain.com" }
]
```

---

### Step 6: Deploy to Cloudflare Workers

Run the deployment command:

```bash
npm run deploy
```

---

### Step 7: Accessing the Admin Dashboard

1. Navigate to:
   - `https://admin.mydomain.com` or `https://mydomain.com/admin`
2. Default initial login credentials:
   - **Username**: `admin`
   - **Password**: `AdminPassword123!`
3. Inside the dashboard:
   - Click **+ Create Landing Page**.
   - Input your desired subdomain (e.g., `nethmi`).
   - Customize Persona Name, Avatar Image URL, Chat message, and typing delay (ms).
   - Configure **Smart Traffic Routing Engine**:
     - **Direct Link**: Standard direct URL redirection on CTA click.
     - **Chrome Intent Mode**: Uses `intent://[target]#Intent;scheme=https;package=com.android.chrome;end` to open Google Chrome on Android Facebook/Instagram in-app webviews.
     - **App Deep Link Mode**: Tries `twitter://user?screen_name=[username]` first, with automatic fallback to web `https://x.com/[username]` in 500ms.
   - Configure CTA button labels, colors, and Open Graph social tags.
   - Click **Save & Publish**.

---

### Step 8: Analytics & Real-Time Tracking

- Every subdomain records **Page Views**, **Unique Visitors**, and **CTA Clicks** automatically via non-blocking background beacons (`ctx.waitUntil`).
- Click the **📊 Stats** button in the Admin table to view:
  - Page views & unique visitors
  - Click-through rate (CTR %)
  - Traffic source referrers (e.g., Facebook, Instagram, X/Twitter, direct)
  - Device/Platform breakdown (Android in-app browser, iOS in-app browser, Android Chrome, iOS Safari, Desktop)

