import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "About | Lefanek Ahava",
  description:
    "Learn about Lefanek Ahava's mission to spread love, connection, and generosity through everyday acts and mindful goods.",
}

const AboutPage = async () => {
  return (
    <div className="content-container py-16 flex flex-col gap-12 text-[#1f2f28]">
      <div className="max-w-4xl space-y-4">
        <Heading level="h1" className="text-4xl font-semibold text-[#2f4f4f]">
          About Lefanek Ahava
        </Heading>
        <Text className="text-lg leading-relaxed text-[#30403c]">
          Born from a vision to bring people closer — to each other, to their community, and to God — Lefanek Ahava is more than a name; it’s a movement of love in action.
        </Text>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="bg-white/80 backdrop-blur-md border border-[#d9e4d8] rounded-2xl p-6 shadow-[0_20px_60px_-24px_rgba(47,79,79,0.25)]">
          <Heading level="h2" className="text-2xl font-semibold text-[#2f4f4f]">
            Love that flows forward
          </Heading>
          <Text className="mt-3 leading-relaxed text-[#30403c]">
            Just as you are currently enjoying your environment, you can help the next person enjoy theirs. When you give away a dollar, you’re not just giving — you’re paying it forward to the next person so someone else will experience peace, joy, and love in their space.
          </Text>
        </section>

        <section className="bg-white/80 backdrop-blur-md border border-[#d9e4d8] rounded-2xl p-6 shadow-[0_20px_60px_-24px_rgba(47,79,79,0.25)]">
          <Heading level="h2" className="text-2xl font-semibold text-[#2f4f4f]">
            No agenda as the agenda
          </Heading>
          <Text className="mt-3 leading-relaxed text-[#30403c]">
            We try making no agenda the only agenda. Lefanek Ahava is about unity, love, connection, community, and growth — all rooted in spirituality and guided by God above all.
          </Text>
        </section>

        <section className="bg-white/80 backdrop-blur-md border border-[#d9e4d8] rounded-2xl p-6 shadow-[0_20px_60px_-24px_rgba(47,79,79,0.25)] md:col-span-2">
          <Heading level="h2" className="text-2xl font-semibold text-[#2f4f4f]">
            Spirituality in motion
          </Heading>
          <Text className="mt-3 leading-relaxed text-[#30403c]">
            We believe that every small act of kindness creates ripples of healing and light. Whether it’s sharing a smile, offering a fruit, or giving a dollar to someone in need, every gesture becomes a spark that carries warmth forward. Together, we can uplift one another and build a world grounded in care, compassion, and purpose.
          </Text>
        </section>
      </div>

      <div className="flex flex-col gap-3 max-w-2xl">
        <Heading level="h3" className="text-xl font-semibold text-[#2f4f4f]">
          Thank you for being here
        </Heading>
        <Text className="leading-relaxed text-[#30403c]">
          Your generosity keeps the circle of love moving. Every purchase, every tip, and every smile joins a chain of care that stretches far beyond this page. We’re grateful you’re part of the Lefanek Ahava story.
        </Text>
        <Text className="text-sm text-[#3c5f5f]">@venmo …</Text>
      </div>
    </div>
  )
}

export default AboutPage
