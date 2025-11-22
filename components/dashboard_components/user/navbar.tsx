"use client";

import { useDashboard } from "@/context/dashboard-context";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/global/language-switcher";
import ThemeToggle from "@/components/global/theme-toggle";
import UserButton from "@/components/global/user-button";
import Notifications from "@/components/global/notifications";
import Sidebar from "@/components/user/dashboard_components/sidebar";

export default function UserNavbar() {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useDashboard();

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>

        <h1 className="font-bold text-lg">Carbon Leaf</h1>

        <div className="flex items-center gap-4">
          <Notifications />
          <LanguageSwitcher />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={closeSidebar}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
