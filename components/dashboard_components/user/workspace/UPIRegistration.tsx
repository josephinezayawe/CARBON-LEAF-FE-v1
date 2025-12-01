"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Trash2, Check, AlertCircle, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/global/language-provider";

interface RegisteredUPI {
  id: string;
  upi: string;
  landName?: string;
  registeredAt: string;
}

export default function UPIRegistration({
  registeredUPIs = [],
  onAddUPI,
  onRemoveUPI,
}: {
  registeredUPIs?: RegisteredUPI[];
  onAddUPI?: (upi: string, landName?: string) => void;
  onRemoveUPI?: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [upiInput, setUpiInput] = useState("");
  const [landName, setLandName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateUPI = (upi: string) => {
    const upiPattern = /^\d+\/\d+\/\d+\/\d+$/;
    return upiPattern.test(upi);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!upiInput.trim()) {
      setError(t("workspace.upi_required_error"));
      return;
    }

    if (!validateUPI(upiInput)) {
      setError(t("workspace.upi_format_error"));
      return;
    }

    if (registeredUPIs.some((r) => r.upi === upiInput)) {
      setError(t("workspace.upi_duplicate_error"));
      return;
    }

    onAddUPI?.(upiInput, landName);
    setSuccess(true);
    setUpiInput("");
    setLandName("");
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Registration Form */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
              <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("workspace.register_new_parcel")}</h3>
              <p className="text-sm text-muted-foreground">{t("workspace.add_new_upi")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="upi" className="text-sm font-medium flex items-center gap-2">
                   <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                   {t("workspace.upi_number")}
                   <span className="text-red-500">*</span>
                 </Label>
                 <Input
                   id="upi"
                   placeholder={t("workspace.upi_placeholder")}
                  value={upiInput}
                  onChange={(e) => {
                    setUpiInput(e.target.value);
                    setError("");
                  }}
                  className={cn(
                    "h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                    "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                    error && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landName" className="text-sm font-medium flex items-center gap-2">
                   <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                   {t("workspace.land_name")}
                   <span className="text-muted-foreground text-xs">{t("workspace.optional")}</span>
                 </Label>
                 <Input
                   id="landName"
                   placeholder={t("workspace.land_name_placeholder")}
                  value={landName}
                  onChange={(e) => setLandName(e.target.value)}
                  className="h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-lg">
                <Check className="w-4 h-4 shrink-0" />
                {t("workspace.upi_success")}
              </div>
            )}

            <Button 
              type="submit" 
              className="h-11 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("workspace.register_upi_button")}
            </Button>
          </form>
        </div>
      </div>

      {/* Registered UPIs List */}
      {registeredUPIs.length > 0 && (
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h4 className="font-semibold flex items-center gap-2">
               <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
               {t("workspace.registered_parcels")}
             </h4>
             <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
               {registeredUPIs.length} {registeredUPIs.length === 1 ? t("workspace.parcel_singular") : t("workspace.parcel_plural")}
             </Badge>
           </div>
          
          <div className="grid gap-3">
            {registeredUPIs.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl",
                  "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
                  "hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md",
                  "transition-all duration-200"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <p className="font-semibold">{item.upi}</p>
                       <Badge variant="outline" className="text-xs px-2 py-0 h-5 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                         {t("workspace.verified")}
                       </Badge>
                     </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {item.landName && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {item.landName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.registeredAt}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => onRemoveUPI?.(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {registeredUPIs.length === 0 && (
         <div className="text-center py-12 px-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
             <MapPin className="w-7 h-7 text-gray-400" />
           </div>
           <h3 className="font-semibold text-lg mb-1">{t("workspace.no_upis")}</h3>
           <p className="text-muted-foreground text-sm max-w-sm mx-auto">
             {t("workspace.no_upis_desc")}
           </p>
         </div>
       )}
    </div>
  );
}
