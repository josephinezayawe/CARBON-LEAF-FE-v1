"use client";

import { useState } from "react";
import PhotoUploader from "@/components/dashboard_components/user/workspace/PhotoUploader";
import UploadSummary from "@/components/dashboard_components/user/workspace/UploadSummary";
import PhotoGallery from "@/components/dashboard_components/user/workspace/PhotoGallery";
import UPIRegistration from "@/components/dashboard_components/user/workspace/UPIRegistration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, ImageIcon, Upload, FolderKanban, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [registeredUPIs, setRegisteredUPIs] = useState<RegisteredUPI[]>([
    { id: "1", upi: "1/23/45/67", landName: "Farm Plot A", registeredAt: "2024-01-15" },
    { id: "2", upi: "2/34/56/78", landName: "Forest Land B", registeredAt: "2024-02-20" },
  ]);

  const [uploadedPhotos] = useState<UploadedPhoto[]>([
    { id: "1", url: "/images/uploads/tree1.jpeg", upi: "1/23/45/67", uploadedAt: "2024-03-01" },
    { id: "2", url: "/images/uploads/tree2.png", upi: "1/23/45/67", uploadedAt: "2024-03-02" },
    { id: "3", url: "/images/uploads/tree3.jpg", upi: "2/34/56/78", uploadedAt: "2024-03-05" },
  ]);

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Workspace
                  </h1>
                  <p className="text-emerald-100 text-sm md:text-base">
                    Manage your land parcels and documentation
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1.5">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <UploadSummary totalUPIs={registeredUPIs.length} totalPhotos={uploadedPhotos.length} />

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
                <span className="hidden sm:inline">Register UPI</span>
                <span className="sm:hidden">UPI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="upload" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm gap-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Photos</span>
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
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                    {uploadedPhotos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="register" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <UPIRegistration 
                registeredUPIs={registeredUPIs}
                onAddUPI={handleAddUPI}
                onRemoveUPI={handleRemoveUPI}
              />
            </TabsContent>

            <TabsContent value="upload" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <PhotoUploader upiList={upiList} />
                </div>
                <div>
                  <PhotoGallery upiList={upiList} photos={uploadedPhotos} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <PhotoGallery upiList={upiList} photos={uploadedPhotos} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
