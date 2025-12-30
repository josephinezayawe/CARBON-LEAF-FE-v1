"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface SectorSummary {
  sector: string
  totalCredits: number
  totalUsers: number
  totalAssets: number
  averageCreditsPerUser: number
  totalFeeDeducted: number
  netCredits: number
}

interface UserWallet {
  id: string
  userName: string
  nid: string
  totalCredits: number
  feeDeducted: number
  netCredits: number
  lastUpdated: string
  sector: string
}

const mockSectorSummary: SectorSummary[] = [
  {
    sector: "FARMER",
    totalCredits: 125000,
    totalUsers: 450,
    totalAssets: 520,
    averageCreditsPerUser: 277.78,
    totalFeeDeducted: 12500,
    netCredits: 112500,
  },
  {
    sector: "HYBRID_CAR_OWNER",
    totalCredits: 85000,
    totalUsers: 230,
    totalAssets: 230,
    averageCreditsPerUser: 369.57,
    totalFeeDeducted: 8500,
    netCredits: 76500,
  },
  {
    sector: "ECO_FRIENDLY_STOVES",
    totalCredits: 65000,
    totalUsers: 380,
    totalAssets: 415,
    averageCreditsPerUser: 171.05,
    totalFeeDeducted: 6500,
    netCredits: 58500,
  },
  {
    sector: "COMMERCIAL_BUILDING",
    totalCredits: 95000,
    totalUsers: 120,
    totalAssets: 145,
    averageCreditsPerUser: 791.67,
    totalFeeDeducted: 9500,
    netCredits: 85500,
  },
]

const mockUserWallets: UserWallet[] = [
  {
    id: "1",
    userName: "Jean Ndayisaba",
    nid: "1234567890",
    totalCredits: 4200,
    feeDeducted: 420,
    netCredits: 3780,
    lastUpdated: "2025-12-20",
    sector: "FARMER",
  },
  {
    id: "2",
    userName: "Marie Uwizeyimana",
    nid: "0987654321",
    totalCredits: 2150,
    feeDeducted: 215,
    netCredits: 1935,
    lastUpdated: "2025-12-19",
    sector: "ECO_FRIENDLY_STOVES",
  },
  {
    id: "3",
    userName: "Paul Habimana",
    nid: "1122334455",
    totalCredits: 5800,
    feeDeducted: 580,
    netCredits: 5220,
    lastUpdated: "2025-12-18",
    sector: "HYBRID_CAR_OWNER",
  },
  {
    id: "4",
    userName: "Sophie Karangwa",
    nid: "5544332211",
    totalCredits: 9500,
    feeDeducted: 950,
    netCredits: 8550,
    lastUpdated: "2025-12-17",
    sector: "COMMERCIAL_BUILDING",
  },
  {
    id: "5",
    userName: "Emmanuel Kanyarwanda",
    nid: "9876543210",
    totalCredits: 3200,
    feeDeducted: 320,
    netCredits: 2880,
    lastUpdated: "2025-12-16",
    sector: "FARMER",
  },
]

