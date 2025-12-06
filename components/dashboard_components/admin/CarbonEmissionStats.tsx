"use client"

import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingDown, TrendingUp } from "lucide-react"
import { useLanguage } from "@/components/global/language-provider"

const getChartData = (t: (key: string) => string) => [
  {
    month: "Jan",
    emissions: 4200,
    reduction: 1200,
    target: 3000,
  },
  {
    month: "Feb",
    emissions: 3800,
    reduction: 1400,
    target: 3000,
  },
  {
    month: "Mar",
    emissions: 3200,
    reduction: 1800,
    target: 3000,
  },
  {
    month: "Apr",
    emissions: 2800,
    reduction: 2200,
    target: 3000,
  },
  {
    month: "May",
    emissions: 2200,
    reduction: 2800,
    target: 3000,
  },
  {
    month: "Jun",
    emissions: 1800,
    reduction: 3200,
    target: 3000,
  },
]

const chartConfig = {
  emissions: {
    label: "Total Emissions (tons)",
    color: "hsl(0, 84%, 60%)",
  },
  reduction: {
    label: "Reduction Achieved (tons)",
    color: "hsl(142, 76%, 36%)",
  },
  target: {
    label: "Target (tons)",
    color: "hsl(217, 91%, 60%)",
  },
} satisfies ChartConfig

export default function CarbonEmissionStats() {
  const { t } = useLanguage()
  const chartData = getChartData(t)

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
             <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
               {t("admin.carbon_emission_tracking")}
               <TrendingDown className="h-5 w-5 text-emerald-500" />
             </CardTitle>
             <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
               {t("admin.system_wide_emission_reduction")}
             </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">-58%</div>
            <div className="text-sm text-gray-500">{t("admin.overall_reduction")}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReduction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value} tons`, ""]}
                  />
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="emissions"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEmissions)"
              />
              <Area
                type="monotone"
                dataKey="reduction"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorReduction)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
