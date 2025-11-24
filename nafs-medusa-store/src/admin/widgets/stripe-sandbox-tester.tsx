// src/admin/widgets/stripe-sandbox-tester.tsx
import { useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Text, toast } from "@medusajs/ui"

type StripeTestResult = {
    status: string
    id?: string
    error?: string
}

type CardPresetId = "success" | "decline" | "insufficient"

const CARD_PRESETS: {
    id: CardPresetId
    label: string
    number: string
}[] = [
        {
            id: "success",
            label: "Success – 4242 4242 4242 4242",
            number: "4242424242424242",
        },
        {
            id: "decline",
            label: "Generic decline – 4000 0000 0000 0002",
            number: "4000000000000002",
        },
        {
            id: "insufficient",
            label: "Insufficient funds – 4000 0000 0000 9995",
            number: "4000000000009995",
        },
    ]

const StripeSandboxTester = () => {
    if (!import.meta.env.DEV) {
        return null
    }

    const [amount, setAmount] = useState("1000") // cents
    const [currency, setCurrency] = useState("usd")

    // card test data (Stripe sandbox only)
    const [cardPreset, setCardPreset] = useState<CardPresetId>("success")
    const [cardNumber, setCardNumber] = useState("4242424242424242")
    const [expMonth, setExpMonth] = useState("12")
    const [expYear, setExpYear] = useState("2030")
    const [cvc, setCvc] = useState("123")

    const [isLoading, setIsLoading] = useState(false)
    const [lastResult, setLastResult] = useState<StripeTestResult | null>(null)

    const runTest = async () => {
        setIsLoading(true)
        setLastResult(null)

        try {
            const backendUrl =
                typeof __BACKEND_URL__ !== "undefined"
                    ? __BACKEND_URL__
                    : import.meta.env.VITE_BACKEND_URL || ""

            if (!backendUrl) {
                throw new Error("Backend URL is not configured for admin.")
            }

            const res = await fetch(`${backendUrl}/admin/dev/stripe-sandbox-test`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    currency,
                    cardNumber,
                    expMonth: Number(expMonth),
                    expYear: Number(expYear),
                    cvc,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Stripe sandbox test failed")
            }

            const result: StripeTestResult = {
                status: data.status,
                id: data.id,
            }

            setLastResult(result)

            toast.success("Stripe sandbox payment created", {
                description: `Status: ${result.status}`,
            })
        } catch (e: any) {
            const msg = e?.message || "Failed to run Stripe sandbox test"
            const result: StripeTestResult = {
                status: "error",
                error: msg,
            }

            setLastResult(result)

            toast.error("Stripe sandbox test failed", {
                description: msg,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handlePresetChange = (value: string) => {
        const presetId = value as CardPresetId
        setCardPreset(presetId)

        const preset = CARD_PRESETS.find((p) => p.id === presetId)
        if (preset) {
            setCardNumber(preset.number)
        }
    }

    return (
        <Container className="p-6 space-y-4">
            <Heading level="h2">Stripe Sandbox Tester (dev only)</Heading>

            <Text className="text-ui-fg-subtle text-sm">
                Trigger a Stripe PaymentIntent using Stripe test card numbers.{" "}
                <b>Never</b> use real card data here. This is for dev only.
            </Text>

            {/* Amount + currency */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                    <Text className="text-xs text-ui-fg-muted uppercase">
                        Amount (in cents)
                    </Text>
                    <Input
                        type="number"
                        min={50}
                        step={50}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <Text className="text-xs text-ui-fg-muted uppercase">Currency</Text>
                    <Input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                </div>
            </div>

            {/* Card presets + card data */}
            <div className="space-y-3">
                {/* Preset selector */}
                <div className="space-y-1">
                    <Text className="text-xs text-ui-fg-muted uppercase">
                        Test Card Scenario
                    </Text>
                    <select
                        className="w-full rounded-md border border-ui-border-base bg-ui-bg-base px-3 py-2 text-sm"
                        value={cardPreset}
                        onChange={(e) => handlePresetChange(e.target.value)}
                    >
                        {CARD_PRESETS.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                                {preset.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="space-y-1 sm:col-span-2">
                        <Text className="text-xs text-ui-fg-muted uppercase">
                            Card Number (Stripe test)
                        </Text>
                        <Input
                            type="text"
                            value={cardNumber}
                            onChange={(e) =>
                                setCardNumber(e.target.value.replace(/\s+/g, ""))
                            }
                        />
                        <Text className="text-[11px] text-ui-fg-muted">
                            Changing this manually will still be interpreted as one of the known
                            Stripe test scenarios on the backend.
                        </Text>
                    </div>

                    <div className="space-y-1">
                        <Text className="text-xs text-ui-fg-muted uppercase">
                            Exp. Month
                        </Text>
                        <Input
                            type="number"
                            min={1}
                            max={12}
                            value={expMonth}
                            onChange={(e) => setExpMonth(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Text className="text-xs text-ui-fg-muted uppercase">
                            Exp. Year
                        </Text>
                        <Input
                            type="number"
                            min={2024}
                            value={expYear}
                            onChange={(e) => setExpYear(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Text className="text-xs text-ui-fg-muted uppercase">CVC</Text>
                        <Input
                            type="text"
                            maxLength={4}
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Button
                    className="w-full sm:w-auto"
                    onClick={runTest}
                    isLoading={isLoading}
                >
                    Run Stripe test
                </Button>
            </div>

            {lastResult && (
                <div className="rounded-md border border-ui-border-base bg-ui-bg-subtle p-3 text-xs space-y-1">
                    <Text className="font-mono break-all">
                        Status: {lastResult.status}
                    </Text>
                    {lastResult.id && (
                        <Text className="font-mono break-all">
                            PaymentIntent: {lastResult.id}
                        </Text>
                    )}
                    {lastResult.error && (
                        <Text className="font-mono text-ui-fg-error break-all">
                            Error: {lastResult.error}
                        </Text>
                    )}
                </div>
            )}

            <Text className="text-[11px] text-ui-fg-muted">
                Uses Stripe sandbox only. Use the presets above or a known Stripe test card
                like <code>4242 4242 4242 4242</code> to simulate different outcomes.
            </Text>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "store.details.after",
})

export default StripeSandboxTester
