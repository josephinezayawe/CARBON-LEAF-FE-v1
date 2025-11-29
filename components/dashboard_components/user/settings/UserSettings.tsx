"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Languages, Sun, Moon, Percent, Bell, Globe, Palette, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingItem({ icon, label, description, children }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <p className="font-medium text-sm">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function UserSettings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [language, setLanguage] = useState("english");

  return (
    <div className="space-y-6">
      {/* Preferences */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Preferences</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
          </div>
        </div>

        <div className="px-6 divide-y divide-gray-100 dark:divide-gray-800">
          {/* Theme */}
          <SettingItem
            icon={theme === "dark" ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
            label="Theme"
            description="Switch between light and dark mode"
          >
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </SettingItem>

          {/* Language */}
          <SettingItem
            icon={<Languages className="w-4 h-4 text-blue-500" />}
            label="Language"
            description="Select your preferred language"
          >
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>

          {/* Notifications */}
          <SettingItem
            icon={<Bell className="w-4 h-4 text-emerald-500" />}
            label="Notifications"
            description="Receive push notifications"
          >
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </SettingItem>

          {/* Sounds */}
          <SettingItem
            icon={<Volume2 className="w-4 h-4 text-pink-500" />}
            label="Sound Effects"
            description="Play sounds for actions"
          >
            <Switch
              checked={sounds}
              onCheckedChange={setSounds}
            />
          </SettingItem>
        </div>
      </div>

      {/* System Fees */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
              <Percent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">System Fees</h3>
              <p className="text-sm text-muted-foreground">Platform charges</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: "Platform Service Fee", value: "2.5%", color: "text-blue-600 dark:text-blue-400" },
            { label: "Withdrawal Fee", value: "1.0%", color: "text-amber-600 dark:text-amber-400" },
            { label: "Credit Sale Fee", value: "0.5%", color: "text-emerald-600 dark:text-emerald-400" },
          ].map((fee, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
            >
              <span className="text-sm font-medium">{fee.label}</span>
              <span className={cn("font-bold", fee.color)}>{fee.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">App information</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Build</span>
            <span className="font-medium">2025.01.15</span>
          </div>
        </div>
      </div>
    </div>
  );
}
