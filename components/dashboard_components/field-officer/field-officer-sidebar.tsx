"use client";

import {
  BarChart3,
  LogOut,
  ClipboardList,
  MapPin,
  History,
  Leaf,
  Gauge,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/components/global/language-provider";

interface MenuItem {
  titleKey: string;
  url: string;
  icon: typeof BarChart3;
  descriptionKey: string;
}

const menuItems: MenuItem[] = [
  {
    titleKey: "field_officer.sidebar_dashboard",
    url: "/dashboard/field-officer",
    icon: BarChart3,
    descriptionKey: "field_officer.sidebar_overview",
  },
  {
    titleKey: "field_officer.sidebar_submit",
    url: "/dashboard/field-officer/submit",
    icon: MapPin,
    descriptionKey: "field_officer.sidebar_new_submission",
  },
  {
    titleKey: "field_officer.sidebar_baseline",
    url: "/dashboard/field-officer/baseline",
    icon: Gauge,
    descriptionKey: "field_officer.sidebar_baseline_desc",
  },
  {
    titleKey: "field_officer.sidebar_history",
    url: "/dashboard/field-officer/history",
    icon: History,
    descriptionKey: "field_officer.sidebar_past_submissions",
  },
];

export function FieldOfficerSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r-0 overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/80 via-white to-slate-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950/20 -z-10" />
      <div className="absolute inset-0 backdrop-blur-xl -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-slate-300/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-slate-400/15 to-green-300/10 rounded-full blur-2xl -z-10" />

      {/* Header */}
      <SidebarHeader className={cn("p-4 pb-6", isCollapsed && "p-2 pb-4")}>
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <div className="flex items-center justify-center w-full overflow-hidden">
            <Image
              src="/images/logos/CARBON-LEAF-LOGO.png"
              alt="Logo"
              width={isCollapsed ? 32 : 82}
              height={isCollapsed ? 32 : 32}
              className={cn(
                "transition-all duration-300 object-contain",
                isCollapsed && "w-8 h-8",
              )}
            />
          </div>
        </div>
        {!isCollapsed && (
          <div className="pt-2 border-t border-border/20">
            <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 w-full justify-center">
              <Leaf className="w-3 h-3 mr-1" />
              {t("field_officer.sidebar_dashboard")}
            </Badge>
          </div>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className={cn("px-3", isCollapsed && "px-2")}>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 px-2">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={cn("space-y-1", isCollapsed && "items-center")}
            >
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (pathname.startsWith(item.url + "/") &&
                    item.url !== "/dashboard/field-officer");
                return (
                  <SidebarMenuItem
                    key={item.titleKey}
                    className={cn(isCollapsed && "flex justify-center w-full")}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? t(item.titleKey) : undefined}
                      className={cn(
                        "group/item relative transition-all duration-200",
                        "rounded-xl border border-transparent",
                        isCollapsed
                          ? "h-10 w-10 p-0 flex items-center justify-center"
                          : "h-10",
                        "hover:bg-gradient-to-r hover:from-green-50 hover:to-slate-50/50 dark:hover:from-green-950/40 dark:hover:to-slate-950/20",
                        "hover:border-green-200/50 dark:hover:border-green-800/30",
                        "hover:shadow-sm hover:shadow-green-500/5",
                        isActive && [
                          "bg-gradient-to-r from-green-50 to-slate-50/80 dark:from-green-950/50 dark:to-slate-950/30",
                          "border-green-200/60 dark:border-green-700/40",
                          "shadow-md shadow-green-500/10",
                        ],
                      )}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center",
                          isCollapsed ? "justify-center" : "gap-3 px-3",
                        )}
                      >
                        {/* Active Indicator */}
                        {isActive && !isCollapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-500 to-slate-500 rounded-r-full shadow-lg shadow-green-500/50" />
                        )}

                        {/* Icon Container */}
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-lg transition-all duration-200",
                            isCollapsed ? "size-8" : "size-8",
                            isActive
                              ? "bg-gradient-to-br from-green-500 to-slate-600 text-white shadow-md shadow-green-500/30"
                              : "bg-muted/50 text-muted-foreground group-hover/item:bg-green-100 dark:group-hover/item:bg-green-900/50 group-hover/item:text-green-600 dark:group-hover/item:text-green-400",
                          )}
                        >
                          <item.icon className="size-4" />
                        </div>

                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between min-w-0">
                            <div className="flex flex-col min-w-0">
                              <span
                                className={cn(
                                  "font-semibold text-sm truncate transition-colors",
                                  isActive
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-foreground/80 group-hover/item:text-green-700 dark:group-hover/item:text-green-300",
                                )}
                              >
                                {t(item.titleKey)}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 truncate">
                                {t(item.descriptionKey)}
                              </span>
                            </div>
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={cn("p-3 mt-auto", isCollapsed && "p-2")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={isCollapsed ? "Profile" : undefined}
              className={cn(
                "rounded-xl hover:bg-muted/50 transition-all h-auto",
                isCollapsed ? "p-1 justify-center" : "p-2",
              )}
            >
              <a
                href="#"
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3",
                )}
              >
                <div className="relative">
                  <Avatar
                    className={cn(
                      "rounded-xl border-2 border-green-200 dark:border-green-800 shadow-md",
                      isCollapsed ? "size-8" : "size-10",
                    )}
                  >
                    <AvatarImage
                      src="/avatars/shadcn.jpg"
                      alt="Field Officer"
                    />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-green-500 to-slate-600 text-white font-bold text-sm">
                      FO
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bg-green-500 rounded-full border-2 border-white dark:border-gray-900",
                      isCollapsed
                        ? "-bottom-0.5 -right-0.5 size-2.5"
                        : "-bottom-0.5 -right-0.5 size-3.5",
                    )}
                  />
                </div>

                {!isCollapsed && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-sm truncate">
                        {user && `${user.firstName} ${user.lastName}`}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {t("field_officer.sidebar_dashboard")}
                      </span>
                    </div>
                    <LogOut
                      className="size-4 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                      onClick={signOut}
                    />
                  </>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 px-1">
              <span>© 2025 Carbon Leafs</span>
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-green-500/50" />
    </Sidebar>
  );
}
