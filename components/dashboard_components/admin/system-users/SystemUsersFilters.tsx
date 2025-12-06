"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/global/language-provider"

const sectorStatsData = [
  { key: "farmer", count: 4200, percentage: 33.7 },
  { key: "hybrid_vehicle", count: 2150, percentage: 17.3 },
  { key: "eco_stove", count: 3100, percentage: 24.9 },
  { key: "commercial_building", count: 2000, percentage: 16.1 },
]

const statusStatsData = [
  { key: "status_active", count: 10380, color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300" },
  { key: "status_pending", count: 1420, color: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" },
  { key: "status_suspended", count: 650, color: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300" },
]

export default function SystemUsersFilters() {
  const { t } = useLanguage()

  const sectorStats = sectorStatsData.map((item) => ({
    ...item,
    name: t(`admin.${item.key}`),
  }))

  const statusStats = statusStatsData.map((item) => ({
    ...item,
    name: t(`admin.${item.key}`),
  }))

  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader>
        <CardTitle>{t("admin.quick_stats")}</CardTitle>
        <CardDescription>{t("admin.users_sector_status")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* By Sector */}
        <div>
          <h4 className="text-sm font-semibold mb-3">{t("admin.by_sector")}</h4>
          <div className="space-y-2">
            {sectorStats.map((sector) => (
              <div key={sector.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
          <h4 className="text-sm font-semibold mb-3">{t("admin.by_status")}</h4>
          <div className="space-y-2">
            {statusStats.map((status) => (
              <div key={status.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
