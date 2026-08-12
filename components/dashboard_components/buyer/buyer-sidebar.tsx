"use client";

import {
  BarChart3,
  LogOut,
  ShoppingCart,
  Briefcase,
  History,
  Store,
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
    titleKey: "buyer.sidebar_dashboard",
    url: "/dashboard/buyer",
    icon: BarChart3,
    descriptionKey: "buyer.sidebar_overview",
  },
  {
    titleKey: "buyer.sidebar_marketplace",
    url: "/dashboard/buyer/marketplace",
    icon: Store,
    descriptionKey: "buyer.sidebar_browse_credits",
  },
  {
    titleKey: "buyer.sidebar_portfolio",
    url: "/dashboard/buyer/portfolio",
    icon: Briefcase,
    descriptionKey: "buyer.sidebar_your_credits",
  },
  {
    titleKey: "buyer.sidebar_transactions",
    url: "/dashboard/buyer/transactions",
    icon: History,
    descriptionKey: "buyer.sidebar_purchase_history",
  },
];

export function BuyerSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r-0 overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950/20 -z-10" />
      <div className="absolute inset-0 backdrop-blur-xl -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-slate-300/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-slate-400/15 to-emerald-300/10 rounded-full blur-2xl -z-10" />

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
                href="/dashboard/buyer"
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3",
                )}
              >
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30",
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
                    <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      CarbonLeafs
                    </span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 w-full justify-center">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      {t("buyer.role_label")}
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
                    item.url !== "/dashboard/buyer");
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
                        "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50/50 dark:hover:from-emerald-950/40 dark:hover:to-teal-950/20",
                        "hover:border-emerald-200/50 dark:hover:border-emerald-800/30",
                        "hover:shadow-sm hover:shadow-emerald-500/5",
                        isActive && [
                          "bg-gradient-to-r from-emerald-50 to-teal-50/80 dark:from-emerald-950/50 dark:to-teal-950/30",
                          "border-emerald-200/60 dark:border-emerald-700/40",
                          "shadow-md shadow-emerald-500/10",
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
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full shadow-lg shadow-emerald-500/50" />
                        )}

                        {/* Icon Container */}
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-lg transition-all duration-200",
                            isCollapsed ? "size-8" : "size-8",
                            isActive
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30"
                              : "bg-muted/50 text-muted-foreground group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/50 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400",
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
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : "text-foreground/80 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300",
                                )}
                              >
                                {t(item.titleKey)}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 truncate">
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
      <SidebarFooter className={cn("p-3", isCollapsed && "p-2")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex items-center rounded-xl p-2",
                "bg-gradient-to-r from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/20",
                "border border-emerald-200/30 dark:border-emerald-800/20",
                isCollapsed ? "justify-center" : "gap-3",
              )}
            >
              <Avatar
                className={cn(
                  "border-2 border-emerald-200 dark:border-emerald-800",
                  isCollapsed ? "size-8" : "size-9",
                )}
              >
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground/90">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 truncate">
                    {t("buyer.role_label")}
                  </p>
                </div>
              )}

              {!isCollapsed && (
                <button
                  onClick={signOut}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="size-4" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
