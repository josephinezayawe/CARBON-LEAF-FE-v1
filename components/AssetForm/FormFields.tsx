"use client";

import React from "react";
import { getFieldsForSector, SectorType, Field } from "@/lib/asset-config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import LocationSelector from "./LocationSelector";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormFieldsProps {
  sector: SectorType;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onUpdateField: (fieldName: string, value: any) => void;
  isSubmitted?: boolean;
}

interface FieldInputProps {
  field: Field;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  showError?: boolean;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Individual field input component
 */
function FieldInput({ field, value, error, onChange, showError = false }: FieldInputProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  const hasError = showError && error;
  const inputClasses = `w-full px-3 py-2 border rounded-lg transition-colors ${
    hasError
      ? "border-red-500 focus:ring-red-200 focus:border-red-500"
      : "border-gray-300 focus:ring-emerald-200 focus:border-emerald-500"
  } bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2`;

  if (field.type === "textarea") {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.name} className="font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <textarea
          id={field.name}
          value={value || ""}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={4}
          className={`${inputClasses} resize-none`}
        />
        {field.helperText && (
          <p className="text-sm text-gray-500">{field.helperText}</p>
        )}
        {showError && error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label htmlFor={field.name} className="font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={field.name}
        type={field.type}
        value={value || ""}
        onChange={handleChange}
        placeholder={field.placeholder}
        className={inputClasses}
      />
      {field.helperText && (
        <p className="text-sm text-gray-500">{field.helperText}</p>
      )}
      {showError && error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Form fields component - renders common and optional fields for selected sector
 */
export default function FormFields({
  sector,
  formData,
  errors,
  onUpdateField,
  isSubmitted = false,
}: FormFieldsProps) {
  const fields = getFieldsForSector(sector);

  // Separate location fields from other common fields
  const locationFieldNames = ["province", "district", "sectorArea", "cell", "village"];
  const commonAndOptionalFields = fields.filter((f) => !locationFieldNames.includes(f.name));
  
  // Find where sector-specific optional fields start (e.g., landUPI for FARMER)
  const optionalStartIndex = commonAndOptionalFields.findIndex((f) => 
    ["landUPI", "carPlate", "stoveSerialNumber", "buildingReg"].includes(f.name)
  );
  
  const commonFields = optionalStartIndex !== -1 
    ? commonAndOptionalFields.slice(0, optionalStartIndex)
    : commonAndOptionalFields;
  
  const optionalFields = optionalStartIndex !== -1 
    ? commonAndOptionalFields.slice(optionalStartIndex)
    : [];

  return (
    <div className="space-y-6">
      {/* Common Fields Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Basic Information
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            These fields are required for all assets
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonFields.map((field) => (
            <div
              key={field.name}
              className={field.type === "textarea" ? "md:col-span-2" : ""}
            >
              <FieldInput
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={(value) => onUpdateField(field.name, value)}
                showError={isSubmitted}
              />
            </div>
          ))}
        </div>

        {/* Location Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
            Location Information
          </h3>
          
          <LocationSelector
            value={{
              province: (formData.province || "") as string,
              district: (formData.district || "") as string,
              sector: (formData.sectorArea || "") as string,
              cell: (formData.cell || "") as string,
              village: (formData.village || "") as string,
            }}
            onChange={(field, value) => {
              // Map 'sector' from LocationSelector back to 'sectorArea' in form
              const fieldName = field === "sector" ? "sectorArea" : field;
              onUpdateField(fieldName, value);
            }}
            errors={{
              province: errors.province,
              district: errors.district,
              sector: errors.sectorArea,
              cell: errors.cell,
              village: errors.village,
            }}
            isSubmitted={isSubmitted}
            showLabels={true}
          />
        </div>
      </div>

      {/* Sector-Specific Fields Section */}
      {optionalFields.length > 0 && (
        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-emerald-900 dark:text-emerald-50">
              {sector} Details
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-200">
              Information specific to your selected sector
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionalFields.map((field) => (
                <div key={field.name}>
                  <FieldInput
                    field={field}
                    value={formData[field.name]}
                    error={errors[field.name]}
                    onChange={(value) => onUpdateField(field.name, value)}
                    showError={isSubmitted}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
