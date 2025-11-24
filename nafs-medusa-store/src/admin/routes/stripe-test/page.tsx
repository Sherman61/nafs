// src/admin/routes/stripe-test/page.tsx
import { useEffect, useState } from "react"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import StripeSandboxTester from "../../widgets/stripe-sandbox-tester"

type ResultState = {
    status: "idle" | "success" | "error"
    pi?: string
    message?: string
}

const StripeTest = () => {
    const [result, setResult] = useState<ResultState>({ status: "idle" })

    // Read query params on load to show result after redirect
    useEffect(() => {
        if (typeof window === "undefined") return

        const params = new URLSearchParams(window.location.search)
        const status = params.get("status") as "success" | "error" | null
        const pi = params.get("pi") || undefined
        const message = params.get("message") || undefined

        if (status === "success" || status === "error") {
            setResult({
                status,
                pi,
                message,
            })
        }
    }, [])

    const handleResultRedirect = (res: { status: string; id?: string; error?: string }) => {
        if (typeof window === "undefined") return

        const basePath = "/app/stripe-test"
        const url = new URL(window.location.origin + basePath)

        if (res.status === "succeeded" || res.status === "requires_capture") {
            url.searchParams.set("status", "success")
            if (res.id) {
                url.searchParams.set("pi", res.id)
            }
        } else {
            url.searchParams.set("status", "error")
            if (res.error) {
                url.searchParams.set("message", res.error)
            }
            if (res.id) {
                url.searchParams.set("pi", res.id)
            }
        }

        // Full redirect (reload) so we test navigation properly
        window.location.href = url.toString()
    }

    return (
        <Container className="p-6 space-y-4">
            <Heading level="h1">Stripe Sandbox Test</Heading>

            <Text className="text-ui-fg-subtle text-sm">
                This page lets you trigger sandbox Stripe PaymentIntents and then redirects back
                here with a{" "}
                <code>?status=success|error&amp;pi=...&amp;message=...</code> query.
            </Text>

            {/* Result banner (after redirect) */}
            {result.status !== "idle" && (
                <div className="rounded-md border border-ui-border-base bg-ui-bg-subtle p-3 space-y-1">
                    <div className="flex items-center gap-2">
                        <Badge
                            color={result.status === "success" ? "green" : "red"}
                            size="small"
                        >
                            {result.status === "success" ? "Success" : "Error"}
                        </Badge>
                        {result.pi && (
                            <Text className="text-xs font-mono truncate">
                                PI: {result.pi}
                            </Text>
                        )}
                    </div>
                    {result.message && (
                        <Text className="text-xs text-ui-fg-muted break-all">
                            {result.message}
                        </Text>
                    )}
                </div>
            )}

            {/* The actual tester widget */}
            <StripeSandboxTester onResult={handleResultRedirect} />

            <Text className="text-[11px] text-ui-fg-muted">
                Current page URL acts as the redirect target:{" "}
                <code>http://localhost:9000/app/stripe-test</code>.
            </Text>
        </Container>
    )
}

export default StripeTest

export const config = {
    link: {
        label: "Stripe Test",
    },
}
