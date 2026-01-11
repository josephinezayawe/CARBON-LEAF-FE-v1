"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Search, ChevronDown, RefreshCw, Eye } from "lucide-react"

interface UserCredit {
  userId: string
  firstName: string
  lastName: string
  contact: string
  totalAvailable: number
  workspaceCount: number
  percentageOfTotal: number
  workspaces: WorkspaceCredit[]
}

interface WorkspaceCredit {
  workspaceId: string
  sector: string
  totalAwarded: number
  previouslySold: number
  available: number
  percentageSold: number
  awardedDate: string
}

// Mock data
const mockUserCredits: UserCredit[] = [
  {
    userId: "user-001",
    firstName: "Jean",
    lastName: "Ndayisaba",
    contact: "+250788123456",
    totalAvailable: 8500,
    workspaceCount: 3,
    percentageOfTotal: 15.8,
    workspaces: [
      {
        workspaceId: "ws-001",
        sector: "FARMER",
        totalAwarded: 5000,
        previouslySold: 1500,
        available: 3500,
        percentageSold: 30,
        awardedDate: "2025-11-15",
      },
      {
        workspaceId: "ws-002",
        sector: "FARMER",
        totalAwarded: 3000,
        previouslySold: 0,
        available: 3000,
        percentageSold: 0,
        awardedDate: "2025-12-01",
      },
      {
        workspaceId: "ws-003",
        sector: "HYBRID_CAR_OWNER",
        totalAwarded: 2000,
        previouslySold: 0,
        available: 2000,
        percentageSold: 0,
        awardedDate: "2025-12-05",
      },
    ],
  },
  {
    userId: "user-002",
    firstName: "Marie",
    lastName: "Uwizeyimana",
    contact: "+250789654321",
    totalAvailable: 6200,
    workspaceCount: 2,
    percentageOfTotal: 11.5,
    workspaces: [
      {
        workspaceId: "ws-004",
        sector: "ECO_FRIENDLY_STOVES",
        totalAwarded: 4000,
        previouslySold: 800,
        available: 3200,
        percentageSold: 20,
        awardedDate: "2025-11-20",
      },
      {
        workspaceId: "ws-005",
        sector: "ECO_FRIENDLY_STOVES",
        totalAwarded: 3000,
        previouslySold: 0,
        available: 3000,
        percentageSold: 0,
        awardedDate: "2025-12-10",
      },
    ],
  },
  {
    userId: "user-003",
    firstName: "Paul",
    lastName: "Habimana",
    contact: "+250790111213",
    totalAvailable: 12400,
    workspaceCount: 2,
    percentageOfTotal: 23.1,
    workspaces: [
      {
        workspaceId: "ws-006",
        sector: "COMMERCIAL_BUILDING",
        totalAwarded: 8000,
        previouslySold: 2000,
        available: 6000,
        percentageSold: 25,
        awardedDate: "2025-10-15",
      },
      {
        workspaceId: "ws-007",
        sector: "COMMERCIAL_BUILDING",
        totalAwarded: 7000,
        previouslySold: 600,
        available: 6400,
        percentageSold: 8.57,
        awardedDate: "2025-11-01",
      },
    ],
  },
]

export default function AvailableCreditsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [sortBy, setSortBy] = useState("total")
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<UserCredit | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ]

  // Filter data
  const filteredUsers = mockUserCredits.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.contact.includes(searchQuery)

    const matchesSector =
      selectedSector === "all" ||
      user.workspaces.some((w) => w.sector === selectedSector)

    return matchesSearch && matchesSector
  })

  // Sort data
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "total":
        return b.totalAvailable - a.totalAvailable
      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        )
      default:
        return 0
    }
  })

  const totalCredits = mockUserCredits.reduce((sum, u) => sum + u.totalAvailable, 0)
  const totalUsers = mockUserCredits.length
  const totalWorkspaces = mockUserCredits.reduce((sum, u) => sum + u.workspaceCount, 0)
  const avgCreditsPerUser = totalCredits / totalUsers

  const toggleExpand = (userId: string) => {
    setExpandedRows((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const getSectorLabel = (sector: string) => {
    const labels: Record<string, string> = {
      FARMER: "Farmer",
      HYBRID_CAR_OWNER: "Hybrid Car Owner",
      ECO_FRIENDLY_STOVES: "Eco-Friendly Stoves",
      COMMERCIAL_BUILDING: "Commercial Building",
    }
    return labels[sector] || sector
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Available Credits
                </p>
                <p className="text-2xl font-bold">
                  {totalCredits.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Users with Credits
                </p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Workspaces
                </p>
                <p className="text-2xl font-bold">{totalWorkspaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Avg per User
                </p>
                <p className="text-2xl font-bold">
                  {avgCreditsPerUser.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Credits Breakdown</CardTitle>
              <CardDescription>
                {sortedUsers.length} users with available credits
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or contact..."
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Available (High to Low)</SelectItem>
              <SelectItem value="name">User Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          {/* Users Table with Expandable Rows */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Total Available</TableHead>
                  <TableHead className="text-center">Workspaces</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <React.Fragment key={user.userId}>
                    <TableRow className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <button
                          onClick={() => toggleExpand(user.userId)}
                          className="p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedRows.includes(user.userId)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.contact}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {user.totalAvailable.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{user.workspaceCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {user.percentageOfTotal.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setDetailsModalOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Workspace Details */}
                    {expandedRows.includes(user.userId) && (
                      <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b">
                        <TableCell colSpan={7} className="p-0">
                          <div className="p-4">
                            <p className="text-sm font-semibold mb-3">
                              Workspaces Contributing to {user.firstName}'s Credits
                            </p>
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-white dark:bg-slate-900">
                                    <TableHead className="text-xs">
                                      Workspace ID
                                    </TableHead>
                                    <TableHead className="text-xs">Sector</TableHead>
                                    <TableHead className="text-xs text-right">
                                      Total Awarded
                                    </TableHead>
                                    <TableHead className="text-xs text-right">
                                      Previously Sold
                                    </TableHead>
                                    <TableHead className="text-xs text-right">
                                      Available
                                    </TableHead>
                                    <TableHead className="text-xs text-right">
                                      % Sold
                                    </TableHead>
                                    <TableHead className="text-xs">
                                      Awarded Date
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {user.workspaces.map((ws) => (
                                    <TableRow
                                      key={ws.workspaceId}
                                      className="text-xs"
                                    >
                                      <TableCell className="font-mono text-xs">
                                        {ws.workspaceId}
                                      </TableCell>
                                      <TableCell>
                                        {getSectorLabel(ws.sector)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {ws.totalAwarded.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {ws.previouslySold.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right font-semibold">
                                        {ws.available.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {ws.percentageSold.toFixed(2)}%
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">
                                        {new Date(
                                          ws.awardedDate
                                        ).toLocaleDateString()}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Credit Details</DialogTitle>
            <DialogDescription>
              Complete breakdown of credits by workspace
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-semibold">{selectedUser.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Available
                  </p>
                  <p className="font-bold text-lg">
                    {selectedUser.totalAvailable.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Workspaces</p>
                  <p className="font-bold text-lg">
                    {selectedUser.workspaceCount}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>Workspace ID</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead className="text-right">Total Awarded</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">% Sold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedUser.workspaces.map((ws) => (
                      <TableRow key={ws.workspaceId}>
                        <TableCell className="font-mono text-sm">
                          {ws.workspaceId}
                        </TableCell>
                        <TableCell>{getSectorLabel(ws.sector)}</TableCell>
                        <TableCell className="text-right">
                          {ws.totalAwarded.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {ws.available.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {ws.percentageSold.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
