"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function SellCredits() {
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
        <CardTitle className="text-lg font-semibold">Sell Credits</CardTitle>
        <DollarSign className="w-5 h-5 text-green-700" />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSell} className="space-y-5">
          {/* Select Credit ID */}
          <div className="space-y-2">
            <Label>Select Credit</Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose credit ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRD-001">CRD-001 (120 credits)</SelectItem>
                <SelectItem value="CRD-003">CRD-003 (242 credits)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div>
            <Label>Amount to Sell</Label>
            <Input type="number" min="1" placeholder="Enter amount" required />
          </div>

          {/* Price */}
          <div>
            <Label>Price per Credit (RWF)</Label>
            <Input type="number" min="1" placeholder="e.g., 200" required />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sell Credits"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
