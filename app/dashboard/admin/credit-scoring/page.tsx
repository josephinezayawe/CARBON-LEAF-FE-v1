"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Brain, CheckCircle2, XCircle, File, Image as ImageIcon } from "lucide-react"
import CreditScoringAIAssistant from "@/components/dashboard_components/admin/credit-scoring/CreditScoringAIAssistant"
import PendingApplicationsList from "@/components/dashboard_components/admin/credit-scoring/PendingApplicationsList"
import UserDetailsPanel from "@/components/dashboard_components/admin/credit-scoring/UserDetailsPanel"
import type { Sector, PendingApplication } from "@/components/dashboard_components/admin/credit-scoring/types"

const mockApplications: PendingApplication[] = [
  {
    id: "app-001",
    userName: "Jean Ndayisaba",
    sector: "farmer",
    creditsRequested: 1200,
    submittedDate: "2 hours ago",
    documents: ["Land Certificate", "Farm Photos", "Production Records"],
    status: "pending_review",
  },
  {
    id: "app-002",
    userName: "Marie Uwizeyimana",
    sector: "eco-stoves",
    creditsRequested: 800,
    submittedDate: "5 hours ago",
    documents: ["Installation Photos", "User Agreement", "Proof of Residence"],
    status: "under_ai_review",
  },
  {
    id: "app-003",
    userName: "Paul Habimana",
    sector: "hybrid-vehicles",
    creditsRequested: 500,
    submittedDate: "1 day ago",
    documents: ["Vehicle Registration", "Purchase Invoice", "Insurance Document"],
    status: "pending_review",
  },
  {
    id: "app-004",
    userName: "Sophie Karangwa",
    sector: "commercial",
    creditsRequested: 2500,
    submittedDate: "2 days ago",
    documents: ["Building Audit", "Energy Certificates", "Business License"],
    status: "approved",
  },
]

export default function CreditScoringPage() {
  const { t } = useLanguage()
  const [selectedSector, setSelectedSector] = useState<Sector>("farmer")
  const [selectedApp, setSelectedApp] = useState<PendingApplication | null>(mockApplications[0])
  const [activeTab, setActiveTab] = useState("pending")

  const sectorApplications = mockApplications.filter(app => app.sector === selectedSector)

  const getSectorLabel = (sector: string) => {
    return t(`admin.${sector}`)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_review":
        return t("admin.cs_pending_review")
      case "under_ai_review":
        return t("admin.cs_under_ai_review")
      case "approved":
        return t("admin.cs_approved")
      case "rejected":
        return t("admin.cs_rejected")
      default:
        return status
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "under_ai_review":
        return <Brain className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.credit_scoring")}</h1>
        <p className="text-muted-foreground">
          {t("admin.ai_powered_verification")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.pending_review")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">{t("admin.awaiting_initial_review")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.under_ai_review")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">{t("admin.ai_verification_progress")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.approved")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">{t("admin.credits_issued")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.rejected")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">{t("admin.failed_verification")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        {/* Left Side - AI Assistant & Documents */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sector Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t("admin.select_sector_title")}</CardTitle>
              <CardDescription>{t("admin.choose_sector_verify")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSector} onValueChange={(value) => setSelectedSector(value as Sector)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">{t("admin.farmer")}</SelectItem>
                  <SelectItem value="eco-stoves">{t("admin.eco_stove")}</SelectItem>
                  <SelectItem value="hybrid-vehicles">{t("admin.hybrid_vehicle")}</SelectItem>
                  <SelectItem value="commercial">{t("admin.commercial_building")}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* AI Assistant Panel */}
          <CreditScoringAIAssistant selectedApplication={selectedApp} />

          {/* Documents Panel */}
           {selectedApp && (
             <Card className="border-0 shadow-sm">
               <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <File className="w-5 h-5" />
                   {t("admin.documents_evidence")}
                 </CardTitle>
                 <CardDescription>
                   {selectedApp.documents.length} {t("admin.documents_provided")}
                 </CardDescription>
               </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-sm">{doc}</span>
                      </div>
                      <Button size="sm" variant="ghost">{t("admin.view")}</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Applications List & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications List */}
          <PendingApplicationsList
            applications={sectorApplications}
            selectedApp={selectedApp}
            onSelectApp={setSelectedApp}
          />

          {/* User Details */}
          {selectedApp && (
            <UserDetailsPanel application={selectedApp} />
          )}
        </div>
      </div>
    </div>
  )
}
