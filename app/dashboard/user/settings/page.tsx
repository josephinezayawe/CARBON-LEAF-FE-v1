"use client";

import { Settings, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UserSettings from "@/components/dashboard_components/user/settings/UserSettings";
import ProfileSettings from "@/components/dashboard_components/user/settings/ProfileSettings";
import SecuritySettings from "@/components/dashboard_components/user/settings/SecuritySettings";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800 p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Settings
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base">
                    Manage your account preferences
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Verified Account
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProfileSettings />
          <SecuritySettings />
        </div>
        <div className="space-y-6">
          <UserSettings />
        </div>
      </div>
    </div>
  );
}
