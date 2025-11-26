import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { ThemeProvider } from "@modules/theme/providers/theme-provider"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <body className="bg-ahava-sand text-ahava-ink">
        <ThemeProvider>
          <main className="relative min-h-screen bg-gradient-to-b from-ahava-blush/60 via-ahava-sand to-white dark:from-ahava-forest/30 dark:via-[#0f1613] dark:to-[#0c110f]">
            {props.children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
