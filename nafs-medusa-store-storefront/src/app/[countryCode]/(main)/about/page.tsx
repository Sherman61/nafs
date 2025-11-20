import { Metadata } from "next"
import type { ReactNode } from "react"

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
    <div className="content-container py-12 small:py-16 space-y-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ahava-blush/70 via-white to-ahava-forest/10 p-8 small:p-12 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(46,107,77,0.14),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(249,170,140,0.24),transparent_35%)] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="relative space-y-3 max-w-3xl">
          <p className="uppercase tracking-[0.2em] text-xs text-ahava-forest">
            Rooted in love
          </p>
          <h1 className="text-3xl small:text-4xl font-semibold text-ahava-ink">
            About Lefanek Ahava
          </h1>
          <p className="text-lg text-ui-fg-subtle">
            Thank you for being part of a movement that keeps generosity alive.
            Together we are building spaces filled with compassion and joy.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <LocalizedClientLink href="/store">
              <span className="inline-flex items-center gap-2 rounded-full bg-ahava-forest px-4 py-2 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-ahava-gold hover:text-ahava-ink">
                Visit the store
              </span>
            </LocalizedClientLink>
            <LocalizedClientLink href="/tip">
              <span className="inline-flex items-center gap-2 rounded-full border border-ahava-forest px-4 py-2 text-ahava-forest transition-all duration-200 hover:-translate-y-0.5 hover:bg-ahava-forest hover:text-white">
                Share a tip
              </span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
        {paragraphs.map((text, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-ahava-forest/15 bg-white/80 backdrop-blur px-6 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-borders-interactive-with-active"
          >
            <div className="flex items-center gap-3 pb-2">
              <span className="h-2 w-2 rounded-full bg-ahava-forest group-hover:scale-125 transition-transform" />
              <span className="text-xs uppercase tracking-[0.16em] text-ahava-forest/80">
                Chapter {index + 1}
              </span>
            </div>
            <p className="text-base text-ahava-ink leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-5">
        {["Unity & Connection", "Love in Action", "Guided by God"].map(
          (title, idx) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-ahava-forest/15 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-borders-interactive-with-active"
            >
              <div className="absolute inset-0 opacity-80 bg-gradient-to-br from-transparent via-ahava-blush/30 to-ahava-forest/10" />
              <div className="relative p-6 space-y-2">
                <h2 className="text-xl font-semibold text-ahava-ink flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-ahava-forest animate-pulse" />
                  {title}
                </h2>
                <p className="text-ui-fg-subtle">
                  {idx === 0
                    ? "We lift each other up by choosing care, compassion, and the joy of shared growth."
                    : idx === 1
                      ? "Small gestures—a smile, a fruit, a dollar—carry warmth forward to someone else’s day."
                      : "Our spirituality is lived, not spoken. Every step is guided by faith and purpose."}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <div className="rounded-2xl border border-ahava-forest/10 bg-ahava-forest text-white p-8 shadow-md flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-white animate-ping" />
          <span className="uppercase tracking-[0.18em] text-xs">Community note</span>
        </div>
        <p className="text-lg leading-relaxed">
          Every small act of kindness creates ripples of healing and light. Your
          generosity today keeps love moving forward for the next person.
        </p>
        <TextBadge>@venmo …</TextBadge>
      </div>
    </div>
  )
}

const TextBadge = ({ children }: { children: ReactNode }) => {
  return (
    <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
      {children}
    </span>
  )
}
