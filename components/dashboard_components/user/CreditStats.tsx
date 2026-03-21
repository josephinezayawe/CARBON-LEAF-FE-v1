"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { WalletAPI } from "@/app/api/wallet";

const chartConfig = {
  credits: {
    label: "Credits",
  },
  conservation: {
    label: "Conservation",
    color: "hsl(142, 76%, 36%)", // Green
  },
  amount: {
    label: "Total",
    color: "hsl(221, 83%, 53%)", // Blue
  },
  used: {
    label: "Used",
    color: "hsl(346, 84%, 61%)", // Red
  },
  available: {
    label: "Available",
    color: "hsl(215, 88%, 53%)", // Light blue
  },
} satisfies ChartConfig;

export default function CreditStats() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await WalletAPI.getWallet();
        if (res.data) {
          const total = res.data.totalNetCredits || 0;
          setTotalCredits(total);

          // Create chart data with real values
          setChartData([
            {
              category: t("statistics.total"),
              credits: total,
              fill: "var(--color-amount)",
              trend: 8,
              description: "Total credits available",
            },
            {
              category: "Available",
              credits: total,
              fill: "var(--color-available)",
              trend: 12,
              description: "Remaining credits for use",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [t]);

  if (isLoading) {
    return (
      <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {t("dashboard.credits")}
              <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400" />
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
              {t("statistics.comprehensive")}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalCredits}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.total_credits")}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Key Metrics */}

        {/* Chart */}
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
                className="fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="fill-gray-600 dark:fill-gray-400"
                tick={{ fontSize: 12 }}
                width={40}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(220, 13%, 91%)", opacity: 0.3 }}
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    formatter={(value, name) => [
                      <div key={name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              (
                                chartConfig[
                                  name as keyof typeof chartConfig
                                ] as any
                              )?.color || "#999",
                          }}
                        />
                        <span className="font-semibold">{value}</span>
                        <span>credits</span>
                      </div>,
                      name,
                    ]}
                    labelFormatter={(label) => {
                      const item = chartData.find((d) => d.category === label);
                      return (
                        <div className="text-center">
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {label}
                          </div>
                          {item?.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
                              {item.description}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="credits" radius={[8, 8, 0, 0]} maxBarSize={80} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          {chartData.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({item.credits})
              </span>
              {item.trend && (
                <span
                  className={`text-xs font-medium ${
                    item.trend > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.trend > 0 ? "↑" : "↓"} {Math.abs(item.trend)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
