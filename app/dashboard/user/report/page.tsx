"use client";

import { BarChart2, Download, TrendingUp, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReportsOverview from "@/components/dashboard_components/user/report/ReportsOverview";
import ReportStats from "@/components/dashboard_components/user/report/ReportStats";
import ReportCharts from "@/components/dashboard_components/user/report/ReportCharts";

export default function ReportPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Reports & Analytics
                  </h1>
                  <p className="text-blue-100 text-sm md:text-base">
                    Track your carbon credit performance
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Jan 2025
              </Badge>
              <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ReportStats />

      {/* Charts Section */}
      <ReportCharts />

      {/* Detailed Reports */}
      <ReportsOverview />
    </div>
  );
}
