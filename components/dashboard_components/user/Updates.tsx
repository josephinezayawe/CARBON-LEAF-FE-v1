"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/global/language-provider";

interface UpdateItem {
  title: string;
  description: string;
  time: string;
  type: "alert" | "info" | "success";
}

const getUpdates = (t: (key: string) => string): UpdateItem[] => [
  {
    title: t("updates.price_increased"),
    description: "Market price for 1 credit increased to 215 RWF.",
    time: "2 hours ago",
    type: "success",
  },
  {
    title: t("updates.new_request"),
    description: "A new large-scale buyer has joined the marketplace.",
    time: "5 hours ago",
    type: "info",
  },
  {
    title: t("updates.demand_update"),
    description: "Companies need 13,000 credits this week.",
    time: "1 day ago",
    type: "alert",
  },
];

export default function Updates() {
  const { t } = useLanguage();
  const updates = getUpdates(t);
  return (
    <Card className="w-full h-full shadow-sm">
      <CardHeader>
        <CardTitle>{t("updates.latest")}</CardTitle>
        <CardDescription>{t("updates.latest_news")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {updates.map((item, index) => (
          <div
            key={index}
            className="flex flex-col space-y-1 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{item.title}</h4>
                {item.type === "alert" && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{t("updates.alert")}</Badge>}
                {item.type === "success" && <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-700">{t("updates.good_news")}</Badge>}
                {item.type === "info" && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{t("updates.info")}</Badge>}
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
