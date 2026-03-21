"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShoppingCart, Zap, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { creditSalesApi } from "@/app/api/creditSales.api";
import { useRouter } from "next/navigation";

interface CreditListing {
  id: string;
  name: string;
  quantity: number;
  pricePerCredit: number;
  totalValue: number;
  status: "active" | "sold_out" | "paused";
}

export default function CreditsOnSaleWidget() {
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableCredits = async () => {
      try {
        const response = await creditSalesApi.getAvailableCredits();
        const data = response.data || response;
        if (data && data.totalAvailable) {
          setTotalAvailable(data.totalAvailable);
        }
      } catch (error) {
        console.error("Error fetching available credits:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableCredits();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("admin.status_active");
      case "sold_out":
        return t("admin.listing_status_sold_out");
      case "paused":
        return t("admin.listing_status_paused");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
      case "sold_out":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
      case "paused":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {t("admin.credits_on_sale")}
              </CardTitle>
              <CardDescription>Available for sale</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Total Available Credits */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <p className="text-xs text-muted-foreground mb-1">
                Total Available Credits
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalAvailable.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">credits</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Ready for market sale
              </p>
            </div>

            {/* Action Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={() => router.push("/dashboard/admin/credit-sales")}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {t("admin.create_new_listing")}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
