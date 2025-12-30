"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const { t } = useLanguage()
  const [activeReport, setActiveReport] = useState("user-activity")
  const [startDate, setStartDate] = useState("2025-11-01")
  const [endDate, setEndDate] = useState("2025-12-31")
  const [selectedSector, setSelectedSector] = useState("all")

  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ]

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case "FARMER":
        return "Farmer"
      case "HYBRID_CAR_OWNER":
        return "Hybrid Car Owner"
      case "ECO_FRIENDLY_STOVES":
        return "Eco-Friendly Stoves"
      case "COMMERCIAL_BUILDING":
        return "Commercial Building"
      default:
        return sector
    }
  }

  const handleExport = (format: string) => {
    console.log(`Exporting ${activeReport} as ${format}`)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          View comprehensive reports and analytics
        </p>
      </div>

      {/* Report Customization */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Report Customization</CardTitle>
          <CardDescription>
            Customize your report parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range & Sector Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector Filter</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector === "all" ? "All Sectors" : getSectorLabel(sector)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                Generate Report
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="border-t pt-4 space-y-2">
            <p className="font-semibold text-sm">Export Options</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("CSV")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download as CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("PDF")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("Print")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <TabsList className="grid w-full max-w-4xl grid-cols-5">
          <TabsTrigger value="user-activity">User Activity</TabsTrigger>
          <TabsTrigger value="credit-distribution">Credit Distribution</TabsTrigger>
          <TabsTrigger value="submission-status">Submission Status</TabsTrigger>
          <TabsTrigger value="sector-performance">Sector Performance</TabsTrigger>
          <TabsTrigger value="duplicate-images">Duplicate Images</TabsTrigger>
        </TabsList>

        {/* User Activity Report */}
        <TabsContent value="user-activity">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>User Activity Report</CardTitle>
              <CardDescription>
                User statistics and activity metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    12,450
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
                  <p className="text-sm text-muted-foreground mb-1">New Users</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    342
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    10,380
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Verification Rate</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    83%
                  </p>
                </div>
              </div>

              {/* Sector Distribution Table */}
              <div className="space-y-3">
                <h3 className="font-semibold">Sector Distribution</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                        <TableHead>Sector</TableHead>
                        <TableHead>Total Users</TableHead>
                        <TableHead>New Users (Period)</TableHead>
                        <TableHead>Active Users</TableHead>
                        <TableHead>Growth %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { sector: "Farmer", total: 5200, new: 150, active: 4500, growth: 12 },
                        {
                          sector: "Hybrid Car Owner",
                          total: 3100,
                          new: 80,
                          active: 2600,
                          growth: 8,
                        },
                        {
                          sector: "Eco-Friendly Stoves",
                          total: 2400,
                          new: 65,
                          active: 2000,
                          growth: 7,
                        },
                        {
                          sector: "Commercial Building",
                          total: 1750,
                          new: 47,
                          active: 1280,
                          growth: 5,
                        },
                      ].map((item) => (
                        <TableRow key={item.sector} className="border-b">
                          <TableCell className="font-medium">
                            {item.sector}
                          </TableCell>
                          <TableCell>{item.total.toLocaleString()}</TableCell>
                          <TableCell>{item.new.toLocaleString()}</TableCell>
                          <TableCell>{item.active.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                              +{item.growth}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Distribution Report */}
        <TabsContent value="credit-distribution">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Credit Distribution Report</CardTitle>
              <CardDescription>
                Credit allocation and distribution metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Credits Distributed</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    2.5M
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Average per User</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    200.8
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Fee Deducted</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    250K
                  </p>
                </div>
              </div>

              {/* Sector Breakdown Table */}
              <div className="space-y-3">
                <h3 className="font-semibold">Distribution by Sector</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                        <TableHead>Sector</TableHead>
                        <TableHead>Total Credits</TableHead>
                        <TableHead>Avg per User</TableHead>
                        <TableHead>% of Total</TableHead>
                        <TableHead>Fee Deducted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          sector: "Farmer",
                          total: 825000,
                          avg: 158.65,
                          percent: 33,
                          fee: 82500,
                        },
                        {
                          sector: "Eco-Friendly Stoves",
                          total: 625000,
                          avg: 260.42,
                          percent: 25,
                          fee: 62500,
                        },
                        {
                          sector: "Hybrid Vehicles",
                          total: 525000,
                          avg: 169.35,
                          percent: 21,
                          fee: 52500,
                        },
                        {
                          sector: "Commercial",
                          total: 525000,
                          avg: 300,
                          percent: 21,
                          fee: 52500,
                        },
                      ].map((item) => (
                        <TableRow key={item.sector} className="border-b">
                          <TableCell className="font-medium">
                            {item.sector}
                          </TableCell>
                          <TableCell>
                            {(item.total / 1000).toFixed(0)}K
                          </TableCell>
                          <TableCell>{item.avg.toFixed(2)}</TableCell>
                          <TableCell>{item.percent}%</TableCell>
                          <TableCell>
                            {(item.fee / 1000).toFixed(0)}K
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submission Status Report */}
        <TabsContent value="submission-status">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Submission Status Report</CardTitle>
              <CardDescription>
                Submission statistics and approval metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    4,250
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    3,187
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    637
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Approval Rate</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    75%
                  </p>
                </div>
              </div>

              {/* Status Breakdown Table */}
              <div className="space-y-3">
                <h3 className="font-semibold">Status Summary</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                        <TableHead>Status</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>% of Total</TableHead>
                        <TableHead>Avg Credits per Submission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { status: "Approved", count: 3187, percent: 75, avgCredits: 285 },
                        { status: "Pending", count: 450, percent: 11, avgCredits: 0 },
                        { status: "Rejected", count: 637, percent: 15, avgCredits: 0 },
                      ].map((item) => (
                        <TableRow key={item.status} className="border-b">
                          <TableCell className="font-medium">
                            {item.status}
                          </TableCell>
                          <TableCell>{item.count.toLocaleString()}</TableCell>
                          <TableCell>{item.percent}%</TableCell>
                          <TableCell>{item.avgCredits.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sector Performance Report */}
        <TabsContent value="sector-performance">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Sector Performance Report</CardTitle>
              <CardDescription>
                Performance metrics by sector
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>Sector</TableHead>
                      <TableHead>Total Submissions</TableHead>
                      <TableHead>Approval Rate</TableHead>
                      <TableHead>Avg Credits</TableHead>
                      <TableHead>User Count</TableHead>
                      <TableHead>Asset Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        sector: "Farmer",
                        submissions: 1500,
                        approval: 78,
                        avgCredits: 220,
                        users: 5200,
                        assets: 5200,
                      },
                      {
                        sector: "Eco-Friendly Stoves",
                        submissions: 1200,
                        approval: 82,
                        avgCredits: 260,
                        users: 2400,
                        assets: 2400,
                      },
                      {
                        sector: "Hybrid Vehicles",
                        submissions: 900,
                        approval: 72,
                        avgCredits: 185,
                        users: 3100,
                        assets: 3100,
                      },
                      {
                        sector: "Commercial",
                        submissions: 650,
                        approval: 68,
                        avgCredits: 320,
                        users: 1750,
                        assets: 1750,
                      },
                    ].map((item) => (
                      <TableRow key={item.sector} className="border-b">
                        <TableCell className="font-medium">
                          {item.sector}
                        </TableCell>
                        <TableCell>{item.submissions.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                            {item.approval}%
                          </Badge>
                        </TableCell>
                        <TableCell>{item.avgCredits.toLocaleString()}</TableCell>
                        <TableCell>{item.users.toLocaleString()}</TableCell>
                        <TableCell>{item.assets.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Duplicate Images Report */}
        <TabsContent value="duplicate-images">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Duplicate Images Report</CardTitle>
              <CardDescription>
                Detected duplicate submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
                <p className="text-sm text-muted-foreground mb-1">Total Duplicates Detected</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  127
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>Original User</TableHead>
                      <TableHead>Duplicate User</TableHead>
                      <TableHead>Similarity %</TableHead>
                      <TableHead>Date Detected</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        original: "Jean Ndayisaba",
                        duplicate: "Paul Habimana",
                        similarity: 95,
                        date: "2025-12-10",
                        status: "Flagged",
                      },
                      {
                        original: "Marie Uwizeyimana",
                        duplicate: "Sophie Karangwa",
                        similarity: 87,
                        date: "2025-12-08",
                        status: "Investigating",
                      },
                      {
                        original: "Emmanuel Kanyarwanda",
                        duplicate: "Jean Ndayisaba",
                        similarity: 78,
                        date: "2025-12-05",
                        status: "Resolved",
                      },
                    ].map((item, idx) => (
                      <TableRow key={idx} className="border-b">
                        <TableCell className="font-medium">
                          {item.original}
                        </TableCell>
                        <TableCell>{item.duplicate}</TableCell>
                        <TableCell>
                          <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">
                            {item.similarity}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(item.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "Resolved"
                                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                : item.status === "Flagged"
                                  ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                                  : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
