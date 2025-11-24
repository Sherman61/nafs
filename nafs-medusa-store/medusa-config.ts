// medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  modules: [
    // your existing modules (blog, etc.)
    {
      resolve: "./src/modules/blog",
      options: {},
    },
    {

      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
            options: {},
          },
          {
            // 👇 path to YOUR Shippo module provider
            resolve: "./src/modules/shippo-fulfillment",
            id: "shippo",
            options: {
              apiToken: process.env.SHIPPO_SANDBOX_API_KEY as string,
            },
          },
        ],
      },
    },
  ],
})
