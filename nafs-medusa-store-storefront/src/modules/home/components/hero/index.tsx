import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-b-large bg-gradient-to-br from-ahava-forest via-ahava-fern to-ahava-gold/70 text-white shadow-lg">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#e6d9c9_0,transparent_30%),radial-gradient(circle_at_80%_0%,#c19b63_0,transparent_35%)]" />
      <div className="absolute inset-0 border-b border-white/20" />
      <div className="content-container relative z-10 flex flex-col gap-6 py-20 text-center small:py-28">
        <div className="mx-auto max-w-3xl space-y-2">
          <p className="uppercase tracking-[0.2em] text-sm text-ahava-blush">
            Lefanek Ahava
          </p>
          <h1 className="text-3xl leading-[42px] small:text-4xl small:leading-[52px] font-semibold">
            A movement of love lived out in community
          </h1>
          <p className="text-lg text-white/80">
            Born to bring people closer—to each other, to their community, and to God.
            Every act of generosity creates ripples of peace, joy, and unity.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <LocalizedClientLink href="/store" data-testid="hero-store-link">
            <Button className="bg-white text-ahava-forest hover:bg-ahava-blush hover:text-ahava-ink">
              Shop the store
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/about" data-testid="hero-about-link">
            <Button variant="secondary" className="border-white/60 text-white hover:bg-white/10">
              Discover Lefanek Ahava
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero
