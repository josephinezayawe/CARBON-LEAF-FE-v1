"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf, TreePine, UploadCloud, Wallet, Info, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";

export default function GuidanceContent() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: TreePine,
      title: t("guidance.step1"),
      description: t("guidance.step1_description"),
    },
    {
      icon: UploadCloud,
      title: t("guidance.step2"),
      description: t("guidance.step2_description"),
    },
    {
      icon: Wallet,
      title: t("guidance.step3"),
      description: t("guidance.step3_description"),
    },
    {
      icon: Leaf,
      title: t("guidance.step4"),
      description: t("guidance.step4_description"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-green-700 dark:text-green-400" />
            {t("guidance.how_works")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          {t("guidance.introduction")}
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <div className="grid md:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <Card key={index} className="p-4">
            <CardHeader>
              <div className="flex items-center gap-3">
                <step.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="text-muted-foreground">{step.description}</CardContent>
          </Card>
        ))}
      </div>

      {/* Encouragement Section */}
      <Card className="border-green-600 border dark:border-green-800">
        <CardContent className="py-6 px-4 flex items-center gap-4">
          <p className="text-foreground font-medium">
            {t("guidance.contribution")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
