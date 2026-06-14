import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Tag } from "./mock-data";

// ── Monochrome Color System with Indigo Accent ────────────────────────
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

  // Indigo accent
  accent:        "#5B5BD6",
  accentSoft:    "#8B8BE8",
  accentTint:    "#EEEEFB",
  accentDeep:    "#3A3AAE",

  // Status indicators
  positive:  "#1A7A4A",
  negative:  "#B91C1C",
  warning:   "#F59E0B",
};

const GRID = { xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, xxxl: 32 };
const MARGIN = { left: 22, right: 22, top: 22, bottom: 22 };

const FONT = {
  sans:   "helvetica",
  serif:  "times",
};

// ── Helpers ──────────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString("id-ID");
}

function fmtPercent(n: number): string {
  return n.toFixed(1) + "%";
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
  trackedText(doc, "TikTok BI · Hashtag Report", MARGIN.left, hy, 0.8);

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

  // Subtle diagonal texture
  doc.setDrawColor(38, 38, 46);
  doc.setLineWidth(0.2);
  const diagGap = 26;
  for (let i = -Math.ceil(ph / diagGap); i < Math.ceil(pw / diagGap) + 2; i++) {
    const x0 = i * diagGap;
    doc.line(x0, 0, x0 + ph * 0.55, ph);
  }

  // Accent vertical rail
  const railX = MARGIN.left + 4;
  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.5);
  doc.line(railX, ph * 0.20, railX, ph * 0.82);

  const cx = railX + 12;

  // Eyebrow
  doc.setFontSize(8);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "TikTok BI · Hashtag Analysis Report", cx, ph * 0.215, 2);

  // Big Section Numeral
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(150);
  doc.setTextColor(C.paper);
  const numBaseline = ph * 0.50;
  doc.text(sectionNum, cx, numBaseline);

  doc.setFontSize(9);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accentSoft));
  trackedText(doc, "Section", cx + 2, numBaseline + 14, 3);

  // Headline
  const titleY = ph * 0.70;
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(30);
  doc.setTextColor(C.paper);
  doc.text(titlePlain, cx, titleY);
  const plainW = doc.getTextWidth(titlePlain);
  if (titleEmphasis) {
    doc.setFont(FONT.serif, "bolditalic");
    doc.setFontSize(31);
    doc.text(` ${titleEmphasis}`, cx + plainW, titleY);
  }

  doc.setDrawColor(...hexRGB(C.accent));
  doc.setLineWidth(0.6);
  doc.line(cx, titleY + 8, cx + 16, titleY + 8);

  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...hexRGB(C.accentSoft));
  const subLines = doc.splitTextToSize(subtitle, pw * 0.5);
  doc.text(subLines, cx, titleY + 18);

  return pageNum;
}

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

  // Eyebrow
  doc.setFontSize(7);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(...hexRGB(C.accent));
  trackedText(doc, "Inside this report", MARGIN.left, y, 1.8);

  // Headline
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(30);
  doc.setTextColor(C.black);
  doc.text("Contents", MARGIN.left, y + 16);

  // Accent line
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, y + 21, 22, 1.2, "F");

  y += GRID.xxxl + 12;

  // Section list
  const rowH = 26;
  items.forEach((item, idx) => {
    if (idx > 0) {
      doc.setDrawColor(C.rule);
      doc.setLineWidth(0.2);
      doc.line(MARGIN.left, y - 6, pw - MARGIN.right, y - 6);
    }

    doc.setFont(FONT.serif, "normal");
    doc.setFontSize(26);
    doc.setTextColor(...hexRGB(C.accentSoft));
    doc.text(item.num, MARGIN.left, y + 6);

    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(14);
    doc.setTextColor(C.ink);
    doc.text(item.title, MARGIN.left + 26, y + 2);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.body);
    doc.text(item.desc, MARGIN.left + 26, y + 9);

    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(7);
    doc.setTextColor(C.muted);
    trackedText(doc, item.pages, pw - MARGIN.right, y + 4, 1.4, "right");

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

export function exportHashtagPdf(category: string, tags: Tag[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = pageW(doc);
  const ph = pageH(doc);
  const cw = contentW(doc);

  const dividerPages = new Set<number>();
  const sectionMap = new Map<number, string>();
  const recordSection = (title: string) => {
    sectionMap.set(doc.getNumberOfPages(), title);
  };

  const totalHashtags = tags.length;
  const top1 = tags[0]?.tag || "—";
  const totalUses = tags.reduce((a, b) => a + b.uses, 0);
  const avgGrowth = totalHashtags ? (tags.reduce((a, b) => a + b.weekGrowth, 0) / totalHashtags) : 0;
  const avgViews = totalHashtags ? Math.round(tags.reduce((a, b) => a + b.avgViews, 0) / totalHashtags) : 0;

  // ════════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ════════════════════════════════════════════════════════════════════
  doc.setFillColor(C.paper);
  doc.rect(0, 0, pw, ph, "F");

  // Dotted Grid hero background
  doc.setFillColor(...hexRGB(C.faint));
  const dg = 9;
  for (let gx = 0; gx < pw; gx += dg) {
    for (let gy = 0; gy < ph; gy += dg) {
      doc.circle(gx, gy, 0.12, "F");
    }
  }

  // Top header row
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

  // Eyebrow badge
  drawPill(doc, MARGIN.left, ph * 0.30, "TikTok Hashtag Trends & Distribution");

  // Title Mixed Layout
  let heroY = ph * 0.30 + 22;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(40);
  doc.setTextColor(C.black);
  doc.text("Hashtag Performance", MARGIN.left, heroY);

  heroY += 17;
  doc.setFont(FONT.serif, "bolditalic");
  doc.setFontSize(42);
  doc.setTextColor(C.black);
  doc.text("Analytics", MARGIN.left, heroY);

  heroY += 16;
  doc.setFont(FONT.sans, "bold");
  doc.setFontSize(40);
  doc.setTextColor(C.black);
  doc.text("Report", MARGIN.left, heroY);

  // Sub copy
  doc.setFont(FONT.sans, "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(C.body);
  const heroSub = doc.splitTextToSize(
    `A comprehensive performance analysis of top trending hashtags, category comparison indexes, and cumulative video engagement levels for the "${category}" category.`,
    pw * 0.60,
  );
  doc.text(heroSub, MARGIN.left, heroY + 11);

  // Accent Underline
  doc.setFillColor(...hexRGB(C.accent));
  doc.rect(MARGIN.left, heroY + 11 + heroSub.length * 5 + 3, 26, 1.2, "F");

  // KPI strip at bottom
  const metaCardY = ph - MARGIN.bottom - 34;
  const metaCards = [
    { label: "Category", value: category },
    { label: "Cumulative Uses", value: fmtNum(totalUses) },
    { label: "Total Hashtags", value: String(totalHashtags) },
  ];
  const gap = GRID.md;
  const mcW = (cw - gap * 2) / 3;
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
    doc.setFontSize(12);
    doc.setTextColor(C.black);
    const vLines = doc.splitTextToSize(m.value, mcW - 10);
    doc.text(vLines[0] || "", x + 5, metaCardY + mcH - 6);
  });

  // Footer
  doc.setFontSize(6.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Tugas Akhir · TikTok BI", MARGIN.left, ph - MARGIN.bottom, 1.2);
  doc.setFont(FONT.sans, "normal");
  trackedText(doc, "tiktokbi.report", pw - MARGIN.right, ph - MARGIN.bottom, 1.2, "right");

  // TABLE OF CONTENTS
  doc.addPage();
  recordSection("Contents");
  drawContentsPage(
    doc,
    [
      { num: "01", title: "Hashtag KPI & Trends Overview", desc: "Global uses, growth metrics, and category summaries", pages: "pp. 4–5" },
      { num: "02", title: "Detailed Hashtag Rankings", desc: "Complete performance table of analyzed hashtags with engagement details", pages: "pp. 6–7" },
    ],
    [
      "Methodology: Collected from TikTok tracked creators in OLTP, growth rates calculated over a 7-day trailing window.",
      "Engagement formula: (likes + comments + shares) / views normalized.",
    ],
  );

  // SECTION 01 — SUMMARY & DIAGRAMS
  dividerPages.add(drawSectionDivider(
    doc, "01",
    "Summary & KPI", "Metrics",
    `Overall category benchmarks, cumulative post views, and average growth indicators for the ${category} category.`
  ));
  recordSection("01 · Summary");

  doc.addPage();
  recordSection("01 · Summary");
  let y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "01",
    "Summary & KPI", "Metrics",
    "Core performance benchmarks and hashtag growth indicators"
  );

  y = drawSubsectionTitle(doc, y, "Key Performance Indicators", "Category-wide aggregation");

  // KPI Stat cards (3 cards horizontal)
  const kpiW = (cw - GRID.md * 2) / 3;
  const kpiH = 22;
  
  // Card 1: Top Tag
  doc.setFillColor(C.black);
  doc.roundedRect(MARGIN.left, y, kpiW, kpiH, 2, 2, "F");
  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Top Hashtag", MARGIN.left + 5, y + 7, 1.1);
  doc.setDrawColor("#262626");
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left + 5, y + 10, MARGIN.left + kpiW - 5, y + 10);
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.paper);
  const truncatedTop = top1.length > 20 ? top1.substring(0, 18) + "..." : top1;
  doc.text(truncatedTop, MARGIN.left + 5, y + kpiH - 6);

  // Card 2: Average Weekly Growth
  const xCard2 = MARGIN.left + kpiW + GRID.md;
  doc.setFillColor(C.paper);
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.25);
  doc.roundedRect(xCard2, y, kpiW, kpiH, 2, 2, "FD");
  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Avg Weekly Growth", xCard2 + 5, y + 7, 1.1);
  doc.setDrawColor(C.ruleSoft);
  doc.setLineWidth(0.2);
  doc.line(xCard2 + 5, y + 10, xCard2 + kpiW - 5, y + 10);
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(16);
  doc.setTextColor(avgGrowth >= 0 ? C.positive : C.negative);
  doc.text(fmtPercent(avgGrowth), xCard2 + 5, y + kpiH - 5);

  // Card 3: Avg Views per Tag
  const xCard3 = MARGIN.left + kpiW * 2 + GRID.md * 2;
  doc.setFillColor(C.paper);
  doc.setDrawColor(C.rule);
  doc.setLineWidth(0.25);
  doc.roundedRect(xCard3, y, kpiW, kpiH, 2, 2, "FD");
  doc.setFontSize(5.5);
  doc.setFont(FONT.sans, "bold");
  doc.setTextColor(C.muted);
  trackedText(doc, "Avg Views per Hashtag", xCard3 + 5, y + 7, 1.1);
  doc.setDrawColor(C.ruleSoft);
  doc.setLineWidth(0.2);
  doc.line(xCard3 + 5, y + 10, xCard3 + kpiW - 5, y + 10);
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(16);
  doc.setTextColor(C.black);
  doc.text(fmtNum(avgViews), xCard3 + 5, y + kpiH - 5);

  y += kpiH + GRID.xl;

  y = drawSubsectionTitle(doc, y, "Hashtag Trends Summary", "General overview of the top tags");

  const summaryRows = tags.slice(0, 10).map((tag, idx) => {
    return [
      `#${idx + 1}`,
      tag.tag,
      fmtNum(tag.uses),
      fmtPercent(tag.weekGrowth),
      tag.trend.toUpperCase(),
    ];
  });

  autoTable(doc, {
    ...refinedTableConfig(y),
    head: [["Rank", "Hashtag", "Cumulative Uses", "Growth", "Trend State"]],
    body: summaryRows,
    styles: { ...refinedTableConfig(y).styles, fontSize: 8 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: C.accentDeep, cellWidth: 14 },
      1: { fontStyle: "bold", textColor: C.black },
      2: { halign: "right" as const },
      3: { halign: "right" as const, textColor: C.accentDeep, fontStyle: "bold" },
      4: { halign: "center" as const, fontStyle: "bold" }
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.cell.section === "body") {
        const txt = String(data.cell.raw);
        if (txt === "HOT") data.cell.styles.textColor = C.black;
        else if (txt === "NAIK") data.cell.styles.textColor = C.positive;
        else if (txt === "TURUN") data.cell.styles.textColor = C.negative;
        else data.cell.styles.textColor = C.muted;
      }
    }
  });

  // SECTION 02 — DETAILED KEYWORD TABLE
  dividerPages.add(drawSectionDivider(
    doc, "02",
    "Detailed Hashtag", "Breakdown",
    `Top hashtag lists including distinct video count, uses, average views, and engagement metrics in the ${category} category.`
  ));
  recordSection("02 · Hashtags");

  doc.addPage();
  recordSection("02 · Hashtags");
  y = MARGIN.top + 12;
  y = drawSectionTitle(
    doc, y, "02",
    "Detailed Hashtag", "Breakdown",
    "Complete listings of hashtags with view counts and engagement rates"
  );

  y = drawSubsectionTitle(doc, y, "Hashtag Analysis Details", "Detailed performance database");

  const tableRows = tags.slice(0, 50).map((tag, idx) => [
    `#${idx + 1}`,
    tag.tag,
    fmtNum(tag.uses),
    fmtPercent(tag.weekGrowth),
    fmtNum(tag.avgViews),
    String(tag.videoCount),
    fmtPercent(tag.engagement),
    tag.trend.toUpperCase(),
  ]);

  autoTable(doc, {
    ...refinedTableConfig(y),
    head: [["Rank", "Hashtag", "Uses", "Growth", "Avg Views", "Videos", "Engagement", "Trend"]],
    body: tableRows,
    columnStyles: {
      0: { fontStyle: "bold", textColor: C.accentDeep, cellWidth: 12 },
      1: { fontStyle: "bold", textColor: C.black },
      2: { halign: "right" as const },
      3: { halign: "right" as const },
      4: { halign: "right" as const },
      5: { halign: "right" as const },
      6: { halign: "right" as const, fontStyle: "bold", textColor: C.black },
      7: { halign: "center" as const, fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.column.index === 7 && data.cell.section === "body") {
        const txt = String(data.cell.raw);
        if (txt === "HOT") data.cell.styles.textColor = C.black;
        else if (txt === "NAIK") data.cell.styles.textColor = C.positive;
        else if (txt === "TURUN") data.cell.styles.textColor = C.negative;
        else data.cell.styles.textColor = C.muted;
      }
    },
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    if (i === 1) continue;

    const isDivider = dividerPages.has(i);
    const secTitle = sectionMap.get(i) || "Report Page";

    if (isDivider) {
      drawDividerFooter(doc, i, totalPages, secTitle);
    } else {
      drawPageHeader(doc);
      drawPageFooter(doc, i, totalPages, secTitle);
    }
  }

  doc.save(`TikTokBI_Hashtag_Analytics_${category.replace(/\s+/g, "_")}.pdf`);
}
