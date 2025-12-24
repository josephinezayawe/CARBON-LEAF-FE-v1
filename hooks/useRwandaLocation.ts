/**
 * Hook for managing Rwanda location cascading state
 * Handles Province → District → Sector → Cell → Village hierarchy
 */

import { useCallback, useEffect, useState } from "react";
import {
  getProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
} from "@/lib/rwanda-data";

export interface RwandaLocationState {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export interface RwandaLocationOptions {
  provinces: string[];
  districts: string[];
  sectors: string[];
  cells: string[];
  villages: string[];
}

export interface UseRwandaLocationReturn {
  location: RwandaLocationState;
  options: RwandaLocationOptions;
  setProvince: (province: string) => void;
  setDistrict: (district: string) => void;
  setSector: (sector: string) => void;
  setCell: (cell: string) => void;
  setVillage: (village: string) => void;
  reset: () => void;
  isLoadingOptions: boolean;
}

export function useRwandaLocation(
  initialLocation?: Partial<RwandaLocationState>
): UseRwandaLocationReturn {
  const [location, setLocation] = useState<RwandaLocationState>({
    province: initialLocation?.province || "",
    district: initialLocation?.district || "",
    sector: initialLocation?.sector || "",
    cell: initialLocation?.cell || "",
    village: initialLocation?.village || "",
  });

  const [options, setOptions] = useState<RwandaLocationOptions>({
    provinces: [],
    districts: [],
    sectors: [],
    cells: [],
    villages: [],
  });

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    setIsLoadingOptions(true);
    const provinces = getProvinces();
    setOptions((prev) => ({
      ...prev,
      provinces,
    }));
    setIsLoadingOptions(false);
  }, []);

  // Load districts when province changes
  useEffect(() => {
    setIsLoadingOptions(true);
    if (location.province) {
      const districts = getDistrictsByProvince(location.province);
      setOptions((prev) => ({
        ...prev,
        districts,
        sectors: [],
        cells: [],
        villages: [],
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        districts: [],
        sectors: [],
        cells: [],
        villages: [],
      }));
    }
    setIsLoadingOptions(false);
  }, [location.province]);

  // Load sectors when district changes
  useEffect(() => {
    setIsLoadingOptions(true);
    if (location.province && location.district) {
      const sectors = getSectorsByDistrict(
        location.province,
        location.district
      );
      setOptions((prev) => ({
        ...prev,
        sectors,
        cells: [],
        villages: [],
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        sectors: [],
        cells: [],
        villages: [],
      }));
    }
    setIsLoadingOptions(false);
  }, [location.province, location.district]);

  // Load cells when sector changes
  useEffect(() => {
    setIsLoadingOptions(true);
    if (location.province && location.district && location.sector) {
      const cells = getCellsBySector(
        location.province,
        location.district,
        location.sector
      );
      setOptions((prev) => ({
        ...prev,
        cells,
        villages: [],
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        cells: [],
        villages: [],
      }));
    }
    setIsLoadingOptions(false);
  }, [location.province, location.district, location.sector]);

  // Load villages when cell changes
  useEffect(() => {
    setIsLoadingOptions(true);
    if (
      location.province &&
      location.district &&
      location.sector &&
      location.cell
    ) {
      const villages = getVillagesByCell(
        location.province,
        location.district,
        location.sector,
        location.cell
      );
      setOptions((prev) => ({
        ...prev,
        villages,
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        villages: [],
      }));
    }
    setIsLoadingOptions(false);
  }, [location.province, location.district, location.sector, location.cell]);

  const setProvince = useCallback((province: string) => {
    setLocation((prev) => ({
      ...prev,
      province,
      district: "",
      sector: "",
      cell: "",
      village: "",
    }));
  }, []);

  const setDistrict = useCallback((district: string) => {
    setLocation((prev) => ({
      ...prev,
      district,
      sector: "",
      cell: "",
      village: "",
    }));
  }, []);

  const setSector = useCallback((sector: string) => {
    setLocation((prev) => ({
      ...prev,
      sector,
      cell: "",
      village: "",
    }));
  }, []);

  const setCell = useCallback((cell: string) => {
    setLocation((prev) => ({
      ...prev,
      cell,
      village: "",
    }));
  }, []);

  const setVillage = useCallback((village: string) => {
    setLocation((prev) => ({
      ...prev,
      village,
    }));
  }, []);

  const reset = useCallback(() => {
    setLocation({
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
    });
  }, []);

  return {
    location,
    options,
    setProvince,
    setDistrict,
    setSector,
    setCell,
    setVillage,
    reset,
    isLoadingOptions,
  };
}
