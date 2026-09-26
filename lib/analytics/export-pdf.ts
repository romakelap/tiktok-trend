/**
 * Analytics PDF Export — Monochrome landing-page design system.
 *
 * Identical visual language to timePostingExport.ts & comparisonExport.ts:
 *   - Black on white, warm-neutral grays, single indigo accent
 *   - Sans bold + serif-italic emphasis for mixed-type headlines
 *   - Pill badges, dotted-grid cover, diagonal-lined dark dividers
 *   - Editorial Contents page, FT-style hairline tables
 *   - Running footer with section title + serif page numerals
 *   - Vector charts (line, bar, donut, radar) in mono + indigo
 *
 * NO backend API needed. Generates directly from React state.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Types ──────────────────────────────────────────────────────────────
type HistoricalDay = {
  date: string;
  videos: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  viralProb: number;
};

type ContentRow = {
  id: number | string;
  title: string;
  account: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  viralProb: number;
  tier: string;
  clusterId: number;
};

type HashtagRec = {
  hashtag: string;
  recommendationScore: number;
  rankPosition: number;
  expectedReach: number;
  expectedEngagementRate: number;
  competitionLevel: string;
  reasoning: string;
};

type PostingTimeRec = {
  dayName: string;
  hourOfDay: number;
  timeLabel: string;
  expectedEngagementRate: number;
  expectedViews: number;
  confidenceScore: number;
  rankPosition: number;
  sampleSize: number;
  reasoning: string;
};

type KeywordRec = {
  keyword: string;
  keywordType: string;
  avgRelevanceScore: number;
  totalFrequency: number;
  totalVideos: number;
};

type ContentRecommendation = {
  id: number | string;
  priority: string;
  type: string;
  title: string;
  description: string;
  rationale: string;
  keywords?: string[];
  hashtags?: string[];
  duration: string;
  expectedReach: string;
  confidence: number;
};

export type AnalyticsExportData = {
  accountFilter: string;
  period: string;
  historicalData: HistoricalDay[];
  performanceData: ContentRow[];
  heatmapMatrix: number[][];
  topSlots: any[];
  hashtagRecommendations: HashtagRec[];
  optimalSchedule: PostingTimeRec[];
  keywordRecommendations: KeywordRec[];
  contentRecs: ContentRecommendation[];
};

// ── Monochrome Color System (identical to sibling exporters) ─────────
const C = {
  black:     "#0A0A0A",
  ink:       "#171717",
  graphite:  "#404040",
  body:      "#525252",
  muted:     "#A3A3A3",
  faint:     "#D4D4D4",
  rule:      "#E5E5E5",
  ruleSoft:  "#F0F0F0",
  cream:     "#FAFAFA",
  paper:     "#FFFFFF",

  // Single accent (indigo) — replaces all gold usages
  accent:        "#5B5BD6",
  accentSoft:    "#8B8BE8",
  accentTint:    "#EEEEFB",
  accentDeep:    "#3A3AAE",

  // Status (muted)
  positive:  "#15803D",
  warning:   "#B7791F",
  negative:  "#B91C1C",
  info:      "#2563A8",
};

const GRID = { xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, xxxl: 32 };
const MARGIN = { left: 22, right: 22, top: 22, bottom: 22 };
const FONT = { sans: "helvetica", serif: "times" };

// ── Helpers ──────────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("id-ID");
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function nowStr(): string {
  return new Date().toLocaleString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function nowDateStr(): string {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function hexRGB(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function trackedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  spacing = 1.5,
  align: "left" | "center" | "right" = "left",
): number {
  const chars = text.toUpperCase().split("");
  const widths = chars.map((c) => doc.getTextWidth(c));
  const totalWidth = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);

  let startX = x;
  if (align === "center") startX = x - totalWidth / 2;
  if (align === "right") startX = x - totalWidth;

  let cursor = startX;
  chars.forEach((c, i) => {
    doc.text(c, cursor, y);
    cursor += widths[i] + spacing;
  });
  return totalWidth;
}

function trackedWidth(doc: jsPDF, text: string, spacing = 1.5): number {
  const chars = text.toUpperCase().split("");
  const widths = chars.map((c) => doc.getTextWidth(c));
  return widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
}

function pageW(doc: jsPDF) { return doc.internal.pageSize.getWidth(); }
function pageH(doc: jsPDF) { return doc.internal.pageSize.getHeight(); }
function contentW(doc: jsPDF) { return pageW(doc) - MARGIN.left - MARGIN.right; }

function ensurePage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > pageH(doc) - MARGIN.bottom - 10) {
    doc.addPage();
    return MARGIN.top + 14;
  }
  return y;
}

/** Pill badge — rounded hairline label */
function drawPill(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  align: "left" | "center" = "left",
) {
  doc.setFontSize(6);
  doc.setFont(FONT.sans, "bold");
  const textW = trackedWidth(doc, label, 1.4);
  const padX = 3.5;
  const pillW = textW + padX * 2;
  const pillH = 6;

  let px = x;
  if (align === "center") px = x - pillW / 2;

  doc.setFillColor(C.cream);
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.25);
  doc.roundedRect(px, y, pillW, pillH, pillH / 2, pillH / 2, "FD");

  doc.setTextColor(C.graphite);
  trackedText(doc, label, px + padX, y + 4, 1.4);

  return { w: pillW, h: pillH };
}

function drawPageHeader(doc: jsPDF) {
  const pw = pageW(doc);
  const hy = MARGIN.top - 8;

  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, nowDateStr(), pw - MARGIN.right, hy, 0.8, "right");

  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  trackedText(doc, "TikTok BI · Analytics Report", MARGIN.left, hy, 0.8);

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, MARGIN.top - 4, pw - MARGIN.right, MARGIN.top - 4);
}

function drawPageFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  sectionTitle: string,
) {
  const pw = pageW(doc);
  const ph = pageH(doc);
  const fy = ph - MARGIN.bottom + 9;

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, ph - MARGIN.bottom + 4, pw - MARGIN.right, ph - MARGIN.bottom + 4);

  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, sectionTitle, MARGIN.left, fy, 0.6);

  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  trackedText(doc, "TikTok BI Analytics", pw / 2, fy, 0.8, "center");

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.ink);
  doc.text(
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    pw - MARGIN.right, fy, { align: "right" },
  );
}

function drawDividerFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  sectionTitle: string,
) {
  const pw = pageW(doc);
  const ph = pageH(doc);
  const fy = ph - MARGIN.bottom + 9;

  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, ph - MARGIN.bottom + 4, pw - MARGIN.right, ph - MARGIN.bottom + 4);

  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, sectionTitle, MARGIN.left, fy, 0.6);

  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI Analytics", pw / 2, fy, 0.8, "center");

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(8);
  doc.setTextColor(C.paper);
  doc.text(
    `${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`,
    pw - MARGIN.right, fy, { align: "right" },
  );
}

/** Section title: pill + mixed-type headline (sans bold + serif-italic emphasis) */
function drawSectionTitle(
  doc: jsPDF,
  y: number,
  number: string,
  titlePlain: string,
  titleEmphasis: string,
  subtitle: string,
): number {
  drawPill(doc, MARGIN.left, y, `Section ${number}`);

  const titleY = y + 16;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(20);
  doc.setTextColor(C.black);
  doc.text(titlePlain, MARGIN.left, titleY);
  const plainW = doc.getTextWidth(titlePlain);

  if (titleEmphasis) {
    doc.setFont(FONT.serif, "bolditalic");
    doc.setFontSize(21);
    doc.setTextColor(C.black);
    doc.text(` ${titleEmphasis}`, MARGIN.left + plainW, titleY);
  }

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(C.body);
  doc.text(subtitle, MARGIN.left, titleY + 7);

  return titleY + 14;
}

function drawSubsectionTitle(
  doc: jsPDF,
  y: number,
  title: string,
  meta: string,
): number {
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.ink);
  doc.text(title, MARGIN.left, y);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(C.muted);
  doc.text(meta, pageW(doc) - MARGIN.right, y, { align: "right" });

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, y + 3, pageW(doc) - MARGIN.right, y + 3);

  return y + GRID.lg;
}

