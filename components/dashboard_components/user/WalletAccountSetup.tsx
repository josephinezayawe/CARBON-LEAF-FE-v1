"use client";

import { useState } from "react";
import { Banknote, Smartphone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function WalletAccountSetup() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Account setup completed!");
    }, 1200);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Wallet Account Setup
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="bank" className="w-full">
          {/* Tabs */}
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Banknote className="w-4 h-4" /> Bank Account
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Mobile Money
            </TabsTrigger>
          </TabsList>

          {/* Bank Account Form */}
          <TabsContent value="bank">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Bank Name</Label>
                <Input placeholder="e.g., Bank of Kigali" required />
              </div>

              <div>
                <Label>Account Number</Label>
                <Input placeholder="Enter account number" required />
              </div>

              <div>
                <Label>Account Holder</Label>
                <Input placeholder="Full name" required />
              </div>

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Bank Account"}
              </Button>
            </form>
          </TabsContent>

          {/* Mobile Money Form */}
          <TabsContent value="mobile">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Provider</Label>
                <Input placeholder="e.g., MTN, Airtel" required />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input placeholder="07XX XXX XXX" required />
              </div>

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Mobile Money Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
