"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/global/language-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  TrendingUp,
  Download,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WalletOverview from "@/components/dashboard_components/admin/admin-wallet/WalletOverview";
import WalletTransactionsList from "@/components/dashboard_components/admin/admin-wallet/WalletTransactionsList";
import CreditDistribution from "@/components/dashboard_components/admin/admin-wallet/CreditDistribution";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "sale";
  description: string;
  amount: number;
  timestamp: string;
  status: "completed" | "pending";
}

interface User {
  id: string;
  name: string;
  email: string;
  sector: string;
  credits: number;
  status: "active" | "pending" | "suspended";
  verificationStatus: "verified" | "pending_verification";
}

interface CreditTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "sale" | "adjustment";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
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
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jean Ndayisaba",
    email: "jean@example.com",
    sector: "Farmer",
    credits: 4200,
    status: "active",
    verificationStatus: "verified",
  },
  {
    id: "2",
    name: "Marie Uwizeyimana",
    email: "marie@example.com",
    sector: "Eco Stoves",
    credits: 2150,
    status: "active",
    verificationStatus: "verified",
  },
  {
    id: "3",
    name: "Paul Habimana",
    email: "paul@example.com",
    sector: "Hybrid Car Owner",
    credits: 0,
    status: "pending",
    verificationStatus: "pending_verification",
  },
  {
    id: "4",
    name: "Sophie Karangwa",
    email: "sophie@example.com",
    sector: "Commercial Building",
    credits: 5800,
    status: "active",
    verificationStatus: "verified",
  },
  {
    id: "5",
    name: "Emmanuel Kanyarwanda",
    email: "emmanuel@example.com",
    sector: "Farmer",
    credits: 3200,
    status: "suspended",
    verificationStatus: "verified",
  },
];

const mockUserCreditHistory: Record<string, CreditTransaction[]> = {
  "1": [
    {
      id: "txh-001",
      type: "deposit",
      description: "Carbon credits from sustainable farming activities",
      amount: 1500,
      date: "2025-12-15",
      status: "completed",
    },
    {
      id: "txh-002",
      type: "deposit",
      description: "Agroforestry project completion bonus",
      amount: 800,
      date: "2025-12-10",
      status: "completed",
    },
    {
      id: "txh-003",
      type: "sale",
      description: "Credits sold to Global Energy Corp",
      amount: 500,
      date: "2025-12-05",
      status: "completed",
    },
    {
      id: "txh-004",
      type: "deposit",
      description: "Monthly verification bonus",
      amount: 400,
      date: "2025-12-01",
      status: "completed",
    },
    {
      id: "txh-005",
      type: "adjustment",
      description: "Admin adjustment - verification update",
      amount: 500,
      date: "2025-11-28",
      status: "completed",
    },
  ],
  "2": [
    {
      id: "txh-101",
      type: "deposit",
      description: "Eco stove installation completed",
      amount: 2000,
      date: "2025-12-12",
      status: "completed",
    },
    {
      id: "txh-102",
      type: "deposit",
      description: "Energy efficiency bonus",
      amount: 150,
      date: "2025-12-08",
      status: "completed",
    },
  ],
  "3": [
    {
      id: "txh-201",
      type: "deposit",
      description: "Hybrid vehicle registration",
      amount: 0,
      date: "2025-12-01",
      status: "pending",
    },
  ],
  "4": [
    {
      id: "txh-301",
      type: "deposit",
      description: "Commercial building energy audit",
      amount: 3200,
      date: "2025-12-14",
      status: "completed",
    },
    {
      id: "txh-302",
      type: "deposit",
      description: "Solar panel installation credits",
      amount: 2100,
      date: "2025-12-10",
      status: "completed",
    },
    {
      id: "txh-303",
      type: "withdrawal",
      description: "Payout processing",
      amount: 500,
      date: "2025-12-08",
      status: "completed",
    },
  ],
  "5": [
    {
      id: "txh-401",
      type: "deposit",
      description: "Initial credits allocation",
      amount: 3200,
      date: "2025-11-20",
      status: "completed",
    },
  ],
};

