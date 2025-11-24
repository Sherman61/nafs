// import { Container, Heading, Text } from "@medusajs/ui"
// import React from "react"
// import { defineWidgetConfig } from "@medusajs/admin-sdk"
import ProductWidget from "../../widgets/product-widget"
import FlowPage from "./test"
const MainFlowPage = () => {
    return (
        <>
            <FlowPage />
            <ProductWidget />
        </>
    )
}

export default MainFlowPage

export const config = {
    link: {
        label: "Flow Planner 2",
        // You can import a custom icon component if you want
    },
}
