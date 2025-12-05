"use client";

import { Wallet, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { Badge } from "@/components/ui/badge";
import WalletSummary from "@/components/dashboard_components/user/WalletSummary";
import WalletAccountSetup from "@/components/dashboard_components/user/WalletAccountSetup";
import WalletTransactions from "@/components/dashboard_components/user/WalletTransactions";
import { useEffect, useState } from "react";
import { Account } from "@/lib/dataSchemas";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { WalletAPI } from "@/app/api/wallet";
// import WalletBalance from "@/components/dashboard_components/user/WalletBalance";

export default function WalletPage() {
  const [account, setAccount] = useState<Account>()
  const [credits, setCredits] = useState<number>(0)
  useEffect(() => {
    async function userData() {
      const user = await getCurrentUser()
      if (!user?.id) {
        return toast.error('User Not Found')
      }
      if (user?.role !== 'USER') {
        return toast.error('UnAuthenticated User')
      }
      setAccount(user)
    }
    userData()
  }, [])
  const { t } = useLanguage();
  useEffect(() => {


    const getWallet = async () => {
      try {
        if (!account?.id) return;
        const res = await WalletAPI.getWallet()
        setCredits(res.data.totalCredits);
      } catch (error) {
        toast.error('Failed to fetch wallet data')
      }
    }
    getWallet()
  }, [account])
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {t("wallet.title")}
                  </h1>
                  <p className="text-emerald-100 text-sm md:text-base">
                    {t("wallet.manage")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1.5">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                {t("credits.this_week")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Balance & Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WalletAccountSetup />
        <WalletSummary credits={credits} />
      </div>

      {/* Transactions & Account Setup */}
      <div className="grid gap-6 lg:grid-cols-1">
        <WalletTransactions />
      </div>
    </div>
  );
}
