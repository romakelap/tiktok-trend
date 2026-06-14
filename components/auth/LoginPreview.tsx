"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { AuthPanelBg } from "./AuthPanelBg";

const BAR_HEIGHTS = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];

/**
 * Decorative preview card shown on the dark side of the login page.
 * No interactive controls — purely marketing chrome.
 */
export function LoginPreview() {
  return (
    <>
      <AuthPanelBg variant="dark" trackMouse />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Headline */}
        <div className="mb-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                background: "#fff",
                boxShadow:
                  "0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.4)",
              }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Welcome back
            </span>
          </div>
          <h2
            className="text-4xl font-black text-white leading-tight mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Your analytics
            <br />
            <span
              style={{
                fontStyle: "italic",
                color: "#ccc",
                textShadow: "0 0 30px rgba(255,255,255,0.2)",
              }}
            >
              awaits you
            </span>
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.42)" }}>
            Access your dashboard and continue growing your TikTok presence.
          </p>
        </div>

        {/* Dashboard Preview Card */}
        <div
          className="p-6 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow:
              "0 0 50px rgba(255,255,255,0.03), 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Total Engagement
              </p>
              <p
                className="text-4xl font-black text-white"
                style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}
              >
                2.4M
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 0 20px rgba(255,255,255,0.1)",
              }}
            >
              <BarChart3 className="w-6 h-6 text-white" strokeWidth={1.8} />
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="flex items-end gap-1.5 h-20 mb-4">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  background:
                    i >= 9
                      ? "rgba(255,255,255,0.9)"
                      : i >= 6
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(255,255,255,0.08)",
                  boxShadow:
                    i >= 9
                      ? "0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2)"
                      : "none",
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Last 12 months
            </span>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "0 0 14px rgba(255,255,255,0.1)",
              }}
            >
              <TrendingUp className="w-3 h-3 text-white" />
              <span
                className="text-xs font-black"
                style={{
                  color: "#fff",
                  textShadow: "0 0 8px rgba(255,255,255,0.8)",
                }}
              >
                +127%
              </span>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2">
          {[
            "Real-time Data",
            "AI Insights",
            "Trend Detection",
            "Competitor Analysis",
          ].map((f, i) => (
            <div
              key={f}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background:
                  i === 0
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.05)",
                border:
                  i === 0
                    ? "1px solid rgba(255,255,255,0.28)"
                    : "1px solid rgba(255,255,255,0.1)",
                color: i === 0 ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow:
                  i === 0 ? "0 0 16px rgba(255,255,255,0.08)" : "none",
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { value: "50M+", label: "Videos", bright: true },
            { value: "10K+", label: "Users", bright: false },
            { value: "99.9%", label: "Uptime", bright: false },
          ].map((s) => (
            <div
              key={s.label}
              className="p-3 rounded-2xl text-center"
              style={{
                background: s.bright
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.04)",
                border: s.bright
                  ? "1px solid rgba(255,255,255,0.24)"
                  : "1px solid rgba(255,255,255,0.09)",
                boxShadow: s.bright
                  ? "0 0 20px rgba(255,255,255,0.07)"
                  : "none",
              }}
            >
              <p
                className="text-lg font-black text-white"
                style={{
                  textShadow: s.bright
                    ? "0 0 12px rgba(255,255,255,0.6)"
                    : "0 0 6px rgba(255,255,255,0.2)",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
