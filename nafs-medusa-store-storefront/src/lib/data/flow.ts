"use server"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type ShippingOrigin = {
  id: string
  name: string
  address?: string
  optionIds: string[]
}

export type FlowSnapshot = {
  cart: HttpTypes.StoreCart
  shippingOptions: HttpTypes.StoreShippingOption[]
  paymentProviders: HttpTypes.StorePaymentProvider[]
  shippingOrigins: ShippingOrigin[]
}

const formatAddress = (location?: HttpTypes.StoreFulfillmentLocationAddress) => {
  if (!location) {
    return undefined
  }

  const parts = [
    location.address_1,
    location.address_2,
    location.postal_code && location.city
      ? `${location.postal_code} ${location.city}`
      : location.city,
    location.country_code?.toUpperCase(),
  ].filter(Boolean)

  return parts.join(", ")
}

export const getFlowSnapshot = async (): Promise<FlowSnapshot | null> => {
  const cart = await retrieveCart()

  if (!cart || !cart.region) {
    return null
  }

  const [shippingOptions, paymentProviders] = await Promise.all([
    listCartShippingMethods(cart.id),
    listCartPaymentMethods(cart.region.id),
  ])

  if (!shippingOptions || !paymentProviders) {
    return null
  }

  const originMap: Record<string, ShippingOrigin> = {}

  shippingOptions.forEach((option) => {
    const location = option.service_zone?.fulfillment_set?.location
    const originId =
      location?.id || option.service_zone?.fulfillment_set?.id || option.id

    if (!originId) {
      return
    }

    if (!originMap[originId]) {
      originMap[originId] = {
        id: originId,
        name:
          location?.name || option.service_zone?.fulfillment_set?.name || "",
        address: formatAddress(location?.address),
        optionIds: [],
      }
    }

    originMap[originId].optionIds.push(option.id)
  })

  return {
    cart,
    shippingOptions,
    paymentProviders,
    shippingOrigins: Object.values(originMap),
  }
}
