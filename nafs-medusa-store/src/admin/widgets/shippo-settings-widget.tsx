import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

type ShippoSettings = {
  mode: "shippo" | "flat_fee"
  flat_fee_amount: number
}

const Widget = () => {
  const [settings, setSettings] = useState<ShippoSettings>({
    mode: "shippo",
    flat_fee_amount: 0,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch("/admin/shippo-settings", {
        credentials: "include",
      })

      if (response.ok) {
        const data = (await response.json()) as { shippo_settings: ShippoSettings }
        setSettings(data.shippo_settings)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    const response = await fetch("/admin/shippo-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(settings),
    })

    if (response.ok) {
      setFeedback("Shippo settings saved")
    } else {
      setFeedback("Could not save settings. Please try again.")
    }

    setIsSaving(false)
  }

  return (
    <div className="bg-ui-bg-subtle border border-ui-border-base rounded-large p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-ui-fg-base text-lg font-semibold">Shippo live shipping</h2>
        <p className="text-ui-fg-subtle text-sm">
          Choose whether Shippo calculates shipping rates on the live page or apply a universal flat fee.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSave}>
        <label className="flex flex-col gap-2 text-sm text-ui-fg-base">
          Mode
          <select
            className="border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base"
            value={settings.mode}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                mode: event.target.value as ShippoSettings["mode"],
              }))
            }
          >
            <option value="shippo">Use Shippo to calculate rates</option>
            <option value="flat_fee">Use a flat shipping fee</option>
          </select>
        </label>

        {settings.mode === "flat_fee" && (
          <label className="flex flex-col gap-2 text-sm text-ui-fg-base">
            Flat fee amount (USD)
            <input
              type="number"
              step="0.01"
              min={0}
              className="border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base"
              value={settings.flat_fee_amount}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  flat_fee_amount: Number(event.target.value),
                }))
              }
            />
          </label>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="bg-black text-white border border-ui-border-base rounded-md px-4 py-2 w-fit disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>

      {feedback && <span className="text-sm text-ui-fg-subtle">{feedback}</span>}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "settings.details.after",
})

export default Widget
