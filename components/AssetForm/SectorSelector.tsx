"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectorType } from "@/lib/asset-config";
import { Trees, Car, Flame, Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SectorOption {
  value: SectorType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTOR_OPTIONS: SectorOption[] = [
  {
    value: "FARMER",
    label: "Farmer",
    description: "Agricultural land management",
    icon: Trees,
  },
  {
    value: "HYBRID_CAR_OWNER",
    label: "Hybrid Car Owner",
    description: "Vehicle emissions tracking",
    icon: Car,
  },
  {
    value: "ECO_FRIENDLY_STOVES",
    label: "Eco Friendly Stoves",
    description: "Clean cooking solutions",
    icon: Flame,
  },
  {
    value: "COMMERCIAL_BUILDING",
    label: "Commercial Building",
    description: "Building emissions management",
    icon: Building2,
  },
];

interface SectorSelectorProps {
  sector: SectorType;
  onSectorChange: (sector: SectorType) => void;
}

export default function SectorSelector({
  sector,
  onSectorChange,
}: SectorSelectorProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="sector" className="text-base font-semibold">
        Select Sector
      </Label>
      <Select value={sector} onValueChange={(value) => onSectorChange(value as SectorType)}>
        <SelectTrigger id="sector" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SECTOR_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-gray-500">
                      {option.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">
        The fields below will adjust based on your selected sector.
      </p>
    </div>
  );
}