/** Section divider — dark, diagonal lines, left-aligned, accent indigo */
function drawSectionDivider(
  doc: jsPDF,
  sectionNum: string,
  titlePlain: string,
  titleEmphasis: string,
  subtitle: string,
): number {
  doc.addPage();
  const pageNum = doc.getNumberOfPages();
  const pw = pageW(doc);
  const ph = pageH(doc);

  doc.setFillColor(C.black);
  doc.rect(0, 0, pw, ph, "F");

  doc.setDrawColor(38, 38, 46);
  doc.setLineWidth(0.2);
  const diagGap = 26;
  for (let i = -Math.ceil(ph / diagGap); i < Math.ceil(pw / diagGap) + 2; i++) {
    const x0 = i * diagGap;
    doc.line(x0, 0, x0 + ph * 0.55, ph);
  }

  const railX = MARGIN.left + 4;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.5);
  doc.line(railX, ph * 0.20, railX, ph * 0.82);

  const cx = railX + 12;

  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI · Analytics Report", cx, ph * 0.215, 2);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(150);
  doc.setTextColor(C.paper);
  const numBaseline = ph * 0.50;
  doc.text(sectionNum, cx, numBaseline);

  doc.setFontSize(9);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "Section", cx + 2, numBaseline + 14, 3);

  const titleY = ph * 0.70;
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(28);
  doc.setTextColor(C.paper);
  doc.text(titlePlain, cx, titleY);
  const plainW = doc.getTextWidth(titlePlain);
  if (titleEmphasis) {
    doc.setFont(FONT.serif, "bolditalic");
    doc.setFontSize(29);
    doc.text(` ${titleEmphasis}`, cx + plainW, titleY);
  }

  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.6);
  doc.line(cx, titleY + 8, cx + 16, titleY + 8);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...hexRGB(C.accentSoft));
  const subLines = doc.splitTextToSize(subtitle, pw * 0.55);
  doc.text(subLines, cx, titleY + 18);

  return pageNum;
}

/** Stat card — white, hairline, label + big serif number */
function drawStatCard(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  value: string, label: string,
  highlight = false,
) {
  if (highlight) {
    doc.setFillColor(C.black);
    doc.roundedRect(x, y, w, h, 2, 2, "F");
  } else {
    doc.setFillColor(C.paper);
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, w, h, 2, 2, "FD");
  }

  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, label, x + 5, y + 7, 1.1);

  doc.setDrawColor(highlight ? "#262626" : C.ruleSoft);
  doc.setLineWidth(0.2);
  doc.line(x + 5, y + 10, x + w - 5, y + 10);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(18);
  doc.setTextColor(highlight ? C.paper : C.black);
  doc.text(value, x + 5, y + h - 5);
}

/** FT-style table preset */
function refinedTableConfig(startY: number): Partial<Parameters<typeof autoTable>[1]> {
  return {
    startY,
    theme: "plain" as const,
    rowPageBreak: "avoid" as const,
    showHead: "everyPage" as const,
    headStyles: {
      fillColor: C.black,
      textColor: C.paper,
      fontSize: 7,
      fontStyle: "bold",
      halign: "left" as const,
      cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
      font: FONT.sans,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      textColor: C.graphite,
      font: FONT.sans,
      lineColor: C.rule,
      lineWidth: { top: 0, right: 0, bottom: 0.15, left: 0 },
    },
    alternateRowStyles: { fillColor: C.cream },
    styles: { lineColor: C.rule, lineWidth: 0, font: FONT.sans },
    margin: {
      left: MARGIN.left,
      right: MARGIN.right,
      top: MARGIN.top + 6,
      bottom: MARGIN.bottom + 8,
    },
  };
}

/** Table of Contents page */
function drawContentsPage(
  doc: jsPDF,
  items: { num: string; title: string; desc: string; pages: string }[],
  methodology: string[],
) {
  const pw = pageW(doc);
  const ph = pageH(doc);

  doc.setFillColor(C.paper);
  doc.rect(0, 0, pw, ph, "F");

  let y = MARGIN.top + 18;

  doc.setFontSize(7);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accent));
  trackedText(doc, "Inside this report", MARGIN.left, y, 1.8);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(30);
  doc.setTextColor(C.black);
  doc.text("Contents", MARGIN.left, y + 16);

  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, y + 21, 22, 1.2, "F");

  y += GRID.xxxl + 12;

  const rowH = 22;
  items.forEach((item, idx) => {
    if (idx > 0) {
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left, y - 5, pw - MARGIN.right, y - 5);
    }

    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(24);
    doc.setTextColor(...hexRGB(C.accentSoft));
    doc.text(item.num, MARGIN.left, y + 5);

    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(13);
    doc.setTextColor(C.ink);
    doc.text(item.title, MARGIN.left + 24, y + 1);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.body);
    doc.text(item.desc, MARGIN.left + 24, y + 8);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7);
    doc.setTextColor(C.muted);
    trackedText(doc, item.pages, pw - MARGIN.right, y + 3, 1.4, "right");

    y += rowH;
  });

  const noteY = ph - MARGIN.bottom - 28;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.4);
  doc.line(MARGIN.left, noteY, MARGIN.left + 12, noteY);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(C.body);
  methodology.forEach((line, i) => {
    doc.text(line, MARGIN.left, noteY + 6 + i * 5);
  });
}

// ── Chart Primitives (vector, native jsPDF, mono + indigo) ───────────
const CHART_PAD = { top: 18, right: 8, bottom: 18, left: 22 };

function drawChartFrame(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  title: string, subtitle: string,
) {
  doc.setFillColor(C.paper);
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");

  // Top label (indigo eyebrow)
  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accent));
  trackedText(doc, title, x + 5, y + 6, 1.2);

  // Subtitle — serif italic
  doc.setFont(FONT.serif, "italic");
  doc.setFontSize(8);
  doc.setTextColor(C.body);
  doc.text(subtitle, x + 5, y + 12);

  doc.setDrawColor(C.ruleSoft);
  doc.setLineWidth(0.2);
  doc.line(x + 5, y + 14, x + w - 5, y + 14);
}

function plotArea(x: number, y: number, w: number, h: number) {
  return {
    x: x + CHART_PAD.left,
    y: y + CHART_PAD.top,
    w: w - CHART_PAD.left - CHART_PAD.right,
    h: h - CHART_PAD.top - CHART_PAD.bottom,
  };
}

function fmtTick(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(0) + "K";
  return v.toFixed(0);
}

/** LINE CHART — dual series (engagement % black solid + views indigo dashed) */
function drawLineChart(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  data: HistoricalDay[],
  title: string, subtitle: string,
) {
  drawChartFrame(doc, x, y, w, h, title, subtitle);
  const p = plotArea(x, y, w, h);

  if (data.length < 2) {
    doc.setFontSize(8);
    doc.setFont(FONT.sans, "italic");
    doc.setTextColor(C.muted);
    doc.text("Insufficient data for trend chart", p.x + p.w / 2, p.y + p.h / 2, { align: "center" });
    return;
  }

  const engMax = Math.max(...data.map(d => d.engagement), 1) * 1.15;
  const viewMax = Math.max(...data.map(d => d.views), 1) * 1.15;

  const ticks = 4;
  doc.setDrawColor(C.ruleSoft);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= ticks; i++) {
    const ty = p.y + p.h - (i / ticks) * p.h;
    doc.line(p.x, ty, p.x + p.w, ty);

    doc.setFontSize(5.5);
    doc.setFont(FONT.sans, "normal");
    doc.setTextColor(C.muted);
    doc.text(`${((engMax / ticks) * i).toFixed(1)}%`, p.x - 2, ty + 1.5, { align: "right" });
    doc.text(fmtTick((viewMax / ticks) * i), p.x + p.w + 2, ty + 1.5);
  }

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.3);
  doc.line(p.x, p.y + p.h, p.x + p.w, p.y + p.h);

  const stepX = p.w / Math.max(data.length - 1, 1);
  const engPoints = data.map((d, i) => ({
    x: p.x + i * stepX,
    y: p.y + p.h - (d.engagement / engMax) * p.h,
  }));
  const viewPoints = data.map((d, i) => ({
    x: p.x + i * stepX,
    y: p.y + p.h - (d.views / viewMax) * p.h,
  }));

  // Views line — indigo dashed (secondary)
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1.5, 1], 0);
  for (let i = 1; i < viewPoints.length; i++) {
    doc.line(viewPoints[i - 1].x, viewPoints[i - 1].y, viewPoints[i].x, viewPoints[i].y);
  }
  doc.setLineDashPattern([], 0);

  // Engagement line — black solid (primary)
  doc.setDrawColor(C.black);
  doc.setLineWidth(0.8);
  for (let i = 1; i < engPoints.length; i++) {
    doc.line(engPoints[i - 1].x, engPoints[i - 1].y, engPoints[i].x, engPoints[i].y);
  }

  engPoints.forEach(pt => {
    doc.setFillColor(C.black);
    doc.circle(pt.x, pt.y, 0.8, "F");
    doc.setFillColor(C.paper);
    doc.circle(pt.x, pt.y, 0.4, "F");
  });

  const labelCount = Math.min(5, data.length);
  const labelStep = Math.max(1, Math.floor(data.length / labelCount));
  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  for (let i = 0; i < data.length; i += labelStep) {
    const lx = p.x + i * stepX;
    doc.text(data[i].date, lx, p.y + p.h + 4, { align: "center" });
  }

  // Legend
  const legX = p.x + p.w - 50;
  const legY = y + 11;
  doc.setFillColor(C.black);
  doc.rect(legX, legY - 1.5, 4, 1.5, "F");
  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.ink);
  doc.text("Engagement", legX + 5, legY);
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(legX + 26, legY - 1.5, 1.2, 1.5, "F");
  doc.rect(legX + 28, legY - 1.5, 1.2, 1.5, "F");
  doc.text("Views", legX + 31, legY);
}

