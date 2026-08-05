"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, RegisterDataSchema } from "@/lib/dataSchemas";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AuthAPI } from "../api/authAPI";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/global/language-provider";
import { useTheme } from "@/components/global/theme-provider";
import { Sun, Moon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  getProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
} from "@/lib/rwanda-data";

// All 30 districts, 416 sectors, 2,149 cells, 14,837 villages loaded from rwanda-data
const ALL_PROVINCES = getProvinces();




type FormStep = 1 | 2 | 3 | 4 | 5;

export default function Signup() {
  const conservationSectors = [
    { option: "FARMER", value: "FARMER" },
    { option: "HYBRID_CAR_OWNER", value: "HYBRID CAR OWNER" },
    { option: "ECO_FRIENDLY_STOVES", value: "ECO_FRIENDLY STOVES" },
    { option: "COMMERCIAL_BUILDING", value: "COMMERCIAL BUILDING" },
  ];
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [otp, setOtp] = useState("");
  const [registeredContact, setRegisteredContact] = useState("");

  const form = useForm<RegisterData>({
    mode: "onBlur",
    resolver: zodResolver(RegisterDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contact: "",
      password: "",
      nid: "",
      conservationSectors: [],
      confirmPassword: "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCell, setSelectedCell] = useState("");

  // Derived lists — all complete from the rwanda-data library
  const districts = selectedProvince ? getDistrictsByProvince(selectedProvince) : [];
  const sectors = selectedProvince && selectedDistrict ? getSectorsByDistrict(selectedProvince, selectedDistrict) : [];
  const cells = selectedProvince && selectedDistrict && selectedSector ? getCellsBySector(selectedProvince, selectedDistrict, selectedSector) : [];
  const villages = selectedProvince && selectedDistrict && selectedSector && selectedCell ? getVillagesByCell(selectedProvince, selectedDistrict, selectedSector, selectedCell) : [];

  const steps = [
    { number: 1, title: "Personal Info", completed: currentStep > 1 },
    { number: 2, title: "Location", completed: currentStep > 2 },
    { number: 3, title: "Conservation", completed: currentStep > 3 },
    { number: 4, title: "Security", completed: currentStep > 4 },
    { number: 5, title: "Verify", completed: currentStep > 5 },
  ];

  const { lang, setLanguage, t } = useLanguage();

  // TASK-9: Password strength meter logic
  const watchPassword = form.watch("password", "");
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "bg-slate-200" };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    switch (score) {
      case 0:
      case 1: return { score, label: "Weak", color: "bg-red-500 w-1/4" };
      case 2: return { score, label: "Fair", color: "bg-orange-500 w-2/4" };
      case 3: return { score, label: "Strong", color: "bg-yellow-500 w-3/4" };
      case 4: return { score, label: "Very Strong", color: "bg-emerald-500 w-full" };
      default: return { score: 0, label: "", color: "bg-slate-200 w-0" };
    }
  };
  const strength = getPasswordStrength(watchPassword);

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

  const getErrorMessage = (error: unknown) => {
    if (
      isRecord(error) &&
      isRecord(error.response) &&
      isRecord(error.response.data) &&
      typeof error.response.data.message === "string"
    ) {
      return error.response.data.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return t("auth.signup_error");
  };

  const onSubmit = async (data: RegisterData) => {
    if (data.password !== data.confirmPassword) {
      toast.error(t("auth.password_mismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const newData: Partial<RegisterData> = { ...data };
      delete newData.confirmPassword;
      const result = await AuthAPI.register(newData);
      toast.success(t("auth.signup_success") || "Registration successful! Please verify your email/phone.");
      
      // Move to OTP step
      setRegisteredContact(data.contact);
      setCurrentStep(5);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);

      if (
        isRecord(error) &&
        isRecord(error.response) &&
        isRecord(error.response.data) &&
        isRecord(error.response.data.errors)
      ) {
        Object.entries(error.response.data.errors).forEach(([key, message]) => {
          if (typeof message === "string") {
            form.setError(key as keyof RegisterData, {
              type: "server",
              message,
            });
          }
        });
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error(t("auth.otp_length_error") || "Please enter a 6-digit code");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await AuthAPI.verifyEmail({ contact: registeredContact, otp });
      toast.success(t("auth.otp_verified") || "Verified successfully!");
      
      const roleDashboard: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        USER: "/dashboard/user",
        FIELD_OFFICER: "/dashboard/field-officer",
        VERIFIER: "/dashboard/verifier",
        BUYER: "/dashboard/buyer",
      };
      const route = roleDashboard[result?.data?.role || "USER"] ?? "/dashboard/user";
      window.location.href = route;
    } catch (error) {
      toast.error(t("auth.otp_error") || "Invalid verification code");
      console.error("OTP Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    // Validate current step before proceeding
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5) as FormStep);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as FormStep);
  };

  const getStepFields = (step: FormStep): (keyof RegisterData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "contact", "nid"];
      case 2:
        return ["province", "district", "sector", "cell", "village"];
      case 3:
        return ["conservationSectors"];
      case 4:
        return ["password", "confirmPassword"];
      default:
        return [];
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`
                            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                            ${
                              step.completed
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : step.number === currentStep
                                  ? "border-emerald-500 bg-white text-emerald-500"
                                  : "border-slate-300 text-slate-400"
                            }
                        `}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>

            {/* Step Title */}
            <span
              className={`
                            ml-3 text-sm font-medium hidden sm:block
                            ${
                              step.number === currentStep
                                ? "text-slate-800 dark:text-slate-200"
                                : "text-slate-500"
                            }
                        `}
            >
              {step.title}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                                w-12 h-0.5 mx-4 transition-colors duration-200
                                ${
                                  step.completed
                                    ? "bg-emerald-500"
                                    : "bg-slate-300"
                                }
                            `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-100/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-green-950/10 px-4 py-8">
      {/* Theme and Language Switchers */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        {/* Theme Toggle */}
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

        {/* Language Switcher */}
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

      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
            {t("auth.signup_title")}
          </h1>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Registration Portal
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {t("auth.signup_step")
              .replace("{current}", currentStep.toString())
              .replace("{total}", steps.length.toString())}
          </p>
        </div>

        {/* Progress Steps */}
        {renderStepIndicator()}

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              autoComplete="off"
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center mb-6">
                    <UserPlus className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {t("auth.signup_personal")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("auth.signup_personal_desc")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.first_name")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("auth.enter_first_name")}
                              {...field}
                              className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.last_name")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("auth.enter_last_name")}
                              {...field}
                              className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.email_or_phone")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("auth.enter_email_or_phone")}
                              {...field}
                              className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.national_id")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("auth.enter_nid")}
                              {...field}
                              maxLength={16}
                              inputMode="numeric"
                              className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Location Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center mb-6">
                    <MapPin className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {t("auth.signup_location")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("auth.signup_location_desc")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.province")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => {
                                field.onChange(val);
                                setSelectedProvince(val);
                                setSelectedDistrict("");
                                setSelectedSector("");
                                setSelectedCell("");
                                form.setValue("district", "");
                                form.setValue("sector", "");
                                form.setValue("cell", "");
                                form.setValue("village", "");
                              }}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                <SelectValue
                                  placeholder={
                                    t("auth.select_province") ||
                                    "Select Province"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Province</SelectLabel>
                                  {ALL_PROVINCES.map((p) => (
                                    <SelectItem
                                      key={p}
                                      value={p}
                                    >
                                      {p}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.district")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => {
                                field.onChange(val);
                                setSelectedDistrict(val);
                                setSelectedSector("");
                                setSelectedCell("");
                                form.setValue("sector", "");
                                form.setValue("cell", "");
                                form.setValue("village", "");
                              }}
                              disabled={!selectedProvince}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                <SelectValue
                                  placeholder={
                                    t("auth.select_district") ||
                                    "Select District"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>District</SelectLabel>
                                  {districts.map((d) => (
                                    <SelectItem
                                      key={d}
                                      value={d}
                                    >
                                      {d}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.sector")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => {
                                field.onChange(val);
                                setSelectedSector(val);
                                setSelectedCell("");
                                form.setValue("cell", "");
                                form.setValue("village", "");
                              }}
                              disabled={!selectedDistrict}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                <SelectValue
                                  placeholder={
                                    t("auth.select_sector") || "Select Sector"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Sector</SelectLabel>
                                  {sectors.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cell"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.cell")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => {
                                field.onChange(val);
                                setSelectedCell(val);
                                form.setValue("village", "");
                              }}
                              disabled={!selectedSector}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                <SelectValue
                                  placeholder={
                                    t("auth.select_cell") || "Select Cell"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Cell</SelectLabel>
                                  {cells.map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {c}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="village"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.village")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => field.onChange(val)}
                              disabled={!selectedCell}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                <SelectValue
                                  placeholder={
                                    t("auth.select_village") || "Select Village"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Village</SelectLabel>
                                  {villages.map((v) => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Conservation Sectors */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center mb-6">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3.5a2.5 2.5 0 015 0v1.5a2.5 2.5 0 01-5 0V3.5zm0 5a2.5 2.5 0 015 0v1.5a2.5 2.5 0 01-5 0V8.5zm0 5a2.5 2.5 0 015 0v1.5a2.5 2.5 0 01-5 0v-1.5z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      Conservation Sectors
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Select one or more conservation sectors
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="conservationSectors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Which sectors apply to you? {t("auth.required")}
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {conservationSectors.map((sector) => {
                              const isSelected =
                                field.value?.includes(sector.option) || false;

                              return (
                                <label
                                  key={sector.option}
                                  className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer
                border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30"
                    : "border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/30 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-sm hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20"
                }
            `}
                                >
                                  <div
                                    className={`
                    flex items-center justify-center w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all duration-200
                    ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500 dark:bg-emerald-400 dark:border-emerald-400"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    }
                `}
                                  >
                                    {isSelected && (
                                      <svg
                                        className="w-3 h-3 text-white dark:text-emerald-900"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>

                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const newValue = e.target.checked
                                        ? [
                                            ...(field.value || []),
                                            sector.option,
                                          ]
                                        : (field.value || []).filter(
                                            (s) => s !== sector.option,
                                          );

                                      field.onChange(newValue);
                                    }}
                                    className="sr-only"
                                  />

                                  <div className="flex-1 flex flex-col gap-1">
                                    <span
                                      className={`
                        block font-semibold transition-colors duration-200
                        ${
                          isSelected
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-slate-700 dark:text-slate-300"
                        }
                    `}
                                    >
                                      {sector.value}
                                    </span>
                                  </div>

                                  {isSelected && (
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Security Information */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center mb-6">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="w-4 h-4 bg-emerald-500 rounded-full"></span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {t("auth.signup_security")}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("auth.signup_security_desc")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.password")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("auth.create_strong_password")}
                                autoComplete="new-password"
                                {...field}
                                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          {watchPassword && (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Password Strength</span>
                                <span className={`font-medium ${strength.score < 3 ? "text-red-500" : "text-emerald-500"}`}>
                                  {strength.label}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${strength.color}`}></div>
                              </div>
                            </div>
                          )}
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.confirm_password")} {t("auth.required")}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("auth.enter_confirm_password")}
                                autoComplete="new-password"
                                {...field}
                                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors pr-10"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: OTP Verification */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center mb-6">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {t("auth.otp_title") || "Verify Your Account"}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("auth.otp_subtitle") || "We sent a 6-digit code to your email/phone."}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-4">
                    <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={onOtpSubmit}
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t("auth.otp_verifying") || "Verifying..."}
                        </>
                      ) : (
                        t("auth.otp_verify") || "Verify Code"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          await AuthAPI.resendOtp({ contact: registeredContact });
                          toast.success("OTP resent successfully!");
                        } catch (e) {
                          toast.error("Failed to resend OTP");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                    >
                      Resend Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep !== 5 && (
              <div className="flex justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("auth.signup_previous")}
                </Button>

                {currentStep !== 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/25"
                  >
                    {t("auth.signup_next")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/25 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("auth.signup_creating")}
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          {t("auth.signup_create")}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
              )}
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("auth.signup_already")}{" "}
                <a
                  href="/signin"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
                >
                  {t("auth.signin_button")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
