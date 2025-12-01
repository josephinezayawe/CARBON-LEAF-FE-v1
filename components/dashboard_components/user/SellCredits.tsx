"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function SellCredits() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Credits sold successfully!");
    }, 1200);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">{t("sell.title")}</CardTitle>
        <DollarSign className="w-5 h-5 text-green-700" />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSell} className="space-y-5">
          {/* Select Credit ID */}
          <div className="space-y-2">
            <Label>{t("sell.select_credit")}</Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("sell.placeholder_credit")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRD-001">CRD-001 (120 credits)</SelectItem>
                <SelectItem value="CRD-003">CRD-003 (242 credits)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div>
            <Label>{t("sell.amount")}</Label>
            <Input type="number" min="1" placeholder={t("sell.placeholder_amount")} required />
          </div>

          {/* Price */}
          <div>
            <Label>{t("sell.price")}</Label>
            <Input type="number" min="1" placeholder={t("sell.placeholder_price")} required />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? t("sell.processing") : t("sell.sell_button")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
