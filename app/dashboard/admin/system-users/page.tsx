"use client";

import React, { useState, useEffect } from "react";
import { getAllUsers, changeUserRole } from "@/app/api/systemUsers.api";
import { useLanguage } from "@/components/global/language-provider";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Search,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  User as UserIcon,
  MapPin,
  Phone,
  Wallet,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SystemUser, sectors } from "./systemUsers.types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataPagination } from "@/components/ui/data-pagination";

export default function SystemUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // States for Dialog
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // States for Change Role Dialog
  const [roleDialogUser, setRoleDialogUser] = useState<SystemUser | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [roleChangeReason, setRoleChangeReason] = useState("");
  const [isChangingRole, setIsChangingRole] = useState(false);

  const allRoles = [
    { key: "USER", label: "User" },
    { key: "ADMIN", label: "Admin" },
    { key: "FIELD_OFFICER", label: "Field Officer" },
    { key: "VERIFIER", label: "Verifier" },
    { key: "BUYER", label: "Buyer" },
  ] as const;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers(page, limit);
        if (response.success && Array.isArray(response.data)) {
          setUsers(response.data);
          setTotal(response.total ?? 0);
          setTotalPages(response.totalPages ?? 1);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handleViewDetails = (user: SystemUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleOpenRoleDialog = (user: SystemUser) => {
    setRoleDialogUser(user);
    setNewRole(user.role ?? "USER");
    setRoleChangeReason("");
    setIsRoleDialogOpen(true);
  };

  const handleChangeRole = async () => {
    if (!roleDialogUser || !newRole) return;
    if (newRole === roleDialogUser.role) {
      toast.info("Role is already set to this value");
      return;
    }
    setIsChangingRole(true);
    try {
      await changeUserRole(
        roleDialogUser.id,
        newRole,
        roleChangeReason || undefined,
      );
      toast.success(
        `Role changed to ${newRole} for ${roleDialogUser.firstName} ${roleDialogUser.lastName}`,
      );
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === roleDialogUser.id ? { ...u, role: newRole } : u,
        ),
      );
      setIsRoleDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to change role");
      console.error("Role change error:", error);
    } finally {
      setIsChangingRole(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      (user.nid && user.nid.includes(searchQuery)) ||
      (user.contact && user.contact.includes(searchQuery));

    const matchesSector =
      selectedSector === "all" ||
      (user.userSectors &&
        user.userSectors.some((s) => s.sector === selectedSector));

    return matchesSearch && matchesSector;
  });

  const statsBySector = sectors.map((s) => {
    const count = users.filter((u) =>
      u.userSectors?.some((us) => us.sector === s.key),
    ).length;
    return {
      name: s.label,
      active: count,
      inactive: 0,
      percentage:
        users.length > 0 ? ((count / users.length) * 100).toFixed(1) : "0",
    };
  });

  const getSectorLabel = (sectorKey: string) => {
    const found = sectors.find((s) => s.key === sectorKey);
    return found ? found.label : sectorKey;
  };

  return (
    <div className="space-y-6 w-full p-4 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Users</h1>
        <p className="text-muted-foreground">
          Manage and monitor user distribution
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-0 shadow-sm bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-lg">Users by Sector</CardTitle>
            <CardDescription className="text-muted-foreground">
              Distribution across all sectors
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsBySector}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.1}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ opacity: 0.1 }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="active"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="inactive"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-0 shadow-sm bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <CardDescription className="text-muted-foreground">
              Users by sector and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground mb-4 tracking-wider">
                By Sector
              </p>
              <div className="space-y-4">
                {statsBySector.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-foreground/80">{item.name}</span>
                    <div className="flex gap-4 items-center">
                      <span className="text-muted-foreground text-xs">
                        {item.percentage}%
                      </span>
                      <span className="bg-secondary px-2 py-1 rounded font-mono text-secondary-foreground min-w-[40px] text-center">
                        {item.active}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-4 tracking-wider">
                By Status
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/80">Active</span>
                  <span className="text-emerald-500 font-bold">
                    {users.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Pending</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              {filteredUsers.length} users displayed
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, NID, or contact..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>NID (Masked)</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead className="text-center">Assets</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ADMIN" ? "default" : "secondary"
                          }
                          className={
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : "text-xs"
                          }
                        >
                          {user.role ?? "USER"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {user.nid
                          ? `${user.nid.substring(0, 4)}...${user.nid.slice(
                              -4,
                            )}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">{user.contact}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.userSectors && user.userSectors.length > 1 ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              {user.userSectors.length} Sectors
                            </Badge>
                          ) : user.userSectors &&
                            user.userSectors.length === 1 ? (
                            <Badge variant="secondary" className="text-[10px]">
                              {getSectorLabel(user.userSectors[0].sector)}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              None
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {user.province}, {user.district}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600">
                        {Number(
                          user.wallet?.totalCredits || 0,
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {user._count?.assets || 0}
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
                              className="cursor-pointer"
                              onClick={() => handleViewDetails(user)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleOpenRoleDialog(user)}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" /> Change
                              Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit2 className="h-4 w-4 mr-2" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <DataPagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* View User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-emerald-600" />
              User Profile Details
            </DialogTitle>
            <DialogDescription>
              Detailed information for {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Contact Info
                  </p>
                  <p className="text-sm font-medium">{selectedUser.contact}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    NID Number
                  </p>
                  <p className="text-sm font-medium font-mono">
                    {selectedUser.nid}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Address
                </p>
                <p className="text-sm font-medium">
                  {selectedUser.province}, {selectedUser.district}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Registered Sectors
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.userSectors?.length ? (
                    selectedUser.userSectors.map((s) => (
                      <Badge
                        key={s.sector}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-100"
                      >
                        {getSectorLabel(s.sector)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No sectors assigned
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Wallet Balance
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {Number(
                      selectedUser.wallet?.totalCredits || 0,
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Total Assets
                  </p>
                  <p className="text-lg font-bold">
                    {selectedUser._count?.assets || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Change User Role
            </DialogTitle>
            <DialogDescription>
              Update role for{" "}
              <span className="font-semibold">
                {roleDialogUser?.firstName} {roleDialogUser?.lastName}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Current Role</Label>
              <Badge variant="outline" className="text-sm">
                {roleDialogUser?.role ?? "USER"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newRole">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="newRole">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => (
                    <SelectItem key={r.key} value={r.key}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleReason">Reason (optional)</Label>
              <Textarea
                id="roleReason"
                placeholder="Why is this role being changed?"
                value={roleChangeReason}
                onChange={(e) => setRoleChangeReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={isChangingRole}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeRole}
              disabled={isChangingRole || newRole === roleDialogUser?.role}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isChangingRole ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm Change
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
