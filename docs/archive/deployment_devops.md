# Deployment & DevOps Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

This document outlines the deployment strategy for **The Terminal**. The system consists of two main components:

- **SpacetimeDB backend** – hosts the database and game logic (tables, reducers).
- **React frontend** – static web application served via CDN.

The deployment process is designed to be simple, scalable, and maintainable, with clear separation between development, staging, and production environments.

---

## 2. Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                      Users                           │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────┐
│              CDN / Static Hosting                    │
│           (Vercel / Netlify / Cloudflare)            │
│                   React Frontend                      │
└────────────────────────┬────────────────────────────┘
                         │ WebSocket (WSS)
                         ▼
┌─────────────────────────────────────────────────────┐
│              SpacetimeDB Cluster                      │
│  (SpacetimeDB Cloud or self-hosted on VPS/K8s)       │
│  - Tables: User, LabState, Message, etc.              │
│  - Reducers: business logic                            │
└─────────────────────────────────────────────────────┘
```

---

## 3. SpacetimeDB Deployment

### 3.1 Development (Local)

```bash
# Start local SpacetimeDB instance
spacetime start

# Publish module (from project root)
spacetime publish --project-path ./spacetime-module --name linux_terminal_academy

# Generate TypeScript bindings for frontend
spacetime generate --lang typescript --out-dir ../src/lib/spacetime/bindings
```

### 3.2 Production Options

#### Option A: SpacetimeDB Cloud (Recommended for MVP)

SpacetimeDB Cloud offers managed hosting with automatic backups, monitoring, and scaling.

```bash
# Authenticate with cloud
spacetime login

# Publish to cloud
spacetime publish --cluster cloud --name linux-terminal-academy-prod
```

**Benefits:**
- Zero infrastructure management
- Built-in WebSocket load balancing
- Automatic TLS
- Point-in-time recovery

#### Option B: Self-Hosted on VPS

Deploy the SpacetimeDB binary on a Linux server (e.g., DigitalOcean, AWS EC2).

**Requirements:**
- Ubuntu 22.04+ or similar
- At least 2GB RAM, 2 vCPUs (for moderate load)
- Open port 3000 (WebSocket) or use reverse proxy (Caddy/NGINX)

**Installation:**
```bash
# Download latest SpacetimeDB binary
curl -sSf https://raw.githubusercontent.com/clockworklabs/SpacetimeDB/main/install.sh | sh

# Create systemd service
sudo nano /etc/systemd/system/spacetimedb.service
```

**Service file:**
```ini
[Unit]
Description=SpacetimeDB
After=network.target

[Service]
Type=simple
User=spacetimedb
WorkingDirectory=/opt/spacetimedb
ExecStart=/usr/local/bin/spacetime start --listen-addr 0.0.0.0:3000
Restart=always
Environment="SPACETIMEDB_BIND_ADDR=0.0.0.0:3000"

[Install]
WantedBy=multi-user.target
```

**Reverse Proxy with Caddy (for TLS + WebSocket):**
```caddyfile
spacetimedb.yourdomain.com {
    reverse_proxy localhost:3000
    header_up Sec-WebSocket-Protocol {http.request.header.Sec-WebSocket-Protocol}
    header_up X-Forwarded-For {remote_host}
}
```

### 3.3 Environment-Specific Configurations

Use separate modules per environment:

- `linux-terminal-academy-dev`
- `linux-terminal-academy-staging`
- `linux-terminal-academy-prod`

Each with its own database and possibly different reducer versions.

---

## 4. Frontend Hosting

The React frontend is a static site. We recommend **Vercel** or **Netlify** for ease of use and global CDN distribution.

### 4.1 Build Configuration

**Environment variables:**
- `VITE_SPACETIME_HOST` – WebSocket URL of SpacetimeDB (e.g., `wss://spacetimedb.yourdomain.com` or `wss://cloud.spacetimedb.com/linux-terminal-academy-prod`)

**Build command:**
```bash
npm run build
```
Output directory: `dist/`

### 4.2 Vercel Setup

- Connect GitHub repository.
- Set environment variables in Vercel dashboard.
- Deploy automatically on push to main.

**`vercel.json` for custom configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 4.3 Netlify Setup

- Connect repository.
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables set in UI or `netlify.toml`.

**`netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_SPACETIME_HOST = "wss://your-spacetimedb.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 5. CI/CD Pipeline

We use GitHub Actions for continuous integration and deployment.

### 5.1 Workflow Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push to   │────▶│   Run       │────▶│   Deploy    │
│   main      │     │   Tests     │     │   to Staging│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                      ┌─────────▼─────────┐
                                      │ Manual Promotion  │
                                      │ to Production     │
                                      └───────────────────┘
```

### 5.2 GitHub Actions Configuration

