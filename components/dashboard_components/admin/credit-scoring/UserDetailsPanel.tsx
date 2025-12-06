"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, FileText, Zap, MapPin, Calendar } from "lucide-react"

interface PendingApplication {
  id: string
  userName: string
  sector: string
  creditsRequested: number
  submittedDate: string
  documents: string[]
  status: string
}

const sectorInfo: Record<string, { color: string; description: string }> = {
  farmer: {
    color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    description: "Agricultural carbon credits",
  },
  "eco-stoves": {
    color: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
    description: "Clean cooking solutions",
  },
  "hybrid-vehicles": {
    color: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    description: "Hybrid vehicle emissions",
  },
  commercial: {
    color: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    description: "Commercial building efficiency",
  },
}

export default function UserDetailsPanel({
  application,
}: {
  application: PendingApplication
}) {
  const sectorDetails = sectorInfo[application.sector] || sectorInfo.farmer

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          Applicant Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Full Name</label>
          <p className="font-semibold">{application.userName}</p>
        </div>

        {/* Sector */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Sector</label>
          <Badge className={sectorDetails.color}>
            {application.sector.replace(/-/g, " ")}
          </Badge>
          <p className="text-xs text-muted-foreground">{sectorDetails.description}</p>
        </div>

        {/* Credits Requested */}
        <div className="space-y-1 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <label className="text-xs font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Credits Requested
          </label>
          <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
            {application.creditsRequested.toLocaleString()}
          </p>
        </div>

        {/* Submission Date */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Submitted
          </label>
          <p className="text-sm">{application.submittedDate}</p>
        </div>

        {/* Documents Count */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </label>
          <p className="text-sm">
            {application.documents.length} file{application.documents.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact
          </label>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              {application.userName.toLowerCase().replace(" ", ".")}@example.com
            </p>
            <p className="text-muted-foreground">+250 78X XXX XXX</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
