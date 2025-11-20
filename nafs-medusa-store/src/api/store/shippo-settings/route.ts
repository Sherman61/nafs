import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readShippoSettings } from "../../utils/shippo-settings"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const settings = await readShippoSettings()
  res.json({ shippo_settings: settings })
}
