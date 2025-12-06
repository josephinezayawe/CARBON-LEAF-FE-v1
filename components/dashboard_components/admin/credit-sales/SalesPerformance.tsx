"use client"

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/global/language-provider"

const salesData = [
  { date: "Week 1", credits: 5000, revenue: 1050000, buyers: 2 },
  { date: "Week 2", credits: 8200, revenue: 1723000, buyers: 3 },
  { date: "Week 3", credits: 12500, revenue: 2625000, buyers: 5 },
  { date: "Week 4", credits: 15000, revenue: 3150000, buyers: 6 },
]

interface CreditListing {
  id: string
  name: string
  quantity: number
  sold: number
  pricePerCredit: number
}

export default function SalesPerformance({ listings }: { listings: CreditListing[] }) {
  const { t } = useLanguage()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>{t("admin.sales_performance")}</CardTitle>
        <CardDescription>{t("admin.weekly_sales_trend")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="credits"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                dot={{ fill: "hsl(217, 91%, 60%)" }}
                name={t("admin.credits_sold")}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 76%, 36%)" }}
                name={t("admin.revenue_rwf")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
