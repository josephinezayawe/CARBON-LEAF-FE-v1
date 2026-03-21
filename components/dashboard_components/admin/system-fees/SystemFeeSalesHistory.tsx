"use client";

import { useState, useEffect } from "react";
import { SystemFeeAPI, SystemFeeSale } from "@/app/api/systemFees.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Eye } from "lucide-react";

export default function SystemFeeSalesHistory() {
  const [sales, setSales] = useState<SystemFeeSale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await SystemFeeAPI.getSystemFeeSales();
      setSales(data);
    } catch (error: any) {
      toast.error("Failed to load sales history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-600">Paid</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Fee Sales History</CardTitle>
          <Button variant="outline" onClick={fetchSales}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sales recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale Number</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead className="text-right">Credits Sold</TableHead>
                  <TableHead className="text-right">Price/Credit</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Sale Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {sale.saleNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sale.buyerName || "N/A"}</p>
                        {sale.buyerCompany && (
                          <p className="text-xs text-muted-foreground">
                            {sale.buyerCompany}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {sale.totalFeeCredits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {sale.pricePerCredit.toLocaleString()} RWF
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {sale.totalRevenue.toLocaleString()} RWF
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(sale.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      {sale.soldAt
                        ? format(new Date(sale.soldAt), "MMM dd, yyyy HH:mm")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary */}
        {sales.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{sales.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Credits Sold
                </p>
                <p className="text-2xl font-bold">
                  {sales
                    .reduce((sum, sale) => sum + sale.totalFeeCredits, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sales
                    .reduce((sum, sale) => sum + sale.totalRevenue, 0)
                    .toLocaleString()}{" "}
                  RWF
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
