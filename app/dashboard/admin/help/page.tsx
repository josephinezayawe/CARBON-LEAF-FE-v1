"use client"

import React, { useState } from "react"
import { useLanguage } from "@/components/global/language-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, BookOpen, Users, Zap, Mail, MessageSquare, AlertCircle } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: "credit-scoring",
    question: "How does the AI credit scoring system work?",
    answer:
      "The AI system analyzes submitted documents and user information to verify legitimacy of credit applications. It checks for document authenticity, cross-references user data, and assesses risk factors. The system provides a legality score and recommendation for admin approval.",
  },
  {
    category: "credit-scoring",
    question: "What documents are required for farmer verification?",
    answer:
      "Farmers need to provide: Land Certificate/Title Deed, Recent Farm Photos, Production Records (last 3 months), and Proof of Residence. All documents must be clear and legible.",
  },
  {
    category: "credit-sales",
    question: "How do I create a new credit listing?",
    answer:
      "Go to Credit Sales > Create New Listing. Fill in the listing name, select sector, enter quantity and price per credit. Review the total value and publish. Credits will be available for buyer purchase immediately.",
  },
  {
    category: "credit-sales",
    question: "What are the commission rates?",
    answer:
      "Commission rates vary by sector: Farmer (5%), Eco Stoves (6%), Hybrid Vehicles (4%), Commercial (7%). These are deducted from each sale automatically.",
  },
  {
    category: "admin-wallet",
    question: "Where do the credits in the admin wallet come from?",
    answer:
      "Credits in the admin wallet come from verified users who earn them through their activities (farming, eco stoves, etc.). The system collects these credits and stores them for management and resale.",
  },
  {
    category: "admin-wallet",
    question: "How are payouts distributed?",
    answer:
      "Payouts are distributed based on the sector contribution percentage and the fee structure. Monthly reconciliation ensures accurate distribution to all participating sectors.",
  },
  {
    category: "users",
    question: "How do I manage user accounts?",
    answer:
      "In System Users, you can view all registered users, filter by sector and status, and perform actions like suspending or deleting accounts. Use the actions menu on each user row.",
  },
  {
    category: "users",
    question: "What are the different user statuses?",
    answer:
      "Active: User is verified and can trade. Pending: Awaiting verification. Suspended: Account is restricted. Inactive: User hasn't been active in 60+ days.",
  },
]

const contactInfo = [
  {
    title: "Email Support",
    description: "support@carbonleaf.com",
    icon: Mail,
  },
  {
    title: "Live Chat",
    description: "Available 9 AM - 6 PM RWT",
    icon: MessageSquare,
  },
  {
    title: "Documentation",
    description: "View complete API docs",
    icon: BookOpen,
  },
]

export default function HelpPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "credit-scoring", label: "Credit Scoring" },
    { id: "credit-sales", label: "Credit Sales" },
    { id: "admin-wallet", label: "Admin Wallet" },
    { id: "users", label: "User Management" },
  ]

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
        <p className="text-muted-foreground">
          Get help with admin dashboard features and common tasks
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {contactInfo.map((contact) => {
          const Icon = contact.icon
          return (
            <Card key={contact.title} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{contact.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{contact.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search & Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          {filteredFaqs.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No FAQs found matching your search</p>
              </div>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-3 rounded-t-lg transition-colors">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find((c) => c.id === faq.category)?.label}
                      </Badge>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4 bg-gray-50/50 dark:bg-gray-800/30 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>Useful documents and guides</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Admin Handbook", format: "PDF", size: "2.4 MB" },
              { name: "API Documentation", format: "HTML", size: "Online" },
              { name: "System Architecture Guide", format: "PDF", size: "1.8 MB" },
              { name: "Compliance & Regulations", format: "PDF", size: "3.2 MB" },
            ].map((resource) => (
              <div
                key={resource.name}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.format} • {resource.size}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
