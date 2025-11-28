"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: Record<string, string> = {
  "/dashboard/user": "Overview",
  "/dashboard/user/wallet": "Wallet",
  "/dashboard/user/workspace": "Workspace",
  "/dashboard/user/guidance": "Guidance",
  "/dashboard/user/report": "Reports",
  "/dashboard/user/settings": "Settings",
};

export default function DashboardBreadcrumb() {
  const pathname = usePathname();
  const pageName = routeNames[pathname] || "Overview";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard/user">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
