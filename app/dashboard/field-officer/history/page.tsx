"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  History,
  MapPin,
  Eye,
  Image as ImageIcon,
  FileText,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getOwnFieldData, type FieldDataEntry } from "@/app/api/fieldData.api";
import { format } from "date-fns";
import { useLanguage } from "@/components/global/language-provider";

const STATUS_BADGE: Record<string, { label: string; variant: string }> = {
  PENDING: {
    label: "Pending",
    variant:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  REVIEWED: {
    label: "Reviewed",
    variant: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  APPROVED: {
    label: "Approved",
    variant:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  REJECTED: {
    label: "Rejected",
    variant: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
};

export default function FieldOfficerHistoryPage() {
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState<FieldDataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<FieldDataEntry | null>(
    null,
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getOwnFieldData();
        setSubmissions(data);
      } catch (error) {
        toast.error("Failed to load submission history");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <History className="h-7 w-7 text-green-600" />
          {t("field_officer.history_title")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1">
          {t("field_officer.history_subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Submissions ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">
                {t("field_officer.no_history")}
              </p>
              <p className="text-sm mt-1">
                {t("field_officer.no_history_desc")}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("field_officer.date")}</TableHead>
                      <TableHead>{t("field_officer.sector")}</TableHead>
                      <TableHead>{t("field_officer.gps")}</TableHead>
                      <TableHead>{t("field_officer.images")}</TableHead>
                      <TableHead>{t("field_officer.status")}</TableHead>
                      <TableHead className="text-right">
                        {t("field_officer.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((entry) => {
                      const statusInfo =
                        STATUS_BADGE[entry.status] ?? STATUS_BADGE.PENDING;
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="text-sm">
                            {format(
                              new Date(entry.createdAt),
                              "MMM dd, yyyy HH:mm",
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {entry.workspace.sector.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            {entry.gpsLat && entry.gpsLng ? (
                              <span className="text-xs text-muted-foreground">
                                {Number(entry.gpsLat).toFixed(4)},{" "}
                                {Number(entry.gpsLng).toFixed(4)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {entry.imageUrls.length} photo
                              {entry.imageUrls.length !== 1 ? "s" : ""}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${statusInfo.variant}`}>
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t("field_officer.view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {submissions.map((entry) => {
                  const statusInfo =
                    STATUS_BADGE[entry.status] ?? STATUS_BADGE.PENDING;
                  return (
                    <div
                      key={entry.id}
                      className="p-4 border rounded-xl bg-muted/20 space-y-3"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {entry.workspace.sector.replace(/_/g, " ")}
                        </span>
                        <Badge className={`text-xs ${statusInfo.variant}`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          {entry.imageUrls.length}
                        </span>
                        {entry.gpsLat && entry.gpsLng && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            GPS
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedEntry}
        onOpenChange={() => setSelectedEntry(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("field_officer.submission_details")}</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              {/* Status & Date */}
              <div className="flex items-center justify-between">
                <Badge
                  className={`${STATUS_BADGE[selectedEntry.status]?.variant}`}
                >
                  {STATUS_BADGE[selectedEntry.status]?.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(
                    new Date(selectedEntry.createdAt),
                    "MMM dd, yyyy · HH:mm",
                  )}
                </span>
              </div>

              {/* Sector */}
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {t("field_officer.sector")}
                </p>
                <p className="text-sm font-medium">
                  {selectedEntry.workspace.sector.replace(/_/g, " ")}
                </p>
              </div>

              {/* GPS */}
              {selectedEntry.gpsLat && selectedEntry.gpsLng && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {t("field_officer.gps_coordinates")}
                  </p>
                  <p className="text-sm">
                    {Number(selectedEntry.gpsLat).toFixed(6)},{" "}
                    {Number(selectedEntry.gpsLng).toFixed(6)}
                  </p>
                </div>
              )}

              {/* Measurements */}
              {selectedEntry.measurements &&
                Object.keys(selectedEntry.measurements).length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-2">
                      {t("field_officer.measurements")}
                    </p>
                    <div className="space-y-1">
                      {Object.entries(
                        selectedEntry.measurements as Record<string, unknown>,
                      ).map(([key, val]) => (
                        <div
                          key={key}
                          className="flex justify-between text-sm p-2 rounded bg-muted/30"
                        >
                          <span className="text-muted-foreground">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Notes */}
              {selectedEntry.notes && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {t("field_officer.notes")}
                  </p>
                  <p className="text-sm bg-muted/30 p-3 rounded-lg mt-1">
                    {selectedEntry.notes}
                  </p>
                </div>
              )}

              {/* Images */}
              {selectedEntry.imageUrls.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    {t("field_officer.photos")} (
                    {selectedEntry.imageUrls.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedEntry.imageUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={url}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
