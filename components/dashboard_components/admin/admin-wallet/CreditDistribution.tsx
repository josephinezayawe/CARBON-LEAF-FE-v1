"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const distributionData = [
  { name: "Farmer", value: 825000, color: "hsl(142, 76%, 36%)" },
  { name: "Eco Stoves", value: 625000, color: "hsl(39, 84%, 53%)" },
  { name: "Hybrid Vehicles", value: 525000, color: "hsl(217, 91%, 60%)" },
  { name: "Commercial", value: 525000, color: "hsl(280, 85%, 50%)" },
]

export default function CreditDistribution() {
  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Credit Distribution</CardTitle>
        <CardDescription>By sector</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `${(value / 1000000).toFixed(1)}M`} />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2">
          {distributionData.map((sector) => (
            <div
              key={sector.name}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sector.color }}
                />
                <span className="text-sm font-medium">{sector.name}</span>
              </div>
              <Badge variant="secondary">
                {(sector.value / 1000000).toFixed(1)}M
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
