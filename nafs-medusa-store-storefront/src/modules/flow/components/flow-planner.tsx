"use client"

import { useState, useTransition } from "react"



import { Button, Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import { CheckCircleSolid, RefreshCw } from "@medusajs/icons"

import { FlowSnapshot } from "@lib/data/flow"
import { initiatePaymentSession, setShippingMethod } from "@lib/data/cart"
import { isStripeLike, paymentInfoMap } from "@lib/constants"

type FlowPlannerProps = {
  snapshot: FlowSnapshot | null
}

const FlowPlanner = ({ snapshot }: FlowPlannerProps) => {
  const [isPending, startTransition] = useTransition()
  const [selectedShipping, setSelectedShipping] = useState<string | null>(
    snapshot?.cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )
  const [selectedPayment, setSelectedPayment] = useState<string | null>(
    snapshot?.cart.payment_collection?.payment_sessions?.find(
      (s) => s.status === "pending"
    )?.provider_id || null
  )
  const [message, setMessage] = useState<string | null>(null)

  const regionLabel = snapshot?.cart.region
    ? `${snapshot.cart.region.name} (${snapshot.cart.region.currency_code?.toUpperCase()})`
    : "No active region"

  if (!snapshot) {
    return (
      <Container className="p-6 flex flex-col gap-2">
        <Heading level="h2">Flow overview unavailable</Heading>
        <Text className="text-ui-fg-subtle">
          We could not load the current cart or region. Add an item to your
          cart to set a region, then revisit this page.
        </Text>
      </Container>
    )
  }

  const handleShippingSelection = (shippingOptionId: string) => {
    setMessage(null)
    setSelectedShipping(shippingOptionId)
    startTransition(async () => {
      try {
        await setShippingMethod({
          cartId: snapshot.cart.id,
          shippingMethodId: shippingOptionId,
        })
        setMessage("Delivery method saved for this region.")
      } catch (err: any) {
        setMessage(err.message || "Unable to save delivery method.")
      }
    })
  }

  const handlePaymentSelection = (providerId: string) => {
    setMessage(null)
    setSelectedPayment(providerId)
    startTransition(async () => {
      try {
        await initiatePaymentSession(snapshot.cart, {
          provider_id: providerId,
        })
        setMessage("Payment method prepared for checkout.")
      } catch (err: any) {
        setMessage(err.message || "Unable to initialize payment.")
      }
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-6">
        <Container className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-ui-fg-muted">
                Region
              </p>
              <Heading level="h2" className="text-2xl">
                {regionLabel}
              </Heading>
              <Text className="text-ui-fg-subtle">
                Configure delivery, payment, and fulfillment from one place.
              </Text>
            </div>
            <StatusBadge color="green">Cart ready</StatusBadge>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-ui-fg-muted">
            <span className="inline-flex items-center gap-1">
              <CheckCircleSolid /> Delivery + Payment in sync
            </span>
            <span className="inline-flex items-center gap-1">
              {/* <RefreshCw className="h-4 w-4" /> */}
              Changes auto-refresh checkout
            </span>

          </div>
        </Container>

        <Container className="p-6 space-y-4">
          <Heading level="h3" className="text-xl">
            Delivery methods
          </Heading>
          <div className="grid gap-3">
            {snapshot.shippingOptions.map((option) => {
              const isSelected = selectedShipping === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleShippingSelection(option.id)}
                  className={`text-left rounded-lg border p-4 transition-all duration-150 hover:shadow-borders-interactive-with-active ${isSelected
                    ? "border-ui-border-interactive bg-ui-bg-subtle"
                    : "border-ui-border-base"
                    }`}
                  disabled={isPending}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-ui-fg-base">
                        {option.name}
                      </span>
                      {option.service_zone?.fulfillment_set?.location?.address && (
                        <Text className="text-ui-fg-muted text-sm">
                          Ships from {formatOrigin(option)}
                        </Text>
                      )}
                    </div>
                    {isSelected && <CheckCircleSolid className="text-ui-fg-interactive" />}
                  </div>
                </button>
              )
            })}
          </div>
        </Container>

        <Container className="p-6 space-y-4">
          <Heading level="h3" className="text-xl">
            Payment methods
          </Heading>
          <div className="grid gap-3">
            {snapshot.paymentProviders.map((provider) => {
              const isSelected = selectedPayment === provider.id
              const info = paymentInfoMap[provider.id]

              return (
                <button
                  key={provider.id}
                  onClick={() => handlePaymentSelection(provider.id)}
                  className={`text-left rounded-lg border p-4 transition-all duration-150 hover:shadow-borders-interactive-with-active ${isSelected
                    ? "border-ui-border-interactive bg-ui-bg-subtle"
                    : "border-ui-border-base"
                    }`}
                  disabled={isPending}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-ui-fg-base">
                        {info?.title || provider.id}
                      </span>
                      <Text className="text-ui-fg-muted text-sm">
                        {isStripeLike(provider.id)
                          ? "Card details captured at checkout"
                          : "Collect payment during review"}
                      </Text>
                    </div>
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-ui-bg-base">
                      {info?.icon}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Container>
      </div>

      <div className="space-y-4">
        <Container className="p-6 space-y-3">
          <Heading level="h3" className="text-xl">
            Fulfillment origin
          </Heading>
          {snapshot.shippingOrigins.length ? (
            <div className="space-y-3">
              {snapshot.shippingOrigins.map((origin) => (
                <div
                  key={origin.id}
                  className="border border-ui-border-base rounded-lg p-4 bg-ui-bg-subtle"
                >
                  <Text className="font-semibold text-ui-fg-base">
                    {origin.name || "Fulfillment location"}
                  </Text>
                  {origin.address && (
                    <Text className="text-ui-fg-muted text-sm">
                      {origin.address}
                    </Text>
                  )}
                  <Text className="text-ui-fg-muted text-xs mt-2 block">
                    Used by: {origin.optionIds.length} delivery option(s)
                  </Text>
                </div>
              ))}
            </div>
          ) : (
            <Text className="text-ui-fg-muted text-sm">
              Shipping origins will appear once delivery methods are configured
              for this region.
            </Text>
          )}
        </Container>

        <Container className="p-6 space-y-3">
          <Heading level="h3" className="text-xl">
            Quick actions
          </Heading>
          <Text className="text-ui-fg-muted text-sm">
            Apply the selected delivery and payment choices and refresh the
            checkout page to verify the flow.
          </Text>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                if (!selectedShipping || !selectedPayment) {
                  setMessage("Select a delivery and payment method first.")
                  return
                }
                setMessage(
                  "Selections saved. Continue to checkout to finalize details."
                )
              }}
              isLoading={isPending}
            >
              Save flow
            </Button>
            {message && (
              <Text className="text-ui-fg-base text-sm" data-testid="flow-message">
                {message}
              </Text>
            )}
          </div>
        </Container>
      </div>
    </div>
  )
}

const formatOrigin = (option: FlowSnapshot["shippingOptions"][number]) => {
  const location = option.service_zone?.fulfillment_set?.location?.address
  if (!location) return "configured location"

  const parts = [location.city, location.country_code?.toUpperCase()].filter(
    Boolean
  )

  return parts.join(", ")
}

export default FlowPlanner
