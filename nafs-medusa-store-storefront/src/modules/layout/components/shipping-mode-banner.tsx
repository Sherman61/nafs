import { ShippoSettings } from "@lib/data/shippo-settings"
import { Text } from "@medusajs/ui"

const ShippingModeBanner = ({ settings }: { settings: ShippoSettings }) => {
  if (!settings) {
    return null
  }

  const isShippo = settings.mode === "shippo"

  return (
    <div className="bg-[#e8f2ea] border-b border-[#dfe9dd] text-[#1f2f28]">
      <div className="content-container py-2 flex flex-col gap-1 small:flex-row small:items-center small:justify-between">
        <Text className="text-sm font-semibold text-[#2f4f4f]">
          Shipping guided by Lefanek Ahava
        </Text>
        <Text className="text-sm text-[#30403c]">
          {isShippo
            ? "Live Shippo calculations are active so every package meets you right where you are."
            : `Flat shipping applies: ${new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
              }).format(settings.flat_fee_amount || 0)} for every order.`}
        </Text>
      </div>
    </div>
  )
}

export default ShippingModeBanner
