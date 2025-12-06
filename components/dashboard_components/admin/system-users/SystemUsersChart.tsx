"use client"

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/global/language-provider"

const usersBySectorData = [
  { sectorKey: "farmer", users: 4200, active: 3800, inactive: 400 },
  { sectorKey: "hybrid_vehicle", users: 2150, active: 1980, inactive: 170 },
  { sectorKey: "eco_stove", users: 3100, active: 2850, inactive: 250 },
  { sectorKey: "commercial_building", users: 2000, active: 1750, inactive: 250 },
]

export default function SystemUsersChart() {
  const { t } = useLanguage()

  const getSectorName = (sectorKey: string) => {
    return t(`admin.${sectorKey}`)
  }

  const usersBySector = usersBySectorData.map((item) => ({
    ...item,
    sector: getSectorName(item.sectorKey),
  }))

  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader>
        <CardTitle>{t("admin.users_by_sector")}</CardTitle>
        <CardDescription>{t("admin.distribution_sectors")}</CardDescription>
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
