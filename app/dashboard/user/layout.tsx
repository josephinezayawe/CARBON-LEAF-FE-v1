import React from "react";
import { DashboardProvider } from "@/components/dashboard_components/global/dashboard-context";
import { AppSidebar } from "@/components/dashboard_components/user/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import DashboardBreadcrumb from "@/components/dashboard_components/user/DashboardBreadcrumb";
import LanguageSwitcher from "@/components/global/language-switcher";
import ThemeToggle from "@/components/global/theme-toggle";
import RoleGuard from "@/components/global/RoleGuard";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["USER"]} fallback="/signin">
      <DashboardProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-2 md:px-4 justify-between bg-background">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 h-4 hidden sm:block"
                />
                <div className="hidden sm:block">
                  <DashboardBreadcrumb />
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
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
