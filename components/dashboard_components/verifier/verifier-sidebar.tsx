"use client";

import {
  BarChart3,
  LogOut,
  ClipboardList,
  FolderSearch,
  Shield,
  Leaf,
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
    titleKey: "verifier.sidebar_dashboard",
    url: "/dashboard/verifier",
    icon: BarChart3,
    descriptionKey: "verifier.sidebar_overview",
  },
  {
    titleKey: "verifier.sidebar_queue",
    url: "/dashboard/verifier/queue",
    icon: FolderSearch,
    descriptionKey: "verifier.sidebar_workspace_queue",
  },
];

export function VerifierSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r-0 overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950/20 -z-10" />
      <div className="absolute inset-0 backdrop-blur-xl -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-slate-300/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-slate-400/15 to-indigo-300/10 rounded-full blur-2xl -z-10" />

      {/* Header */}
      <SidebarHeader className={cn("p-4", isCollapsed && "p-2")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "hover:bg-transparent active:bg-transparent",
                isCollapsed && "justify-center",
              )}
            >
              <Link
                href="/dashboard/verifier"
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3",
                )}
              >
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-slate-600 shadow-lg shadow-indigo-500/30",
                    isCollapsed ? "size-8" : "size-10",
                  )}
                >
                  <Image
                    src="/images/carbon_logo.png"
                    alt="CarbonLeafs"
                    width={isCollapsed ? 20 : 26}
                    height={isCollapsed ? 20 : 26}
                    className="brightness-0 invert"
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-slate-600 bg-clip-text text-transparent">
                      CarbonLeafs
                    </span>
                    <Badge className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 w-full justify-center">
                      <Shield className="w-3 h-3 mr-1" />
                      {t("verifier.sidebar_dashboard")}
                    </Badge>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
                    item.url !== "/dashboard/verifier");
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
                        "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-slate-50/50 dark:hover:from-indigo-950/40 dark:hover:to-slate-950/20",
                        "hover:border-indigo-200/50 dark:hover:border-indigo-800/30",
                        "hover:shadow-sm hover:shadow-indigo-500/5",
                        isActive && [
                          "bg-gradient-to-r from-indigo-50 to-slate-50/80 dark:from-indigo-950/50 dark:to-slate-950/30",
                          "border-indigo-200/60 dark:border-indigo-700/40",
                          "shadow-md shadow-indigo-500/10",
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
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-slate-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
                        )}

                        {/* Icon Container */}
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-lg transition-all duration-200",
                            isCollapsed ? "size-8" : "size-8",
                            isActive
                              ? "bg-gradient-to-br from-indigo-500 to-slate-600 text-white shadow-md shadow-indigo-500/30"
                              : "bg-muted/50 text-muted-foreground group-hover/item:bg-indigo-100 dark:group-hover/item:bg-indigo-900/50 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400",
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
                                    ? "text-indigo-700 dark:text-indigo-300"
                                    : "text-foreground/80 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-300",
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
                      "rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-md",
                      isCollapsed ? "size-8" : "size-10",
                    )}
                  >
                    <AvatarImage src="/avatars/shadcn.jpg" alt="Verifier" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-indigo-500 to-slate-600 text-white font-bold text-sm">
                      VR
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bg-indigo-500 rounded-full border-2 border-white dark:border-gray-900",
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
                        {t("verifier.role_label")}
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
              <span>© 2025 CarbonLeafs</span>
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-indigo-500/50" />
    </Sidebar>
  );
}
