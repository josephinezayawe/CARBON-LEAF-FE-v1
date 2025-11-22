"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// -------------------------
// Dashboard Context Types
// -------------------------
interface DashboardContextType {
  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;

  language: "en" | "fr" | "rw";
  setLanguage: (l: "en" | "fr" | "rw") => void;

  notifications: Array<{ id: string; message: string; read: boolean }>;
  addNotification: (msg: string) => void;
  markNotificationRead: (id: string) => void;

  // Wallet data
  walletBalance: number;
  setWalletBalance: (v: number) => void;

  // Land + uploads
  landUPIs: string[];
  addUPI: (upi: string) => void;

  uploads: Array<{ id: string; upi: string; image: string; createdAt: string }>;
  addUpload: (data: { upi: string; image: string }) => void;

  // Credit stats
  credits: number;
  setCredits: (v: number) => void;
}

// -------------------------
// Create Context
// -------------------------
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// -------------------------
// Provider Wrapper
// -------------------------
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"en" | "fr" | "rw">("en");

  const [notifications, setNotifications] = useState<DashboardContextType["notifications"]>([]);

  const [walletBalance, setWalletBalance] = useState(0);

  const [landUPIs, setLandUPIs] = useState<string[]>([]);

  const [uploads, setUploads] = useState<DashboardContextType["uploads"]>([]);

  const [credits, setCredits] = useState(0);

  // ---------------------
  // Methods
  // ---------------------
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now().toString(), message, read: false },
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addUPI = (upi: string) => {
    if (!landUPIs.includes(upi)) setLandUPIs((prev) => [...prev, upi]);
  };

  const addUpload = (data: { upi: string; image: string }) => {
    setUploads((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        upi: data.upi,
        image: data.image,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <DashboardContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        theme,
        setTheme,
        language,
        setLanguage,
        notifications,
        addNotification,
        markNotificationRead,
        walletBalance,
        setWalletBalance,
        landUPIs,
        addUPI,
        uploads,
        addUpload,
        credits,
        setCredits,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// -------------------------
// Consumption Hook
// -------------------------
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
