"use client";

import { Store } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Market() {
  const demand = 13000;
  const supply = 9200;
  const percentage = Math.min((supply / demand) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
          <Store className="w-5 h-5 text-green-700" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
          <h3 className="text-green-800 font-medium">Current Market Demand</h3>
          <p className="text-gray-600 text-sm">{demand.toLocaleString()} credits</p>
        </div>

        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
          <h3 className="text-green-800 font-medium">Available Supply</h3>
          <p className="text-gray-600 text-sm">{supply.toLocaleString()} credits</p>

          <Progress value={percentage} className="mt-3" />
          <p className="text-xs text-gray-500 mt-1">
            {percentage.toFixed(1)}% of demand covered
          </p>
        </div>

        <div className="bg-green-100 border border-green-200 p-4 rounded-xl">
          <h3 className="text-green-800 font-medium">Market Insight</h3>
          <p className="text-gray-700 text-sm">
            High demand detected. Great time to sell credits.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
