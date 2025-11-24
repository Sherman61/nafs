// src/admin/widgets/shippo-rate-estimator.jsx
import { useEffect, useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Text, toast } from "@medusajs/ui"

const ShippoRateEstimator = () => {
    if (!import.meta.env.DEV) {
        // dev tool only – hide in prod
        return null
    }

    const [loadingInit, setLoadingInit] = useState(true)
    const [isEstimating, setIsEstimating] = useState(false)

    const [fromAddress, setFromAddress] = useState(null)
    const [toAddress, setToAddress] = useState({
        name: "",
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
    })

    const [products, setProducts] = useState([])
    const [selectedProductId, setSelectedProductId] = useState("")
    const [parcel, setParcel] = useState({
        length: "10",
        width: "8",
        height: "4",
        distanceUnit: "in",
        weight: "1",
        massUnit: "lb",
    })

    const [rates, setRates] = useState([])

    const backendUrl =
        typeof __BACKEND_URL__ !== "undefined"
            ? __BACKEND_URL__
            : import.meta.env.VITE_BACKEND_URL || ""

    // Initial load: warehouse "from" address + products
    useEffect(() => {
        const load = async () => {
            try {
                if (!backendUrl) {
                    throw new Error("Backend URL is not configured for admin.")
                }

                const [configRes, productsRes] = await Promise.all([
                    fetch(`${backendUrl}/admin/dev/shippo-config`, {
                        credentials: "include",
                    }),
                    fetch(`${backendUrl}/admin/products?limit=50`, {
                        credentials: "include",
                    }),
                ])

                if (!configRes.ok) {
                    throw new Error("Failed to load Shippo config")
                }
                const configJson = await configRes.json()

                setFromAddress(configJson.from_address || null)

                if (productsRes.ok) {
                    const prodJson = await productsRes.json()
                    setProducts(prodJson.products || [])
                }
            } catch (e) {
                toast.error("Failed to initialize Shippo widget", {
                    description: e?.message || "Check backend dev routes and config.",
                })
            } finally {
                setLoadingInit(false)
            }
        }

        load()
    }, [backendUrl])

    const handleParcelChange = (field, value) => {
        setParcel((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleToAddressChange = (field, value) => {
        setToAddress((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleEstimate = async () => {
        setIsEstimating(true)
        setRates([])

        try {
            if (!backendUrl) {
                throw new Error("Backend URL is not configured for admin.")
            }

            if (!fromAddress) {
                throw new Error("No warehouse 'from' address configured.")
            }

            if (!toAddress.street1 || !toAddress.city || !toAddress.zip || !toAddress.country) {
                throw new Error("Please fill in the destination street, city, zip, and country.")
            }

            const res = await fetch(`${backendUrl}/admin/dev/shippo-rates`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    from_address: fromAddress,
                    to_address: toAddress,
                    parcel,
                    product_id: selectedProductId || null,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch rates from Shippo")
            }

            setRates(data.rates || [])
            toast.success("Shippo rates loaded", {
                description: `Found ${data.rates?.length || 0} rates`,
            })
        } catch (e) {
            toast.error("Shippo rate estimation failed", {
                description: e?.message || "Check Shippo token and dev route.",
            })
        } finally {
            setIsEstimating(false)
        }
    }

    if (loadingInit) {
        return (
            <Container className="p-6">
                <Text className="text-sm text-ui-fg-subtle">Loading Shippo settings…</Text>
            </Container>
        )
    }

    return (
        <Container className="p-6 space-y-4">
            <Heading level="h2">Shippo Rate Estimator (dev only)</Heading>

            <Text className="text-ui-fg-subtle text-sm">
                Estimate shipping rates using your Shippo sandbox account. Uses your configured
                warehouse “from” address and a manual “to” address plus parcel dimensions.
            </Text>

            {/* FROM (warehouse) */}
            <div className="space-y-1">
                <Text className="text-xs text-ui-fg-muted uppercase">From (Warehouse)</Text>
                {fromAddress ? (
                    <div className="text-sm text-ui-fg-subtle leading-snug">
                        <div>{fromAddress.name}</div>
                        <div>{fromAddress.street1}</div>
                        {fromAddress.city && fromAddress.state && (
                            <div>
                                {fromAddress.city}, {fromAddress.state} {fromAddress.zip}
                            </div>
                        )}
                        <div>{fromAddress.country}</div>
                    </div>
                ) : (
                    <Text className="text-xs text-ui-fg-error">
                        No from-address configured. Implement <code>/admin/dev/shippo-config</code>{" "}
                        to return your warehouse address.
                    </Text>
                )}
            </div>

            {/* TO Address */}
            <div className="space-y-2">
                <Text className="text-xs text-ui-fg-muted uppercase">To Address</Text>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Name</Text>
                        <Input
                            value={toAddress.name}
                            onChange={(e) => handleToAddressChange("name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Street</Text>
                        <Input
                            value={toAddress.street1}
                            onChange={(e) => handleToAddressChange("street1", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">City</Text>
                        <Input
                            value={toAddress.city}
                            onChange={(e) => handleToAddressChange("city", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">State/Province</Text>
                        <Input
                            value={toAddress.state}
                            onChange={(e) => handleToAddressChange("state", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">ZIP / Postal code</Text>
                        <Input
                            value={toAddress.zip}
                            onChange={(e) => handleToAddressChange("zip", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Country (ISO2)</Text>
                        <Input
                            value={toAddress.country}
                            onChange={(e) => handleToAddressChange("country", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Product selection (optional) */}
            <div className="space-y-1">
                <Text className="text-xs text-ui-fg-muted uppercase">
                    Product (optional – for reference only)
                </Text>
                <select
                    className="w-full rounded-md border border-ui-border-base bg-ui-bg-base px-3 py-2 text-sm"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                >
                    <option value="">– No product selected –</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.title} ({p.id})
                        </option>
                    ))}
                </select>
                <Text className="text-[11px] text-ui-fg-muted">
                    This doesn’t change the Shippo call directly unless you wire it on the backend,
                    but it lets you associate rate checks with a product.
                </Text>
            </div>

            {/* Parcel dimensions */}
            <div className="space-y-2">
                <Text className="text-xs text-ui-fg-muted uppercase">Parcel</Text>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Length</Text>
                        <Input
                            type="number"
                            min={1}
                            value={parcel.length}
                            onChange={(e) => handleParcelChange("length", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Width</Text>
                        <Input
                            type="number"
                            min={1}
                            value={parcel.width}
                            onChange={(e) => handleParcelChange("width", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Height</Text>
                        <Input
                            type="number"
                            min={1}
                            value={parcel.height}
                            onChange={(e) => handleParcelChange("height", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Distance unit</Text>
                        <Input
                            value={parcel.distanceUnit}
                            onChange={(e) => handleParcelChange("distanceUnit", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Weight</Text>
                        <Input
                            type="number"
                            min={0.1}
                            step={0.1}
                            value={parcel.weight}
                            onChange={(e) => handleParcelChange("weight", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Text className="text-[11px] text-ui-fg-muted">Mass unit</Text>
                        <Input
                            value={parcel.massUnit}
                            onChange={(e) => handleParcelChange("massUnit", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Button
                    className="w-full sm:w-auto"
                    onClick={handleEstimate}
                    isLoading={isEstimating}
                    disabled={!fromAddress}
                >
                    Estimate Shippo rates
                </Button>
            </div>

            {/* Rates table */}
            {rates.length > 0 && (
                <div className="space-y-2">
                    <Text className="text-xs text-ui-fg-muted uppercase">Rates</Text>
                    <div className="overflow-x-auto rounded-md border border-ui-border-base">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-ui-bg-subtle">
                                <tr>
                                    <th className="px-3 py-2">Carrier</th>
                                    <th className="px-3 py-2">Service</th>
                                    <th className="px-3 py-2">Amount</th>
                                    <th className="px-3 py-2">Est. days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rates.map((rate) => (
                                    <tr key={rate.object_id} className="border-t border-ui-border-base">
                                        <td className="px-3 py-2">{rate.provider}</td>
                                        <td className="px-3 py-2">{rate.servicelevel?.name}</td>
                                        <td className="px-3 py-2">
                                            {rate.amount} {rate.currency}
                                        </td>
                                        <td className="px-3 py-2">{rate.estimated_days ?? "–"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Text className="text-[11px] text-ui-fg-muted">
                This widget calls your backend at <code>/admin/dev/shippo-rates</code> which should
                talk to Shippo using your sandbox token.
            </Text>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "store.details.after",
})

export default ShippoRateEstimator
