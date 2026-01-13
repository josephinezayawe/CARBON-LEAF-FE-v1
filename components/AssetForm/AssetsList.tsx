"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, MapPin } from "lucide-react";
import { SectorType } from "@/lib/asset-config";

export interface Asset {
  id: string;
  name: string;
  sector: SectorType;
  assetType: string;
  description: string;
  location: string;
  createdAt: string;
  data: Record<string, any>;
}

interface AssetsListProps {
  assets: Asset[];
  onDelete?: (id: string) => void;
  onSelect?: (asset: Asset) => void;
  isSelectable?: boolean;
}

export default function AssetsList({
  assets,
  onDelete,
  onSelect,
  isSelectable = false,
}: AssetsListProps) {
  if (assets.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No assets created yet</p>
            <p className="text-gray-400 text-xs mt-1">Create one to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSectorColor = (sector: SectorType) => {
    const colors: Record<SectorType, string> = {
      FARMER: "bg-green-100 text-green-800",
      "HYBRID_CAR_OWNER": "bg-blue-100 text-blue-800",
      "ECO_FRIENDLY_STOVES": "bg-orange-100 text-orange-800",
      "COMMERCIAL_BUILDING": "bg-purple-100 text-purple-800",
    };
    return colors[sector] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-3">
      {assets.map((asset) => (
        <Card
          key={asset.id}
          className={`cursor-pointer transition-all ${
            isSelectable ? "hover:border-emerald-500 hover:shadow-md" : ""
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    {asset.name}
                  </h3>
                  <Badge className={getSectorColor(asset.sector)}>
                    {asset.sector}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {asset.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {asset.assetType}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {asset.location}
                  </div>
                  <div>
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isSelectable && onSelect && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelect(asset)}
                  >
                    Select
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(asset.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
