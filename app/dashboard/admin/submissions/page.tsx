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
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Submission {
  id: string
  workspaceId: string
  userName: string
  nid: string
  contact?: string
  location?: string
  sector: string
  assetId: string
  status: "PENDING_ANALYSIS" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "INSUFFICIENT_DATA"
  submissionDate: string
  creditsAwarded: number | null
  reviewResponse: string | null
  uploadedImages?: string[]
  duplicateFlags?: {
    imageUrl: string
    previousWorkspaceId: string
    similarityScore: number
    confidenceLevel: string
  }[]
  grossCredits?: number
}

interface SystemFeeConfig {
  feePercentage: number
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    workspaceId: "WS-001",
    userName: "Jean Ndayisaba",
    nid: "1234567890",
    contact: "+256 700 123 456",
    location: "Kigali, Gasabo",
    sector: "FARMER",
    assetId: "ASSET-001",
    status: "PENDING_ANALYSIS",
    submissionDate: "2025-12-15",
    creditsAwarded: null,
    reviewResponse: null,
    uploadedImages: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
      "https://images.unsplash.com/photo-1500382017468-f049863256ac?w=400",
    ],
    duplicateFlags: [
      {
        imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
        previousWorkspaceId: "WS-042",
        similarityScore: 92.5,
        confidenceLevel: "HIGH",
      },
    ],
    grossCredits: 1000,
  },
  {
    id: "2",
    workspaceId: "WS-002",
    userName: "Marie Uwizeyimana",
    nid: "0987654321",
    contact: "+256 700 234 567",
    location: "Kigali, Kicukiro",
    sector: "ECO_FRIENDLY_STOVES",
    assetId: "ASSET-002",
    status: "UNDER_REVIEW",
    submissionDate: "2025-12-14",
    creditsAwarded: null,
    reviewResponse: null,
    uploadedImages: [
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400",
    ],
    duplicateFlags: [],
    grossCredits: 500,
  },
  {
    id: "3",
    workspaceId: "WS-003",
    userName: "Paul Habimana",
    nid: "1122334455",
    contact: "+256 700 345 678",
    location: "Huye, Nyarugenge",
    sector: "HYBRID_CAR_OWNER",
    assetId: "ASSET-003",
    status: "APPROVED",
    submissionDate: "2025-12-10",
    creditsAwarded: 500,
    reviewResponse: null,
    uploadedImages: [
      "https://images.unsplash.com/photo-1537205164475-cc3bcd00d7e0?w=400",
    ],
    duplicateFlags: [],
    grossCredits: 500,
  },
  {
    id: "4",
    workspaceId: "WS-004",
    userName: "Sophie Karangwa",
    nid: "5544332211",
    contact: "+256 700 456 789",
    location: "Kigali, Nyarugenge",
    sector: "COMMERCIAL_BUILDING",
    assetId: "ASSET-004",
    status: "REJECTED",
    submissionDate: "2025-12-08",
    creditsAwarded: 0,
    reviewResponse: "Insufficient documentation provided",
    uploadedImages: [],
    duplicateFlags: [],
  },
  {
    id: "5",
    workspaceId: "WS-005",
    userName: "Emmanuel Kanyarwanda",
    nid: "9876543210",
    contact: "+256 700 567 890",
    location: "Muhanga, Rwamagana",
    sector: "FARMER",
    assetId: "ASSET-005",
    status: "INSUFFICIENT_DATA",
    submissionDate: "2025-12-05",
    creditsAwarded: null,
    reviewResponse: "Please provide additional verification documents",
    uploadedImages: [],
    duplicateFlags: [],
  },
]

