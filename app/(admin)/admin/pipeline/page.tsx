"use client";

import * as React from "react";
import {
  IconTimeline,
  IconPlayerPlay,
  IconCheck,
  IconKey,
  IconMessageDots,
  IconClock,
  IconLayersLinked,
  IconShieldLock,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function AdminPipelinePage() {
  const [triggering, setTriggering] = React.useState<string | null>(null);

  const handleTrigger = async (dagId: string) => {
    try {
      setTriggering(dagId);
      const res = await fetch("/api/admin/trigger-dag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dagId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
      } else {
        toast.error(json.message || "Failed to trigger");
      }
    } catch {
      toast.error("Error connecting to trigger API");
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
          Pipeline & Ingestion Controls
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Manage DAG orchestrator triggers, Airflow environment configurations, and authentication parameters.
        </p>
      </div>

      {/* DAG Pipelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DAG 1 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                DAG 1 · Scheduled
              </span>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                echotik_data_collection
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Collects raw TikTok data (Video Library, Trending Hashtags, & Selling Videos).
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl">
              <div>⏰ Schedule: <strong>Setiap 12 Jam (08:25 & 20:25 WIB)</strong></div>
              <div>⚡ Auto-chain: <strong>Triggers DAG 2 on success</strong></div>
            </div>
          </div>
          <button
            onClick={() => handleTrigger("echotik_data_collection")}
            disabled={triggering !== null}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <IconPlayerPlay className="size-3.5 fill-current" />
            <span>{triggering === "echotik_data_collection" ? "Running..." : "Trigger DAG 1"}</span>
          </button>
        </div>

        {/* DAG 2 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                DAG 2 · Event-Driven
              </span>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                echotik_data_ingestion
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Reads Excel datasets, validates staging, upserts to MySQL, and refreshes BI tables.
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl">
              <div>⏰ Trigger: <strong>Auto by DAG 1 completion</strong></div>
              <div>⚡ Auto-chain: <strong>Triggers DAG 3 on success</strong></div>
            </div>
          </div>
          <button
            onClick={() => handleTrigger("echotik_data_ingestion")}
            disabled={triggering !== null}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <IconPlayerPlay className="size-3.5 fill-current" />
            <span>{triggering === "echotik_data_ingestion" ? "Running..." : "Trigger DAG 2"}</span>
          </button>
        </div>

        {/* DAG 3 */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                DAG 3 · Event-Driven
              </span>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                echotik_ml_daily_inference
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Runs Random Forest Virality, SVM Tier classification, and PyTorch LSTM forecasting.
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl">
              <div>⏰ Trigger: <strong>Auto by DAG 2 completion</strong></div>
              <div>🤖 ML Endpoint: <strong>FastAPI Service (Port 8001)</strong></div>
            </div>
          </div>
          <button
            onClick={() => handleTrigger("echotik_ml_daily_inference")}
            disabled={triggering !== null}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <IconPlayerPlay className="size-3.5 fill-current" />
            <span>{triggering === "echotik_ml_daily_inference" ? "Running..." : "Trigger DAG 3"}</span>
          </button>
        </div>
      </div>

      {/* Airflow Variables & Notifier Config Section */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <IconKey className="size-4 text-neutral-500" />
          Configured Airflow Variables & Webhooks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              ECHOTIK_BEARER_TOKEN
            </div>
            <div className="font-mono text-xs text-neutral-500 break-all bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
              3675016|xnMohk... (Managed Automatically)
            </div>
            <p className="text-[11px] text-neutral-400">
              Auto-login service keeps this token synchronized continuously.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              GCHAT_WEBHOOK_URL
            </div>
            <div className="font-mono text-xs text-neutral-500 break-all bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
              https://chat.googleapis.com/v1/spaces/AAQAb4EY2xU/messages...
            </div>
            <p className="text-[11px] text-neutral-400">
              Receives clean, emoji-free alerts for task starts, token checks, and DAG completions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
