import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { Heading, Text } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Lefanek Ahava Store",
  description:
    "Explore thoughtful goods that carry the Lefanek Ahava spirit of unity, love, and generosity.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <div className="flex flex-col gap-10">
      <div className="content-container pt-10">
        <Heading level="h1" className="text-3xl font-semibold text-[#2f4f4f]">
          The Lefanek Ahava Store
        </Heading>
        <Text className="mt-2 text-lg text-[#30403c]">
          Curated pieces that help you bless your space and someone else’s, rooted in unity, generosity, and spiritual care.
        </Text>
      </div>

      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </div>
  )
}
