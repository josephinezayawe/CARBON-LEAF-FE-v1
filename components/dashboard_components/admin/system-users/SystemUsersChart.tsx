"use client"

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const usersBySector = [
  { sector: "Farmer", users: 4200, active: 3800, inactive: 400 },
  { sector: "Hybrid Vehicle", users: 2150, active: 1980, inactive: 170 },
  { sector: "Eco Stoves", users: 3100, active: 2850, inactive: 250 },
  { sector: "Commercial", users: 2000, active: 1750, inactive: 250 },
]

export default function SystemUsersChart() {
  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Users by Sector</CardTitle>
        <CardDescription>Distribution across all sectors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersBySector}>
              <CartesianGrid
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="sector"
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
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              />
              <Legend />
              <Bar dataKey="active" fill="hsl(142, 76%, 36%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="inactive" fill="hsl(0, 84%, 60%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
