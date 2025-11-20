import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  readShippoSettings,
  ShippoSettings,
  writeShippoSettings,
} from "../../utils/shippo-settings"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const settings = await readShippoSettings()
  res.json({ shippo_settings: settings })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as Partial<ShippoSettings>

  const mode = body.mode === "flat_fee" ? "flat_fee" : "shippo"
  const flat_fee_amount = Number(body.flat_fee_amount) || 0

  const settings: ShippoSettings = {
    mode,
    flat_fee_amount,
  }

  await writeShippoSettings(settings)

  res.json({ shippo_settings: settings })
}
