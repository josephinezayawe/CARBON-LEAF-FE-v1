"use client";

import React, { useEffect } from "react";
import { useAssetForm } from "@/hooks/useAssetForm";
import { SectorType } from "@/lib/asset-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SectorSelector from "./SectorSelector";
import FormFields from "./FormFields";

interface AssetFormProps {
  initialSector?: SectorType;
  onSubmit?: (payload: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
  hideSectorSelector?: boolean;
}

export default function AssetForm({
  initialSector = "FARMER",
  onSubmit,
  isLoading = false,
  hideSectorSelector = false,
}: AssetFormProps) {
  const form = useAssetForm(initialSector);
  const [submitting, setSubmitting] = React.useState(false);

  // Sync sector when initialSector prop changes
  useEffect(() => {
    if (initialSector !== form.sector) {
      form.setSector(initialSector);
    }
  }, [initialSector, form.sector, form.setSector]);

  const handleSectorChange = (newSector: SectorType) => {
    form.setSector(newSector);
    toast.info(`Switched to ${newSector}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.setIsSubmitted(true);

    if (!form.validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = form.buildPayload();
    if (!payload) {
      toast.error("Failed to build form payload");
      return;
    }

    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(payload);
        toast.success("Asset created successfully");
        form.resetForm();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl" suppressHydrationWarning>
      <Card suppressHydrationWarning>
        <CardHeader>
          <CardTitle>Create Asset</CardTitle>
          <CardDescription>
            Register a new asset for carbon credit tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sector Selection - optional */}
            {!hideSectorSelector && (
              <SectorSelector 
                sector={form.sector} 
                onSectorChange={handleSectorChange}
              />
            )}

            {/* Form Fields */}
            <FormFields
              sector={form.sector}
              formData={form.formData}
              errors={form.errors}
              onUpdateField={form.updateField}
              isSubmitted={form.isSubmitted}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={form.resetForm}
                disabled={submitting || isLoading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={submitting || isLoading}
              >
                {submitting || isLoading ? "Creating..." : "Create Asset"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