/** HORIZONTAL BAR CHART — black bars with indigo tip */
function drawBarChart(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  items: { label: string; value: number }[],
  title: string, subtitle: string,
  valueFmt: (v: number) => string = (v) => v.toFixed(1),
) {
  drawChartFrame(doc, x, y, w, h, title, subtitle);
  const p = plotArea(x, y, w, h);

  if (items.length === 0) {
    doc.setFontSize(8);
    doc.setFont(FONT.sans, "italic");
    doc.setTextColor(C.muted);
    doc.text("No data available", p.x + p.w / 2, p.y + p.h / 2, { align: "center" });
    return;
  }

  const maxVal = Math.max(...items.map(i => i.value), 0.001);
  const barCount = items.length;
  const barH = Math.min(8, (p.h - 4) / barCount * 0.65);
  const rowH = (p.h - 4) / barCount;

  // Reserve room for: rank (~8mm), label (~30% of plot), bar, value (~14mm right gutter)
  const rankW = 8;
  const labelMaxW = Math.min(p.w * 0.32, 40);
  const valueGutter = 14;
  const barAreaX = p.x + rankW + labelMaxW + 2;
  const barAreaW = Math.max(p.w - rankW - labelMaxW - valueGutter - 2, 10);

  // Estimate how many chars fit in labelMaxW at font size 7 (rough heuristic: ~1.4mm/char)
  const maxLabelChars = Math.max(8, Math.floor(labelMaxW / 1.4));

  items.forEach((item, i) => {
    const ry = p.y + i * rowH + (rowH - barH) / 2;
    const barLen = (item.value / maxVal) * barAreaW;

    // Rank (serif, indigo)
    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...hexRGB(C.accent));
    doc.text(String(i + 1).padStart(2, "0"), p.x, ry + barH / 2 + 2);

    // Label
    doc.setFont(FONT.sans, "bold");
    doc.setFontSize(7);
    doc.setTextColor(C.ink);
    const labelText = item.label.length > maxLabelChars
      ? item.label.substring(0, maxLabelChars - 1) + "…"
      : item.label;
    doc.text(labelText, p.x + rankW, ry + barH / 2 + 2);

    // Track
    doc.setFillColor(C.ruleSoft);
    doc.rect(barAreaX, ry, barAreaW, barH, "F");

    // Bar — black with indigo tip
    doc.setFillColor(C.black);
    doc.rect(barAreaX, ry, barLen, barH, "F");

    if (barLen > 2) {
      doc.setFillColor(...hexRGB(C.accent));
      doc.rect(barAreaX + barLen - 1, ry, 1, barH, "F");
    }

    // Value (serif) — clamped so it never overlaps the bar
    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(7);
    doc.setTextColor(C.black);
    doc.text(valueFmt(item.value), barAreaX + barAreaW + 2, ry + barH / 2 + 2);
  });
}

