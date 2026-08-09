"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, KeyRound, ShieldCheck, Lock } from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { useTheme } from "@/components/global/theme-provider";
import { Sun, Moon } from "lucide-react";
import api from "@/app/api/api";

const phoneSchema = z.object({
  contact: z.string().min(1, "Contact is required"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const newPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type Step = "phone" | "otp" | "password";

export default function ForgotPassword() {
  const router = useRouter();
  const { t } = useLanguage();
  const { lang, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState<Step>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { contact: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  const handleSendOtp = async (data: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { contact: data.contact });
      setContact(data.contact);
      setStep("otp");
      toast.success(t("auth.forgot_password_sent"));
    } catch {
      toast.error(t("auth.forgot_password_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/verify-otp", { contact, otp: data.otp });
      setOtp(data.otp);
      setStep("password");
      toast.success(t("auth.otp_verified"));
    } catch {
      toast.error(t("auth.otp_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    data: z.infer<typeof newPasswordSchema>,
  ) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        contact,
        otp,
        newPassword: data.newPassword,
      });
      toast.success(t("auth.reset_success"));
      router.push("/signin");
    } catch {
      toast.error(t("auth.reset_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const stepConfig: Record<
    Step,
    { icon: React.ReactNode; title: string; subtitle: string }
  > = {
    phone: {
      icon: <KeyRound className="w-6 h-6 text-white" />,
      title: t("auth.forgot_password_title"),
      subtitle: t("auth.forgot_password_subtitle"),
    },
    otp: {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: t("auth.otp_title"),
      subtitle: t("auth.otp_subtitle"),
    },
    password: {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: t("auth.reset_title"),
      subtitle: t("auth.reset_subtitle"),
    },
  };

  const current = stepConfig[step];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-100/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-green-950/10 px-4 py-8">
      {/* Theme and Language Switchers */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>

        <div className="relative group">
          <button className="px-3 py-1.5 rounded-lg bg-white/80 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2 shadow-sm">
            {lang.toUpperCase()}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {(["en", "fr", "rw"] as const).map((language) => (
              <button
                key={language}
                onClick={() => setLanguage(language)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  lang === language
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {language === "en" && "English"}
                {language === "fr" && "Français"}
                {language === "rw" && "Kinyarwanda"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            {current.icon}
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            {current.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {current.subtitle}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 p-8">
          {/* Step 1: Phone */}
          {step === "phone" && (
            <Form {...phoneForm}>
              <form
                onSubmit={phoneForm.handleSubmit(handleSendOtp)}
                className="space-y-6"
              >
                <FormField
                  control={phoneForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("auth.email_or_phone")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("auth.enter_email_or_phone")}
                          {...field}
                          className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("auth.forgot_password_sending")}
                    </>
                  ) : (
                    t("auth.forgot_password_send")
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                className="space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("auth.otp_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("auth.otp_placeholder")}
                          maxLength={6}
                          {...field}
                          className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-center text-lg tracking-widest"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("auth.otp_verifying")}
                    </>
                  ) : (
                    t("auth.otp_verify")
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handleResetPassword)}
                className="space-y-6"
              >
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("auth.reset_new_password")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("auth.reset_new_password_placeholder")}
                          {...field}
                          className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("auth.reset_confirming")}
                    </>
                  ) : (
                    t("auth.reset_confirm")
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Back to Sign In link */}
          <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="text-center">
              <a
                href="/signin"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("auth.back_to_signin")}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {t("auth.by_continuing_1")}{" "}
            <a
              href="/terms"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium underline underline-offset-2"
            >
              {t("auth.terms_service")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
