"use client";

import React, { useState, useEffect } from "react";
import {
  getAllDuplicates,
  confirmDuplicateStatus,
  markAsFalsePositive,
} from "@/app/api/submissionsandReview.api";

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
  Loader2,
  Calendar,
  RefreshCw,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface DuplicateFlag {
  id: string;
  originalImageUrl: string;
  duplicateImageUrl: string;
  originalUser: string;
  duplicateUser: string;
  originalWorkspaceId: string;
  duplicateWorkspaceId: string;
  similarityScore: number;
  dateDetected: string;
  sector: string;
  status: "PENDING_REVIEW" | "MARKED_FALSE_POSITIVE" | "CONFIRMED_DUPLICATE";
  isInternal: boolean; // New field from backend
}

export default function DuplicateManagementPage() {
  const [duplicates, setDuplicates] = useState<DuplicateFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] =
    useState<DuplicateFlag | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllDuplicates();
      const data = response.data || response;
      if (Array.isArray(data)) {
        setDuplicates(data);
      }
    } catch (error) {
      toast.error("Failed to fetch duplicate records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (duplicate: DuplicateFlag) => {
    setSelectedDuplicate(duplicate);
    setDetailsModalOpen(true);
  };

  const handleMarkFalsePositive = async (duplicate: DuplicateFlag) => {
    try {
      await markAsFalsePositive(duplicate.id);
      toast.success("Flag cleared: Marked as false positive");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDuplicate = async (duplicate: DuplicateFlag) => {
    try {
      await confirmDuplicateStatus(duplicate.id);
      toast.success("Confirmed: Duplicate record flagged");
      fetchData();
    } catch (error) {
      toast.error("Failed to confirm duplicate");
    }
  };

  const getSectorLabel = (sector: string) => {
    return sector
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
      case "CONFIRMED_DUPLICATE":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      case "MARKED_FALSE_POSITIVE":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ];
  const statuses = [
    "all",
    "PENDING_REVIEW",
    "CONFIRMED_DUPLICATE",
    "MARKED_FALSE_POSITIVE",
  ];

  const filteredDuplicates = duplicates
    .filter((dup) => {
      const matchesSearch =
        dup.originalUser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dup.duplicateUser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dup.originalWorkspaceId
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        dup.duplicateWorkspaceId
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesSector =
        selectedSector === "all" || dup.sector === selectedSector;
      const matchesStatus =
        selectedStatus === "all" || dup.status === selectedStatus;
      return matchesSearch && matchesSector && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.similarityScore - a.similarityScore;
      if (sortBy === "date")
        return (
          new Date(b.dateDetected).getTime() -
          new Date(a.dateDetected).getTime()
        );
      return 0;
    });

  return (
    <div className="space-y-6 w-full text-foreground bg-background">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Duplicate Images Management
          </h1>
          <p className="text-muted-foreground">
            Audit and verify internal and cross-user flagged duplicates
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">
              Total Duplicate Groups
            </p>
            <p className="text-2xl font-bold">{duplicates.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card text-yellow-600">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">
              Awaiting Review
            </p>
            <p className="text-2xl font-bold">
              {duplicates.filter((d) => d.status === "PENDING_REVIEW").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card text-emerald-600">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">
              False Positives
            </p>
            <p className="text-2xl font-bold">
              {
                duplicates.filter((d) => d.status === "MARKED_FALSE_POSITIVE")
                  .length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardHeader>
          <CardTitle>Flagged Submissions</CardTitle>
          <CardDescription>
            Comparing original records vs incoming duplicate submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or workspace..."
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All Sectors" : getSectorLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All Status" : s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border">
                  <TableHead>Original Owner</TableHead>
                  <TableHead>Duplicate Submitter</TableHead>
                  <TableHead className="text-right">Match</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detected</TableHead>
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
                  filteredDuplicates.map((duplicate) => (
                    <TableRow
                      key={duplicate.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-sm font-medium">
                        <div
                          className={
                            duplicate.isInternal
                              ? "text-blue-600"
                              : "text-foreground"
                          }
                        >
                          {duplicate.originalUser}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {duplicate.originalWorkspaceId}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <div className="flex flex-col gap-1">
                          <span>{duplicate.duplicateUser}</span>
                          <Badge
                            variant={
                              duplicate.isInternal ? "outline" : "destructive"
                            }
                            className="w-fit text-[9px] px-1 py-0 h-4 flex items-center gap-1"
                          >
                            {duplicate.isInternal ? (
                              <>
                                <UserCheck className="h-2 w-2" /> Internal
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-2 w-2" /> Cross-User
                              </>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            duplicate.similarityScore > 95
                              ? "bg-red-50 text-red-700"
                              : "bg-orange-50"
                          }
                        >
                          {duplicate.similarityScore.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {getSectorLabel(duplicate.sector)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            duplicate.status
                          )} border-none text-[10px]`}
                        >
                          {duplicate.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            duplicate.dateDetected
                          ).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(duplicate)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-4xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Comparison Audit
              <Badge
                variant={
                  selectedDuplicate?.isInternal ? "outline" : "destructive"
                }
              >
                {selectedDuplicate?.isInternal
                  ? "Self-Duplicate"
                  : "Cross-User Match"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedDuplicate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    Original Record{" "}
                    {selectedDuplicate.isInternal && (
                      <UserCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </h3>
                  <div className="relative group">
                    <img
                      src={selectedDuplicate.originalImageUrl}
                      alt="Original"
                      className="w-full h-64 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <p>
                      <strong>Owner:</strong> {selectedDuplicate.originalUser}
                    </p>
                    <p>
                      <strong>Workspace:</strong>{" "}
                      {selectedDuplicate.originalWorkspaceId}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase text-red-500 tracking-widest flex items-center gap-2">
                    Duplicate Flagged{" "}
                    {!selectedDuplicate.isInternal && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </h3>
                  <div className="relative group">
                    <img
                      src={selectedDuplicate.duplicateImageUrl}
                      alt="Duplicate"
                      className={`w-full h-64 object-cover rounded-lg border shadow-sm ${
                        !selectedDuplicate.isInternal
                          ? "border-red-300"
                          : "border-blue-300"
                      }`}
                    />
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <p>
                      <strong>Submitter:</strong>{" "}
                      {selectedDuplicate.duplicateUser}
                    </p>
                    <p>
                      <strong>Workspace:</strong>{" "}
                      {selectedDuplicate.duplicateWorkspaceId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {selectedDuplicate.status === "PENDING_REVIEW" && (
                  <>
                    <Button
                      onClick={() => {
                        handleConfirmDuplicate(selectedDuplicate);
                        setDetailsModalOpen(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    >
                      Confirm as Duplicate
                    </Button>
                    <Button
                      onClick={() => {
                        handleMarkFalsePositive(selectedDuplicate);
                        setDetailsModalOpen(false);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                    >
                      Mark as False Positive
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setDetailsModalOpen(false)}
                  className={
                    selectedDuplicate.status !== "PENDING_REVIEW"
                      ? "w-full"
                      : ""
                  }
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
