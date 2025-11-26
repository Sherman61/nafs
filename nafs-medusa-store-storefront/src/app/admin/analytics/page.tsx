import { getAnalyticsSummary } from "@lib/data/interactions"
import { Heading, Table, Text } from "@medusajs/ui"

export const metadata = {
  title: "Analytics",
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsSummary()

  return (
    <div className="content-container py-10 space-y-8">
      <div className="space-y-2">
        <Heading level="h1" className="text-3xl">
          Analytics overview
        </Heading>
        <Text className="text-ui-fg-subtle max-w-2xl">
          Track how shoppers interact with Shippo shipping selections and
          Stripe payments. Data is summarized from recent checkout activity and
          can be used to troubleshoot or validate frontend flows.
        </Text>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-rounded border p-4 bg-white shadow-card">
          <Text className="text-ui-fg-subtle">Total events</Text>
          <Heading level="h2">{analytics.total}</Heading>
        </div>
        <div className="rounded-rounded border p-4 bg-white shadow-card">
          <Text className="text-ui-fg-subtle">Shippo interactions</Text>
          <Heading level="h2">{analytics.by_type?.shippo ?? 0}</Heading>
        </div>
        <div className="rounded-rounded border p-4 bg-white shadow-card">
          <Text className="text-ui-fg-subtle">Stripe interactions</Text>
          <Heading level="h2">{analytics.by_type?.stripe ?? 0}</Heading>
        </div>
      </div>

      <div className="space-y-3">
        <Heading level="h3" className="text-xl">
          Actions breakdown
        </Heading>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Count</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(analytics.by_action || {}).map(([action, count]) => (
              <Table.Row key={action}>
                <Table.Cell>{action}</Table.Cell>
                <Table.Cell className="text-right">{count}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="space-y-3">
        <Heading level="h3" className="text-xl">
          Recent interactions
        </Heading>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <Table.HeaderCell>Cart</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Recorded</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(analytics.recent || []).map((event: any) => (
              <Table.Row key={event.id}>
                <Table.Cell className="capitalize">{event.type}</Table.Cell>
                <Table.Cell>{event.action}</Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">
                  {event.cart_id || "—"}
                </Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">
                  {event.customer_id || "—"}
                </Table.Cell>
                <Table.Cell className="text-right text-ui-fg-subtle">
                  {new Date(event.created_at).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
