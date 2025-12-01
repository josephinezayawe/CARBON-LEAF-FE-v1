"use client";

import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/global/language-provider";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  date: string;
  time: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "credit",
    description: "Credit Sale - 40 Credits",
    amount: 8400,
    currency: "RWF",
    status: "completed",
    date: "Jan 14, 2025",
    time: "2:30 PM",
  },
  {
    id: "2",
    type: "debit",
    description: "Withdrawal to Bank",
    amount: 15000,
    currency: "RWF",
    status: "pending",
    date: "Jan 12, 2025",
    time: "10:15 AM",
  },
  {
    id: "3",
    type: "credit",
    description: "Credit Sale - 20 Credits",
    amount: 4200,
    currency: "RWF",
    status: "completed",
    date: "Jan 08, 2025",
    time: "4:45 PM",
  },
  {
    id: "4",
    type: "debit",
    description: "Transfer to MTN MoMo",
    amount: 5000,
    currency: "RWF",
    status: "failed",
    date: "Jan 05, 2025",
    time: "9:00 AM",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    labelKey: "wallet.completed",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/50",
    labelKey: "wallet.pending",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/50",
    labelKey: "wallet.failed",
  },
};

export default function WalletTransactions() {
  const { t } = useLanguage();
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
              <h3 className="font-semibold text-lg">{t("wallet.recent_transactions")}</h3>
              <p className="text-sm text-muted-foreground">{t("wallet.latest_activity")}</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            {t("general.filter")}
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.map((tx) => {
          const status = statusConfig[tx.status];
          const StatusIcon = status.icon;
          
          return (
            <div 
              key={tx.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  tx.type === "credit" 
                    ? "bg-emerald-100 dark:bg-emerald-900/50" 
                    : "bg-red-100 dark:bg-red-900/50"
                )}>
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{tx.description}</p>
                    <Badge 
                       variant="outline" 
                       className={cn("text-xs shrink-0", status.color, status.bg, "border-0")}
                     >
                       <StatusIcon className="w-3 h-3 mr-1" />
                       {t(status.labelKey)}
                     </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tx.date} • {tx.time}
                  </p>
                </div>

                {/* Amount */}
                <div className={cn(
                  "text-right shrink-0 font-semibold",
                  tx.type === "credit" 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-red-600 dark:text-red-400"
                )}>
                  {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()} {tx.currency}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
          {t("wallet.view_all")}
        </Button>
      </div>
    </div>
  );
}
