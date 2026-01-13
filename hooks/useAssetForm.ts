/**
 * useAssetForm Hook
 * Manages asset form state, validation, and payload building
 */

import { useState, useCallback, useEffect } from "react";
import {
  SectorType,
  getFieldsForSector,
  getFieldNamesForSector,
  ASSET_CONFIG,
  SECTOR_AUTO_VALUES,
} from "@/lib/asset-config";

export interface FormErrors {
  [key: string]: string;
}

export interface AssetFormState {
  [key: string]: any;
}

interface UseAssetFormReturn {
  sector: SectorType;
  setSector: (sector: SectorType) => void;
  formData: AssetFormState;
  setFormData: (data: AssetFormState) => void;
  updateField: (fieldName: string, value: any) => void;
  errors: FormErrors;
  validate: () => boolean;
  clearErrors: () => void;
  resetForm: () => void;
  getVisibleFields: () => typeof ASSET_CONFIG.commonFields;
  buildPayload: () => AssetFormState | null;
  isValid: boolean;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
}

const INITIAL_FORM_STATE: AssetFormState = {
  name: "",
  description: "",
  province: "",
  district: "",
  sectorArea: "",
  cell: "",
  village: "",
  landUPI: "",
  carPlate: "",
  carSerialNumber: "",
  stoveSerialNumber: "",
  buildingReg: "",
};

export function useAssetForm(defaultSector: SectorType): UseAssetFormReturn {
  const [sector, setSectorState] = useState<SectorType>(defaultSector);
  const [formData, setFormData] = useState<AssetFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handle sector change
   * Clears non-visible fields and errors when sector changes
   */
  const setSector = useCallback((newSector: SectorType) => {
    setSectorState((prevSector) => {
      if (newSector !== prevSector) {
        // Get field names for new sector
        const newVisibleFieldNames = getFieldNamesForSector(newSector);
        
        // Clear form data for fields not visible in new sector
        setFormData((prev) => {
          const updated = { ...prev };
          
          // List of all possible optional fields
          const allOptionalFields = ["landUPI", "carPlate", "carSerialNumber", "stoveSerialNumber", "buildingReg"];
          
          // Clear fields that won't be visible
          allOptionalFields.forEach((field) => {
            if (!newVisibleFieldNames.includes(field)) {
              updated[field] = "";
            }
          });
          
          return updated;
        });
        
        setErrors({});
      }
      
      return newSector;
    });
  }, []);

  /**
   * Update a single field
   */
  const updateField = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Validate form based on sector
   * Only validates fields visible for the current sector
   */
  const validate = useCallback((): boolean => {
    const fields = getFieldsForSector(sector);
    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        if (!value || value.trim() === "") {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [sector, formData]);

  /**
   * Get visible fields for current sector
   */
  const getVisibleFields = useCallback(() => {
    return getFieldsForSector(sector);
  }, [sector]);

  /**
   * Build API payload
   * Only includes fields relevant to the selected sector (no unrelated empty fields)
   */
  const buildPayload = useCallback((): AssetFormState | null => {
    if (!validate()) {
      return null;
    }

    const visibleFieldNames = getFieldNamesForSector(sector);
    const payload: AssetFormState = {
      // Auto-set fields
      sector,
      assetType: SECTOR_AUTO_VALUES[sector].assetType,
    };

    // Add ONLY visible fields for this sector from form data
    // This ensures unrelated fields (like carPlate for FARMER) are NOT sent
    visibleFieldNames.forEach((fieldName) => {
      const value = formData[fieldName];
      // Only add field if it has a value, or if it's a required field (always include required fields)
      if (value && value.trim && value.trim() !== "") {
        payload[fieldName] = value;
      } else {
        // For required common fields, always include (even if empty, validation will catch it)
        const field = getFieldsForSector(sector).find(f => f.name === fieldName);
        if (field && field.required) {
          payload[fieldName] = value || "";
        }
      }
    });

    return payload;
  }, [sector, formData, validate]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitted(false);
    setSectorState(defaultSector);
  }, [defaultSector]);

  return {
    sector,
    setSector,
    formData,
    setFormData,
    updateField,
    errors,
    validate,
    clearErrors,
    resetForm,
    getVisibleFields,
    buildPayload,
    isValid: Object.keys(errors).length === 0,
    isSubmitted,
    setIsSubmitted,
  };
}
