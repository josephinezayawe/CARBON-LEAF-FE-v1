"use client";

import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/lib/dataSchemas";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  /** Where to redirect if access is denied. Defaults to "/" */
  fallback?: string;
}

/**
 * Client-side role gate — renders children only when the
 * current user's role is in `allowedRoles`.  Otherwise
 * redirects to `fallback`.
 */
export default function RoleGuard({
  allowedRoles,
  children,
  fallback = "/",
}: RoleGuardProps) {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !allowedRoles.includes(role!)) {
      router.replace(fallback);
    }
  }, [role, loading, allowedRoles, fallback, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
