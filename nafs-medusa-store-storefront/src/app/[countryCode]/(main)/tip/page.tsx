import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Tip Lefanek Ahava",
  description:
    "Pay kindness forward with a tip that keeps the Lefanek Ahava movement thriving for the next person in line.",
}

type Params = {
  params: Promise<{ countryCode: string }>
}

const givingIdeas = [
  {
    title: "Give a dollar",
    copy: "A single dollar becomes peace, joy, and love in someone else’s space.",
  },
  {
    title: "Share fruit or a smile",
    copy: "Spirituality is lived—small gestures brighten the path for a neighbor.",
  },
  {
    title: "Cover their shipping",
    copy: "Help the next person receive their order with ease and gratitude.",
  },
]

export default async function TipPage(props: Params) {
  await props.params

  return (
    <div className="content-container py-12 small:py-16 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <p className="uppercase tracking-[0.2em] text-sm text-ahava-forest">
          Pay it forward
        </p>
        <h1 className="text-3xl small:text-4xl font-semibold text-ahava-ink">
          Tip the movement
        </h1>
        <p className="text-lg text-ui-fg-subtle">
          Every contribution keeps Lefanek Ahava alive for the next person. No
          agenda—just love in action.
        </p>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        {givingIdeas.map((idea) => (
          <div
            key={idea.title}
            className="rounded-large border border-ahava-forest/10 bg-white/85 backdrop-blur px-5 py-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-ahava-ink">{idea.title}</h2>
            <p className="text-ui-fg-subtle mt-2 leading-relaxed">{idea.copy}</p>
          </div>
        ))}
      </div>

      <div className="rounded-large bg-ahava-forest text-white p-6 flex flex-col gap-3 shadow-md">
        <h3 className="text-2xl font-semibold">How to send your tip</h3>
        <p className="text-white/80 leading-relaxed">
          Thank you for helping the next person enjoy their space. Tips can be
          shared directly via Venmo at <span className="font-semibold">@venmo …</span>.
        </p>
        <p className="text-white/80 leading-relaxed">
          Prefer to give through the store? Add a note at checkout and we will
          route your generosity forward.
        </p>
        <div className="flex flex-wrap gap-3">
          <LocalizedClientLink href="/store">
            <span className="contrast-btn bg-white text-ahava-forest hover:bg-ahava-blush hover:text-ahava-ink">
              Shop & add a note
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/about">
            <span className="contrast-btn border-white text-white hover:bg-white/10">
              Learn about Lefanek Ahava
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
