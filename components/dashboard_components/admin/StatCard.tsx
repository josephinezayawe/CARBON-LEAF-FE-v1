"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { AnimatedNumber } from "./AnimatedNumber"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  change?: string
  period?: string
  color: "blue" | "emerald" | "amber" | "green"
  isLarge?: boolean
}

const colorConfig = {
  blue: {
    border: "border-blue-100/50 dark:border-blue-900/30",
    bg: "from-blue-50/80 to-white dark:from-blue-950/20 dark:to-gray-900/50",
    iconBg: "bg-blue-100/60 dark:bg-blue-900/40",
    icon: "text-blue-600 dark:text-blue-400",
    text: "from-blue-600 to-blue-700",
    change: "text-emerald-600 dark:text-emerald-400",
    glow: "shadow-blue-500/20",
  },
  emerald: {
    border: "border-emerald-100/50 dark:border-emerald-900/30",
    bg: "from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-gray-900/50",
    iconBg: "bg-emerald-100/60 dark:bg-emerald-900/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    text: "from-emerald-600 to-emerald-700",
    change: "text-emerald-600 dark:text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  amber: {
    border: "border-amber-100/50 dark:border-amber-900/30",
    bg: "from-amber-50/80 to-white dark:from-amber-950/20 dark:to-gray-900/50",
    iconBg: "bg-amber-100/60 dark:bg-amber-900/40",
    icon: "text-amber-600 dark:text-amber-400",
    text: "from-amber-600 to-amber-700",
    change: "text-amber-600 dark:text-amber-400",
    glow: "shadow-amber-500/20",
  },
  green: {
    border: "border-green-100/50 dark:border-green-900/30",
    bg: "from-green-50/80 to-white dark:from-green-950/20 dark:to-gray-900/50",
    iconBg: "bg-green-100/60 dark:bg-green-900/40",
    icon: "text-green-600 dark:text-green-400",
    text: "from-green-600 to-green-700",
    change: "text-green-600 dark:text-green-400",
    glow: "shadow-green-500/20",
  },
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  period,
  color,
  isLarge,
}: StatCardProps) {
  const config = colorConfig[color]

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        className={`border ${config.border} shadow-lg hover:shadow-2xl bg-gradient-to-br ${config.bg} transition-all duration-300 overflow-hidden relative group`}
      >
        {/* Animated glow effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-500 -z-10`} />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </CardTitle>
          <motion.div
            className={`p-2 rounded-lg ${config.iconBg}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Icon className={`h-5 w-5 ${config.icon}`} />
          </motion.div>
        </CardHeader>

        <CardContent>
          <div className={`text-3xl font-black bg-gradient-to-r ${config.text} bg-clip-text text-transparent`}>
            {isLarge ? (
              value >= 1000000 ? (
                <span>
                  <AnimatedNumber value={Math.floor(value / 1000000)} />M
                </span>
              ) : value >= 1000 ? (
                <span>
                  <AnimatedNumber value={Math.floor(value / 1000)} />K
                </span>
              ) : (
                <AnimatedNumber value={value} />
              )
            ) : (
              <AnimatedNumber value={value} />
            )}
          </div>

          {change && (
            <p className={`text-xs font-medium ${config.change} mt-1 flex items-center gap-1`}>
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ↑
              </motion.span>
              {change}
            </p>
          )}

          {period && !change && (
            <p className={`text-xs font-medium ${config.change} mt-1`}>
              {period}
            </p>
          )}

          {period && change && (
            <p className={`text-xs font-medium text-muted-foreground mt-1`}>
              {period}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
