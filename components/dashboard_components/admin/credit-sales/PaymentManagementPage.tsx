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
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, Eye, Send, CheckCircle2 } from "lucide-react"

interface Payment {
  id: string
  paymentId: string
  userName: string
  userContact: string
  saleId: string
  saleNumber: string
  amount: number
  netAmount: number
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED"
  paymentMethod?: string
  transactionId?: string
  createdDate: string
  paidDate?: string
}

const mockPayments: Payment[] = [
  {
    id: "pay-001",
    paymentId: "PAY-001",
    userName: "Jean Ndayisaba",
    userContact: "+250788123456",
    saleId: "sale-001",
    saleNumber: "SALE-1735000001",
    amount: 1050000,
    netAmount: 1050000,
    status: "PAID",
    paymentMethod: "Bank Transfer",
    transactionId: "BT-2025-12-24-001",
    createdDate: "2025-12-24",
    paidDate: "2025-12-24",
  },
  {
    id: "pay-002",
    paymentId: "PAY-002",
    userName: "Marie Uwizeyimana",
    userContact: "+250789654321",
    saleId: "sale-002",
    saleNumber: "SALE-1734900001",
    amount: 665600,
    netAmount: 665600,
    status: "PAID",
    paymentMethod: "MTN Mobile Money",
    transactionId: "MTN-2025-12-23-001",
    createdDate: "2025-12-23",
    paidDate: "2025-12-23",
  },
  {
    id: "pay-003",
    paymentId: "PAY-003",
    userName: "Paul Habimana",
    userContact: "+250790111213",
    saleId: "sale-003",
    saleNumber: "SALE-1734800001",
    amount: 1720000,
    netAmount: 1720000,
    status: "PROCESSING",
    paymentMethod: "Airtel Money",
    transactionId: "AIR-2025-12-22-001",
    createdDate: "2025-12-22",
  },
  {
    id: "pay-004",
    paymentId: "PAY-004",
    userName: "Sophie Karangwa",
    userContact: "+250791234567",
    saleId: "sale-003",
    saleNumber: "SALE-1734800001",
    amount: 588000,
    netAmount: 588000,
    status: "PENDING",
    createdDate: "2025-12-21",
  },
]

export default function PaymentManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [paymentMethod, setPaymentMethod] = useState("all")
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false)

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userContact.includes(searchQuery) ||
      payment.saleNumber.includes(searchQuery) ||
      payment.paymentId.includes(searchQuery)

    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus
    const matchesMethod = paymentMethod === "all" || payment.paymentMethod === paymentMethod

    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalPaymentsDue = mockPayments
    .filter((p) => p.status === "PENDING" || p.status === "PROCESSING")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalProcessed = mockPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalDistributed = mockPayments.reduce((sum, p) => sum + p.amount, 0)

  const processingRate = (
    (mockPayments.filter((p) => p.status === "PAID").length /
      mockPayments.length) *
    100
  ).toFixed(1)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
      case "PROCESSING":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
      case "FAILED":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    }
  }

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Payments Due
              </p>
              <p className="text-2xl font-bold">
                RWF{totalPaymentsDue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Processed
              </p>
              <p className="text-2xl font-bold text-green-600">
                RWF{totalProcessed.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Distributed
              </p>
              <p className="text-2xl font-bold">
                RWF{totalDistributed.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Processing Rate
              </p>
              <p className="text-2xl font-bold">{processingRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            {filteredPayments.length} payments
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, sale ID, or payment ID..."
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
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="MTN Mobile Money">MTN Mobile Money</SelectItem>
                <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedPayments.length > 0 && (
            <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <span className="text-sm font-medium">
                {selectedPayments.length} payment(s) selected
              </span>
              <Button size="sm" variant="outline" className="ml-auto">
                Mark as Processing
              </Button>
              <Button size="sm" variant="outline">
                Mark as Paid
              </Button>
              <Button size="sm" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </div>
          )}

          {/* Payments Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead className="w-8">
                    <Checkbox
                      checked={selectedPayments.length === filteredPayments.length}
                      onCheckedChange={(checked) =>
                        setSelectedPayments(
                          checked === true
                            ? filteredPayments.map((p) => p.id)
                            : []
                        )
                      }
                    />
                  </TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Sale Number</TableHead>
                  <TableHead className="text-right">Amount (RWF)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedPayments.includes(payment.id)}
                        onCheckedChange={() => togglePaymentSelection(payment.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-sm">
                      {payment.paymentId}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>{payment.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {payment.userContact}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.saleNumber}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      RWF{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.paymentMethod || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(payment.createdDate).toLocaleDateString()}
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
                              setSelectedPayment(payment)
                              setDetailsModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {payment.status !== "PAID" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setMarkPaidModalOpen(true)
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send Notification
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
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              {selectedPayment?.paymentId}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Payment Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-mono font-semibold">
                    {selectedPayment.paymentId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-semibold">{selectedPayment.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-semibold">{selectedPayment.userContact}</p>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-2">
                <h4 className="font-semibold">Financial Details</h4>
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Gross Amount
                    </span>
                    <span className="font-semibold">
                      RWF{selectedPayment.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Net Amount
                    </span>
                    <span className="font-bold text-green-600">
                      RWF{selectedPayment.netAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Sale Number
                    </span>
                    <span className="font-mono font-semibold">
                      {selectedPayment.saleNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedPayment.paymentMethod && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Payment Information</h4>
                  <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Method
                      </span>
                      <span className="font-semibold">
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                    {selectedPayment.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Transaction ID
                        </span>
                        <span className="font-mono font-semibold">
                          {selectedPayment.transactionId}
                        </span>
                      </div>
                    )}
                    {selectedPayment.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Paid Date
                        </span>
                        <span className="font-semibold">
                          {new Date(selectedPayment.paidDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Modal */}
      <Dialog open={markPaidModalOpen} onOpenChange={setMarkPaidModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Payment as Paid</DialogTitle>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium">
                  Mark <span className="font-semibold">{selectedPayment.userName}</span> payment of{" "}
                  <span className="font-semibold">
                    RWF{selectedPayment.amount.toLocaleString()}
                  </span>{" "}
                  as paid?
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="method">Payment Method *</Label>
                  <Select defaultValue={selectedPayment.paymentMethod || ""}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="MTN Mobile Money">
                        MTN Mobile Money
                      </SelectItem>
                      <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="txid">Transaction ID (Recommended)</Label>
                  <Input
                    id="txid"
                    placeholder="Enter transaction ID or reference"
                    defaultValue={selectedPayment.transactionId || ""}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMarkPaidModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Confirm Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
