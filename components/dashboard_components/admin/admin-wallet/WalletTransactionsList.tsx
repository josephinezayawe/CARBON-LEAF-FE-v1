"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownLeft, ArrowUpRight, ShoppingCart, Eye, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/global/language-provider"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "sale"
  description: string
  amount: number
  timestamp: string
  status: "completed" | "pending"
}

interface Props {
  transactions: Transaction[]
}

export default function WalletTransactionsList({ transactions }: Props) {
  const { t } = useLanguage()

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return t("admin.tx_deposit")
      case "sale":
        return t("admin.tx_sale")
      case "withdrawal":
        return t("admin.tx_withdrawal")
      default:
        return type
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t("admin.tx_completed")
      case "pending":
        return t("admin.tx_pending")
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
      case "sale":
        return <ShoppingCart className="w-5 h-5 text-blue-600" />
      case "withdrawal":
        return <ArrowUpRight className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-emerald-100 dark:bg-emerald-900/50"
      case "sale":
        return "bg-blue-100 dark:bg-blue-900/50"
      case "withdrawal":
        return "bg-red-100 dark:bg-red-900/50"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-emerald-600 dark:text-emerald-400"
      case "sale":
        return "text-blue-600 dark:text-blue-400"
      case "withdrawal":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-foreground"
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
         <div className="flex items-center justify-between">
           <div>
             <CardTitle>{t("admin.recent_transactions")}</CardTitle>
             <CardDescription>{transactions.length} {t("admin.recent_transactions_desc")}</CardDescription>
           </div>
           <Button variant="outline" size="sm" className="gap-2">
             <Download className="w-4 h-4" />
             {t("admin.export")}
           </Button>
         </div>
       </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn("p-2 rounded-lg", getTypeColor(tx.type))}>
                  {getTypeIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={cn("font-bold text-sm", getAmountColor(tx.type))}>
                    {tx.type === "withdrawal" || tx.type === "sale" ? "-" : "+"}
                    {tx.amount.toLocaleString()} RWF
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs mt-1",
                      tx.status === "completed"
                        ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                        : "text-amber-600 border-amber-200 bg-amber-50"
                    )}
                  >
                    {getStatusLabel(tx.status)}
                  </Badge>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
