"use client"

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const walletData = [
  { month: "Jan", credits: 1200000 },
  { month: "Feb", credits: 1450000 },
  { month: "Mar", credits: 1650000 },
  { month: "Apr", credits: 1850000 },
  { month: "May", credits: 2150000 },
  { month: "Jun", credits: 2500000 },
]

export default function WalletOverview() {
  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Wallet Growth
        </CardTitle>
        <CardDescription>6-month growth trend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={walletData}>
              <defs>
                <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: any) => `${(value / 1000000).toFixed(1)}M credits`}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              />
              <Area
                type="monotone"
                dataKey="credits"
                stroke="hsl(217, 91%, 60%)"
                fillOpacity={1}
                fill="url(#colorCredits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
