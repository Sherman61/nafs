"use client"

import { FormEvent, useMemo, useState } from "react"

const defaultError = {
  type: "not_allowed",
  message:
    "Publishable API key required in the request header: x-publishable-api-key. You can manage your keys in settings in the dashboard.",
}

type ValidationResult = {
  ok: boolean
  message: string
  regions?: number
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("")
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const helperText = useMemo(() => {
    if (!result) return "Enter a publishable API key to unlock admin content."
    if (result.ok) {
      return result.regions
        ? `The key is valid and exposes ${result.regions} region(s).`
        : "The key is valid."
    }

    return result.message
  }, [result])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsChecking(true)
    setResult(null)

    try {
      const response = await fetch("/api/validate-publishable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: apiKey.trim() }),
      })

      const payload = (await response.json()) as ValidationResult
      setResult(payload)
    } catch (error) {
      setResult({
        ok: false,
        message: "Unable to validate the key right now. Please try again.",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="content-container py-10 space-y-8">
      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl font-semibold text-ahava-ink dark:text-white">Admin access</h1>
        <p className="text-base text-[#2f4f4f] dark:text-gray-200">
          Provide a publishable API key to view protected admin content.
          Requests without the header will be rejected with the error below.
        </p>
        <div className="rounded-xl border border-amber-400/50 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm dark:border-amber-200/60 dark:bg-amber-950 dark:text-amber-100">
          <code className="block whitespace-pre-wrap text-[13px]">
            {JSON.stringify(defaultError, null, 2)}
          </code>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-2xl border border-ahava-forest/20 bg-white p-6 shadow-card dark:border-white/10 dark:bg-[#0f1613]"
      >
        <label className="block space-y-2 text-sm font-medium text-ahava-ink dark:text-white">
          <span>Publishable API key</span>
          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="pk_live_..."
            className="w-full rounded-lg border border-ahava-forest/30 px-3 py-2 text-sm text-ahava-ink shadow-sm focus:border-ahava-forest focus:outline-none dark:border-white/20 dark:bg-[#0c110f] dark:text-white"
            required
            autoComplete="off"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isChecking}
            className="contrast-btn bg-ahava-forest text-white hover:bg-ahava-forest/90 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-ahava-fern"
          >
            {isChecking ? "Checking..." : "Validate key"}
          </button>
          <span className="text-sm text-[#2f4f4f] dark:text-gray-300">{helperText}</span>
        </div>
      </form>

      {result?.ok && (
        <div className="space-y-3 rounded-2xl border border-green-500/30 bg-green-50 p-6 shadow-card dark:border-green-200/40 dark:bg-green-950/50">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">
            Admin content unlocked
          </h2>
          <p className="text-sm text-green-900/80 dark:text-green-100/80">
            This placeholder represents admin-only data that requires a valid
            publishable API key header. Replace it with real management tools
            once your backend is ready.
          </p>
        </div>
      )}
    </div>
  )
}
