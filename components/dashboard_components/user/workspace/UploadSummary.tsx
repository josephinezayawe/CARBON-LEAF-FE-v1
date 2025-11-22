"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Files, MapPin, Image as ImageIcon } from "lucide-react";

export default function UploadSummary({
  totalUPIs = 0,
  totalPhotos = 0,
}: {
  totalUPIs?: number;
  totalPhotos?: number;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Workspace Summary</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Total UPIs */}
          <div className="border rounded-xl p-4 shadow-sm flex flex-col items-center bg-white">
            <MapPin className="w-7 h-7 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{totalUPIs}</p>
            <p className="text-sm text-gray-600">Registered UPIs</p>
          </div>

          {/* Total Photos Uploaded */}
          <div className="border rounded-xl p-4 shadow-sm flex flex-col items-center bg-white">
            <ImageIcon className="w-7 h-7 text-green-600 mb-2" />
            <p className="text-2xl font-bold">{totalPhotos}</p>
            <p className="text-sm text-gray-600">Uploaded Photos</p>
          </div>

          {/* Placeholder for Future Stats */}
          <div className="border rounded-xl p-4 shadow-sm flex flex-col items-center bg-white">
            <Files className="w-7 h-7 text-orange-600 mb-2" />
            <p className="text-2xl font-bold">Soon</p>
            <p className="text-sm text-gray-600">More Metrics</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
