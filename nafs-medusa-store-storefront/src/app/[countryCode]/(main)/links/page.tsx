import Link from "next/link"

const resources = [
  {
    title: "Medusa Admin Dashboard",
    description: "Manage products, regions, and fulfillment settings directly in Medusa.",
    href: "https://docs.medusajs.com/user-guide/overview",
  },
  {
    title: "Storefront Theme Guide",
    description: "Learn how to customize this storefront using Tailwind CSS and Next.js.",
    href: "https://docs.medusajs.com/modules/overview/storefront",
  },
  {
    title: "Developer Reference",
    description: "Explore the Medusa API reference and SDK examples for deeper integrations.",
    href: "https://docs.medusajs.com/api/store",
  },
  {
    title: "Community",
    description: "Join the Medusa community forum to ask questions and share feedback.",
    href: "https://github.com/medusajs/medusa/discussions",
  },
  {
    title: "Shipping Providers",
    description: "Configure and test Shippo shipping options for your carts.",
    href: "https://docs.medusajs.com/plugins/shippo",
  },
  {
    title: "Payments",
    description: "Review how to connect Stripe and manage payment flows securely.",
    href: "https://docs.medusajs.com/modules/payments/stripe",
  },
]

export const metadata = {
  title: "Helpful Links",
}

export default function LinksPage() {
  return (
    <div className="content-container py-12 space-y-8">
      <div className="space-y-2 max-w-3xl">
        <h1 className="text-3xl font-semibold text-ahava-ink dark:text-white">Helpful links</h1>
        <p className="text-base text-[#2f4f4f] dark:text-gray-200">
          Quick access to documentation, community resources, and setup guides to
          keep your storefront and admin tools running smoothly.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group block h-full rounded-2xl border border-ahava-forest/20 bg-white p-6 shadow-card transition transform hover:-translate-y-1 hover:border-ahava-forest/50 hover:shadow-lg dark:border-white/10 dark:bg-[#0f1613]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-ahava-ink dark:text-white">
                  {item.title}
                </h2>
                <p className="text-sm text-[#2f4f4f] dark:text-gray-300">
                  {item.description}
                </p>
              </div>
              <span className="rounded-full bg-ahava-forest/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ahava-forest transition group-hover:bg-ahava-forest group-hover:text-white dark:bg-white/10 dark:text-white">
                Visit
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
