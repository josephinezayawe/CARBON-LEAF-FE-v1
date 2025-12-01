"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/global/language-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const getRouteNames = (t: (key: string) => string): Record<string, string> => ({
  "/dashboard/user": t("navigation.dashboard"),
  "/dashboard/user/wallet": t("navigation.wallet"),
  "/dashboard/user/workspace": t("navigation.workspace"),
  "/dashboard/user/guidance": t("navigation.guidance"),
  "/dashboard/user/report": t("navigation.report"),
  "/dashboard/user/settings": t("navigation.settings"),
});

export default function DashboardBreadcrumb() {
  const { t } = useLanguage();
  const routeNames = getRouteNames(t);
  const pathname = usePathname();
  const pageName = routeNames[pathname] || t("navigation.dashboard");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard/user">{t("navigation.dashboard")}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
