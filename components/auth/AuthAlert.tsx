"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthAlertProps = {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
};

export function AuthAlert({
  variant = "error",
  children,
  className,
}: AuthAlertProps) {
  const isError = variant === "error";
  const isSuccess = variant === "success";

  const Icon = isError ? AlertCircle : isSuccess ? CheckCircle2 : Info;

  return (
    <div
      className={cn(
        "p-3 sm:p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5",
        isError
          ? "bg-red-50/80 border-red-200 text-red-800"
          : isSuccess
          ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
          : "bg-blue-50/80 border-blue-200 text-blue-800",
        className
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 mt-0.5",
          isError ? "text-red-600" : isSuccess ? "text-emerald-600" : "text-blue-600"
        )}
      />
      <div className="flex-1 font-medium">{children}</div>
    </div>
  );
}
