import { promises as fs } from "fs"
import path from "path"

export type ShippoSettings = {
  mode: "shippo" | "flat_fee"
  flat_fee_amount: number
}

const SETTINGS_PATH = path.join(process.cwd(), "data", "shippo-settings.json")

const defaultSettings: ShippoSettings = {
  mode: "shippo",
  flat_fee_amount: 0,
}

export const readShippoSettings = async (): Promise<ShippoSettings> => {
  try {
    const data = await fs.readFile(SETTINGS_PATH, "utf-8")
    const parsed = JSON.parse(data) as Partial<ShippoSettings>

    return {
      ...defaultSettings,
      ...parsed,
    }
  } catch (e) {
    return defaultSettings
  }
}

export const writeShippoSettings = async (settings: ShippoSettings) => {
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true })
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8")
}
