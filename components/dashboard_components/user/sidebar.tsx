"use client";

import React from "react";
import Link from "next/link";
import { useDashboard } from "../global/dashboard-context";
import { LayoutDashboard, Wallet, FolderKanban, BookOpen, BarChart2, Settings, X } from "lucide-react";

const links = [
  { href: "/dashboard/user", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/user/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/user/workspace", label: "Workspace", icon: FolderKanban },
  { href: "/dashboard/user/guidance", label: "Guidance", icon: BookOpen },
  { href: "/dashboard/user/report", label: "Report", icon: BarChart2 },
  { href: "/dashboard/user/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useDashboard();

  return (
    <aside
      className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md border-r transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Header mobile close */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <span className="font-bold text-lg">Menu</span>
        <button onClick={toggleSidebar}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col p-4 gap-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-100 text-gray-700 transition"
          >
            <Icon className="w-5 h-5 text-green-700" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
