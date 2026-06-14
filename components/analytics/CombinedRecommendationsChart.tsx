"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";

type CombinedRecommendationsChartProps = {
  hashtags: { hashtag: string; recommendationScore: number; expectedEngagementRate: number }[];
  postingTimes: { dayName: string; timeLabel: string; expectedEngagementRate: number }[];
  keywords: { keyword: string; avgRelevanceScore: number }[];
  loading: boolean;
};

export function CombinedRecommendationsChart({
  hashtags,
  postingTimes,
  keywords,
  loading,
}: CombinedRecommendationsChartProps) {
  if (loading) {
    return <div className="h-72 rounded-2xl animate-pulse bg-black/[0.04]" />;
  }

  // Build comparison data for Rank 1 to 5
  const chartData = Array.from({ length: 5 }).map((_, idx) => {
    const rank = idx + 1;
    const h = hashtags[idx];
    const p = postingTimes[idx];
    const k = keywords[idx];

    // Scale rates to percentage (e.g., 0.06 -> 6%, 0.24 -> 24%)
    const hashtagScore = h ? parseFloat((h.recommendationScore * 100).toFixed(1)) : 0;
    const hashtagEng = h ? parseFloat((h.expectedEngagementRate * 100).toFixed(2)) : 0;
    const postingEng = p ? parseFloat((p.expectedEngagementRate * 100).toFixed(2)) : 0;
    const keywordRelevance = k ? parseFloat((k.avgRelevanceScore * 100).toFixed(1)) : 0;

    return {
      name: `Rank ${rank}`,
      "Hashtag Score (%)": hashtagScore,
      "Hashtag Eng. Rate (%)": hashtagEng,
      "Posting Time Eng. Rate (%)": postingEng,
      "Keyword Relevance (%)": keywordRelevance,
      hashtagLabel: h ? h.hashtag : "-",
      postingLabel: p ? `${p.dayName} ${p.timeLabel}` : "-",
      keywordLabel: k ? k.keyword : "-",
    };
  });

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.charcoal,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      }}
    >
      <GridBg theme="dark" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-black text-base text-white tracking-tight">
              ML Recommendations Synergy
            </h2>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Komparasi potensi performa dari rekomendasi hashtag, keyword, dan waktu posting teratas
            </p>
          </div>
        </div>

        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.3)"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 700, fill: "rgba(255,255,255,0.45)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fontWeight: 700, fill: "rgba(255,255,255,0.4)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#111",
                }}
                formatter={(value: any, name: string, props: any) => {
                  const labelMap: Record<string, string> = {
                    "Hashtag Score (%)": `Hashtag: ${props.payload.hashtagLabel}`,
                    "Hashtag Eng. Rate (%)": `Hashtag: ${props.payload.hashtagLabel}`,
                    "Posting Time Eng. Rate (%)": `Slot: ${props.payload.postingLabel}`,
                    "Keyword Relevance (%)": `Keyword: "${props.payload.keywordLabel}"`,
                  };
                  const detail = labelMap[name] || "";
                  return [`${value}%`, `${name} (${detail})`];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 10 }}
                onClick={() => {}}
              />
              <Line
                type="monotone"
                dataKey="Posting Time Eng. Rate (%)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Hashtag Score (%)"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Keyword Relevance (%)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
