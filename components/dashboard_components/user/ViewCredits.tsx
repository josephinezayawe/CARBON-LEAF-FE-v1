"use client";

import { Leaf } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const getCredits = (t: (key: string) => string) => [
  {
    id: "CRD-001",
    amount: 120,
    status: t("credits.available"),
    date: "2025-01-11",
  },
  {
    id: "CRD-002",
    amount: 75,
    status: t("credits.sold"),
    date: "2025-01-09",
  },
  {
    id: "CRD-003",
    amount: 242,
    status: t("credits.available"),
    date: "2025-01-05",
  },
];

export default function ViewCredits() {
  const { t } = useLanguage();
  const credits = getCredits(t);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{t("credits.my_credits")}</CardTitle>
        <Leaf className="w-5 h-5 text-green-700" />
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-green-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-green-50">
              <TableRow>
                <TableHead>{t("credits.credit_id")}</TableHead>
                <TableHead>{t("credits.amount")}</TableHead>
                <TableHead>{t("general.status")}</TableHead>
                <TableHead>{t("general.date")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {credits.map((credit, index) => (
                <TableRow key={index}>
                  <TableCell>{credit.id}</TableCell>
                  <TableCell>{credit.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        credit.status === t("credits.available")
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {credit.status}
                    </span>
                  </TableCell>
                  <TableCell>{credit.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
