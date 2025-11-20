import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="bg-ahava-sand text-ahava-ink">
        <main className="relative min-h-screen bg-gradient-to-b from-ahava-blush/60 via-ahava-sand to-white">
          {props.children}
        </main>
      </body>
    </html>
  )
}
