import { Metadata } from "next"
import { Button, Heading, Text } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Tip | Lefanek Ahava",
  description: "Share a blessing with the Lefanek Ahava community and help pay love forward.",
}

const TipPage = async () => {
  return (
    <div className="content-container py-16 flex flex-col gap-10 text-[#1f2f28]">
      <div className="max-w-3xl space-y-4">
        <Heading level="h1" className="text-4xl font-semibold text-[#2f4f4f]">
          Share a blessing
        </Heading>
        <Text className="text-lg leading-relaxed text-[#30403c]">
          Your generosity keeps the Lefanek Ahava movement flowing. Every tip fuels more acts of kindness — a smile shared,
          a fruit offered, or a safe place made warmer for someone else.
        </Text>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="bg-white/80 backdrop-blur-md border border-[#d9e4d8] rounded-2xl p-6 shadow-[0_20px_60px_-24px_rgba(47,79,79,0.25)] flex flex-col gap-3">
          <Heading level="h2" className="text-2xl font-semibold text-[#2f4f4f]">
            Tip directly
          </Heading>
          <Text className="leading-relaxed text-[#30403c]">
            Tap below to send a gift. Each dollar is a seed that grows peace, joy, and love in someone else’s space.
          </Text>
          <Button asChild className="w-fit bg-[#3c7a5e] hover:bg-[#2f5f4b] border-0">
            <a href="https://venmo.com" target="_blank" rel="noreferrer">
              Tip on Venmo
            </a>
          </Button>
          <Text className="text-sm text-[#3c5f5f]">@venmo …</Text>
        </section>

        <section className="bg-white/80 backdrop-blur-md border border-[#d9e4d8] rounded-2xl p-6 shadow-[0_20px_60px_-24px_rgba(47,79,79,0.25)] flex flex-col gap-3">
          <Heading level="h2" className="text-2xl font-semibold text-[#2f4f4f]">
            Support through the store
          </Heading>
          <Text className="leading-relaxed text-[#30403c]">
            Prefer something tangible? Shop the store to uplift your space while fueling community care. Every purchase carries
            a little more light forward.
          </Text>
          <Button asChild variant="secondary" className="w-fit border-[#3c7a5e] text-[#2f4f4f]">
            <a href="/store">Browse the Store</a>
          </Button>
        </section>
      </div>
    </div>
  )
}

export default TipPage
