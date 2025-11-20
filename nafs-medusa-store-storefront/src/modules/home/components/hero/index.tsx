import { ArrowUpRight } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-b-large bg-gradient-to-br from-[#ecf4e8] via-[#f7f0e8] to-[#e7f1ec]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(80,180,120,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(76,120,186,0.14),transparent_30%)]" />
      <div className="content-container relative z-10 flex flex-col items-start gap-8 py-20 small:py-28">
        <div className="flex flex-col gap-3 max-w-3xl">
          <Heading level="h1" className="text-4xl small:text-5xl font-semibold text-[#1f2f28]">
            Lefanek Ahava
          </Heading>
          <Heading level="h2" className="text-2xl small:text-3xl font-medium text-[#2f4f4f]">
            Love in motion, community in bloom.
          </Heading>
          <Text className="text-lg text-[#30403c] leading-relaxed">
            Discover goods that nurture unity, generosity, and spiritual warmth. Every purchase helps pay kindness forward so
            someone else can feel peace, joy, and love in their space.
          </Text>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-[#3c7a5e] hover:bg-[#2f5f4b] border-0">
            <a href="/store">
              Explore the Store
              <ArrowUpRight className="inline-block" />
            </a>
          </Button>
          <Button variant="secondary" asChild className="border-[#3c7a5e] text-[#2f4f4f]">
            <a href="/tip">Share a Blessing</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
