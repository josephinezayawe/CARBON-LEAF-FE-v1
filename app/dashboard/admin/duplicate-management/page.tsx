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
import { Search, MoreHorizontal, Eye, CheckCircle } from "lucide-react"

interface DuplicateFlag {
  id: string
  originalImageUrl: string
  duplicateImageUrl: string
  originalUser: string
  duplicateUser: string
  originalWorkspaceId: string
  duplicateWorkspaceId: string
  similarityScore: number
  dateDetected: string
  sector: string
  status: "PENDING_REVIEW" | "MARKED_FALSE_POSITIVE" | "CONFIRMED_DUPLICATE"
}

const mockDuplicates: DuplicateFlag[] = [
  {
    id: "1",
    originalImageUrl:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    duplicateImageUrl:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    originalUser: "Jean Ndayisaba",
    duplicateUser: "Paul Habimana",
    originalWorkspaceId: "WS-042",
    duplicateWorkspaceId: "WS-001",
    similarityScore: 92.5,
    dateDetected: "2025-12-20",
    sector: "FARMER",
    status: "PENDING_REVIEW",
  },
  {
    id: "2",
    originalImageUrl:
      "https://images.unsplash.com/photo-1500382017468-f049863256ac?w=400",
    duplicateImageUrl:
      "https://images.unsplash.com/photo-1500382017468-f049863256ac?w=400",
    originalUser: "Marie Uwizeyimana",
    duplicateUser: "Sophie Karangwa",
    originalWorkspaceId: "WS-023",
    duplicateWorkspaceId: "WS-004",
    similarityScore: 88.3,
    dateDetected: "2025-12-19",
    sector: "ECO_FRIENDLY_STOVES",
    status: "PENDING_REVIEW",
  },
  {
    id: "3",
    originalImageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400",
    duplicateImageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400",
    originalUser: "Emmanuel Kanyarwanda",
    duplicateUser: "Jean Ndayisaba",
    originalWorkspaceId: "WS-015",
    duplicateWorkspaceId: "WS-050",
    similarityScore: 95.1,
    dateDetected: "2025-12-18",
    sector: "FARMER",
    status: "CONFIRMED_DUPLICATE",
  },
  {
    id: "4",
    originalImageUrl:
      "https://images.unsplash.com/photo-1537205164475-cc3bcd00d7e0?w=400",
    duplicateImageUrl:
      "https://images.unsplash.com/photo-1537205164475-cc3bcd00d7e0?w=400",
    originalUser: "Paul Habimana",
    duplicateUser: "Marie Uwizeyimana",
    originalWorkspaceId: "WS-035",
    duplicateWorkspaceId: "WS-002",
    similarityScore: 85.7,
    dateDetected: "2025-12-17",
    sector: "HYBRID_CAR_OWNER",
    status: "MARKED_FALSE_POSITIVE",
  },
]

