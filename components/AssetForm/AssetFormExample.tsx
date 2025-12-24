/**
 * AssetForm Usage Example
 * 
 * This component demonstrates how to use the AssetForm in your application.
 * It shows both the simple and advanced usage patterns.
 */

"use client";

import React from "react";
import { AssetForm } from "./index";

/**
 * Simple Usage - Uses all defaults
 * The form handles everything: validation, field visibility, payload building
 */
export function AssetFormSimpleExample() {
  const handleSubmit = async (payload: Record<string, any>) => {
    console.log("Asset created with payload:", payload);
    
    // Example: Send to your API
    // const response = await api.post("/api/assets", payload);
    
    return;
  };

  return (
    <div className="container mx-auto py-8">
      <AssetForm onSubmit={handleSubmit} />
    </div>
  );
}

/**
 * With Initial Sector - Starts with a specific sector
 */
export function AssetFormWithInitialSector() {
  const handleSubmit = async (payload: Record<string, any>) => {
    console.log("Asset created:", payload);
  };

  return (
    <div className="container mx-auto py-8">
      <AssetForm 
        initialSector="HYBRID CAR OWNER"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/**
 * Advanced Usage - Direct hook usage for custom UI
 */
import { useAssetForm } from "@/hooks/useAssetForm";
import { SectorType } from "@/lib/asset-config";

export function AssetFormAdvancedExample() {
  const form = useAssetForm("FARMER");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    // Validate
    if (!form.validate()) {
      console.log("Validation errors:", form.errors);
      return;
    }

    // Build payload
    const payload = form.buildPayload();
    if (!payload) {
      console.error("Failed to build payload");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Send to backend
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create asset");
      
      console.log("Asset created successfully");
      form.resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Advanced Asset Form</h1>
        <p className="text-gray-600">
          This example shows direct hook usage for complete control
        </p>
      </div>

      <form className="space-y-6 max-w-2xl">
        {/* Sector Selection */}
        <div className="space-y-2">
          <label className="block font-semibold">Select Sector</label>
          <select
            value={form.sector}
            onChange={(e) => form.setSector(e.target.value as SectorType)}
            className="w-full border rounded-lg p-2"
          >
            <option value="FARMER">Farmer</option>
            <option value="HYBRID CAR OWNER">Hybrid Car Owner</option>
            <option value="ECO FRIENDLY STOVES">Eco Friendly Stoves</option>
            <option value="COMMERCIAL BUILDING">Commercial Building</option>
          </select>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-4">
          {form.getVisibleFields().map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block font-medium">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={form.formData[field.name] || ""}
                  onChange={(e) =>
                    form.updateField(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  rows={4}
                  className={`w-full border rounded-lg p-2 ${
                    form.errors[field.name]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              ) : (
                <input
                  type={field.type}
                  value={form.formData[field.name] || ""}
                  onChange={(e) =>
                    form.updateField(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  className={`w-full border rounded-lg p-2 ${
                    form.errors[field.name]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              )}

              {field.helperText && (
                <p className="text-sm text-gray-500">{field.helperText}</p>
              )}

              {form.errors[field.name] && (
                <p className="text-sm text-red-500">
                  {form.errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <details className="p-4 bg-gray-100 rounded-lg">
          <summary className="cursor-pointer font-semibold">
            Debug Info
          </summary>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <strong>Current Sector:</strong> {form.sector}
            </p>
            <p>
              <strong>Visible Fields:</strong>{" "}
              {form.getVisibleFields().length}
            </p>
            <p>
              <strong>Has Errors:</strong>{" "}
              {Object.keys(form.errors).length > 0 ? "Yes" : "No"}
            </p>
            <p>
              <strong>Form Valid:</strong>{" "}
              {form.validate() ? "Yes" : "No"}
            </p>
          </div>
        </details>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={form.resetForm}
            disabled={isSubmitting}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Payload Preview */}
      <div className="max-w-2xl p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold mb-2">Payload Preview</h3>
        <pre className="text-xs overflow-auto max-h-48">
          {JSON.stringify(form.buildPayload() || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * Integration Example - Using in a page with other components
 */
export function AssetFormPageIntegration() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create a New Asset
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Register your asset and start earning carbon credits
          </p>
        </div>

        <AssetForm
          initialSector="FARMER"
          onSubmit={async (payload) => {
            console.log("Submitting payload:", payload);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        />
      </div>
    </div>
  );
}
