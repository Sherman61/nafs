import { Container, Heading, Text } from "@medusajs/ui"
// import React from "react"
// import { defineWidgetConfig } from "@medusajs/admin-sdk"
import ShippoPreferencesWidget from "./../../widgets/shippo-preferences"

const FlowPage = () => {
    return (
        <>
            <Container className="p-6">
                <ShippoPreferencesWidget />

                <Heading level="h1">Flow Planner</Heading>
                <Text className="text-ui-fg-subtle">
                    Custom admin page wired into your Medusa v2 backend. chatgpt test
                </Text>
            </Container >
        </>
    )
}

export default FlowPage

export const config = {
    link: {
        label: "Flow Planner",
        // You can import a custom icon component if you want
    },
}
