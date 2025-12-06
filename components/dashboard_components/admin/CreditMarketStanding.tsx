"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target } from "lucide-react"
import { useLanguage } from "@/components/global/language-provider"

interface MarketMetric {
  label: string
  value: string
  change: number
  trend: "up" | "down"
}

const getMarketMetrics = (t: (key: string) => string): MarketMetric[] => [
   {
     label: t("admin.market_price_per_credit"),
     value: "210 RWF",
     change: 2.4,
     trend: "up",
   },
   {
     label: t("admin.trading_volume_24h"),
     value: "850K",
     change: 12.5,
     trend: "up",
   },
   {
     label: t("admin.market_demand"),
     value: t("admin.very_high"),
     change: 8.2,
     trend: "up",
   },
   {
     label: t("admin.available_supply"),
     value: "2.5M Credits",
     change: -3.1,
     trend: "down",
   },
 ]

const sectorPricesData = [
  { key: "farmer", price: 215, change: 1.9 },
  { key: "eco_stove", price: 212, change: 0.5 },
  { key: "hybrid_vehicle", price: 205, change: -1.2 },
  { key: "commercial_building", price: 218, change: 3.4 },
]

export default function CreditMarketStanding() {
   const { t } = useLanguage()
   const marketMetrics = getMarketMetrics(t)
   
   const sectorPrices = sectorPricesData.map((item) => ({
     ...item,
     sector: t(`admin.${item.key}`),
   }))

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{t("admin.market_standing")}</CardTitle>
              <CardDescription>{t("admin.real_time_market_metrics")}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="space-y-3">
          {marketMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className="font-bold text-base">{metric.value}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.trend === "up" ? "+" : ""}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sector Pricing */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold mb-3">{t("admin.sector_pricing")}</h4>
          <div className="space-y-2">
            {sectorPrices.map((sector) => (
              <div
                key={sector.sector}
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <span className="text-sm font-medium">{sector.sector}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{sector.price} RWF</span>
                  <Badge
                    variant="outline"
                    className={`text-xs py-0 h-5 ${
                      sector.change > 0
                        ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "text-red-600 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {sector.change > 0 ? "+" : ""}{sector.change}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
