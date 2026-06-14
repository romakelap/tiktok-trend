import * as React from "react";

type AuthAlertProps = {
  variant: "error" | "success" | "info";
  children: React.ReactNode;
};

const STYLES: Record<
  AuthAlertProps["variant"],
  { background: string; border: string; color: string }
> = {
  error: {
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    color: "#b91c1c",
  },
  success: {
    background: "rgba(34, 197, 94, 0.08)",
    border: "1px solid rgba(34, 197, 94, 0.18)",
    color: "#15803d",
  },
  info: {
    background: "rgba(59, 130, 246, 0.08)",
    border: "1px solid rgba(59, 130, 246, 0.18)",
    color: "#1d4ed8",
  },
};

/** Small inline alert used in auth forms for server errors / status. */
export function AuthAlert({ variant, children }: AuthAlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="rounded-xl px-4 py-3 text-sm font-semibold"
      style={STYLES[variant]}
    >
      {children}
    </div>
  );
}
