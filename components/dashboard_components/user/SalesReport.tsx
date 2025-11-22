"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const data = [
  { month: "Jan", sales: 120 },
  { month: "Feb", sales: 180 },
  { month: "Mar", sales: 90 },
  { month: "Apr", sales: 200 },
  { month: "May", sales: 160 },
  { month: "Jun", sales: 210 },
];

export default function SalesReport() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">Sales Report</CardTitle>
        <BarChart3 className="w-5 h-5 text-green-700" />
      </CardHeader>

      <CardContent className="pt-6">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} dot={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
