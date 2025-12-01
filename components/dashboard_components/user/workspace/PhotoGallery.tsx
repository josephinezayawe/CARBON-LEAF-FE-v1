"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ImageIcon,
  ZoomIn,
  Download,
  Calendar,
  MapPin,
  Grid3X3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/global/language-provider";
import { Workspace } from "@/app/api/workspace";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";

interface PhotoItem {
  id: string;
  url: string;
  uploadedAt: string;
  upi: string;
}

export default function PhotoGallery() {
  const { t } = useLanguage();
  const [filterUPI, setFilterUPI] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [account, setAccount] = useState<any>();

  // Fetch user
  useEffect(() => {
    async function userData() {
      const user = await getCurrentUser();
      if (!user?.id) {
        toast.error("User Not Found");
        return;
      }
      setAccount(user);
    }
    userData();
  }, []);

  // Fetch workspace photos
  useEffect(() => {
    async function getPhotos() {
      if (!account?.id) return;

      const result = await Workspace.get();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const workspaces = result?.data?.data?.workspaces ?? [];

      // Transform and flatten all images from all workspaces
      const transformed: PhotoItem[] = workspaces.flatMap((ws: any) =>
        ws.imageAssets?.map((url: string, index: number) => ({
          id: `${ws.id}-${index}`,
          url,
          uploadedAt: ws.uploadDate ?? "",
          upi: ws.userId,
        })) ?? []
      );

      setPhotos(transformed);
    }

    getPhotos();
  }, [account]);

  const filteredPhotos =
    filterUPI === "all" ? photos : photos.filter((p) => p.upi === filterUPI);

  const upiList = [...new Set(photos.map((p) => p.upi))];

  const openPhoto = (index: number) => {
    setSelectedIndex(index);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;

    if (direction === "prev") {
      setSelectedIndex(
        selectedIndex > 0 ? selectedIndex - 1 : filteredPhotos.length - 1
      );
    } else {
      setSelectedIndex(
        selectedIndex < filteredPhotos.length - 1 ? selectedIndex + 1 : 0
      );
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <ImageIcon className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">{t("workspace.photo_gallery")}</h3>
            <p className="text-xs text-muted-foreground">
              {filteredPhotos.length} photos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md",
                viewMode === "grid" && "bg-white shadow-sm"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode("compact")}
              className={cn(
                "p-2 rounded-md",
                viewMode === "compact" && "bg-white shadow-sm"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>


          <Select onValueChange={setFilterUPI}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by UPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All UPIs</SelectItem>
              {upiList.map((upi, index) => (
                <SelectItem key={index} value={upi}>
                  {upi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
        )}
      >
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "group relative cursor-pointer rounded-xl overflow-hidden border border-gray-200",
              viewMode === "grid" ? "aspect-[4/3]" : "aspect-square"
            )}
            onClick={() => openPhoto(index)}
          >
            <img src={photo.url} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>


      {selectedIndex !== null && filteredPhotos[selectedIndex] && (
        <Dialog open={true} onOpenChange={() => setSelectedIndex(null)}>
          <DialogContent className="max-w-5xl p-0 bg-black/95">
            <DialogTitle></DialogTitle>
            <div className="relative">
              {filteredPhotos.length > 1 && (
                <>
                  {filteredPhotos.length > 1 && (
                    <>
                      <button
                        key="prev"
                        onClick={() => navigatePhoto("prev")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
                      >
                        <ChevronLeft className="w-10 h-10" />
                      </button>

                      <button
                        key="next"
                        onClick={() => navigatePhoto("next")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                      >
                        <ChevronRight className="w-10 h-10" />
                      </button>
                    </>
                  )}

                </>
              )}

              <img
                src={filteredPhotos[selectedIndex].url}
                className="w-full max-h-[85vh] object-contain"
              />

              <div className="p-5 text-white">
                <p>{filteredPhotos[selectedIndex].uploadedAt}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
