"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/global/language-provider";

export default function MarketSummary() {
  const { t } = useLanguage();
  return (
    <Card className="w-full shadow-sm h-full">
      <CardHeader>
        <CardTitle>{t("market.title")}</CardTitle>
        <CardDescription>{t("market.real_time")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* Current Credit Price */}
        <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{t("market.current_price")}</span>
            <span className="text-2xl font-bold">210 RFW</span>
          </div>
          <div className="flex items-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">

          {/* Demand */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{t("market.market_demand")}</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold">{t("market.high")}</span>
            </div>
          </div>

          {/* Supply */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{t("market.available_supply")}</span>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span className="font-semibold">{t("market.low")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 col-span-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {t("market.total_demand")}
            </span>
            <span className="font-semibold text-lg">182,300 Credits</span>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          {t("market.view_full")}
        </Button>
      </CardContent>
    </Card>
  );
}
