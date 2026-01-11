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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, Download, Eye } from "lucide-react"

interface Sale {
  id: string
  saleNumber: string
  buyerName: string
  creditsSold: number
  pricePerCredit: number
  totalAmount: number
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
  saleDate: string
  createdBy: string
  description?: string
}

const mockSales: Sale[] = [
  {
    id: "sale-001",
    saleNumber: "SALE-1735000001",
    buyerName: "Global Energy Corp",
    creditsSold: 5000,
    pricePerCredit: 210,
    totalAmount: 1050000,
    status: "COMPLETED",
    saleDate: "2025-12-24",
    createdBy: "Admin User",
    description: "Regular quarterly purchase",
  },
  {
    id: "sale-002",
    saleNumber: "SALE-1734900001",
    buyerName: "Eco Solutions Ltd",
    creditsSold: 3200,
    pricePerCredit: 208,
    totalAmount: 665600,
    status: "COMPLETED",
    saleDate: "2025-12-23",
    createdBy: "Admin User",
    description: "NGO bulk purchase",
  },
  {
    id: "sale-003",
    saleNumber: "SALE-1734800001",
    buyerName: "Carbon Offset Initiative",
    creditsSold: 8000,
    pricePerCredit: 215,
    totalAmount: 1720000,
    status: "PROCESSING",
    saleDate: "2025-12-22",
    createdBy: "Admin User",
    description: "Large procurement",
  },
  {
    id: "sale-004",
    saleNumber: "SALE-1734700001",
    buyerName: "Global Energy Corp",
    creditsSold: 2800,
    pricePerCredit: 210,
    totalAmount: 588000,
    status: "COMPLETED",
    saleDate: "2025-12-21",
    createdBy: "Admin User",
    description: "Additional top-up",
  },
]

export default function SalesHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const filteredSales = mockSales.filter((sale) => {
    const matchesSearch =
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const sortedSales = [...filteredSales].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
      case "date-asc":
        return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime()
      case "amount-desc":
        return b.totalAmount - a.totalAmount
      case "amount-asc":
        return a.totalAmount - b.totalAmount
      case "credits-desc":
        return b.creditsSold - a.creditsSold
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
      case "PROCESSING":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "CANCELLED":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
                  <TableHead className="text-right">Total Amount (RWF)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSales.map((sale) => (
                  <TableRow key={sale.id} className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-mono font-semibold text-sm">
                      {sale.saleNumber}
                    </TableCell>
                    <TableCell className="font-medium">{sale.buyerName}</TableCell>
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
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sale.createdBy}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSale(sale)
                              setDetailsModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            View Allocations
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            View Payments
                          </DropdownMenuItem>
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
                  <p className="text-sm text-muted-foreground">Sale Number</p>
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
                    {new Date(selectedSale.saleDate).toLocaleDateString("en-RW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-semibold">{selectedSale.createdBy}</p>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="space-y-2">
                <h4 className="font-semibold">Buyer Information</h4>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Buyer Name</span>
                    <span className="font-semibold">{selectedSale.buyerName}</span>
                  </div>
                  {selectedSale.description && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Description</span>
                      <span className="font-semibold">{selectedSale.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-2">
                <h4 className="font-semibold">Financial Summary</h4>
                <div className="grid grid-cols-3 gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Sold</p>
                    <p className="font-bold">
                      {selectedSale.creditsSold.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price/Credit</p>
                    <p className="font-bold">RWF{selectedSale.pricePerCredit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
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
    </div>
  )
}
