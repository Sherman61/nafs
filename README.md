# nafs medusah commerce demo

This repository contains a small ecommerce experience inspired by the "Medusah" stack the client
requested: a Node/Express API plus a React (Vite) storefront powered by Tailwind CSS. The setup is
split into two workspaces:

- `server/` – Express API that exposes categories, products, and a lightweight in-memory cart.
- `client/` – Vite + React storefront that consumes the API and renders a cart-enabled shopping
  experience.

The stack is intentionally simple so you can swap in a full MedusaJS backend, PHP/MySQL services, or
any other provider when you are ready for production.

## Getting started

1. Install dependencies inside both workspaces:

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. Start the API (port `5000` by default):

   ```bash
   cd server
   npm run start
   ```

3. In a separate terminal, start the React development server (proxied to the API):

   ```bash
   cd client
   npm run dev
   ```

4. Visit `http://localhost:5173` to browse the storefront. The client proxies `/api/*` requests to
   the local Node API so you can explore the complete demo without additional configuration. The
   lightweight router exposes two entry points:
   - `http://localhost:5173/` – customer-facing storefront
   - `http://localhost:5173/admin` – admin dashboard for staging projects/pricing

## Running with Docker

You can also boot the full stack with Docker for a reproducible environment:

```bash
docker compose -f docker.yaml up --build
```

This command builds the images defined in `client/Dockerfile` and `server/Dockerfile`, wires the
containers together on an internal network, and publishes ports `5000` (API) and `5173` (Vite client)
to your host. Once the stack is up, open `http://localhost:5173/` for the storefront or
`http://localhost:5173/admin` for the dashboard. The compose file injects the `VITE_API_BASE_URL` and
`VITE_API_PROXY_TARGET` environment variables so the React storefront automatically talks to the API,
whether you are running in Docker or locally. Stop the stack with `Ctrl+C` or
`docker compose -f docker.yaml down`.

## Project structure

```
nafs/
├── README.md
├── server
│   ├── package.json
│   └── src
│       ├── data.js        # Catalog data seed
│       └── index.js       # Express API with carts + products
└── client
    ├── index.html
    ├── package.json
    ├── src
    │   ├── App.jsx
    │   ├── components     # Header, ProductCard, CartDrawer, etc.
    │   ├── hooks          # React hooks for fetching data
    │   ├── main.jsx
    │   └── styles.css
    ├── tailwind.config.js
    └── vite.config.js
```

## Extending the demo

- Replace the static catalog in `server/src/data.js` with calls to MedusaJS or another Node/PHP API.
- Persist carts by swapping the in-memory `Map` with MySQL (or any database) or by wiring Medusa's
  cart service directly.
- The React storefront uses componentized sections so you can easily integrate checkout flows,
  product detail pages, or CMS-powered content blocks.
