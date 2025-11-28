"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UpdateItem {
  title: string;
  description: string;
  time: string;
  type: "alert" | "info" | "success";
}

const updates: UpdateItem[] = [
  {
    title: "Carbon Credit Price Increased",
    description: "Market price for 1 credit increased to 215 RWF.",
    time: "2 hours ago",
    type: "success",
  },
  {
    title: "New Company Request",
    description: "A new large-scale buyer has joined the marketplace.",
    time: "5 hours ago",
    type: "info",
  },
  {
    title: "Demand Update",
    description: "Companies need 13,000 credits this week.",
    time: "1 day ago",
    type: "alert",
  },
];

export default function Updates() {
  return (
    <Card className="w-full h-full shadow-sm">
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
        <CardDescription>Latest news from the Carbon Leaf marketplace</CardDescription>
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
                {item.type === "alert" && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Alert</Badge>}
                {item.type === "success" && <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-700">Good News</Badge>}
                {item.type === "info" && <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Info</Badge>}
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
