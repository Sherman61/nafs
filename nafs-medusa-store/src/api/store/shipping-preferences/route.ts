import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { readShippoPreferences } from "../../utils/shippo-preferences"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const preference = await readShippoPreferences()

  res.json({ shippo_preference: preference })
}
