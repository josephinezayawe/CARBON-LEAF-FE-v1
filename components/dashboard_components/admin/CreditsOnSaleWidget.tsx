"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ShoppingCart, Zap } from "lucide-react"
import { useLanguage } from "@/components/global/language-provider"

interface CreditListing {
  id: string
  name: string
  quantity: number
  pricePerCredit: number
  totalValue: number
  status: "active" | "sold_out" | "paused"
}

const mockListings: CreditListing[] = [
  {
    id: "1",
    name: "Farmer Credits - Batch 001",
    quantity: 45000,
    pricePerCredit: 210,
    totalValue: 9450000,
    status: "active",
  },
  {
    id: "2",
    name: "Eco Stove Credits",
    quantity: 28500,
    pricePerCredit: 215,
    totalValue: 6132500,
    status: "active",
  },
  {
    id: "3",
    name: "Hybrid Vehicle Credits",
    quantity: 12000,
    pricePerCredit: 208,
    totalValue: 2496000,
    status: "paused",
  },
]

export default function CreditsOnSaleWidget() {
  const { t } = useLanguage()

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("admin.status_active")
      case "sold_out":
        return t("admin.listing_status_sold_out")
      case "paused":
        return t("admin.listing_status_paused")
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      case "sold_out":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      case "paused":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const totalOnSale = mockListings.reduce((sum, listing) => sum + listing.totalValue, 0)
  const activeListings = mockListings.filter(l => l.status === "active").length

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{t("admin.credits_on_sale")}</CardTitle>
              <CardDescription>{activeListings} {t("admin.active_listings")}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total Value */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <p className="text-xs text-muted-foreground mb-1">{t("admin.total_value_on_market")}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {(totalOnSale / 1000000).toFixed(1)}M
            </span>
            <span className="text-sm text-muted-foreground">RWF</span>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-3">
          {mockListings.map((listing) => (
            <div
              key={listing.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{listing.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {listing.quantity.toLocaleString()} credits @ {listing.pricePerCredit} RWF
                  </p>
                </div>
                <Badge className={getStatusColor(listing.status)}>
                   {getStatusLabel(listing.status)}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold">
                  {(listing.totalValue / 1000000).toFixed(2)}M RWF
                </span>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  {t("admin.manage")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          {t("admin.create_new_listing")}
        </Button>
      </CardContent>
    </Card>
  )
}
