"use client";

import { useEffect, useState } from "react";
import PhotoUploader from "@/components/dashboard_components/user/workspace/PhotoUploader";
import UploadSummary from "@/components/dashboard_components/user/workspace/UploadSummary";
import PhotoGallery from "@/components/dashboard_components/user/workspace/PhotoGallery";
import UPIRegistration from "@/components/dashboard_components/user/workspace/UPIRegistration";
import { AssetForm } from "@/components/AssetForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  ImageIcon,
  Upload,
  FolderKanban,
  TrendingUp,
  Trees,
  Car,
  Flame,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Workspace } from "@/app/api/workspace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectorType } from "@/lib/asset-config";

interface RegisteredUPI {
  id: string;
  upi: string;
  landName?: string;
  registeredAt: string;
}

interface UploadedPhoto {
  id: string;
  url: string;
  upi: string;
  uploadedAt: string;
}

// Sector configs moved to lib/asset-config.ts

export default function WorkspacePage() {
  const [selectedSector, setSelectedSector] = useState<SectorType>("FARMER");
  const [registeredUPIs, setRegisteredUPIs] = useState<RegisteredUPI[]>([
    {
      id: "1",
      upi: "1/23/45/67",
      landName: "Farm Plot A",
      registeredAt: "2025-01-15",
    },
    {
      id: "2",
      upi: "2/34/56/78",
      landName: "Forest Land B",
      registeredAt: "2025-02-20",
    },
  ]);

  // FIXED: add setter
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [refreshGallery, setRefreshGallery] = useState(0);

  useEffect(() => {
    async function getPhotos() {
      const result = await Workspace.get();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const workspaces = result?.data?.data?.workspaces ?? [];

      const transformed: UploadedPhoto[] = workspaces.flatMap(
        (ws: { id: string; imageAssets?: string[]; uploadDate?: string; userId: string }) =>
          ws.imageAssets?.map((url: string, index: number) => ({
            id: `${ws.id}-${index}`,
            url,
            uploadedAt: ws.uploadDate ?? "",
            upi: ws.userId,
          })) ?? []
      );

      // FIXED: Proper state update
      setUploadedPhotos(transformed);
    }

    getPhotos();
  }, []);

  const handleAddUPI = (upi: string, landName?: string) => {
    const newUPI: RegisteredUPI = {
      id: Date.now().toString(),
      upi,
      landName,
      registeredAt: new Date().toISOString().split("T")[0],
    };
    setRegisteredUPIs([...registeredUPIs, newUPI]);
  };

  const handleRemoveUPI = (id: string) => {
    setRegisteredUPIs(registeredUPIs.filter((u) => u.id !== id));
  };

  const upiList = registeredUPIs.map((u) => u.upi);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Workspace
                </h1>
                <p className="text-emerald-100 text-sm md:text-base">
                  Manage your{" "}
                  {selectedSector === "FARMER" ? "land parcels" : "assets"}{" "}
                  and documentation
                </p>
              </div>
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1.5 whitespace-nowrap shadow-lg">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Sector Selection Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm py-12 px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Activity Sector
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Select your sector to customize your experience
            </p>
          </div>
          <Select
            value={selectedSector}
            onValueChange={(value) => setSelectedSector(value as SectorType)}
          >
            <SelectTrigger className="w-full sm:w-96 h-16 py-7 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <SelectItem value="FARMER" className="cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <Trees className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">Farmer</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Agricultural land management
                    </span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="HYBRID CAR OWNER" className="cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <Car className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">Hybrid Car Owner</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Vehicle emissions tracking
                    </span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="ECO FRIENDLY STOVES" className="cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <Flame className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">Eco Friendly Stoves</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Clean cooking solutions
                    </span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="COMMERCIAL BUILDING" className="cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">Commercial Building</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Building emissions management
                    </span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <UploadSummary
        totalUPIs={registeredUPIs.length}
        totalPhotos={uploadedPhotos.length}
        sector={selectedSector}
      />

      {/* Main Content Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <Tabs defaultValue="register" className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-4 pt-4">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1.5 text-muted-foreground w-full sm:w-auto">
              <TabsTrigger
                value="register"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Create Asset</span>
                <span className="sm:hidden">Asset</span>
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm gap-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Documents</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Gallery</span>
                <span className="sm:hidden">Photos</span>
                {uploadedPhotos.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                  >
                    {uploadedPhotos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent
              value="register"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <AssetForm
                initialSector={selectedSector as SectorType}
                hideSectorSelector={true}
                onSubmit={async (payload) => {
                  try {
                    // TODO: Replace with actual API call
                    console.log("Asset payload:", payload);
                    toast.success("Asset created successfully");
                    // const response = await Workspace.addAsset(payload);
                  } catch (error) {
                    toast.error(
                      error instanceof Error ? error.message : "Failed to create asset"
                    );
                  }
                }}
              />
            </TabsContent>

            <TabsContent
              value="upload"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <PhotoUploader
                    upiList={upiList}
                    sector={selectedSector}
                    registeredItems={registeredUPIs}
                    onUploadSuccess={() => setRefreshGallery((prev) => prev + 1)}
                  />
                </div>
                <div>
                  <PhotoGallery sector={selectedSector} refreshTrigger={refreshGallery} />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="gallery"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <PhotoGallery />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
