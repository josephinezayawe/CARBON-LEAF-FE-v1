import React from "react";
import UserSettings from "@/components/dashboard_components/user/settings/UserSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <UserSettings />
    </div>
  );
}
