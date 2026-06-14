"use client";

import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/lib/endpoints";

type CurrentUser = {
  userId: number;
  name: string;
  email: string;
  role: string;
};

export default function TestApiPage() {
  const { data, loading, error, execute } = useApi<CurrentUser>();

  useEffect(() => {
    execute(API_ENDPOINTS.users.me);
  }, [execute]);

  return (
    <div className="p-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <pre className="rounded-lg border bg-muted p-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}