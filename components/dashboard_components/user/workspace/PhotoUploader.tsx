"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ImagePlus,
  Trash2,
  Upload,
  CloudUpload,
  X,
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/global/language-provider";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { Workspace } from "@/app/api/workspace";

type Sector =
  | "FARMER"
  | "HYBRID_CAR_OWNER"
  | "ECO_FRIENDLY_STOVES"
  | "COMMERCIAL_BUILDING";

interface RegisteredUPI {
  id: string;
  upi: string;
  landName?: string;
  registeredAt: string;
}

const getSectorConfig = (sector: Sector) => {
  const configs = {
    FARMER: {
      selectionLabel: "Select Land Parcel",
      selectionPlaceholder: "Choose a registered UPI...",
      selectionTooltip: "Choose UPI for photos",
      icon: MapPin,
      emptyMessage: "No UPIs registered",
      selectToEnable: "Select a land parcel to enable",
      readyMessage: "Ready to upload for",
    },
    "HYBRID_CAR_OWNER": {
      selectionLabel: "Select Vehicle",
      selectionPlaceholder: "Choose a registered vehicle...",
      selectionTooltip: "Choose vehicle for photos",
      icon: MapPin,
      emptyMessage: "No vehicles registered",
      selectToEnable: "Select a vehicle to enable",
      readyMessage: "Ready to upload for",
    },
    "ECO_FRIENDLY_STOVES": {
      selectionLabel: "Select Stove",
      selectionPlaceholder: "Choose a registered stove...",
      selectionTooltip: "Choose stove for photos",
      icon: MapPin,
      emptyMessage: "No stoves registered",
      selectToEnable: "Select a stove to enable",
      readyMessage: "Ready to upload for",
    },
    "COMMERCIAL_BUILDING": {
      selectionLabel: "Select Building",
      selectionPlaceholder: "Choose a registered building...",
      selectionTooltip: "Choose building for photos",
      icon: MapPin,
      emptyMessage: "No buildings registered",
      selectToEnable: "Select a building to enable",
      readyMessage: "Ready to upload for",
    },
  };
  return configs[sector];
};

export default function PhotoUploader({
  upiList = [],
  sector = "FARMER",
  registeredItems = [],
  onUploadSuccess,
}: {
  upiList?: string[];
  sector?: Sector;
  registeredItems?: RegisteredUPI[];
  onUploadSuccess?: () => void;
}) {
  const { t } = useLanguage();
  const [selectedUPI, setSelectedUPI] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [account, setAccount] = useState<any>();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setPhotos([...photos, ...newFiles]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!selectedUPI) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setPhotos((prev) => [...prev, ...files]);
    },
    [selectedUPI]
  );

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
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
  console.log(account);

  const handleSubmit = async () => {
    if (!selectedUPI) {
      toast.error("Please select a land parcel");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    photos.forEach((photo) => {
      data.append("images", photo);
    });
    data.append("sector", sector);
    data.append("upi", selectedUPI);

    const result = await Workspace.create(data);
    
    if (result.success) {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }
      toast.success("Photos Uploaded Successfully");
      setPhotos([]);
      setUploadProgress(0);
      onUploadSuccess?.();
    } else {
      toast.error("Photos Upload Failed");
      toast.error(result.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
    
    setIsUploading(false);
  };

  const config = getSectorConfig(sector);

  return (
    <div className="space-y-6">
      {/* Asset Selection */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <Label className="font-medium">{config.selectionLabel}</Label>
            <p className="text-xs text-muted-foreground">
              {config.selectionTooltip}
            </p>
          </div>
        </div>

        <Select onValueChange={setSelectedUPI} value={selectedUPI || undefined}>
          <SelectTrigger className="h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder={config.selectionPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {upiList.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {config.emptyMessage}
              </div>
            ) : (
              upiList.map((upi) => (
                <SelectItem key={upi} value={upi} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {upi}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => selectedUPI && fileInputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
          "flex flex-col items-center justify-center py-12 px-6",
          !selectedUPI && "opacity-50 cursor-not-allowed",
          isDragging
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-gray-50/50 dark:bg-gray-900/50"
        )}
      >
        <input
          ref={fileInputRef}
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={!selectedUPI}
        />

        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            isDragging
              ? "bg-emerald-100 dark:bg-emerald-900/50"
              : "bg-gray-100 dark:bg-gray-800"
          )}
        >
          <CloudUpload
            className={cn(
              "w-8 h-8 transition-colors",
              isDragging
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400"
            )}
          />
        </div>

        <p className="font-semibold text-lg mb-1">
          {isDragging ? t("workspace.drop_here") : t("workspace.drag_drop")}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {t("workspace.or_click")}
        </p>

        <Badge variant="outline" className="text-xs">
          {t("workspace.file_support")}
        </Badge>

        {!selectedUPI && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-4 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {config.selectToEnable}
          </p>
        )}
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t("workspace.selected_photos")}
            </h4>
            <Badge
              variant="secondary"
              className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
            >
              {photos.length}{" "}
              {photos.length === 1
                ? t("workspace.photo_singular")
                : t("workspace.photo_plural")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((file, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(idx);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs text-white/70">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                  {t("workspace.uploading_photos")}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="h-11 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("workspace.uploading")}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t("workspace.submit")} {photos.length}{" "}
                  {photos.length === 1
                    ? t("workspace.photo_singular")
                    : t("workspace.photo_plural")}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setPhotos([])}
              disabled={isUploading}
              className="h-11"
            >
              {t("workspace.clear_all")}
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && selectedUPI && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
          {config.readyMessage}{" "}
          <span className="font-semibold text-foreground">{selectedUPI}</span>
        </div>
      )}
    </div>
  );
}
