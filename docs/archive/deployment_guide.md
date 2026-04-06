# SpacetimeDB & Frontend Deployment Guide

This guide outlines how to promote the Linux Terminal architecture from Local/Mocked environments into a fully live production deployment.

## 1. Provisioning SpacetimeDB Cloud

To deploy the Rust backend logic (found in `spacetime-module`) to a live multiplayer server:

1. **Install CLI**: 
   ```bash
   curl -sSf https://install.spacetimedb.com | sh
   ```
2. **Authenticate**:
   ```bash
   spacetime login
   ```
3. **Publish the Backend Module**:
   Navigate to the module directory and push to SpacetimeDB Cloud:
   ```bash
   cd spacetime-module
   spacetime publish -c linux-terminal-prod
   ```
   *This command uploads your Rust code, compiles it in the cloud, and provisions a live WebSocket endpoint.*

## 2. Configuring the Frontend Environment

Once the database is live, you must configure the frontend to talk to it instead of the Local or Mock instances.

Create or update your `.env.production`:
```env
# Disable Mock Mode
VITE_MOCK_SPACETIME=false

# Point to your newly provisioned SpacetimeDB instance
VITE_SPACETIME_URL=wss://testnet.spacetimedb.com
VITE_SPACETIME_DB_NAME=linux-terminal-prod
```

## 3. Custom Domain & TLS/WSS

SpacetimeDB Cloud automatically provides `wss://` (Secure WebSockets) for all instances ending in `.spacetimedb.com`. 

If you are hosting your frontend on Vercel or GitHub Pages under a custom domain (e.g., `linux-terminal.academy`):
1. Navigate to your DNS provider (Cloudflare, Route53, etc.)
2. Add a `CNAME` record pointing to your frontend hosting provider.
3. Your provider will automatically provision SSL/TLS for the frontend.
4. Because the frontend is served over `https://`, modern browsers *require* the backend to be `wss://` (which SpacetimeDB handles natively).

## 4. GitHub Actions CI/CD Secrets

To enable the `production-deploy.yml` pipeline:
1. Go to your GitHub Repository -> Settings -> Secrets and Variables -> Actions
2. Add a Repository Secret: `SPACETIME_TOKEN` with your personal access token (obtained via `spacetime identity`).
