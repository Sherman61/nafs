import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

export type InteractionEvent = {
  id: string
  type: "shippo" | "stripe"
  action: string
  cart_id?: string
  customer_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

const LOG_PATH = path.join(process.cwd(), "data", "interaction-log.json")

async function ensureLogFile() {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true })
  try {
    await fs.access(LOG_PATH)
  } catch (err) {
    await fs.writeFile(LOG_PATH, "[]", "utf-8")
  }
}

export async function readInteractionLog(): Promise<InteractionEvent[]> {
  await ensureLogFile()
  const raw = await fs.readFile(LOG_PATH, "utf-8")

  try {
    const parsed = JSON.parse(raw) as InteractionEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    return []
  }
}

export async function appendInteraction(
  input: Partial<InteractionEvent>
): Promise<InteractionEvent> {
  const events = await readInteractionLog()

  const event: InteractionEvent = {
    id: input.id ?? crypto.randomUUID(),
    type: input.type === "stripe" ? "stripe" : "shippo",
    action: input.action ?? "unknown",
    cart_id: input.cart_id,
    customer_id: input.customer_id,
    metadata: input.metadata,
    created_at: input.created_at ?? new Date().toISOString(),
  }

  events.push(event)

  await ensureLogFile()
  await fs.writeFile(LOG_PATH, JSON.stringify(events, null, 2), "utf-8")

  return event
}

export async function buildAnalyticsSummary() {
  const events = await readInteractionLog()

  const totals = events.reduce(
    (acc, curr) => {
      acc.total += 1
      acc.by_type[curr.type] = (acc.by_type[curr.type] || 0) + 1
      acc.by_action[curr.action] = (acc.by_action[curr.action] || 0) + 1
      return acc
    },
    {
      total: 0,
      by_type: {} as Record<string, number>,
      by_action: {} as Record<string, number>,
    }
  )

  const recent = events
    .slice(-25)
    .reverse()
    .map((event) => ({
      id: event.id,
      type: event.type,
      action: event.action,
      created_at: event.created_at,
      cart_id: event.cart_id,
      customer_id: event.customer_id,
    }))

  return {
    ...totals,
    recent,
  }
}
