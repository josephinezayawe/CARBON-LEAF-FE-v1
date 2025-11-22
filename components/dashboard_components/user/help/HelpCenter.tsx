"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageCircleQuestion, Video, BookText, Phone, Mail } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="space-y-6">

      {/* Main Help Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 text-xl">
            <MessageCircleQuestion className="w-5 h-5" />
            Need Help?
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-700">
          If you are new to the platform, here are helpful resources to guide you
          in using the system effectively.
        </CardContent>
      </Card>

      {/* Help Options */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Documentation */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="w-5 h-5 text-blue-600" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Read through detailed written guides on using every feature in the dashboard.
          </CardContent>
        </Card>

        {/* Tutorials */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Watch step-by-step video tutorials on how to register crops, earn credits,
            and sell them.
          </CardContent>
        </Card>

        {/* Support Contact */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Email Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Contact our support team directly: <strong>support@carbonleaf.com</strong>
          </CardContent>
        </Card>

        {/* Hotline */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Support Hotline
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            Call our help line: <strong>+250 798 782 016</strong>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
