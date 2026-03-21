"use client";

import React, { useState, useEffect } from "react";
import { WalletAPI, FinancialSummary } from "@/app/api/wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Coins,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EnhancedFinancialDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await WalletAPI.getFinancialSummary();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error loading financial summary:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("financial.loading")}
        </span>
      </div>
    );
  }

  if (!data) return null;

  // Calculate max revenue for bar height scaling
  const maxRevenue = Math.max(
    ...data.revenueByMonth.map((m) => m.grossRevenue),
    1,
  );
  const maxBarHeight = 160; // max px

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Credits Earned */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {t("financial.credits_earned")}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {data.totalCreditsEarned.toFixed(2)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-500">
                {t("financial.sold")}: {data.totalCreditsSold.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {t("financial.available")}:{" "}
                {data.totalCreditsAvailable.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Gross Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {t("financial.gross_revenue")}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatCurrency(data.totalGrossRevenue)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <ArrowDownRight className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-500">
                -{formatCurrency(data.totalFeeDeducted)} {t("financial.fees")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Net Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {t("financial.net_revenue")}
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(data.totalNetRevenue)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {data.totalGrossRevenue > 0
                  ? (
                      (data.totalNetRevenue / data.totalGrossRevenue) *
                      100
                    ).toFixed(1)
                  : "0"}
                % {t("financial.retained")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {t("financial.payments")}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatCurrency(data.paidPayments)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {formatCurrency(data.pendingPayments)} {t("financial.pending")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart (Pure Tailwind) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">
                {t("financial.monthly_revenue")}
              </CardTitle>
              <CardDescription>
                {t("financial.monthly_description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-52 px-2">
            {data.revenueByMonth.map((m) => {
              const height =
                maxRevenue > 0
                  ? Math.max(4, (m.grossRevenue / maxRevenue) * maxBarHeight)
                  : 4;
              const monthIndex = parseInt(m.month.split("-")[1]) - 1;
              const label = MONTH_ABBR[monthIndex] ?? m.month;

              return (
                <div
                  key={m.month}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  <div className="flex flex-col items-center justify-end flex-1 w-full">
                    {m.grossRevenue > 0 && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 truncate max-w-full">
                        {formatCurrency(m.grossRevenue)}
                      </span>
                    )}
                    <div
                      className="w-full max-w-[32px] rounded-t-md bg-emerald-500 dark:bg-emerald-400 transition-all duration-300"
                      style={{ height: `${height}px` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Per-Workspace Breakdown */}
      {data.revenueByWorkspace.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("financial.workspace_breakdown")}
            </CardTitle>
            <CardDescription>
              {t("financial.workspace_breakdown_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="text-xs font-medium">
                      {t("financial.workspace")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("financial.gross")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("financial.net")}
                    </TableHead>
                    <TableHead className="text-xs font-medium text-right">
                      {t("financial.credits_remaining")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.revenueByWorkspace.map((ws) => (
                    <TableRow key={ws.workspaceId}>
                      <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {ws.workspaceName}
                      </TableCell>
                      <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">
                        {formatCurrency(ws.grossRevenue)}
                      </TableCell>
                      <TableCell className="text-sm text-right text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(ws.netRevenue)}
                      </TableCell>
                      <TableCell className="text-sm text-right text-gray-700 dark:text-gray-300">
                        {ws.creditsAvailable.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
