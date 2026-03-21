"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MoreHorizontal, Download, Eye, Loader2 } from "lucide-react";
import { creditSalesApi } from "@/app/api/creditSales.api";
import { toast } from "sonner";
import { DataPagination } from "@/components/ui/data-pagination";

interface Sale {
  id: string;
  saleNumber: string;
  buyerName: string;
  creditsSold: number;
  pricePerCredit: number;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  soldAt: string | null;
  createdAt: string;
  createdBy: string;
  creator?: {
    id: string;
    name: string;
    contact: string;
  } | null;
  description?: string;
}

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Fetch sales from backend
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await creditSalesApi.getAllSales(page, limit);
      const data = response.data || response;
      if (Array.isArray(data)) {
        setSales(data);
        setTotal(response.total ?? 0);
        setTotalPages(response.totalPages ?? 1);
      }
    } catch (error) {
      toast.error("Failed to fetch sales history");
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || sale.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return (
          new Date(b.soldAt ?? b.createdAt).getTime() -
          new Date(a.soldAt ?? a.createdAt).getTime()
        );
      case "date-asc":
        return (
          new Date(a.soldAt ?? a.createdAt).getTime() -
          new Date(b.soldAt ?? b.createdAt).getTime()
        );
      case "amount-desc":
        return b.totalAmount - a.totalAmount;
      case "amount-asc":
        return a.totalAmount - b.totalAmount;
      case "credits-desc":
        return b.creditsSold - a.creditsSold;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
      case "PROCESSING":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
      case "CANCELLED":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>
                {sortedSales.length} sales recorded
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by sale number, buyer, or description..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Highest Amount</SelectItem>
                    <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                    <SelectItem value="credits-desc">Most Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>

              {/* Sales Table */}
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>Sale Number</TableHead>
                      <TableHead>Buyer Name</TableHead>
                      <TableHead className="text-right">Credits Sold</TableHead>
                      <TableHead className="text-right">Price/Credit</TableHead>
                      <TableHead className="text-right">
                        Total Amount (RWF)
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sale Date</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSales.map((sale) => (
                      <TableRow
                        key={sale.id}
                        className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-mono font-semibold text-sm">
                          {sale.saleNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {sale.buyerName}
                        </TableCell>
                        <TableCell className="text-right">
                          {sale.creditsSold.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          RWF{sale.pricePerCredit.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          RWF{sale.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(sale.status)}>
                            {sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sale.soldAt
                            ? new Date(sale.soldAt).toLocaleDateString()
                            : new Date(sale.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sale.creator?.contact || sale.createdBy}
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
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setDetailsModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                View Allocations
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Payments</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DataPagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={setPage}
              />
            </CardContent>
          </Card>

          {/* Details Modal */}
          <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Sale Details</DialogTitle>
                <DialogDescription>
                  {selectedSale?.saleNumber}
                </DialogDescription>
              </DialogHeader>

              {selectedSale && (
                <div className="space-y-6">
                  {/* Sale Header */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sale Number
                      </p>
                      <p className="font-mono font-semibold">
                        {selectedSale.saleNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedSale.status)}>
                        {selectedSale.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sale Date</p>
                      <p className="font-semibold">
                        {selectedSale.soldAt
                          ? new Date(selectedSale.soldAt).toLocaleDateString(
                              "en-RW",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : new Date(selectedSale.createdAt).toLocaleDateString(
                              "en-RW",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Created By
                      </p>
                      <p className="font-semibold">
                        {selectedSale.creator?.contact ||
                          selectedSale.createdBy}
                      </p>
                    </div>
                  </div>

                  {/* Buyer Information */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Buyer Information</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Buyer Name
                        </span>
                        <span className="font-semibold">
                          {selectedSale.buyerName}
                        </span>
                      </div>
                      {selectedSale.description && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Description
                          </span>
                          <span className="font-semibold">
                            {selectedSale.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Financial Summary</h4>
                    <div className="grid grid-cols-3 gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Credits Sold
                        </p>
                        <p className="font-bold">
                          {selectedSale.creditsSold.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Price/Credit
                        </p>
                        <p className="font-bold">
                          RWF{selectedSale.pricePerCredit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Amount
                        </p>
                        <p className="font-bold text-blue-600">
                          RWF{selectedSale.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
