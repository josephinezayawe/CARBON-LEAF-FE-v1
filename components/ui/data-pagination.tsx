"use client";

import { useLanguage } from "@/components/global/language-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function DataPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: DataPaginationProps) {
  const { t } = useLanguage();

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: number[] = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t("pagination.showing")} <span className="font-medium">{from}</span>{" "}
        {t("pagination.to")} <span className="font-medium">{to}</span>{" "}
        {t("pagination.of")} <span className="font-medium">{total}</span>{" "}
        {t("pagination.results")}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 px-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">{t("pagination.previous")}</span>
        </Button>

        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 p-0 ${
              p === page ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
            }`}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 px-2"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="sr-only">{t("pagination.next")}</span>
        </Button>
      </div>
    </div>
  );
}