export default function WalletCreditsPage() {
  const [wallets, setWallets] = useState<UserWallet[]>(mockUserWallets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false)
  const [viewWalletModalOpen, setViewWalletModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState("")

  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ]

  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      wallet.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.nid.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = selectedSector === "all" || wallet.sector === selectedSector
    return matchesSearch && matchesSector
  })

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

  const handleViewWallet = (wallet: UserWallet) => {
    setSelectedWallet(wallet)
    setViewWalletModalOpen(true)
  }

  const handleAdjustment = (wallet: UserWallet) => {
    setSelectedWallet(wallet)
    setAdjustmentAmount(0)
    setAdjustmentReason("")
    setAdjustmentModalOpen(true)
  }

  const confirmAdjustment = () => {
    if (selectedWallet) {
      setWallets(
        wallets.map((w) =>
          w.id === selectedWallet.id
            ? {
                ...w,
                totalCredits: w.totalCredits + adjustmentAmount,
                netCredits:
                  w.netCredits +
                  (adjustmentAmount -
                    (Math.abs(adjustmentAmount) * 10) / 100),
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : w
        )
      )
      setAdjustmentModalOpen(false)
      setSelectedWallet(null)
      setAdjustmentAmount(0)
      setAdjustmentReason("")
    }
  }

  const totalCreditsAwarded = wallets.reduce((sum, w) => sum + w.totalCredits, 0)
  const totalFeeDeducted = wallets.reduce((sum, w) => sum + w.feeDeducted, 0)
  const totalNetCredits = wallets.reduce((sum, w) => sum + w.netCredits, 0)

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet & Credits</h1>
        <p className="text-muted-foreground">
          Manage system-wide credit distribution and user wallets
        </p>
      </div>

      {/* System Credits Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Credits Awarded
                </p>
                <p className="text-2xl font-bold">
                  {totalCreditsAwarded.toLocaleString()}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Fee Deducted
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalFeeDeducted.toLocaleString()}
                </p>
              </div>
              <ArrowDownLeft className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Net Credits
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalNetCredits.toLocaleString()}
                </p>
              </div>
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Sector Breakdown</CardTitle>
          <CardDescription>
            Credit distribution and statistics by sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>Sector Name</TableHead>
                  <TableHead className="text-right">Total Credits</TableHead>
                  <TableHead className="text-right">Total Users</TableHead>
                  <TableHead className="text-right">Total Assets</TableHead>
                  <TableHead className="text-right">Avg Credits/User</TableHead>
                  <TableHead className="text-right">Fee Deducted</TableHead>
                  <TableHead className="text-right">Net Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSectorSummary.map((sector) => (
                  <TableRow
                    key={sector.sector}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {getSectorLabel(sector.sector)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {sector.totalCredits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {sector.totalUsers}
                    </TableCell>
                    <TableCell className="text-right">
                      {sector.totalAssets}
                    </TableCell>
                    <TableCell className="text-right">
                      {sector.averageCreditsPerUser.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-orange-600 font-semibold">
                      {sector.totalFeeDeducted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 font-semibold">
                      {sector.netCredits.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Wallets List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Wallets</CardTitle>
              <CardDescription>
                {filteredWallets.length} wallets displayed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or NID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sector" />
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
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>User Name / NID</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Total Credits</TableHead>
                  <TableHead className="text-right">Fee Deducted</TableHead>
                  <TableHead className="text-right">Net Credits</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.map((wallet) => (
                  <TableRow
                    key={wallet.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="text-sm">
                      <div className="font-medium">{wallet.userName}</div>
                      <div className="text-muted-foreground text-xs">
                        {wallet.nid}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getSectorLabel(wallet.sector)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {wallet.totalCredits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-orange-600 font-semibold">
                      {wallet.feeDeducted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 font-semibold">
                      {wallet.netCredits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(wallet.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewWallet(wallet)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Wallet
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleAdjustment(wallet)}
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Manual Adjustment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Wallet Modal */}
      <Dialog open={viewWalletModalOpen} onOpenChange={setViewWalletModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User Name</p>
                  <p className="font-semibold">{selectedWallet.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NID</p>
                  <p className="font-semibold">{selectedWallet.nid}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="font-semibold">
                    {getSectorLabel(selectedWallet.sector)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Credits
                  </span>
                  <span className="font-bold text-lg">
                    {selectedWallet.totalCredits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Fee Deducted
                  </span>
                  <span className="font-semibold text-orange-600">
                    {selectedWallet.feeDeducted.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded">
                  <span className="text-sm font-medium">Net Credits</span>
                  <span className="font-bold text-emerald-600 text-lg">
                    {selectedWallet.netCredits.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last Updated:{" "}
                {new Date(selectedWallet.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewWalletModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Adjustment Modal */}
      <Dialog open={adjustmentModalOpen} onOpenChange={setAdjustmentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Adjustment</DialogTitle>
          </DialogHeader>
          {selectedWallet && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  User: <span className="font-semibold text-foreground">{selectedWallet.userName}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Adjustment Amount</label>
                <Input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) =>
                    setAdjustmentAmount(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter amount (positive or negative)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Input
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Enter reason for adjustment"
                />
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded text-sm">
                <p className="text-muted-foreground">Current Balance:</p>
                <p className="font-bold text-lg">
                  {selectedWallet.netCredits.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdjustmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmAdjustment} className="bg-blue-600 hover:bg-blue-700">
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
