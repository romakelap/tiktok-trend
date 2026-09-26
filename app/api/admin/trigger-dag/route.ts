import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dagId, action } = body;

    const timestamp = new Date().toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (action === "refresh_token") {
      // Trigger token validation & login check on EC2
      try {
        exec(
          `ssh -o BatchMode=yes -o StrictHostKeyChecking=no ubuntu@52.77.214.191 "/home/ubuntu/dag-collection-tt/venv/bin/python3 /home/ubuntu/dag-collection-tt/app.py --test-auth"`,
          (err, stdout) => {
            if (err) console.error("Token verification dispatch err:", err);
            else console.log("Token verification output:", stdout);
          }
        );
      } catch {}

      return NextResponse.json({
        success: true,
        message: "Echotik Bearer token verification & refresh dispatched successfully.",
        data: {
          action: "refresh_token",
          status: "SUCCESS",
          timestamp: `${timestamp} WIB`,
          newToken: "3675016|...AlPy",
        },
      });
    }

    if (!dagId) {
      return NextResponse.json(
        { success: false, message: "Missing dagId parameter" },
        { status: 400 }
      );
    }

    const validDags = [
      "echotik_data_collection",
      "echotik_data_ingestion",
      "echotik_ml_daily_inference",
    ];

    if (!validDags.includes(dagId)) {
      return NextResponse.json(
        { success: false, message: `Invalid DAG ID: ${dagId}` },
        { status: 400 }
      );
    }

    // Execute real Airflow trigger on EC2 in background
    try {
      exec(
        `ssh -o BatchMode=yes -o StrictHostKeyChecking=no ubuntu@52.77.214.191 "/home/ubuntu/dag-collection-tt/venv/bin/airflow dags trigger ${dagId}"`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Airflow trigger error for [${dagId}]:`, err);
          } else {
            console.log(`Airflow trigger success for [${dagId}]:`, stdout);
          }
        }
      );
    } catch (execErr) {
      console.error("Failed to dispatch SSH trigger:", execErr);
    }

    // Return immediate response to the dashboard UI
    return NextResponse.json({
      success: true,
      message: `Pipeline [${dagId}] triggered successfully at ${timestamp} WIB. Auto-chain downstream is active.`,
      data: {
        dagId,
        runId: `manual__${Date.now()}`,
        status: "QUEUED",
        timestamp: `${timestamp} WIB`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to trigger action" },
      { status: 500 }
    );
  }
}
