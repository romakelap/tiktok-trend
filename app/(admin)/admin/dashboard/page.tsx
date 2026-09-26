"use client";

import * as React from "react";
import {
  IconActivity,
  IconCheck,
  IconClock,
  IconDatabase,
  IconKey,
  IconPlayerPlay,
  IconRefresh,
  IconServer,
  IconTrendingUp,
  IconVideo,
  IconHash,
  IconAlertCircle,
  IconTimeline,
  IconLayersLinked,
  IconCpu,
  IconBrain,
  IconSparkles,
  IconSearch,
  IconArrowRight,
  IconCircleCheck,
  IconDeviceAnalytics,
  IconShieldLock,
  IconFileSpreadsheet,
  IconUsers,
  IconTag,
  IconChartBar,
  IconBolt,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

type TelemetryData = {
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
  dataFreshness: Array<{
    domain: string;
    lastSync: string;
    status: string;
    recordCount: number;
  }>;
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
  databaseHealth: {
    status: string;
    host: string;
    databaseName: string;
    engine: string;
    region: string;
    sslEncrypted: boolean;
    sslProtocol: string;
    queryLatency: string;
    threadsConnected: number;
    slowQueries: number;
    uptimeSeconds: number;
    totalQuestions: number;
    totalVideos: number;
    totalSnapshots: number;
    totalHashtags: number;
    totalPredictions: number;
    totalCategories: number;
    registeredUsersCount: number;
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
  usersList: Array<{
    userId: number;
    email: string;
    username: string;
    fullName: string;
    role: string;
    isActive: boolean;
    lastLogin: string;
    registeredAt: string;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<TelemetryData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [logFilter, setLogFilter] = React.useState<"ALL" | "SUCCESS" | "ERROR">("ALL");

  const fetchMetrics = React.useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      toast.error("Failed to load telemetry from server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
    // Lightweight polling every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center animate-pulse text-white dark:text-neutral-900">
          <IconActivity className="w-5 h-5 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          Loading live telemetry & monitoring engine...
        </p>
      </div>
    );
  }

  const filteredLogs = data.recentIngestionLogs.filter((log) => {
    if (logFilter === "SUCCESS") return log.status === "SUCCESS";
    if (logFilter === "ERROR") return log.status !== "SUCCESS";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Active
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Latency: <strong className="font-mono text-neutral-800 dark:text-neutral-200">{data.latencyMs}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            System & Data Pipeline Monitoring
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time telemetry for Airflow ETL, Aiven MySQL Cloud, and Machine Learning Inference engines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMetrics}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors disabled:opacity-50"
          >
            <IconRefresh className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <Link
            href="/admin/pipeline"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 transition-colors shadow-xs"
          >
            <IconPlayerPlay className="w-3.5 h-3.5" />
            <span>Trigger DAGs</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Execution Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <IconTimeline className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <IconCheck className="w-3 h-3" />
              {data.collectionStatus.lastRunStatus}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Data Collection Status
            </p>
            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {data.collectionStatus.state}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Batch: {data.collectionStatus.lastBatchRecords.toLocaleString()} records ({data.collectionStatus.lastDuration})
            </p>
          </div>
        </div>

        {/* Card 2: Database Health */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
              <IconDatabase className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              {data.databaseHealth.status}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Aiven MySQL Cloud
            </p>
            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {data.databaseHealth.totalVideos.toLocaleString()} Videos
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {data.databaseHealth.totalSnapshots.toLocaleString()} snapshots · {data.databaseHealth.threadsConnected} threads
            </p>
          </div>
        </div>

        {/* Card 3: ML Engine & Inference */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
              <IconBrain className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
              ML v2.0
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              ML Scoring Engine
            </p>
            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {data.databaseHealth.totalPredictions.toLocaleString()} Predictions
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Random Forest · SVM · LSTM Forecast
            </p>
          </div>
        </div>

        {/* Card 4: Registered Users */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <IconUsers className="w-5 h-5" />
            </div>
            <Link
              href="/admin/users"
              className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5 hover:underline"
            >
              <span>Manage</span>
              <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              User Accounts
            </p>
            <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {data.databaseHealth.registeredUsersCount} Registered
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Auth active · Zero sensitive exposure
            </p>
          </div>
        </div>
      </div>

      {/* 3. Domain Data Freshness & Sync Timestamps Monitor */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <IconClock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Domain Data Freshness &amp; Database Sync Timestamps
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Waktu pembaruan data terakhir per tabel fakta dan output model di MySQL Aiven Cloud
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Auto-synced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {data.dataFreshness.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {item.domain}
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  {item.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  {item.lastSync}
                </span>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {item.recordCount.toLocaleString()} rows
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Orchestrator DAG Runs & Ingestion Logs Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DAG Pipelines Status (1 Column) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <IconCpu className="w-4 h-4 text-neutral-500" />
              <span>Airflow 3.0 DAGs</span>
            </h2>
            <Link
              href="/admin/pipeline"
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
            >
              <span>Controls</span>
              <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {data.airflow.dags.map((dag) => (
              <div
                key={dag.dagId}
                className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 font-mono">
                    {dag.dagId}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    {dag.lastRunState}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {dag.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-200/40 dark:border-neutral-700/40">
                  <span>{dag.schedule}</span>
                  <span>{dag.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Ingestion Activity Logs (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <IconFileSpreadsheet className="w-4 h-4 text-neutral-500" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Latest Ingestion Activity Logs (ingest_audit_log)
                </h2>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {(["ALL", "SUCCESS", "ERROR"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLogFilter(filter)}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      logFilter === filter
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate font-mono">
                        Run: {log.runId}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {log.sourceFile}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-neutral-800 dark:text-neutral-200">
                      {log.validRecords} / {log.recordsRead} records
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {log.timestamp} ({log.duration})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Menampilkan {filteredLogs.length} entri audit terbaru</span>
            <span className="font-mono">Sub-50ms Indexed Query</span>
          </div>
        </div>
      </div>
    </div>
  );
}
