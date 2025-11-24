// src/api/admin/dev/shippo-config/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    // TODO: replace with real config from your DB / settings / env
    const from_address = {
        name: "Main Warehouse",
        street1: "950 S Detroit St",
        city: "Los Angeles",
        state: "CA",
        zip: "90036",
        country: "US",
    }



    return res.json({ from_address })
}
