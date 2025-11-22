"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Trash2, Plus } from "lucide-react";

export default function UPIManager() {
  const [upiList, setUpiList] = useState<string[]>([]);
  const [newUPI, setNewUPI] = useState("");

  const addUPI = () => {
    if (!newUPI.trim()) return;
    setUpiList([...upiList, newUPI.trim()]);
    setNewUPI("");
  };

  const removeUPI = (upi: string) => {
    setUpiList(upiList.filter((item) => item !== upi));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Land UPI Manager</CardTitle>
          <MapPin className="w-5 h-5 text-green-700" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Add UPI Form */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter land UPI..."
            value={newUPI}
            onChange={(e) => setNewUPI(e.target.value)}
          />
          <Button onClick={addUPI} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add UPI
          </Button>
        </div>

        {/* UPI List */}
        <div className="mt-6 space-y-3">
          {upiList.length === 0 && (
            <p className="text-gray-500 text-sm italic">No UPIs added yet.</p>
          )}

          {upiList.map((upi, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg"
            >
              <span className="font-medium text-green-800">{upi}</span>
              <button
                onClick={() => removeUPI(upi)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
