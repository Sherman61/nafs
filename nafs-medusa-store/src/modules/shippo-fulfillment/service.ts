// src/modules/shippo-fulfillment/service.ts

type ShippoProviderOptions = {
    apiToken?: string
}

type FulfillmentProviderInitArgs = {
    options?: ShippoProviderOptions
}

/**
 * Shippo fulfillment provider for Medusa v2.
 * Minimal implementation: static fulfillment options + basic shipment creation.
 */
class ShippoFulfillmentProvider {
    static identifier = "shippo" // used in FulfillmentProvider.id: fp_shippo_<id>

    private options: ShippoProviderOptions

    constructor({ options }: FulfillmentProviderInitArgs) {
        this.options = options || {}
    }

    /**
     * Called when Medusa wants to know which fulfillment options this provider supports.
     * For now, we expose a single generic "Shippo Standard" option.
     */
    async getFulfillmentOptions() {
        return [
            {
                id: "shippo_standard",
                name: "Shippo Standard",
                // `data` is opaque to Medusa; you can stash service-level config here
                data: {
                    service_level_token: "standard",
                },
            },
        ]
    }

    /**
     * Called when a fulfillment is created for an order using this provider.
     * Here you hit the Shippo API to create a shipment + (optionally) pick a rate.
     *
     * `data` shape here is whatever Medusa passes in from the Fulfillment Module
     * for your version. We're using `any` to avoid fighting framework types.
     */
    async createFulfillment(data: any) {
        const token =
            this.options.apiToken ||
            process.env.SHIPPO_SANDBOX_API_KEY ||
            process.env.SHIPPO_API_TOKEN

        if (!token) {
            throw new Error("Shippo API token not configured (apiToken/SHIPPO_SANDBOX_API_KEY)")
        }

        const fromAddress = {
            name: process.env.SHIPPO_FROM_ADDRESS_NAME ?? "Warehouse",
            street1: process.env.SHIPPO_FROM_ADDRESS_STREET1 ?? "",
            city: process.env.SHIPPO_FROM_ADDRESS_CITY ?? "",
            state: process.env.SHIPPO_FROM_ADDRESS_STATE ?? "",
            zip: process.env.SHIPPO_FROM_ADDRESS_ZIP ?? "",
            country: process.env.SHIPPO_FROM_ADDRESS_COUNTRY ?? "US",
        }

        const delivery = data?.delivery_address || data?.shipping_address || {}

        const toAddress = {
            name: delivery.first_name
                ? `${delivery.first_name} ${delivery.last_name ?? ""}`.trim()
                : "Recipient",
            street1: delivery.address_1 ?? "",
            city: delivery.city ?? "",
            state: delivery.province ?? "",
            zip: delivery.postal_code ?? "",
            country: (delivery.country_code || "US").toUpperCase(),
        }

        // TODO: derive from items; for now, static parcel as a placeholder
        const parcel = {
            length: "10",
            width: "8",
            height: "4",
            distance_unit: "in",
            weight: "1",
            mass_unit: "lb",
        }

        const shipmentPayload = {
            address_from: fromAddress,
            address_to: toAddress,
            parcels: [parcel],
            async: false,
        }

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
            throw new Error(json.detail || "Shippo shipment creation failed")
        }

        const rates = json.rates ?? []
        const cheapest = rates.sort(
            (a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount)
        )[0]

        return {
            // data returned here is stored on the Fulfillment entity in Medusa
            data: {
                shippo_shipment_id: json.object_id,
                shippo_rate_id: cheapest?.object_id,
                shippo_provider: cheapest?.provider,
                shippo_servicelevel: cheapest?.servicelevel?.name,
            },
            // you can later add `labels` here once you start buying transactions
        }
    }

    /**
     * Called when a fulfillment is cancelled.
     * Shippo usually cancels *transactions* (labels), not just shipments.
     * You can wire that here later – for now we just mark as cancelled.
     */
    async cancelFulfillment(data: any) {
        return {
            data: {
                cancelled: true,
                previous: data?.data ?? null,
            },
        }
    }

    /**
     * Optional: validate fulfillment data (payload coming from shipping option/cart).
     * For now we just echo it back.
     */
    async validateFulfillmentData(_items: any[], data: any) {
        return {
            data,
        }
    }
}

export default ShippoFulfillmentProvider
