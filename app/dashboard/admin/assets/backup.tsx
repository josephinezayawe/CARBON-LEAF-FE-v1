"use client";

import React, { useState, useEffect } from "react";
// Added approveAsset to the import list
import { getAllSystemAssets, approveAsset } from "@/app/api/assets.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Asset {
  id: string;
  assetId: string;
  name: string;
  type: "Vehicle" | "Stove" | "Land" | "Building";
  sector: string;
  owner: string;
  location: string;
  verificationStatus: "Verified" | "Unverified";
  isActive: boolean;
  totalCreditsEarned: number;
  totalFeeDeducted: number;
  netCredits: number;
  createdDate: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [verifyConfirmOpen, setVerifyConfirmOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSystemAssets(
        selectedSector === "all" ? "" : selectedSector
      );
      const rawData = response.data?.data || response.data || [];

      const mappedAssets: Asset[] = rawData.map((item: any) => {
        let identifier = "N/A";
        const sector = item.sector || "";
        const type = item.assetType || "";

        if (sector === "FARMER" || type === "LAND") {
          identifier = `landupi: ${item.landUPI || "N/A"}`;
        } else if (sector === "HYBRID_CAR_OWNER" || type === "VEHICLE") {
          identifier = `carplate: ${
            item.carplate || "N/A"
          }, car serialnumber: ${item.carSerialNumber || "N/A"}`;
        } else if (sector === "ECO_FRIENDLY_STOVES" || type === "STOVE") {
          identifier = `stove serialnumber: ${item.stoveSerialNumber || "N/A"}`;
        } else if (sector === "COMMERCIAL_BUILDING" || type === "BUILDING") {
          identifier = `building reg no: ${item.buildingReg || "N/A"}`;
        }

        return {
          id: item.id,
          assetId: identifier,
          name: item.name || "Unnamed Asset",
          type:
            type === "VEHICLE"
              ? "Vehicle"
              : type === "STOVE"
              ? "Stove"
              : type === "LAND"
              ? "Land"
              : "Building",
          sector: sector,
          owner: item.user
            ? `${item.user.firstName} ${item.user.lastName}`
            : "System",
          location: `${item.province || ""}, ${item.district || ""}`,
          verificationStatus: item.verified ? "Verified" : "Unverified",
          isActive: item.isActive,
          totalCreditsEarned: Number(item.totalCreditsEarned) || 0,
          totalFeeDeducted: Number(item.totalFeeDeducted) || 0,
          netCredits: Number(item.totalNetCredits) || 0,
          createdDate: item.createdAt,
        };
      });
      setAssets(mappedAssets);
    } catch (error) {
      toast.error("Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSector]);

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsModalOpen(true);
  };

  const handleVerifyAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setVerifyConfirmOpen(true);
  };

  const confirmVerifyAsset = async () => {
    if (selectedAsset) {
      try {
        // Using the specific approveAsset call mapped to PATCH /api/:assetId/approve
        await approveAsset(selectedAsset.id);
        toast.success("Asset Verified successfully");
        setVerifyConfirmOpen(false);
        fetchData(); // Refresh the list to reflect status change
      } catch (error) {
        toast.error("Verification failed");
      }
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || asset.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "Active" ? asset.isActive : !asset.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Vehicle":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
      case "Stove":
        return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
      case "Land":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
      case "Building":
        return "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSectorLabel = (sector: string) =>
    sector
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Assets Management
          </h1>
          <p className="text-muted-foreground">
            View and verify assets registered in the system
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assets</CardTitle>
              <CardDescription>
                {filteredAssets.length} assets displayed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, owner, or identifier..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  {["all", "Vehicle", "Stove", "Land", "Building"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "all" ? "All Types" : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "all",
                    "FARMER",
                    "HYBRID_CAR_OWNER",
                    "ECO_FRIENDLY_STOVES",
                    "COMMERCIAL_BUILDING",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "all" ? "All Sectors" : getSectorLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {["all", "Active", "Inactive"].map((st) => (
                    <SelectItem key={st} value={st}>
                      {st === "all" ? "All Status" : st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Net Credits</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <Loader2 className="animate-spin mx-auto h-6 w-6" />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset, index) => (
                    <TableRow
                      key={asset.id}
                      className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell className="text-muted-foreground font-medium text-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {asset.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(asset.type)}>
                          {asset.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getSectorLabel(asset.sector)}
                      </TableCell>
                      <TableCell className="text-sm">{asset.owner}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            asset.verificationStatus === "Verified"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {asset.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {asset.netCredits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(asset)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {asset.verificationStatus === "Unverified" && (
                              <DropdownMenuItem
                                className="text-emerald-600 font-medium"
                                onClick={() => handleVerifyAsset(asset)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify Asset
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* VIEW DETAILS MODAL */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 bg-muted/30 p-3 rounded-lg border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Technical Identifiers
                  </p>
                  <p className="font-mono text-sm mt-1 break-all">
                    {selectedAsset.assetId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asset Name</p>
                  <p className="font-semibold">{selectedAsset.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{selectedAsset.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="font-semibold">
                    {getSectorLabel(selectedAsset.sector)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-semibold">{selectedAsset.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedAsset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Date Registered
                  </p>
                  <p className="font-semibold">
                    {new Date(selectedAsset.createdDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VERIFY ALERT DIALOG */}
      <AlertDialog open={verifyConfirmOpen} onOpenChange={setVerifyConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm verification for <strong>{selectedAsset?.name}</strong>.
              This will approve the asset in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVerifyAsset}
              className="bg-emerald-600"
            >
              Verify
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
