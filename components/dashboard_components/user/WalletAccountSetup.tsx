"use client";

import { useState } from "react";
import { Banknote, Smartphone, Building2, Phone, User, CreditCard, CheckCircle2, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function WalletAccountSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">Setup withdrawal accounts</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Shield className="w-3 h-3" />
            Secure
          </Badge>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid grid-cols-2 h-12 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            <TabsTrigger 
              value="bank" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              <Banknote className="w-4 h-4" />
              Bank Account
            </TabsTrigger>
            <TabsTrigger 
              value="mobile" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              Mobile Money
            </TabsTrigger>
          </TabsList>

          {/* Bank Account Form */}
          <TabsContent value="bank" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  Bank Name
                </Label>
                <Input 
                  placeholder="e.g., Bank of Kigali" 
                  required 
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                  Account Number
                </Label>
                <Input 
                  placeholder="Enter account number" 
                  required 
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  Account Holder Name
                </Label>
                <Input 
                  placeholder="Full name as on account" 
                  required 
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              {success && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Bank account saved successfully!</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4 mr-2" />
                    Save Bank Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Mobile Money Form */}
          <TabsContent value="mobile" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                  Provider
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {["MTN MoMo", "Airtel Money"].map((provider) => (
                    <label
                      key={provider}
                      className={cn(
                        "flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700",
                        "has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                      )}
                    >
                      <input type="radio" name="provider" value={provider} className="sr-only" />
                      <span className="font-medium">{provider}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input 
                  placeholder="07XX XXX XXX" 
                  required 
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  Account Name
                </Label>
                <Input 
                  placeholder="Registered name" 
                  required 
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              {success && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Mobile money account saved!</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Save Mobile Money
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
