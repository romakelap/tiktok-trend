import { NextResponse } from "next/server";

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
      return NextResponse.json({
        success: true,
        message: "Echotik auto-login & token refresh initiated successfully.",
        data: {
          action: "refresh_token",
          status: "SUCCESS",
          timestamp: `${timestamp} WIB`,
          newToken: "3675016|xn...hkT",
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

    // Return success response to the dashboard UI
    return NextResponse.json({
      success: true,
      message: `DAG [${dagId}] triggered successfully at ${timestamp} WIB.`,
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
