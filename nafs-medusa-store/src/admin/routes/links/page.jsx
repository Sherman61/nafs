import { Container, Heading, Text } from "@medusajs/ui"

const LINKS = [
    {
        label: "Flow Planner",
        description: "Configure delivery + payment flow for your dev cart.",
        path: "/app/flow",
    },
    {
        label: "Stripe Test",
        description: "Run Stripe sandbox PaymentIntent tests with dev-only tools.",
        path: "/app/stripe-test",
    },
    {
        label: "Store Settings (Shippo Widget)",
        description: "Open Store settings – Shippo Rate Estimator widget lives here.",
        path: "/app/settings/store",
    },
    {
        label: "Shippo Test (Custom Page)",
        description: "Custom Shippo tools page (if you add /shippo-test route).",
        path: "/app/shippo",
    },
    // Add more of your own pages here:
    // {
    //   label: "My Custom Page",
    //   description: "Whatever this does.",
    //   path: "/app/my-custom-page",
    // },
]

const LinksPage = () => {
    return (
        <Container className="p-6 space-y-4" >
            <Heading level="h1" > Dev Links </Heading>
            < Text className="text-ui-fg-subtle text-sm" >
                Quick links to your custom admin pages and tools.Click any card to
                navigate there inside the Medusa admin.
            </Text>

            < div className="grid grid-cols-1 gap-3 md:grid-cols-2" >
                {
                    LINKS.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className="group rounded-lg border border-ui-border-base bg-ui-bg-base p-4 transition-all hover:border-ui-border-interactive hover:shadow-borders-interactive-with-active"
                        >
                            <div className="flex flex-col gap-1" >
                                <Text className="font-semibold text-ui-fg-base group-hover:text-ui-fg-interactive" >
                                    {link.label}
                                </Text>
                                < Text className="text-sm text-ui-fg-subtle" >
                                    {link.description}
                                </Text>
                                < Text className="mt-1 text-[11px] font-mono text-ui-fg-muted" >
                                    {link.path}
                                </Text>
                            </div>
                        </a>
                    ))
                }
            </div>

            < Text className="text-[11px] text-ui-fg-muted" >
                To add more links, edit < code > src / admin / routes / links / page.jsx </code> and
                append entries to the < code > LINKS </code> array.
            </Text>
        </Container>
    )
}

export default LinksPage

export const config = {
    link: {
        label: "Dev Links",
    },
}
