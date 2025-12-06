"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Send, CheckCircle2, AlertTriangle, Sparkles, TrendingUp } from "lucide-react"

interface PendingApplication {
  id: string
  userName: string
  sector: string
  creditsRequested: number
  submittedDate: string
  documents: string[]
  status: string
}

interface AIAnalysis {
  legalityScore: number
  recommendation: "approve" | "review" | "reject"
  insights: string[]
  riskFactors: string[]
  confidence: number
}

const mockAIAnalyses: Record<string, AIAnalysis> = {
  "app-001": {
    legalityScore: 89,
    recommendation: "approve",
    insights: [
      "Land certificate is valid and recent",
      "Production records show consistent output",
      "Farm size matches claimed carbon offset potential",
      "No previous violations in system",
    ],
    riskFactors: [],
    confidence: 94,
  },
  "app-002": {
    legalityScore: 76,
    recommendation: "review",
    insights: [
      "Installation photos confirm device type",
      "User agreement properly signed",
      "Residence location verified",
    ],
    riskFactors: [
      "Minor discrepancy in installation date",
      "Limited user history available",
    ],
    confidence: 78,
  },
  "app-003": {
    legalityScore: 95,
    recommendation: "approve",
    insights: [
      "Vehicle registration legitimate",
      "Purchase invoice verified authentic",
      "Insurance active and current",
      "Hybrid status confirmed",
    ],
    riskFactors: [],
    confidence: 98,
  },
  "app-004": {
    legalityScore: 88,
    recommendation: "approve",
    insights: [
      "Building audit comprehensive and recent",
      "Energy certificates authentic",
      "Business properly licensed",
      "Commercial classification verified",
    ],
    riskFactors: [
      "Large credit request - consider phased approval",
    ],
    confidence: 92,
  },
}

export default function CreditScoringAIAssistant({
  selectedApplication,
}: {
  selectedApplication: PendingApplication | null
}) {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")

  if (!selectedApplication) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Select an application to begin AI-powered analysis
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setAiAnalysis(mockAIAnalyses[selectedApplication.id] || mockAIAnalyses["app-001"])
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Assistant & Analysis
        </CardTitle>
        <CardDescription>
          Intelligent verification for {selectedApplication.userName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!aiAnalysis ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-3">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium mb-4">
              Run AI analysis on this application
            </p>
            <Button
              onClick={handleRunAIAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AI Score Header */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Legality Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {aiAnalysis.legalityScore}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {aiAnalysis.confidence}%
                    </span>
                  </div>
                </div>
                <Badge
                  className={`text-lg h-12 px-4 ${
                    aiAnalysis.recommendation === "approve"
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                      : aiAnalysis.recommendation === "review"
                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                        : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                  }`}
                >
                  {aiAnalysis.recommendation.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Insights
              </h4>
              <div className="space-y-2">
                {aiAnalysis.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm"
                  >
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            {aiAnalysis.riskFactors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Risk Factors
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.riskFactors.map((risk, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm"
                    >
                      <span className="text-amber-500 font-bold mt-0.5">!</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="text-sm font-medium block mb-2">Admin Notes</label>
              <Textarea
                placeholder="Add your notes or observations..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-24"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => alert("Application approved!")}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve Credits
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => alert("Requesting more information...")}
              >
                Request Review
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
