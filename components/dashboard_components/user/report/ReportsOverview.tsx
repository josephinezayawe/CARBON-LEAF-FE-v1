"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, TrendingUp, UploadCloud } from "lucide-react";

const salesData = [
  { date: "2025-01-14", credits: 40, amount: "$120" },
  { date: "2025-01-08", credits: 20, amount: "$60" },
];

const uploadActivity = [
  { date: "2025-01-13", photos: 14, land: "UPI-223-Kigali" },
  { date: "2025-01-02", photos: 8, land: "UPI-145-Musanze" },
];

export default function ReportsOverview() {
  return (
    <div className="space-y-6 w-full">

      {/* Credit Generation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-700" />
            Credit Generation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700">
          <p>Total Credits Earned: <span className="font-semibold">160</span></p>
          <p>Total Credits Sold: <span className="font-semibold">60</span></p>
          <p>Remaining Credits: <span className="font-semibold">100</span></p>
        </CardContent>
      </Card>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Sales History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Credits Sold</TableHead>
                <TableHead>Amount Earned</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {salesData.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.credits}</TableCell>
                  <TableCell>{sale.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-purple-600" />
            Upload Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Photos</TableHead>
                <TableHead>Land (UPI)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {uploadActivity.map((act, index) => (
                <TableRow key={index}>
                  <TableCell>{act.date}</TableCell>
                  <TableCell>{act.photos}</TableCell>
                  <TableCell>{act.land}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Download Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition">
        <Download className="w-4 h-4" />
        Download Full Report
      </button>

    </div>
  );
}
