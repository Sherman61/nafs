const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

dotenv.config();

const {
  DATABASE_URL = "postgres://medusa:medusa@postgres:5432/medusa",
  REDIS_URL = "redis://redis:6379",
  STORE_CORS = "http://localhost:5173",
  ADMIN_CORS = "http://localhost:7001",
} = process.env;

module.exports = {
  projectConfig: {
    database_url: DATABASE_URL,
    database_type: "postgres",
    redis_url: REDIS_URL,
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins: [
    {
      resolve: "medusa-payment-stripe",
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
    {
      resolve: "medusa-payment-paypal",
      options: {
        client_id: process.env.PAYPAL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
        sandbox: process.env.NODE_ENV !== "production",
      },
    },
    {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: REDIS_URL,
      },
    },
  ],
};
