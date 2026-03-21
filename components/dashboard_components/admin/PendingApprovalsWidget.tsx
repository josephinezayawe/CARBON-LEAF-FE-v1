"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { getAllSubmissions } from "@/app/api/submissionsandReview.api";
import { useRouter } from "next/navigation";

interface PendingApproval {
  id: string;
  userName: string;
  sector: string;
  creditsRequested: number;
  submittedDate: string;
  status: "pending" | "verification" | "documents";
}

export default function PendingApprovalsWidget() {
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await getAllSubmissions();
        const data = response.data || response;
        if (Array.isArray(data)) {
          // Filter for pending submissions and take the first 5
          const pending = data
            .filter((s: any) => s.status === "PENDING_ANALYSIS")
            .slice(0, 5);
          setPendingApprovals(pending);
        }
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingApprovals();
  }, []);

  const getSectorLabel = (sector: string) => {
    return t(`admin.${sector}`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "documents":
        return t("admin.approval_status_documents");
      case "verification":
        return t("admin.approval_status_verification");
      case "pending":
        return t("admin.approval_status_pending");
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "documents":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "verification":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "documents":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
      case "verification":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
      case "pending":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              {t("admin.pending_approvals")}
            </CardTitle>
            <CardDescription className="mt-2">
              {pendingApprovals.length}{" "}
              {t("admin.requests_awaiting_verification")}
            </CardDescription>
          </div>
          <Badge
            variant="destructive"
            className="text-lg h-8 w-8 flex items-center justify-center p-0"
          >
            {pendingApprovals.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : pendingApprovals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No pending approvals</p>
          </div>
        ) : (
          <>
            {pendingApprovals.slice(0, 3).map((approval: any) => (
              <div
                key={approval.workspaceId}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <p className="font-medium text-sm truncate">
                        {approval.userName}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getSectorLabel(approval.sector)} •{" "}
                      {new Date(approval.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    Pending
                  </Badge>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full text-sm mt-2"
              onClick={() => router.push("/dashboard/admin/submissions")}
            >
              {t("admin.view_all_requests")} ({pendingApprovals.length})
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
