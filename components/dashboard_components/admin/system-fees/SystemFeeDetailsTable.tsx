"use client";

import { useState, useEffect } from "react";
import { SystemFeeAPI, SystemFeeDetail } from "@/app/api/systemFees.api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { DataPagination } from "@/components/ui/data-pagination";

export default function SystemFeeDetailsTable() {
  const [fees, setFees] = useState<SystemFeeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSector, setFilterSector] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const handleFilterSector = (val: string) => {
    setFilterSector(val);
    setPage(1);
  };

  const handleFilterStatus = (val: string) => {
    setFilterStatus(val);
    setPage(1);
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      const filters: any = { page, limit };

      if (filterSector !== "ALL") {
        filters.sector = filterSector;
      }

      if (filterStatus === "AVAILABLE") {
        filters.isSold = false;
      } else if (filterStatus === "SOLD") {
        filters.isSold = true;
      }

      const result = await SystemFeeAPI.getSystemFeeDetails(filters);
      setFees(result.data);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (error: any) {
      toast.error("Failed to load fee details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [filterSector, filterStatus, page]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Fee Details</CardTitle>
          <div className="flex gap-2">
            <Select value={filterSector} onValueChange={handleFilterSector}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sectors</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="HYBRID_CAR_OWNER">
                  Hybrid Car Owner
                </SelectItem>
                <SelectItem value="ECO_FRIENDLY_STOVES">
                  Eco-Friendly Stoves
                </SelectItem>
                <SelectItem value="COMMERCIAL_BUILDING">
                  Commercial Building
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={handleFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchFees}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : fees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No fee records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Gross Credits</TableHead>
                  <TableHead className="text-right">Fee Amount</TableHead>
                  <TableHead className="text-right">Fee %</TableHead>
                  <TableHead>Deducted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sale Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">
                      {fee.userName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {fee.sector.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {fee.grossCredits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {fee.feeAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {fee.feePercentage}%
                    </TableCell>
                    <TableCell>
                      {format(new Date(fee.deductedAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {fee.isSold ? (
                        <Badge variant="secondary">Sold</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          Available
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {fee.saleRevenue
                        ? `${fee.saleRevenue.toLocaleString()} RWF`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

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
  );
}
