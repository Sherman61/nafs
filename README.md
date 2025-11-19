# Nafs live commerce stack

This repository now runs on the **official Medusa backend packages** so you can ship the exact live
commerce architecture you described: a Medusa API for admins/live shopping plus the React/Tailwind
storefront.

- `server/` – Medusa backend configured with Stripe and PayPal payment plugins, Redis-powered cache
  + event bus, and a seed file that mirrors the sample collection from the design brief.
- `client/` – Vite + React storefront that consumes Medusa's `/store/*` APIs and gracefully falls back
  to bundled data if the backend is offline.

Everything (Postgres, Redis, Medusa, and the storefront) can be launched with Docker so you can copy
this stack straight to your production host.

## Prerequisites

- Node 18+ and npm if you plan to run Medusa or the client locally.
- Docker + Docker Compose if you want the one-command environment.
- Stripe + PayPal sandbox credentials for payments (set via environment variables).

## Local development (without Docker)

1. **Install dependencies**

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Provide environment variables** – copy `server/.env.example` (or create `.env`) with at least the
   following values:

   ```env
   DATABASE_URL=postgres://localhost:5432/medusa
   REDIS_URL=redis://localhost:6379
   STORE_CORS=http://localhost:5173
   ADMIN_CORS=http://localhost:7001
   STRIPE_API_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   PAYPAL_CLIENT_ID=your-id
   PAYPAL_CLIENT_SECRET=your-secret
   ```

3. **Run dependencies** – start Postgres + Redis however you prefer (Docker, brew, etc.).

4. **Seed Medusa** (first run only):

   ```bash
   cd server
   npm run seed
   ```

5. **Start the backend**

   ```bash
   cd server
   npm run develop
   ```

6. **Start the storefront** (new terminal):

   ```bash
   cd client
   npm run dev
   ```

Visit `http://localhost:5173` to browse the storefront, which now talks directly to Medusa's store APIs
(`http://localhost:9000/store/*`).

## One-command Docker workflow

`docker-compose.yml` provisions the full stack:

- `medusa` – builds `server/` (official packages, Stripe + PayPal plugins enabled)
- `postgres` – persistent Postgres 15 database
- `redis` – Redis 7 cache + event bus
- `client` – builds `client/` and points `VITE_API_BASE_URL` at the Medusa service

Use the helper script or plain Docker commands:

```bash
# Build + start every container (CTRL+C to stop)
scripts/deploy.sh

# Give the stack its own docker-compose project name (so you can run multiple copies)
scripts/deploy.sh --project-name my-live-commerce

# Or run Docker Compose manually
docker compose up --build

docker compose down
```

If you pass Stripe/PayPal env vars into `docker compose up` (e.g. `STRIPE_API_KEY=... docker compose up`),
they will be injected into the Medusa container automatically.

## Copy the stack into a brand new repository

Need this architecture in another folder (or machine) with its own Docker Compose namespace? Use
`scripts/scaffold_repo.sh` to clone the working tree without Git history:

```bash
# Creates /opt/commerce-stack, initializes git, and suggests the docker project name "medusa-live"
scripts/scaffold_repo.sh /opt/commerce-stack --project-name medusa-live

# Overwrite the folder if it already exists and skip git init
scripts/scaffold_repo.sh ~/temp/nafs-copy --force --no-git
```

After running the script, change into the new directory, install dependencies inside `server/` and
`client/`, then bring it online with `scripts/deploy.sh` (use `--project-name` if you passed one
during scaffolding so the Docker resources don't collide with other stacks on the host).

## Server structure

```
server/
├─ data/seed.json            # Medusa seed matching the catalog showcased in the UI
├─ Dockerfile                # Production-ready Medusa image
├─ medusa-config.js          # Configures Postgres, Redis, Stripe, PayPal
├─ package.json              # Uses @medusajs/medusa and related plugins
└─ package-lock.json
```

To add more plugins/modules, install them in `server/package.json` and register them inside
`server/medusa-config.js` as you normally would in a Medusa project.

## Client notes

`client/src/hooks/useStorefrontData.js` now calls `/store/product-categories` and `/store/products`
directly. The hook normalizes Medusa's payload into the category/product cards used throughout the
React components and still falls back to bundled JSON if the backend is unreachable.

## Stripe and PayPal wiring

Set these environment variables in either `.env`, your shell session, or through Docker Compose:

- `STRIPE_API_KEY` – live or test secret key
- `STRIPE_WEBHOOK_SECRET` – webhook secret for `https://<host>/store/hooks/stripe`
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`

Medusa already exposes the webhook endpoints under `/store/hooks/stripe` and
`/store/hooks/paypal`, so once the env vars are set you only need to register webhooks in each
provider's dashboard.
