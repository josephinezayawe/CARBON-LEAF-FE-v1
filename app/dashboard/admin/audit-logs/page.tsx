"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getAuditLogs,
  type AuditLogEntry,
  type AuditLogFilters,
} from "@/app/api/auditLog.api";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  Shield,
  Search,
  Filter,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ACTION_OPTIONS = [
  { key: "all", label: "All Actions" },
  { key: "CHANGE_USER_ROLE", label: "Change User Role" },
  { key: "APPROVE_WORKSPACE", label: "Approve Workspace" },
  { key: "REJECT_WORKSPACE", label: "Reject Workspace" },
  { key: "MARK_INSUFFICIENT_DATA", label: "Mark Insufficient" },
  { key: "CREATE_CREDIT_SALE", label: "Credit Sale" },
  { key: "UPDATE_FEE_PERCENTAGE", label: "Update Fee" },
  { key: "CREATE_SYSTEM_FEE_SALE", label: "System Fee Sale" },
];

const TARGET_TYPE_OPTIONS = [
  { key: "all", label: "All Types" },
  { key: "User", label: "User" },
  { key: "Workspace", label: "Workspace" },
  { key: "CreditSale", label: "Credit Sale" },
  { key: "SystemSettings", label: "System Settings" },
  { key: "SystemFeeSale", label: "System Fee Sale" },
];

function ActionBadge({ action }: { action: string }) {
  const colorMap: Record<string, string> = {
    APPROVE_WORKSPACE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECT_WORKSPACE: "bg-red-100 text-red-700 border-red-200",
    MARK_INSUFFICIENT_DATA: "bg-amber-100 text-amber-700 border-amber-200",
    CHANGE_USER_ROLE: "bg-purple-100 text-purple-700 border-purple-200",
    CREATE_CREDIT_SALE: "bg-blue-100 text-blue-700 border-blue-200",
    UPDATE_FEE_PERCENTAGE: "bg-orange-100 text-orange-700 border-orange-200",
    CREATE_SYSTEM_FEE_SALE: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  return (
    <Badge
      variant="outline"
      className={colorMap[action] ?? "bg-gray-100 text-gray-700"}
    >
      {action.replace(/_/g, " ")}
    </Badge>
  );
}

function JsonDiff({ label, data }: { label: string; data: any }) {
  if (!data) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase">
        {label}
      </p>
      <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto max-h-40 whitespace-pre-wrap break-all">
        {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filters
  const [actionFilter, setActionFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const filters: AuditLogFilters = { page, limit: 20 };
        if (actionFilter !== "all") filters.action = actionFilter;
        if (targetTypeFilter !== "all") filters.targetType = targetTypeFilter;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const result = await getAuditLogs(filters);
        setLogs(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        toast.error("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    },
    [actionFilter, targetTypeFilter, startDate, endDate],
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLogs(newPage);
  };

  return (
    <div className="space-y-6 w-full p-4 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-emerald-600" />
          Audit Logs
        </h1>
        <p className="text-muted-foreground">
          Track all administrative actions performed on the platform
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Target Type</Label>
              <Select
                value={targetTypeFilter}
                onValueChange={setTargetTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>{pagination.total} total entries</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
                <Search className="h-10 w-10 mb-3 opacity-30" />
                <p>No audit logs found</p>
                <p className="text-xs mt-1">Try adjusting the filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target Type</TableHead>
                    <TableHead>Target ID</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <Collapsible
                      key={log.id}
                      open={expandedRow === log.id}
                      onOpenChange={() => toggleRow(log.id)}
                      asChild
                    >
                      <>
                        <CollapsibleTrigger asChild>
                          <TableRow className="hover:bg-muted/30 transition-colors cursor-pointer">
                            <TableCell>
                              {expandedRow === log.id ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">
                              {new Date(log.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {log.actor?.firstName} {log.actor?.lastName}
                            </TableCell>
                            <TableCell>
                              <ActionBadge action={log.action} />
                            </TableCell>
                            <TableCell className="text-sm">
                              {log.targetType}
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground max-w-[120px] truncate">
                              {log.targetId}
                            </TableCell>
                            <TableCell className="text-xs max-w-[180px] truncate">
                              {log.reason ?? "—"}
                            </TableCell>
                          </TableRow>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                          <TableRow className="bg-muted/20">
                            <TableCell colSpan={7}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                <JsonDiff label="Before" data={log.before} />
                                <JsonDiff label="After" data={log.after} />
                                {log.ipAddress && (
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-muted-foreground">
                                      IP Address:{" "}
                                      <span className="font-mono">
                                        {log.ipAddress}
                                      </span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.totalPages)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
