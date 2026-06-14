"use client";

import { useState } from "react";
import {
  Activity,
  AlertCircle,
  Brain,
  CircleCheck,
  Clock,
  Combine,
  DollarSign,
  Flame,
  Lightbulb,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import {
  CATEGORIES,
  COMBINATION_INSIGHTS,
  FRONTEND_TO_BACKEND_CAT,
} from "@/lib/dashboard/mock-data";
import { getCombinationKey } from "@/lib/dashboard/formatters";
import type {
  CategoryId,
  CombinationInsight,
} from "@/lib/dashboard/types";
import { CategorySelect } from "./CategorySelect";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { fmtPct, fmtRp } from "@/lib/dashboard/formatters";

function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-sm font-black text-white mt-4 mb-2">
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("#### ")) {
      return (
        <h4 key={idx} className="text-xs font-black text-white/80 mt-3 mb-1.5">
          {line.replace("#### ", "")}
        </h4>
      );
    }
    if (line.trim().startsWith("- ")) {
      const content = line.trim().replace("- ", "");
      return (
        <div key={idx} className="flex items-start gap-2 ml-3 my-1 text-xs leading-relaxed">
          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.55)" }} />
          <p className="text-white/70">{parseBoldText(content)}</p>
        </div>
      );
    }
    if (line.trim() === "") return <div key={idx} className="h-2" />;
    return (
      <p key={idx} className="text-xs my-1 leading-relaxed text-white/75">
        {parseBoldText(line)}
      </p>
    );
  });
}

