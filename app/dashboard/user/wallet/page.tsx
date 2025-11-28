import React from "react";
import WalletSummary from "@/components/dashboard_components/user/WalletSummary";
import WalletBalance from "@/components/dashboard_components/user/WalletBalance";
import WalletAccountSetup from "@/components/dashboard_components/user/WalletAccountSetup";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <WalletBalance />
        <WalletSummary />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <WalletAccountSetup />
      </div>
    </div>
  );
}
