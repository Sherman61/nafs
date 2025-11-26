"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"

import { getAuthHeaders } from "./cookies"

export type InteractionPayload = {
  type: "shippo" | "stripe"
  action: string
  cart_id?: string
  customer_id?: string
  metadata?: Record<string, unknown>
}

export async function logInteraction(payload: InteractionPayload) {
  try {
    const headers = {
      "content-type": "application/json",
      ...(await getAuthHeaders()),
    }

    await sdk.client.fetch(`/store/interactions`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
      cache: "no-store",
    })
  } catch (err) {
    medusaError(err)
  }
}

export async function getAnalyticsSummary() {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const response = await sdk.client.fetch<{ analytics: any }>(
      `/admin/analytics`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    return response.analytics
  } catch (err) {
    medusaError(err)
    return {
      total: 0,
      by_type: {},
      by_action: {},
      recent: [],
    }
  }
}
