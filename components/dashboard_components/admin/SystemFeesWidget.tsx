"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SystemFeeAPI } from "@/app/api/systemFees.api";
import { DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SystemFeesWidget() {
  const [availableCredits, setAvailableCredits] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSystemFees = async () => {
      try {
        const summary = await SystemFeeAPI.getSystemFeeSummary();
        setAvailableCredits(summary.totalAvailableCredits);
        setTotalRevenue(summary.totalRevenue);
      } catch (error) {
        console.error("Failed to fetch system fees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemFees();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          System Fee Credits
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {availableCredits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available to sell</p>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Revenue:</span>
              <span className="font-semibold text-blue-600">
                {totalRevenue.toLocaleString()} RWF
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => router.push("/dashboard/admin/system-fees")}
          >
            Manage Fees
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
