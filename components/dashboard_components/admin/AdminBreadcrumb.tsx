"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/global/language-provider"

const breadcrumbLabels: Record<string, string> = {
  admin: "Dashboard",
  "system-users": "System Users",
  "credit-scoring": "Credit Scoring",
  "credit-sales": "Credit Sales",
  "admin-wallet": "Admin Wallet",
  settings: "Settings",
  help: "Help",
}

export default function AdminBreadcrumb() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const segments = pathname
    .split("/")
    .filter(segment => segment && segment !== "admin" && segment !== "dashboard")

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard/admin" },
    ...segments.map((segment, index) => ({
      label: breadcrumbLabels[segment] || segment.replace(/-/g, " "),
      href: `/dashboard/admin/${segments.slice(0, index + 1).join("/")}`,
    })),
  ]

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
