"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

const chartData = [
  { category: "Conservation", credits: 120, fill: "var(--color-conservation)" },
  { category: "Amount", credits: 300, fill: "var(--color-amount)" },
  { category: "Used", credits: 80, fill: "var(--color-used)" },
  { category: "Available", credits: 220, fill: "var(--color-available)" },
]

const chartConfig = {
  credits: {
    label: "Credits",
  },
  conservation: {
    label: "Conservation",
    color: "hsl(var(--chart-1))",
  },
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-2))",
  },
  used: {
    label: "Used",
    color: "hsl(var(--chart-3))",
  },
  available: {
    label: "Available",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function CreditStats() {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader>
        <CardTitle>Credit Statistics</CardTitle>
        <CardDescription>Overview of your credit distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="credits" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
