"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"
import { useLanguage } from "@/components/global/language-provider"

interface PendingApproval {
  id: string
  userName: string
  sector: string
  creditsRequested: number
  submittedDate: string
  status: "pending" | "verification" | "documents"
}

const mockPendingApprovals: PendingApproval[] = [
  {
    id: "1",
    userName: "Jean Ndayisaba",
    sector: "farmer",
    creditsRequested: 1200,
    submittedDate: "2 hours ago",
    status: "documents",
  },
  {
    id: "2",
    userName: "Marie Uwizeyimana",
    sector: "eco_stove",
    creditsRequested: 800,
    submittedDate: "5 hours ago",
    status: "verification",
  },
  {
    id: "3",
    userName: "Paul Habimana",
    sector: "hybrid_vehicle",
    creditsRequested: 500,
    submittedDate: "1 day ago",
    status: "pending",
  },
  {
    id: "4",
    userName: "Sophie Karangwa",
    sector: "commercial_building",
    creditsRequested: 2500,
    submittedDate: "2 days ago",
    status: "documents",
  },
  {
    id: "5",
    userName: "Emmanuel Kanyarwanda",
    sector: "farmer",
    creditsRequested: 950,
    submittedDate: "3 days ago",
    status: "pending",
  },
]

export default function PendingApprovalsWidget() {
  const { t } = useLanguage()

  const getSectorLabel = (sector: string) => {
    return t(`admin.${sector}`)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "documents":
        return t("admin.approval_status_documents")
      case "verification":
        return t("admin.approval_status_verification")
      case "pending":
        return t("admin.approval_status_pending")
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "documents":
        return <AlertCircle className="w-4 h-4 text-amber-600" />
      case "verification":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "documents":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
      case "verification":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "pending":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              {t("admin.pending_approvals")}
            </CardTitle>
            <CardDescription className="mt-2">
              {mockPendingApprovals.length} {t("admin.requests_awaiting_verification")}
            </CardDescription>
          </div>
          <Badge variant="destructive" className="text-lg h-8 w-8 flex items-center justify-center p-0">
            {mockPendingApprovals.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {mockPendingApprovals.slice(0, 3).map((approval) => (
          <div
            key={approval.id}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(approval.status)}
                  <p className="font-medium text-sm truncate">{approval.userName}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                     {getSectorLabel(approval.sector)} • {approval.creditsRequested.toLocaleString()} credits
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{approval.submittedDate}</p>
                  </div>
                  <Badge className={getStatusColor(approval.status)}>
                  {getStatusLabel(approval.status)}
                  </Badge>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full text-sm mt-2">
          {t("admin.view_all_requests")} {mockPendingApprovals.length}
        </Button>
      </CardContent>
    </Card>
  )
}