/** DONUT CHART — wedges in mono + indigo palette */
function drawDonutChart(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  segments: { label: string; value: number; color: string }[],
  title: string, subtitle: string,
  centerLabel: string, centerValue: string,
) {
  drawChartFrame(doc, x, y, w, h, title, subtitle);
  const p = plotArea(x, y, w, h);

  if (segments.length === 0 || segments.every(s => s.value === 0)) {
    doc.setFontSize(8);
    doc.setFont(FONT.sans, "italic");
    doc.setTextColor(C.muted);
    doc.text("No data available", p.x + p.w / 2, p.y + p.h / 2, { align: "center" });
    return;
  }

  const donutCx = p.x + p.w * 0.26;
  const donutCy = p.y + p.h / 2;
  const outerR = Math.min(p.w * 0.20, p.h * 0.40);
  const innerR = outerR * 0.55;

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return;

  let startAngle = -Math.PI / 2;
  segments.forEach((seg) => {
    const segAngle = (seg.value / total) * Math.PI * 2;
    const endAngle = startAngle + segAngle;

    const [r, g, b] = hexRGB(seg.color);
    doc.setFillColor(r, g, b);

    const steps = Math.max(8, Math.ceil(segAngle * 30));
    for (let i = 0; i < steps; i++) {
      const a1 = startAngle + (segAngle * i) / steps;
      const a2 = startAngle + (segAngle * (i + 1)) / steps;
      const x1 = donutCx + Math.cos(a1) * outerR;
      const y1 = donutCy + Math.sin(a1) * outerR;
      const x2 = donutCx + Math.cos(a2) * outerR;
      const y2 = donutCy + Math.sin(a2) * outerR;
      doc.triangle(donutCx, donutCy, x1, y1, x2, y2, "F");
    }
    startAngle = endAngle;
  });

  // Inner hole
  doc.setFillColor(C.paper);
  doc.circle(donutCx, donutCy, innerR, "F");

  // Center value (large serif) — label moved BELOW the donut to avoid overlap
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(13);
  doc.setTextColor(C.black);
  doc.text(centerValue, donutCx, donutCy + 1, { align: "center" });

  // Center label — kept very short so it fits inside the inner hole
  doc.setFontSize(4.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  // Use the shortest possible label form (caller may pass "Total Videos" etc;
  // we truncate to ~10 chars max to stay inside the small ring).
  const shortLabel = centerLabel.length > 10 ? centerLabel.substring(0, 10) : centerLabel;
  trackedText(doc, shortLabel, donutCx, donutCy + 6, 0.6, "center");

  // Legend — start further right to clear the donut's outer edge
  const legX = donutCx + outerR + 6;
  const legY = p.y + 4;
  const legRowH = 7;
  const legW = p.x + p.w - legX;
  segments.forEach((seg, i) => {
    const ly = legY + i * legRowH;
    const pct = (seg.value / total) * 100;

    const [r, g, b] = hexRGB(seg.color);
    doc.setFillColor(r, g, b);
    doc.rect(legX, ly, 3, 3, "F");

    doc.setFont(FONT.sans, "bold");
    doc.setFontSize(7);
    doc.setTextColor(C.ink);
    doc.text(seg.label, legX + 5, ly + 2.5);

    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(7);
    doc.setTextColor(C.body);
    doc.text(`${seg.value} · ${pct.toFixed(1)}%`, legX + legW - 2, ly + 2.5, { align: "right" });

    if (i < segments.length - 1) {
      doc.setDrawColor(C.ruleSoft);
      doc.setLineWidth(0.15);
      doc.line(legX, ly + 5, legX + legW - 2, ly + 5);
    }
  });
}

/** RADAR CHART — polygons for cluster comparison */
function drawRadarChart(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  axes: string[],
  series: { label: string; values: number[]; color: string }[],
  title: string, subtitle: string,
) {
  drawChartFrame(doc, x, y, w, h, title, subtitle);
  const p = plotArea(x, y, w, h);

  if (series.length === 0 || axes.length < 3) {
    doc.setFontSize(8);
    doc.setFont(FONT.sans, "italic");
    doc.setTextColor(C.muted);
    doc.text("Insufficient data for radar chart", p.x + p.w / 2, p.y + p.h / 2, { align: "center" });
    return;
  }

  const cx = p.x + p.w * 0.32;
  const cy = p.y + p.h / 2;
  const maxR = Math.min(p.w * 0.28, p.h * 0.38);

  const axisCount = axes.length;
  const angleStep = (Math.PI * 2) / axisCount;
  const startAngle = -Math.PI / 2;

  const rings = 4;
  doc.setDrawColor(C.ruleSoft);
  doc.setLineWidth(0.15);
  for (let r = 1; r <= rings; r++) {
    const ringR = (maxR / rings) * r;
    const points: number[][] = [];
    for (let i = 0; i < axisCount; i++) {
      const a = startAngle + i * angleStep;
      points.push([cx + Math.cos(a) * ringR, cy + Math.sin(a) * ringR]);
    }
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      doc.line(p1[0], p1[1], p2[0], p2[1]);
    }
  }

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  for (let i = 0; i < axisCount; i++) {
    const a = startAngle + i * angleStep;
    doc.line(cx, cy, cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
  }

  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.ink);
  axes.forEach((label, i) => {
    const a = startAngle + i * angleStep;
    const lx = cx + Math.cos(a) * (maxR + 4);
    const ly = cy + Math.sin(a) * (maxR + 4) + 1;
    let align: "left" | "center" | "right" = "center";
    if (Math.cos(a) > 0.3) align = "left";
    else if (Math.cos(a) < -0.3) align = "right";
    doc.text(label, lx, ly, { align });
  });

  const allValues = series.flatMap(s => s.values);
  const globalMax = Math.max(...allValues, 0.001);

  series.forEach((s) => {
    const [r, g, b] = hexRGB(s.color);

    const points: number[][] = [];
    for (let i = 0; i < axisCount; i++) {
      const a = startAngle + i * angleStep;
      const v = s.values[i] || 0;
      const r2 = (v / globalMax) * maxR;
      points.push([cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]);
    }

    (doc as any).setGState(new (doc as any).GState({ opacity: 0.18 }));
    doc.setFillColor(r, g, b);
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      doc.triangle(cx, cy, p1[0], p1[1], p2[0], p2[1], "F");
    }
    (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));

    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.6);
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      doc.line(p1[0], p1[1], p2[0], p2[1]);
    }

    doc.setFillColor(r, g, b);
    points.forEach(pt => doc.circle(pt[0], pt[1], 0.7, "F"));
  });

  const legX = p.x + p.w * 0.68;
  const legY = p.y + 2;
  series.forEach((s, i) => {
    const ly = legY + i * 6;
    const [r, g, b] = hexRGB(s.color);
    doc.setFillColor(r, g, b);
    doc.rect(legX, ly, 3, 3, "F");
    doc.setFont(FONT.sans, "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(C.ink);
    doc.text(s.label, legX + 5, ly + 2.5);
  });
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════
export function exportAnalyticsPdf(data: AnalyticsExportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = pageW(doc);
  const ph = pageH(doc);
  const cw = contentW(doc);

  const dividerPages = new Set<number>();
  const backCoverPages = new Set<number>();
  const sectionMap = new Map<number, string>();
  const recordSection = (title: string) => {
    sectionMap.set(doc.getNumberOfPages(), title);
  };

  // ════════════════════════════════════════════════════════════════════
  // COVER PAGE — landing hero: light bg, pill, mixed-type headline
  // ════════════════════════════════════════════════════════════════════
  doc.setFillColor(C.paper);
  doc.rect(0, 0, pw, ph, "F");

  // Dotted grid texture
  doc.setFillColor(...hexRGB(C.faint));
  const dg = 9;
  for (let gx = 0; gx < pw; gx += dg) {
    for (let gy = 0; gy < ph; gy += dg) {
      doc.circle(gx, gy, 0.12, "F");
    }
  }

  // Top brand row
  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.black);
  doc.text("TikAnalytics", MARGIN.left, MARGIN.top + 4);
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, `Edition ${new Date().getFullYear()}`, pw - MARGIN.right, MARGIN.top + 4, 1, "right");

  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, MARGIN.top + 8, pw - MARGIN.right, MARGIN.top + 8);

  // Pill
  drawPill(doc, MARGIN.left, ph * 0.30, "Comprehensive Analytics · ML-driven");

  // Hero headline — Analytics / Report (serif italic)
  let heroY = ph * 0.30 + 22;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(42);
  doc.setTextColor(C.black);
  doc.text("Analytics", MARGIN.left, heroY);

  heroY += 17;
  doc.setFont(FONT.serif, "bolditalic");
  doc.setFontSize(44);
  doc.setTextColor(C.black);
  doc.text("Report", MARGIN.left, heroY);

  // Sub copy
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(C.body);
  const heroSub = doc.splitTextToSize(
    "Comprehensive review of content performance, hashtag intelligence, posting schedule optimization, and AI-driven content strategy recommendations.",
    pw * 0.60,
  );
  doc.text(heroSub, MARGIN.left, heroY + 11);

  // Accent underline
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, heroY + 11 + heroSub.length * 5 + 3, 26, 1.2, "F");

  // Bottom meta — 4 cards
  const metaCardY = ph - MARGIN.bottom - 34;
  const metaCards = [
    { label: "Account", value: data.accountFilter === "all" ? "All Accounts" : `@${data.accountFilter}` },
    { label: "Period", value: data.period.replace(/_/g, " ") },
    { label: "Generated", value: nowDateStr() },
    { label: "Author", value: "Nico Revaldo" },
  ];
  const gap = GRID.sm;
  const mcW = (cw - gap * 3) / 4;
  const mcH = 22;
  metaCards.forEach((m, i) => {
    const x = MARGIN.left + i * (mcW + gap);
    doc.setFillColor(C.paper);
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, metaCardY, mcW, mcH, 2, 2, "FD");

    doc.setFontSize(5.5);
    doc.setFont(FONT.sans, "bold");
    doc.setTextColor(C.muted);
    trackedText(doc, m.label, x + 5, metaCardY + 7, 1.1);

    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(11);
    doc.setTextColor(C.black);
    const vLines = doc.splitTextToSize(m.value, mcW - 10);
    doc.text(vLines[0] || "", x + 5, metaCardY + mcH - 6);
  });

  // Footer signature
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Tugas Akhir · TikTok BI", MARGIN.left, ph - MARGIN.bottom, 1.2);
  doc.setFont(FONT.sans, "normal");
  trackedText(doc, "tiktokbi.report", pw - MARGIN.right, ph - MARGIN.bottom, 1.2, "right");

  // ════════════════════════════════════════════════════════════════════
  // TABLE OF CONTENTS
  // ════════════════════════════════════════════════════════════════════
  doc.addPage();
  recordSection("Contents");
  drawContentsPage(
    doc,
    [
      { num: "01", title: "KPI Summary & Historical Trends", desc: "Key performance indicators and trend data across the reporting window", pages: "pp. 4–5" },
      { num: "02", title: "Content Performance Analysis", desc: "Video-level metrics with ML-predicted viral probability and tiering", pages: "pp. 6–7" },
      { num: "03", title: "Optimal Posting Schedule", desc: "Engagement heatmap and top-ranked posting slots", pages: "pp. 8–9" },
      { num: "04", title: "Hashtag Recommendations", desc: "Machine-learning ranked hashtag strategy with reach forecasts", pages: "pp. 10–11" },
      { num: "05", title: "Timing & Keyword Insights", desc: "Optimal posting times and NLP-extracted keyword analysis", pages: "pp. 12–13" },
      { num: "06", title: "Content Strategy Recommendations", desc: "AI-generated content directions with priority and confidence", pages: "pp. 14–15" },
      { num: "07", title: "Data Visualization", desc: "Vector-rendered trend, distribution, and cluster characteristic charts", pages: "pp. 16–17" },
    ],
    [
      "Methodology: Random Forest, SVM, K-Means clustering; NLP automatic summarization;",
      "Echotik API ingestion; CRISP-DM analytics framework.",
    ],
  );

  // ════════════════════════════════════════════════════════════════════
  // SECTION 01 — KPI SUMMARY
  // ════════════════════════════════════════════════════════════════════
  dividerPages.add(drawSectionDivider(
    doc, "01",
    "KPI", "Summary",
    "Aggregate performance indicators and time-series engagement data across the reporting period.",
  ));
  recordSection("01 · KPI Summary");

  doc.addPage();
  recordSection("01 · KPI Summary");
  let y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "01",
    "KPI", "Summary",
    `Account @${data.accountFilter} · Period ${data.period.replace(/_/g, " ")}`,
  );

  const hist = data.historicalData;
  if (hist.length > 0) {
    const totalVideos = hist.reduce((s, d) => s + d.videos, 0);
    const totalViews = hist.reduce((s, d) => s + d.views, 0);
    const totalLikes = hist.reduce((s, d) => s + d.likes, 0);
    const totalComments = hist.reduce((s, d) => s + d.comments, 0);
    const totalShares = hist.reduce((s, d) => s + d.shares, 0);
    const avgEng = hist.reduce((s, d) => s + d.engagement, 0) / hist.length;
    const avgViral = hist.reduce((s, d) => s + d.viralProb, 0) / hist.length;

    const cgap = GRID.sm;
    const cardW = (cw - cgap * 3) / 4;
    const cardH = 26;

    const row1 = [
      { value: fmtNum(totalVideos), label: "Total Videos", hl: true },
      { value: fmtNum(totalViews), label: "Total Views", hl: false },
      { value: fmtNum(totalLikes), label: "Total Likes", hl: false },
      { value: fmtNum(totalComments), label: "Total Comments", hl: false },
    ];

    const row2 = [
      { value: fmtNum(totalShares), label: "Total Shares", hl: false },
      { value: `${avgEng.toFixed(1)}%`, label: "Avg Engagement", hl: true },
      { value: avgViral.toFixed(2), label: "Avg Viral Probability", hl: false },
      { value: String(hist.length), label: "Data Points", hl: false },
    ];

    row1.forEach((kpi, i) => {
      drawStatCard(doc, MARGIN.left + i * (cardW + cgap), y, cardW, cardH, kpi.value, kpi.label, kpi.hl);
    });
    y += cardH + cgap;
    row2.forEach((kpi, i) => {
      drawStatCard(doc, MARGIN.left + i * (cardW + cgap), y, cardW, cardH, kpi.value, kpi.label, kpi.hl);
    });
    y += cardH + GRID.xl;

    y = drawSubsectionTitle(doc, y, "Historical Trends", `${hist.length} data points`);

    autoTable(doc, {
      ...refinedTableConfig(y),
      head: [["Date", "Videos", "Views", "Likes", "Comments", "Shares", "Eng %", "Viral"]],
      body: hist.map((d) => [
        d.date,
        d.videos.toString(),
        fmtNum(d.views),
        fmtNum(d.likes),
        fmtNum(d.comments),
        fmtNum(d.shares),
        `${d.engagement.toFixed(1)}%`,
        d.viralProb.toFixed(2),
      ]),
      columnStyles: {
        0: { cellWidth: 28, fontStyle: "bold", textColor: C.ink },
        1: { halign: "right" as const },
        2: { halign: "right" as const },
        3: { halign: "right" as const },
        4: { halign: "right" as const },
        5: { halign: "right" as const },
        6: { halign: "right" as const },
        7: { halign: "right" as const },
      },
      didDrawPage: () => { drawPageHeader(doc); recordSection("01 · KPI Summary"); },
    });

    y = (doc as any).lastAutoTable.finalY + GRID.lg;
  } else {
    doc.setFillColor(C.cream);
    doc.rect(MARGIN.left, y, cw, 18, "F");
    doc.setFontSize(8.5);
    doc.setFont(FONT.sans, "italic");
    doc.setTextColor(C.body);
    doc.text("No historical data available for this account.", MARGIN.left + 8, y + 11);
  }

  // ════════════════════════════════════════════════════════════════════
  // SECTION 02 — CONTENT PERFORMANCE
  // ════════════════════════════════════════════════════════════════════
  if (data.performanceData.length > 0) {
    dividerPages.add(drawSectionDivider(
      doc, "02",
      "Content", "Performance",
      "Video-level performance with ML-predicted viral probability, engagement tier, and content cluster assignment.",
    ));
    recordSection("02 · Content Performance");

    doc.addPage();
    recordSection("02 · Content Performance");
    y = MARGIN.top + 12;
    y = drawSectionTitle(
      doc, y, "02",
      "Content", "Performance",
      `${data.performanceData.length} videos analyzed · Random Forest · SVM · K-Means`,
    );

    const perfAvgEng = data.performanceData.reduce((s, d) => s + d.engagement, 0) / data.performanceData.length;
    const perfAvgViral = data.performanceData.reduce((s, d) => s + d.viralProb, 0) / data.performanceData.length;
    const topTierCount = data.performanceData.filter(d => d.tier === "High" || d.tier === "Top").length;

    const stripStats = [
      { label: "Videos", value: String(data.performanceData.length) },
      { label: "Avg Engagement", value: `${perfAvgEng.toFixed(1)}%` },
      { label: "Avg Viral Prob", value: perfAvgViral.toFixed(2) },
      { label: "High/Top Tier", value: String(topTierCount) },
    ];

    const stripW = cw / stripStats.length;
    doc.setDrawColor(C.black);
    doc.setLineWidth(0.4);
    doc.line(MARGIN.left, y, pw - MARGIN.right, y);

    stripStats.forEach((s, i) => {
      const sx = MARGIN.left + i * stripW;
      doc.setFontSize(6);
      doc.setFont(FONT.sans, "bold");
      doc.setTextColor(C.muted);
      trackedText(doc, s.label, sx, y + 6, 1.2);
      doc.setFont(FONT.serif, "bold");
      doc.setFontSize(16);
      doc.setTextColor(C.black);
      doc.text(s.value, sx, y + 16);
    });
    doc.setDrawColor(C.rule);
    doc.setLineWidth(0.2);
    doc.line(MARGIN.left, y + 20, pw - MARGIN.right, y + 20);

    y += 26;

    y = drawSubsectionTitle(doc, y, "Per-Video Performance", `Top ${Math.min(30, data.performanceData.length)} videos`);

    autoTable(doc, {
      ...refinedTableConfig(y),
      head: [["#", "Title", "Account", "Views", "Likes", "Eng %", "Viral", "Tier", "Cluster"]],
      body: data.performanceData.slice(0, 30).map((row, i) => [
        String(i + 1).padStart(2, "0"),
        row.title.length > 38 ? row.title.substring(0, 38) + "…" : row.title,
        `@${row.account}`,
        fmtNum(row.views),
        fmtNum(row.likes),
        `${row.engagement.toFixed(1)}%`,
        row.viralProb.toFixed(2),
        row.tier,
        `C${row.clusterId}`,
      ]),
      columnStyles: {
        0: { halign: "right" as const, cellWidth: 9, textColor: C.accent, fontStyle: "bold" },
        1: { cellWidth: 44, fontStyle: "bold", textColor: C.ink },
        2: { cellWidth: 22, textColor: C.body },
        3: { halign: "right" as const, cellWidth: 16 },
        4: { halign: "right" as const, cellWidth: 14 },
        5: { halign: "right" as const, cellWidth: 14 },
        6: { halign: "right" as const, cellWidth: 14 },
        7: { halign: "center" as const, cellWidth: 14 },
        8: { halign: "center" as const, cellWidth: 12 },
      },
      didDrawPage: () => { drawPageHeader(doc); recordSection("02 · Content Performance"); },
    });

    y = (doc as any).lastAutoTable.finalY + GRID.lg;
  }

  // ════════════════════════════════════════════════════════════════════
  // SECTION 03 — POSTING SCHEDULE
  // ════════════════════════════════════════════════════════════════════
  const hasHeatmap = data.heatmapMatrix.some((row) => row.some((v) => v > 0));
  if (hasHeatmap || data.topSlots.length > 0) {
    dividerPages.add(drawSectionDivider(
      doc, "03",
      "Optimal", "Schedule",
      "Engagement heatmap analysis and top-ranked posting time recommendations derived from historical performance.",
    ));
    recordSection("03 · Schedule");

    doc.addPage();
    recordSection("03 · Schedule");
    y = MARGIN.top + 12;
    y = drawSectionTitle(
      doc, y, "03",
      "Optimal", "Schedule",
      "Expected engagement rate per time slot · ML confidence-ranked",
    );

    if (hasHeatmap) {
      y = drawSubsectionTitle(doc, y, "Engagement Heatmap", "Day × time slot intensity");

      const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const SLOTS = ["06–09", "09–12", "12–15", "15–18", "18–21", "21–24"];
      const labelW = 16;
      const cellW = (cw - labelW) / SLOTS.length;
      const cellH = 11;

      doc.setFontSize(6.5);
      doc.setFont(FONT.sans, "bold");
      doc.setTextColor(C.muted);
      SLOTS.forEach((slot, si) => {
        trackedText(doc, slot, MARGIN.left + labelW + si * cellW + cellW / 2, y + 4, 0.8, "center");
      });
      y += GRID.md;

      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left, y, pw - MARGIN.right, y);

      const maxVal = Math.max(...data.heatmapMatrix.flat(), 1);
      const [aR, aG, aB] = hexRGB(C.accentDeep);
      DAYS_SHORT.forEach((day, di) => {
        doc.setFontSize(7);
        doc.setFont(FONT.sans, "bold");
        doc.setTextColor(C.graphite);
        doc.text(day, MARGIN.left + 1, y + cellH / 2 + 2);

        data.heatmapMatrix[di]?.forEach((val, si) => {
          const cx = MARGIN.left + labelW + si * cellW;
          const intensity = Math.min(val / maxVal, 1);

          const r = Math.round(255 - intensity * (255 - aR));
          const g = Math.round(255 - intensity * (255 - aG));
          const b = Math.round(255 - intensity * (255 - aB));

          doc.setFillColor(r, g, b);
          doc.rect(cx + 0.5, y + 0.5, cellW - 1, cellH - 1, "F");

          if (val > 0) {
            doc.setFontSize(6.5);
            doc.setFont(FONT.serif, "bold");
            doc.setTextColor(intensity > 0.5 ? C.paper : C.ink);
            doc.text(`${val.toFixed(1)}`, cx + cellW / 2, y + cellH / 2 + 2, { align: "center" });
          }
        });
        y += cellH;
      });

      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left, y, pw - MARGIN.right, y);

      y += GRID.md + 1;
      doc.setFontSize(6);
      doc.setFont(FONT.sans, "bold");
      doc.setTextColor(C.muted);
      const intensityLabel = "Intensity";
      trackedText(doc, intensityLabel, MARGIN.left, y + 3, 1.1);

      const legendX = MARGIN.left + trackedWidth(doc, intensityLabel, 1.1) + 8;
      const legendW = 56;
      for (let gi = 0; gi < 56; gi++) {
        const ratio = gi / 56;
        const rr = Math.round(255 - ratio * (255 - aR));
        const gg = Math.round(255 - ratio * (255 - aG));
        const bb = Math.round(255 - ratio * (255 - aB));
        doc.setFillColor(rr, gg, bb);
        doc.rect(legendX + gi * (legendW / 56), y, legendW / 56 + 0.1, 3, "F");
      }
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.15);
      doc.rect(legendX, y, legendW, 3, "S");
      doc.setFont(FONT.sans, "normal");
      doc.setTextColor(C.muted);
      doc.setFontSize(6);
      doc.text("Low", legendX - 1, y + 6.5, { align: "right" });
      doc.text("High", legendX + legendW + 1, y + 6.5);

      y += GRID.xl;
    }

    if (data.topSlots.length > 0) {
      y = ensurePage(doc, y, 60);
      y = drawSubsectionTitle(doc, y, "Top 5 Recommended Slots", "Engagement × confidence ranked");

      autoTable(doc, {
        ...refinedTableConfig(y),
        head: [["#", "Day", "Time", "Est. Engagement", "Confidence", "Reasoning"]],
        body: data.topSlots.slice(0, 5).map((slot, i) => [
          String(i + 1).padStart(2, "0"),
          slot.dayLabel || slot.day,
          slot.timeLabel || slot.time,
          `${slot.expectedEng?.toFixed(1) || "—"}%`,
          `${((slot.confidence || 0) * 100).toFixed(0)}%`,
          (slot.reasoning || "—").substring(0, 65) + ((slot.reasoning || "").length > 65 ? "…" : ""),
        ]),
        columnStyles: {
          0: { halign: "right" as const, cellWidth: 12, textColor: C.accent, fontStyle: "bold" },
          1: { cellWidth: 22, fontStyle: "bold", textColor: C.ink },
          2: { cellWidth: 18 },
          3: { halign: "right" as const, cellWidth: 28 },
          4: { halign: "right" as const, cellWidth: 22 },
          5: { cellWidth: 64, textColor: C.body },
        },
        didDrawPage: () => { drawPageHeader(doc); recordSection("03 · Schedule"); },
      });
      y = (doc as any).lastAutoTable.finalY + GRID.lg;
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // SECTION 04 — HASHTAG RECOMMENDATIONS
  // ════════════════════════════════════════════════════════════════════
  if (data.hashtagRecommendations.length > 0) {
    dividerPages.add(drawSectionDivider(
      doc, "04",
      "Hashtag", "Recommendations",
      "Machine-learning ranked hashtag suggestions with expected reach, engagement, and competition analysis.",
    ));
    recordSection("04 · Hashtags");

    doc.addPage();
    recordSection("04 · Hashtags");
    y = MARGIN.top + 12;
    y = drawSectionTitle(
      doc, y, "04",
      "Hashtag", "Recommendations",
      `${data.hashtagRecommendations.length} hashtags ranked by ML recommendation score`,
    );

    // Top hashtag — feature card style
    const topHash = data.hashtagRecommendations[0];
    if (topHash) {
      const cardH = 32;
      doc.setFillColor(C.paper);
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGIN.left, y, cw, cardH, 2, 2, "FD");

      // Icon chip (indigo)
      doc.setFillColor(...hexRGB(C.accent));
      doc.roundedRect(MARGIN.left + 5, y + 5, 8, 8, 1.5, 1.5, "F");
      doc.setFillColor(C.paper);
      doc.circle(MARGIN.left + 9, y + 9, 1.4, "F");

      // Eyebrow
      doc.setFontSize(6.5);
      doc.setFont(FONT.sans, "bold");
      doc.setTextColor(...hexRGB(C.accent));
      trackedText(doc, "Top Recommendation", MARGIN.left + 18, y + 8, 1.5);

      // Hashtag — large serif
      const hashLabel = topHash.hashtag?.startsWith("#") ? topHash.hashtag : `#${topHash.hashtag}`;
      doc.setFont(FONT.serif, "bold");
      doc.setFontSize(hashLabel.length > 20 ? 13 : hashLabel.length > 15 ? 16 : 20);
      doc.setTextColor(C.black);
      doc.text(hashLabel, MARGIN.left + 18, y + 19);

      // Metrics
      const metrics = [
        { label: "ML Score", value: fmtPct(topHash.recommendationScore) },
        { label: "Reach", value: fmtNum(topHash.expectedReach) },
        { label: "Engagement", value: fmtPct(topHash.expectedEngagementRate) },
        { label: "Competition", value: topHash.competitionLevel },
      ];
      const mW = cw / 2 / metrics.length;
      const mStart = MARGIN.left + cw / 2;
      metrics.forEach((m, i) => {
        const mx = mStart + i * mW;
        doc.setFontSize(5.5);
        doc.setFont(FONT.sans, "bold");
        doc.setTextColor(C.muted);
        trackedText(doc, m.label, mx, y + 8, 1);
        doc.setFont(FONT.serif, "bold");
        doc.setFontSize(10);
        doc.setTextColor(C.black);
        doc.text(m.value, mx, y + 16);
      });

      // Reasoning
      doc.setFontSize(7);
      doc.setFont(FONT.sans, "italic");
      doc.setTextColor(C.body);
      const reasoningClean = (topHash.reasoning || "").substring(0, 110) + ((topHash.reasoning || "").length > 110 ? "…" : "");
      doc.text(reasoningClean, MARGIN.left + 18, y + 27);

      y += cardH + GRID.lg;
    }

    y = drawSubsectionTitle(doc, y, "Full Recommendation Ranking", `${data.hashtagRecommendations.length} hashtags`);

    autoTable(doc, {
      ...refinedTableConfig(y),
      head: [["#", "Hashtag", "ML Score", "Reach", "Eng. Rate", "Competition", "Reasoning"]],
      body: data.hashtagRecommendations.map((rec) => [
        String(rec.rankPosition).padStart(2, "0"),
        rec.hashtag?.startsWith("#") ? rec.hashtag : `#${rec.hashtag}`,
        fmtPct(rec.recommendationScore),
        fmtNum(rec.expectedReach),
        fmtPct(rec.expectedEngagementRate),
        rec.competitionLevel || "Medium",
        (rec.reasoning || "").substring(0, 55) + ((rec.reasoning || "").length > 55 ? "…" : ""),
      ]),
      columnStyles: {
        0: { halign: "right" as const, cellWidth: 10, textColor: C.accent, fontStyle: "bold" },
        1: { cellWidth: 30, fontStyle: "bold", textColor: C.ink },
        2: { halign: "right" as const, cellWidth: 18 },
        3: { halign: "right" as const, cellWidth: 18 },
        4: { halign: "right" as const, cellWidth: 18 },
        5: { cellWidth: 22 },
        6: { cellWidth: 50, textColor: C.body },
      },
      didDrawPage: () => { drawPageHeader(doc); recordSection("04 · Hashtags"); },
    });

    y = (doc as any).lastAutoTable.finalY + GRID.lg;
  }

  // ════════════════════════════════════════════════════════════════════
  // SECTION 05 — TIMING & KEYWORDS
  // ════════════════════════════════════════════════════════════════════
  const hasPostingTime = data.optimalSchedule.length > 0;
  const hasKeywords = data.keywordRecommendations.length > 0;

  if (hasPostingTime || hasKeywords) {
    dividerPages.add(drawSectionDivider(
      doc, "05",
      "Timing &", "Keywords",
      "ML-derived posting time recommendations and NLP-extracted keywords for content optimization.",
    ));
    recordSection("05 · Timing & Keywords");

    if (hasPostingTime) {
      doc.addPage();
      recordSection("05 · Timing & Keywords");
      y = MARGIN.top + 12;
      y = drawSectionTitle(
        doc, y, "05",
        "Posting", "Time",
        `${data.optimalSchedule.length} optimal time slots ranked by ML confidence`,
      );

      autoTable(doc, {
        ...refinedTableConfig(y),
        head: [["#", "Day", "Time", "Eng. Rate", "Exp. Views", "Confidence", "Sample", "Reasoning"]],
        body: data.optimalSchedule.slice(0, 12).map((rec) => [
          String(rec.rankPosition).padStart(2, "0"),
          rec.dayName,
          rec.timeLabel || `${rec.hourOfDay.toString().padStart(2, "0")}:00`,
          fmtPct(rec.expectedEngagementRate),
          rec.expectedViews ? fmtNum(rec.expectedViews) : "—",
          fmtPct(rec.confidenceScore),
          String(rec.sampleSize || 1),
          (rec.reasoning || "").substring(0, 48) + ((rec.reasoning || "").length > 48 ? "…" : ""),
        ]),
        columnStyles: {
          0: { halign: "right" as const, cellWidth: 10, textColor: C.accent, fontStyle: "bold" },
          1: { cellWidth: 22, fontStyle: "bold", textColor: C.ink },
          2: { cellWidth: 16 },
          3: { halign: "right" as const, cellWidth: 18 },
          4: { halign: "right" as const, cellWidth: 18 },
          5: { halign: "right" as const, cellWidth: 20 },
          6: { halign: "right" as const, cellWidth: 14 },
          7: { cellWidth: 50, textColor: C.body },
        },
        didDrawPage: () => { drawPageHeader(doc); recordSection("05 · Timing & Keywords"); },
      });

      y = (doc as any).lastAutoTable.finalY + GRID.xl;
    }

    if (hasKeywords) {
      if (!hasPostingTime) {
        doc.addPage();
        recordSection("05 · Timing & Keywords");
        y = MARGIN.top + 12;
        y = drawSectionTitle(
          doc, y, "05",
          "Keyword", "Insights",
          `${data.keywordRecommendations.length} keywords extracted via NLP`,
        );
      } else {
        y = ensurePage(doc, y, 80);
        y = drawSubsectionTitle(doc, y, "Keyword Recommendations", `${data.keywordRecommendations.length} keywords · NLP-extracted`);
      }

      // Top keywords pull-quote (feature-card style)
      const keywordList: string[] = [];
      let currentLength = 0;
      for (const k of data.keywordRecommendations.slice(0, 5)) {
        const kwText = `"${k.keyword}"`;
        if (currentLength + kwText.length + 5 > 80) break;
        keywordList.push(kwText);
        currentLength += kwText.length + 5;
      }
      const topKws = keywordList.join("  ·  ");

      const kwBoxH = 18;
      doc.setFillColor(C.paper);
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGIN.left, y, cw, kwBoxH, 2, 2, "FD");

      doc.setFillColor(...hexRGB(C.accent));
      doc.roundedRect(MARGIN.left + 5, y + 5, 8, 8, 1.5, 1.5, "F");
      doc.setFillColor(C.paper);
      doc.circle(MARGIN.left + 9, y + 9, 1.4, "F");

      doc.setFontSize(6);
      doc.setFont(FONT.sans, "bold");
      doc.setTextColor(...hexRGB(C.accent));
      trackedText(doc, "Top Keywords", MARGIN.left + 18, y + 7, 1.5);
      doc.setFont(FONT.serif, "italic");
      doc.setFontSize(10);
      doc.setTextColor(C.black);
      doc.text(topKws, MARGIN.left + 18, y + 14);
      y += kwBoxH + GRID.md;

      autoTable(doc, {
        ...refinedTableConfig(y),
        head: [["#", "Keyword", "Type", "Relevance", "Frequency", "Videos"]],
        body: data.keywordRecommendations.slice(0, 20).map((rec, i) => [
          String(i + 1).padStart(2, "0"),
          rec.keyword,
          rec.keywordType || "Noun",
          fmtPct(rec.avgRelevanceScore),
          `${rec.totalFrequency || 1}`,
          `${rec.totalVideos || 1}`,
        ]),
        columnStyles: {
          0: { halign: "right" as const, cellWidth: 10, textColor: C.accent, fontStyle: "bold" },
          1: { cellWidth: 42, fontStyle: "bold", textColor: C.ink },
          2: { cellWidth: 22, textColor: C.body },
          3: { halign: "right" as const, cellWidth: 26 },
          4: { halign: "right" as const, cellWidth: 24 },
          5: { halign: "right" as const, cellWidth: 24 },
        },
        didDrawPage: () => { drawPageHeader(doc); recordSection("05 · Timing & Keywords"); },
      });

      y = (doc as any).lastAutoTable.finalY + GRID.lg;
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // SECTION 06 — CONTENT STRATEGY
  // ════════════════════════════════════════════════════════════════════
  if (data.contentRecs.length > 0) {
    dividerPages.add(drawSectionDivider(
      doc, "06",
      "Content", "Strategy",
      "AI-generated content directions with priority ranking, suggested keywords and hashtags, and engagement predictions.",
    ));
    recordSection("06 · Strategy");

    doc.addPage();
    recordSection("06 · Strategy");
    y = MARGIN.top + 12;
    y = drawSectionTitle(
      doc, y, "06",
      "Content", "Strategy",
      `${data.contentRecs.length} ML-driven content recommendations`,
    );

    data.contentRecs.forEach((rec, idx) => {
      const title = rec.title.length > 95 ? rec.title.substring(0, 95) + "…" : rec.title;
      const titleLines = doc.splitTextToSize(title, cw - 28);
      const titleH = titleLines.length * 4.2;

      const desc = rec.description.length > 200 ? rec.description.substring(0, 200) + "…" : rec.description;
      const descLines = doc.splitTextToSize(desc, cw - 28);
      const descH = descLines.length * 3.2;

      const keywords = rec.keywords || [];
      const hashtags = rec.hashtags || [];

      let metaH = 0;
      if (keywords.length > 0) metaH += 3.5;
      if (hashtags.length > 0) metaH += 3.5;
      if (metaH === 0) metaH = 3.5;

      const headerH = 11;
      const cardH = headerH + titleH + 1 + descH + 2 + 4 + metaH + 2;

      y = ensurePage(doc, y, cardH);

      doc.setFillColor(C.paper);
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGIN.left, y, cw, cardH, 2, 2, "FD");

      // Priority accent — thin vertical bar
      const prioColors: Record<string, string> = {
        high: C.negative,
        medium: C.warning,
        low: C.positive,
      };
      const prioColor = prioColors[rec.priority] || C.accent;
      doc.setFillColor(...hexRGB(prioColor));
      doc.rect(MARGIN.left, y, 1.5, cardH, "F");

      // Card number — serif indigo
      doc.setFont(FONT.serif, "normal");
      doc.setFontSize(20);
      doc.setTextColor(...hexRGB(C.accent));
      doc.text(String(idx + 1).padStart(2, "0"), MARGIN.left + 7, y + 12);

      // Priority + Type chips
      const chipsY = y + 7;
      const chipsX = MARGIN.left + 22;

      doc.setFontSize(5.5);
      doc.setFont(FONT.sans, "bold");
      doc.setTextColor(...hexRGB(prioColor));
      trackedText(doc, rec.priority.toUpperCase(), chipsX, chipsY, 1.3);

      doc.setTextColor(C.rule);
      doc.text("·", chipsX + 22, chipsY);

      doc.setTextColor(C.muted);
      trackedText(doc, rec.type, chipsX + 26, chipsY, 1.3);

      // Confidence
      doc.setFont(FONT.sans, "bold");
      doc.setFontSize(6);
      doc.setTextColor(C.muted);
      trackedText(doc, "Confidence", pw - MARGIN.right - 22, chipsY, 1.2);
      doc.setFont(FONT.serif, "bold");
      doc.setFontSize(11);
      doc.setTextColor(C.black);
      doc.text(`${(rec.confidence * 100).toFixed(0)}%`, pw - MARGIN.right - 4, chipsY + 2, { align: "right" });

      // Title — serif bold
      doc.setFont(FONT.serif, "bold");
      doc.setFontSize(12);
      doc.setTextColor(C.black);
      doc.text(titleLines, MARGIN.left + 22, y + 13);

      // Description
      doc.setFont(FONT.sans, "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(C.body);
      const descY = y + 13 + titleH + 1;
      doc.text(descLines, MARGIN.left + 22, descY);

      // Meta row
      const dividerY = descY + descH + 2;
      doc.setDrawColor(C.ruleSoft);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left + 22, dividerY, pw - MARGIN.right - 4, dividerY);

      const metaY = dividerY + 4;

      if (keywords.length > 0) {
        doc.setFontSize(5.5);
        doc.setFont(FONT.sans, "bold");
        doc.setTextColor(...hexRGB(C.accent));
        trackedText(doc, "Keywords", MARGIN.left + 22, metaY, 1.2);
        doc.setFont(FONT.sans, "normal");
        doc.setFontSize(7);
        doc.setTextColor(C.ink);
        doc.text(keywords.slice(0, 4).join(", "), MARGIN.left + 22 + 16, metaY);
      }

      if (hashtags.length > 0) {
        const hashtagY = keywords.length > 0 ? metaY + 3.5 : metaY;
        doc.setFontSize(5.5);
        doc.setFont(FONT.sans, "bold");
        doc.setTextColor(...hexRGB(C.accent));
        trackedText(doc, "Hashtags", MARGIN.left + 22, hashtagY, 1.2);
        doc.setFont(FONT.sans, "normal");
        doc.setFontSize(7);
        doc.setTextColor(C.ink);
        doc.text(hashtags.slice(0, 4).join(" "), MARGIN.left + 22 + 16, hashtagY);
      }

      doc.setFontSize(6);
      doc.setFont(FONT.sans, "normal");
      doc.setTextColor(C.muted);
      doc.text(`${rec.duration}  ·  ${rec.expectedReach}`, pw - MARGIN.right - 4, metaY + 2, { align: "right" });

      y += cardH + GRID.md;
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SECTION 07 — DATA VISUALIZATION
  // ════════════════════════════════════════════════════════════════════
  const hasVizData =
    data.historicalData.length >= 2 ||
    data.hashtagRecommendations.length > 0 ||
    data.performanceData.length > 0 ||
    data.keywordRecommendations.length > 0;

  if (hasVizData) {
    dividerPages.add(drawSectionDivider(
      doc, "07",
      "Data", "Visualization",
      "Visual analytics across engagement trends, hashtag performance, content tier distribution, and cluster characteristics.",
    ));
    recordSection("07 · Visualization");

    doc.addPage();
    recordSection("07 · Visualization");
    y = MARGIN.top + 12;
    y = drawSectionTitle(
      doc, y, "07",
      "Data", "Visualization",
      "Vector-rendered charts · zoom-stable · print-ready",
    );

    // Chart 1 — Line chart (full width)
    if (data.historicalData.length >= 2) {
      const chartH = 78;
      drawLineChart(
        doc, MARGIN.left, y, cw, chartH,
        data.historicalData,
        "Figure 7.1 · Historical Trend",
        "Engagement rate (%) and total views across reporting period",
      );
      y += chartH + GRID.lg;
    }

    // Chart 2 — Bar chart (full width)
    if (data.hashtagRecommendations.length > 0) {
      const topHashtags = data.hashtagRecommendations.slice(0, 8).map((h) => ({
        label: h.hashtag?.startsWith("#") ? h.hashtag : `#${h.hashtag}`,
        value: h.recommendationScore * 100,
      }));
      const chartH = Math.max(60, 18 + topHashtags.length * 9);
      y = ensurePage(doc, y, chartH + 10);
      drawBarChart(
        doc, MARGIN.left, y, cw, chartH,
        topHashtags,
        "Figure 7.2 · Top Hashtag Recommendation Scores",
        "ML recommendation score (%) — Random Forest classifier output",
        (v) => `${v.toFixed(1)}%`,
      );
      y += chartH + GRID.lg;
    }

    const hasTierData = data.performanceData.length > 0;
    const hasKwData = data.keywordRecommendations.length > 0;

    if (hasTierData || hasKwData) {
      doc.addPage();
      recordSection("07 · Visualization");
      y = MARGIN.top + 12;

      // Subsection title (continuation)
      drawPill(doc, MARGIN.left, y, "Section 07 · Continued");
      doc.setFont(FONT.sans, "bold");
      doc.setFontSize(18);
      doc.setTextColor(C.black);
      doc.text("Distribution", MARGIN.left, y + 16);
      const distW = doc.getTextWidth("Distribution");
      doc.setFont(FONT.serif, "bolditalic");
      doc.setFontSize(19);
      doc.text(" & Composition", MARGIN.left + distW, y + 16);

      y += GRID.xxl + 4;

      const halfW = (cw - GRID.md) / 2;
      const chartH = 72;

      // Chart 3 — Donut: Tier distribution
      if (hasTierData) {
        const tierCounts: Record<string, number> = {};
        data.performanceData.forEach(p => {
          const t = p.tier || "Unknown";
          tierCounts[t] = (tierCounts[t] || 0) + 1;
        });

        const tierColorMap: Record<string, string> = {
          Top:    C.accent,
          High:   C.black,
          Medium: C.accentDeep,
          Low:    C.muted,
          Unknown: C.rule,
        };

        const segments = Object.entries(tierCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([label, value]) => ({
            label,
            value,
            color: tierColorMap[label] || C.graphite,
          }));

        const total = segments.reduce((s, seg) => s + seg.value, 0);

        drawDonutChart(
          doc, MARGIN.left, y, halfW, chartH,
          segments,
          "Figure 7.3 · Tier Distribution",
          "ML-predicted engagement tier",
          "Total Videos",
          String(total),
        );
      }

      // Chart 4 — Bar: Top keywords
      if (hasKwData) {
        const topKws = data.keywordRecommendations.slice(0, 7).map((k) => ({
          label: k.keyword,
          value: k.avgRelevanceScore * 100,
        }));
        drawBarChart(
          doc, MARGIN.left + halfW + GRID.md, y, halfW, chartH,
          topKws,
          "Figure 7.4 · Top Keyword Relevance",
          "NLP-extracted keyword relevance score (%)",
          (v) => `${v.toFixed(0)}%`,
        );
      }

      y += chartH + GRID.lg;

      // Chart 5 — Radar: Cluster characteristics
      if (data.performanceData.length > 0) {
        const clusterMap = new Map<number, ContentRow[]>();
        data.performanceData.forEach(row => {
          if (!clusterMap.has(row.clusterId)) clusterMap.set(row.clusterId, []);
          clusterMap.get(row.clusterId)!.push(row);
        });

        const topClusters = Array.from(clusterMap.entries())
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 4);

        if (topClusters.length >= 2) {
          const radarH = 78;
          y = ensurePage(doc, y, radarH + 10);

          // Distinct cluster palette: black, indigo, indigo-deep, warning amber
          const clusterColors = [C.black, C.accent, C.accentDeep, C.warning];
          const axes = ["Views", "Likes", "Comments", "Shares", "Engagement", "Viral"];

          const series = topClusters.map(([clusterId, rows], idx) => {
            const avg = (key: keyof ContentRow) =>
              rows.reduce((s, r) => s + (r[key] as number), 0) / rows.length;
            return {
              label: `Cluster ${clusterId} (${rows.length})`,
              color: clusterColors[idx] || C.muted,
              values: [
                avg("views"),
                avg("likes") * 10,
                avg("comments") * 100,
                avg("shares") * 50,
                avg("engagement") * 1000,
                avg("viralProb") * 10000,
              ],
            };
          });

          drawRadarChart(
            doc, MARGIN.left, y, cw, radarH,
            axes, series,
            "Figure 7.5 · Content Cluster Characteristics",
            "Multi-dimensional comparison across K-Means clusters (values normalized for comparison)",
          );
          y += radarH + GRID.lg;
        }
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // BACK COVER — dark, centered thank-you
  // ════════════════════════════════════════════════════════════════════
  doc.addPage();
  backCoverPages.add(doc.getNumberOfPages());

  doc.setFillColor(C.black);
  doc.rect(0, 0, pw, ph, "F");

  // Diagonal texture
  doc.setDrawColor(38, 38, 46);
  doc.setLineWidth(0.2);
  const bcDiagGap = 26;
  for (let i = -Math.ceil(ph / bcDiagGap); i < Math.ceil(pw / bcDiagGap) + 2; i++) {
    const x0 = i * bcDiagGap;
    doc.line(x0, 0, x0 + ph * 0.55, ph);
  }

  // Center accent line
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.5);
  doc.line(pw / 2 - 20, ph * 0.42, pw / 2 + 20, ph * 0.42);

  // Thank you — sans + serif italic
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(34);
  doc.setTextColor(C.paper);
  const thankW = doc.getTextWidth("Thank");
  const youW = doc.getTextWidth(" You");
  const startX = pw / 2 - (thankW + youW) / 2;
  doc.text("Thank", startX, ph * 0.49);
  doc.setFont(FONT.serif, "bolditalic");
  doc.setFontSize(36);
  doc.text(" You", startX + thankW, ph * 0.49);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...hexRGB(C.accentSoft));
  doc.text("for reviewing this analytics report", pw / 2, ph * 0.55, { align: "center" });

  // Meta block
  const backY = ph * 0.66;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.3);
  doc.line(pw * 0.30, backY, pw * 0.70, backY);

  const backMeta = [
    { label: "Account", value: data.accountFilter === "all" ? "All Accounts" : `@${data.accountFilter}` },
    { label: "Period", value: data.period.replace(/_/g, " ") },
    { label: "Generated", value: nowStr() },
  ];
  backMeta.forEach((m, i) => {
    const yPos = backY + 8 + i * 9;
    doc.setFontSize(6);
    doc.setFont(FONT.sans, "bold");
    doc.setTextColor(...hexRGB(C.accentSoft));
    trackedText(doc, m.label, pw * 0.36, yPos, 1.2);
    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(9);
    doc.setTextColor(C.paper);
    doc.text(m.value, pw * 0.64, yPos, { align: "right" });
  });

  // Bottom brand
  doc.setFontSize(7);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI · Analytics Report", pw / 2, ph - MARGIN.bottom - 6, 1.8, "center");
  doc.setFont(FONT.sans, "normal");
  doc.setTextColor(C.muted);
  trackedText(doc, "Tugas Akhir · Nico Revaldo", pw / 2, ph - MARGIN.bottom, 1.2, "center");

  // ════════════════════════════════════════════════════════════════════
  // PAGE FURNITURE
  // Cover (page 1) + back cover: no furniture
  // Divider pages: light footer only
  // All other pages: header + footer
  // ════════════════════════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    let activeSectionTitle = "Report Overview";
    for (let pk = 1; pk <= i; pk++) {
      if (sectionMap.has(pk)) activeSectionTitle = sectionMap.get(pk)!;
    }

    if (i === 1 || backCoverPages.has(i)) continue;

    if (dividerPages.has(i)) {
      drawDividerFooter(doc, i, totalPages, activeSectionTitle);
      continue;
    }

    drawPageHeader(doc);
    drawPageFooter(doc, i, totalPages, activeSectionTitle);
  }

  // ════════════════════════════════════════════════════════════════════
  // SAVE
  // ════════════════════════════════════════════════════════════════════
  const filename = `analytics_report_${data.accountFilter}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}