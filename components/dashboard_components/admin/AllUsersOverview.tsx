"use client"

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useLanguage } from "@/components/global/language-provider"
import { Badge } from "@/components/ui/badge"

const userDataBySector = [
  { name: "Farmer", users: 4200, active: 3800, pending: 400, color: "hsl(142, 76%, 36%)" },
  { name: "Hybrid Car Owner", users: 2150, active: 1980, pending: 170, color: "hsl(217, 91%, 60%)" },
  { name: "Eco Stoves", users: 3100, active: 2850, pending: 250, color: "hsl(39, 84%, 53%)" },
  { name: "Commercial Building", users: 2000, active: 1750, pending: 250, color: "hsl(280, 85%, 50%)" },
]

const statusBreakdown = [
  { name: "Active", value: 10380, color: "hsl(142, 76%, 36%)" },
  { name: "Pending", value: 1070, color: "hsl(39, 84%, 53%)" },
  { name: "Suspended", value: 350, color: "hsl(0, 84%, 60%)" },
  { name: "Inactive", value: 350, color: "hsl(200, 40%, 60%)" },
]

export default function AllUsersOverview() {
  const { t } = useLanguage()

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">User Overview</CardTitle>
            <CardDescription className="mt-2">
              Distribution across sectors and statuses
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">12,450</div>
            <div className="text-sm text-gray-500">Total users</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Users by Sector Chart */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold mb-4">Users by Sector</h4>
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userDataBySector}>
                <CartesianGrid
                  vertical={false}
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="users" fill="hsl(217, 91%, 60%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-4">Status Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} users`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {statusBreakdown.map((status) => (
              <div
                key={status.name}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium">{status.name}</span>
                </div>
                <Badge variant="secondary" className="bg-transparent border-0">
                  {status.value.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
