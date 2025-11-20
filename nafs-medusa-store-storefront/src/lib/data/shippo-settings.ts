"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type ShippoSettings = {
  mode: "shippo" | "flat_fee"
  flat_fee_amount: number
}

const defaultSettings: ShippoSettings = {
  mode: "shippo",
  flat_fee_amount: 0,
}

export const getShippoSettings = async (): Promise<ShippoSettings> => {
  const next = {
    ...(await getCacheOptions("shippo-settings")),
  }

  try {
    const response = await sdk.client.fetch<{ shippo_settings: ShippoSettings }>(
      "/store/shippo-settings",
      {
        cache: "no-store",
        next,
      }
    )

    return {
      ...defaultSettings,
      ...(response?.shippo_settings || {}),
    }
  } catch (e) {
    return defaultSettings
  }
}
