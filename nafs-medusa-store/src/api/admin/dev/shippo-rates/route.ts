// src/api/admin/dev/shippo-rates/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type Body = {
    from_address: any
    to_address: any
    parcel: {
        length: string
        width: string
        height: string
        distanceUnit: string
        weight: string
        massUnit: string
    }
    product_id?: string | null
}

export async function POST(req: MedusaRequest<Body>, res: MedusaResponse) {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({
            message: "Shippo dev rates are disabled in production",
        })
    }

    const token = process.env.SHIPPO_SANDBOX_API_TOKEN || process.env.SHIPPO_API_TOKEN
    if (!token) {
        return res.status(500).json({
            message: "SHIPPO_SANDBOX_API_TOKEN (or SHIPPO_API_TOKEN) is not set",
        })
    }

    const { from_address, to_address, parcel } = req.body || {}

    if (!from_address || !to_address || !parcel) {
        return res.status(400).json({
            message: "from_address, to_address, and parcel are required",
        })
    }

    const shipmentPayload = {
        address_from: {
            ...from_address,
        },
        address_to: {
            ...to_address,
        },
        parcels: [
            {
                length: parcel.length,
                width: parcel.width,
                height: parcel.height,
                distance_unit: parcel.distanceUnit || "in",
                weight: parcel.weight,
                mass_unit: parcel.massUnit || "lb",
            },
        ],
        async: false,
    }

    try {
        const response = await fetch("https://api.goshippo.com/shipments/", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `ShippoToken ${token}`,
            },
            body: JSON.stringify(shipmentPayload),
        })

        const json = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({
                message: json.detail || "Shippo API error",
                raw: json,
            })
        }

        // Shippo returns shipment object with `rates` array
        return res.json({
            shipment_id: json.object_id,
            rates: json.rates || [],
        })
    } catch (e: any) {
        return res.status(500).json({
            message: e?.message || "Failed to contact Shippo API",
        })
    }
}
