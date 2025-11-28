"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Send } from "lucide-react";

export default function WalletSummary() {
  return (
    <Card className="w-full shadow-sm h-full">
      <CardHeader>
        <CardTitle>Wallet Summary</CardTitle>
        <CardDescription>Manage your carbon credits and earnings</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Balance */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">120,450</span>
            <span className="text-sm font-medium text-muted-foreground">C-Credits</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="w-full" size="lg">
            <Coins className="mr-2 h-4 w-4" /> Sell
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <Send className="mr-2 h-4 w-4" /> Transfer
          </Button>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Available</div>
            <div className="text-lg font-bold">85,250</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Pending</div>
            <div className="text-lg font-bold">4,300</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Est. Value</div>
            <div className="text-lg font-bold text-emerald-600">$12,842</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Sold</div>
            <div className="text-lg font-bold">35,200</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
