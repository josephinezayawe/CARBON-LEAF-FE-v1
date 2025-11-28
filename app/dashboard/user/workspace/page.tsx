import React from "react";
import PhotoUploader from "@/components/dashboard_components/user/workspace/PhotoUploader";
import UploadSummary from "@/components/dashboard_components/user/workspace/UploadSummary";

export default function WorkspacePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>
      <UploadSummary totalUPIs={5} totalPhotos={12} />
      <PhotoUploader upiList={["1/23/45/67", "2/34/56/78"]} />
    </div>
  );
}