export default function AdminWalletPage() {
  const { t } = useLanguage();
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const totalCredits = 2500000;
  const totalValue = 525000000; // RWF
  const monthlySales = 45000;
  const monthlyRevenue = 9450000;

  const sectors = [
    "all",
    "Farmer",
    "Hybrid Car Owner",
    "Eco Stoves",
    "Commercial Building",
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector =
      selectedSector === "all" || user.sector === selectedSector;

    return matchesSearch && matchesSector;
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
      case "Farmer":
        return t("admin.farmer");
      case "Hybrid Car Owner":
        return t("admin.hybrid_vehicle");
      case "Eco Stoves":
        return t("admin.eco_stove");
      case "Commercial Building":
        return t("admin.commercial_building");
      default:
        return sector;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
      case "withdrawal":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      case "sale":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
      case "adjustment":
        return "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "sale":
        return "Sale";
      case "adjustment":
        return "Adjustment";
      default:
        return type;
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.admin_wallet")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.manage_credits_revenue")}
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.system_credits")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalCredits / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.total_in_system")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.total_value")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalValue / 1000000000).toFixed(1)}B
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.rwf_equivalent")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.monthly_sales")}
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(monthlySales / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.credits_sold_month")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.monthly_revenue")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.rwf_from_sales")}
            </p>
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

      {/* User Credits Overview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t("admin.user_credits_breakdown") || "User Credits Breakdown"}
              </CardTitle>
              <CardDescription>
                {filteredUsers.length}{" "}
                {t("admin.users_displayed") || "users displayed"}
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
                  placeholder={
                    t("admin.search_placeholder") ||
                    "Search by name or email..."
                  }
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
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>{t("admin.table_name")}</TableHead>
                  <TableHead>{t("admin.table_sector")}</TableHead>
                  <TableHead>{t("admin.table_credits")}</TableHead>
                  <TableHead>{t("admin.table_verification")}</TableHead>
                  <TableHead>{t("admin.table_status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm">
                      {getSectorLabel(user.sector)}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                      {user.credits.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getVerificationColor(
                          user.verificationStatus
                        )}
                      >
                        {user.verificationStatus === "verified"
                          ? t("admin.verified")
                          : t("admin.pending")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{t("admin.sector_breakdown")}</CardTitle>
          <CardDescription>
            {t("admin.credits_collected_sector")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>{t("admin.table_sector")}</TableHead>
                  <TableHead>{t("admin.table_credits_collected")}</TableHead>
                  <TableHead>{t("admin.table_percentage")}</TableHead>
                  <TableHead>{t("admin.table_current_value")}</TableHead>
                  <TableHead>{t("admin.table_status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { sector: "Farmer", credits: 825000, percentage: 33 },
                  { sector: "Eco Stoves", credits: 625000, percentage: 25 },
                  {
                    sector: "Hybrid Vehicles",
                    credits: 525000,
                    percentage: 21,
                  },
                  { sector: "Commercial", credits: 525000, percentage: 21 },
                ].map((item) => (
                  <TableRow
                    key={item.sector}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                  >
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
                        <span className="text-sm font-medium">
                          {item.percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {(item.credits * 210).toLocaleString()} RWF
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        {t("admin.active")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Credit History Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <DialogTitle>{selectedUser?.name} - Credit History</DialogTitle>
                <DialogDescription>
                  {selectedUser?.email} • {selectedUser?.sector}
                </DialogDescription>
              </div>
              <button
                onClick={() => setIsDetailDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Summary */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedUser.credits.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {getStatusLabel(selectedUser.status)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Verification</p>
                  <Badge
                    className={getVerificationColor(
                      selectedUser.verificationStatus
                    )}
                  >
                    {selectedUser.verificationStatus === "verified"
                      ? "Verified"
                      : "Pending"}
                  </Badge>
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Transaction History
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(mockUserCreditHistory[selectedUser.id] || []).length >
                      0 ? (
                        mockUserCreditHistory[selectedUser.id]
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .map((transaction) => (
                            <TableRow key={transaction.id} className="border-b">
                              <TableCell className="text-sm">
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getTransactionTypeColor(
                                    transaction.type
                                  )}
                                >
                                  {getTransactionTypeLabel(transaction.type)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {transaction.description}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {transaction.type === "withdrawal" ? "-" : "+"}
                                {transaction.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    transaction.status === "completed"
                                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                      : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                                  }
                                >
                                  {transaction.status === "completed"
                                    ? "Completed"
                                    : "Pending"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
