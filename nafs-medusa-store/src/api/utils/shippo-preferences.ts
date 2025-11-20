import fs from "fs/promises"
import path from "path"

export type ShippoPreference = {
  mode: "shippo" | "flat_fee"
  flat_fee_amount: number
  currency_code: string
  updated_at?: string
}

const PREFERENCE_PATH = path.join(
  process.cwd(),
  "data",
  "shippo-preferences.json"
)

const DEFAULT_PREFERENCE: ShippoPreference = {
  mode: "shippo",
  flat_fee_amount: 0,
  currency_code: "usd",
}

async function ensureDirectory() {
  await fs.mkdir(path.dirname(PREFERENCE_PATH), { recursive: true })
}

function normalizePreference(pref: ShippoPreference): ShippoPreference {
  const mode = pref.mode === "flat_fee" ? "flat_fee" : "shippo"
  const amount = Number.isFinite(pref.flat_fee_amount)
    ? Math.max(pref.flat_fee_amount, 0)
    : 0
  const currency = pref.currency_code?.toLowerCase()?.trim() || "usd"

  return {
    mode,
    flat_fee_amount: amount,
    currency_code: currency,
    updated_at: pref.updated_at,
  }
}

export async function readShippoPreferences(): Promise<ShippoPreference> {
  try {
    const raw = await fs.readFile(PREFERENCE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as ShippoPreference

    return normalizePreference(parsed)
  } catch (err) {
    await ensureDirectory()

    const initialPreference = {
      ...DEFAULT_PREFERENCE,
      updated_at: new Date().toISOString(),
    }

    await fs.writeFile(
      PREFERENCE_PATH,
      JSON.stringify(initialPreference, null, 2),
      "utf-8"
    )

    return initialPreference
  }
}

export async function writeShippoPreferences(
  input: Partial<ShippoPreference>
): Promise<ShippoPreference> {
  const current = await readShippoPreferences()

  const preference = normalizePreference({
    ...current,
    ...input,
    updated_at: new Date().toISOString(),
  })

  await ensureDirectory()

  await fs.writeFile(
    PREFERENCE_PATH,
    JSON.stringify(preference, null, 2),
    "utf-8"
  )

  return preference
}
