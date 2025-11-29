"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ImageIcon, ZoomIn, Download, Calendar, MapPin, Grid3X3, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UploadedPhoto {
  id: string;
  url: string;
  upi: string;
  uploadedAt: string;
}

export default function PhotoGallery({
  upiList = [],
  photos = [],
}: {
  upiList?: string[];
  photos?: UploadedPhoto[];
}) {
  const [filterUPI, setFilterUPI] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredPhotos = filterUPI === "all" 
    ? photos 
    : photos.filter((p) => p.upi === filterUPI);

  const navigatePhoto = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
    } else {
      setSelectedIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
            <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Photo Gallery</h3>
            <p className="text-xs text-muted-foreground">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? "photo" : "photos"} 
              {filterUPI !== "all" && ` for ${filterUPI}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" 
                  ? "bg-white dark:bg-gray-700 shadow-sm" 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "compact" 
                  ? "bg-white dark:bg-gray-700 shadow-sm" 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* UPI Filter */}
          <Select value={filterUPI} onValueChange={setFilterUPI}>
            <SelectTrigger className="w-[160px] h-10 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Filter by UPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All UPIs</SelectItem>
              {upiList.map((upi, idx) => (
                <SelectItem key={idx} value={upi}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {upi}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery Content */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No photos yet</h3>
          <p className="text-muted-foreground text-sm text-center max-w-sm">
            {filterUPI !== "all" 
              ? `No photos uploaded for UPI ${filterUPI}. Upload some photos to see them here.`
              : "Upload photos for your registered land parcels to view them here."}
          </p>
          {filterUPI !== "all" && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setFilterUPI("all")}
            >
              View All Photos
            </Button>
          )}
        </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          viewMode === "grid" 
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
            : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
        )}>
          {filteredPhotos.map((photo, index) => (
            <Dialog key={photo.id}>
              <DialogTrigger asChild>
                <div 
                  className={cn(
                    "group relative cursor-pointer rounded-xl overflow-hidden",
                    "border border-gray-200 dark:border-gray-700",
                    "hover:border-emerald-500 dark:hover:border-emerald-500",
                    "hover:shadow-lg hover:shadow-emerald-500/10",
                    "transition-all duration-300",
                    viewMode === "grid" ? "aspect-[4/3]" : "aspect-square"
                  )}
                  onClick={() => setSelectedIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={`Land ${photo.upi}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  {/* Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs backdrop-blur-sm border-0">
                        <MapPin className="w-3 h-3 mr-1" />
                        {photo.upi}
                      </Badge>
                      {viewMode === "grid" && (
                        <span className="text-xs text-white/80 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {photo.uploadedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              
              {/* Lightbox Modal */}
              <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95 border-gray-800">
                <div className="relative">
                  {/* Navigation Arrows */}
                  {filteredPhotos.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigatePhoto("prev");
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigatePhoto("next");
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                  
                  {/* Main Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filteredPhotos[selectedIndex]?.url || photo.url}
                    alt={`Land ${filteredPhotos[selectedIndex]?.upi || photo.upi}`}
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                  
                  {/* Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/80 text-white border-0">
                            <MapPin className="w-3 h-3 mr-1" />
                            {filteredPhotos[selectedIndex]?.upi || photo.upi}
                          </Badge>
                          <span className="text-sm text-white/60">
                            {selectedIndex + 1} of {filteredPhotos.length}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Uploaded: {filteredPhotos[selectedIndex]?.uploadedAt || photo.uploadedAt}
                        </p>
                      </div>
                      
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