const systemFeeConfig: SystemFeeConfig = {
  feePercentage: 10.0,
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [insufficientModalOpen, setInsufficientModalOpen] = useState(false)

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [approvalCredits, setApprovalCredits] = useState<number>(0)
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [insufficientReason, setInsufficientReason] = useState<string>("")

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission)
    setDetailsModalOpen(true)
  }

  const handleApprove = (submission: Submission) => {
    setSelectedSubmission(submission)
    setApprovalCredits(0)
    setApproveModalOpen(true)
  }

  const confirmApprove = () => {
    if (selectedSubmission) {
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                status: "APPROVED" as const,
                creditsAwarded: approvalCredits,
              }
            : s
        )
      )
      setApproveModalOpen(false)
      setSelectedSubmission(null)
      setApprovalCredits(0)
    }
  }

  const handleReject = (submission: Submission) => {
    setSelectedSubmission(submission)
    setRejectionReason("")
    setRejectModalOpen(true)
  }

  const confirmReject = () => {
    if (selectedSubmission) {
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                status: "REJECTED" as const,
                creditsAwarded: 0,
                reviewResponse: rejectionReason,
              }
            : s
        )
      )
      setRejectModalOpen(false)
      setSelectedSubmission(null)
      setRejectionReason("")
    }
  }

  const handleMarkInsufficient = (submission: Submission) => {
    setSelectedSubmission(submission)
    setInsufficientReason("")
    setInsufficientModalOpen(true)
  }

  const confirmMarkInsufficient = () => {
    if (selectedSubmission) {
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                status: "INSUFFICIENT_DATA" as const,
                reviewResponse: insufficientReason,
              }
            : s
        )
      )
      setInsufficientModalOpen(false)
      setSelectedSubmission(null)
      setInsufficientReason("")
    }
  }

  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ]
  const statuses = [
    "all",
    "PENDING_ANALYSIS",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "INSUFFICIENT_DATA",
  ]

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.workspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.assetId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      selectedStatus === "all" || submission.status === selectedStatus
    const matchesSector =
      selectedSector === "all" || submission.sector === selectedSector

    return matchesSearch && matchesStatus && matchesSector
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_ANALYSIS":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "UNDER_REVIEW":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "APPROVED":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      case "INSUFFICIENT_DATA":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING_ANALYSIS":
        return "Pending Analysis"
      case "UNDER_REVIEW":
        return "Under Review"
      case "APPROVED":
        return "Approved"
      case "REJECTED":
        return "Rejected"
      case "INSUFFICIENT_DATA":
        return "Insufficient Data"
      default:
        return status
    }
  }

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

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Submissions & Reviews
        </h1>
        <p className="text-muted-foreground">
          Review and approve/reject user submissions
        </p>
      </div>

      {/* Submissions Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                {filteredSubmissions.length} submissions displayed
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
                  placeholder="Search by name, workspace ID, or asset ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>Workspace ID</TableHead>
                  <TableHead>User Name / NID</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Credits Awarded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium">{submission.workspaceId}</TableCell>
                    <TableCell className="text-sm">
                      {submission.userName}
                      <br />
                      <span className="text-muted-foreground">
                        {submission.nid}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getSectorLabel(submission.sector)}
                    </TableCell>
                    <TableCell className="text-sm">{submission.assetId}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(submission.submissionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {submission.creditsAwarded !== null
                        ? `${submission.creditsAwarded.toLocaleString()}`
                        : "-"}
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
                          <DropdownMenuItem onClick={() => handleViewDetails(submission)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {submission.status === "PENDING_ANALYSIS" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-emerald-600"
                                onClick={() => handleApprove(submission)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleReject(submission)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-gray-600"
                                onClick={() => handleMarkInsufficient(submission)}
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Mark Insufficient
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

      {/* Details Modal - Submission Review Detail (Page 6) */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Review Detail</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Submission Header */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Submission Header</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Workspace ID</p>
                    <p className="font-semibold text-sm">
                      {selectedSubmission.workspaceId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User Name</p>
                    <p className="font-semibold text-sm">
                      {selectedSubmission.userName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">NID</p>
                    <p className="font-semibold text-sm">{selectedSubmission.nid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="font-semibold text-sm">
                      {selectedSubmission.contact || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-sm">
                      {selectedSubmission.location || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <p className="font-semibold text-sm">
                      {getSectorLabel(selectedSubmission.sector)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Asset ID</p>
                    <p className="font-semibold text-sm">
                      {selectedSubmission.assetId}
                    </p>
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Status</p>
                     <Badge
                       className={`${getStatusColor(selectedSubmission.status)} text-xs`}
                     >
                       {getStatusLabel(selectedSubmission.status)}
                     </Badge>
                   </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Upload Date</p>
                    <p className="font-semibold text-sm">
                      {new Date(
                        selectedSubmission.submissionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images Gallery */}
              {selectedSubmission.uploadedImages &&
                selectedSubmission.uploadedImages.length > 0 && (
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-3">Images Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedSubmission.uploadedImages.map((image, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-lg overflow-hidden border"
                        >
                          <img
                            src={image}
                            alt={`Submission image ${idx + 1}`}
                            className="w-full h-40 object-cover hover:opacity-80 transition cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Duplication Check Results */}
              {selectedSubmission.duplicateFlags &&
                selectedSubmission.duplicateFlags.length > 0 && (
                  <div className="border-b pb-4 bg-amber-50 dark:bg-amber-950/20 p-3 rounded">
                    <h3 className="font-semibold mb-3 text-amber-900 dark:text-amber-200">
                      ⚠️ Duplicate Detection Results
                    </h3>
                    <div className="space-y-3">
                      {selectedSubmission.duplicateFlags.map((dup, idx) => (
                        <div key={idx} className="border rounded p-3 bg-white dark:bg-slate-800">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Similarity Score
                              </p>
                              <p className="font-semibold text-amber-600">
                                {dup.similarityScore}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Confidence Level
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {dup.confidenceLevel}
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">
                                Found in Previous Submission
                              </p>
                              <p className="font-semibold">
                                {dup.previousWorkspaceId}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* System Calculation Display */}
              {selectedSubmission.grossCredits && (
                <div className="border-b pb-4 bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                  <h3 className="font-semibold mb-3">System Calculation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Gross Credits Input
                      </span>
                      <span className="font-semibold">
                        {selectedSubmission.grossCredits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Fee Percentage (Current)
                      </span>
                      <span className="font-semibold">
                        {systemFeeConfig.feePercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm text-muted-foreground">Fee Amount</span>
                      <span className="font-semibold text-orange-600">
                        {(
                          (selectedSubmission.grossCredits *
                            systemFeeConfig.feePercentage) /
                          100
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Net Credits (Auto-calculated)
                      </span>
                      <span className="font-bold text-emerald-600 text-lg">
                        {(
                          selectedSubmission.grossCredits -
                          (selectedSubmission.grossCredits *
                            systemFeeConfig.feePercentage) /
                            100
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Notes */}
              {selectedSubmission.reviewResponse && (
                <div>
                  <p className="text-sm font-medium mb-2">Review Response</p>
                  <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded text-sm">
                    {selectedSubmission.reviewResponse}
                  </div>
                </div>
              )}
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

      {/* Approve Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Submission: <span className="font-semibold text-foreground">{selectedSubmission?.assetId}</span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Credits to Award</label>
              <Input
                type="number"
                min="0"
                value={approvalCredits}
                onChange={(e) => setApprovalCredits(parseInt(e.target.value) || 0)}
                placeholder="Enter credit amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Submission: <span className="font-semibold text-foreground">{selectedSubmission?.assetId}</span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insufficient Data Modal */}
      <Dialog open={insufficientModalOpen} onOpenChange={setInsufficientModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Insufficient Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Submission: <span className="font-semibold text-foreground">{selectedSubmission?.assetId}</span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Required Information</label>
              <Textarea
                value={insufficientReason}
                onChange={(e) => setInsufficientReason(e.target.value)}
                placeholder="Describe what additional information is needed"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInsufficientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMarkInsufficient}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Mark Insufficient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
