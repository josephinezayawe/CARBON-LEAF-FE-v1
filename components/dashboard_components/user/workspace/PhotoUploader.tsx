"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Trash2, Upload } from "lucide-react";

export default function PhotoUploader({ upiList = [] }: { upiList?: string[] }) {
  const [selectedUPI, setSelectedUPI] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setPhotos([...photos, ...newFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upload Land Photos</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Select UPI */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Select Land UPI</label>
          <Select onValueChange={setSelectedUPI}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose UPI..." />
            </SelectTrigger>
            <SelectContent>
              {upiList.map((upi, idx) => (
                <SelectItem key={idx} value={upi}>
                  {upi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Button */}
        <div className="mt-4">
          <input id="photo-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          <Button
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={() => document.getElementById("photo-upload")?.click()}
            disabled={!selectedUPI}
          >
            <ImagePlus className="w-5 h-5" />
            Upload Photos
          </Button>
          {!selectedUPI && (
            <p className="text-xs text-red-500 mt-1">Select a UPI first.</p>
          )}
        </div>

        {/* Preview Section */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((file, idx) => (
            <div key={idx} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-32 object-cover rounded-md shadow"
              />
              <button
                onClick={() => removePhoto(idx)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {photos.length > 0 && (
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Submit Photos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
