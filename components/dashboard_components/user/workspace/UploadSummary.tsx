"use client";

import { MapPin, Image as ImageIcon, FileCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/global/language-provider";

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  trend?: string;
  gradient: string;
  iconBg: string;
}

function StatCard({
  icon,
  value,
  label,
  trend,
  gradient,
  iconBg,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl p-5 transition-all duration-300",
        "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
        "hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50",
        "hover:-translate-y-0.5"
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-30",
          gradient
        )}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div
            className={cn(
              "inline-flex items-center justify-center w-11 h-11 rounded-xl",
              iconBg
            )}
          >
            {icon}
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>

        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
            <Activity className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

type Sector =
  | "FARMER"
  | "HYBRID CAR OWNER"
  | "ECO FRIENDLY STOVES"
  | "COMMERCIAL BUILDING";

const getSectorLabel = (sector: Sector) => {
  const labels = {
    FARMER: "Registered Land Parcels",
    "HYBRID CAR OWNER": "Registered Vehicles",
    "ECO FRIENDLY STOVES": "Registered Stoves",
    "COMMERCIAL BUILDING": "Registered Buildings",
  };
  return labels[sector];
};

export default function UploadSummary({
  totalUPIs = 0,
  totalPhotos = 0,
  sector = "FARMER",
}: {
  totalUPIs?: number;
  totalPhotos?: number;
  sector?: Sector;
}) {
  const { t } = useLanguage();

  const stats: StatCardProps[] = [
    {
      icon: <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      value: totalUPIs,
      label: getSectorLabel(sector),
      trend: t("workspace.active"),
      gradient: "bg-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
    },
    {
      icon: (
        <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      ),
      value: totalPhotos,
      label: t("workspace.uploaded_photos"),
      gradient: "bg-emerald-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    },
    {
      icon: (
        <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      ),
      value: "100%",
      label: t("workspace.compliance_rate"),
      gradient: "bg-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
