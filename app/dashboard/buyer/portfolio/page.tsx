"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Recycle,
  Download,
  ExternalLink,
  Loader2,
  Leaf,
} from "lucide-react";
import {
  getPortfolio,
  retireCredits,
  type PortfolioItem,
} from "@/app/api/buyer.api";
import { toast } from "sonner";
import { useLanguage } from "@/components/global/language-provider";
import { format } from "date-fns";

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Retire dialog state
  const [retireItem, setRetireItem] = useState<PortfolioItem | null>(null);
  const [retireQuantity, setRetireQuantity] = useState(1);
  const [retireReason, setRetireReason] = useState("");
  const [retiring, setRetiring] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      setLoading(true);
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("buyer.portfolio_error"));
    } finally {
      setLoading(false);
    }
  }

  function openRetireDialog(item: PortfolioItem) {
    setRetireItem(item);
    setRetireQuantity(1);
    setRetireReason("");
  }

  async function handleRetire() {
    if (!retireItem) return;
    try {
      setRetiring(true);
      await retireCredits(
        retireItem.id,
        retireQuantity,
        retireReason || undefined,
      );
      toast.success(t("buyer.retire_success"));
      setRetireItem(null);
      fetchPortfolio();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("buyer.retire_error"));
    } finally {
      setRetiring(false);
    }
  }

  const totalActive = portfolio.reduce((s, p) => s + p.remainingCredits, 0);
  const totalRetired = portfolio.reduce((s, p) => s + p.totalRetired, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("buyer.portfolio_title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("buyer.portfolio_subtitle")}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Leaf className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("buyer.active_credits")}
              </p>
              <p className="text-xl font-bold">{totalActive}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <Recycle className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("buyer.total_retired")}
              </p>
              <p className="text-xl font-bold">{totalRetired}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Briefcase className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("buyer.total_holdings")}
              </p>
              <p className="text-xl font-bold">{portfolio.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Table */}
      {loading ? (
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-48 bg-muted rounded" />
          </CardContent>
        </Card>
      ) : portfolio.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="size-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t("buyer.no_holdings")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("buyer.no_holdings_desc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("buyer.col_sale")}</TableHead>
                    <TableHead>{t("buyer.col_sectors")}</TableHead>
                    <TableHead className="text-center">
                      {t("buyer.col_purchased")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("buyer.col_retired")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("buyer.col_remaining")}
                    </TableHead>
                    <TableHead>{t("buyer.col_date")}</TableHead>
                    <TableHead className="text-right">
                      {t("buyer.col_actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.saleNumber}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.sectors.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantityPurchased}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.totalRetired}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            item.remainingCredits > 0 ? "default" : "secondary"
                          }
                          className={
                            item.remainingCredits > 0
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                              : ""
                          }
                        >
                          {item.remainingCredits}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.purchasedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.remainingCredits > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-600 border-amber-200 hover:bg-amber-50"
                              onClick={() => openRetireDialog(item)}
                            >
                              <Recycle className="size-3.5 mr-1" />
                              {t("buyer.retire")}
                            </Button>
                          )}
                          {item.retirements.length > 0 &&
                            item.retirements[0].certificateUrl && (
                              <a
                                href={item.retirements[0].certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="ghost">
                                  <Download className="size-3.5 mr-1" />
                                  {t("buyer.certificate")}
                                </Button>
                              </a>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {portfolio.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.saleNumber}</p>
                    <Badge
                      variant={
                        item.remainingCredits > 0 ? "default" : "secondary"
                      }
                      className={
                        item.remainingCredits > 0
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : ""
                      }
                    >
                      {item.remainingCredits} {t("buyer.remaining")}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.sectors.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">
                        {t("buyer.col_purchased")}
                      </p>
                      <p className="font-medium">{item.quantityPurchased}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">
                        {t("buyer.col_retired")}
                      </p>
                      <p className="font-medium">{item.totalRetired}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">
                        {t("buyer.col_remaining")}
                      </p>
                      <p className="font-medium">{item.remainingCredits}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {item.remainingCredits > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50"
                        onClick={() => openRetireDialog(item)}
                      >
                        <Recycle className="size-3.5 mr-1" />
                        {t("buyer.retire")}
                      </Button>
                    )}
                    {item.retirements.length > 0 &&
                      item.retirements[0].certificateUrl && (
                        <a
                          href={item.retirements[0].certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="sm" variant="ghost" className="w-full">
                            <Download className="size-3.5 mr-1" />
                            {t("buyer.certificate")}
                          </Button>
                        </a>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Retire Dialog */}
      <Dialog
        open={!!retireItem}
        onOpenChange={(open) => {
          if (!open) setRetireItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("buyer.retire_credits")}</DialogTitle>
            <DialogDescription>
              {retireItem?.saleNumber} — {retireItem?.remainingCredits}{" "}
              {t("buyer.credits")} {t("buyer.available")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("buyer.quantity")}</Label>
              <Input
                type="number"
                min={1}
                max={retireItem?.remainingCredits}
                value={retireQuantity}
                onChange={(e) =>
                  setRetireQuantity(parseInt(e.target.value) || 1)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>{t("buyer.retirement_reason")}</Label>
              <Textarea
                placeholder={t("buyer.retirement_reason_placeholder")}
                value={retireReason}
                onChange={(e) => setRetireReason(e.target.value)}
                maxLength={500}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRetireItem(null)}>
              {t("buyer.cancel")}
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              disabled={
                retiring ||
                retireQuantity < 1 ||
                retireQuantity > (retireItem?.remainingCredits ?? 0)
              }
              onClick={handleRetire}
            >
              {retiring ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Recycle className="size-4 mr-2" />
              )}
              {t("buyer.confirm_retire")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
