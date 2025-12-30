"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Save, AlertCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Mock data for update history
const mockUpdateHistory = [
  {
    id: "1",
    previousPercentage: 9.5,
    newPercentage: 10.0,
    updatedBy: "Admin User",
    updatedDate: "2025-12-15 10:30 AM",
  },
  {
    id: "2",
    previousPercentage: 9.0,
    newPercentage: 9.5,
    updatedBy: "Admin User",
    updatedDate: "2025-12-01 2:15 PM",
  },
  {
    id: "3",
    previousPercentage: 8.5,
    newPercentage: 9.0,
    updatedBy: "System Admin",
    updatedDate: "2025-11-15 11:00 AM",
  },
]

export default function SettingsPage() {
  const { t } = useLanguage()
  const [currentFeePercentage] = useState(10.0)
  const [newFeePercentage, setNewFeePercentage] = useState(10.0)
  const [previewGrossCredits, setPreviewGrossCredits] = useState(1000)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Calculate fee and net credits
  const feeAmount = (previewGrossCredits * newFeePercentage) / 100
  const netCredits = previewGrossCredits - feeAmount

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setNewFeePercentage(currentFeePercentage)
  }

  const handleOpenUpdateDialog = () => {
    setIsUpdateDialogOpen(true)
  }

  const handleConfirmUpdate = () => {
    // Validate fee percentage
    if (newFeePercentage < 0 || newFeePercentage > 100) {
      toast.error("Fee percentage must be between 0 and 100")
      return
    }

    toast.success("Fee percentage updated successfully")
    setIsUpdateDialogOpen(false)
    setIsEditMode(false)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.system_settings")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.configure_parameters")}
        </p>
      </div>

      {/* Fee Settings Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{t("admin.fee_configuration") || "Fee Configuration"}</CardTitle>
          <CardDescription>
            Percentage of credits deducted as platform fee
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Fee Display */}
          <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">
                  {t("admin.current_fee_percentage") || "Current Fee Percentage"}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Currently active system fee
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {currentFeePercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {!isEditMode ? (
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Fee Percentage
            </Button>
          ) : (
            <>
              {/* Edit Mode - Fee Percentage Input */}
              <div className="space-y-2 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/20">
                <Label htmlFor="new-fee-percentage" className="font-semibold">
                  New Fee Percentage
                </Label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      id="new-fee-percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={newFeePercentage}
                      onChange={(e) => setNewFeePercentage(parseFloat(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <span className="text-lg font-semibold text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Decimal input allowed (e.g., 10.50)
                </p>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleOpenUpdateDialog}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Fee Calculation Preview */}
          <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
            <h3 className="font-semibold">Fee Calculation Preview</h3>
            <p className="text-sm text-muted-foreground">
              Preview how the fee calculation will work with sample credits:
            </p>

            <div className="space-y-3">
              {/* Gross Credits Input */}
              <div className="space-y-2">
                <Label htmlFor="preview-gross">Gross Credits (Sample)</Label>
                <Input
                  id="preview-gross"
                  type="number"
                  value={previewGrossCredits}
                  onChange={(e) => setPreviewGrossCredits(parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>

              {/* Calculation Results */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-muted-foreground mb-1">Fee Percentage</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {newFeePercentage.toFixed(2)}%
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-muted-foreground mb-1">Fee Amount</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {feeAmount.toFixed(2)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-muted-foreground mb-1">Net Credits</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {netCredits.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update History */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Update History</CardTitle>
          <CardDescription>
            Previous fee percentage changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>Previous Fee %</TableHead>
                  <TableHead>New Fee %</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Updated Date/Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUpdateHistory
                  .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
                  .map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {record.previousPercentage.toFixed(2)}%
                      </TableCell>
                      <TableCell className="font-medium">
                        <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          {record.newPercentage.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{record.updatedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.updatedDate}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Confirmation Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Fee Percentage</DialogTitle>
            <DialogDescription>
              Please confirm this change to the system fee percentage
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-muted-foreground">Current Fee</p>
                <p className="text-lg font-bold">{currentFeePercentage.toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground">New Fee</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {newFeePercentage.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                This change will affect all future credit calculations
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              onClick={() => setIsUpdateDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Update Fee Percentage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
