"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Languages, Sun, Moon, Percent } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserSettings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="w-full space-y-6">

      {/* System Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 text-xl">
            <Percent className="w-5 h-5" />
            System Fees
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-gray-700">
          <p>Platform Service Fee: <span className="font-semibold">2.5%</span></p>
          <p>Withdrawal Processing Fee: <span className="font-semibold">1%</span></p>
          <p>Credit Sale Fee: <span className="font-semibold">0.5%</span></p>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-700">Preferences</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Theme Switch */}
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {theme === "light" ? <Sun className="w-5 h-5 text-yellow-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
              Theme
            </Label>

            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          {/* Language Selector */}
          <div>
            <Label className="flex items-center gap-2 mb-1">
              <Languages className="w-5 h-5 text-blue-600" />
              Language
            </Label>

            <Select defaultValue="english">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between">
            <Label>Enable Notifications</Label>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
