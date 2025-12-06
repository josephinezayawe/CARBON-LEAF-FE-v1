"use client"

import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/global/language-provider"
import { useState } from "react"

interface Notification {
  id: string
  title: string
  description: string
  type: "alert" | "info" | "success" | "warning"
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Pending Verification",
    description: "5 new credit applications require verification",
    type: "warning",
    timestamp: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    title: "High Credit Demand",
    description: "Credit demand increased by 45% this week",
    type: "alert",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "System Update",
    description: "Platform maintenance scheduled for tomorrow",
    type: "info",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "New User Registration",
    description: "12 new farmers joined the platform",
    type: "success",
    timestamp: "5 hours ago",
    read: true,
  },
]

export default function NotificationBell() {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      case "warning":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
      case "success":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      case "info":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-lg hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer group",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-900/20"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground/60 mt-1.5 block">
                      {notification.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDismiss(notification.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