**`.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]
  workflow_dispatch:  # allow manual trigger

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      # Add E2E tests with SpacetimeDB test instance

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Install spacetime
        run: curl -sSf https://raw.githubusercontent.com/clockworklabs/SpacetimeDB/main/install.sh | sh
      - name: Publish to SpacetimeDB Cloud
        env:
          SPACETIME_TOKEN: ${{ secrets.SPACETIME_TOKEN }}
        run: |
          spacetime login --token $SPACETIME_TOKEN
          cd spacetime-module
          spacetime publish --cluster cloud --name linux-terminal-academy-prod

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 6. Environment Variables

### 6.1 Frontend (Vite)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SPACETIME_HOST` | WebSocket URL of SpacetimeDB | `wss://cloud.spacetimedb.com/linux-terminal-academy-prod` |
| `VITE_APP_NAME` | Application name | `Linux Terminal Academy` |
| `VITE_SENTRY_DSN` | (Optional) Error tracking | |

### 6.2 SpacetimeDB (Server)

SpacetimeDB uses environment variables for configuration when self-hosting:

| Variable | Description | Default |
|----------|-------------|---------|
| `SPACETIMEDB_BIND_ADDR` | Address to listen on | `0.0.0.0:3000` |
| `SPACETIMEDB_DB_PATH` | Path to database files | `./db` |
| `SPACETIMEDB_AUTH_JWT_SECRET` | JWT secret for authentication | (auto-generated) |
| `RUST_LOG` | Log level | `info` |

---

## 7. Database Backups & Migration

### 7.1 SpacetimeDB Cloud

Cloud provides automatic daily backups. You can also manually export:

```bash
spacetime dump --database linux-terminal-academy-prod > backup_$(date +%Y%m%d).spacetimedb
```

### 7.2 Self-Hosted Backups

- Use `spacetime dump periodically via cron.
- Store backups in a separate location (S3, Backblaze B2).

**Cron job example:**
```bash
0 2 * * * /usr/local/bin/spacetime dump --database linux-terminal-academy-prod | gzip > /backups/spacetimedb_$(date +\%Y\%m\%d).dump.gz
```

### 7.3 Schema Migrations

SpacetimeDB does not have built‑in migrations. To update the schema:

1. Publish a new module version (overwrites existing).
2. If you need to preserve data, you must write a reducer that transforms old data.
3. For breaking changes, consider spinning up a new module and migrating users gradually.

**Strategy:** Keep backward‑compatible changes (add optional fields). For major changes, run a data migration reducer that runs once.

---

## 8. Monitoring & Logging

### 8.1 SpacetimeDB Metrics

SpacetimeDB exposes Prometheus metrics at `http://localhost:3000/metrics` (if enabled). Metrics include:
- Connected clients
- Reducer call count
- Database size
- Query latency

**Prometheus + Grafana dashboard** – set up to monitor health.

### 8.2 Application Logs

- SpacetimeDB logs to stdout; collect with systemd/journald or forward to Loki.
- Frontend errors: integrate **Sentry** for client-side error tracking.

**Sentry setup:**
```typescript
// main.tsx
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 8.3 Uptime Monitoring

Use **UptimeRobot** or **Better Stack** to ping the frontend URL and WebSocket endpoint periodically.

---

## 9. Scaling Considerations

### 9.1 SpacetimeDB Scaling

SpacetimeDB is single‑node but can handle 150k+ transactions per second. For higher load:

- Upgrade instance resources (vertical scaling).
- For read‑heavy workloads, you can run read‑replica nodes (feature planned).
- For multiplayer labs, consider sharding by lab ID (separate modules per lab group) – advanced.

### 9.2 Frontend Scaling

Vercel/Netlify automatically scale globally via CDN. No action needed.

---

## 10. Security Checklist

- [ ] Use **HTTPS/WSS** everywhere (TLS termination at reverse proxy or cloud).
- [ ] Set `SPACETIMEDB_AUTH_JWT_SECRET` to a strong secret in production.
- [ ] Restrict database access: SpacetimeDB should not be exposed to the public internet unless behind reverse proxy with TLS.
- [ ] Use **CORS** on SpacetimeDB to only allow your frontend domain.
- [ ] Validate all reducer inputs (already done in reducers).
- [ ] Rate limiting: SpacetimeDB does not have built‑in rate limiting; implement at reverse proxy level (e.g., Caddy rate limit plugin) or in reducers manually.
- [ ] Regular security updates: keep SpacetimeDB binary updated.

---

## 11. Rollback Strategy

- **Frontend:** Vercel/Netlify support instant rollback to previous deployment via UI.
- **Backend:** To rollback a SpacetimeDB module:
  - If the new module has issues, you can republish the previous version (overwrites).
  - Data remains intact (unless new reducer corrupted it). Always test on staging first.
  - For critical data corruption, restore from backup.

---

## 12. Implementation Checklist

- [ ] Set up SpacetimeDB Cloud account or prepare self-hosted server.
- [ ] Configure environment variables for all environments.
- [ ] Set up GitHub repository secrets (SPACETIME_TOKEN, VERCEL_TOKEN, etc.).
- [ ] Create GitHub Actions workflow for testing and deployment.
- [ ] Configure Vercel/Netlify project.
- [ ] Set up Sentry for error tracking.
- [ ] Set up Prometheus/Grafana monitoring (optional).
- [ ] Document backup procedures.
- [ ] Perform a staging deployment and test end‑to‑end.
- [ ] Launch production.

---

**This document provides a complete blueprint for deploying the Linux Terminal Academy. All team members should follow these guidelines when preparing for launch.**
