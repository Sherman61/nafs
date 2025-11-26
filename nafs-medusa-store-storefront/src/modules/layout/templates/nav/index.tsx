import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { ThemeSwitcher } from "@modules/layout/components/theme-switcher"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-ahava-sand/90 backdrop-blur border-ahava-forest/20 dark:bg-[#0f1613]/90 dark:border-white/10">
        <nav className="content-container txt-xsmall-plus text-ahava-ink flex items-center justify-between w-full h-full text-small-regular dark:text-white">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ahava-forest uppercase tracking-[0.08em]"
              data-testid="nav-home-link"
            >
              Lefanek Ahava
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full text-[#2f4f4f]">
              <LocalizedClientLink className="hover:text-[#3c7a5e]" href="/store">
                Store
              </LocalizedClientLink>
              <LocalizedClientLink className="hover:text-[#3c7a5e]" href="/about">
                About
              </LocalizedClientLink>
              <LocalizedClientLink className="hover:text-[#3c7a5e]" href="/links">
                Links
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-ahava-forest"
                href="/tip"
                data-testid="nav-tip-link"
              >
                Tip
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-ahava-forest"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ahava-forest flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <div className="hidden small:flex h-full items-center pl-4 border-l border-ahava-forest/10 dark:border-white/10">
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
