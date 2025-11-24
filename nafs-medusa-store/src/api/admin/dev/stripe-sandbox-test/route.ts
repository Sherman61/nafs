import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"

type Body = {
    amount: number
    currency: string
    cardNumber: string
}

// Map a test card number to a Stripe test PaymentMethod ID
const mapCardToPaymentMethod = (cardNumber: string): string => {
    const digits = cardNumber.replace(/\s+/g, "")

    // Success (Visa) – 4242 4242 4242 4242
    if (digits === "4242424242424242") {
        return "pm_card_visa"
    }

    // Generic card decline – 4000 0000 0000 0002
    if (digits === "4000000000000002") {
        return "pm_card_visa_chargeDeclined"
    }

    // Insufficient funds – 4000 0000 0000 9995
    if (digits === "4000000000009995") {
        return "pm_card_visa_chargeDeclinedInsufficientFunds"
    }

    // Fallback: treat everything else as a normal Visa success
    return "pm_card_visa"
}

export async function POST(
    req: MedusaRequest<Body>,
    res: MedusaResponse
) {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({
            message: "Stripe sandbox tester is disabled in production",
        })
    }

    const { amount, currency, cardNumber } = req.body || {}

    if (!amount || !currency || !cardNumber) {
        return res.status(400).json({
            message: "amount, currency, and cardNumber are required",
        })
    }

    const secretKey =
        process.env.STRIPE_SANDBOX_SECRET_KEY ||
        process.env.STRIPE_API_KEY ||
        process.env.STRIPE_SECRET_KEY ||
        ""

    if (!secretKey) {
        return res.status(500).json({
            message: "Stripe sandbox secret key not configured in env",
        })
    }

    const stripe = new Stripe(secretKey, {
        apiVersion: "2023-10-16",
    })

    try {
        const paymentMethodId = mapCardToPaymentMethod(cardNumber)

        const intent = await stripe.paymentIntents.create({
            amount,
            currency,

            // 🔒 Force card-only, no redirect methods
            payment_method_types: ["card"],

            payment_method: paymentMethodId,
            confirm: true,
            description: "Medusa Admin Stripe sandbox test",
            metadata: {
                source: "medusa-admin-stripe-sandbox-widget",
                test_card: cardNumber.replace(/\s+/g, ""),
            },
        })

        return res.json({
            status: intent.status,
            id: intent.id,
        })
    } catch (e: any) {
        return res.status(500).json({
            message: e?.message || "Failed to create Stripe PaymentIntent",
        })
    }
}
