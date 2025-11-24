// src/modules/shippo-fulfillment/index.ts
import type { ModuleProviderExports } from "@medusajs/framework/types"
import ShippoFulfillmentProvider from "./service"

const services = [ShippoFulfillmentProvider]

const providerExport: ModuleProviderExports = {
    services,
}

export default providerExport
