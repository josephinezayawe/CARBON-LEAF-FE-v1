"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import { creditSalesApi } from "@/app/api/creditSales.api";
import { toast } from "sonner";

interface AllocationItem {
  userName: string;
  workspaceId: string;
  sector: string;
  creditsAvailable: number;
  creditsTaken: number;
  previouslySold: number;
  remainingAfter: number;
  amountOwed: number;
}

interface SaleFormData {
  buyerName: string;
  buyerContact: string;
  buyerEmail: string;
  purpose: string;
  creditsToSell: number;
  pricePerCredit: number;
}

export default function CreateSalePage() {
  const [totalAvailableCredits, setTotalAvailableCredits] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SaleFormData>({
    buyerName: "",
    buyerContact: "",
    buyerEmail: "",
    purpose: "",
    creditsToSell: 0,
    pricePerCredit: 210,
  });

  const [allocation, setAllocation] = useState<AllocationItem[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [generatedSaleNumber, setGeneratedSaleNumber] = useState("");
  const [executingSale, setExecutingSale] = useState(false);
  const [completedSaleData, setCompletedSaleData] = useState<{
    saleNumber: string;
    creditsToSell: number;
    totalAmount: number;
    userPayments: Array<{
      userName: string;
      amount: number;
    }>;
  } | null>(null);

  // Fetch available credits on mount
  useEffect(() => {
    const fetchAvailableCredits = async () => {
      try {
        const response = await creditSalesApi.getAvailableCredits();
        const data = response.data || response;
        if (data && data.totalAvailable) {
          setTotalAvailableCredits(data.totalAvailable);
        }
      } catch (error) {
        console.error("Error fetching available credits:", error);
      }
    };
    fetchAvailableCredits();
  }, []);

  // Mock allocation preview data
  const mockAllocationData: AllocationItem[] = [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "creditsToSell" || name === "pricePerCredit"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handlePreviewAllocation = async () => {
    setPreviewLoading(true);
    try {
      const response = await creditSalesApi.previewSaleAllocation(
        formData.creditsToSell,
      );

      // The API already returns response.data, so response itself is the data object
      // Backend structure: { success, message, data: { totalCreditsFound, creditsNeeded, creditsShortfall, allocations, canProceed } }
      const apiData = response.data || response;

      if (apiData && apiData.allocations) {
        // Transform backend allocation to match frontend structure
        const transformedAllocations = apiData.allocations.map(
          (alloc: any) => ({
            userName: `${alloc.user.firstName} ${alloc.user.lastName}`,
            workspaceId: alloc.workspaceId,
            sector: "N/A", // Backend doesn't provide sector in allocation
            creditsAvailable: alloc.totalCredits - alloc.previouslySold,
            creditsTaken: alloc.creditsTaken,
            previouslySold: alloc.previouslySold,
            remainingAfter: alloc.remainingAfterSale,
            amountOwed: alloc.creditsTaken * formData.pricePerCredit,
          }),
        );

        setAllocation(transformedAllocations);

        // Show error if insufficient credits
        if (!apiData.canProceed) {
          toast.error(
            `Insufficient credits! Short by ${apiData.creditsShortfall} credits`,
          );
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to preview allocation",
      );
      console.error("Error previewing allocation:", error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirmSale = () => {
    setConfirmationModalOpen(true);
  };

  const handleExecuteSale = async () => {
    setExecutingSale(true);
    try {
      const response = await creditSalesApi.createSale({
        buyerName: formData.buyerName,
        buyerContact: formData.buyerContact,
        buyerEmail: formData.buyerEmail,
        purpose: formData.purpose,
        creditsToSell: formData.creditsToSell,
        pricePerCredit: formData.pricePerCredit,
      });

      const data = response.data || response;

      // Store the completed sale data before resetting form
      setCompletedSaleData({
        saleNumber: data.sale?.saleNumber || `SALE-${Date.now()}`,
        creditsToSell: data.summary?.totalCredits || formData.creditsToSell,
        totalAmount:
          data.summary?.totalAmount ||
          formData.creditsToSell * formData.pricePerCredit,
        userPayments: data.userPayments || [],
      });

      setGeneratedSaleNumber(data.sale?.saleNumber || `SALE-${Date.now()}`);
      toast.success("Sale created successfully");
      setSuccessModalOpen(true);
      setConfirmationModalOpen(false);

      // Reset form
      setStep(1);
      setFormData({
        buyerName: "",
        buyerContact: "",
        buyerEmail: "",
        purpose: "",
        creditsToSell: 0,
        pricePerCredit: 210,
      });
      setAllocation([]);
      setConfirmCheckbox(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create sale");
      console.error("Error creating sale:", error);
    } finally {
      setExecutingSale(false);
    }
  };

  const totalSaleAmount = formData.creditsToSell * formData.pricePerCredit;
  const creditsTaken = allocation.reduce(
    (sum, item) => sum + item.creditsTaken,
    0,
  );
  const allocationComplete = creditsTaken === formData.creditsToSell;
  const shortfall = formData.creditsToSell - creditsTaken;

  const affectedUsers = new Set(allocation.map((item) => item.userName)).size;
  const affectedWorkspaces = allocation.length;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((num) => (
          <React.Fragment key={num}>
            {num > 1 && (
              <div
                className={`flex-1 h-1 ${
                  step >= num ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= num
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
              }`}
            >
              {num}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Buyer Information */}
      {step === 1 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Step 1: Buyer Information</CardTitle>
            <CardDescription>Enter details about the buyer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerName">Buyer Name *</Label>
                <Input
                  id="buyerName"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  placeholder="Enter buyer name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="buyerContact">Buyer Contact</Label>
                <Input
                  id="buyerContact"
                  name="buyerContact"
                  value={formData.buyerContact}
                  onChange={handleInputChange}
                  placeholder="+250..."
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="buyerEmail">Buyer Email</Label>
                <Input
                  id="buyerEmail"
                  name="buyerEmail"
                  type="email"
                  value={formData.buyerEmail}
                  onChange={handleInputChange}
                  placeholder="buyer@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="purpose">Purpose/Description</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Why are you buying these credits?"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.buyerName}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Credit Amount
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Credit Amount & Pricing */}
      {step === 2 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Step 2: Credit Amount & Pricing</CardTitle>
            <CardDescription>
              Specify how many credits to sell and the price
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="creditsToSell">Credits to Sell *</Label>
                <Input
                  id="creditsToSell"
                  name="creditsToSell"
                  type="number"
                  value={formData.creditsToSell}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  min="0"
                  max={totalAvailableCredits}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max available: {totalAvailableCredits.toLocaleString()}
                </p>
              </div>
              <div>
                <Label htmlFor="pricePerCredit">Price Per Credit (RWF) *</Label>
                <Input
                  id="pricePerCredit"
                  name="pricePerCredit"
                  type="number"
                  value={formData.pricePerCredit}
                  onChange={handleInputChange}
                  placeholder="210"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Sale Preview */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <h4 className="font-semibold">Sale Preview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Credits to Sell
                  </p>
                  <p className="font-semibold">
                    {formData.creditsToSell.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Price Per Credit
                  </p>
                  <p className="font-semibold">
                    RWF{formData.pricePerCredit.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2 border-t pt-3">
                  <p className="text-sm text-muted-foreground">
                    Total Sale Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    RWF
                    {totalSaleAmount.toLocaleString("en-RW", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button
                onClick={() => {
                  handlePreviewAllocation();
                  setStep(3);
                }}
                disabled={
                  formData.creditsToSell <= 0 || formData.pricePerCredit <= 0
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Preview Allocation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview Allocation */}
      {step === 3 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Step 3: Preview Allocation (FIFO)</CardTitle>
            <CardDescription>
              Review which workspaces/users will be affected by this sale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {previewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin mr-2" />
                <span>Generating allocation preview...</span>
              </div>
            ) : (
              <>
                {/* Allocation Table */}
                {allocation.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                          <TableHead>User Name</TableHead>
                          <TableHead>Workspace ID</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead className="text-right">
                            Credits Available
                          </TableHead>
                          <TableHead className="text-right">
                            Credits to Take
                          </TableHead>
                          <TableHead className="text-right">
                            Previously Sold
                          </TableHead>
                          <TableHead className="text-right">
                            Remaining After
                          </TableHead>
                          <TableHead className="text-right">
                            Amount Owed (RWF)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allocation.map((item, idx) => (
                          <TableRow key={idx} className="border-b">
                            <TableCell className="font-medium">
                              {item.userName}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {item.workspaceId}
                            </TableCell>
                            <TableCell className="text-sm">
                              {item.sector.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.creditsAvailable.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {item.creditsTaken.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.previouslySold.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.remainingAfter.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {item.amountOwed.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      No allocation preview generated. Click "Generate Preview"
                      to proceed.
                    </p>
                  </div>
                )}

                {/* Allocation Summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                  <h4 className="font-semibold">Allocation Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Credits Found
                      </p>
                      <p className="font-semibold">
                        {creditsTaken.toLocaleString()} of{" "}
                        {formData.creditsToSell.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {allocationComplete ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              Ready to proceed
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-red-600">
                              Insufficient credits
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {shortfall > 0 && (
                      <div className="col-span-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <AlertCircle className="h-4 w-4 inline mr-2" />
                          Shortfall: {shortfall.toLocaleString()} credits
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-2 pt-4">
                  <Button onClick={() => setStep(2)} variant="outline">
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePreviewAllocation}
                      variant="outline"
                      disabled={previewLoading}
                    >
                      {previewLoading ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Preview"
                      )}
                    </Button>
                    <Button
                      onClick={() => setStep(4)}
                      disabled={!allocationComplete}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next: Review & Confirm
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Step 4: Review & Confirm</CardTitle>
            <CardDescription>
              Final review before executing the sale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sale Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Buyer Name</p>
                <p className="font-semibold">{formData.buyerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits to Sell</p>
                <p className="font-semibold">
                  {formData.creditsToSell.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Price Per Credit
                </p>
                <p className="font-semibold">RWF{formData.pricePerCredit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg text-blue-600">
                  RWF{totalSaleAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Users Affected</p>
                <p className="font-semibold">{affectedUsers}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Workspaces Affected
                </p>
                <p className="font-semibold">{affectedWorkspaces}</p>
              </div>
            </div>

            {/* User Impact Summary */}
            <div className="space-y-3">
              <h4 className="font-semibold">User Impact Summary</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>User Name</TableHead>
                      <TableHead className="text-right">Credits Sold</TableHead>
                      <TableHead className="text-right">
                        Amount to Receive (RWF)
                      </TableHead>
                      <TableHead className="text-center">Workspaces</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(
                      new Map(
                        allocation.map((item) => [
                          item.userName,
                          {
                            userName: item.userName,
                            credits: allocation
                              .filter((i) => i.userName === item.userName)
                              .reduce((sum, i) => sum + i.creditsTaken, 0),
                            amount: allocation
                              .filter((i) => i.userName === item.userName)
                              .reduce((sum, i) => sum + i.amountOwed, 0),
                            workspaces: allocation.filter(
                              (i) => i.userName === item.userName,
                            ).length,
                          },
                        ]),
                      ).values(),
                    ).map((item) => (
                      <TableRow key={item.userName}>
                        <TableCell className="font-medium">
                          {item.userName}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.credits.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{item.workspaces}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button onClick={() => setStep(3)} variant="outline">
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">Preview Again</Button>
                <Button
                  onClick={handleConfirmSale}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Sale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Dialog
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Credit Sale</DialogTitle>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                You are about to sell{" "}
                <span className="font-semibold">
                  {formData.creditsToSell.toLocaleString()}
                </span>{" "}
                credits for{" "}
                <span className="font-semibold">
                  RWF{totalSaleAmount.toLocaleString()}
                </span>{" "}
                affecting <span className="font-semibold">{affectedUsers}</span>{" "}
                users.
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold">
                Sale Number (Auto-generated)
              </p>
              <p className="font-mono text-sm mt-1">SALE-{Date.now()}</p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="confirm"
                checked={confirmCheckbox}
                onCheckedChange={(checked) =>
                  setConfirmCheckbox(checked === true)
                }
              />
              <label htmlFor="confirm" className="text-sm cursor-pointer">
                I confirm this sale details are correct
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              onClick={() => setConfirmationModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExecuteSale}
              disabled={!confirmCheckbox || executingSale}
              className="bg-red-600 hover:bg-red-700"
            >
              {executingSale ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sale Created Successfully</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Sale Number</p>
                <p className="font-mono font-semibold">
                  {completedSaleData?.saleNumber || generatedSaleNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-600">COMPLETED</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Credits Sold
                </p>
                <p className="font-semibold">
                  {completedSaleData?.creditsToSell?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg text-green-600">
                  RWF{completedSaleData?.totalAmount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Affected Users:</p>
              <div className="space-y-1">
                {completedSaleData?.userPayments &&
                completedSaleData.userPayments.length > 0 ? (
                  completedSaleData.userPayments.map((payment, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{payment.userName}</span>
                      <span className="font-semibold">
                        RWF{payment.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No user payment details available
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setSuccessModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
