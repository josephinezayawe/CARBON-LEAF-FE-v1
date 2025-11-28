"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf, TreePine, UploadCloud, Wallet, Info, Sparkles } from "lucide-react";

const steps = [
  {
    icon: TreePine,
    title: "Register Your Land",
    description:
      "Add your UPI details to verify that the land is yours. This ensures transparency and trusted data.",
  },
  {
    icon: UploadCloud,
    title: "Capture & Upload Photos",
    description:
      "Take clear photos of your crops or trees that reduce carbon emissions. Upload them for verification.",
  },
  {
    icon: Wallet,
    title: "Earn Carbon Credits",
    description:
      "After review, your contributions to air conservation generate credits based on certified standards.",
  },
  {
    icon: Leaf,
    title: "Sell to Companies",
    description:
      "Companies purchase credits to offset emissions. You earn money directly through your connected wallet.",
  },
];

export default function GuidanceContent() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-green-700" />
            How the System Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 leading-relaxed">
          This platform connects environmental contributors with companies seeking
          certified carbon credits. If you grow crops or trees that help reduce
          air pollution, this system helps you earn money for your impact.
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <div className="grid md:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <Card key={index} className="p-4">
            <CardHeader>
              <div className="flex items-center gap-3">
                <step.icon className="w-6 h-6 text-green-600" />
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="text-gray-600">{step.description}</CardContent>
          </Card>
        ))}
      </div>

      {/* Encouragement Section */}
      <Card className="border-green-600 border">
        <CardContent className="py-6 px-4 flex items-center gap-4">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <p className="text-gray-800 font-medium">
            Your contribution matters. Every tree, every crop, every square meter
            of land helping reduce pollution is a step toward a greener future.
            Thank you for making a difference!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
