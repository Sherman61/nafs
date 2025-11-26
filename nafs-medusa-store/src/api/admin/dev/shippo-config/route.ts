// src/api/admin/dev/shippo-config/route.ts


export async function GET(req: any, res: any) {
    // In dev we keep it hard-coded.
    // Later you can load it from DB or ENV.
    const from_address = {
        name: process.env.SHIPPO_FROM_ADDRESS_NAME ?? "Main Warehouse",
        street1: process.env.SHIPPO_FROM_ADDRESS_STREET1 ?? "950 S Detroit St",
        city: process.env.SHIPPO_FROM_ADDRESS_CITY ?? "Los Angeles",
        state: process.env.SHIPPO_FROM_ADDRESS_STATE ?? "CA",
        zip: process.env.SHIPPO_FROM_ADDRESS_ZIP ?? "90036",
        country: process.env.SHIPPO_FROM_ADDRESS_COUNTRY ?? "US",
    }

    return res.json({ from_address })
}