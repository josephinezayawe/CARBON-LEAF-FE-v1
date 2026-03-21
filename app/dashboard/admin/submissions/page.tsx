"use client";

import React, { useState, useEffect } from "react";

import {
  getAllSubmissions,
  approveWorkspace,
  rejectWorkspace,
  markInsufficientData,
} from "@/app/api/submissionsandReview.api";
import { settingsApi } from "@/app/api/systemFee.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Submission } from "./submissions.types";
import { DataPagination } from "@/components/ui/data-pagination";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [insufficientModalOpen, setInsufficientModalOpen] = useState(false);

  // Form states
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [approvalCredits, setApprovalCredits] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [insufficientReason, setInsufficientReason] = useState<string>("");

  // New state for real system fee
  const [liveFee, setLiveFee] = useState<number>(10.0);

  // --- API CALLS ---

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubmissions(page, limit);
      const data = response.data || response;
      if (Array.isArray(data)) {
        setSubmissions(data);
      }
      if (response.total !== undefined) {
        setTotal(response.total);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      toast.error("Failed to sync with database");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch real fee from backend
  const fetchLiveFee = async () => {
    try {
      const response = await settingsApi.getFee();
      if (response.success) {
        setLiveFee(response.data.feePercentage);
      }
    } catch (error) {
      console.error("Error fetching fee settings:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchLiveFee(); // Integrate fee fetch on mount
  }, [page]);

  const confirmApprove = async () => {
    if (!selectedSubmission) return;
    try {
      await approveWorkspace(selectedSubmission.workspaceId, approvalCredits);
      toast.success("Submission approved and credits awarded");
      setApproveModalOpen(false);
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const confirmReject = async () => {
    if (!selectedSubmission) return;
    try {
      await rejectWorkspace(selectedSubmission.workspaceId, rejectionReason);
      toast.success("Submission rejected");
      setRejectModalOpen(false);
      fetchSubmissions();
    } catch (error: any) {
      toast.error("Rejection failed");
    }
  };

  const confirmMarkInsufficient = async () => {
    if (!selectedSubmission) return;
    try {
      await markInsufficientData(
        selectedSubmission.workspaceId,
        insufficientReason,
      );
      toast.success("Marked as insufficient data");
      setInsufficientModalOpen(false);
      fetchSubmissions();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  // --- UI HANDLERS ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_ANALYSIS":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
      case "APPROVED":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      case "INSUFFICIENT_DATA":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
      default:
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      s.userName?.toLowerCase().includes(search) ||
      s.workspaceId?.toLowerCase().includes(search);
    const matchesStatus =
      selectedStatus === "all" || s.status === selectedStatus;
    const matchesSector =
      selectedSector === "all" || s.sector === selectedSector;
    return matchesSearch && matchesStatus && matchesSector;
  });

  return (
    <div className="space-y-6 w-full text-foreground bg-background">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Submissions & Reviews
        </h1>
        <p className="text-muted-foreground">Manage user submissions</p>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            {filteredSubmissions.length} live records found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or workspace ID..."
                className="pl-8 bg-background border-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_ANALYSIS">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="HYBRID_CAR_OWNER">Hybrid Car</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border">
                  <TableHead>Workspace ID</TableHead>
                  <TableHead>User / NID</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((s) => (
                    <TableRow
                      key={s.id}
                      className="border-b border-border hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">
                        {s.workspaceId}
                      </TableCell>
                      <TableCell>
                        {s.userName}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {s.nid}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{s.sector}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            s.status,
                          )} border-none shadow-none`}
                        >
                          {s.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(s.submissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-bold">
                        {s.creditsAwarded?.toLocaleString() || "-"}
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
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSubmission(s);
                                setDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>

                            {s.status === "PENDING_ANALYSIS" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-emerald-600"
                                  onClick={() => {
                                    setSelectedSubmission(s);
                                    setApproveModalOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />{" "}
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedSubmission(s);
                                    setRejectModalOpen(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" /> Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-muted-foreground"
                                  onClick={() => {
                                    setSelectedSubmission(s);
                                    setInsufficientModalOpen(true);
                                  }}
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" /> Mark
                                  Insufficient
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <DataPagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- ALL MODALS --- */}

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Submission Review Detail</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-border pb-6 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1 text-xs uppercase font-bold">
                    Workspace ID
                  </p>
                  <p className="font-semibold">
                    {selectedSubmission.workspaceId}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs uppercase font-bold">
                    User
                  </p>
                  <p className="font-semibold">{selectedSubmission.userName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs uppercase font-bold">
                    Status
                  </p>
                  <Badge className={getStatusColor(selectedSubmission.status)}>
                    {selectedSubmission.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Images Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedSubmission.uploadedImages?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="rounded-lg object-cover h-32 w-full border border-border"
                      alt="evidence"
                    />
                  ))}
                </div>
              </div>

              {selectedSubmission.reviewResponse && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-2">
                    Reviewer Response
                  </p>
                  <p className="text-sm italic">
                    "{selectedSubmission.reviewResponse}"
                  </p>
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

      {/* Approve Modal - Updated with liveFee calculation */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Approve & Award Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Gross Credits to Award
              </label>
              <Input
                type="number"
                value={approvalCredits}
                onChange={(e) => setApprovalCredits(Number(e.target.value))}
              />
            </div>
            {approvalCredits > 0 && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded text-sm text-emerald-600">
                System will deduct {liveFee}% fee.
                <br />
                <strong>
                  Net to user:{" "}
                  {(approvalCredits * (1 - liveFee / 100)).toLocaleString()}{" "}
                  Credits
                </strong>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-sm font-medium">Rejection Reason</label>
            <Textarea
              placeholder="Explain why this was rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insufficient Modal */}
      <Dialog
        open={insufficientModalOpen}
        onOpenChange={setInsufficientModalOpen}
      >
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Mark as Insufficient</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-sm font-medium">Information Required</label>
            <Textarea
              placeholder="What else should the user provide?"
              value={insufficientReason}
              onChange={(e) => setInsufficientReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setInsufficientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMarkInsufficient}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Mark Insufficient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