export default function DuplicateManagementPage() {
  const [duplicates, setDuplicates] = useState<DuplicateFlag[]>(mockDuplicates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("score")
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedDuplicate, setSelectedDuplicate] = useState<DuplicateFlag | null>(null)

  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ]
  const statuses = ["all", "PENDING_REVIEW", "CONFIRMED_DUPLICATE", "MARKED_FALSE_POSITIVE"]

  const filteredDuplicates = duplicates
    .filter((dup) => {
      const matchesSearch =
        dup.originalUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dup.duplicateUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dup.originalWorkspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dup.duplicateWorkspaceId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = selectedSector === "all" || dup.sector === selectedSector
      const matchesStatus = selectedStatus === "all" || dup.status === selectedStatus
      return matchesSearch && matchesSector && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "score") {
        return b.similarityScore - a.similarityScore
      } else if (sortBy === "date") {
        return new Date(b.dateDetected).getTime() - new Date(a.dateDetected).getTime()
      }
      return 0
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "CONFIRMED_DUPLICATE":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      case "MARKED_FALSE_POSITIVE":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "Pending Review"
      case "CONFIRMED_DUPLICATE":
        return "Confirmed Duplicate"
      case "MARKED_FALSE_POSITIVE":
        return "False Positive"
      default:
        return status
    }
  }

  const handleViewDetails = (duplicate: DuplicateFlag) => {
    setSelectedDuplicate(duplicate)
    setDetailsModalOpen(true)
  }

  const handleMarkFalsePositive = (duplicate: DuplicateFlag) => {
    setDuplicates(
      duplicates.map((d) =>
        d.id === duplicate.id ? { ...d, status: "MARKED_FALSE_POSITIVE" } : d
      )
    )
  }

  const handleConfirmDuplicate = (duplicate: DuplicateFlag) => {
    setDuplicates(
      duplicates.map((d) =>
        d.id === duplicate.id ? { ...d, status: "CONFIRMED_DUPLICATE" } : d
      )
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Duplicate Images Management
        </h1>
        <p className="text-muted-foreground">
          View and manage detected duplicate submissions across the system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Duplicates</p>
              <p className="text-2xl font-bold">{duplicates.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {duplicates.filter((d) => d.status === "PENDING_REVIEW").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-red-600">
                {duplicates.filter((d) => d.status === "CONFIRMED_DUPLICATE").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplicates Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detected Duplicates</CardTitle>
              <CardDescription>
                {filteredDuplicates.length} duplicates displayed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or workspace ID..."
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

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Similarity Score</SelectItem>
                  <SelectItem value="date">Date Detected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>Original User</TableHead>
                  <TableHead>Duplicate User</TableHead>
                  <TableHead>Workspace IDs</TableHead>
                  <TableHead className="text-right">Similarity</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Detected</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDuplicates.map((duplicate) => (
                  <TableRow
                    key={duplicate.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="text-sm">
                      <div className="font-medium">{duplicate.originalUser}</div>
                      <div className="text-xs text-muted-foreground">
                        {duplicate.originalWorkspaceId}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="font-medium">{duplicate.duplicateUser}</div>
                      <div className="text-xs text-muted-foreground">
                        {duplicate.duplicateWorkspaceId}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {duplicate.originalWorkspaceId} ↔{" "}
                      {duplicate.duplicateWorkspaceId}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          duplicate.similarityScore > 90
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : duplicate.similarityScore > 80
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {duplicate.similarityScore.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getSectorLabel(duplicate.sector)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(duplicate.status)}>
                        {getStatusLabel(duplicate.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(duplicate.dateDetected).toLocaleDateString()}
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
                            onClick={() => handleViewDetails(duplicate)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {duplicate.status === "PENDING_REVIEW" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleConfirmDuplicate(duplicate)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-emerald-600"
                                onClick={() => handleMarkFalsePositive(duplicate)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as False Positive
                              </DropdownMenuItem>
                            </>
                          )}
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

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Duplicate Image Comparison</DialogTitle>
          </DialogHeader>
          {selectedDuplicate && (
            <div className="space-y-6">
              {/* Side-by-side comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Original Submission</h3>
                  <img
                    src={selectedDuplicate.originalImageUrl}
                    alt="Original"
                    className="w-full rounded-lg border"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium">
                      {selectedDuplicate.originalUser}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDuplicate.originalWorkspaceId}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Duplicate Submission</h3>
                  <img
                    src={selectedDuplicate.duplicateImageUrl}
                    alt="Duplicate"
                    className="w-full rounded-lg border"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium">
                      {selectedDuplicate.duplicateUser}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDuplicate.duplicateWorkspaceId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded">
                <div>
                  <p className="text-sm text-muted-foreground">Similarity Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedDuplicate.similarityScore.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="text-lg font-semibold">
                    {getSectorLabel(selectedDuplicate.sector)}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                  <Badge className={getStatusColor(selectedDuplicate.status)}>
                    {getStatusLabel(selectedDuplicate.status)}
                  </Badge>
                </div>

                {selectedDuplicate.status === "PENDING_REVIEW" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleConfirmDuplicate(selectedDuplicate)}
                      className="bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      Confirm as Duplicate
                    </Button>
                    <Button
                      onClick={() => handleMarkFalsePositive(selectedDuplicate)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      Mark as False Positive
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
