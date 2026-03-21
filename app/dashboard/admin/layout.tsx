import React from "react";
import { DashboardProvider } from "@/components/dashboard_components/global/dashboard-context";
import { AdminSidebar } from "@/components/dashboard_components/admin/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AdminBreadcrumb from "@/components/dashboard_components/admin/AdminBreadcrumb";
import LanguageSwitcher from "@/components/global/language-switcher";
import ThemeToggle from "@/components/global/theme-toggle";
import NotificationBell from "@/components/dashboard_components/admin/NotificationBell";
import RoleGuard from "@/components/global/RoleGuard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]} fallback="/signin">
      <DashboardProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-2 md:px-4 justify-between bg-background">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 h-4 hidden sm:block"
                />
                <div className="hidden sm:block">
                  <AdminBreadcrumb />
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <NotificationBell />
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 flex flex-col gap-4 p-2 md:p-4 pt-0 mt-4 overflow-x-hidden">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </DashboardProvider>
    </RoleGuard>
  );
}
