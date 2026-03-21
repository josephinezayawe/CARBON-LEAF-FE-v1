"use client";

import { useAuth } from "@/context/authContext";
import { UserRole } from "@/lib/dataSchemas";

/**
 * Returns the current user's role and helper utilities.
 */
export function useRole() {
  const { role, loading } = useAuth();

  const hasRole = (...allowed: UserRole[]) => {
    if (!role) return false;
    return allowed.includes(role);
  };

  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";
  const isFieldOfficer = role === "FIELD_OFFICER";
  const isVerifier = role === "VERIFIER";
  const isBuyer = role === "BUYER";

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isUser,
    isFieldOfficer,
    isVerifier,
    isBuyer,
  };
}
