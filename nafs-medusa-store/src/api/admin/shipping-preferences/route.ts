import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import {
  readShippoPreferences,
  writeShippoPreferences,
  ShippoPreference,
} from "../../utils/shippo-preferences"

type ShippoPreferencePayload = {
  mode?: ShippoPreference["mode"]
  flat_fee_amount?: number
  currency_code?: string
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const preference = await readShippoPreferences()

  res.json({ shippo_preference: preference })
}

export async function POST(
  req: MedusaRequest<ShippoPreferencePayload>,
  res: MedusaResponse
) {
  const { mode, flat_fee_amount, currency_code } = req.body || {}

  if (mode && mode !== "shippo" && mode !== "flat_fee") {
    return res.status(400).json({
      message: "Mode must be either 'shippo' for live rates or 'flat_fee'.",
    })
  }

  if (typeof flat_fee_amount !== "undefined" && flat_fee_amount < 0) {
    return res
      .status(400)
      .json({ message: "Flat fee must be zero or a positive amount." })
  }

  const preference = await writeShippoPreferences({
    mode,
    flat_fee_amount,
    currency_code,
  })

  res.json({ shippo_preference: preference })
}
