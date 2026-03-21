"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const breadcrumbLabels: Record<string, string> = {
  buyer: "Dashboard",
  marketplace: "Marketplace",
  portfolio: "Portfolio",
  transactions: "Transactions",
};

export default function BuyerBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(
      (segment) => segment && segment !== "buyer" && segment !== "dashboard",
    );

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard/buyer" },
    ...segments.map((segment, index) => ({
      label: breadcrumbLabels[segment] || segment.replace(/-/g, " "),
      href: `/dashboard/buyer/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
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
  );
}
