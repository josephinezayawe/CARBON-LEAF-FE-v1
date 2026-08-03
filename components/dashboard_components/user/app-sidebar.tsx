"use client"

import {
  BarChart2,
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Wallet,
  LogOut,
  Bell,
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
    url: "/dashboard/user",
    icon: LayoutDashboard,
    description: "Overview & insights",
    badge: "New",
    badgeVariant: "success" as const,
  },
  {
    title: t("navigation.wallet"),
    url: "/dashboard/user/wallet",
    icon: Wallet,
    description: "Manage finances",
  },
  {
    title: t("navigation.workspace"),
    url: "/dashboard/user/workspace",
    icon: FolderKanban,
    description: "Your projects",
    badge: "3",
    badgeVariant: "info" as const,
  },
  {
    title: t("navigation.guidance"),
    url: "/dashboard/user/guidance",
    icon: BookOpen,
    description: "Learn & grow",
  },
  {
    title: t("navigation.report"),
    url: "/dashboard/user/report",
    icon: BarChart2,
    description: "Analytics & data",
  },
  {
    title: t("navigation.settings"),
    url: "/dashboard/user/settings",
    icon: Settings,
    description: "Preferences",
  },
]

export function AppSidebar() {
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
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-green-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/20 -z-10" />
      <div className="absolute inset-0 backdrop-blur-xl -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-300/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/15 to-teal-300/10 rounded-full blur-2xl -z-10" />

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
                const isActive = pathname === item.url
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
                        "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50/50 dark:hover:from-emerald-950/40 dark:hover:to-green-950/20",
                        "hover:border-emerald-200/50 dark:hover:border-emerald-800/30",
                        "hover:shadow-sm hover:shadow-emerald-500/5",
                        isActive && [
                          "bg-gradient-to-r from-emerald-50 to-green-50/80 dark:from-emerald-950/50 dark:to-green-950/30",
                          "border-emerald-200/60 dark:border-emerald-700/40",
                          "shadow-md shadow-emerald-500/10",
                        ]
                      )}
                    >
                      <Link href={item.url} className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "gap-3 px-3"
                      )}>
                        {/* Active Indicator */}
                        {isActive && !isCollapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-500 rounded-r-full shadow-lg shadow-emerald-500/50" />
                        )}

                        {/* Icon Container */}
                        <div className={cn(
                          "flex items-center justify-center rounded-lg transition-all duration-200",
                          isCollapsed ? "size-8" : "size-8",
                          isActive
                            ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-md shadow-emerald-500/30"
                            : "bg-muted/50 text-muted-foreground group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/50 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400"
                        )}>
                          <item.icon className="size-4" />
                        </div>

                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between min-w-0">
                            <div className="flex flex-col min-w-0">
                              <span className={cn(
                                "font-semibold text-sm truncate transition-colors",
                                isActive
                                  ? "text-emerald-700 dark:text-emerald-300"
                                  : "text-foreground/80 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300"
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

        {/* Upgrade Card */}

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={cn("p-3 mt-auto", isCollapsed && "p-2")}>

        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={isCollapsed ? "User Profile" : undefined}
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
                    "rounded-xl border-2 border-emerald-200 dark:border-emerald-800 shadow-md",
                    isCollapsed ? "size-8" : "size-10"
                  )}>
                    <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white font-bold text-sm">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900",
                    isCollapsed ? "-bottom-0.5 -right-0.5 size-2.5" : "-bottom-0.5 -right-0.5 size-3.5"
                  )} />
                </div>

                {!isCollapsed && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-sm truncate">{user && `${user.firstName} ${user.lastName}`} </span>
                      <span className="text-[11px] text-muted-foreground truncate">{user && user.contact}</span>
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
              <span>© 2025 Carbon Leafs</span>
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-emerald-500/50" />
    </Sidebar>
  )
}