/** Pair two categories and surface a generated insight for the combination. */
export function CombinationAnalysis() {
  const [catA, setCatA] = useState<CategoryId | "">("");
  const [catB, setCatB] = useState<CategoryId | "">("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CombinationInsight | null>(null);
  const [error, setError] = useState("");

  const catAData = CATEGORIES.find((c) => c.id === catA);
  const catBData = CATEGORIES.find((c) => c.id === catB);

  const handleGenerate = async () => {
    setError("");
    if (!catA || !catB) {
      setError("Pilih dua kategori terlebih dahulu.");
      return;
    }
    if (catA === catB) {
      setError("Kategori A dan B tidak boleh sama.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const backendCatNameA = FRONTEND_TO_BACKEND_CAT[catA];
      const backendCatNameB = FRONTEND_TO_BACKEND_CAT[catB];

      const res = await apiFetch<any>(
        `${API_ENDPOINTS.category.combine}?category1=${backendCatNameA}&category2=${backendCatNameB}`
      );

      if (res.success && res.data) {
        const key = getCombinationKey(catA, catB);
        const staticInsight = COMBINATION_INSIGHTS[key];

        const combinedMetrics = res.data.combinedMetrics;
        const bestPostingTimes = res.data.bestPostingTimes;

        const timeOverlap =
          bestPostingTimes && bestPostingTimes.length > 0
            ? `${bestPostingTimes[0].dayName} pukul ${bestPostingTimes[0].hourOfDay.toString().padStart(2, "0")}:00`
            : staticInsight?.timeOverlap || "N/A";

        setResult({
          engagementRange: `${(combinedMetrics.avgEngagementRate * 100).toFixed(2)}%`,
          viralPotential: fmtPct(combinedMetrics.avgViralScore),
          revenuePotential: fmtRp(combinedMetrics.totalGmvLocal ?? 0),
          timeOverlap,
          hashtags: res.data.topHashtags && res.data.topHashtags.length > 0
            ? res.data.topHashtags.map((h: any) => h.hashtag)
            : (staticInsight?.hashtags || []),
          keywords: res.data.topKeywords && res.data.topKeywords.length > 0
            ? res.data.topKeywords.map((k: any) => k.keyword)
            : (staticInsight?.keywords || []),
          contentDirection: res.data.contentDirection || staticInsight?.contentDirection || "",
          insight: staticInsight?.insight || "Analisis crossover konten berhasil dibuat.",
        });
      } else {
        setError("Gagal mendapatkan insight kombinasi dari server.");
      }
    } catch (err: any) {
      console.error("Combination fetch failed, using fallback:", err);
      // Fallback to static mock data if API fails or backend is unreachable
      const key = getCombinationKey(catA, catB);
      const fallback = COMBINATION_INSIGHTS[key];
      if (fallback) {
        setResult(fallback);
      } else {
        setError("Gagal menghasilkan insight kombinasi kategori.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative rounded-2xl"
      style={{
        background: TOKENS.charcoal,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}
    >
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <GridBg theme="dark" />
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Combine className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-black text-base text-white tracking-tight">
              Category Combination Analysis
            </h2>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Gabungkan dua kategori untuk insight konten terbaik
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3 mb-4 flex-wrap">
          <CategorySelect
            value={catA}
            onChange={(v) => {
              setCatA(v);
              setResult(null);
            }}
            label="Kategori A"
            exclude={catB}
          />
          <div
            className="flex items-center justify-center w-8 h-10 font-black text-sm pb-0"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            +
          </div>
          <CategorySelect
            value={catB}
            onChange={(v) => {
              setCatB(v);
              setResult(null);
            }}
            label="Kategori B"
            exclude={catA}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="h-10 px-5 rounded-xl font-black text-sm text-black flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{
              background: "#fff",
              boxShadow: "0 4px 16px rgba(255,255,255,0.2)",
            }}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                Generate Insight
              </>
            )}
          </button>
        </div>

        {error ? (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
            style={{
              background: "rgba(220,38,38,0.12)",
              border: "1px solid rgba(220,38,38,0.2)",
            }}
          >
            <AlertCircle className="w-4 h-4 text-red-400" strokeWidth={2.5} />
            <p className="text-sm font-bold text-red-300">{error}</p>
          </div>
        ) : null}

        {result && catAData && catBData ? (
          <CombinationResult
            result={result}
            catA={catAData}
            catB={catBData}
          />
        ) : null}
      </div>
    </div>
  );
}

function CombinationResult({
  result,
  catA,
  catB,
}: {
  result: CombinationInsight;
  catA: (typeof CATEGORIES)[number];
  catB: (typeof CATEGORIES)[number];
}) {
  const metrics = [
    {
      label: "Expected Engagement",
      value: result.engagementRange,
      Ico: Activity,
    },
    { label: "Viral Potential", value: result.viralPotential, Ico: Flame },
    {
      label: "Revenue Potential",
      value: result.revenuePotential,
      Ico: DollarSign,
    },
    { label: "Best Time Overlap", value: result.timeOverlap, Ico: Clock },
  ];

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: catA.tint,
              border: `1px solid ${catA.color}33`,
            }}
          >
            <catA.Ico
              className="w-3.5 h-3.5"
              style={{ color: catA.color }}
              strokeWidth={2.2}
            />
          </div>
          <span className="text-white font-black text-sm">{catA.label}</span>
          <span
            className="font-bold"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            +
          </span>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: catB.tint,
              border: `1px solid ${catB.color}33`,
            }}
          >
            <catB.Ico
              className="w-3.5 h-3.5"
              style={{ color: catB.color }}
              strokeWidth={2.2}
            />
          </div>
          <span className="text-white font-black text-sm">{catB.label}</span>
        </div>
        <div
          className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <CircleCheck
            className="w-3.5 h-3.5"
            style={{ color: "#6ee7b7" }}
            strokeWidth={2.5}
          />
          <span
            className="text-[10px] font-black"
            style={{ color: "#a7f3d0" }}
          >
            Insight Ready
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-[9px] font-black uppercase tracking-wider mb-1.5"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {m.label}
              </p>
              <p className="font-black text-sm text-white leading-tight">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <p
              className="text-[9px] font-black uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Recommended Hashtags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-black"
                  style={{
                    background: "rgba(14,165,233,0.15)",
                    color: "#7dd3fc",
                    border: "1px solid rgba(14,165,233,0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-[9px] font-black uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Recommended Keywords
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-md text-[10px] font-black"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mb-5 p-4 rounded-xl"
          style={{
            background: "rgba(16,185,129,0.05)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <Lightbulb
              className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400"
              strokeWidth={2.5}
            />
            <div className="w-full">
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Crossover Content Strategy
              </p>
              <div className="space-y-1">
                {renderMarkdown(result.contentDirection)}
              </div>
            </div>
          </div>
        </div>

        <div
          className="px-4 py-3.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <Brain
              className="w-4 h-4 flex-shrink-0 mt-0.5 text-white opacity-70"
              strokeWidth={2}
            />
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {result.insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
