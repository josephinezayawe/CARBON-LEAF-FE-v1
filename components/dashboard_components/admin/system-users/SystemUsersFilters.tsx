"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sectorStats = [
  { name: "Farmer", count: 4200, percentage: 33.7 },
  { name: "Hybrid Vehicle", count: 2150, percentage: 17.3 },
  { name: "Eco Stoves", count: 3100, percentage: 24.9 },
  { name: "Commercial", count: 2000, percentage: 16.1 },
]

const statusStats = [
  { name: "Active", count: 10380, color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300" },
  { name: "Pending", count: 1420, color: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" },
  { name: "Suspended", count: 650, color: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300" },
]

export default function SystemUsersFilters() {
  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
        <CardDescription>Users by sector and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* By Sector */}
        <div>
          <h4 className="text-sm font-semibold mb-3">By Sector</h4>
          <div className="space-y-2">
            {sectorStats.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <span className="text-sm font-medium">{sector.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{sector.percentage}%</span>
                  <Badge variant="secondary">{sector.count.toLocaleString()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Status */}
        <div>
          <h4 className="text-sm font-semibold mb-3">By Status</h4>
          <div className="space-y-2">
            {statusStats.map((status) => (
              <div key={status.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <span className="text-sm font-medium">{status.name}</span>
                <Badge className={status.color}>
                  {status.count.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
