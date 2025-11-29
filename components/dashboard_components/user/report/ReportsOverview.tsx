"use client";

import { FileText, UploadCloud, TrendingUp, Download, Calendar, MapPin, Image, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const salesData = [
  { date: "2025-01-14", credits: 40, amount: "8,400 RWF", status: "completed" },
  { date: "2025-01-08", credits: 20, amount: "4,200 RWF", status: "completed" },
  { date: "2025-01-02", credits: 15, amount: "3,150 RWF", status: "pending" },
];

const uploadActivity = [
  { date: "2025-01-13", photos: 14, land: "UPI-223-Kigali", status: "verified" },
  { date: "2025-01-02", photos: 8, land: "UPI-145-Musanze", status: "verified" },
  { date: "2024-12-28", photos: 12, land: "UPI-089-Rubavu", status: "pending" },
];

export default function ReportsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales History */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sales History</h3>
                <p className="text-sm text-muted-foreground">Recent credit sales</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {salesData.map((sale, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.credits} Credits Sold</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {sale.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{sale.amount}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        sale.status === "completed" 
                          ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-900/30" 
                          : "text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-900/30"
                      )}
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              View All Sales
            </Button>
          </div>
        </div>

        {/* Upload Activity */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50">
                <UploadCloud className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Upload Activity</h3>
                <p className="text-sm text-muted-foreground">Recent photo uploads</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {uploadActivity.map((act, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Image className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">{act.photos} Photos Uploaded</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {act.land}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{act.date}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        act.status === "verified" 
                          ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-900/30" 
                          : "text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-900/30"
                      )}
                    >
                      {act.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
              View All Uploads
            </Button>
          </div>
        </div>
      </div>

      {/* Download Report Button */}
      <div className="flex justify-center">
        <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
          <Download className="w-5 h-5 mr-2" />
          Download Full Report (PDF)
        </Button>
      </div>
    </div>
  );
}
