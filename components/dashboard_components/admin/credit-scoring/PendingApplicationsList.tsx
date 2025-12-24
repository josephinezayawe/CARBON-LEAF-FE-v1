"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle, Brain, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Sector, PendingApplication } from "./types"

interface Props {
  applications: PendingApplication[]
  selectedApp: PendingApplication | null
  onSelectApp: (app: PendingApplication) => void
}

export default function PendingApplicationsList({
  applications,
  selectedApp,
  onSelectApp,
}: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "under_ai_review":
        return <Brain className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-amber-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_review":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
      case "under_ai_review":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "approved":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      case "rejected":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg">Applications</CardTitle>
        <CardDescription>
          {applications.length} pending for {applications[0]?.sector || "this sector"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {applications.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div>
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No applications for this sector</p>
              </div>
            </div>
          ) : (
            applications.map((app) => (
              <button
                key={app.id}
                onClick={() => onSelectApp(app)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all hover:shadow-md",
                  selectedApp?.id === app.id
                    ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{app.userName}</p>
                    <p className="text-xs text-muted-foreground">{app.submittedDate}</p>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    {getStatusIcon(app.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {app.creditsRequested.toLocaleString()} credits
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    {app.documents.length} docs
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
