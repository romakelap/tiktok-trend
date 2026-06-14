"use client";

import { Film, Star, TrendingUp, Users, UserRound } from "lucide-react";
import { AuthPanelBg } from "./AuthPanelBg";

const BAR_HEIGHTS = [28, 42, 33, 58, 48, 72, 62, 88, 68, 100, 83, 94];

/**
 * Decorative preview shown on the dark side of the signup page.
 */
export function SignupPreview() {
  return (
    <>
      <AuthPanelBg variant="dark" trackMouse />

      <div className="relative z-10 w-full max-w-md space-y-5">
        {/* Headline */}
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
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
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Why creators choose us
            </span>
          </div>
          <h2
            className="text-4xl font-black text-white leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Grow faster with
            <br />
            <span
              style={{
                fontStyle: "italic",
                color: "#ccc",
                textShadow:
                  "0 0 30px rgba(255,255,255,0.25), 0 0 60px rgba(255,255,255,0.1)",
              }}
            >
              data-driven
            </span>{" "}
            decisions
          </h2>
        </div>

        {/* Analytics Card */}
        <div
          className="p-6 rounded-3xl transition-all duration-500 hover:scale-[1.01]"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow:
              "0 0 50px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 0 18px rgba(255,255,255,0.1)",
                }}
              >
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Growth Analytics</p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Last 30 days
                </p>
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 0 16px rgba(255,255,255,0.15)",
              }}
            >
              <span
                className="text-xs font-black"
                style={{
                  color: "#fff",
                  textShadow: "0 0 10px rgba(255,255,255,0.8)",
                }}
              >
                +847%
              </span>
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-16 mb-4">
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
                        ? "rgba(255,255,255,0.28)"
                        : "rgba(255,255,255,0.07)",
                  boxShadow:
                    i >= 9
                      ? "0 0 12px rgba(255,255,255,0.5), 0 0 24px rgba(255,255,255,0.2)"
                      : "none",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "73%",
                  background: "linear-gradient(to right, #555, #fff)",
                  boxShadow: "0 0 10px rgba(255,255,255,0.6)",
                }}
              />
            </div>
            <span
              className="text-xs font-black"
              style={{
                color: "#fff",
                textShadow: "0 0 8px rgba(255,255,255,0.7)",
              }}
            >
              73%
            </span>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              value: "10K+",
              label: "Active Users",
              Icon: Users,
              delay: "0.35s",
              bright: true,
            },
            {
              value: "50M+",
              label: "Videos Analyzed",
              Icon: Film,
              delay: "0.8s",
              bright: false,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-2xl text-center"
              style={{
                background: s.bright
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                border: s.bright
                  ? "1px solid rgba(255,255,255,0.28)"
                  : "1px solid rgba(255,255,255,0.14)",
                boxShadow: s.bright
                  ? "0 0 28px rgba(255,255,255,0.1)"
                  : "none",
                animation: `float 5s ease-in-out infinite ${s.delay}`,
              }}
            >
              <div className="flex justify-center mb-2">
                <s.Icon className="w-6 h-6 text-white" strokeWidth={1.6} style={{ opacity: 0.85 }} />
              </div>
              <p
                className="text-2xl font-black mb-1"
                style={{
                  color: "#fff",
                  textShadow: s.bright
                    ? "0 0 16px rgba(255,255,255,0.7)"
                    : "0 0 8px rgba(255,255,255,0.3)",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div
          className="p-5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.14)",
            animation: "float 7s ease-in-out infinite 1s",
          }}
        >
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                fill="white"
                strokeWidth={0}
                style={{
                  color: "#fff",
                  filter: "drop-shadow(0 0 4px rgba(255,255,255,0.6))",
                }}
              />
            ))}
          </div>
          <p
            className="text-sm italic mb-4"
            style={{ color: "rgba(255,255,255,0.52)" }}
          >
            &ldquo;Grew from 10K to 500K in 3 months. The trend insights are
            insanely accurate!&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 0 14px rgba(255,255,255,0.12)",
              }}
            >
              <UserRound className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sarah Chen</p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                Content Creator · 500K followers
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
