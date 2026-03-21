"use client";

import { useState, useEffect } from "react";
import {
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  Download,
  Loader2,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/global/language-provider";
import { WalletAPI, SaleAllocationItem } from "@/app/api/wallet";
import { DataPagination } from "@/components/ui/data-pagination";
import { toast } from "sonner";
import { format } from "date-fns";

export default function WalletTransactions() {
  const { t } = useLanguage();
  const [allocations, setAllocations] = useState<SaleAllocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const result = await WalletAPI.getSaleAllocations(page, limit);
      setAllocations(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch sale allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [page]);

  const handleDownloadCertificate = async (allocationId: string) => {
    try {
      setDownloadingId(allocationId);
      const result = await WalletAPI.getCertificate(allocationId);
      const url = result.data?.certificateUrl;
      if (url) {
        window.open(url, "_blank");
        toast.success(t("certificate.download_success"));
      } else {
        toast.error(t("certificate.not_available"));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("certificate.download_failed"),
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {t("wallet.recent_transactions")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("wallet.latest_activity")}
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            {total} {t("wallet.total_transactions")}
          </Badge>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : allocations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("wallet.no_transactions")}
          </div>
        ) : (
          allocations.map((alloc) => (
            <div
              key={alloc.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-900/50">
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">
                      {alloc.saleNumber} — {alloc.credits}{" "}
                      {t("credits.credits")}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs shrink-0 border-0",
                        alloc.status === "SOLD"
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
                      )}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {alloc.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alloc.assetName ?? alloc.sector.replace(/_/g, " ")}
                    {alloc.soldAt &&
                      ` • ${format(new Date(alloc.soldAt), "MMM dd, yyyy")}`}
                  </p>
                </div>

                {/* Amount + Certificate */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    +{alloc.netAmount.toLocaleString()} RWF
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    disabled={downloadingId === alloc.id}
                    onClick={() => handleDownloadCertificate(alloc.id)}
                    title={t("certificate.download")}
                  >
                    {downloadingId === alloc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <DataPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
