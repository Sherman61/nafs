import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FlowPlanner from "@modules/flow/components/flow-planner"
import { getFlowSnapshot } from "@lib/data/flow"

export const metadata: Metadata = {
  title: "Fulfillment flow",
  description:
    "Review delivery, payment, and fulfillment options available for your region in one view.",
}

type Params = {
  params: Promise<{ countryCode: string }>
}

const FlowPage = async ({ params }: Params) => {
  await params

  const snapshot = await getFlowSnapshot()

  return (
    <div className="content-container py-12 small:py-16 space-y-8">
      <div className="flex flex-col gap-2 max-w-3xl">
        <p className="uppercase tracking-[0.2em] text-xs text-ui-fg-muted">
          Regional flow
        </p>
        <h1 className="text-3xl small:text-4xl font-semibold text-ui-fg-base">
          Configure checkout flow
        </h1>
        <p className="text-ui-fg-subtle">
          Review the delivery methods, payment providers, and fulfillment
          origins available for the current region. Adjust selections in one
          place before sending shoppers to checkout.
        </p>
      </div>

      <FlowPlanner snapshot={snapshot} />

      <div className="flex gap-3 items-center text-ui-fg-muted text-sm">
        <LocalizedClientLink href="/checkout?step=address">
          <span className="underline hover:text-ui-fg-base transition-colors">
            Jump to checkout
          </span>
        </LocalizedClientLink>
        <span aria-hidden>•</span>
        <LocalizedClientLink href="/cart">
          <span className="underline hover:text-ui-fg-base transition-colors">
            Return to cart
          </span>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default FlowPage
