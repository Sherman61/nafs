import { NextResponse } from "next/server"

const backendUrl = process.env.MEDUSA_BACKEND_URL

type ValidationResult = {
  ok: boolean
  message: string
  regions?: number
}

export async function POST(request: Request) {
  const { key } = (await request.json().catch(() => ({}))) as {
    key?: string
  }

  if (!key) {
    return NextResponse.json<ValidationResult>(
      {
        ok: false,
        message: "Please provide a publishable API key to validate.",
      },
      { status: 400 }
    )
  }

  if (!backendUrl) {
    return NextResponse.json<ValidationResult>(
      {
        ok: false,
        message: "Backend URL is not configured. Add MEDUSA_BACKEND_URL to continue.",
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${backendUrl}/store/regions`, {
      headers: {
        "x-publishable-api-key": key,
      },
      cache: "no-store",
    })

    const payload = (await response.json().catch(() => ({}))) as {
      message?: string
      regions?: unknown[]
    }

    if (!response.ok) {
      return NextResponse.json<ValidationResult>(
        {
          ok: false,
          message:
            payload.message ||
            "The API key was rejected. Double-check the value and try again.",
        },
        { status: response.status }
      )
    }

    const regionCount = Array.isArray(payload.regions)
      ? payload.regions.length
      : undefined

    return NextResponse.json<ValidationResult>({
      ok: true,
      message: "Key accepted.",
      regions: regionCount,
    })
  } catch (error) {
    return NextResponse.json<ValidationResult>(
      {
        ok: false,
        message: "Unable to reach the Medusa backend right now.",
      },
      { status: 503 }
    )
  }
}
