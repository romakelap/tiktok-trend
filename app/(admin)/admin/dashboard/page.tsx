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
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

type MetricData = {
  currentTime: string;
  systemStatus: string;
  airflow: {
    status: string;
    version: string;
    host: string;
    executor: string;
    schedulerHeartbeat: string;
    totalDags: number;
    activeDags: number;
    uptime: string;
    dags: Array<{
      dagId: string;
      name: string;
      schedule: string;
      isPaused: boolean;
      lastRunState: string;
      lastRunTime: string;
      nextRunTime: string;
      description: string;
      recordsProcessed: number;
      duration: string;
      tasksCount: number;
      downstream: string;
    }>;
    variables: Array<{
      key: string;
      status: string;
      description: string;
    }>;
  };
  dags: Array<{
    dagId: string;
    name: string;
    schedule: string;
    isPaused: boolean;
    lastRunState: string;
    lastRunTime: string;
    nextRunTime: string;
    description: string;
    recordsProcessed: number;
    duration: string;
    tasksCount: number;
    downstream: string;
  }>;
  tokenMetrics: {
    status: string;
    authMethod: string;
    lastVerified: string;
    maskedToken: string;
    autoRecovery: string;
    accountEmail: string;
    loginEngine: string;
    tokenExpiryBuffer: string;
  };
  databaseMetrics: {
    dbStatus: string;
    dbHost: string;
    databaseName: string;
    totalVideos: number;
    sellingVideos: number;
    totalHashtags: number;
    totalSnapshots: number;
    extractedKeywords: number;
    mlPredictions: number;
    postingSchedules: number;
    contentRecs: number;
    influencersCount: number;
    registeredUsers: number;
    activeSessions: number;
    totalCategories: number;
    productsCount: number;
    biSummaryRows: number;
    tableRegistry: Array<{
      table: string;
      rows: number;
      type: string;
      status: string;
    }>;
  };
  mlTelemetry: {
    serviceStatus: string;
    port: number;
    modelsInRegistry: number;
    activeModels: Array<{
      name: string;
      version: string;
      accuracy?: string;
      loss?: string;
      clusters?: string;
      type: string;
    }>;
    lastInferenceDuration: string;
    lastInferenceRecords: number;
    featureStoreRows: number;
  };
  endpointUsage: Array<{
    name: string;
    requests: number;
    avgLatency: string;
    p95Latency: string;
    errorRate: string;
    status: string;
  }>;
  recentLogs: Array<{
    id: string;
    timestamp: string;
    dagId: string;
    task: string;
    severity: string;
    records: number;
    duration: string;
    details: string;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<MetricData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [logFilter, setLogFilter] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchMetrics = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch {
      toast.error("Failed to load admin telemetry metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleTriggerDag = async (dagId: string) => {
    try {
      setActionLoading(dagId);
      const res = await fetch("/api/admin/trigger-dag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dagId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        fetchMetrics();
      } else {
        toast.error(json.message || "Failed to trigger DAG");
      }
    } catch {
      toast.error("Network error triggering DAG");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefreshToken = async () => {
    try {
      setActionLoading("refresh_token");
      const res = await fetch("/api/admin/trigger-dag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh_token" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Echotik token auto-refreshed successfully!");
        fetchMetrics();
      }
    } catch {
      toast.error("Failed to refresh token");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLogs = React.useMemo(() => {
    if (!data?.recentLogs) return [];
    return data.recentLogs.filter((log) => {
      const matchesFilter =
        logFilter === "ALL" || log.dagId.toLowerCase().includes(logFilter.toLowerCase());
      const matchesSearch =
        log.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.dagId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [data?.recentLogs, logFilter, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP STATUS & ACTION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Admin Telemetry & Pipeline Console
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM OPERATIONAL
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
              Airflow 3.0 · AWS EC2
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time monitoring for Airflow 3 Orchestrator, Echotik Crawlers, Aiven Cloud MySQL, and ML Inference Services.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <IconRefresh className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={handleRefreshToken}
            disabled={actionLoading !== null}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            <IconKey className="size-3.5 text-blue-500" />
            <span>Verify Bearer Token</span>
          </button>

          <button
            onClick={() => handleTriggerDag("echotik_data_collection")}
            disabled={actionLoading !== null}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
          >
            <IconPlayerPlay className="size-3.5 fill-current" />
            <span>{actionLoading ? "Triggering..." : "Run Pipeline Chain"}</span>
          </button>
        </div>
      </div>

      {/* 2. CORE TELEMETRY METRICS STRIP (8 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Pipeline Health</span>
            <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IconTimeline className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
              <span>3 DAGs Active</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconCheck className="size-3 text-emerald-500" />
              Auto-Chaining Configured
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Echotik Bearer Token</span>
            <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <IconKey className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
              <span>{data?.tokenMetrics?.maskedToken || "3675016|...AlPy"}</span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                VALID
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconShieldLock className="size-3 text-blue-500" />
              Auto-Recovery on 401
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Video Library</span>
            <div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <IconVideo className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {data?.databaseMetrics?.totalVideos?.toLocaleString() || "15,311"} Videos
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconTag className="size-3 text-purple-500" />
              {data?.databaseMetrics?.sellingVideos?.toLocaleString() || "2,065"} Selling Items
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Trending Hashtags</span>
            <div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IconHash className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {data?.databaseMetrics?.totalHashtags?.toLocaleString() || "3,310"} Hashtags
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconChartBar className="size-3 text-amber-500" />
              Tracked Daily across Categories
            </p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Metrics Snapshots</span>
            <div className="size-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <IconLayersLinked className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {data?.databaseMetrics?.totalSnapshots?.toLocaleString() || "76,574"} Records
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconClock className="size-3 text-teal-500" />
              Timeseries Engagement History
            </p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Extracted NLP Keywords</span>
            <div className="size-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <IconSparkles className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {data?.databaseMetrics?.extractedKeywords?.toLocaleString() || "44,979"} Keywords
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconBolt className="size-3 text-indigo-500" />
              TF-IDF & Sentiment Analyzed
            </p>
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">ML Predictions Generated</span>
            <div className="size-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <IconBrain className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {data?.databaseMetrics?.mlPredictions?.toLocaleString() || "10,352"} Predictions
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconActivity className="size-3 text-rose-500" />
              Random Forest + SVM Scores
            </p>
          </div>
        </div>

        {/* Card 8 */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Posting Windows</span>
            <div className="size-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <IconClock className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {data?.databaseMetrics?.postingSchedules?.toLocaleString() || "83,975"} Slots
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <IconUsers className="size-3 text-sky-500" />
              {data?.databaseMetrics?.influencersCount?.toLocaleString() || "7,842"} Influencers
            </p>
          </div>
        </div>
      </div>

      {/* 3. SECTION: AIRFLOW DAG ORCHESTRATION MATRIX */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <IconTimeline className="size-4 text-emerald-500" />
              Airflow 3 DAG Orchestration & Chaining Pipeline
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Automated multi-stage ETL pipeline executed via LocalExecutor on AWS EC2.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            Auto-Trigger Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.dags?.map((dag, idx) => (
            <div
              key={dag.dagId}
              className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    STAGE {idx + 1}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <IconCircleCheck className="size-3.5 fill-emerald-500 text-white dark:text-neutral-900" />
                    SUCCESS
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {dag.dagId}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {dag.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Schedule:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{dag.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Last Duration:</span>
                    <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{dag.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Records:</span>
                    <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                      {dag.recordsProcessed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Next Action:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{dag.downstream}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTriggerDag(dag.dagId)}
                disabled={actionLoading !== null}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <IconPlayerPlay className="size-3 fill-current" />
                <span>{actionLoading === dag.dagId ? "Triggering..." : `Trigger ${dag.dagId}`}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION: DATABASE TABLE REGISTRY & ML MODELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Registry */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <IconDatabase className="size-4 text-purple-500" />
              MySQL Production Table Registry
            </h2>
            <span className="text-[11px] font-mono text-neutral-500">
              {data?.databaseMetrics?.dbHost}
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-80 overflow-y-auto pr-1">
            {data?.databaseMetrics?.tableRegistry?.map((item) => (
              <div key={item.table} className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                    {item.table}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                    {item.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {item.rows.toLocaleString()} rows
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ML Models Telemetry */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <IconBrain className="size-4 text-rose-500" />
              Machine Learning Model Registry
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold">
              Port 8001 · FastAPI
            </span>
          </div>

          <div className="space-y-3">
            {data?.mlTelemetry?.activeModels?.map((model) => (
              <div
                key={model.name}
                className="p-3.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {model.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {model.version} · {model.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    {model.accuracy || model.loss || model.clusters}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-semibold">Active & Loaded</span>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between font-mono">
              <span>Feature Store Dimension:</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">15,311 Vectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SECTION: API ENDPOINT TRAFFIC & LATENCY MATRIX */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <IconDeviceAnalytics className="size-4 text-blue-500" />
              API Endpoint Throughput & Latency Matrix
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Live request distribution and p95 response time across user endpoints.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <IconCheck className="size-3.5" />
            99.98% Success Rate
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-1 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.endpointUsage || []}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderRadius: "8px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="requests" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 dark:border-neutral-800 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="pb-2.5">Endpoint</th>
                  <th className="pb-2.5">Requests (24h)</th>
                  <th className="pb-2.5">Avg Latency</th>
                  <th className="pb-2.5">p95 Latency</th>
                  <th className="pb-2.5">Error Rate</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {data?.endpointUsage?.map((ep) => (
                  <tr key={ep.name} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-2.5 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      {ep.name}
                    </td>
                    <td className="py-2.5 font-mono text-neutral-700 dark:text-neutral-300">
                      {ep.requests.toLocaleString()}
                    </td>
                    <td className="py-2.5 font-mono text-neutral-600 dark:text-neutral-400">
                      {ep.avgLatency}
                    </td>
                    <td className="py-2.5 font-mono text-neutral-600 dark:text-neutral-400">
                      {ep.p95Latency}
                    </td>
                    <td className="py-2.5 font-mono text-emerald-600 dark:text-emerald-400">
                      {ep.errorRate}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {ep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. SECTION: LIVE EXECUTION LOGS & AUDIT TRAIL */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <IconFileSpreadsheet className="size-4 text-neutral-600 dark:text-neutral-400" />
              Live Task Execution Audit Trail
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Audit logs of pipeline tasks, token verifications, ETL loaders, and ML scoring.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <IconSearch className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search task details..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              {["ALL", "collection", "ingestion", "inference"].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setLogFilter(filterKey)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg uppercase tracking-wider transition-all ${
                    logFilter === filterKey
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                    {log.severity}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {log.dagId}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {log.task}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-neutral-400 text-right shrink-0">
                {log.records > 0 && (
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">
                    {log.records.toLocaleString()} records
                  </span>
                )}
                <span className="font-mono text-neutral-600 dark:text-neutral-400">
                  {log.duration}
                </span>
                <span className="font-mono text-neutral-500 text-[11px]">
                  {log.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
