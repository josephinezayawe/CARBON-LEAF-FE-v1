"use client";

import { useEffect, useState } from "react";
import PhotoUploader from "@/components/dashboard_components/user/workspace/PhotoUploader";
import UploadSummary from "@/components/dashboard_components/user/workspace/UploadSummary";
import PhotoGallery from "@/components/dashboard_components/user/workspace/PhotoGallery";
import UPIRegistration from "@/components/dashboard_components/user/workspace/UPIRegistration";
import { AssetForm } from "@/components/AssetForm";
import AssetsList, { Asset } from "@/components/AssetForm/AssetsList";
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
import { SectorType, SECTORS, getSectorConfig } from "@/lib/asset-config";

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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    async function getPhotos() {
      const result = await Workspace.get();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const workspaces = result?.data?.data?.workspaces ?? [];

      const transformed: UploadedPhoto[] = workspaces.flatMap(
        (ws: {
          id: string;
          imageAssets?: string[];
          uploadDate?: string;
          userId: string;
        }) =>
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

  const handleCreateAsset = async (payload: Record<string, any>) => {
    // The API already returned the created asset, so we just add it to the list
    const newAsset: Asset = {
      id: payload.id,
      name: payload.name,
      sector: payload.sector as SectorType,
      assetType: payload.assetType,
      description: payload.description,
      location: `${payload.cell}, ${payload.village}, ${payload.district}`,
      createdAt: payload.createdAt || new Date().toISOString(),
      data: payload,
    };

    setAssets([...assets, newAsset]);
    setSelectedAsset(newAsset);
    toast.success(`Asset "${newAsset.name}" created successfully`);
  };

  // Load user assets on mount
  useEffect(() => {
    const loadUserAssets = async () => {
      try {
        const result = await Workspace.getAssets("FARMER");
        if (!result.success) {
          console.error("Failed to load assets:", result.message);
          return;
        }

        const assetsData = Array.isArray(result.data) ? result.data : [];
        
        // Transform API response to Asset interface
        const transformedAssets: Asset[] = assetsData.map((apiAsset: any) => ({
          id: apiAsset.id,
          name: apiAsset.name,
          sector: apiAsset.sector as SectorType,
          assetType: apiAsset.assetType,
          description: apiAsset.description,
          location: `${apiAsset.cell}, ${apiAsset.village}, ${apiAsset.district}`,
          createdAt: apiAsset.createdAt,
          data: apiAsset,
        }));

        setAssets(transformedAssets);
        console.log("Loaded assets:", transformedAssets);
      } catch (error) {
        console.error("Error loading assets:", error);
        toast.error("Failed to load your assets");
      }
    };

    loadUserAssets();
  }, []);
  
  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }
    toast.success("Asset deleted");
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
                  {selectedSector === "FARMER" ? "land parcels" : "assets"} and
                  documentation
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
              <div className="flex items-center gap-2">
                {(() => {
                  const sector = SECTORS.find(
                    (s) => s.value === selectedSector
                  );
                  if (sector) {
                    const Icon = sector.icon;
                    return (
                      <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 invisible" />
                    );
                  }
                  return null;
                })()}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <SelectItem
                    key={sector.value}
                    value={sector.value}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                        <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">
                          {sector.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {sector.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
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
              <div className="space-y-6">
                {/* Create Asset Form */}
                <AssetForm
                  initialSector={selectedSector as SectorType}
                  hideSectorSelector={true}
                  onSubmit={handleCreateAsset}
                />

                {/* Assets List */}
                {assets.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                      Your Assets ({assets.length})
                    </h3>
                    <AssetsList assets={assets} onDelete={handleDeleteAsset} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="upload"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              {(() => {
                const sectorAssets = assets.filter(
                  (a) => a.sector === selectedSector
                );

                return sectorAssets.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No assets created for {selectedSector}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Create an asset in the Create Asset tab first
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <PhotoUploader
                        upiList={sectorAssets.map((a) => a.name)}
                        sector={selectedSector}
                        registeredItems={sectorAssets.map((a) => ({
                          id: a.id,
                          upi: a.name,
                          landName: a.name,
                          registeredAt: a.createdAt,
                        }))}
                        onUploadSuccess={() =>
                          setRefreshGallery((prev) => prev + 1)
                        }
                      />
                    </div>
                    <div>
                      <PhotoGallery
                        sector={selectedSector}
                        refreshTrigger={refreshGallery}
                      />
                    </div>
                  </div>
                );
              })()}
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
