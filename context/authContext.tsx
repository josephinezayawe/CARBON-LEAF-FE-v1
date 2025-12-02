"use client";

import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { AuthAPI } from "@/app/api/authAPI";

const AuthContext = createContext<any>(null);
import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode; 
}
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const u = await getCurrentUser();
                console.log(u);

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

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
