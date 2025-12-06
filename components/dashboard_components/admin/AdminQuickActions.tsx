"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
   UserPlus,
   FileCheck,
   CreditCard,
   Settings,
   Download,
   Mail,
   AlertTriangle,
   Eye,
 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/global/language-provider"

const getQuickActions = (t: (key: string) => string) => [
   {
     icon: FileCheck,
     label: t("admin.review_pending_approvals"),
     description: t("admin.check_pending_verifications"),
     href: "/dashboard/admin/credit-scoring",
     color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
     variant: "outline" as const,
   },
   {
     icon: UserPlus,
     label: t("admin.manage_system_users"),
     description: t("admin.view_manage_users"),
     href: "/dashboard/admin/system-users",
     color: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
     variant: "outline" as const,
   },
   {
     icon: CreditCard,
     label: t("admin.create_credit_listing"),
     description: t("admin.sell_credits_companies"),
     href: "/dashboard/admin/credit-sales",
     color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
     variant: "outline" as const,
   },
   {
     icon: Eye,
     label: t("admin.view_system_wallet"),
     description: t("admin.monitor_credits_revenue"),
     href: "/dashboard/admin/admin-wallet",
     color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
     variant: "outline" as const,
   },
   {
     icon: Download,
     label: t("admin.export_reports"),
     description: t("admin.generate_system_analytics"),
     href: "#",
     color: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
     variant: "outline" as const,
   },
   {
     icon: Settings,
     label: t("admin.system_configuration"),
     description: t("admin.update_fees_settings"),
     href: "/dashboard/admin/settings",
     color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
     variant: "outline" as const,
   },
 ]

export default function AdminQuickActions() {
   const { t } = useLanguage()
   const quickActions = getQuickActions(t)
  return (
    <Card className="shadow-xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900/80 dark:to-gray-800/30">
      <CardHeader className="pb-4">
         <CardTitle className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">{t("admin.quick_actions")}</CardTitle>
         <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("admin.fast_access_admin_tasks")}</CardDescription>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {quickActions.map((action) => {
             const Icon = action.icon
             return (
               <Link href={action.href} key={action.label}>
                 <Button
                   variant="outline"
                   className="h-auto p-4 w-full justify-start border border-gray-200/60 dark:border-gray-700/60 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-br hover:from-white/95 hover:to-gray-50 dark:hover:from-gray-800/95 dark:hover:to-gray-700/80"
                 >
                   <div className={`p-3 rounded-lg mr-3 shrink-0 transition-all duration-300 ${action.color}`}>
                     <Icon className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                     <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{action.label}</p>
                     <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{action.description}</p>
                   </div>
                 </Button>
               </Link>
             )
           })}
         </div>
       </CardContent>
     </Card>
   )
}
