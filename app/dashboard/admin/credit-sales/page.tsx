"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShoppingCart, Plus, TrendingUp, DollarSign, Zap, CheckCircle2, Clock } from "lucide-react"
import SalesPerformance from "@/components/dashboard_components/admin/credit-sales/SalesPerformance"

interface CreditListing {
  id: string
  name: string
  sector: string
  quantity: number
  pricePerCredit: number
  totalValue: number
  status: "active" | "sold_out" | "paused"
  createdDate: string
  sold: number
}

const mockListings: CreditListing[] = [
  {
    id: "list-001",
    name: "Farmer Credits - Batch 001",
    sector: "farmer",
    quantity: 45000,
    pricePerCredit: 210,
    totalValue: 9450000,
    status: "active",
    createdDate: "2025-11-20",
    sold: 12500,
  },
  {
    id: "list-002",
    name: "Eco Stove Credits - Premium",
    sector: "eco_stove",
    quantity: 28500,
    pricePerCredit: 215,
    totalValue: 6132500,
    status: "active",
    createdDate: "2025-11-15",
    sold: 8200,
  },
  {
    id: "list-003",
    name: "Hybrid Vehicle Credits",
    sector: "hybrid_vehicle",
    quantity: 12000,
    pricePerCredit: 208,
    totalValue: 2496000,
    status: "paused",
    createdDate: "2025-11-10",
    sold: 5600,
  },
  {
    id: "list-004",
    name: "Commercial Building Credits",
    sector: "commercial_building",
    quantity: 35000,
    pricePerCredit: 218,
    totalValue: 7630000,
    status: "active",
    createdDate: "2025-10-28",
    sold: 25000,
  },
]

const mockBuyers = [
  { name: "Global Energy Corp", type: "Corporation", credits: 15000, totalValue: 3150000 },
  { name: "Eco Solutions Ltd", type: "NGO", credits: 8200, totalValue: 1763000 },
  { name: "Carbon Offset Initiative", type: "NGO", credits: 5600, totalValue: 1164800 },
]

export default function CreditSalesPage() {
  const { t } = useLanguage()
  const [listings, setListings] = useState(mockListings)
  const [showNewListingForm, setShowNewListingForm] = useState(false)
  const [activeTab, setActiveTab] = useState("listings")

  const totalOnSale = listings
    .filter((l) => l.status !== "sold_out")
    .reduce((sum, l) => sum + (l.quantity - l.sold) * l.pricePerCredit, 0)

  const totalSold = listings.reduce((sum, l) => sum + l.sold * l.pricePerCredit, 0)

  const getSectorLabel = (sector: string) => {
    return t(`admin.${sector}`)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("admin.status_active")
      case "sold_out":
        return t("admin.listing_status_sold_out")
      case "paused":
        return t("admin.listing_status_paused")
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      case "sold_out":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      case "paused":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.credit_sales")}</h1>
        <p className="text-muted-foreground">
          {t("admin.manage_listings")}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.active_listings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{t("admin.currently_selling")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.total_on_sale")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalOnSale / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">{t("admin.rwf_value")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.total_sold")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalSold / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">{t("admin.rwf_revenue")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.active_buyers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBuyers.length}</div>
            <p className="text-xs text-muted-foreground">{t("admin.companies")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance */}
      <SalesPerformance listings={listings} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="listings">{t("admin.active_listings_tab")}</TabsTrigger>
          <TabsTrigger value="buyers">{t("admin.buyers_tab")}</TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("admin.credit_listings")}</CardTitle>
                  <CardDescription>{t("admin.all_active_paused")}</CardDescription>
                </div>
                <Button
                  onClick={() => setShowNewListingForm(!showNewListingForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("admin.new_listing")}
                </Button>
              </div>
            </CardHeader>

            {showNewListingForm && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-6">
                  <div className="space-y-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <Label>{t("admin.listing_name")}</Label>
                       <Input placeholder={t("admin.listing_placeholder")} />
                     </div>
                     <div>
                       <Label>{t("admin.select_sector")}</Label>
                       <Select>
                         <SelectTrigger>
                           <SelectValue placeholder={t("admin.select_sector")} />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="farmer">{t("admin.farmer")}</SelectItem>
                           <SelectItem value="eco_stove">{t("admin.eco_stove")}</SelectItem>
                           <SelectItem value="hybrid_vehicle">{t("admin.hybrid_vehicle")}</SelectItem>
                           <SelectItem value="commercial_building">{t("admin.commercial_building")}</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div>
                       <Label>{t("admin.quantity_credits")}</Label>
                       <Input type="number" placeholder="0" />
                     </div>
                     <div>
                       <Label>{t("admin.price_per_credit")}</Label>
                       <Input type="number" placeholder="210" />
                     </div>
                   </div>
                   <div>
                     <Label>{t("admin.description")}</Label>
                     <Textarea placeholder={t("admin.describe_credits")} rows={3} />
                   </div>
                   <div className="flex gap-3">
                     <Button className="flex-1 bg-blue-600 hover:bg-blue-700">{t("admin.create_listing")}</Button>
                     <Button
                       variant="outline"
                       className="flex-1"
                       onClick={() => setShowNewListingForm(false)}
                     >
                       {t("admin.cancel")}
                     </Button>
                   </div>
                  </div>
                </div>
              </>
            )}

            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>{t("admin.table_listing_name")}</TableHead>
                      <TableHead>{t("admin.table_credits")}</TableHead>
                      <TableHead>{t("admin.table_price")}</TableHead>
                      <TableHead>{t("admin.table_total_value")}</TableHead>
                      <TableHead>{t("admin.table_sold")}</TableHead>
                      <TableHead>{t("admin.table_status")}</TableHead>
                      <TableHead>{t("admin.table_created")}</TableHead>
                      <TableHead className="text-right">{t("admin.table_actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id} className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{listing.name}</TableCell>
                        <TableCell>{listing.quantity.toLocaleString()}</TableCell>
                        <TableCell>{listing.pricePerCredit} RWF</TableCell>
                        <TableCell className="font-semibold">
                          {(listing.totalValue / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {listing.sold.toLocaleString()} ({Math.round((listing.sold / listing.quantity) * 100)}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(listing.status)}>
                            {getStatusLabel(listing.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(listing.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">{t("admin.edit")}</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buyers Tab */}
         <TabsContent value="buyers">
           <Card className="border-0 shadow-sm">
             <CardHeader>
               <CardTitle>{t("admin.buyers_partners")}</CardTitle>
               <CardDescription>{t("admin.companies_purchasing")}</CardDescription>
             </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {mockBuyers.map((buyer) => (
                  <div
                    key={buyer.name}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{buyer.name}</h3>
                      <Badge variant="secondary">{buyer.type}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">{buyer.credits.toLocaleString()}</span> {t("admin.credits_purchased")}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">{(buyer.totalValue / 1000000).toFixed(1)}M RWF</span> {t("admin.spent")}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">{t("admin.view_history")}</Button>
                      <Button size="sm" variant="ghost">{t("admin.contact")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
