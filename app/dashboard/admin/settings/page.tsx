"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Settings as SettingsIcon, Save, Check } from "lucide-react"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("fees")

  const handleSave = () => {
    setSaved(true)
    toast.success("Settings saved successfully!")
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system parameters and fees
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="fees">Fees & Pricing</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Fees & Pricing Tab */}
        <TabsContent value="fees">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Fee Configuration</CardTitle>
              <CardDescription>
                Set commission rates and pricing for the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Commission */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-semibold">Platform Commission</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="farmer-commission">Farmer Credits Commission (%)</Label>
                     <Input id="farmer-commission" type="number" defaultValue="5" step="0.1" />
                     <p className="text-xs text-muted-foreground">Applied to all farmer credit sales</p>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="eco-commission">Eco Stoves Commission (%)</Label>
                     <Input id="eco-commission" type="number" defaultValue="6" step="0.1" />
                     <p className="text-xs text-muted-foreground">Applied to eco stove transactions</p>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="hybrid-commission">Hybrid Vehicle Commission (%)</Label>
                     <Input id="hybrid-commission" type="number" defaultValue="4" step="0.1" />
                     <p className="text-xs text-muted-foreground">Applied to hybrid vehicle credits</p>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="commercial-commission">Commercial Commission (%)</Label>
                     <Input id="commercial-commission" type="number" defaultValue="7" step="0.1" />
                     <p className="text-xs text-muted-foreground">Applied to commercial credits</p>
                   </div>
                 </div>
              </div>

              {/* Base Pricing */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-semibold">Base Credit Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmer-price">Farmer Credits (RWF per credit)</Label>
                    <Input id="farmer-price" type="number" defaultValue="210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eco-price">Eco Stoves (RWF per credit)</Label>
                    <Input id="eco-price" type="number" defaultValue="215" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hybrid-price">Hybrid Vehicle (RWF per credit)</Label>
                    <Input id="hybrid-price" type="number" defaultValue="208" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commercial-price">Commercial (RWF per credit)</Label>
                    <Input id="commercial-price" type="number" defaultValue="218" />
                  </div>
                </div>
              </div>

              {/* Transaction Fees */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-semibold">Transaction Fees</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawal-fee">Withdrawal Fee (RWF)</Label>
                    <Input id="withdrawal-fee" type="number" defaultValue="500" />
                    <p className="text-xs text-muted-foreground">Fixed fee per withdrawal</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-fee">Transfer Fee (%)</Label>
                    <Input id="transfer-fee" type="number" defaultValue="1.5" step="0.1" />
                    <p className="text-xs text-muted-foreground">Percentage of transfer amount</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Fee Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* System Status */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-semibold">System Status</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-status">System Active</Label>
                    <p className="text-xs text-muted-foreground mt-1">Allow new credit applications and transactions</p>
                  </div>
                  <Switch id="system-status" defaultChecked />
                </div>
              </div>

              {/* Approval Settings */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-semibold">Approval Requirements</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-credits">Minimum Credits for Approval</Label>
                    <Input id="min-credits" type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-credits">Maximum Credits per User</Label>
                    <Input id="max-credits" type="number" defaultValue="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approval-days">Auto-reject after (days)</Label>
                    <Input id="approval-days" type="number" defaultValue="30" />
                    <p className="text-xs text-muted-foreground">Automatically reject applications not reviewed in this time</p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-semibold">System Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">System Name</Label>
                    <Input id="system-name" defaultValue="Carbon Leaf" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system-desc">System Description</Label>
                    <Textarea 
                      id="system-desc" 
                      defaultValue="A platform for carbon credit management and trading" 
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "New Credit Applications",
                  description: "Alert when new credit applications are submitted",
                },
                {
                  label: "Failed Verification",
                  description: "Alert when applications fail AI verification",
                },
                {
                  label: "High Volume Sales",
                  description: "Alert when daily sales exceed threshold",
                },
                {
                  label: "System Alerts",
                  description: "Critical system and performance alerts",
                },
                {
                  label: "Suspicious Activity",
                  description: "Alert on suspicious user behavior detection",
                },
                {
                  label: "Daily Reports",
                  description: "Receive daily summary reports",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}

              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {saved && (
        <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 shadow-lg">
          <Check className="w-5 h-5" />
          <span className="font-medium">Settings saved successfully</span>
        </div>
      )}
    </div>
  )
}
