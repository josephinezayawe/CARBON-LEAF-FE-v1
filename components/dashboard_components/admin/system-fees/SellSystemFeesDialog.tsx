"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SystemFeeAPI } from "@/app/api/systemFees.api";
import { toast } from "sonner";

interface SellSystemFeesDialogProps {
  open: boolean;
  onClose: () => void;
  onSaleComplete: () => void;
  availableCredits: number;
}

export default function SellSystemFeesDialog({
  open,
  onClose,
  onSaleComplete,
  availableCredits,
}: SellSystemFeesDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    feeCredits: "",
    pricePerCredit: "",
    buyerName: "",
    buyerCompany: "",
    buyerContact: "",
    buyerEmail: "",
    description: "",
    notes: "",
  });

  const totalRevenue =
    Number(formData.feeCredits) * Number(formData.pricePerCredit) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const feeCredits = Number(formData.feeCredits);
    const pricePerCredit = Number(formData.pricePerCredit);

    if (!feeCredits || !pricePerCredit) {
      toast.error("Please enter fee credits and price per credit");
      return;
    }

    if (feeCredits <= 0 || pricePerCredit <= 0) {
      toast.error("Credits and price must be positive numbers");
      return;
    }

    if (feeCredits > availableCredits) {
      toast.error(
        `Insufficient credits. Available: ${availableCredits.toLocaleString()}`,
      );
      return;
    }

    try {
      setLoading(true);
      const result = await SystemFeeAPI.createSystemFeeSale({
        feeCredits,
        pricePerCredit,
        buyerName: formData.buyerName || undefined,
        buyerCompany: formData.buyerCompany || undefined,
        buyerContact: formData.buyerContact || undefined,
        buyerEmail: formData.buyerEmail || undefined,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
      });

      toast.success(
        `System fee sale created successfully! Sale #${result.saleNumber}`,
      );

      setFormData({
        feeCredits: "",
        pricePerCredit: "",
        buyerName: "",
        buyerCompany: "",
        buyerContact: "",
        buyerEmail: "",
        description: "",
        notes: "",
      });

      onSaleComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create sale");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sell System Fee Credits</DialogTitle>
          <DialogDescription>
            Create a sale for accumulated system fee credits. Available:{" "}
            <span className="font-semibold text-green-600">
              {availableCredits.toLocaleString()} credits
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feeCredits">
                Fee Credits to Sell <span className="text-red-500">*</span>
              </Label>
              <Input
                id="feeCredits"
                type="number"
                step="0.01"
                placeholder="e.g., 100"
                value={formData.feeCredits}
                onChange={(e) =>
                  setFormData({ ...formData, feeCredits: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerCredit">
                Price per Credit (RWF) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pricePerCredit"
                type="number"
                step="0.01"
                placeholder="e.g., 5000"
                value={formData.pricePerCredit}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerCredit: e.target.value })
                }
                required
              />
            </div>
          </div>

          {totalRevenue > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Total Revenue:</span>{" "}
                {totalRevenue.toLocaleString()} RWF
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="buyerName">Buyer Name</Label>
            <Input
              id="buyerName"
              placeholder="John Doe"
              value={formData.buyerName}
              onChange={(e) =>
                setFormData({ ...formData, buyerName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerCompany">Buyer Company</Label>
            <Input
              id="buyerCompany"
              placeholder="Green Energy Ltd"
              value={formData.buyerCompany}
              onChange={(e) =>
                setFormData({ ...formData, buyerCompany: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyerContact">Buyer Contact</Label>
              <Input
                id="buyerContact"
                placeholder="+250 xxx xxx xxx"
                value={formData.buyerContact}
                onChange={(e) =>
                  setFormData({ ...formData, buyerContact: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerEmail">Buyer Email</Label>
              <Input
                id="buyerEmail"
                type="email"
                placeholder="buyer@example.com"
                value={formData.buyerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, buyerEmail: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Purpose/Description</Label>
            <Textarea
              id="description"
              placeholder="Purpose of credit purchase..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Internal notes for this sale..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Create Sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
