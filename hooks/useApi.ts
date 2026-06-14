"use client";

import { useCallback, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getErrorMessage } from "@/lib/error-handler";
import type { ApiResponse } from "@/lib/types";

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [response, setResponse] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      path: string,
      options?: Parameters<typeof apiFetch<T>>[1]
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFetch<T>(path, options);

        setResponse(result);
        setData(result.data);

        return result;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    data,
    response,
    loading,
    error,
    execute,
    setData,
  };
}