import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { buildAnalyticsSummary } from "../../utils/interaction-log"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const summary = await buildAnalyticsSummary()

  res.json({ analytics: summary })
}
