"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/50">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Security Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account security</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Change Password */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium">Change Password</h4>
          </div>

          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label className="text-sm">Current Password</Label>
              <div className="relative">
                <Input 
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="h-11 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">New Password</Label>
              <div className="relative">
                <Input 
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="h-11 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              onClick={handleSave}
              variant="outline" 
              className="h-10"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                twoFactorEnabled 
                  ? "bg-emerald-100 dark:bg-emerald-900/50" 
                  : "bg-gray-100 dark:bg-gray-800"
              )}>
                <Smartphone className={cn(
                  "w-5 h-5",
                  twoFactorEnabled 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-gray-500"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  {twoFactorEnabled ? (
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0">
                      <Check className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-900/30">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Switch 
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <h4 className="font-medium mb-4">Active Sessions</h4>
          <div className="space-y-3">
            {[
              { device: "MacBook Pro", location: "Kigali, Rwanda", current: true },
              { device: "iPhone 14", location: "Kigali, Rwanda", current: false },
            ].map((session, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{session.device}</p>
                    {session.current && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
