"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketSummary() {
  return (
    <Card className="w-full shadow-sm h-full">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Real-time market data and trends</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* Current Credit Price */}
        <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="text-2xl font-bold">210 RFW</span>
          </div>
          <div className="flex items-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">

          {/* Demand */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Market Demand</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold">High</span>
            </div>
          </div>

          {/* Supply */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Available Supply</span>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span className="font-semibold">Low</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 col-span-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Total Corporate Demand
            </span>
            <span className="font-semibold text-lg">182,300 Credits</span>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          View Full Market
        </Button>
      </CardContent>
    </Card>
  );
}
