import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Lefanek Ahava",
  description:
    "Learn about the Lefanek Ahava movement—born to bring people closer to each other, their community, and to God.",
}

type Params = {
  params: Promise<{ countryCode: string }>
}

const paragraphs = [
  "Born from a vision to bring people closer — to each other, to their community, and to God — Lefanek Ahava is more than a name; it’s a movement of love in action.",
  "Just as you are currently enjoying your environment, you can help the next person enjoy theirs.",
  "When you give away a dollar, you’re not just giving — you’re paying it forward to the next person, someone else will experience peace, joy, and love in their space.",
  "We try making No agenda the Only agenda.",
  "Lefanek Ahava is about unity, love, connection, community, and growth — all rooted in spirituality and guided by God above all.",
  "We believe that every small act of kindness creates ripples of healing and light. Together, we can uplift one another and build a world grounded in care, compassion, and purpose.",
  "We believe that spirituality is lived, not just spoken. Whether it’s sharing a smile, offering a fruit, or giving a dollar to someone in need, every gesture becomes a spark that carries warmth forward.",
]

export default async function AboutPage(props: Params) {
  await props.params

  return (
    <div className="content-container py-12 small:py-16 space-y-12">
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <p className="uppercase tracking-[0.2em] text-sm text-ahava-forest">
          Rooted in love
        </p>
        <h1 className="text-3xl small:text-4xl font-semibold text-ahava-ink">
          About Lefanek Ahava
        </h1>
        <p className="text-lg text-ui-fg-subtle">
          Thank you for being part of a movement that keeps generosity alive.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {paragraphs.map((text, index) => (
          <div
            key={index}
            className="rounded-large border border-ahava-forest/10 bg-white/80 backdrop-blur px-6 py-5 shadow-sm"
          >
            <p className="text-base text-ahava-ink leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        <div className="rounded-large bg-ahava-forest text-white p-6 flex flex-col gap-2 shadow-md">
          <h2 className="text-xl font-semibold">Unity & Connection</h2>
          <p className="text-white/80">
            We lift each other up by choosing care, compassion, and the joy of
            shared growth.
          </p>
        </div>
        <div className="rounded-large bg-white/90 border border-ahava-forest/15 p-6 flex flex-col gap-2 shadow-sm">
          <h2 className="text-xl font-semibold text-ahava-ink">Love in Action</h2>
          <p className="text-ui-fg-subtle">
            Small gestures—a smile, a fruit, a dollar—carry warmth forward to
            someone else’s day.
          </p>
        </div>
        <div className="rounded-large bg-ahava-blush/80 border border-ahava-forest/15 p-6 flex flex-col gap-2 shadow-sm">
          <h2 className="text-xl font-semibold text-ahava-ink">Guided by God</h2>
          <p className="text-ahava-ink/80">
            Our spirituality is lived, not spoken. Every step is guided by faith
            and purpose.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <LocalizedClientLink href="/store">
          <span className="contrast-btn bg-ahava-forest text-white hover:bg-ahava-gold hover:text-ahava-ink">
            Visit the store
          </span>
        </LocalizedClientLink>
        <LocalizedClientLink href="/tip">
          <span className="contrast-btn border-ahava-forest text-ahava-forest hover:bg-ahava-forest hover:text-white">
            Share a tip
          </span>
        </LocalizedClientLink>
      </div>

      <div className="text-center text-ui-fg-subtle">
        <p>Thank you</p>
        <p>@venmo …</p>
      </div>
    </div>
  )
}
