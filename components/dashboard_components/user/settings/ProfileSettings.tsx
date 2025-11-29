"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfileSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Profile Information</h3>
            <p className="text-sm text-muted-foreground">Update your personal details</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src="/avatars/shadcn.jpg" alt="Profile" />
              <AvatarFallback className="text-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 rounded-full text-white shadow-lg hover:bg-emerald-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-semibold">John Doe</h4>
            <p className="text-sm text-muted-foreground">john@carbonleaf.com</p>
            <Badge className="mt-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-0">
              Premium Member
            </Badge>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Full Name
            </Label>
            <Input 
              defaultValue="John Doe"
              className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              Email Address
            </Label>
            <Input 
              type="email"
              defaultValue="john@carbonleaf.com"
              className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              Phone Number
            </Label>
            <Input 
              defaultValue="+250 788 123 456"
              className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              Location
            </Label>
            <Input 
              defaultValue="Kigali, Rwanda"
              className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-2">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button variant="outline" className="h-11">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
