"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Workspace } from "@/app/api/workspace";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Store,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Coins,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

interface CreditHolding {
  id: string;
  creditsAvailable: number;
  status: string;
}

interface WorkspaceInfo {
  id: string;
  marketplaceListed: boolean;
  marketplaceListedAt: string | null;
  creditHoldings: CreditHolding[];
}

export default function UserMarketplaceTab() {
  const { t } = useLanguage();

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  const loadWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await Workspace.get();
      if (!result.success) {
        toast.error(result.message as string);
        return;
      }

      const workspaces = result?.data?.data?.workspaces ?? [];
      if (workspaces.length > 0) {
        const ws = workspaces[0];
        setWorkspace({
          id: ws.id,
          marketplaceListed: ws.marketplaceListed ?? false,
          marketplaceListedAt: ws.marketplaceListedAt ?? null,
          creditHoldings: (ws.creditHoldings ?? []).filter(
            (h: CreditHolding) =>
              h.status === "ACTIVE" && h.creditsAvailable > 0,
          ),
        });
      }
    } catch (error) {
      console.error("Error loading workspace:", error);
      toast.error(t("marketplace_tab.load_error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const totalAvailableCredits = workspace
    ? workspace.creditHoldings.reduce(
        (sum, h) => sum + Number(h.creditsAvailable),
        0,
      )
    : 0;

  const hasAvailableCredits = totalAvailableCredits > 0;

  const handleToggle = async () => {
    if (!workspace) return;

    setIsToggling(true);
    try {
      const res = await Workspace.toggleMarketplaceListing(workspace.id);
      if (res.success) {
        toast.success(res.message);
        await loadWorkspace();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(t("marketplace_tab.toggle_error"));
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("marketplace_tab.loading")}
        </span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">
          {t("marketplace_tab.no_workspace")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Listing Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t("marketplace_tab.title")}
              </CardTitle>
              <CardDescription>
                {t("marketplace_tab.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Available Credits */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("marketplace_tab.available_credits")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalAvailableCredits.toFixed(2)}
              </p>
            </div>
            {hasAvailableCredits ? (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {t("marketplace_tab.credits_available")}
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-0">
                <XCircle className="w-3.5 h-3.5 mr-1" />
                {t("marketplace_tab.no_credits")}
              </Badge>
            )}
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <Label
                htmlFor="marketplace-toggle"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                {t("marketplace_tab.list_on_marketplace")}
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {hasAvailableCredits
                  ? t("marketplace_tab.toggle_description")
                  : t("marketplace_tab.no_credits_tooltip")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isToggling && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
              <Switch
                id="marketplace-toggle"
                checked={workspace.marketplaceListed}
                onCheckedChange={handleToggle}
                disabled={!hasAvailableCredits || isToggling}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          {/* Status Info */}
          {workspace.marketplaceListed ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300">
                {t("marketplace_tab.listed_active")}
              </span>
              {workspace.marketplaceListedAt && (
                <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 ml-auto">
                  {t("marketplace_tab.listed_since")}{" "}
                  {new Date(workspace.marketplaceListedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <Store className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("marketplace_tab.not_listed")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
