"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Trees,
  Car,
  Flame,
  Building2,
  Plus,
  Check,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/app/api/api";
import { SettingsAPI } from "@/app/api/settings";

/* ======================= TYPES ======================= */

type SectorOption =
  | "FARMER"
  | "HYBRID_CAR_OWNER"
  | "ECO_FRIENDLY_STOVES"
  | "COMMERCIAL_BUILDING";

type SectorConfig = {
  option: SectorOption;
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    bg: string;
    bgDark: string;
    icon: string;
    iconDark: string;
    badge: string;
    badgeDark: string;
  };
};

type BackendUserSector = {
  id: string;
  userId: string;
  sector: SectorOption;
};

/* ======================= SECTOR CONFIG ======================= */

const SECTORS: SectorConfig[] = [
  {
    option: "FARMER",
    value: "FARMER",
    label: "Farmer",
    description: "Agricultural land management",
    icon: Trees,
    color: {
      bg: "bg-green-50",
      bgDark: "dark:bg-green-900/20",
      icon: "text-green-600",
      iconDark: "dark:text-green-400",
      badge: "bg-green-100 text-green-700",
      badgeDark: "dark:bg-green-900/50 dark:text-green-300",
    },
  },
  {
    option: "HYBRID_CAR_OWNER",
    value: "HYBRID CAR OWNER",
    label: "Hybrid Car Owner",
    description: "Vehicle emissions tracking",
    icon: Car,
    color: {
      bg: "bg-blue-50",
      bgDark: "dark:bg-blue-900/20",
      icon: "text-blue-600",
      iconDark: "dark:text-blue-400",
      badge: "bg-blue-100 text-blue-700",
      badgeDark: "dark:bg-blue-900/50 dark:text-blue-300",
    },
  },
  {
    option: "ECO_FRIENDLY_STOVES",
    value: "ECO FRIENDLY STOVES",
    label: "Eco Friendly Stoves",
    description: "Clean cooking solutions",
    icon: Flame,
    color: {
      bg: "bg-orange-50",
      bgDark: "dark:bg-orange-900/20",
      icon: "text-orange-600",
      iconDark: "dark:text-orange-400",
      badge: "bg-orange-100 text-orange-700",
      badgeDark: "dark:bg-orange-900/50 dark:text-orange-300",
    },
  },
  {
    option: "COMMERCIAL_BUILDING",
    value: "COMMERCIAL BUILDING",
    label: "Commercial Building",
    description: "Building emissions management",
    icon: Building2,
    color: {
      bg: "bg-purple-50",
      bgDark: "dark:bg-purple-900/20",
      icon: "text-purple-600",
      iconDark: "dark:text-purple-400",
      badge: "bg-purple-100 text-purple-700",
      badgeDark: "dark:bg-purple-900/50 dark:text-purple-300",
    },
  },
];

/* ======================= COMPONENT ======================= */

export default function SectorsManagement() {
  const [userSectorKeys, setUserSectorKeys] = useState<SectorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<SectorOption | null>(null);

  /* ======================= FETCH USER SECTORS ======================= */

  useEffect(() => {
    const fetchUserSectors = async () => {
      try {
        setLoading(true);

        const res = await SettingsAPI.getUserSectors();
        const sectorKeys: SectorOption[] = Array.isArray(res.data)
          ? res.data.map((s: BackendUserSector) => s.sector)
          : [];

        setUserSectorKeys(sectorKeys);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load sectors");
        setUserSectorKeys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSectors();
  }, []);

  /* ======================= DERIVED STATE ======================= */

  const currentUserSectors = useMemo(
    () => SECTORS.filter((s) => userSectorKeys.includes(s.option)),
    [userSectorKeys]
  );

  const availableSectors = useMemo(
    () => SECTORS.filter((s) => !userSectorKeys.includes(s.option)),
    [userSectorKeys]
  );

  /* ======================= ADD SECTOR ======================= */

  const handleAddSector = async (sector: SectorOption) => {
    setAddingId(sector);

    try {
      const res = await SettingsAPI.addSectors(sector);

      /**
       * Expected response:
       * { success: true, data: { userSectors: [{ sector: "FARMER" }] } }
       */
      const updatedKeys: SectorOption[] = res.data.userSectors.map(
        (s: BackendUserSector) => s.sector
      );

      setUserSectorKeys(updatedKeys);
      toast.success(res.message || "Sector added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add sector");
    } finally {
      setAddingId(null);
    }
  };

  /* ======================= UI ======================= */

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading sectors...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-6 space-y-8">

        {/* USER SECTORS */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-semibold">Your Sectors</h4>
            <Badge>{currentUserSectors.length}</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {currentUserSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.option}
                  className={`p-4 rounded-xl border ${sector.color.bg} ${sector.color.bgDark}`}
                >
                  <div className="flex gap-3">
                    <Icon className={`w-5 h-5 ${sector.color.icon}`} />
                    <div>
                      <p className="font-medium">{sector.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {sector.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AVAILABLE SECTORS */}
        <section>
          <h4 className="font-semibold mb-4">Available Sectors</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            {availableSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.option}
                  disabled={addingId === sector.option}
                  onClick={() => handleAddSector(sector.option)}
                  className="p-4 border-2 border-dashed rounded-xl text-left hover:border-emerald-500 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium">{sector.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {sector.description}
                      </p>
                    </div>
                    {addingId === sector.option ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
