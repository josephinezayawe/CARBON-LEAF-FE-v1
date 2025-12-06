"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Database, Users, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HealthMetric {
  label: string
  value: number
  status: "healthy" | "warning" | "critical"
  icon: React.ReactNode
}

const healthMetrics: HealthMetric[] = [
  {
    label: "System Uptime",
    value: 99.8,
    status: "healthy",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    label: "Database Performance",
    value: 87,
    status: "healthy",
    icon: <Database className="w-4 h-4" />,
  },
  {
    label: "API Response Time",
    value: 94,
    status: "healthy",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    label: "Active Connections",
    value: 73,
    status: "warning",
    icon: <Users className="w-4 h-4" />,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "text-emerald-600"
    case "warning":
      return "text-amber-600"
    case "critical":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

const getProgressColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-emerald-500"
    case "warning":
      return "bg-amber-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-blue-500"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
    case "warning":
      return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
    case "critical":
      return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function SystemHealthWidget() {
  const overallHealth = Math.round(
    healthMetrics.reduce((sum, m) => sum + m.value, 0) / healthMetrics.length
  )

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">System Health</CardTitle>
            <CardDescription>Infrastructure & performance metrics</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{overallHealth}%</div>
            <Badge className={getStatusBadge("healthy")}>Healthy</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {healthMetrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={getStatusColor(metric.status)}>
                  {metric.icon}
                </div>
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}%
              </span>
            </div>
            <Progress
              value={metric.value}
              className="h-2"
              style={{
                background: "var(--muted)",
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
