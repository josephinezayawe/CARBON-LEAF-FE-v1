"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  History,
  ShoppingCart,
  Recycle,
  Download,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  getTransactions,
  type BuyerPurchase,
  type CreditRetirementRecord,
} from "@/app/api/buyer.api";
import { toast } from "sonner";
import { useLanguage } from "@/components/global/language-provider";
import { format } from "date-fns";

export default function TransactionsPage() {
  const { t } = useLanguage();
  const [purchases, setPurchases] = useState<BuyerPurchase[]>([]);
  const [retirements, setRetirements] = useState<CreditRetirementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasePage, setPurchasePage] = useState(1);
  const [retirementPage, setRetirementPage] = useState(1);
  const [purchaseTotalPages, setPurchaseTotalPages] = useState(1);
  const [retirementTotalPages, setRetirementTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [purchasePage, retirementPage]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const data = await getTransactions(purchasePage, 10);
      setPurchases(data.purchases.data);
      setPurchaseTotalPages(data.purchases.totalPages);
      setRetirements(data.retirements.data);
      setRetirementTotalPages(data.retirements.totalPages);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || t("buyer.transactions_error"),
      );
    } finally {
      setLoading(false);
    }
  }

  const statusColor: Record<string, string> = {
    COMPLETED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    PENDING:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("buyer.transactions_title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("buyer.transactions_subtitle")}
        </p>
      </div>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <ShoppingCart className="size-4" />
            {t("buyer.tab_purchases")}
          </TabsTrigger>
          <TabsTrigger value="retirements" className="flex items-center gap-2">
            <Recycle className="size-4" />
            {t("buyer.tab_retirements")}
          </TabsTrigger>
        </TabsList>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="mt-4">
          {loading ? (
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-muted rounded" />
              </CardContent>
            </Card>
          ) : purchases.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="size-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  {t("buyer.no_purchases")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("buyer.no_purchases_desc")}
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
                        <TableHead>{t("buyer.col_description")}</TableHead>
                        <TableHead className="text-center">
                          {t("buyer.col_quantity")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("buyer.col_price")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("buyer.col_total")}
                        </TableHead>
                        <TableHead>{t("buyer.col_status")}</TableHead>
                        <TableHead>{t("buyer.col_date")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">
                            {p.creditSale.saleNumber}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                            {p.creditSale.description || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {p.quantityPurchased}
                          </TableCell>
                          <TableCell className="text-right">
                            {p.pricePerCredit.toLocaleString()} RWF
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {p.totalAmount.toLocaleString()} RWF
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColor[p.status] || ""}>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(p.createdAt), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {purchases.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">
                          {p.creditSale.saleNumber}
                        </p>
                        <Badge className={statusColor[p.status] || ""}>
                          {p.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            {t("buyer.col_quantity")}
                          </p>
                          <p className="font-medium">{p.quantityPurchased}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs">
                            {t("buyer.col_total")}
                          </p>
                          <p className="font-medium">
                            {p.totalAmount.toLocaleString()} RWF
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(p.createdAt), "MMM d, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Purchase Pagination */}
              {purchaseTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={purchasePage <= 1}
                    onClick={() => setPurchasePage((p) => p - 1)}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {purchasePage} / {purchaseTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={purchasePage >= purchaseTotalPages}
                    onClick={() => setPurchasePage((p) => p + 1)}
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Retirements Tab */}
        <TabsContent value="retirements" className="mt-4">
          {loading ? (
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-muted rounded" />
              </CardContent>
            </Card>
          ) : retirements.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Recycle className="size-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  {t("buyer.no_retirements")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("buyer.no_retirements_desc")}
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
                        <TableHead className="text-center">
                          {t("buyer.col_quantity")}
                        </TableHead>
                        <TableHead>{t("buyer.col_reason")}</TableHead>
                        <TableHead>{t("buyer.col_date")}</TableHead>
                        <TableHead className="text-right">
                          {t("buyer.col_certificate")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {retirements.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">
                            {r.purchase?.creditSale?.saleNumber || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {r.quantityRetired}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {r.retirementReason || "—"}
                          </TableCell>
                          <TableCell>
                            {format(new Date(r.retiredAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            {r.certificateUrl ? (
                              <a
                                href={r.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="ghost">
                                  <Download className="size-3.5 mr-1" />
                                  {t("buyer.download")}
                                </Button>
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {retirements.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">
                          {r.purchase?.creditSale?.saleNumber || "—"}
                        </p>
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                          {r.quantityRetired} {t("buyer.credits")}
                        </Badge>
                      </div>
                      {r.retirementReason && (
                        <p className="text-xs text-muted-foreground">
                          {r.retirementReason}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(r.retiredAt), "MMM d, yyyy")}
                        </p>
                        {r.certificateUrl && (
                          <a
                            href={r.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="ghost">
                              <Download className="size-3.5 mr-1" />
                              {t("buyer.download")}
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Retirement Pagination */}
              {retirementTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={retirementPage <= 1}
                    onClick={() => setRetirementPage((p) => p - 1)}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {retirementPage} / {retirementTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={retirementPage >= retirementTotalPages}
                    onClick={() => setRetirementPage((p) => p + 1)}
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
