// src/admin/routes/analytics/page.tsx
import { useEffect, useMemo, useState } from "react"
import { Badge, Container, Heading, Text } from "@medusajs/ui"

type InteractionSummary = {
    total: number
    by_type: Record<string, number>
    by_action: Record<string, number>
    recent: {
        id: string
        type: string
        action: string
        created_at: string
        cart_id?: string
        customer_id?: string
    }[]
}

const SummaryCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-md border border-ui-border-base bg-ui-bg-base p-3">
        <Text className="text-xs uppercase text-ui-fg-muted">{label}</Text>
        <Heading level="h3" className="text-lg">
            {value}
        </Heading>
    </div>
)

const AdminAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState<InteractionSummary | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch("/admin/analytics", {
                    credentials: "include",
                })

                const json = await res.json().catch(() => ({}))

                if (!res.ok) {
                    throw new Error(
                        json?.message || `Request failed with ${res.status}`
                    )
                }

                setAnalytics(json.analytics)
            } catch (err: any) {
                setError(err?.message || "Unable to load analytics")
            } finally {
                setIsLoading(false)
            }
        }

        load()
    }, [])

    const recent = useMemo(() => analytics?.recent || [], [analytics])

    return (
        <Container className="p-6 space-y-4">
            <Heading level="h1">Checkout Analytics</Heading>
            <Text className="text-sm text-ui-fg-subtle">
                Summaries of Shippo and Stripe interactions logged from the store
                frontend.
            </Text>

            {error && (
                <div className="rounded-md border border-ui-border-error bg-ui-bg-subtle/60 p-3">
                    <Text className="text-sm text-ui-fg-error">{error}</Text>
                </div>
            )}

            {isLoading ? (
                <Text className="text-sm text-ui-fg-subtle">Loading analytics…</Text>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <SummaryCard
                            label="Total Events"
                            value={analytics?.total ?? 0}
                        />
                        <SummaryCard
                            label="Stripe Events"
                            value={analytics?.by_type?.stripe ?? 0}
                        />
                        <SummaryCard
                            label="Shippo Events"
                            value={analytics?.by_type?.shippo ?? 0}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level="h2" className="text-lg">
                            Recent interactions
                        </Heading>
                        <div className="overflow-hidden rounded-md border border-ui-border-base">
                            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 bg-ui-bg-base px-3 py-2 text-[12px] uppercase text-ui-fg-muted">
                                <span>Action</span>
                                <span>Type</span>
                                <span>Cart</span>
                                <span>When</span>
                            </div>
                            <div className="divide-y divide-ui-border-base">
                                {recent.map((evt) => (
                                    <div
                                        key={evt.id}
                                        className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 px-3 py-2 text-sm"
                                    >
                                        <span className="font-mono text-[12px] text-ui-fg-base">
                                            {evt.action}
                                        </span>
                                        <span>
                                            <Badge
                                                color={evt.type === "stripe" ? "purple" : "blue"}
                                                size="small"
                                            >
                                                {evt.type}
                                            </Badge>
                                        </span>
                                        <span className="truncate font-mono text-[11px] text-ui-fg-muted">
                                            {evt.cart_id || "-"}
                                        </span>
                                        <span className="text-[11px] text-ui-fg-muted">
                                            {new Date(evt.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                                {!recent.length && (
                                    <div className="px-3 py-4 text-sm text-ui-fg-subtle">
                                        No interactions logged yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Container>
    )
}

export default AdminAnalyticsPage

export const config = {
    link: {
        label: "Analytics",
    },
}
