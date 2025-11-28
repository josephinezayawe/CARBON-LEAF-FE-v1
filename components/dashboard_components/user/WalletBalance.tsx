"use client";

import { Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WalletBalance() {
  const balance = 48250; // Example balance (RWF)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Wallet Balance</CardTitle>
        <Wallet className="w-5 h-5 text-green-700" />
      </CardHeader>

      <CardContent>
        <div className="bg-green-50 border border-green-100 p-6 rounded-xl text-center">
          <p className="text-gray-600 text-sm">Available Balance</p>
          <h2 className="text-3xl font-bold text-green-800 mt-2">
            {balance.toLocaleString()} RWF
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Deposit
            </Button>
            <Button variant="outline" className="border-green-600 text-green-700">
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
