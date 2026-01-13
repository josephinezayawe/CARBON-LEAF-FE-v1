"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/global/language-provider";
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
import { Search, MoreHorizontal, Eye, Edit2, Trash2, Ban } from "lucide-react";
import SystemUsersChart from "@/components/dashboard_components/admin/system-users/SystemUsersChart";
import SystemUsersFilters from "@/components/dashboard_components/admin/system-users/SystemUsersFilters";
import { CreditsAPI } from "@/app/api/credits";
import { UsersAPI } from "@/app/api/users";

interface SystemUser {
  cell: string;
  contact: string;
  district: string;
  firstName: string;
  id: string;
  lastName: string;
  nid: string;
  province: string;
  sector: string;
  village: string;
  wallet: null;
  userSectors: any[];
  createdAt: Date;
}

export default function SystemUsersPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [credits, setCredits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSystemCredits() {
      try {
        const result = await CreditsAPI.getSystemCredits();
        setCredits(result || []);
      } catch (err) {
        console.error("Error fetching credits:", err);
      }
    }
    fetchSystemCredits();
  }, []);

  useEffect(() => {
    async function fetchSystemUsers() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await UsersAPI.getAllUsers();
        setUsers(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Failed to load users");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSystemUsers();
  }, []);

  const mockUsers: SystemUser[] = users;
  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ];
  const statuses = ["all", "active", "pending", "suspended"];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSector =
      selectedSector === "all" || 
      (Array.isArray(user.userSectors) && 
        user.userSectors.some(s => s.sector === selectedSector));
    
    // Status filter - currently all statuses match since we don't have status field in API
    const matchesStatus = selectedStatus === "all";

    return matchesSearch && matchesSector && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
      case "suspended":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVerificationColor = (status: string) => {
    return status === "verified"
      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("admin.status_active");
      case "pending":
        return t("admin.status_pending");
      case "suspended":
        return t("admin.status_suspended");
      default:
        return status;
    }
  };

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case "FARMER":
        return t("admin.farmer");
      case "HYBRID_CAR_OWNER":
        return t("admin.hybrid_vehicle");
      case "ECO_FRIENDLY_STOVES":
        return t("admin.eco_stove");
      case "COMMERCIAL_BUILDING":
        return t("admin.commercial_building");
      case "all":
        return t("admin.all_sectors");
      default:
        return sector;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.system_users")}
        </h1>
        <p className="text-muted-foreground">{t("admin.manage_monitor")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.total_users_count")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">
              +12% {t("admin.this_month")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.active")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,380</div>
            <p className="text-xs text-muted-foreground">
              83% {t("admin.of_total")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,420</div>
            <p className="text-xs text-muted-foreground">
              {t("admin.verification_needed")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.suspended")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">650</div>
            <p className="text-xs text-muted-foreground">
              5% {t("admin.of_total")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SystemUsersChart />
        </div>
        <div className="lg:col-span-3">
          <SystemUsersFilters />
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("admin.user_directory")}</CardTitle>
              <CardDescription>
                {filteredUsers.length} {t("admin.users_displayed")}
              </CardDescription>
            </div>
            <Button>{t("admin.add_new_user")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.search_placeholder")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.select_sector")} />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector === "all"
                        ? t("admin.all_sectors")
                        : getSectorLabel(sector)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.select_status")} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all"
                        ? t("admin.all_statuses")
                        : getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error State */}
           {error && (
             <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
               {error}
             </div>
           )}

          {/* Loading State */}
           {isLoading && (
             <div className="py-12 text-center text-muted-foreground">
               {t("admin.loading") || "Loading users..."}
             </div>
           )}

          {/* Empty State */}
           {!isLoading && filteredUsers.length === 0 && (
             <div className="py-12 text-center text-muted-foreground">
               {t("admin.no_users_found") || "No users found"}
             </div>
           )}

          {/* Table */}
           {!isLoading && filteredUsers.length > 0 && (
             <div className="border rounded-lg overflow-hidden">
             <Table>
               <TableHeader>
                 <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                   <TableHead>{t("admin.table_name")}</TableHead>
                   <TableHead>{t("admin.table_sector")}</TableHead>
                   <TableHead>{t("admin.table_joined")}</TableHead>
                   <TableHead className="text-right">
                     {t("admin.table_actions")}
                   </TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(user.userSectors) && user.userSectors.length > 0 ? (
                          user.userSectors.map((sector, idx) => (
                            <Badge key={idx} variant="secondary">
                              {getSectorLabel(sector.sector || sector)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {t("admin.manage_sectors")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("admin.delete_user")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
              </div>
              )}
              </CardContent>
              </Card>
    </div>
  );
}
