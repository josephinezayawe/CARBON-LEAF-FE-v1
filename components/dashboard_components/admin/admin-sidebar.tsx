"use client"

import {
  BarChart3,
  BookOpen,
  Settings,
  Wallet,
  LogOut,
  Users,
  Shield,
  TrendingUp,
  ShoppingCart,
  CheckSquare,
  Brain,
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useLanguage } from "@/components/global/language-provider"
import { useEffect, useState } from "react"
import { Account } from "@/lib/dataSchemas"
import { getCurrentUser } from "@/lib/auth"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"

const getMenuItems = (t: (key: string) => string) => [
  {
    title: t("navigation.dashboard"),
    url: "/dashboard/admin",
    icon: BarChart3,
    description: "System overview",
    badge: "",
    badgeVariant: "success" as const,
  },
  {
    title: t("navigation.system_users"),
    url: "/dashboard/admin/system-users",
    icon: Users,
    description: "Manage users",
    badge: "120",
    badgeVariant: "info" as const,
  },
  {
    title: t("navigation.credit_scoring"),
    url: "/dashboard/admin/credit-scoring",
    icon: Brain,
    description: "AI scoring system",
    badge: "5",
    badgeVariant: "warning" as const,
  },
  {
    title: t("navigation.credit_sales"),
    url: "/dashboard/admin/credit-sales",
    icon: ShoppingCart,
    description: "Sell credits",
  },
  {
    title: t("navigation.admin_wallet"),
    url: "/dashboard/admin/admin-wallet",
    icon: Wallet,
    description: "System finances",
  },
  {
    title: t("navigation.settings"),
    url: "/dashboard/admin/settings",
    icon: Settings,
    description: "System config",
  },
  {
    title: t("navigation.help"),
    url: "/dashboard/admin/help",
    icon: BookOpen,
    description: "Documentation",
  },
]

export function AdminSidebar() {
  const { t } = useLanguage()
  const menuItems = getMenuItems(t)
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const { user, signOut } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 overflow-hidden"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-slate-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950/20 -z-10" />
      <div className="absolute inset-0 backdrop-blur-xl -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-slate-300/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-slate-400/15 to-blue-300/10 rounded-full blur-2xl -z-10" />

      {/* Header */}
      <SidebarHeader className={cn("p-4 pb-6", isCollapsed && "p-2 pb-4")}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="flex items-center justify-center w-full overflow-hidden">
            <Image
              src="/images/logos/CARBON-LEAF-LOGO.png"
              alt="Logo"
              width={isCollapsed ? 32 : 82}
              height={isCollapsed ? 32 : 32}
              className={cn(
                "transition-all duration-300 object-contain",
                isCollapsed && "w-8 h-8"
              )}
            />
          </div>
        </div>
        {!isCollapsed && (
          <div className="pt-2 border-t border-border/20">
            <Badge className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 w-full justify-center">
              <Shield className="w-3 h-3 mr-1" />
              Admin Panel
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
            <SidebarMenu className={cn("space-y-1", isCollapsed && "items-center")}>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url + "/") && item.url !== "/dashboard/admin")
                return (
                  <SidebarMenuItem key={item.title} className={cn(isCollapsed && "flex justify-center w-full")}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        "group/item relative transition-all duration-200",
                        "rounded-xl border border-transparent",
                        isCollapsed
                          ? "h-10 w-10 p-0 flex items-center justify-center"
                          : "h-10",
                        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50/50 dark:hover:from-blue-950/40 dark:hover:to-slate-950/20",
                        "hover:border-blue-200/50 dark:hover:border-blue-800/30",
                        "hover:shadow-sm hover:shadow-blue-500/5",
                        isActive && [
                          "bg-gradient-to-r from-blue-50 to-slate-50/80 dark:from-blue-950/50 dark:to-slate-950/30",
                          "border-blue-200/60 dark:border-blue-700/40",
                          "shadow-md shadow-blue-500/10",
                        ]
                      )}
                    >
                      <Link href={item.url} className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "gap-3 px-3"
                      )}>
                        {/* Active Indicator */}
                        {isActive && !isCollapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-slate-500 rounded-r-full shadow-lg shadow-blue-500/50" />
                        )}

                        {/* Icon Container */}
                        <div className={cn(
                          "flex items-center justify-center rounded-lg transition-all duration-200",
                          isCollapsed ? "size-8" : "size-8",
                          isActive
                            ? "bg-gradient-to-br from-blue-500 to-slate-600 text-white shadow-md shadow-blue-500/30"
                            : "bg-muted/50 text-muted-foreground group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/50 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400"
                        )}>
                          <item.icon className="size-4" />
                        </div>

                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between min-w-0">
                            <div className="flex flex-col min-w-0">
                              <span className={cn(
                                "font-semibold text-sm truncate transition-colors",
                                isActive
                                  ? "text-blue-700 dark:text-blue-300"
                                  : "text-foreground/80 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-300"
                              )}>
                                {item.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 truncate">
                                {item.description}
                              </span>
                            </div>

                            {item.badge && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "ml-2 text-[10px] font-bold px-1.5 py-0 h-5 border-0",
                                  item.badgeVariant === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                                  item.badgeVariant === "info" && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                                  item.badgeVariant === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                                  !item.badgeVariant && "bg-muted text-muted-foreground"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={cn("p-3 mt-auto", isCollapsed && "p-2")}>
        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={isCollapsed ? "Admin Profile" : undefined}
              className={cn(
                "rounded-xl hover:bg-muted/50 transition-all h-auto",
                isCollapsed ? "p-1 justify-center" : "p-2"
              )}
            >
              <a href="#" className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "gap-3"
              )}>
                <div className="relative">
                  <Avatar className={cn(
                    "rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-md",
                    isCollapsed ? "size-8" : "size-10"
                  )}>
                    <AvatarImage src="/avatars/shadcn.jpg" alt="Admin" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-slate-600 text-white font-bold text-sm">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bg-blue-500 rounded-full border-2 border-white dark:border-gray-900",
                    isCollapsed ? "-bottom-0.5 -right-0.5 size-2.5" : "-bottom-0.5 -right-0.5 size-3.5"
                  )} />
                </div>

                {!isCollapsed && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-sm truncate">{user && `${user.firstName} ${user.lastName}`}</span>
                      <span className="text-[11px] text-muted-foreground truncate">Administrator</span>
                    </div>
                    <LogOut className="size-4 text-muted-foreground hover:text-red-500 transition-colors shrink-0" onClick={signOut} />
                  </>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 px-1">
              <span>© 2024 Carbon Leaf</span>
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-blue-500/50" />
    </Sidebar>
  )
}
