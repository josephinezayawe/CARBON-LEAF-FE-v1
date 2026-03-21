"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  useRwandaLocation,
  RwandaLocationState,
} from "@/hooks/useRwandaLocation";
import { useLanguage } from "@/components/global/language-provider";

interface LocationSelectorProps {
  value: Partial<RwandaLocationState>;
  onChange: (field: keyof RwandaLocationState, value: string) => void;
  errors?: Partial<Record<keyof RwandaLocationState, string>>;
  isSubmitted?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
}

export default function LocationSelector({
  value,
  onChange,
  errors = {},
  isSubmitted = false,
  showLabels = true,
  disabled = false,
}: LocationSelectorProps) {
  const { t } = useLanguage();
  const {
    location,
    options,
    setProvince,
    setDistrict,
    setSector,
    setCell,
    setVillage,
    isLoadingOptions,
  } = useRwandaLocation({
    province: value.province,
    district: value.district,
    sector: value.sector,
    cell: value.cell,
    village: value.village,
  });

  React.useEffect(() => {
    const incomingIsEmpty =
      !value.province &&
      !value.district &&
      !value.sector &&
      !value.cell &&
      !value.village;

    const currentHasValues =
      !!location.province ||
      !!location.district ||
      !!location.sector ||
      !!location.cell ||
      !!location.village;

    if (incomingIsEmpty && currentHasValues) {
      setProvince("");
    }
  }, [
    value.province,
    value.district,
    value.sector,
    value.cell,
    value.village,
    location.province,
    location.district,
    location.sector,
    location.cell,
    location.village,
    setProvince,
  ]);

  const handleLocationChange = (
    field: keyof RwandaLocationState,
    val: string,
  ) => {
    if (field === "province") setProvince(val);
    else if (field === "district") setDistrict(val);
    else if (field === "sector") setSector(val);
    else if (field === "cell") setCell(val);
    else if (field === "village") setVillage(val);

    onChange(field, val);
  };

  const renderSelect = (
    field: keyof RwandaLocationState,
    label: string,
    fieldOptions: string[],
    parentField?: keyof RwandaLocationState,
    parentValue?: string,
  ) => {
    // Only check parent if this field has a parent dependency
    const isParentEmpty = parentField
      ? parentValue === "" || !parentValue
      : false;
    const isDisabled = disabled || isParentEmpty || isLoadingOptions;
    const hasError = isSubmitted && errors[field];

    return (
      <div key={field} className="space-y-1">
        {showLabels && (
          <Label htmlFor={field} className="font-medium text-sm">
            {t(`auth.${field}`)}
            <span className="text-red-500 ml-1">*</span>
          </Label>
        )}
        <Select
          value={location[field] || ""}
          onValueChange={(val) => handleLocationChange(field, val)}
          disabled={isDisabled}
        >
          <SelectTrigger
            id={field}
            className={`w-full px-3 py-2 border rounded-lg transition-colors ${
              hasError
                ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                : "border-gray-300 focus:ring-emerald-200 focus:border-emerald-500"
            } bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed relative`}
            disabled={isDisabled}
          >
            <SelectValue
              placeholder={
                isLoadingOptions
                  ? t("general.loading")
                  : isParentEmpty && parentField
                    ? t(`auth.select_${parentField}`)
                    : t(`auth.select_${field}`)
              }
            />
            {isLoadingOptions && (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 absolute right-3" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t(`auth.${field}`)}</SelectLabel>
              {fieldOptions.length > 0 ? (
                fieldOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-gray-400">
                  No options available
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Error Message */}
        {hasError && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors[field]}
          </p>
        )}

        {/* Helper text for disabled state */}
        {isParentEmpty && parentField && !isLoadingOptions && (
          <p className="text-xs text-gray-500">
            {`Select ${t(`auth.${parentField}`)} first to enable this field`}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelect("province", "Province", options.provinces)}

        {renderSelect(
          "district",
          "District",
          options.districts,
          "province",
          location.province,
        )}

        {renderSelect(
          "sector",
          "Sector",
          options.sectors,
          "district",
          location.district,
        )}

        {renderSelect("cell", "Cell", options.cells, "sector", location.sector)}

        {renderSelect(
          "village",
          "Village",
          options.villages,
          "cell",
          location.cell,
        )}
      </div>
    </div>
  );
}
