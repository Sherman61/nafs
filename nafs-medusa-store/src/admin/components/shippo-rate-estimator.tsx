// src/admin/components/shippo-rate-estimator.tsx
import React, { useEffect, useState } from "react"
import { Button, Container, Heading, Input, Text, toast } from "@medusajs/ui"

declare const __BACKEND_URL__: string | undefined

const ShippoRateEstimator: React.FC = () => {
    // Dev-only component – don’t render in production
    if (!import.meta.env.DEV) {
        return null
    }

    const [loadingInit, setLoadingInit] = useState(true)
    const [isEstimating, setIsEstimating] = useState(false)

    const [fromAddress, setFromAddress] = useState<any | null>(null)
    const [toAddress, setToAddress] = useState({
        name: "",
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
    })

    const [products, setProducts] = useState<any[]>([])
    const [selectedProductId, setSelectedProductId] = useState("")
    const [parcel, setParcel] = useState({
        length: "10",
        width: "8",
        height: "4",
        distanceUnit: "in",
        weight: "1",
        massUnit: "lb",
    })

    const [rates, setRates] = useState<any[]>([])

    // Backend URL resolution:
    // 1) __BACKEND_URL__ (if injected by Medusa admin plugin)
    // 2) VITE_BACKEND_URL
    // 3) window.location.origin as last resort

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        (typeof window !== "undefined" ? window.location.origin : "")

    // Initial load: warehouse "from" address + products
    useEffect(() => {
        const load = async () => {
            try {
                if (!backendUrl) {
                    throw new Error(
                        "Backend URL is not configured (VITE_BACKEND_URL or __BACKEND_URL__ missing)."
                    )
                }

                // 1) Load Shippo config (from-address)
                const configRes = await fetch(`${backendUrl}/admin/dev/shippo-config`, {
                    credentials: "include",
                })

                if (!configRes.ok) {
                    const txt = await configRes.text()
                    throw new Error(
                        `Failed to load Shippo config (status ${configRes.status}): ${txt || "no body"}`
                    )
                }

                const configJson = await configRes.json()
                setFromAddress(configJson.from_address || null)

                // 2) Load products (optional, just for dropdown)
                const productsRes = await fetch(`${backendUrl}/admin/products?limit=50`, {
                    credentials: "include",
                })

                if (!productsRes.ok) {
                    const txt = await productsRes.text()
                    console.error(
                        "[Shippo estimator] /admin/products failed",
                        productsRes.status,
                        txt
                    )
                    toast.error("Failed to load products", {
                        description: `Admin /products returned ${productsRes.status}`,
                    })
                } else {
                    const prodJson = await productsRes.json()
                    setProducts(prodJson.products || [])
                }
            } catch (e: any) {
                toast.error("Failed to initialize Shippo estimator", {
                    description: e?.message || "Check backend dev routes and config.",
                })
            } finally {
                setLoadingInit(false)
            }
        }

        load()
    }, [backendUrl])

    const handleParcelChange = (field: keyof typeof parcel, value: string) => {
        setParcel((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleToAddressChange = (
        field: keyof typeof toAddress,
        value: string
    ) => {
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
                throw new Error("Backend URL is not configured.")
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

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                throw new Error(
                    data.message || `Failed to fetch rates from Shippo (status ${res.status})`
                )
            }

            setRates(data.rates || [])
            toast.success("Shippo rates loaded", {
                description: `Found ${data.rates?.length || 0} rates`,
            })
        } catch (e: any) {
            toast.error("Shippo rate estimation failed", {
                description: e?.message || "Check Shippo token and /admin/dev/shippo-rates.",
            })
        } finally {
            setIsEstimating(false)
        }
    }

    if (loadingInit) {
        return (
            <Container className="p-6">
                <Text className="text-sm text-ui-fg-subtle">
                    Loading Shippo settings…
                </Text>
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
                        No from-address configured. Backend must implement{" "}
                        <code>/admin/dev/shippo-config</code> and return <code>from_address</code>.
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

            {/* Parcel */}
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
                            onChange={(e) =>
                                handleParcelChange("distanceUnit", e.target.value)
                            }
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
                            onChange={(e) =>
                                handleParcelChange("massUnit", e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Action */}
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
                This component calls your backend at <code>/admin/dev/shippo-config</code> to load
                the warehouse and <code>/admin/dev/shippo-rates</code> to fetch rates. If products
                don’t appear, check <code>/admin/products?limit=50</code> in your backend.
            </Text>
        </Container>
    )
}

export default ShippoRateEstimator
