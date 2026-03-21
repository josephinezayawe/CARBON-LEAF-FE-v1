"use client";

import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthAPI } from "@/app/api/authAPI";
import { Account, UserRole } from "@/lib/dataSchemas";
import { ReactNode } from "react";

interface AuthContextValue {
  user: Account | null;
  loading: boolean;
  role: UserRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const u = await getCurrentUser();
        if (!u?.id) {
          setUser(null);
        } else {
          setUser(u);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user");
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const signOut = async () => {
    try {
      const res = await AuthAPI.logout();
      toast.success(res.message);
      setUser(null);
      toast.success("Signed out successfully");
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, loading, role, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
