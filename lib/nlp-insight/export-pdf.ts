/**
 * NLP Insight PDF Export — Clean editorial layout.
 * Fixed: arrow chars, double-hash, duplicate dayName, column widths.
 * Design: monochrome, indigo accent, section banners instead of full dark pages.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type NlpExportData = {
  mainAccountName: string;
  competitorNames: string[];
  period: string;
  nlpSummaryText: string;
  contentTrendData: any[];
  hashtagRecs: any[];
  postingRecs: any[];
  mainKeywords: any[];
  competitorKeywords: any[];
  competitorStatsMap: Record<string, any>;
  comparativeData: any;
  accounts: any[];
};

// ── Design tokens ─────────────────────────────────────────────────────
const C = {
  black:   "#0A0A0A", ink:     "#1A1A1A", graphite: "#404040",
  body:    "#525252", muted:   "#A3A3A3", faint:    "#D4D4D4",
  rule:    "#E5E5E5", soft:    "#F0F0F0", cream:    "#FAFAFA",
  paper:   "#FFFFFF",
  accent:  "#5B5BD6", accentS: "#8B8BE8", accentT:  "#EEEEFB",
  pos:     "#15803D", warn:    "#B45309", neg:      "#B91C1C",
};

const M = { l: 20, r: 20, t: 20, b: 20 };
const F = { s: "helvetica", f: "times" };

// ── Utilities ─────────────────────────────────────────────────────────
function rgb(hex: string): [number,number,number] {
  const h = hex.replace("#","");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function pw(doc: jsPDF) { return doc.internal.pageSize.getWidth(); }
function ph(doc: jsPDF) { return doc.internal.pageSize.getHeight(); }
function cw(doc: jsPDF) { return pw(doc) - M.l - M.r; }
function guard(doc: jsPDF, y: number, need: number, extra = 0): number {
  if (y + need > ph(doc) - M.b - 8) {
    doc.addPage();
    drawPageHeader(doc);
    return M.t + 14 + extra;
  }
  return y;
}
function fmtPct(n: number): string {
  if (!n || isNaN(n)) return "—";
  return `${(n * 100).toFixed(2)}%`;
}
function fmtNum(n: number): string {
  if (!n || isNaN(n)) return "—";
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+"M";
  if (n >= 1_000) return (n/1_000).toFixed(1)+"K";
  return n.toLocaleString("id-ID");
}
function dateStr(): string {
  return new Date().toLocaleString("en-GB", { day:"2-digit", month:"long", year:"numeric" });
}
function trendLabel(dir: string): string {
  if (dir === "rising")   return "Naik Tren";
  if (dir === "declining") return "Menurun";
  return "Stabil";
}
function trendColor(dir: string): string {
  if (dir === "rising")   return C.pos;
  if (dir === "declining") return C.neg;
  return C.warn;
}
function cleanHashtag(h: string): string {
  if (!h) return "";
  return h.startsWith("#") ? h : "#" + h;
}

// ── Running header / footer ───────────────────────────────────────────
function drawPageHeader(doc: jsPDF) {
  const W = pw(doc);
  doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
  doc.line(M.l, M.t - 4, W - M.r, M.t - 4);
  doc.setFontSize(6.5); doc.setFont(F.s, "bold"); doc.setTextColor(C.ink);
  doc.text("TikTok BI  ·  NLP Insight Report", M.l, M.t - 7);
  doc.setFont(F.s, "normal"); doc.setTextColor(C.muted);
  doc.text(dateStr(), W - M.r, M.t - 7, { align: "right" });
}

function drawPageFooter(doc: jsPDF, num: number, total: number, section: string) {
  const W = pw(doc); const H = ph(doc); const fy = H - M.b + 8;
  doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
  doc.line(M.l, H - M.b + 3, W - M.r, H - M.b + 3);
  doc.setFontSize(6.5); doc.setFont(F.s, "normal"); doc.setTextColor(C.muted);
  doc.text(section, M.l, fy);
  doc.setFont(F.s, "bold"); doc.setTextColor(C.graphite);
  doc.text("TikTok BI NLP Report", W / 2, fy, { align: "center" });
  doc.setFont(F.f, "bold"); doc.setFontSize(7.5); doc.setTextColor(C.ink);
  doc.text(`${String(num).padStart(2,"0")} / ${String(total).padStart(2,"0")}`, W - M.r, fy, { align: "right" });
}

// ── Section banner (replaces full dark divider page) ──────────────────
function drawSectionBanner(doc: jsPDF, num: string, title: string, subtitle: string): number {
  doc.addPage();
  drawPageHeader(doc);
  const W = pw(doc); const CW = cw(doc);
  const bannerY = M.t + 10; const bannerH = 32;

  // Dark banner
  doc.setFillColor(C.ink);
  doc.rect(M.l, bannerY, CW, bannerH, "F");

  // Indigo left accent
  doc.setFillColor(...rgb(C.accent));
  doc.rect(M.l, bannerY, 3, bannerH, "F");

  // Section number
  doc.setFont(F.f, "bold"); doc.setFontSize(11); doc.setTextColor(...rgb(C.accentS));
  doc.text(`Section ${num}`, M.l + 8, bannerY + 10);

  // Title
  doc.setFont(F.f, "bold"); doc.setFontSize(20); doc.setTextColor(C.paper);
  doc.text(title, M.l + 8, bannerY + 22);

  // Subtitle
  doc.setFont(F.s, "normal"); doc.setFontSize(7.5); doc.setTextColor(...rgb(C.accentS));
  doc.text(subtitle, W - M.r - 2, bannerY + bannerH / 2 + 2, { align: "right", maxWidth: CW * 0.45 });

  return bannerY + bannerH + 10;
}

// ── Sub-section header ────────────────────────────────────────────────
function drawSubHeader(doc: jsPDF, y: number, title: string, meta = ""): number {
  doc.setFont(F.s, "bold"); doc.setFontSize(9.5); doc.setTextColor(C.ink);
  doc.text(title, M.l, y);
  if (meta) {
    doc.setFont(F.s, "normal"); doc.setFontSize(7); doc.setTextColor(C.muted);
    doc.text(meta, pw(doc) - M.r, y, { align: "right" });
  }
  doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
  doc.line(M.l, y + 2.5, pw(doc) - M.r, y + 2.5);
  return y + 10;
}

// ── Stat card ─────────────────────────────────────────────────────────
function statCard(doc: jsPDF, x: number, y: number, w: number, h: number, label: string, value: string, dark = false) {
  if (dark) {
    doc.setFillColor(C.ink);
    doc.roundedRect(x, y, w, h, 2, 2, "F");
  } else {
    doc.setFillColor(C.paper); doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
    doc.roundedRect(x, y, w, h, 2, 2, "FD");
  }
  doc.setFontSize(5.5); doc.setFont(F.s, "bold");
  doc.setTextColor(dark ? "#888888" : C.muted);
  doc.text(label.toUpperCase(), x + 5, y + 6);
  doc.setDrawColor(dark ? "#333333" : C.soft); doc.setLineWidth(0.15);
  doc.line(x + 5, y + 8, x + w - 5, y + 8);
  doc.setFont(F.f, "bold"); doc.setFontSize(15); doc.setTextColor(dark ? C.paper : C.ink);
  doc.text(value, x + 5, y + h - 5);
}

// ── Table config ──────────────────────────────────────────────────────
function tableConf(startY: number, pageCallback?: () => void): any {
  return {
    startY, theme: "plain" as const,
    rowPageBreak: "avoid" as const, showHead: "everyPage" as const,
    headStyles: {
      fillColor: C.ink, textColor: C.paper, fontSize: 7, fontStyle: "bold",
      halign: "left" as const, font: F.s,
      cellPadding: { top: 3.5, right: 4, bottom: 3.5, left: 4 },
    },
    bodyStyles: {
      fontSize: 7.5, textColor: C.graphite, font: F.s,
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
      lineColor: C.rule, lineWidth: { top: 0, right: 0, bottom: 0.15, left: 0 },
    },
    alternateRowStyles: { fillColor: C.cream },
    styles: { lineColor: C.rule, lineWidth: 0, font: F.s, overflow: "linebreak" as const },
    margin: { left: M.l, right: M.r, top: M.t + 8, bottom: M.b + 8 },
    didDrawPage: pageCallback,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ═══════════════════════════════════════════════════════════════════════
export function exportNlpInsightPdf(data: NlpExportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = pw(doc); const H = ph(doc); const CW = cw(doc);

  const sectionMap = new Map<number, string>();
  const rec = (s: string) => sectionMap.set(doc.getNumberOfPages(), s);

  // Pre-compute key values
  const rising = data.contentTrendData.filter((c:any) => c.trendDirection === "rising");
  const top = data.contentTrendData[0];
  const mainTotal = data.contentTrendData.reduce((s:number,c:any) => s+(c.mainAccountVideoCount||0), 0);
  const mainEngW  = data.contentTrendData.reduce((s:number,c:any) => s+(c.mainAccountEngagementRate||0)*(c.mainAccountVideoCount||0), 0);
  const mainAvgEng = mainTotal > 0 ? mainEngW / mainTotal : 0;

  // ──────────────────────────────────────────────────────────────────
  // COVER
  // ──────────────────────────────────────────────────────────────────
  doc.setFillColor(C.paper); doc.rect(0,0,W,H,"F");

  // Dot grid texture
  doc.setFillColor(...rgb(C.faint));
  for (let gx = 0; gx <= W; gx += 8)
    for (let gy = 0; gy <= H; gy += 8)
      doc.circle(gx, gy, 0.1, "F");

  // Top bar
  doc.setFont(F.s,"bold"); doc.setFontSize(8); doc.setTextColor(C.ink);
  doc.text("TikAnalytics", M.l, M.t + 4);
  doc.setFont(F.s,"normal"); doc.setFontSize(6.5); doc.setTextColor(C.muted);
  doc.text(`Edition ${new Date().getFullYear()}`, W - M.r, M.t + 4, { align:"right" });
  doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
  doc.line(M.l, M.t + 7, W - M.r, M.t + 7);

  // Pill badge
  const pillY = H * 0.30;
  doc.setFillColor(C.cream); doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
  doc.roundedRect(M.l, pillY, 68, 6, 3, 3, "FD");
  doc.setFont(F.s,"bold"); doc.setFontSize(6); doc.setTextColor(C.graphite);
  doc.text("NLP  ·  ML Predictive  ·  Content Intelligence", M.l + 4, pillY + 4);

  // Hero headline
  let hy = pillY + 16;
  doc.setFont(F.s,"bold"); doc.setFontSize(40); doc.setTextColor(C.ink);
  doc.text("NLP Insight", M.l, hy);
  hy += 16;
  doc.setFont(F.f,"bolditalic"); doc.setFontSize(42); doc.setTextColor(C.ink);
  doc.text("Report", M.l, hy);

  // Accent underline
  doc.setFillColor(...rgb(C.accent));
  doc.rect(M.l, hy + 4, 24, 1.2, "F");

  // Sub-copy
  doc.setFont(F.s,"normal"); doc.setFontSize(9); doc.setTextColor(C.body);
  const sub = doc.splitTextToSize(
    "AI-generated analysis of content category trends, competitor benchmarking, NLP narrative insights, hashtag strategy, and improvement recommendations.",
    W * 0.58
  );
  doc.text(sub, M.l, hy + 12);

  // Meta cards at bottom
  const mcY = H - M.b - 30; const mcGap = 4;
  const mcW = (CW - mcGap * 3) / 4; const mcH = 20;
  [
    { label:"Main Account", value:`@${data.mainAccountName}` },
    { label:"Competitors",  value: data.competitorNames.length > 0 ? `${data.competitorNames.length} akun` : "—" },
    { label:"Period",       value: data.period === "weekly" ? "7 Hari" : "30 Hari" },
    { label:"Generated",    value: dateStr() },
  ].forEach((m, i) => {
    const x = M.l + i * (mcW + mcGap);
    doc.setFillColor(C.paper); doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
    doc.roundedRect(x, mcY, mcW, mcH, 2, 2, "FD");
    doc.setFont(F.s,"bold"); doc.setFontSize(5.5); doc.setTextColor(C.muted);
    doc.text(m.label.toUpperCase(), x + 4, mcY + 6);
    doc.setDrawColor(C.soft); doc.setLineWidth(0.15);
    doc.line(x + 4, mcY + 8, x + mcW - 4, mcY + 8);
    doc.setFont(F.f,"bold"); doc.setFontSize(9); doc.setTextColor(C.ink);
    doc.text(doc.splitTextToSize(m.value, mcW - 8)[0], x + 4, mcY + mcH - 5);
  });

  // Footer
  doc.setFont(F.s,"bold"); doc.setFontSize(6.5); doc.setTextColor(C.muted);
  doc.text("Tugas Akhir · ITB STIKOM Bali · TikTok BI", M.l, H - M.b);
  doc.text("tiktokbi.report", W - M.r, H - M.b, { align:"right" });

  // ──────────────────────────────────────────────────────────────────
  // TABLE OF CONTENTS
  // ──────────────────────────────────────────────────────────────────
  doc.addPage(); rec("Contents"); drawPageHeader(doc);
  let y = M.t + 16;

  doc.setFont(F.s,"bold"); doc.setFontSize(7); doc.setTextColor(...rgb(C.accent));
  doc.text("INSIDE THIS REPORT", M.l, y);
  y += 8;
  doc.setFont(F.f,"bold"); doc.setFontSize(28); doc.setTextColor(C.ink);
  doc.text("Contents", M.l, y);
  doc.setFillColor(...rgb(C.accent)); doc.rect(M.l, y + 4, 20, 1.2, "F");
  y += 16;

  const tocItems = [
    { num:"01", title:"Executive Summary",
      desc:"NLP-generated narrative from Analytics data · KPI overview · Top category",       page:"p. 4" },
    { num:"02", title:"Benchmark Analysis",
      desc:"Main vs competitor: engagement, videos, category distribution, keyword overlap",   page:"pp. 5–6" },
    { num:"03", title:"Category Analysis",
      desc:"Opportunity score · trend direction · engagement forecast · recommendations",       page:"pp. 7–8" },
    { num:"04", title:"Hashtag & Schedule",
      desc:"ML-ranked hashtag strategy and optimal posting time slots",                        page:"pp. 9–10" },
    { num:"05", title:"Keywords & Strategy",
      desc:"Keyword comparison · AI-driven improvement roadmap",                               page:"pp. 11–12" },
  ];

  tocItems.forEach((item, idx) => {
    if (idx > 0) {
      doc.setDrawColor(C.rule); doc.setLineWidth(0.15);
      doc.line(M.l, y - 4, W - M.r, y - 4);
    }
    // Number
    doc.setFont(F.f,"normal"); doc.setFontSize(22); doc.setTextColor(...rgb(C.accentS));
    doc.text(item.num, M.l, y + 5);
    // Title
    doc.setFont(F.f,"bold"); doc.setFontSize(12); doc.setTextColor(C.ink);
    doc.text(item.title, M.l + 22, y + 1);
    // Desc
    doc.setFont(F.s,"normal"); doc.setFontSize(8); doc.setTextColor(C.body);
    doc.text(item.desc, M.l + 22, y + 8);
    // Page
    doc.setFont(F.s,"bold"); doc.setFontSize(7); doc.setTextColor(C.muted);
    doc.text(item.page, W - M.r, y + 4, { align:"right" });
    y += 20;
  });

  // Methodology note
  doc.setDrawColor(...rgb(C.accent)); doc.setLineWidth(0.4);
  doc.line(M.l, H - M.b - 24, M.l + 10, H - M.b - 24);
  doc.setFont(F.s,"normal"); doc.setFontSize(7); doc.setTextColor(C.body);
  doc.text("Methodology: Random Forest, SVM, K-Means Clustering; HuggingFace NLP Summarization;", M.l, H - M.b - 18);
  doc.text("Echotik API ingestion; CRISP-DM framework; Content Trend Intelligence.", M.l, H - M.b - 13);

  // ──────────────────────────────────────────────────────────────────
  // SECTION 01 — EXECUTIVE SUMMARY
  // ──────────────────────────────────────────────────────────────────
  y = drawSectionBanner(doc, "01", "Executive Summary",
    "NLP narrative · KPI overview · Top category recommendation");
  rec("01 · Executive Summary");

  // KPI row
  const kpis = [
    { label:"Kategori Dianalisis", value: String(data.contentTrendData.length), dark: false },
    { label:"Kategori Naik Tren",  value: String(rising.length),                dark: rising.length > 0 },
    { label:"Top Opp. Score",      value: top ? `${Math.round(top.potentialScore)}/100` : "—", dark: true },
    { label:"Main Avg Engagement", value: mainTotal > 0 ? fmtPct(mainAvgEng) : "—", dark: false },
  ];
  const kGap = 4; const kW = (CW - kGap * 3) / 4; const kH = 24;
  kpis.forEach((k, i) => statCard(doc, M.l + i*(kW+kGap), y, kW, kH, k.label, k.value, k.dark));
  y += kH + 10;

  // NLP narrative text box
  y = guard(doc, y, 30);
  y = drawSubHeader(doc, y, "AI Narrative Summary", "HuggingFace NLP Model");
  const nlpText = data.nlpSummaryText ||
    `Analisis ${data.period === "weekly" ? "7 hari" : "30 hari"} terakhir untuk @${data.mainAccountName}. ` +
    (rising.length > 0
      ? `Kategori naik tren: ${rising.map((c:any) => c.category).join(", ")}. `
      : "Tidak ada kategori yang signifikan naik tren saat ini. ") +
    (top ? `Kategori peluang terbaik: ${top.category} (Score ${Math.round(top.potentialScore)}/100). ${top.recommendation || ""}` : "");

  const nlpLines = doc.splitTextToSize(nlpText, CW - 14);
  const nlpH = nlpLines.length * 5 + 10;
  doc.setFillColor(C.cream); doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
  doc.roundedRect(M.l, y, CW, nlpH, 2, 2, "FD");
  // Accent left bar
  doc.setFillColor(...rgb(C.accent)); doc.rect(M.l, y, 3, nlpH, "F");
  doc.setFont(F.s,"normal"); doc.setFontSize(8.5); doc.setTextColor(C.graphite);
  doc.text(nlpLines, M.l + 8, y + 6);
  y += nlpH + 10;

  // Top category card
  if (top) {
    y = guard(doc, y, 32);
    y = drawSubHeader(doc, y, "Top Category Recommendation", "Highest Opportunity Score");
    const cH = 28;
    doc.setFillColor(C.paper); doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
    doc.roundedRect(M.l, y, CW, cH, 2, 2, "FD");
    // Left chip
    doc.setFillColor(...rgb(C.accent)); doc.roundedRect(M.l + 5, y + 8, 8, 8, 1.5, 1.5, "F");
    // Label
    doc.setFont(F.s,"bold"); doc.setFontSize(6); doc.setTextColor(...rgb(C.accent));
    doc.text("TOP RECOMMENDATION", M.l + 17, y + 9);
    // Category name
    doc.setFont(F.f,"bold"); doc.setFontSize(16); doc.setTextColor(C.ink);
    doc.text(`#1  ${top.category}`, M.l + 17, y + 19);
    // Trend badge (text only, no unicode arrows)
    const td = trendLabel(top.trendDirection);
    const tc = trendColor(top.trendDirection);
    doc.setFont(F.s,"bold"); doc.setFontSize(7); doc.setTextColor(...rgb(tc));
    doc.text(`[${td}]`, M.l + 17 + doc.getTextWidth(`#1  ${top.category}`) + 4, y + 19);
    // Score box on right
    const scoreX = W - M.r - 26;
    doc.setFillColor(C.ink); doc.roundedRect(scoreX, y + 6, 22, 16, 2, 2, "F");
    doc.setFont(F.f,"bold"); doc.setFontSize(13); doc.setTextColor(C.paper);
    doc.text(`${Math.round(top.potentialScore)}`, scoreX + 11, y + 17, { align:"center" });
    doc.setFont(F.s,"bold"); doc.setFontSize(5); doc.setTextColor("#888888");
    doc.text("/ 100  SCORE", scoreX + 11, y + 21, { align:"center" });
    // Recommendation text
    const recLine = doc.splitTextToSize(top.recommendation || "", CW - 60);
    doc.setFont(F.s,"italic"); doc.setFontSize(7); doc.setTextColor(C.body);
    doc.text(recLine[0] || "", M.l + 17, y + cH - 4);
    y += cH + 8;
  }

  // ──────────────────────────────────────────────────────────────────
  // SECTION 02 — BENCHMARK
  // ──────────────────────────────────────────────────────────────────
  y = drawSectionBanner(doc, "02", "Benchmark Analysis",
    `@${data.mainAccountName} vs ${data.competitorNames.length} competitor accounts`);
  rec("02 · Benchmark");

  // Per-account table
  y = drawSubHeader(doc, y, "Per-Account Performance", "Engagement · Videos · Sentiment · Keywords");
  const benchRows = [
    ["@" + data.mainAccountName, "Main",
     mainTotal > 0 ? fmtPct(mainAvgEng) : "—",
     String(mainTotal),
     data.comparativeData?.mainSummary?.sentimentOverall || "—",
     (data.mainKeywords||[]).slice(0,3).map((k:any)=>k.keyword).join(", ") || "—"],
    ...data.competitorNames.map((name:string) => {
      const comp = Object.entries(data.competitorStatsMap).find(([id]) =>
        data.accounts.find((a:any) => a.influencerId?.toString() === id)?.username === name
      );
      const stats = comp ? comp[1] as any : {};
      const compId = comp ? comp[0] : "";
      const kws = (data.comparativeData?.competitorKeywords||[])
        .filter((k:any) => k.influencerId?.toString() === compId)
        .slice(0,3).map((k:any)=>k.keyword).join(", ") || "—";
      return [
        "@" + name, "Competitor",
        stats.totalVideos > 0 ? fmtPct(stats.avgEngagementRate) : "—",
        String(stats.totalVideos || "—"),
        "—", kws,
      ];
    }),
  ];
  autoTable(doc, {
    ...tableConf(y, () => { drawPageHeader(doc); rec("02 · Benchmark"); }),
    head: [["Akun", "Tipe", "Avg Engagement", "Total Video", "Sentiment", "Top Keywords"]],
    body: benchRows,
    columnStyles: {
      0: { cellWidth: 36, fontStyle:"bold", textColor: C.ink },
      1: { cellWidth: 20 },
      2: { cellWidth: 26, halign:"right" as const },
      3: { cellWidth: 22, halign:"right" as const },
      4: { cellWidth: 22, halign:"center" as const },
      5: { cellWidth: 40, textColor: C.body },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Category distribution
  if (data.contentTrendData.some((c:any) => c.mainAccountVideoCount > 0 || c.competitorVideoCount > 0)) {
    y = guard(doc, y, 50);
    y = drawSubHeader(doc, y, "Category Distribution", "Main vs Competitor · Gap = Main Eng% − Competitor Eng%");
    autoTable(doc, {
      ...tableConf(y, () => { drawPageHeader(doc); rec("02 · Benchmark"); }),
      head: [["Kategori", "Main Videos", "Main Eng%", "Komp Videos", "Komp Eng%", "Gap"]],
      body: data.contentTrendData.map((c:any) => {
        const gap = (c.mainAccountEngagementRate||0) - (c.competitorEngagementRate||0);
        const gapStr = (c.mainAccountVideoCount>0 && c.competitorVideoCount>0)
          ? `${gap>=0?"+":""}${(gap*100).toFixed(2)}%` : "—";
        return [
          c.category,
          String(c.mainAccountVideoCount||0),
          c.mainAccountVideoCount>0 ? fmtPct(c.mainAccountEngagementRate) : "—",
          String(c.competitorVideoCount||0),
          c.competitorVideoCount>0 ? fmtPct(c.competitorEngagementRate) : "—",
          gapStr,
        ];
      }),
      columnStyles: {
        0: { cellWidth: 38, fontStyle:"bold", textColor: C.ink },
        1: { cellWidth: 22, halign:"right" as const },
        2: { cellWidth: 22, halign:"right" as const },
        3: { cellWidth: 22, halign:"right" as const },
        4: { cellWidth: 22, halign:"right" as const },
        5: { cellWidth: 22, halign:"right" as const, fontStyle:"bold", textColor: C.accent },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Keyword overlap
  const mainKwArr = (data.mainKeywords||[]).map((k:any)=>k.keyword);
  const compKwArr = Array.from(new Set<string>((data.competitorKeywords||[]).map((k:any)=>k.keyword)));
  if (mainKwArr.length > 0 || compKwArr.length > 0) {
    const mainSet = new Set(mainKwArr);
    const compSet = new Set(compKwArr);
    const overlap = mainKwArr.filter((k:string) => compSet.has(k));
    const mainOnly = mainKwArr.filter((k:string) => !compSet.has(k));
    const compOnly = compKwArr.filter((k:string) => !mainSet.has(k));

    y = guard(doc, y, 40);
    y = drawSubHeader(doc, y, "Keyword Overlap Analysis",
      `Main: ${mainOnly.length} unik  ·  Overlap: ${overlap.length}  ·  Competitor: ${compOnly.length} unik`);

    const cols = [
      { title:`Unik Main (${mainOnly.length})`,       words: mainOnly.slice(0,8),  color: C.pos  },
      { title:`Overlap (${overlap.length})`,           words: overlap.slice(0,8),   color: C.muted},
      { title:`Unik Kompetitor (${compOnly.length})`, words: compOnly.slice(0,8),  color: C.warn },
    ];
    const colW = (CW - 8) / 3; const colH = 26;
    cols.forEach((col, i) => {
      const x = M.l + i * (colW + 4);
      doc.setFillColor(C.cream); doc.setDrawColor(C.rule); doc.setLineWidth(0.18);
      doc.roundedRect(x, y, colW, colH, 2, 2, "FD");
      doc.setFont(F.s,"bold"); doc.setFontSize(6); doc.setTextColor(...rgb(col.color));
      doc.text(col.title, x + 5, y + 6);
      doc.setFont(F.s,"normal"); doc.setFontSize(7); doc.setTextColor(C.graphite);
      const kwLine = doc.splitTextToSize(col.words.join("  ·  ") || "—", colW - 10);
      doc.text(kwLine.slice(0,3), x + 5, y + 13);
    });
    y += colH + 8;
  }

  // ──────────────────────────────────────────────────────────────────
  // SECTION 03 — CATEGORY ANALYSIS
  // ──────────────────────────────────────────────────────────────────
  if (data.contentTrendData.length > 0) {
    y = drawSectionBanner(doc, "03", "Category Analysis",
      "Opportunity score  ·  Trend direction  ·  Engagement forecast");
    rec("03 · Category Analysis");

    // Score bar chart
    y = drawSubHeader(doc, y, "Opportunity Score Ranking", "0–100  ·  ML calculated");
    const barMaxW = CW - 70;
    data.contentTrendData.forEach((c:any, i:number) => {
      y = guard(doc, y, 13);
      const barW = Math.max(1, (c.potentialScore / 100) * barMaxW);
      const tc = trendColor(c.trendDirection);
      // Rank
      doc.setFont(F.f,"normal"); doc.setFontSize(10); doc.setTextColor(...rgb(C.accentS));
      doc.text(String(i+1).padStart(2,"0"), M.l, y + 7);
      // Category label (fixed width)
      doc.setFont(F.s,"bold"); doc.setFontSize(8); doc.setTextColor(C.ink);
      const labelStr = c.category.length > 16 ? c.category.slice(0,15)+"…" : c.category;
      doc.text(labelStr, M.l + 10, y + 7);
      // Track
      doc.setFillColor(C.soft); doc.rect(M.l + 50, y + 1, barMaxW, 8, "F");
      // Bar
      doc.setFillColor(C.ink); doc.rect(M.l + 50, y + 1, barW, 8, "F");
      if (barW > 2) { doc.setFillColor(...rgb(C.accent)); doc.rect(M.l + 50 + barW - 1.2, y + 1, 1.2, 8, "F"); }
      // Score number
      doc.setFont(F.f,"bold"); doc.setFontSize(8); doc.setTextColor(C.ink);
      doc.text(String(Math.round(c.potentialScore)), M.l + 50 + barMaxW + 3, y + 7);
      // Trend label (text only, no unicode)
      doc.setFont(F.s,"bold"); doc.setFontSize(6.5); doc.setTextColor(...rgb(tc));
      doc.text(trendLabel(c.trendDirection), M.l + 50 + barMaxW + 16, y + 7);
      y += 11;
    });
    y += 6;

    // Metrics table
    y = guard(doc, y, 60);
    y = drawSubHeader(doc, y, "Per-Category Metrics", "Historical  ·  Forecast  ·  ML Predictions");
    autoTable(doc, {
      ...tableConf(y, () => { drawPageHeader(doc); rec("03 · Category Analysis"); }),
      head: [["Kategori", "Trend", "Score", "Main\nVideos", "Main\nEng%", "Komp\nEng%", "Est Eng\n7-Day", "Viral\nProb"]],
      body: data.contentTrendData.map((c:any) => {
        const last = c.forecastTrend?.[c.forecastTrend.length-1];
        const estEng = last ? fmtPct(last.avgEngagementRate) : "—";
        return [
          c.category,
          trendLabel(c.trendDirection),
          String(Math.round(c.potentialScore)),
          String(c.mainAccountVideoCount||0),
          c.mainAccountVideoCount>0 ? fmtPct(c.mainAccountEngagementRate) : "—",
          c.competitorVideoCount>0 ? fmtPct(c.competitorEngagementRate) : "—",
          estEng,
          `${(( c.avgViralProbability||0)*100).toFixed(0)}%`,
        ];
      }),
      columnStyles: {
        0: { cellWidth: 34, fontStyle:"bold", textColor: C.ink },
        1: { cellWidth: 20 },
        2: { cellWidth: 14, halign:"right" as const, fontStyle:"bold", textColor: C.accent },
        3: { cellWidth: 14, halign:"right" as const },
        4: { cellWidth: 16, halign:"right" as const },
        5: { cellWidth: 16, halign:"right" as const },
        6: { cellWidth: 18, halign:"right" as const },
        7: { cellWidth: 14, halign:"right" as const },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Recommendation text
    y = guard(doc, y, 50);
    y = drawSubHeader(doc, y, "Category Recommendations", "AI-generated per category");
    data.contentTrendData.forEach((c:any) => {
      if (!c.recommendation) return;
      y = guard(doc, y, 16);
      doc.setFont(F.s,"bold"); doc.setFontSize(8); doc.setTextColor(C.ink);
      doc.text(`${c.category}:`, M.l, y + 5);
      doc.setFont(F.s,"normal"); doc.setFontSize(7.5); doc.setTextColor(C.body);
      const lines = doc.splitTextToSize(c.recommendation, CW - 36);
      doc.text(lines, M.l + 35, y + 5);
      doc.setDrawColor(C.soft); doc.setLineWidth(0.15);
      const h = Math.max(10, lines.length * 4.2 + 6);
      doc.line(M.l, y + h, W - M.r, y + h);
      y += h + 3;
    });
  }

  // ──────────────────────────────────────────────────────────────────
  // SECTION 04 — HASHTAG & SCHEDULE
  // ──────────────────────────────────────────────────────────────────
  if (data.hashtagRecs.length > 0 || data.postingRecs.length > 0) {
    y = drawSectionBanner(doc, "04", "Hashtag & Schedule",
      `${data.hashtagRecs.length} hashtags  ·  ${data.postingRecs.length} time slots`);
    rec("04 · Hashtag & Schedule");

    if (data.hashtagRecs.length > 0) {
      // Top hashtag feature box
      const topH = data.hashtagRecs[0];
      y = drawSubHeader(doc, y, "Top Hashtag Recommendation", "");
      const fH = 24;
      doc.setFillColor(C.paper); doc.setDrawColor(C.rule); doc.setLineWidth(0.2);
      doc.roundedRect(M.l, y, CW, fH, 2, 2, "FD");
      doc.setFillColor(...rgb(C.accent)); doc.rect(M.l, y, 3, fH, "F");
      doc.setFont(F.f,"bold"); doc.setFontSize(14); doc.setTextColor(C.ink);
      doc.text(cleanHashtag(topH.hashtag), M.l + 8, y + 14);
      const mW = CW * 0.55 / 3;
      const mStart = M.l + CW * 0.42;
      [
        { l:"Est. Reach",  v: topH.expectedReach ? fmtNum(topH.expectedReach) : "—" },
        { l:"Engagement",  v: fmtPct(topH.expectedEngagementRate) },
        { l:"Competition", v: topH.competitionLevel || "—" },
      ].forEach((m, i) => {
        const mx = mStart + i * mW;
        doc.setFont(F.s,"bold"); doc.setFontSize(5.5); doc.setTextColor(C.muted);
        doc.text(m.l.toUpperCase(), mx, y + 7);
        doc.setFont(F.f,"bold"); doc.setFontSize(10); doc.setTextColor(C.ink);
        doc.text(m.v, mx, y + 17);
      });
      y += fH + 8;

      // Hashtag ranking table
      y = drawSubHeader(doc, y, "Hashtag Ranking", `${data.hashtagRecs.length} hashtags  ·  ML-ranked`);
      autoTable(doc, {
        ...tableConf(y, () => { drawPageHeader(doc); rec("04 · Hashtag & Schedule"); }),
        head: [["#", "Hashtag", "Exp. Reach", "Eng. Rate", "Competition", "Reasoning"]],
        body: data.hashtagRecs.slice(0,15).map((h:any, i:number) => [
          String(i+1).padStart(2,"0"),
          cleanHashtag(h.hashtag),
          h.expectedReach ? fmtNum(h.expectedReach) : "—",
          fmtPct(h.expectedEngagementRate),
          h.competitionLevel || "—",
          (h.reasoning||"Recommended based on engagement, reach, and competition analysis.").slice(0,60)
            + ((h.reasoning||"").length > 60 ? "…" : ""),
        ]),
        columnStyles: {
          0: { cellWidth: 10, halign:"right" as const, fontStyle:"bold", textColor: C.accent },
          1: { cellWidth: 30, fontStyle:"bold", textColor: C.ink },
          2: { cellWidth: 20, halign:"right" as const },
          3: { cellWidth: 20, halign:"right" as const },
          4: { cellWidth: 22 },
          5: { textColor: C.body },
        },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    if (data.postingRecs.length > 0) {
      y = guard(doc, y, 60);
      y = drawSubHeader(doc, y, "Optimal Posting Schedule", `${data.postingRecs.length} slots  ·  ML confidence-ranked`);
      autoTable(doc, {
        ...tableConf(y, () => { drawPageHeader(doc); rec("04 · Hashtag & Schedule"); }),
        head: [["#", "Hari", "Waktu", "Eng. Rate", "Confidence"]],
        body: data.postingRecs.slice(0,10).map((t:any, i:number) => [
          String(i+1).padStart(2,"0"),
          t.dayName || "—",
          t.timeLabel || `${String(t.hourOfDay||0).padStart(2,"0")}:00`,
          fmtPct(t.expectedEngagementRate),
          `${Math.round((t.confidenceScore||0)*100)}%`,
        ]),
        columnStyles: {
          0: { cellWidth: 12, halign:"right" as const, fontStyle:"bold", textColor: C.accent },
          1: { cellWidth: 30, fontStyle:"bold", textColor: C.ink },
          2: { cellWidth: 30 },
          3: { cellWidth: 28, halign:"right" as const },
          4: { cellWidth: 28, halign:"right" as const },
        },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // SECTION 05 — KEYWORDS & STRATEGY
  // ──────────────────────────────────────────────────────────────────
  y = drawSectionBanner(doc, "05", "Keywords & Strategy",
    "Keyword comparison  ·  AI-driven improvement roadmap");
  rec("05 · Keywords & Strategy");

  // Keyword comparison table
  if ((data.mainKeywords||[]).length > 0 || (data.competitorKeywords||[]).length > 0) {
    y = drawSubHeader(doc, y, "Keyword Comparison", "Main Account vs Competitor");
    const mainKws = (data.mainKeywords||[]).slice(0,12);
    const compKws = Array.from(new Set<string>((data.competitorKeywords||[]).map((k:any)=>k.keyword))).slice(0,12);
    const maxR = Math.max(mainKws.length, compKws.length);
    autoTable(doc, {
      ...tableConf(y, () => { drawPageHeader(doc); rec("05 · Keywords & Strategy"); }),
      head: [["#", "Main Account Keyword", "Frequency", "Competitor Keyword"]],
      body: Array.from({length:maxR},(_,i) => [
        String(i+1).padStart(2,"0"),
        (mainKws[i] as any)?.keyword || "—",
        (mainKws[i] as any)?.totalFrequency ? String((mainKws[i] as any).totalFrequency) : "—",
        (compKws[i] as string) || "—",
      ]),
      columnStyles: {
        0: { cellWidth: 12, halign:"right" as const, fontStyle:"bold", textColor: C.accent },
        1: { cellWidth: 60, fontStyle:"bold", textColor: C.ink },
        2: { cellWidth: 22, halign:"right" as const },
        3: { cellWidth: 60, textColor: C.body },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Improvement strategy
  y = guard(doc, y, 80);
  y = drawSubHeader(doc, y, "Content Improvement Strategy", "AI-generated · 6 actionable recommendations");
  const strategies = [
    { title:"Prioritas Kategori", body: top
        ? `Fokuskan konten pada kategori ${top.category} (Score ${Math.round(top.potentialScore)}/100). ${
            top.trendDirection==="rising"
              ? "Momentum sedang naik — buat minimal 2–3 konten dalam minggu ini."
              : "Konsistensi posting akan membangun momentum jangka panjang."}`
        : "Data kategori tidak tersedia." },
    { title:"Strategi Hashtag", body: data.hashtagRecs.length > 0
        ? `Prioritaskan ${data.hashtagRecs.slice(0,3).map((h:any)=>cleanHashtag(h.hashtag)).join(", ")}. Kombinasikan dengan 3–5 hashtag kompetisi rendah untuk memperluas jangkauan organik.`
        : "Data hashtag tidak tersedia." },
    { title:"Jadwal Posting", body: data.postingRecs.length > 0
        ? `Slot terbaik: ${data.postingRecs.slice(0,2).map((t:any)=>`${t.dayName} ${t.timeLabel}`).join(" & ")}. Hindari overlap dengan jadwal kompetitor.`
        : "Data jadwal tidak tersedia." },
    { title:"Gap Konten", body: (() => {
        const uniq = Array.from(new Set<string>((data.competitorKeywords||[]).map((k:any)=>k.keyword))).slice(0,4);
        return uniq.length > 0
          ? `Kompetitor menggunakan topik: ${uniq.join(", ")}. Buat konten yang menjawab topik ini dari sudut pandang unik akun Anda.`
          : "Data keyword kompetitor tidak tersedia.";
      })()},
    { title:"Format Konten",  body:"Gunakan format tanya-jawab di 3 detik pertama video. Caption dengan pertanyaan dan call-to-action terbukti meningkatkan engagement secara signifikan." },
    { title:"Siklus Evaluasi", body:"Evaluasi performa setiap 7 hari. Bandingkan engagement aktual vs proyeksi ML. Sesuaikan kategori, jadwal, dan hashtag berdasarkan data terbaru." },
  ];

  strategies.forEach((s, i) => {
    y = guard(doc, y, 18);
    // Number chip
    doc.setFillColor(i === 0 ? C.ink : C.cream);
    doc.setDrawColor(i === 0 ? C.ink : C.rule); doc.setLineWidth(0.18);
    doc.roundedRect(M.l, y, 7, 7, 1.5, 1.5, "FD");
    doc.setFont(F.f,"bold"); doc.setFontSize(8);
    doc.setTextColor(i === 0 ? C.paper : C.accent);
    doc.text(String(i+1), M.l + 3.5, y + 5.5, { align:"center" });
    // Title
    doc.setFont(F.s,"bold"); doc.setFontSize(8.5); doc.setTextColor(C.ink);
    doc.text(s.title, M.l + 11, y + 5.5);
    // Body
    const bodyLines = doc.splitTextToSize(s.body, CW - 14);
    doc.setFont(F.s,"normal"); doc.setFontSize(7.5); doc.setTextColor(C.body);
    doc.text(bodyLines, M.l + 11, y + 11);
    doc.setDrawColor(C.soft); doc.setLineWidth(0.15);
    const boxH = Math.max(14, bodyLines.length * 4.2 + 13);
    doc.line(M.l, y + boxH, W - M.r, y + boxH);
    y += boxH + 4;
  });

  // ──────────────────────────────────────────────────────────────────
  // BACK COVER
  // ──────────────────────────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(C.ink); doc.rect(0, 0, W, H, "F");
  // Subtle dot grid on dark
  doc.setFillColor(30, 30, 40);
  for (let gx = 0; gx <= W; gx += 10)
    for (let gy = 0; gy <= H; gy += 10)
      doc.circle(gx, gy, 0.15, "F");
  // Accent bar
  doc.setFillColor(...rgb(C.accent));
  doc.rect(M.l, H * 0.40, 3, 22, "F");
  // Title
  doc.setFont(F.s,"bold"); doc.setFontSize(32); doc.setTextColor(C.paper);
  doc.text("NLP Insight", M.l + 10, H * 0.47);
  doc.setFont(F.f,"bolditalic"); doc.setFontSize(34); doc.setTextColor(...rgb(C.accentS));
  doc.text("Report", M.l + 10, H * 0.47 + 15);
  // Meta
  doc.setFont(F.s,"bold"); doc.setFontSize(7); doc.setTextColor(...rgb(C.accentS));
  doc.text("Tugas Akhir  ·  ITB STIKOM Bali  ·  TikTok BI", M.l + 10, H * 0.60);
  doc.setFont(F.s,"normal"); doc.setFontSize(8); doc.setTextColor(C.paper);
  doc.text(dateStr(), M.l + 10, H * 0.65);
  // Bottom line
  doc.setDrawColor(...rgb(C.accent)); doc.setLineWidth(0.4);
  doc.line(M.l + 10, H - M.b - 4, M.l + 10 + 30, H - M.b - 4);
  doc.setFont(F.s,"bold"); doc.setFontSize(7); doc.setTextColor(...rgb(C.accentS));
  doc.text("tiktokbi.report", M.l + 10, H - M.b + 2);

  // ──────────────────────────────────────────────────────────────────
  // APPLY HEADERS & FOOTERS
  // ──────────────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  const skipPages = new Set([1, total]); // cover + back cover
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    if (!skipPages.has(i)) {
      const section = sectionMap.get(i) || "";
      // Section banner pages (odd after cover): already drawn their own header
      if (!section.match(/^\d\d ·/) || i > 3) {
        drawPageFooter(doc, i, total, section);
      }
    }
  }

  const name = data.mainAccountName.replace(/[^a-zA-Z0-9]/g,"_");
  doc.save(`nlp-insight-${name}_${data.period}_${new Date().toISOString().slice(0,10)}.pdf`);
}
