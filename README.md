# Multi-Subdomain Landing Page Builder (Cloudflare Workers + D1 + KV)

A complete, production-ready Multi-Subdomain Landing Page Builder engineered to run natively on Cloudflare Workers, Cloudflare D1 (SQL Database), and Cloudflare KV (Edge Caching).

---

## ✨ Features

- **Wildcard Subdomain Engine (`*.yourdomain.com`)**: Dynamic routing for unlimited subdomains through a single Cloudflare Worker.
- **Interactive Chat Pre-Lander Template**:
  - Live animated avatar with pulsating "Online Now" green indicator badge.
  - Realistic typing animation with customizable delay before displaying the message.
  - Message bubble with timestamp.
  - Multiple customizable CTA buttons (labels, custom colors).
- **Smart Traffic Routing Engine**:
  - **Chrome Intent Mode**: Uses `intent://` scheme to seamlessly escape embedded Android webviews (e.g. Facebook/Instagram in-app browsers) and launch Google Chrome.
  - **App Deep Link Mode**: Direct deep link to mobile applications (e.g., `twitter://user?screen_name=...`) with automated 500ms fallback to the web URL (`https://x.com/...`).
  - **Direct Link Mode**: Standard immediate redirect to destination URL.
- **Dynamic SEO & Social Tags**: Per-subdomain Open Graph tags (`og:title`, `og:description`, `og:image`, `twitter:card`).
- **Real-Time Analytics Tracker**:
  - Page views, unique visitors (daily privacy-preserving hashed IP/UA), CTA clicks, and CTR.
  - Traffic source / referrer tracking (Facebook, Instagram, X/Twitter, direct).
  - Device & platform classification (Android in-app browser, iOS in-app browser, Mobile, Desktop).
  - Background asynchronous tracking via `ctx.waitUntil` for zero impact on user latency.
- **Secure Admin Dashboard**:
  - Built-in Web Crypto PBKDF2 password hashing & session management.
  - Subdomain management (create, edit, publish/unpublish, delete).
  - Real-time global stats and per-subdomain analytics modals.
  - No external frontend build tools needed (self-contained single page app directly served by Worker).
- **Non-Destructive Database Schema**: All D1 tables and indexes use `IF NOT EXISTS` to preserve existing data during redeployment.
- **Cloudflare Free Plan Optimized**: Leverages Workers, D1, and KV within the standard free tier limits.

---

## 📁 Project Structure

```text
├── DEPLOYMENT.md         # Step-by-step production Cloudflare setup guide
├── README.md             # Project documentation
├── package.json          # Scripts and dependencies
├── schema.sql            # D1 database schema (safe, non-destructive)
├── test/
│   └── verify.js         # Automated test suite
├── src/
│   ├── index.js          # Main Cloudflare Worker fetch handler & routing
│   ├── db.js             # D1 repository, queries & KV caching layer
│   ├── auth.js           # Web Crypto PBKDF2 authentication & token generator
│   ├── templates.js      # Interactive pre-lander template & smart routing scripts
│   └── admin_ui.js       # Admin dashboard single page application
└── wrangler.toml         # Cloudflare Workers configuration
```

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run verification test suite**:
   ```bash
   npm test
   ```

3. **Initialize local D1 database**:
   ```bash
   npm run db:init
   ```

4. **Start local development server**:
   ```bash
   npm run dev
   ```

5. Open your browser:
   - Admin Dashboard: `http://localhost:8787/admin`
   - Subdomain Preview: `http://localhost:8787/?subdomain=nethmi`

---

## 📖 Deployment

For full production deployment instructions with Cloudflare Wildcard DNS, D1, and KV setup, see [DEPLOYMENT.md](file:///d:/landin-page-genartor/DEPLOYMENT.md).

