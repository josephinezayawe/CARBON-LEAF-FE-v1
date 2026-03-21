"use client";

import { useState, useEffect } from "react";
import { SystemFeeAPI, SystemFeeSummary } from "@/app/api/systemFees.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DollarSign, TrendingUp, Package, ShoppingCart } from "lucide-react";
import {
  SellSystemFeesDialog,
  SystemFeeDetailsTable,
  SystemFeeSalesHistory,
} from "@/components/dashboard_components/admin/system-fees";

export default function SystemFeesPage() {
  const [summary, setSummary] = useState<SystemFeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await SystemFeeAPI.getSystemFeeSummary();
      setSummary(data);
    } catch (error: any) {
      toast.error("Failed to load system fee summary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSaleComplete = () => {
    setSellDialogOpen(false);
    fetchSummary();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Fee Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage system fee collections from credit approvals
          </p>
        </div>
        <Button
          onClick={() => setSellDialogOpen(true)}
          disabled={!summary || summary.totalAvailableCredits <= 0}
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Sell Fee Credits
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fee Credits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalFeeCredits.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All fees collected from approvals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Credits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary?.totalAvailableCredits.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ready to be sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Credits</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalSoldCredits.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Already monetized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.totalRevenue.toLocaleString() || 0} RWF
            </div>
            <p className="text-xs text-muted-foreground">From fee sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Sector Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary?.sectorBreakdown.map((sector) => (
              <div
                key={sector.sector}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sector.sector.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sector.userCount} users
                  </p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">
                      {sector.totalFees.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {sector.availableFees.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">Available</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-500">
                      {sector.soldFees.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">Sold</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Details and Sales History */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Fee Details</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <SystemFeeDetailsTable />
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <SystemFeeSalesHistory />
        </TabsContent>
      </Tabs>

      {/* Sell Dialog */}
      <SellSystemFeesDialog
        open={sellDialogOpen}
        onClose={() => setSellDialogOpen(false)}
        onSaleComplete={handleSaleComplete}
        availableCredits={summary?.totalAvailableCredits || 0}
      />
    </div>
  );
}
