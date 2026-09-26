"use client";

import * as React from "react";
import {
  IconTimeline,
  IconPlayerPlay,
  IconCheck,
  IconKey,
  IconClock,
  IconLayersLinked,
  IconShieldLock,
  IconRefresh,
  IconFileSpreadsheet,
  IconActivity,
  IconCpu,
  IconBrain,
  IconServer,
  IconDatabase,
} from "@tabler/icons-react";
import { toast } from "sonner";

type PipelineData = {
  systemTime: string;
  latencyMs: string;
  collectionStatus: {
    state: "RUNNING" | "IDLE" | "COMPLETED" | "FAILED";
    lastRunStatus: string;
    lastRunTime: string;
    lastDuration: string;
    lastBatchRecords: number;
    validRecords: number;
    nextScheduledRun: string;
    scheduleFrequency: string;
  };
  airflow: {
    status: string;
    version: string;
    host: string;
    uptime: string;
    schedulerHeartbeat: string;
    dags: Array<{
      dagId: string;
      name: string;
      schedule: string;
      lastRunState: string;
      lastRunTime: string;
      nextRunTime: string;
      description: string;
      recordsProcessed: number;
      duration: string;
      tasksCount: number;
      downstream: string;
    }>;
  };
  recentIngestionLogs: Array<{
    id: number;
    runId: string;
    sourceFile: string;
    recordsRead: number;
    validRecords: number;
    videosUpdated: number;
    videosInserted: number;
    hashtagsUpdated: number;
    snapshotsInserted: number;
    duration: string;
    status: string;
    timestamp: string;
  }>;
  recentApiLogs: Array<{
    id: number;
    endpoint: string;
    status: number;
    latency: string;
    method: string;
    error: string | null;
    timestamp: string;
  }>;
};

export default function AdminPipelinePage() {
  const [data, setData] = React.useState<PipelineData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [triggering, setTriggering] = React.useState<string | null>(null);

  const fetchPipelineData = React.useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      toast.error("Gagal memuat status pipeline");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPipelineData();
  }, [fetchPipelineData]);

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
        setTimeout(fetchPipelineData, 2000);
      } else {
        toast.error(json.message || "Failed to trigger pipeline");
      }
    } catch {
      toast.error("Error connecting to trigger API");
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Orchestrator Online
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Airflow 3.0.0 · LocalExecutor
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Pipeline Jobs &amp; Data Ingestion Monitoring
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Kontrol eksekusi DAG Airflow, pantau status job data collection, dan telusuri log aktivitas per batch secara real-time.
          </p>
        </div>

        <button
          onClick={fetchPipelineData}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <IconRefresh className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Memuat..." : "Refresh Status"}</span>
        </button>
      </div>

      {/* DAG Pipelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DAG 1: Collection */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                DAG 1 · Data Collection
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                echotik_data_collection
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Mengambil data TikTok live dari EchoTik API (Video Library, Trending Hashtags, & Selling Items).
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Jadwal Cron:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">08:25 &amp; 20:25 WIB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Batch Record:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">~1.260 records</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Auto Trigger:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Trigger DAG 2</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleTrigger("echotik_data_collection")}
            disabled={triggering !== null}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <IconPlayerPlay className="size-4 fill-current" />
            <span>{triggering === "echotik_data_collection" ? "Sedang Menjalankan..." : "Jalankan DAG 1 Sekarang"}</span>
          </button>
        </div>

        {/* DAG 2: Ingestion & ETL */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                DAG 2 · Ingestion &amp; ETL
              </span>
              <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                echotik_data_ingestion
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Parsing dataset raw Excel, validasi staging, atomic UPSERT ke MySQL Aiven, & refresh tabel BI.
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Trigger:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Setelah DAG 1 Selesai</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Klasifikasi:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">5 Kategori Utama</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Durasi Rata-rata:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">~35 detik</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleTrigger("echotik_data_ingestion")}
            disabled={triggering !== null}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <IconPlayerPlay className="size-4 fill-current" />
            <span>{triggering === "echotik_data_ingestion" ? "Sedang Menjalankan..." : "Jalankan DAG 2 Sekarang"}</span>
          </button>
        </div>

        {/* DAG 3: ML Inference */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                DAG 3 · ML Inference
              </span>
              <span className="size-2 rounded-full bg-purple-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                echotik_ml_daily_inference
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                FastAPI ML scoring: Random Forest Virality, SVM Tier Classifier, dan PyTorch LSTM Forecast 7 Hari.
              </p>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Trigger:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Setelah DAG 2 Selesai</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Model Registry:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">v2.0 Model Suite</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Output:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">10.352 Predictions</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleTrigger("echotik_ml_daily_inference")}
            disabled={triggering !== null}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <IconPlayerPlay className="size-4 fill-current" />
            <span>{triggering === "echotik_ml_daily_inference" ? "Sedang Menjalankan..." : "Jalankan DAG 3 Sekarang"}</span>
          </button>
        </div>
      </div>

      {/* Real Ingestion Activity Log Audit Table */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <IconFileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Data Collection &amp; Ingestion Audit Trail (`ingest_audit_log`)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Rekam jejak eksekusi ETL otomatis dan jumlah baris data yang berhasil dimasukkan ke MySQL
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Direct Audit View
          </span>
        </div>

        {loading || !data ? (
          <div className="py-12 text-center text-xs text-neutral-400">Memuat log audit...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-2.5 px-3">Run ID</th>
                  <th className="py-2.5 px-3">File Sumber Excel</th>
                  <th className="py-2.5 px-3">Record Valid / Total</th>
                  <th className="py-2.5 px-3">Videos Updated</th>
                  <th className="py-2.5 px-3">Snapshots</th>
                  <th className="py-2.5 px-3">Durasi</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Waktu Eksekusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-[11px]">
                {data.recentIngestionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                      {log.runId}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 max-w-xs truncate font-sans text-xs">
                      {log.sourceFile}
                    </td>
                    <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">
                      {log.validRecords} / {log.recordsRead}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      +{log.videosUpdated + log.videosInserted}
                    </td>
                    <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                      +{log.snapshotsInserted}
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {log.duration}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
