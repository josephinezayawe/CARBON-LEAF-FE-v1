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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 shadow-xl shadow-emerald-500/20">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      
      {/* Card pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Available Balance</p>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span className="text-xs text-yellow-200">Premium Account</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showBalance ? (
              <Eye className="w-5 h-5 text-white/80" />
            ) : (
              <EyeOff className="w-5 h-5 text-white/80" />
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {showBalance ? balance.toLocaleString() : "••••••"}
            </h2>
            <span className="text-xl text-white/80 font-medium">RWF</span>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-emerald-100">
              <div className="p-1 bg-emerald-400/30 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
              </div>
              <span className="text-sm font-medium">+{change}%</span>
              <span className="text-xs text-white/60">vs last month</span>
            </div>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Pending</p>
              <p className="text-white text-lg font-bold">
                {showBalance ? `${pendingBalance.toLocaleString()} RWF` : "••••••"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Processing</p>
              <p className="text-white text-lg font-bold">2-3 days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 h-12 bg-white text-emerald-700 hover:bg-white/90 font-semibold shadow-lg"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}
