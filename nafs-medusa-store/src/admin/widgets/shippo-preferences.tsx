"use client"

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Input, Label, Text } from "@medusajs/ui"
import { FormEvent, useEffect, useMemo, useState } from "react"

type ShippoPreference = {
  mode: "shippo" | "flat_fee"
  flat_fee_amount: number
  currency_code: string
  updated_at?: string
}

const DEFAULT_PREF: ShippoPreference = {
  mode: "shippo",
  flat_fee_amount: 0,
  currency_code: "usd",
}

const ShippoPreferencesWidget = () => {
  const [preference, setPreference] = useState<ShippoPreference>(DEFAULT_PREF)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const modeCopy = useMemo(
    () =>
      preference.mode === "shippo"
        ? "Shippo will calculate live rates at checkout."
        : "Charge a single flat fee on every shipment.",
    [preference.mode]
  )

  const fetchPreference = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/admin/shipping-preferences", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Could not load shipping preferences")
      }

      const data = (await response.json()) as {
        shippo_preference?: ShippoPreference
      }

      if (data.shippo_preference) {
        setPreference(data.shippo_preference)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreference()
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch("/admin/shipping-preferences", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preference),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data?.message || "Unable to save preferences")
      }

      const data = (await response.json()) as {
        shippo_preference: ShippoPreference
      }

      setPreference(data.shippo_preference)
      setMessage("Shippo delivery preferences saved")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4 rounded-base border px-4 py-5 bg-ui-bg-base shadow-elevation-card-rest">
      <div className="flex flex-col gap-y-1">
        <Text className="txt-compact-medium-plus">Shipping calculations</Text>
        <Text className="text-ui-fg-subtle">
          Choose whether Shippo live rates should be used at checkout or if you
          want to charge a flat fee for every order.
        </Text>
      </div>

      {loading ? (
        <Text className="text-ui-fg-subtle">Loading preferences…</Text>
      ) : (
        <form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
            <label className="flex flex-col gap-y-1">
              <Text className="txt-compact-small-plus">Shipping mode</Text>
              <select
                className="px-3 py-2 rounded-base border bg-ui-bg-field text-ui-fg-base"
                value={preference.mode}
                onChange={(e) =>
                  setPreference((prev) => ({
                    ...prev,
                    mode: e.target.value as ShippoPreference["mode"],
                  }))
                }
              >
                <option value="shippo">Shippo live calculation</option>
                <option value="flat_fee">Flat fee</option>
              </select>
              <Text className="text-ui-fg-subtle">{modeCopy}</Text>
            </label>

            <div className="flex flex-col gap-y-1">
              <Label htmlFor="flat-fee">Flat fee amount</Label>
              <Input
                id="flat-fee"
                type="number"
                min={0}
                step={0.01}
                value={preference.flat_fee_amount}
                onChange={(e) =>
                  setPreference((prev) => ({
                    ...prev,
                    flat_fee_amount: Number(e.target.value),
                  }))
                }
                disabled={preference.mode !== "flat_fee"}
              />
              <Text className="text-ui-fg-subtle">
                The amount will be used when "Flat fee" is selected.
              </Text>
            </div>
          </div>

          <div className="flex flex-col gap-y-1 small:max-w-[240px]">
            <Label htmlFor="currency">Currency code</Label>
            <Input
              id="currency"
              value={preference.currency_code}
              onChange={(e) =>
                setPreference((prev) => ({
                  ...prev,
                  currency_code: e.target.value.toLowerCase(),
                }))
              }
            />
            <Text className="text-ui-fg-subtle">
              Use your three-letter currency code (for example, USD).
            </Text>
          </div>

          {message && (
            <Text className="text-ui-fg-interactive">{message}</Text>
          )}
          {error && <Text className="text-ui-fg-error">{error}</Text>}

          <div className="flex gap-x-3 items-center justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={fetchPreference}
              disabled={saving}
            >
              Reset
            </Button>
            <Button type="submit" isLoading={saving} disabled={saving}>
              Save preferences
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "settings.details.after",
})

export default ShippoPreferencesWidget
