"use client";

import { Wallet, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function WalletBalance() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 48250;
  const pendingBalance = 12500;
  const change = 8.5;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700">

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-200 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl">
               <Wallet className="w-5 h-5 text-slate-600 dark:text-slate-200" />
             </div>
             <div>
               <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">Available Balance</p>
             </div>
          </div>
          
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {showBalance ? (
              <Eye className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              {showBalance ? balance.toLocaleString() : "••••••"}
            </h2>
            <span className="text-xl text-slate-600 dark:text-slate-300 font-medium">RWF</span>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
              </div>
              <span className="text-sm font-medium">+{change}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="p-4 bg-slate-200 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl mb-6 border border-slate-300 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Pending</p>
              <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">
                {showBalance ? `${pendingBalance.toLocaleString()} RWF` : "••••••"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Processing</p>
              <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">2-3 days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 h-12 bg-slate-700 text-white hover:bg-slate-600 font-semibold shadow-lg dark:bg-slate-600 dark:text-slate-50 dark:hover:bg-slate-500"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}
