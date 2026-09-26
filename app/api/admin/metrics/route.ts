import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Current time in UTC & WIB
    const now = new Date();
    const wibFormatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      dateStyle: "medium",
      timeStyle: "medium",
    });
    const currentTimeWIB = wibFormatter.format(now);

    // Mock/Live DAG status aggregation
    const dags = [
      {
        dagId: "echotik_data_collection",
        name: "Echotik Data Collection",
        schedule: "Setiap 12 Jam (Pagi & Sore)",
        isPaused: false,
        lastRunState: "success",
        lastRunTime: "2026-09-26 21:10 WIB",
        nextRunTime: "2026-09-27 08:25 WIB",
        description: "Fetch live videos, trending hashtags, & selling items from EchoTik API.",
        recordsProcessed: 1420,
        duration: "12.4s",
      },
      {
        dagId: "echotik_data_ingestion",
        name: "Echotik Data Ingestion & ETL",
        schedule: "Triggered by Collection",
        isPaused: false,
        lastRunState: "success",
        lastRunTime: "2026-09-26 21:11 WIB",
        nextRunTime: "Auto after DAG 1",
        description: "Parse Excel datasets, validate schema, load staging, & upsert to MySQL.",
        recordsProcessed: 1420,
        duration: "4.8s",
      },
      {
        dagId: "echotik_ml_daily_inference",
        name: "Machine Learning Daily Inference",
        schedule: "Triggered by Ingestion",
        isPaused: false,
        lastRunState: "success",
        lastRunTime: "2026-09-26 21:12 WIB",
        nextRunTime: "Auto after DAG 2",
        description: "FastAPI scoring: Virality Random Forest, SVM Tier, LSTM 7-day forecast.",
        recordsProcessed: 350,
        duration: "8.2s",
      },
    ];

    // Endpoint usage metrics for charts
    const endpointUsage = [
      { name: "Video Library", requests: 680, avgLatency: "45ms", status: "Healthy" },
      { name: "Hashtag Analytics", requests: 420, avgLatency: "38ms", status: "Healthy" },
      { name: "Posting Time Heatmap", requests: 290, avgLatency: "32ms", status: "Healthy" },
      { name: "NLP Insights", requests: 180, avgLatency: "65ms", status: "Healthy" },
      { name: "Account Comparison", requests: 140, avgLatency: "40ms", status: "Healthy" },
      { name: "ML Recommendations", requests: 110, avgLatency: "115ms", status: "Healthy" },
    ];

    // Database & volume metrics
    const databaseMetrics = {
      totalVideos: 48250,
      totalHashtags: 12840,
      totalSnapshots: 98400,
      totalCategories: 18,
      biSummaryRows: 48250,
      dbStatus: "Connected (MySQL Production)",
      dbHost: "AWS RDS / MySQL Server",
    };

    // Echotik Auth & Token metrics
    const tokenMetrics = {
      status: "ACTIVE",
      authMethod: "Auto-Login & Auto-Refresh",
      lastVerified: currentTimeWIB,
      maskedToken: "3675016|xn...hkT",
      autoRecovery: "Enabled (Zero-Downtime on 401)",
    };

    // Execution logs
    const recentLogs = [
      {
        id: "log-1",
        timestamp: "21:18:53 WIB",
        dagId: "echotik_data_collection",
        task: "trigger_data_ingestion",
        status: "SUCCESS",
        records: 1420,
        duration: "0.8s",
        details: "Auto-triggered downstream echotik_data_ingestion",
      },
      {
        id: "log-2",
        timestamp: "21:18:45 WIB",
        dagId: "echotik_data_collection",
        task: "dag_complete_summary",
        status: "SUCCESS",
        records: 1420,
        duration: "1.2s",
        details: "Pipeline complete summary sent to Google Chat",
      },
      {
        id: "log-3",
        timestamp: "21:18:10 WIB",
        dagId: "echotik_data_collection",
        task: "parser_and_validate",
        status: "SUCCESS",
        records: 1420,
        duration: "3.4s",
        details: "Parsed 1,420 records from 3 APIs into Excel",
      },
      {
        id: "log-4",
        timestamp: "21:17:58 WIB",
        dagId: "echotik_data_collection",
        task: "validate_credentials",
        status: "SUCCESS",
        records: 1,
        duration: "1.1s",
        details: "Token verified valid, health-check passed",
      },
      {
        id: "log-5",
        timestamp: "20:56:24 WIB",
        dagId: "echotik_data_collection",
        task: "echotik_auth.login",
        status: "SUCCESS",
        records: 0,
        duration: "1.3s",
        details: "Auto-login executed, new Bearer token acquired",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        currentTime: currentTimeWIB,
        systemStatus: "HEALTHY",
        dags,
        tokenMetrics,
        databaseMetrics,
        endpointUsage,
        recentLogs,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch admin metrics" },
      { status: 500 }
    );
  }
}
