"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AvailableCreditsPage from "@/components/dashboard_components/admin/credit-sales/AvailableCreditsPage"
import CreateSalePage from "@/components/dashboard_components/admin/credit-sales/CreateSalePage"
import SalesHistoryPage from "@/components/dashboard_components/admin/credit-sales/SalesHistoryPage"
import PaymentManagementPage from "@/components/dashboard_components/admin/credit-sales/PaymentManagementPage"

export default function CreditSalesPage() {
  const [activeTab, setActiveTab] = useState("available")

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Credit Sales</h1>
        <p className="text-muted-foreground">
          Manage carbon credit sales and user payments using FIFO allocation
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="available">Available Credits</TabsTrigger>
          <TabsTrigger value="create">Create Sale</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <AvailableCreditsPage />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateSalePage />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <SalesHistoryPage />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentManagementPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
