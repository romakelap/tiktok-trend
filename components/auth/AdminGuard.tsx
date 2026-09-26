"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, getStoredUser } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { toast } from "sonner";
import { ROUTES } from "@/lib/routes";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const storedUser = getStoredUser();
    const isRoleAdmin = storedUser?.role?.toUpperCase() === "ADMIN";

    // Double check with /api/users/me if needed
    async function verifyAdmin() {
      try {
        const res = await apiFetch<any>(API_ENDPOINTS.users.me);
        const serverRole = res?.data?.role || res?.data?.user?.role || storedUser?.role;
        
        if (serverRole?.toUpperCase() === "ADMIN" || isRoleAdmin) {
          setAuthorized(true);
        } else {
          toast.error("Access Denied: Admin role required.");
          router.replace(ROUTES.dashboard);
        }
      } catch (err) {
        // If server is unreachable or fails, check storedUser
        if (isRoleAdmin) {
          setAuthorized(true);
        } else {
          toast.error("Access Denied: You do not have admin permissions.");
          router.replace(ROUTES.dashboard);
        }
      } finally {
        setChecking(false);
      }
    }

    verifyAdmin();
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f7] dark:bg-neutral-950">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-6 py-5 shadow-sm flex items-center gap-3 animate-pulse">
          <div className="size-4 rounded-full bg-emerald-500 animate-ping" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
