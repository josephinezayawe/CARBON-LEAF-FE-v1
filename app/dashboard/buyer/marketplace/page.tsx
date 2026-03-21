"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Leaf,
  ShoppingCart,
  Store,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import {
  getMarketplace,
  purchaseCredits,
  type MarketplaceListing,
} from "@/app/api/buyer.api";
import { toast } from "sonner";
import { useLanguage } from "@/components/global/language-provider";
import { format } from "date-fns";

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Purchase flow state
  const [selectedListing, setSelectedListing] =
    useState<MarketplaceListing | null>(null);
  const [step, setStep] = useState(1); // 1: quantity, 2: confirm
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [page]);

  async function fetchListings() {
    try {
      setLoading(true);
      const result = await getMarketplace(page, 12);
      setListings(result.data);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("buyer.marketplace_error"));
    } finally {
      setLoading(false);
    }
  }

  function openPurchaseDialog(listing: MarketplaceListing) {
    setSelectedListing(listing);
    setStep(1);
    setQuantity(1);
  }

  async function handlePurchase() {
    if (!selectedListing) return;
    try {
      setPurchasing(true);
      await purchaseCredits(selectedListing.id, quantity);
      toast.success(t("buyer.purchase_success"));
      setSelectedListing(null);
      fetchListings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("buyer.purchase_error"));
    } finally {
      setPurchasing(false);
    }
  }

  const totalAmount = selectedListing
    ? quantity * selectedListing.pricePerCredit
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("buyer.marketplace_title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("buyer.marketplace_subtitle")}
        </p>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="size-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t("buyer.no_listings")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("buyer.no_listings_desc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="hover:shadow-lg transition-all duration-200 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {listing.saleNumber}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                    >
                      <Leaf className="size-3 mr-1" />
                      {listing.availableQuantity} {t("buyer.available")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sectors */}
                  <div className="flex flex-wrap gap-1.5">
                    {listing.sectors.map((sector) => (
                      <Badge
                        key={sector}
                        variant="secondary"
                        className="text-xs"
                      >
                        {sector.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("buyer.price_per_credit")}
                      </span>
                      <span className="font-semibold">
                        {listing.pricePerCredit.toLocaleString()} RWF
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("buyer.projects")}
                      </span>
                      <span>{listing.projectCount}</span>
                    </div>
                    {listing.soldAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("buyer.listed_on")}
                        </span>
                        <span>
                          {format(new Date(listing.soldAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Purchase button */}
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:shadow-md transition-all"
                    onClick={() => openPurchaseDialog(listing)}
                  >
                    <ShoppingCart className="size-4 mr-2" />
                    {t("buyer.purchase")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Purchase Dialog — Multi-step */}
      <Dialog
        open={!!selectedListing}
        onOpenChange={(open) => {
          if (!open) setSelectedListing(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("buyer.purchase_credits")}</DialogTitle>
            <DialogDescription>
              {selectedListing?.saleNumber} —{" "}
              {selectedListing?.availableQuantity} {t("buyer.available")}
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4 py-4">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="w-8 h-0.5 bg-muted" />
                <div className="size-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("buyer.quantity")}</Label>
                <Input
                  type="number"
                  min={1}
                  max={selectedListing?.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("buyer.max")}: {selectedListing?.availableQuantity}{" "}
                  {t("buyer.credits")}
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("buyer.price_per_credit")}
                  </span>
                  <span>
                    {selectedListing?.pricePerCredit.toLocaleString()} RWF
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t("buyer.total")}</span>
                  <span>{totalAmount.toLocaleString()} RWF</span>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedListing(null)}
                >
                  {t("buyer.cancel")}
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={
                    quantity < 1 ||
                    quantity > (selectedListing?.availableQuantity ?? 0)
                  }
                  onClick={() => setStep(2)}
                >
                  {t("buyer.next")}
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </DialogFooter>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 py-4">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
                  <Check className="size-4" />
                </div>
                <div className="w-8 h-0.5 bg-emerald-600" />
                <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
                  2
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-semibold text-sm">
                  {t("buyer.order_summary")}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("buyer.sale_ref")}
                    </span>
                    <span>{selectedListing?.saleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("buyer.quantity")}
                    </span>
                    <span>
                      {quantity} {t("buyer.credits")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("buyer.price_per_credit")}
                    </span>
                    <span>
                      {selectedListing?.pricePerCredit.toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>{t("buyer.total")}</span>
                    <span className="text-emerald-600">
                      {totalAmount.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="size-4 mr-2" />
                  {t("buyer.back")}
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={purchasing}
                  onClick={handlePurchase}
                >
                  {purchasing ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="size-4 mr-2" />
                  )}
                  {t("buyer.confirm_purchase")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
