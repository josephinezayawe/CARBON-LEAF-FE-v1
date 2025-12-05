"use client";

import { useState, useEffect } from "react";
import {
  Trees,
  Car,
  Flame,
  Building2,
  Plus,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/app/api/api";

type SectorOption = "FARMER" | "HYBRID_CAR_OWNER" | "ECO_FRIENDLY_STOVES" | "COMMERCIAL_BUILDING";

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

export default function SectorsManagement() {
  const [userSectors, setUserSectors] = useState<SectorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<SectorOption | null>(null);

  useEffect(() => {
    fetchUserSectors();
  }, []);

  const fetchUserSectors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/user/sectors");
      if (response.data?.sectors && Array.isArray(response.data.sectors)) {
        setUserSectors(response.data.sectors as SectorOption[]);
      } else {
        // Default: show FARMER as added for demo
        setUserSectors(["FARMER"]);
      }
    } catch (error) {
      console.error("Failed to fetch sectors:", error);
      // Default: show FARMER as added for demo
      setUserSectors(["FARMER"]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSector = async (sectorOption: SectorOption) => {
    setAddingId(sectorOption);
    try {
      const sectorConfig = SECTORS.find((s) => s.option === sectorOption);
      const response = await api.post("/api/user/sectors", {
        sector: sectorConfig?.value,
      });

      if (response.data?.success) {
        setUserSectors([...userSectors, sectorOption]);
        toast.success(`${sectorConfig?.label} added successfully`);
      } else {
        toast.error(response.data?.message || "Failed to add sector");
      }
    } catch (error) {
      console.error("Failed to add sector:", error);
      toast.error("Failed to add sector. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  const availableSectors = SECTORS.filter(
    (sector) => !userSectors.includes(sector.option)
  );

  const currentUserSectors = SECTORS.filter((sector) =>
    userSectors.includes(sector.option)
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <Trees className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Sectors Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage the sectors you support and add new workspaces
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Your Sectors Section */}
        {currentUserSectors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-50">
                Your Sectors
              </h4>
              <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                {currentUserSectors.length}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {currentUserSectors.map((sector) => {
                const Icon = sector.icon;
                return (
                  <div
                    key={sector.option}
                    className={`relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${sector.color.bg} ${sector.color.bgDark} transition-all`}
                  >
                    <div className="absolute top-3 right-3">
                      <div className={`p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                        <Check className={`w-4 h-4 ${sector.color.icon} ${sector.color.iconDark}`} />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pr-8">
                      <div className={`p-2.5 rounded-lg bg-white/60 dark:bg-gray-800/60`}>
                        <Icon className={`w-5 h-5 ${sector.color.icon} ${sector.color.iconDark}`} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-gray-50">
                          {sector.label}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {sector.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Sectors Section */}
        {availableSectors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-50">
                Available Sectors
              </h4>
              <Badge variant="outline">{availableSectors.length}</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading sectors...</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {availableSectors.map((sector) => {
                  const Icon = sector.icon;
                  const isAdding = addingId === sector.option;

                  return (
                    <button
                      key={sector.option}
                      onClick={() => handleAddSector(sector.option)}
                      disabled={isAdding}
                      className={`relative p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all group cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-50">
                            {sector.label}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {sector.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium whitespace-nowrap">
                          {isAdding ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              Add
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* All Added Message */}
        {availableSectors.length === 0 && !loading && (
          <div className="py-8 text-center rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-3">
              <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-emerald-900 dark:text-emerald-100 font-medium">
              You support all available sectors
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-200 mt-1">
              Great work! You are actively managing all sector categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
