"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Download, Eye, EyeOff, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import WalletOverview from "@/components/dashboard_components/admin/admin-wallet/WalletOverview"
import WalletTransactionsList from "@/components/dashboard_components/admin/admin-wallet/WalletTransactionsList"
import CreditDistribution from "@/components/dashboard_components/admin/admin-wallet/CreditDistribution"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "sale"
  description: string
  amount: number
  timestamp: string
  status: "completed" | "pending"
}

const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    type: "deposit",
    description: "Credits from Farmer - Jean Ndayisaba",
    amount: 1200,
    timestamp: "2025-12-06 10:30 AM",
    status: "completed",
  },
  {
    id: "tx-002",
    type: "sale",
    description: "Credits sold to Global Energy Corp",
    amount: 15000,
    timestamp: "2025-12-05 3:45 PM",
    status: "completed",
  },
  {
    id: "tx-003",
    type: "withdrawal",
    description: "Payout to partner organization",
    amount: 5000,
    timestamp: "2025-12-04 11:20 AM",
    status: "completed",
  },
]

export default function AdminWalletPage() {
  const { t } = useLanguage()
  const [showBalance, setShowBalance] = useState(true)

  const totalCredits = 2500000
  const totalValue = 525000000 // RWF
  const monthlySales = 45000
  const monthlyRevenue = 9450000

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Wallet</h1>
        <p className="text-muted-foreground">
          Manage system credits and revenue
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Credits</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalCredits / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Total in system</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalValue / 1000000000).toFixed(1)}B</div>
            <p className="text-xs text-muted-foreground">RWF equivalent</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(monthlySales / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Credits sold this month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(monthlyRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">RWF from sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Overview & Distribution */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <WalletOverview />
        </div>
        <div className="lg:col-span-3">
          <CreditDistribution />
        </div>
      </div>

      {/* Transactions */}
      <div className="grid gap-6">
        <WalletTransactionsList transactions={mockTransactions} />
      </div>

      {/* Detailed Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Sector Breakdown</CardTitle>
          <CardDescription>Credits collected by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>Sector</TableHead>
                  <TableHead>Credits Collected</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Current Value (RWF)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { sector: "Farmer", credits: 825000, percentage: 33 },
                  { sector: "Eco Stoves", credits: 625000, percentage: 25 },
                  { sector: "Hybrid Vehicles", credits: 525000, percentage: 21 },
                  { sector: "Commercial", credits: 525000, percentage: 21 },
                ].map((item) => (
                  <TableRow key={item.sector} className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium">{item.sector}</TableCell>
                    <TableCell>{item.credits.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {(item.credits * 210).toLocaleString()} RWF
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
