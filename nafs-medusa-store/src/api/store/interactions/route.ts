import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { appendInteraction } from "../../utils/interaction-log"

type InteractionPayload = {
  type?: "shippo" | "stripe"
  action?: string
  cart_id?: string
  customer_id?: string
  metadata?: Record<string, unknown>
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body || {}) as InteractionPayload

  const event = await appendInteraction({
    type: body.type === "stripe" ? "stripe" : "shippo",
    action: body.action ?? "recorded",
    cart_id: body.cart_id,
    customer_id: body.customer_id,
    metadata: body.metadata,
  })

  res.status(201).json({ interaction: event })
}
